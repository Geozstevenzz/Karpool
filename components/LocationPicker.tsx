import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useMapStore } from '../store/mapStore'


const LocationPicker: React.FC = () => {

  const setChoice = useMapStore((state) => state.setChoice);

  const onPressStart = () => {
    setChoice(0);
  }
  const onPressDestination = () => {
    setChoice(1);
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onPressStart} style={styles.pressable}>
        <Image source={require('../assets/images/My Location.png')} style={styles.icon} />
        <Text>Select Start Location</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={onPressDestination} style={styles.pressable}>
        <Image source={require('../assets/images/Address.png')} style={styles.icon} />
        <Text>Select Destination</Text>
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
    backgroundColor: "#EDFAFF",
    elevation: 5,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
});

export default LocationPicker;
