import React, { useState } from 'react';

import {

  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,

} from 'react-native';

import axios from 'axios';
import { useRouter } from 'expo-router';
import { useMapStore } from '@/store/mapStore';

const LocationSearchScreen: React.FC = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const choice = useMapStore((state) => state.choice);
  const setLocationMarker = useMapStore((state) => state.setLocationMarker);
  const setDestinationMarker = useMapStore((state) => state.setDestinationMarker);
  const setLocationName = useMapStore((state) => state.setLocationName);
  const setDestinationName = useMapStore((state) => state.setDestinationName);

  const searchLocation = async () => {
    if (!query.trim()) {
      alert('Please enter a location to search!');
      return;
    }

    setLoading(true);

    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`
      );
      setResults(response.data);
    } catch (error) {
      console.error('Error fetching location:', error);
      alert('Something went wrong while fetching the locations.');
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (item) => {
    const selectedLocation = {
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      name: item.display_name,
    };

    if (choice === 0) {
      setLocationMarker({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });
      setLocationName(selectedLocation.name);
    } else if (choice === 1) {
      setDestinationMarker({
        latitude: selectedLocation.latitude,
        longitude: selectedLocation.longitude,
      });
      setDestinationName(selectedLocation.name);
    }

    router.replace('/driver-and-passenger-home');
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Enter a location (e.g., Eiffel Tower)"
        value={query}
        onChangeText={setQuery}
      />
      <TouchableOpacity style={styles.button} onPress={searchLocation}>
        <Text style={styles.buttonText}>Search</Text>
      </TouchableOpacity>

      {loading && <ActivityIndicator size="large" color="#0000ff" style={styles.loader} />}

      <FlatList
        data={results}
        keyExtractor={(item) => item.place_id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.resultItem} onPress={() => handleLocationSelect(item)}>
            <Text style={styles.resultName}>{item.display_name}</Text>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          !loading && <Text style={styles.emptyText}>No results found. Try again!</Text>
        }
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f5f5f5' },
  input: {
    height: 50,
    borderColor: 'grey',
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: '#fff',
  },
  button: {
    backgroundColor: '#007bff',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  buttonText: { color: '#fff', fontSize: 16, fontWeight: '600' },
  loader: { marginVertical: 10 },
  resultItem: {
    backgroundColor: '#fff',
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
  },
  resultName: { fontSize: 16, fontWeight: 'bold' },
  emptyText: { textAlign: 'center', fontSize: 16, color: 'grey' },
});

export default LocationSearchScreen;
