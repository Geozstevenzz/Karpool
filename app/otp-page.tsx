// screens/otp-page.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OtpPage() {
  const router = useRouter();
  const [otp, setOtp] = useState('');

  const handleVerifyOtp = () => {
    console.log('OTP entered:', otp);
    // Implement OTP verification logic here
    // Navigate to driver-or-passenger.tsx after OTP is verified
    router.push('/driver-or-passenger');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Back button */}
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Ionicons name="arrow-back" size={24} color="#00308F" />
        </TouchableOpacity>
        <Text style={styles.header}>Verify your number</Text>
      </View>

      {/* Instruction Text */}
      <Text style={styles.instructionText}>
        Enter the OTP sent to +92 301 43242342
      </Text>

      {/* OTP Input Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>OTP</Text>
        <TextInput
          style={styles.input}
          value={otp}
          onChangeText={setOtp}
          keyboardType="numeric"
          placeholder="Enter OTP"
          maxLength={6} // assuming OTP is 6 digits
        />
      </View>

      {/* Verify OTP Button */}
      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>

      {/* Resend OTP Link */}
      <TouchableOpacity
        style={styles.resendContainer}
        onPress={() => console.log('Resend OTP')}
      >
        <Text style={styles.resendText}>Didn’t receive the code?</Text>
        <Text style={styles.resendLink}> Resend OTP</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
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
  instructionText: {
    width: '90%',
    fontFamily: 'Manrope-Regular',
    fontSize: 14,
    color: '#00308F',
    marginBottom: 20,
    textAlign: 'left',
  },
  inputContainer: {
    width: '90%',
    marginBottom: 15,
  },
  label: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 13,
    color: '#00308F',
    marginBottom: 3,
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
  },
  buttonText: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  resendContainer: {
    flexDirection: 'row',
    marginTop: 17,
  },
  resendText: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 13,
    color: '#999ea1',
  },
  resendLink: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 13,
    color: '#00308f',
    textDecorationLine: 'underline',
  },
});
