import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useUserStore } from '../store/userStore'; 

export default function Login() {
  const router = useRouter();
  const { setUser } = useUserStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const handleLogin = async () => {
    console.log('Login button pressed', { email, password, rememberMe });

    try {
      const response = await fetch('http://10.0.2.2:9000/user/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          platform: 'mobile',
        }),
      });

      if (!response.ok) {
        throw new Error('Login request failed.');
      }

      const data = await response.json();
      console.log('Login successful:', data);

      
      await SecureStore.setItemAsync('userToken', data.token);

      setUser(data.user);
      console.log("This is user: ",data.user);

      // Navigate to the next screen
      router.push('/driver-and-passenger-home');
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.push('/')}>
          <Ionicons name="arrow-back" size={24} color="#00308F" />
        </TouchableOpacity>
        <Text style={styles.header}>Hi, Welcome Back!</Text>
      </View>

      {/* Email Input */}
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

      {/* Password Input */}
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

      {/* Remember Me & Forgot Password */}
      <View style={styles.rememberMeContainer}>
        <TouchableOpacity
          onPress={() => setRememberMe(!rememberMe)}
          style={styles.checkboxContainer}
        >
          <View style={styles.checkbox}>
            {rememberMe && <Ionicons name="checkmark" size={14} color="white" />}
          </View>
          <Text style={styles.rememberMeText}>Remember me</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/forgot-password')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      {/* Login Button */}
      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      {/* Divider with "Or" */}
      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or</Text>
        <View style={styles.line} />
      </View>

      {/* Continue with Google */}
      <TouchableOpacity style={[styles.button, styles.googleButton]}>
        <View style={styles.googleButtonContent}>
          <Image
            source={require('@/assets/images/google-logo.webp')}
            style={styles.googleLogo}
          />
          <Text style={[styles.buttonText, styles.googleButtonText]}>
            Continue with Google
          </Text>
        </View>
      </TouchableOpacity>

      {/* Signup Link */}
      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.push('/signup')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

/* -- STYLES -- */
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
  rememberMeContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    borderColor: '#00308F',
    borderWidth: 1,
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 8,
  },
  rememberMeText: {
    
    fontSize: 13,
    color: '#00308F',
  },
  forgotPasswordText: {
    
    fontSize: 13,
    color: '#FB344F',
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
    
    fontSize: 13,
    color: '#00308F',
    marginHorizontal: 11,
  },
  googleButton: {
    backgroundColor: '#FFFFFF',
    borderColor: '#00308f',
    borderWidth: 1,
    marginTop: 9,
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
  googleButtonText: {
    color: '#000000',
  },
  signupContainer: {
    flexDirection: 'row',
    marginTop: 17,
  },
  signupText: {
    
    fontSize: 13,
    color: '#999ea1',
  },
  signupLink: {
    
    fontSize: 13,
    color: '#00308f',
    textDecorationLine: 'underline',
  },
});
