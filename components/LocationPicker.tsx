import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useMapStore } from '../store/mapStore'; // Import the map store

const LocationPicker: React.FC = () => {
  const router = useRouter();
  const setChoice = useMapStore((state) => state.setChoice); // Access the setChoice function

  const onPressStart = () => {
    setChoice(0); // Set choice to 0 for start location
    console.log("Navigating to Start Location Picker");
    router.push('/location-search?type=start');
  };

  const onPressDestination = () => {
    setChoice(1); // Set choice to 1 for destination
    console.log("Navigating to Destination Picker");
    router.push('/location-search?type=destination');
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressStart} style={styles.pressable}>
        <Image source={require('../assets/images/My Location.png')} style={styles.icon} />
        <Text style={styles.text}>Select Start Location</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressDestination} style={styles.pressable}>
        <Image source={require('../assets/images/Address.png')} style={styles.icon} />
        <Text style={styles.text}>Select Destination</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'column',
  },
  pressable: {
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
    width: 20,
    height: 20,
    marginRight: 15,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    alignItems: 'center',
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
  },
});


export default LocationPicker;
