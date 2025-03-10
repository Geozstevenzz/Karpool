// screens/reset-password.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the back button

export default function ResetPassword() {
  const router = useRouter();
  const [authToken, setAuthToken] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  const handleResetPassword = () => {
    if (newPassword !== confirmPassword) {
      setErrorMessage('Passwords do not match.');
      return;
    }
    setErrorMessage('');
    console.log('Password reset successfully:', { authToken, newPassword });
    // Implement API call for password reset here
    router.push('/login'); // Redirect to login page after successful reset
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Back button to forgot-password.tsx */}
        <TouchableOpacity onPress={() => router.push('/forgot-password')}>
          <Ionicons name="arrow-back" size={24} color="#00308F" />
        </TouchableOpacity>
        <Text style={styles.header}>Reset Password</Text>
      </View>

      {/* Authentication Token Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Auth Token</Text>
        <TextInput
          style={styles.input}
          value={authToken}
          onChangeText={setAuthToken}
          placeholder="Enter Auth Token"
        />
      </View>

      {/* New Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>New Password</Text>
        <TextInput
          style={styles.input}
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="Enter New Password"
          secureTextEntry={true}
        />
      </View>

      {/* Confirm Password Input */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          placeholder="Confirm New Password"
          secureTextEntry={true}
        />
      </View>

      {/* Error Message */}
      {errorMessage ? <Text style={styles.errorText}>{errorMessage}</Text> : null}

      {/* Reset Password Button */}
      <TouchableOpacity style={styles.button} onPress={handleResetPassword}>
        <Text style={styles.buttonText}>Reset Password</Text>
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
    //alignItems: 'center',
  },
  header: {
    
    fontSize: 24,
    color: '#00308F',
    marginLeft: 10,
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
  errorText: {
    color: '#FF0000',
    
    fontSize: 13,
    marginBottom: 10,
  },
});
