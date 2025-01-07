// screens/driver-details.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the back button

export default function DriverDetails() {
  const router = useRouter();

  const [car, setCar] = useState('');
  const [color, setColor] = useState('');
  const [modelYear, setModelYear] = useState('');
  const [licenseNumber, setLicenseNumber] = useState('');
  const [mileage, setMileage] = useState('');

  const handleSubmit = () => {
    console.log('Driver Details Submitted:', { car, color, modelYear, licenseNumber, mileage });
    router.push('/index1'); // Navigate to passenger-home.tsx
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Back button to driver-or-passenger.tsx */}
        <TouchableOpacity onPress={() => router.push('/driver-or-passenger')}>
          <Ionicons name="arrow-back" size={24} color="#00308F" />
        </TouchableOpacity>
        <Text style={styles.header}>Enter Driver Details</Text>
      </View>

      {/* Input Fields with Labels */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Car</Text>
        <TextInput
          style={styles.input}
          value={car}
          onChangeText={setCar}
          placeholder="Enter car name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Color</Text>
        <TextInput
          style={styles.input}
          value={color}
          onChangeText={setColor}
          placeholder="Enter car color"
        />
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
          value={licenseNumber}
          onChangeText={setLicenseNumber}
          placeholder="Enter license number"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Mileage</Text>
        <TextInput
          style={styles.input}
          value={mileage}
          onChangeText={setMileage}
          placeholder="Enter mileage"
          keyboardType="numeric"
        />
      </View>

      {/* Submit Button */}
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Submit</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
  },
  headerContainer: {
    width: '90%',
    alignItems: 'flex-start',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
  },
  header: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 24,
    color: '#00308F',
    marginLeft: 10,
  },
  inputContainer: {
    width: '90%',
    marginBottom: 9,
  },
  label: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 13,
    color: '#00308F',
    marginBottom: 10,
    marginLeft: 5,
  },
  input: {
    width: '100%',
    height: 33,
    borderColor: '#999ea1',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: 11,
    color: '#00308F',
    backgroundColor: '#FFFFFF',
    textAlign: 'left',
  },
  button: {
    width: '90%',
    backgroundColor: '#00308F',
    paddingVertical: 8,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 17,
    marginBottom: 175
  },
  buttonText: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
});
