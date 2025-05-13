import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  BackHandler,
  Platform,
  Dimensions,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import * as SecureStore from 'expo-secure-store';
import { useUserStore } from '../store/userStore';
import { useVehicleStore } from '../store/vehicleStore';

const isWeb = Platform.OS === 'web';
const { width } = Dimensions.get('window');

export default function Login() {
  const router = useRouter();
  const { setUser } = useUserStore();
  const setVehicleID = useVehicleStore((state) => state.setVehicleID);

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);

  const BASE_URL =
    Platform.OS === 'android'
      ? 'http://10.0.2.2:9000'
      : 'http://localhost:9000';

  useEffect(() => {
    const backAction = () => {
      router.replace('/');
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const handleLogin = async () => {
    try {
      const response = await fetch(`${BASE_URL}/user/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email,
          password,
          platform: Platform.OS,
        }),
      });

      if (!response.ok) {
        throw new Error('Invalid or Missing credentials');
      }

      const data = await response.json();
      console.log('Login successful:', data);

      if (Platform.OS !== 'web') {
        await SecureStore.setItemAsync('userToken', String(data.token));
      }

      setUser(data.user);

      if (data.user.vehicleid) {
        setVehicleID(data.user.vehicleid);
      }

      router.replace('/driver-and-passenger-home');
    } catch (error) {
      console.error('Error during login:', error);
      Alert.alert('Login Error', error.message);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.replace('/')}>
          <Ionicons name="arrow-back" size={24} color="#00308F" />
        </TouchableOpacity>
        <Text style={styles.header}>Hi, Welcome Back!</Text>
      </View>

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

      <View style={styles.rememberMeContainer}>
        <TouchableOpacity
          onPress={() => setRememberMe(!rememberMe)}
          style={styles.checkboxContainer}
        >
          <View style={styles.checkbox}>
            {rememberMe && <Ionicons name="checkmark" size={14} color="white" />}
          </View>
          <Text style={styles.rememberMeText}>Remember Me</Text>
        </TouchableOpacity>

        <TouchableOpacity onPress={() => router.push('/forgot-password')}>
          <Text style={styles.forgotPasswordText}>Forgot Password?</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <View style={styles.dividerContainer}>
        <View style={styles.line} />
        <Text style={styles.orText}>Or</Text>
        <View style={styles.line} />
      </View>

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

      <View style={styles.signupContainer}>
        <Text style={styles.signupText}>Don't have an account? </Text>
        <TouchableOpacity onPress={() => router.replace('/signup')}>
          <Text style={styles.signupLink}>Sign Up</Text>
        </TouchableOpacity>
      </View>
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
    paddingTop:  0,
  },
  headerContainer: {
    width: '90%',
    alignItems: 'flex-start',
    marginBottom: 20,
    flexDirection: 'row',
    alignItems: 'center',
    right:isWeb?-200:0
  },
  header: {
    fontSize: isWeb ? 32 : 24,
    color: '#00308F',
    marginLeft: 10,
    fontWeight: 'bold',
  },
  inputContainer: {
    width: '90%',
    marginBottom: 15,
    right:isWeb?-200:0
  },
  label: {
    fontSize: 13,
    color: '#00308F',
    marginBottom: 3,
    marginLeft: 5,
  },
  input: {
    width: isWeb? '80%':'100%',
    height: isWeb ? 40 : 33,
    borderColor: '#999ea1',
    borderWidth: 1,
    borderRadius: 8,
    paddingLeft: isWeb?11:11,
    color: '#00308F',
    backgroundColor: '#FFFFFF',
    textAlign: 'left',
    fontSize: isWeb ? 16 : 14,
    
  },
  rememberMeContainer: {
    width: '90%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginVertical: 10,
    right:isWeb?140:0
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
    right:isWeb?-340:0
  },
  rememberMeText: {
    fontSize: 13,
    color: '#00308F',
    right:isWeb?-340:0
  },
  forgotPasswordText: {
    fontSize: 13,
    color: '#FB344F',
  },
  button: {
    width: isWeb ? 300 : '90%',
    backgroundColor: '#00308F',
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 17,
  },
  buttonText: {
    fontSize: 16,
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
