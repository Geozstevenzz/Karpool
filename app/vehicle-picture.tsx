// screens/vehicle-picture.tsx
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
import { useRouter, useLocalSearchParams } from 'expo-router';

export default function VehiclePicture() {
  const router = useRouter();
  const params = useLocalSearchParams(); // Receive parameters from previous screen
  const [vehicleImage, setVehicleImage] = useState<string | null>(null);

  const requestPermissions = async () => {
    const mediaPermissionResult = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!mediaPermissionResult.granted) {
      Alert.alert(
        'Permission required',
        'We need permission to access your media library.'
      );
      return false;
    }

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

  const handleSaveVehiclePicture = () => {
    if (!vehicleImage) {
      Alert.alert('No image selected', 'Please pick or take a photo first.');
      return;
    }

    console.log('Vehicle picture saved:', vehicleImage);

    router.push({
      pathname: '/driver-and-passenger-home',
      params: { ...params, vehicleImage }, // Pass received and new params
    });
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

      <TouchableOpacity style={styles.backLink} onPress={() => router.back()}>
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
    fontFamily: 'Manrope-Regular',
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
