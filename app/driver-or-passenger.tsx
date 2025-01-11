// screens/driver-or-passenger.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function DriverOrPassenger() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Are you a Passenger or a Driver?</Text>

      {/* Back Button (Arrow) */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => router.push('/otp-page')}
      >
        <Ionicons name="arrow-back" size={30} color="#00308F" />
      </TouchableOpacity>

      {/* Passenger Box */}
      <TouchableOpacity
        style={styles.box}
        onPress={() => router.push('/passenger-home')}
      >
        <Image
          source={require('@/assets/images/passenger.png')}
          style={styles.icon}
        />
        <Text style={styles.boxText}>Passenger</Text>
      </TouchableOpacity>

      {/* Driver Box */}
      <TouchableOpacity
        style={styles.box}
        onPress={() => router.push('/driver-details')}
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
    fontFamily: 'Manrope-SemiBold',
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
    fontFamily: 'Manrope-SemiBold',
    fontSize: 18,
    color: '#00308F',
    marginTop: 10,
  },
  icon: {
    width: 50,
    height: 50,
  },
});
