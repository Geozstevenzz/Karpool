// screens/signup.tsx
import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons'; // Import Ionicons for the back button

export default function Signup() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleSignup = () => {
    console.log('Signup button pressed', { firstName, lastName, phoneNumber, email, address, password, confirmPassword });
    // Navigate to OTP page after signup
    router.push('/otp-page');
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        {/* Back button */}
        <TouchableOpacity onPress={() => router.push('/')}>
          <Ionicons name="arrow-back" size={24} color="#00308F" />
        </TouchableOpacity>
        <Text style={styles.header}>Create an account.</Text>
      </View>

      {/* Input Fields with Labels */}
      <View style={styles.inputContainer}>
        <Text style={styles.label}>First Name</Text>
        <TextInput
          style={styles.input}
          value={firstName}
          onChangeText={setFirstName}
          placeholder="Enter your first name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Last Name</Text>
        <TextInput
          style={styles.input}
          value={lastName}
          onChangeText={setLastName}
          placeholder="Enter your last name"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={phoneNumber}
          onChangeText={setPhoneNumber}
          keyboardType="phone-pad"
          placeholder="Enter your phone number"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Email</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={setEmail}
          keyboardType="email-address"
          placeholder="Enter your email"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={address}
          onChangeText={setAddress}
          placeholder="Enter your address"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          placeholder="Enter your password"
        />
      </View>

      <View style={styles.inputContainer}>
        <Text style={styles.label}>Confirm Password</Text>
        <TextInput
          style={styles.input}
          value={confirmPassword}
          onChangeText={setConfirmPassword}
          secureTextEntry
          placeholder="Confirm your password"
        />
      </View>

      {/* Signup Button */}
      <TouchableOpacity style={styles.button} onPress={handleSignup}>
        <Text style={styles.buttonText}>Signup</Text>
      </TouchableOpacity>

      {/* Divider with "Or" */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or</Text>
        <View style={styles.line} />
      </View>

      {/* Continue with Google Button */}
      <TouchableOpacity style={[styles.button, styles.googleButton]}>
        <View style={styles.googleButtonContent}>
          <Image
            source={require('@/assets/images/google-logo.webp')} // Import the Google logo
            style={styles.googleLogo}
          />
          <Text style={[styles.buttonText, styles.googleButtonText]}>Continue with Google</Text>
        </View>
      </TouchableOpacity>

      {/* Login Link */}
      <View style={styles.loginContainer}>
        <Text style={styles.loginText}>Already have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/login')}>
          <Text style={styles.loginLink}>Login</Text>
        </TouchableOpacity>
      </View>
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
    marginBottom: 15,
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
    marginBottom: 11,
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
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#00308f',
    borderWidth: 1,
    marginTop: 9,
    bottom: 10
  },
  googleButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  googleLogo: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 15,
    color: '#FFFFFF',
  },
  googleButtonText: {
    color: '#000000',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '90%',
    marginVertical: 17,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: '#D3D3D3',
  },
  orText: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 13,
    color: '#00308F',
    marginHorizontal: 11,
  },
  loginContainer: {
    flexDirection: 'row',
    marginTop: 17,
    bottom: 15,
  },
  loginText: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 13,
    color: '#999ea1',
  },
  loginLink: {
    fontFamily: 'Manrope-SemiBold',
    fontSize: 13,
    color: '#00308f',
    textDecorationLine: 'underline',
  },
});
