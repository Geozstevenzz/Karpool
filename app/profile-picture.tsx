
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter } from 'expo-router';

export default function ProfilePicture() {
  const router = useRouter();
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const requestPermissions = async () => {
    // Request permission for camera roll (iOS) or media library
    const mediaPermissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!mediaPermissionResult.granted) {
      Alert.alert(
        'Permission required',
        'We need permission to access your camera roll.'
      );
      return false;
    }

    // Request permission for camera
    const cameraPermissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPermissionResult.granted) {
      Alert.alert(
        'Permission required',
        'We need permission to access your camera.'
      );
      return false;
    }
    return true;
  };

  const pickImageFromLibrary = async () => {
    try {
      // Ensure we have permissions
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

  const handleSaveProfilePicture = () => {
    if (!selectedImage) {
      Alert.alert('No image selected', 'Please pick or take a photo first.');
      return;
    }
    
    console.log('Profile picture saved:', selectedImage);

    
    router.push('/driver-or-passenger');
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

      <TouchableOpacity
        style={styles.button}
        onPress={pickImageFromLibrary}
      >
        <Text style={styles.buttonText}>Pick from Library</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={takePhotoWithCamera}
      >
        <Text style={styles.buttonText}>Take a Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#2ea043' }]}
        onPress={handleSaveProfilePicture}
      >
        <Text style={styles.buttonText}>Save Profile Picture</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.backLink}
        onPress={() => router.back()}
      >
        <Text style={styles.backLinkText}>Go Back</Text>
      </TouchableOpacity>
    </View>
  );
}

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
    fontFamily: 'Manrope-SemiBold',
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
    fontFamily: 'Manrope-Regular',
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
    fontFamily: 'Manrope-SemiBold',
    fontSize: 15,
  },
  backLink: {
    marginTop: 20,
  },
  backLinkText: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 14,
    color: '#00308F',
    textDecorationLine: 'underline',
  },
});
