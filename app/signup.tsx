import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  Platform,
  BackHandler,
  ScrollView,
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Picker } from '@react-native-picker/picker';
import { useUserStore } from '../store/userStore';

const isWeb = Platform.OS === 'web';

export default function Signup() {
  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [gender, setGender] = useState('');
  const [email, setEmail] = useState('');
  const [address, setAddress] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [userInterests, setUserInterests] = useState([]);
  const [showInterestDropdown, setShowInterestDropdown] = useState(false);

  const interestOptions = [
    'Sports', 'Cricket', 'Literature', 'Fashion', 'Clothing',
    'Poetry', 'Vehicles', 'Travel', 'Politics', 'Science'
  ];

  const { setUser } = useUserStore();

  useEffect(() => {
    const backAction = () => {
      router.replace('/');
      return true;
    };
    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, []);

  const handleSignup = async () => {
    if (password !== confirmPassword) {
      Alert.alert('Error', 'Passwords do not match!');
      return;
    }

    const name = `${firstName} ${lastName}`;

    try {
      const response = await fetch('http://10.0.2.2:9000/user/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name,
          email,
          password,
          phone: phoneNumber,
          address,
          gender,
          userInterests,
        }),
      });

      if (!response.ok) {
        Alert.alert('Signup Failed', 'Something went wrong during signup.');
      } else {
        const data = await response.json();
        setUser(data.user);
        router.replace({
          pathname: '/otp-page',
          params: { email: email, phone: phoneNumber },
        });
      }
    } catch (error) {
      console.error('Error during signup:', error);
      Alert.alert('Error', 'An error occurred while signing up.');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <TouchableOpacity onPress={() => router.replace('/')}> 
          <Ionicons name="arrow-back" size={24} color="#00308F" />
        </TouchableOpacity>
        <Text style={styles.header}>Create an account.</Text>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContainer} keyboardShouldPersistTaps="handled">
        <View style={styles.inputContainer}><Text style={styles.label}>First Name</Text><TextInput style={styles.input} value={firstName} onChangeText={setFirstName} placeholder="Enter your first name" /></View>
        <View style={styles.inputContainer}><Text style={styles.label}>Last Name</Text><TextInput style={styles.input} value={lastName} onChangeText={setLastName} placeholder="Enter your last name" /></View>
        <View style={styles.inputContainer}><Text style={styles.label}>Gender</Text><View style={styles.pickerContainer}><Picker selectedValue={gender} onValueChange={setGender} style={styles.picker}><Picker.Item label="Select Gender" value="" /><Picker.Item label="Male" value="Male" /><Picker.Item label="Female" value="Female" /></Picker></View></View>
        <View style={styles.inputContainer}><Text style={styles.label}>Phone Number</Text><TextInput style={styles.input} value={phoneNumber} onChangeText={setPhoneNumber} keyboardType="phone-pad" placeholder="Enter your phone number" /></View>
        <View style={styles.inputContainer}><Text style={styles.label}>Email</Text><TextInput style={styles.input} value={email} onChangeText={setEmail} keyboardType="email-address" placeholder="Enter your email" /></View>
        <View style={styles.inputContainer}><Text style={styles.label}>Address</Text><TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="Enter your address" /></View>
        <View style={styles.inputContainer}><Text style={styles.label}>Password</Text><TextInput style={styles.input} value={password} onChangeText={setPassword} secureTextEntry placeholder="Enter your password" /></View>
        <View style={styles.inputContainer}><Text style={styles.label}>Confirm Password</Text><TextInput style={styles.input} value={confirmPassword} onChangeText={setConfirmPassword} secureTextEntry placeholder="Confirm your password" /></View>

        <View style={[styles.inputContainer, { zIndex: 20 }]}> 
          <Text style={styles.label}>User Interests</Text>
          <TouchableOpacity style={styles.interestBox} onPress={() => setShowInterestDropdown(!showInterestDropdown)}>
            <Text style={{ color: '#00308F' }}>{userInterests.length === 0 ? 'Select Interests' : ''}</Text>
            <View style={styles.selectedTagsContainer}>
              {userInterests.map((interest, idx) => (
                <View key={idx} style={styles.tag}>
                  <Text style={styles.tagText}>{interest}</Text>
                  <TouchableOpacity onPress={() => setUserInterests(userInterests.filter(i => i !== interest))}>
                    <Text style={styles.removeTag}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </TouchableOpacity>

          {showInterestDropdown && (
            <View style={styles.dropdownWrapperContainer}>
              <ScrollView style={styles.dropdown} nestedScrollEnabled>
                {interestOptions.map((interest, idx) => {
                  const alreadySelected = userInterests.includes(interest);
                  return (
                    <TouchableOpacity
                      key={idx}
                      disabled={alreadySelected || userInterests.length >= 5}
                      style={[styles.dropdownItem, alreadySelected && { opacity: 0.4 }]}
                      onPress={() => {
                        if (!alreadySelected && userInterests.length < 5) {
                          setUserInterests([...userInterests, interest]);
                          setShowInterestDropdown(false);
                        }
                      }}>
                      <Text style={{ color: '#00308F' }}>{interest}</Text>
                    </TouchableOpacity>
                  );
                })}
              </ScrollView>
            </View>
          )}
        </View>

        <TouchableOpacity style={styles.button} onPress={handleSignup}>
          <Text style={styles.buttonText}>Signup</Text>
        </TouchableOpacity>

        <View style={styles.dividerContainer}>
          <View style={styles.line} /><Text style={styles.orText}>Or</Text><View style={styles.line} />
        </View>

        <TouchableOpacity style={[styles.button, styles.googleButton]}>
          <View style={styles.googleButtonContent}>
            <Image source={require('@/assets/images/google-logo.webp')} style={styles.googleLogo} />
            <Text style={[styles.buttonText, styles.googleButtonText]}>Continue with Google</Text>
          </View>
        </TouchableOpacity>

        <View style={styles.loginContainer}>
          <Text style={styles.loginText}>Already have an account? </Text>
          <TouchableOpacity onPress={() => router.replace('/login')}>
            <Text style={styles.loginLink}>Login</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFFFFF', paddingHorizontal: 20 },
  scrollContainer: { alignItems: 'center', paddingBottom: 50, paddingTop: 10 },
  headerContainer: { width: '90%', alignItems: 'flex-start', marginTop: 50, marginBottom: 15, flexDirection: 'row', right:isWeb?-200:0 },
  header: { fontSize: 24, color: '#00308F', marginLeft: 10 },
  inputContainer: { width: '90%', marginBottom: 11, right:isWeb?-200:0 },
  label: { fontSize: 13, color: '#00308F', marginBottom: 3, marginLeft: 5 },
  input: { width: isWeb? '80%':'100%', height: isWeb ? 40 : 33, borderColor: '#999ea1', borderWidth: 1, borderRadius: 8, paddingLeft: 11, color: '#00308F', backgroundColor: '#FFFFFF' },
  pickerContainer: {
  width: isWeb ? '80%' : '100%',
  height: isWeb ? 40 : 33,
  borderColor: '#999ea1',
  borderWidth: 1,
  borderRadius: 8,
  paddingHorizontal: 11,
  justifyContent: 'center',
  backgroundColor: '#FFFFFF',
},

  picker: {
  width: '100%',
  height: '100%',
  color: '#00308F',
},

  button: { width: isWeb ? 300 : '90%', backgroundColor: '#00308F', paddingVertical: 8, borderRadius: 10, alignItems: 'center', marginTop: 17 },
  buttonText: { fontSize: 15, color: '#FFFFFF' },
  googleButton: { backgroundColor: '#FFFFFF', borderColor: '#00308f', borderWidth: 1, marginTop: 9 },
  googleButtonContent: { flexDirection: 'row', alignItems: 'center' },
  googleLogo: { width: 20, height: 20, marginRight: 10 },
  googleButtonText: { color: '#000000' },
  dividerContainer: { flexDirection: 'row', alignItems: 'center', width: '90%', marginVertical: 17 },
  line: { flex: 1, height: 1, backgroundColor: '#D3D3D3' },
  orText: { fontSize: 13, color: '#00308F', marginHorizontal: 11 },
  loginContainer: { flexDirection: 'row', marginTop: 17, marginBottom: 20 },
  loginText: { fontSize: 13, color: '#999ea1' },
  loginLink: { fontSize: 13, color: '#00308f', textDecorationLine: 'underline' },
  interestBox: {
  width: isWeb ? '80%' : '100%',
  height: isWeb ? 40 : 33,
  borderWidth: 1,
  borderColor: '#999ea1',
  borderRadius: 8,
  paddingHorizontal: 11,
  backgroundColor: '#FFFFFF',
  justifyContent: 'center',
},

  selectedTagsContainer: {
  flexDirection: 'row',
  flexWrap: 'wrap',
  alignItems: 'center',
  gap: 5,
},

  tag: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#00308F', borderRadius: 15, paddingHorizontal: 8, paddingVertical: 4, margin: 2 },
  tagText: { color: '#FFFFFF', marginRight: 5 },
  removeTag: { color: '#FFFFFF', fontWeight: 'bold' },
  dropdownWrapperContainer: {
  position: 'absolute',
  top: isWeb ? 42 : 35,
  left: 0,
  right: 0,
  width: isWeb ? '80%' : '100%',
  backgroundColor: '#FFFFFF',
  borderWidth: 1,
  borderColor: '#999ea1',
  borderRadius: 8,
  maxHeight: 150,
  zIndex: 999,
  elevation: 5,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
},

  dropdown: { maxHeight: 150 },
  dropdownItem: { paddingVertical: 6, paddingHorizontal: 10, borderBottomWidth: 0.5, borderBottomColor: '#ccc' },
});
