import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useUserStore } from '../store/userStore'; 

export default function DriverDetails() {
  const router = useRouter();
  const setMode = useUserStore((state) => state.setMode); 
  const { email, phoneNumber } = useLocalSearchParams(); 

  
  const { user } = useUserStore();
  const userID = user?.userid;

  const [vehicleName, setCar] = useState('');
  const [vehicleColor, setColor] = useState('');
  const [modelYear, setModelYear] = useState('');
  const [vehicleNumber, setLicenseNumber] = useState('');
  const [vehicleAverage, setMileage] = useState('');

  const handleSubmit = async () => {
    if (!vehicleName || !vehicleColor || !modelYear || !vehicleNumber || !vehicleAverage) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    if (!userID) {
      Alert.alert('Error', 'User ID not found. Please log in again.');
      return;
    }

    const driverData = {
      email,
      phoneNumber,
      userID, 
      vehicleName,
      vehicleColor,
      modelYear,
      vehicleNumber,
      vehicleAverage,
    };

    try {
      const token = await SecureStore.getItemAsync('userToken');
      if (!token) {
        throw new Error('No token found. Please log in again.');
      }

      const response = await fetch('http://10.0.2.2:9000/driver/registerVehicle', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          'X-Platform': 'mobile',
        },
        body: JSON.stringify(driverData),
      });

      const result = await response.json();
      if (response.ok) {
        Alert.alert('Success', 'Details submitted successfully!');
        // If needed, set the mode to "driver" using Zustand
        setMode && setMode('driver');
        router.push({
          pathname: '/vehicle-picture',
          params: { email, phoneNumber }, // Passing login params forward
        });
      } else {
        Alert.alert('Error', result.message || 'Something went wrong');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to submit data');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push('/driver-or-passenger')}>
          <Ionicons name="arrow-back" size={24} color="#00308F" />
        </TouchableOpacity>
        <Text style={styles.header}>Enter Driver Details</Text>
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Car</Text>
        <TextInput style={styles.input} value={vehicleName} onChangeText={setCar} placeholder="Enter car name" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Color</Text>
        <TextInput style={styles.input} value={vehicleColor} onChangeText={setColor} placeholder="Enter car color" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Model Year</Text>
        <TextInput style={styles.input} value={modelYear} onChangeText={setModelYear} placeholder="Enter model year" keyboardType="numeric" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>License Number</Text>
        <TextInput style={styles.input} value={vehicleNumber} onChangeText={setLicenseNumber} placeholder="Enter license number" />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mileage</Text>
        <TextInput style={styles.input} value={vehicleAverage} onChangeText={setMileage} placeholder="Enter mileage" keyboardType="numeric" />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 20 },
  headerContainer: { width: '90%', flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  header: { fontFamily: 'Manrope-SemiBold', fontSize: 24, color: '#00308F', marginLeft: 10 },
  inputContainer: { width: '90%', marginBottom: 9 },
  label: { fontFamily: 'Manrope-SemiBold', fontSize: 13, color: '#00308F', marginBottom: 10, marginLeft: 5 },
  input: { width: '100%', height: 33, borderColor: '#999ea1', borderWidth: 1, borderRadius: 8, paddingLeft: 11, color: '#00308F', backgroundColor: '#FFFFFF' },
  button: { width: '90%', backgroundColor: '#00308F', paddingVertical: 8, borderRadius: 10, alignItems: 'center', marginTop: 17, marginBottom: 175 },
  buttonText: { fontFamily: 'Manrope-SemiBold', fontSize: 15, color: '#FFFFFF' },
});
