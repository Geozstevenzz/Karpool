import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, Modal, FlatList, ActivityIndicator } from 'react-native';
import { useRouter } from 'expo-router';
import { useMapStore } from '../store/mapStore';
import * as SecureStore from 'expo-secure-store';

const LocationPicker: React.FC = () => {
  const router = useRouter();
  const setChoice = useMapStore((state) => state.setChoice); 
  const setLocationMarker = useMapStore((state) => state.setLocationMarker);
  const setDestinationMarker = useMapStore((state) => state.setDestinationMarker);
  const locationName = useMapStore((state) => state.locationName); 
  const destinationName = useMapStore((state) => state.destinationName); 
  const selectBookmark = useMapStore((state) => state.selectBookmark); 
  const toggleFitToMarkers = useMapStore((state) => state.toggleFitToMarkers); 

  const [modalVisible, setModalVisible] = useState(false); 
  const [currentType, setCurrentType] = useState<"start" | "destination" | null>(null);
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [token, setToken] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const defaultStartText = "Select Start Location";
  const defaultDestinationText = "Select Destination";

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync('userToken');
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error('Error retrieving token from SecureStore:', error);
      }
    };
    loadToken();
  }, []);

  const fetchBookmarks = async () => {
    if (!token) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch("http://10.0.2.2:9000/user/bookmark/all", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Platform": "mobile",
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch bookmarks. Status: ${response.status}`);
      }

      const data = await response.json();
      setBookmarks(data.bookmarks || []);
    } catch (error) {
      console.error('Error fetching bookmarks:', error);
      setError('Failed to load bookmarks');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (modalVisible && token) {
      fetchBookmarks();
    }
  }, [modalVisible, token]);

  const onPressLocation = (type: "start" | "destination") => {
    setChoice(type === "start" ? 0 : 1);
    setCurrentType(type);
    setModalVisible(true);
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
    
    toggleFitToMarkers(true);
    setModalVisible(false);
  };

  const refreshBookmarks = () => {
    fetchBookmarks();
  };

  return (
    <View style={styles.container}>
      {/* Start Location */}
      <TouchableOpacity onPress={() => onPressLocation("start")} style={styles.pressable}>
        <Image source={require('../assets/images/My Location.png')} style={styles.icon} />
        <Text style={styles.text} numberOfLines={1}>
          {locationName !== defaultStartText ? locationName : defaultStartText}
        </Text>
      </TouchableOpacity>

      {/* Destination Location */}
      <TouchableOpacity onPress={() => onPressLocation("destination")} style={styles.pressable}>
        <Image source={require('../assets/images/Address.png')} style={styles.icon} />
        <Text style={styles.text} numberOfLines={1}>
          {destinationName !== defaultDestinationText ? destinationName : defaultDestinationText}
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

            {/*<View style={styles.bookmarksHeader}>
              <Text style={styles.modalTitle}>Bookmarks</Text>
              <TouchableOpacity onPress={refreshBookmarks} style={styles.refreshButton}>
                <Text style={styles.refreshText}>Refresh</Text>
              </TouchableOpacity>
            </View>*/}

            {/*loading ? (
              <ActivityIndicator size="large" color="#007BFF" style={styles.loader} />
            ) : error ? (
              <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
                <TouchableOpacity onPress={fetchBookmarks} style={styles.retryButton}>
                  <Text style={styles.retryText}>Retry</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <FlatList
                data={bookmarks}
                keyExtractor={(item, index) => `${item.name}-${index}`}
                renderItem={({ item }) => (
                  <TouchableOpacity 
                    style={styles.bookmarkItem} 
                    onPress={() => onSelectBookmark(item)}
                  >
                    <Text style={styles.bookmarkText}>{item.location}</Text>
                    <Text style={styles.bookmarkAddress} numberOfLines={1}>{item.address}</Text>
                  </TouchableOpacity>
                )}
                ListEmptyComponent={<Text style={styles.emptyText}>No bookmarks available.</Text>}
                style={styles.bookmarksList}
              />
            )*/}

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
    maxHeight: '80%',
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
    paddingVertical: 5,
  },
  modalCancelText: {
    color: 'red',
    fontSize: 16,
  },
  bookmarksHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    marginBottom: 5,
  },
  refreshButton: {
    padding: 5,
  },
  refreshText: {
    color: '#007BFF',
    fontSize: 14,
  },
  bookmarksList: {
    width: '100%',
    maxHeight: 200,
  },
  bookmarkItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ccc',
    width: '100%',
  },
  bookmarkText: {
    fontSize: 16,
    fontWeight: '500',
  },
  bookmarkAddress: {
    fontSize: 14,
    color: 'gray',
    marginTop: 2,
  },
  emptyText: {
    fontSize: 14,
    color: 'gray',
    textAlign: 'center',
    padding: 10,
  },
  loader: {
    marginVertical: 20,
  },
  errorContainer: {
    alignItems: 'center',
    padding: 10,
  },
  errorText: {
    color: 'red',
    fontSize: 14,
    marginBottom: 10,
  },
  retryButton: {
    backgroundColor: '#f0f0f0',
    padding: 8,
    borderRadius: 5,
  },
  retryText: {
    color: '#007BFF',
    fontSize: 14,
  },
});

export default LocationPicker;