import { useFocusEffect } from '@react-navigation/native';
import React, { useCallback, useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, BackHandler } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function OtpPage() {
  const router = useRouter();
  const { email, phone } = useLocalSearchParams();

  const [otp, setOtp] = useState('');

  useFocusEffect(
    useCallback(() => {
      const backHandler = BackHandler.addEventListener('hardwareBackPress', () => true);
      return () => backHandler.remove();
    }, [])
  );

  const handleVerifyOtp = async () => {
    try {
      const response = await fetch('http://10.0.2.2:9000/user/validateOtp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email,
          phone,
          otp,
        }),
      });

      if (!response.ok) {
        throw new Error('OTP verification failed.');
      }
      Alert.alert('Signup Successful', 'Your account has been created!');
      router.replace('/profile-picture');
    } catch (error) {
      console.error('Error verifying OTP:', error);
      Alert.alert('Error', 'Could not verify OTP.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.header}>Verify your number</Text>
      </View>

      <Text style={styles.instructionText}>
        Enter the OTP sent to {email}
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
          maxLength={6}
        />
      </View>

      <TouchableOpacity style={styles.button} onPress={handleVerifyOtp}>
        <Text style={styles.buttonText}>Verify OTP</Text>
      </TouchableOpacity>

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
    
    fontSize: 24,
    color: '#00308F',
    marginLeft: 10,
  },
  instructionText: {
    width: '90%',
    
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
    
    fontSize: 15,
    color: '#FFFFFF',
  },
  resendContainer: {
    flexDirection: 'row',
    marginTop: 17,
  },
  resendText: {
   
    fontSize: 13,
    color: '#999ea1',
  },
  resendLink: {
    
    fontSize: 13,
    color: '#00308f',
    textDecorationLine: 'underline',
  },
});
