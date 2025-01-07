// screens/forgot-password.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState('');

  const handleResetPassword = () => {
    console.log('Password reset requested for:', email);
    // Optionally perform validation or API call here
    router.push('/reset-password'); // Navigate to reset-password page
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Back button */}
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Ionicons name="arrow-back" size={24} color="#00308F" />
        </TouchableOpacity>
        <Text style={styles.header}>Forgot Password</Text>
      </View>

      {/* Instruction Text */}
      <Text style={styles.instructionText}>
        Enter the email associated with your account and we’ll send you a reset link.
      </Text>

      {/* Email Input Field */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          placeholder="Enter your email"
          keyboardType="email-address"
        />
      </View>

      {/* Send Reset Link Button */}
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Send Reset Link</Text>
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
});
