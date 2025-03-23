import React, { useState, useEffect } from "react";
import {
  View,
  TextInput,
  FlatList,
  TouchableOpacity,
  Text,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { useMapStore } from "@/store/mapStore";
import * as SecureStore from "expo-secure-store";

import { useUserStore } from "@/store/userStore";

const LocationSearchScreen: React.FC = () => {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const {
    choice,
    locationMarker,
    destinationMarker,
    setLocationMarker,
    setDestinationMarker,
    setLocationName,
    setDestinationName,
  } = useMapStore();

  const [bookmarks, setBookmarks] = useState([]);

  const { user } = useUserStore();
  const userID = user?.userid;

  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const loadToken = async () => {
      try {
        const storedToken = await SecureStore.getItemAsync("userToken");
        if (storedToken) {
          setToken(storedToken);
        }
      } catch (error) {
        console.error("Error retrieving token:", error);
      }
    };
    loadToken();
  }, []);

  useEffect(() => {
    if (token && userID) {
      fetchBookmarks();
    }
  }, [token, userID]);

  const fetchBookmarks = async () => {
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
        throw new Error(`Server returned status ${response.status}`);
      }
      const data = await response.json();
      console.log("Bookmarks from server:", data);
      setBookmarks(data.bookmarks || []);
    } catch (error) {
      console.error("Error fetching bookmarks:", error);
      Alert.alert("Error", "Could not fetch bookmarks.");
    }
  };

  const isBookmarked = (locationName: string) => {
    return bookmarks.some((bm) => bm.location === locationName);
  };

  const searchLocation = async () => {
    if (!query.trim()) {
      alert("Please enter a location to search!");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          query
        )}&format=json&addressdetails=1&limit=5`
      );
      const data = await response.json();
      setResults(data);
    } catch (error) {
      console.error("Error fetching location:", error);
      alert("Something went wrong while fetching the locations.");
    } finally {
      setLoading(false);
    }
  };

  const handleLocationSelect = (item) => {
  const selectedLocation = {
    latitude: typeof item.latitude === "number" ? item.latitude : parseFloat(item.lat),
    longitude: typeof item.longitude === "number" ? item.longitude : parseFloat(item.lon),
    name: item.display_name || item.location,
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

    router.back();
  };

  const createBookmarkOnServer = async (locationName, coordinates) => {
    if (!userID) {
      Alert.alert("Error", "No user ID found.");
      return;
    }

    try {
      console.log("User ID:", userID);
      console.log("Location Name:", locationName);
      console.log("Coordinates:", coordinates);
      const response = await fetch("http://10.0.2.2:9000/user/bookmark/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Platform": "mobile",
        },
        body: JSON.stringify({
          userid: userID,
          location: locationName,
          coordinates
        }),
      });
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const data = await response.json();
      console.log("Bookmark creation response:", data);
      fetchBookmarks();
    } catch (error) {
      console.error("Error creating bookmark:", error);
      Alert.alert("Error", "Could not create bookmark.");
    }
  };

  const deleteBookmarkOnServer = async (bookmarkid: number) => {
    try {
      const response = await fetch("http://10.0.2.2:9000/user/bookmark/delete", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
          "X-Platform": "mobile",
        },
        body: JSON.stringify({ bookmarkid }),
      });
      if (!response.ok) {
        throw new Error(`Server returned status ${response.status}`);
      }
      const data = await response.json();
      console.log("Bookmark deletion response:", data);
      fetchBookmarks();
    } catch (error) {
      console.error("Error deleting bookmark:", error);
      Alert.alert("Error", "Could not delete bookmark.");
    }
  };

  const getBookmarkIdByLocation = (locationName: string): number | null => {
    const found = bookmarks.find((bm) => bm.location === locationName);
    return found ? found.bookmarkid : null;
  };

  const toggleBookmark = (item) => {
    const locationName = item.display_name;
    const coordinates = {
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
    };

    if (isBookmarked(locationName)) {
      const bookmarkId = getBookmarkIdByLocation(locationName);
      if (bookmarkId) {
        deleteBookmarkOnServer(bookmarkId);
      } else {
        console.warn("Could not find bookmark ID for location:", locationName);
      }
    } else {
      createBookmarkOnServer(locationName, coordinates);
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
          keyExtractor={(item) => item.bookmarkid.toString()}
          renderItem={({ item }) => (
            
              <View style={styles.resultContainer}>
                <TouchableOpacity style={styles.resultItem} onPress={() => handleLocationSelect(item)}>
                <Text style={styles.resultName}>{item.location}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.bookmarkButton, styles.bookmarked]}
                  onPress={() => deleteBookmarkOnServer(item.bookmarkid)}>
                  <Text style={styles.bookmarkText}>★</Text>
                </TouchableOpacity>
              </View>

          )}
          ListEmptyComponent={<Text style={styles.emptyText}>No bookmarks added.</Text>}
        />
      </View>

      {/* Search Results Section */}
      <Text style={styles.bookmarksTitle}>Search Results</Text>
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
        ListEmptyComponent={
          !loading && <Text style={styles.emptyText}>No results found. Try again!</Text>
        }
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
