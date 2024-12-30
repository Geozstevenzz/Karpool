import React, { useState } from 'react';
import { View, Text, Button, StyleSheet, Alert } from 'react-native';
import LocationPicker from '../components/LocationPicker';
import DateTimePicker from '../components/DatePickerComponent';
import MapComponent from '../components/MapComponent';
import { useRouter } from 'expo-router';
import TopBar from '../components/topBar';
import {useUserMode} from '../store/userModeStore'
import { useMapStore } from '@/store/mapStore';
import { useDateTimeStore } from '@/store/dateTImeStore';
import { useTripStore } from '@/store/useTripStore';

const HomeScreen: React.FC = () => {
  
  const router = useRouter();
  const currentMode = useUserMode((state) =>  state.mode)
  const locationMarker = useMapStore((state) => state.locationMarker)
  const destinationMarker = useMapStore((state) => state.destinationMarker)
  let timeDate = useDateTimeStore((state) => state.time);
  let time = timeDate.getHours() + ":" + timeDate.getMinutes();
  const dateObjects = useDateTimeStore((state) => state.dates)

  const handleSubmit = async () => {
    try {
      const dates:String[] = [];

      for (const date in dateObjects) {
        dates.push(date)
      }
      // Combine data into a single object
      const combinedData = {
        time,
        date: dates[0],
        locationMarker,
        destinationMarker
      };

      console.log(combinedData)

      const response = await fetch('http://10.0.2.2:9000/data/api/getTrips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combinedData), // Send combined data
      });

      if (response.ok) {
        const result = await response.json();
        useTripStore.getState().setTrips(result);
        Alert.alert('Success', `Response from server: ${JSON.stringify(result)}`);
        console.log(result)
        router.push('/confirm')
      } else {
        Alert.alert('Error', `Server returned status: ${response.status}`);
        console.log(`Error Server returned status: ${response.status}`)
      }
    } catch (error) {
      Alert.alert('Error', `Failed to send data: ${error} `);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <MapComponent />
      
      <View style={styles.bottomView}>
        <Text style={styles.text}>{currentMode === 'driver' ? 'Schedule a trip:' : 'Find a trip:'}</Text>
        <LocationPicker />
        <DateTimePicker/>

        <Button
          title={currentMode === 'driver' ? 'Next' : 'Go'}
          //onPress={() => currentMode === 'driver' ? router.push('/driverTripDetails') : router.push('/confirm')}

          onPress={() => currentMode === 'driver' ? router.push('/driverTripDetails') : handleSubmit()}
        />
      </View>
    </View>
  );
};

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
  }
});

export default HomeScreen;
