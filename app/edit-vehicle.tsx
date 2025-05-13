import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useUserStore } from '../store/userStore';
import { useVehicleStore } from '../store/vehicleStore';

export default function EditVehicle() {
  const router = useRouter();
  const { email, phoneNumber } = useLocalSearchParams();

  const user = useUserStore((state) => state.user);
  const userID = user?.userid;
  const vehicleID = useVehicleStore((state) => state.vehicleID);

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

    if (!userID || !vehicleID) {
      Alert.alert('Error', 'Required IDs not found. Please log in again.');
      return;
    }

    const vehicleData = {
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
      if (!token) throw new Error('No token found. Please log in again.');

      const response = await fetch(`http://10.0.2.2:9000/driver/vehicle/${vehicleID}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Platform': 'mobile',
        },
        body: JSON.stringify(vehicleData),
      });

      const result = await response.json();

      if (response.ok) {
        Alert.alert('Success', 'Vehicle details updated successfully!');
        router.back();
      } else {
        Alert.alert('Error', result.message || 'Something went wrong');
      }
    } catch (error) {
      console.error(error);
      Alert.alert('Error', 'Failed to update vehicle');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#00308F" />
        </TouchableOpacity>
        <Text style={styles.header}>Edit Vehicle Details</Text>
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
        <TextInput
          style={styles.input}
          value={modelYear}
          onChangeText={setModelYear}
          placeholder="Enter model year"
          keyboardType="numeric"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>License Number</Text>
        <TextInput
          style={styles.input}
          value={vehicleNumber}
          onChangeText={setLicenseNumber}
          placeholder="Enter license number"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mileage</Text>
        <TextInput
          style={styles.input}
          value={vehicleAverage}
          onChangeText={setMileage}
          placeholder="Enter mileage"
          keyboardType="numeric"
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Update Vehicle</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'flex-end', alignItems: 'center', backgroundColor: '#FFFFFF', paddingHorizontal: 20 },
  headerContainer: { width: '90%', flexDirection: 'row', alignItems: 'center', marginBottom: 20 },
  header: { fontSize: 24, color: '#00308F', marginLeft: 10 },
  inputContainer: { width: '90%', marginBottom: 9 },
  label: { fontSize: 13, color: '#00308F', marginBottom: 10, marginLeft: 5 },
  input: {
    width: '100%',
    height: 33,
    borderColor: '#999ea1',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 11,
    color: '#00308F',
    backgroundColor: '#FFFFFF',
  },
  button: {
    width: '90%',
    backgroundColor: '#00308F',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 17,
    marginBottom: 175,
  },
  buttonText: { fontSize: 15, color: '#FFFFFF' },
});
