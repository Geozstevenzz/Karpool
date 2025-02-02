import React, { useState } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import axios from "axios";
import { useRouter } from "expo-router";
import { useMapStore } from "@/store/mapStore";

const LocationSearchScreen: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const {
    choice,
    setLocationMarker,
    setDestinationMarker,
    setLocationName,
    setDestinationName,
    addBookmark,
    removeBookmark,
    bookmarks,
  } = useMapStore();

  // Function to check if a location is already bookmarked
  const isBookmarked = (name: string) => {
    return bookmarks.some((bookmark) => bookmark.name === name);
  };

  // Function to search locations
  const searchLocation = async () => {
    if (!query.trim()) {
      alert("Please enter a location to search!");
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&addressdetails=1&limit=5`
      );
      setResults(response.data);
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("Something went wrong while fetching the locations.");
    } finally {
      setLoading(false);
    }
  };

  // Function to handle location selection
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

    router.replace("/driver-and-passenger-home");
  };

  // Function to toggle bookmark
  const toggleBookmark = (item) => {
    const location = {
      name: item.display_name,
      coordinates: {
        latitude: parseFloat(item.lat),
        longitude: parseFloat(item.lon),
      },
    };

    if (isBookmarked(location.name)) {
      removeBookmark(location.name);
    } else {
      addBookmark(location.name, location.coordinates);
    }
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

      {/* Bookmarks Section */}
      <View style={styles.bookmarksSection}>
        <Text style={styles.bookmarksTitle}>Bookmarks</Text>
        <FlatList
          data={bookmarks}
          keyExtractor={(item) => item.name}
          renderItem={({ item }) => (
            <View style={styles.bookmarkItem}>
              <Text style={styles.bookmarkText}>{item.name}</Text>
              <TouchableOpacity
                style={styles.removeBookmarkButton}
                onPress={() => removeBookmark(item.name)}
              >
                <Text style={styles.removeBookmarkText}>Remove</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No bookmarks added.</Text>}
        />
      </View>

      {/* Search Results Section */}
      <FlatList
        data={results}
        keyExtractor={(item) => item.place_id.toString()}
        renderItem={({ item }) => (
          <View style={styles.resultContainer}>
            <TouchableOpacity style={styles.resultItem} onPress={() => handleLocationSelect(item)}>
              <Text style={styles.resultName}>{item.display_name}</Text>
            </TouchableOpacity>

            {/* Bookmark Button */}
            <TouchableOpacity
              style={[
                styles.bookmarkButton,
                isBookmarked(item.display_name) ? styles.bookmarked : styles.notBookmarked,
              ]}
              onPress={() => toggleBookmark(item)}
            >
              <Text style={styles.bookmarkText}>
                {isBookmarked(item.display_name) ? "★" : "☆"}
              </Text>
            </TouchableOpacity>
          </View>
        )}
        ListEmptyComponent={!loading && <Text style={styles.emptyText}>No results found. Try again!</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#f5f5f5" },
  input: {
    height: 50,
    borderColor: "grey",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 10,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#007bff",
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  loader: { marginVertical: 10 },
  bookmarksSection: {
    marginBottom: 20,
  },
  bookmarksTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  bookmarkItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
    marginBottom: 10,
  },
  bookmarkText: {
    fontSize: 16,
  },
  removeBookmarkButton: {
    backgroundColor: "#e74c3c",
    padding: 5,
    borderRadius: 5,
  },
  removeBookmarkText: {
    color: "#fff",
    fontSize: 14,
  },
  resultContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 15,
    marginBottom: 10,
    borderRadius: 10,
    justifyContent: "space-between",
  },
  resultItem: { flex: 1 },
  resultName: { fontSize: 16, fontWeight: "bold" },
  bookmarkButton: {
    padding: 10,
    borderRadius: 50,
  },
  bookmarkText: {
    fontSize: 18,
    fontWeight: "bold",
  },
  bookmarked: {
    backgroundColor: "gold",
  },
  notBookmarked: {
    backgroundColor: "#ddd",
  },
  emptyText: { textAlign: "center", fontSize: 16, color: "grey" },
});

export default LocationSearchScreen;
