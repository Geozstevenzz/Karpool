import React, { useCallback, useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
  BackHandler,
} from 'react-native';
//import * as ImagePicker from 'expo-image-picker';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useUserStore } from '../store/userStore';

export default function ProfilePicture() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);

  const { user } = useUserStore();

  const userId = user?.userid;
  console.log(userId);

  // Prevent hardware back button on Android
  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => backHandler.remove();
    }, [])
  );

  // Retrieve token from SecureStore on mount
  useEffect(() => {
    const getToken = async () => {
      try {
        const token = await SecureStore.getItemAsync('userToken');
        if (token) {
          setUserToken(token);
        } else {
          Alert.alert('No Token Found', 'Please log in again.');
        }
      } catch (error) {
        console.error('Error retrieving token:', error);
      }
    };
    getToken();
  }, []);

  const requestPermissions = async () => {
    // Request permission to access photos
    const mediaPermissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!mediaPermissionResult.granted) {
      Alert.alert('Permission required', 'We need permission to access your camera roll.');
      return false;
    }
    // Request permission to use camera
    const cameraPermissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPermissionResult.granted) {
      Alert.alert('Permission required', 'We need permission to access your camera.');
      return false;
    }
    return true;
  };

  const pickImageFromLibrary = async () => {
    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image: ', error);
    }
  };

  const takePhotoWithCamera = async () => {
    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [1, 1],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setSelectedImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error taking photo: ', error);
    }
  };

  const handleSaveProfilePicture = async () => {
    if (!selectedImage) {
      Alert.alert('No image selected', 'Please pick or take a photo first.');
      return;
    }
    if (!userToken) {
      Alert.alert('No Token', 'Cannot upload without a valid token. Please log in again.');
      return;
    }

    try {
      // Prepare the file for multipart/form-data
      const formData = new FormData();
      formData.append('profile_picture', {
        uri: selectedImage,
        type: 'image/jpeg', // or 'image/png'
        name: 'profile.jpg',
      });

      formData.append('userId', userId);

      // Make the POST request
      const response = await fetch('http://10.0.2.2:9000/user/profile/photo/upload', {
        method: 'POST',
        headers: {
          // 'Content-Type': 'multipart/form-data' // usually omitted, let fetch handle it
          Authorization: `Bearer ${userToken}`,
          'X-Platform': 'mobile',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Upload success:', data);
      Alert.alert('Success', 'Profile picture uploaded!');

      // Navigate away after success
      router.replace('/login');
    } catch (error) {
      console.error('Error uploading profile picture:', error);
      Alert.alert('Error', 'Could not upload profile picture. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Profile Picture</Text>

      {selectedImage ? (
        <Image source={{ uri: selectedImage }} style={styles.imagePreview} />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>No Image Selected</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={pickImageFromLibrary}>
        <Text style={styles.buttonText}>Pick from Library</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={takePhotoWithCamera}>
        <Text style={styles.buttonText}>Take a Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#2ea043' }]}
        onPress={handleSaveProfilePicture}
      >
        <Text style={styles.buttonText}>Save Profile Picture</Text>
      </TouchableOpacity>
    </View>
  );
}

// Styles
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 22,
    color: '#00308F',
    marginBottom: 20,
  },
  placeholderContainer: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 1,
    borderColor: '#999ea1',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  placeholderText: {
    fontSize: 14,
    color: '#999ea1',
  },
  imagePreview: {
    width: 200,
    height: 200,
    borderRadius: 100,
    marginBottom: 20,
    resizeMode: 'cover',
  },
  button: {
    width: '90%',
    backgroundColor: '#00308F',
    paddingVertical: 10,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 12,
  },
  buttonText: {
    color: '#fff',
    fontSize: 15,
  },
});
