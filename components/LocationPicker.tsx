import React, { useState } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal } from 'react-native';
import { useRouter } from 'expo-router';
import { useMapStore } from '../store/mapStore';

const LocationPicker: React.FC = () => {
  const router = useRouter();
  const setChoice = useMapStore((state) => state.setChoice); 
  const locationName = useMapStore((state) => state.locationName); 
  const destinationName = useMapStore((state) => state.destinationName); 

  const [modalVisible, setModalVisible] = useState(false); // Control modal visibility
  const [currentType, setCurrentType] = useState<"start" | "destination" | null>(null);

  const defaultStartText = "Select Start Location";
  const defaultDestinationText = "Select Destination";

  const onPressLocation = (type: "start" | "destination") => {
    setChoice(type === "start" ? 0 : 1);
    setCurrentType(type);
    setModalVisible(true); // Show modal with options
  };

  const onSearchLocation = () => {
    setModalVisible(false);
    router.push(`/location-search?type=${currentType}`);
  };

  const onSelectOnMap = () => {
    setModalVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* Start Location */}
      <TouchableOpacity onPress={() => onPressLocation("start")} style={styles.pressable}>
        <Image source={require('../assets/images/My Location.png')} style={styles.icon} />
        <Text style={styles.text} numberOfLines={1}>
          {locationName !== defaultStartText && locationName ? locationName : defaultStartText}
        </Text>
      </TouchableOpacity>

      {/* Destination Location */}
      <TouchableOpacity onPress={() => onPressLocation("destination")} style={styles.pressable}>
        <Image source={require('../assets/images/Address.png')} style={styles.icon} />
        <Text style={styles.text} numberOfLines={1}>
          {destinationName !== defaultDestinationText && destinationName ? destinationName : defaultDestinationText}
        </Text>
      </TouchableOpacity>

      {/* Modal for Options */}
      <Modal
        transparent={true}
        visible={modalVisible}
        animationType="slide"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Choose an Option</Text>
            <TouchableOpacity style={styles.modalButton} onPress={onSearchLocation}>
              <Text style={styles.modalButtonText}>Search for Location</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalButton} onPress={onSelectOnMap}>
              <Text style={styles.modalButtonText}>Select on Map</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalCancelButton} onPress={() => setModalVisible(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    width: '80%',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 20,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  modalButton: {
    backgroundColor: '#007BFF',
    padding: 10,
    borderRadius: 5,
    width: '100%',
    alignItems: 'center',
    marginBottom: 10,
  },
  modalButtonText: {
    color: 'white',
    fontSize: 16,
  },
  modalCancelButton: {
    marginTop: 10,
  },
  modalCancelText: {
    color: 'red',
    fontSize: 16,
  },
});

export default LocationPicker;
