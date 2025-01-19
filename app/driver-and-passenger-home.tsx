import React from 'react';
import { View, Text, StyleSheet, Alert, Button } from 'react-native';
import { useRouter } from 'expo-router';
import LocationPicker from '../components/LocationPicker';
import DateTimePicker from '../components/DatePickerComponent';
import MapComponent from '../components/MapComponent';
import TopBar from '../components/topBar';
import { useUserMode } from '../store/userModeStore';
import { useMapStore } from '@/store/mapStore';
import { useDateTimeStore } from '@/store/dateTImeStore';
import { useTripStore } from '@/store/useTripStore';

const DriverOrPassengerHome: React.FC = () => {
  const router = useRouter();
  const currentMode = useUserMode((state) => state.mode);
  const locationMarker = useMapStore((state) => state.locationMarker);
  const destinationMarker = useMapStore((state) => state.destinationMarker);
  const timeDate = useDateTimeStore((state) => state.time);
  const dates = useDateTimeStore((state) => state.dates);
  const trips = useTripStore((state) => state.trips);

  const time = timeDate.getHours() + ":" + timeDate.getMinutes();

  const handleSubmit = async () => {
    try {
      const formattedDates: string[] = Object.keys(dates);

      const combinedData = {
        time,
        date: formattedDates[0], // Use the first date for now
        locationMarker,
        destinationMarker,
      };

      console.log('Submitting Data:', combinedData);

      const response = await fetch('http://10.0.2.2:9000/data/api/getTrips', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(combinedData),
      });

      if (response.ok) {
        const result = await response.json();
        useTripStore.getState().setTrips(result);
        Alert.alert('Success', `Trips received: ${JSON.stringify(result)}`);
        router.push('/confirm');
      } else {
        Alert.alert('Error', `Server returned status: ${response.status}`);
        console.error(`Server Error: ${response.status}`);
      }
    } catch (error) {
      Alert.alert('Error', `Failed to send data: ${error}`);
      console.error('Submission Error:', error);
    }
  };

  return (
    <View style={styles.container}>
      <TopBar />
      <MapComponent />

      <View style={styles.bottomView}>
        <Text style={styles.text}>
          {currentMode === 'driver' ? 'Schedule a trip:' : 'Find a trip:'}
        </Text>
        <LocationPicker />
        <DateTimePicker />
        <Button
          title={currentMode === 'driver' ? 'Next' : 'Go'}
          onPress={() => (currentMode === 'driver' ? router.push('/driverTripDetails') : handleSubmit())}
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
  },
});

export default DriverOrPassengerHome;
