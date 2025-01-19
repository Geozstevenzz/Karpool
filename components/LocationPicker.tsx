import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { useMapStore } from '../store/mapStore';

const LocationPicker: React.FC = () => {
  const router = useRouter();
  const setChoice = useMapStore((state) => state.setChoice); // Access the setChoice function
  const locationName = useMapStore((state) => state.locationName); // Access source location name
  const destinationName = useMapStore((state) => state.destinationName); // Access destination location name

  const defaultStartText = "Select Start Location";
  const defaultDestinationText = "Select Destination";

  const onPressStart = () => {
    setChoice(0); // Set choice to 0 for start location
    router.push('/location-search?type=start');
  };

  const onPressDestination = () => {
    setChoice(1); // Set choice to 1 for destination
    router.push('/location-search?type=destination');
  };

  return (
    <View style={styles.container}>
      {/* Start Location */}
      <TouchableOpacity onPress={onPressStart} style={styles.pressable}>
        <Image source={require('../assets/images/My Location.png')} style={styles.icon} />
        <Text style={styles.text} numberOfLines={1}>
          {locationName !== defaultStartText && locationName ? locationName : defaultStartText}
        </Text>
      </TouchableOpacity>

      {/* Destination Location */}
      <TouchableOpacity onPress={onPressDestination} style={styles.pressable}>
        <Image source={require('../assets/images/Address.png')} style={styles.icon} />
        <Text style={styles.text} numberOfLines={1}>
          {destinationName !== defaultDestinationText && destinationName ? destinationName : defaultDestinationText}
        </Text>
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
  text: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
  },
});

export default LocationPicker;
