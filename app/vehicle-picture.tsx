import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Alert,
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useRouter, useLocalSearchParams } from 'expo-router';
import * as SecureStore from 'expo-secure-store';
import { useVehicleStore } from '../store/vehicleStore';

export default function VehiclePicture() {
  const router = useRouter();
  let vehicleId = useVehicleStore();
  vehicleId = vehicleId?.vehicleID;
  console.log("Vehicle ID:",vehicleId);
  const [vehicleImage, setVehicleImage] = useState<string | null>(null);
  const [userToken, setUserToken] = useState<string | null>(null);

  // Retrieve user token on mount
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
        console.error('Error retrieving token from SecureStore:', error);
      }
    };
    getToken();
  }, []);

  const requestPermissions = async () => {
    const mediaPermissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!mediaPermissionResult.granted) {
      Alert.alert('Permission required', 'We need permission to access your media library.');
      return false;
    }

    const cameraPermissionResult = await ImagePicker.requestCameraPermissionsAsync();
    if (!cameraPermissionResult.granted) {
      Alert.alert('Permission required', 'We need permission to access your camera.');
      return false;
    }
    return true;
  };

  const pickVehicleFromLibrary = async () => {
    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setVehicleImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error picking image from library:', error);
    }
  };

  const takeVehiclePhoto = async () => {
    try {
      const hasPermissions = await requestPermissions();
      if (!hasPermissions) return;

      const result = await ImagePicker.launchCameraAsync({
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setVehicleImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log('Error taking photo:', error);
    }
  };

  const handleSaveVehiclePicture = async () => {
    if (!vehicleImage) {
      Alert.alert('No image selected', 'Please pick or take a photo first.');
      return;
    }
    if (!userToken) {
      Alert.alert('No token found', 'Please log in again.');
      return;
    }

    try {
      // Prepare FormData
      const formData = new FormData();
      formData.append('vehicle_picture', {
        uri: vehicleImage,
        type: 'image/jpeg', // or 'image/png'
        name: 'vehicle.jpg',
      } as any);

       formData.append('vehicleId', vehicleId);

      // Make POST request
      const response = await fetch('http://10.0.2.2:9000/driver/vehicle/photo/upload', {
        method: 'POST',
        headers: {
          // Let fetch set Content-Type for multipart automatically
          'Authorization': `Bearer ${userToken}`,
          'X-Platform': 'mobile',
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`Server returned status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Vehicle picture upload success:', data);

      Alert.alert('Success', 'Vehicle picture uploaded successfully!');
      // Navigate back or wherever you want
      router.back();
    } catch (error) {
      console.error('Error uploading vehicle picture:', error);
      Alert.alert('Error', 'Could not upload vehicle picture. Please try again.');
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Vehicle Picture</Text>

      {vehicleImage ? (
        <Image source={{ uri: vehicleImage }} style={styles.imagePreview} />
      ) : (
        <View style={styles.placeholderContainer}>
          <Text style={styles.placeholderText}>No Image Selected</Text>
        </View>
      )}

      <TouchableOpacity style={styles.button} onPress={pickVehicleFromLibrary}>
        <Text style={styles.buttonText}>Pick from Library</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button} onPress={takeVehiclePhoto}>
        <Text style={styles.buttonText}>Take a Photo</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, { backgroundColor: '#2ea043' }]}
        onPress={handleSaveVehiclePicture}
      >
        <Text style={styles.buttonText}>Save Vehicle Picture</Text>
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
    width: 250,
    height: 187,
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
    width: 250,
    height: 187,
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
