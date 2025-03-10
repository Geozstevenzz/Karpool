import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { useUserMode } from '../store/userModeStore'; // Import the userMode store

export default function DriverOrPassenger() {
  const router = useRouter();
  const { email, token } = useLocalSearchParams(); // Get params from the previous screen
  const setMode = useUserMode((state) => state.setMode); // Access the setMode function

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Are you a Passenger or a Driver?</Text>

      {/* Back Button (Arrow) */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push({ pathname: '/otp-page', params: { email, token } })}
      >
        <Ionicons name="arrow-back" size={30} color="#00308F" />
      </TouchableOpacity>

      {/* Passenger Box */}
      <TouchableOpacity
        style={styles.box}
        onPress={() => {
          setMode('passenger'); // Set mode to "passenger"
          router.push({ pathname: '/driver-and-passenger-home', params: { email, token } }); // Pass params
        }}
      >
        <Image
          source={require('@/assets/images/Passenger.png')}
          style={styles.icon}
        />
        <Text style={styles.boxText}>Passenger</Text>
      </TouchableOpacity>

      {/* Driver Box */}
      <TouchableOpacity
        style={styles.box}
        onPress={() => {
          setMode('driver'); // Set mode to "driver"
          router.push({ pathname: '/driver-details', params: { email, token } }); // Pass params
        }}
      >
        <Image
          source={require('@/assets/images/steering-wheel.png')}
          style={styles.icon}
        />
        <Text style={styles.boxText}>Driver</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 10,
  },
  header: {
    
    fontSize: 24,
    color: '#00308F',
    marginBottom: 40,
    textAlign: 'center',
  },
  backButton: {
    position: 'absolute',
    top: 40,
    left: 10,
    padding: 10,
  },
  box: {
    width: '80%',
    paddingVertical: 20,
    backgroundColor: '#F7F9FC',
    borderRadius: 10,
    borderColor: '#00308F',
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 1,
  },
  boxText: {
   
    fontSize: 18,
    color: '#00308F',
    marginTop: 10,
  },
  icon: {
    width: 50,
    height: 50,
  },
});
