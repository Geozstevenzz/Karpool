import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, FlatList } from 'react-native';
import { useRouter } from 'expo-router';
import { useMapStore } from '../store/mapStore';

const LocationPicker: React.FC = () => {
  const router = useRouter();
  const setChoice = useMapStore((state) => state.setChoice); 
  const setLocationMarker = useMapStore((state) => state.setLocationMarker);
  const setDestinationMarker = useMapStore((state) => state.setDestinationMarker);
  const locationName = useMapStore((state) => state.locationName); 
  const destinationName = useMapStore((state) => state.destinationName); 
  const bookmarks = useMapStore((state) => state.bookmarks); 
  const selectBookmark = useMapStore((state) => state.selectBookmark); 
  const toggleFitToMarkers = useMapStore((state) => state.toggleFitToMarkers); 

  const [modalVisible, setModalVisible] = useState(false); 
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

  const onSelectBookmark = (bookmark) => {
    if (currentType === "start") {
      setLocationMarker(bookmark.coordinates);
      selectBookmark(bookmark, "start");
    } else if (currentType === "destination") {
      setDestinationMarker(bookmark.coordinates);
      selectBookmark(bookmark, "destination");
    }
    
    // Ensure the map adjusts to show both markers
    toggleFitToMarkers(true); // Set the map to fit both markers after selection
    setModalVisible(false); // Close modal after selecting bookmark
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

            <Text style={styles.modalTitle}>Bookmarks</Text>
            {/* Displaying Bookmarked Locations */}
            <FlatList
              data={bookmarks}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity style={styles.bookmarkItem} onPress={() => onSelectBookmark(item)}>
                  <Text style={styles.bookmarkText}>{item.name}</Text>
                </TouchableOpacity>
              )}
              ListEmptyComponent={<Text style={styles.emptyText}>No bookmarks available.</Text>}
            />

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
  bookmarkItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
  },
  bookmarkText: {
    fontSize: 16,
  },
  emptyText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
  },
});

export default LocationPicker;
