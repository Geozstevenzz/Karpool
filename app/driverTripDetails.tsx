import React, { useState, useEffect } from 'react';
import { View, Text, Button, StyleSheet, TouchableOpacity, Image, TextInput, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import * as SecureStore from 'expo-secure-store';

import MapComponent from '../components/MapComponent';
import TopBar from '../components/topBar';

import { useMapStore } from '../store/mapStore';
import { useDateTimeStore } from '@/store/dateTImeStore';
import { useUserStore } from '../store/userStore';
import { useVehicleStore } from '../store/vehicleStore';

const HomeScreen: React.FC = () => {
  const router = useRouter();
  const setChoice = useMapStore((state) => state.setChoice);
  setChoice(2);

  const { user } = useUserStore();
  const userID = user?.userid;

  const vehicleID = useVehicleStore((state) => state.vehicleID);
  console.log("Vehicle ID:", vehicleID);

  const [stops, setStops] = useState('');
  const [price, setPrice] = useState('');
  const [seats, setSeats] = useState('');

  const locationMarker = useMapStore((state) => state.locationMarker);
  const destinationMarker = useMapStore((state) => state.destinationMarker);

  const sourceName = useMapStore((state) => state.locationName);
  const destinationName = useMapStore((state) => state.destinationName);

  const timeDate = useDateTimeStore((state) => state.time);
  const dateObjects = useDateTimeStore((state) => state.dates);
  const time = timeDate.getHours() + ':' + timeDate.getMinutes();
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.log('Error retrieving token:', error);
      }
    };
    loadToken();
  }, []);

  const handleSubmit = async () => {
    try {
      const dates: string[] = [];
      for (const date in dateObjects) {
        dates.push(date);
      }

      const combinedData = {
        userID,         // from userStore
        vehicleID,      // from vehicleStore
        time,
        dates,
        stops,
        price,
        seats,
        locationMarker,
        destinationMarker,
        sourceName,
        destinationName
      };

      if (!token) {
        Alert.alert('Error', 'No token available. Please log in again.');
        return;
      }

      const response = await fetch('http://10.0.2.2:9000/driver/createTrip', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
          'X-Platform': 'mobile',
        },
        body: JSON.stringify(combinedData),
      });

      if (response.ok) {
        const result = await response.json();
        Alert.alert('Success', 'Trip created successfully!');
        console.log('Success', result);
      } else {
        Alert.alert('Error', `Server returned status: ${response.status}`);
        console.log(`Error: Server returned status: ${response.status}`);
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to send data');
      console.log('Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <MapComponent />

      <View style={styles.bottomView}>
        <Text style={styles.text}>Trip Details</Text>
        <View style={styles.pressableContainer}>


          <TouchableOpacity onPress={() => {}} style={styles.pressable}>
            <Image
              source={require('../assets/images/Location.png')}
              style={styles.icon}
            />
            <Text>Stops</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={setStops}
              value={stops}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}} style={styles.pressable}>
            <Image
              source={require('../assets/images/Cash.png')}
              style={styles.icon}
            />
            <Text>Your Price in PKR</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={setPrice}
              value={price}
            />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => {}} style={styles.pressable}>
            <Image
              source={require('../assets/images/People.png')}
              style={styles.icon}
            />
            <Text>Available Seats</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={setSeats}
              value={seats}
            />
          </TouchableOpacity>
        </View>

        <Button
          title="Go!"
          onPress={() => {
            handleSubmit();
            router.back();
          }}
        />
      </View>
    </View>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bottomView: {
    position: 'absolute',
    bottom: 0,
    width: '100%',
    padding: 20,
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    borderWidth: 1,
    borderColor: 'grey',
  },
  text: {
    marginBottom: 15,
    fontWeight: '600',
    fontSize: 20,
  },
  pressableContainer: {
    flexDirection: 'column',
  },
  pressable: {
    height: 60,
    flexDirection: 'row',
    alignItems: 'center',
    padding: 10,
    borderWidth: 1,
    borderColor: 'grey',
    borderRadius: 5,
    marginBottom: 7,
    backgroundColor: '#EDFAFF',
    elevation: 5,
  },
  icon: {
    width: 25,
    height: 25,
    marginRight: 10,
  },
  input: {
    height: 40,
    margin: 12,
    borderWidth: 1,
    borderRadius: 10,
    padding: 10,
    flex: 1,
  },
});
