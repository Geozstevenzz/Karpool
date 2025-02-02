import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useMapStore } from '../store/mapStore'

const BookmarkList = () => {
  const { bookmarks, setLocationMarker, setDestinationMarker, removeBookmark } = useMapStore();

  const handleSelectBookmark = (bookmark) => {
    if (bookmark.type === "location") {
      setLocationMarker(bookmark.coordinates);
    } else {
      setDestinationMarker(bookmark.coordinates);
    }
  };

  return (
    <View style={{ padding: 10 }}>
      <Text style={{ fontSize: 18, fontWeight: "bold", marginBottom: 10 }}>Bookmarks</Text>
      {bookmarks.length === 0 ? (
        <Text>No bookmarks available.</Text>
      ) : (
        <FlatList
          data={bookmarks}
          keyExtractor={(item, index) => index.toString()}
          renderItem={({ item }) => (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                alignItems: "center",
                padding: 10,
                borderBottomWidth: 1,
                borderColor: "#ddd",
              }}
            >
              <TouchableOpacity onPress={() => handleSelectBookmark(item)}>
                <Text style={{ fontSize: 16 }}>{item.name}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => removeBookmark(item.name)}>
                <Text style={{ color: "red" }}>Delete</Text>
              </TouchableOpacity>
            </View>
          )}
        />
      )}
    </View>
  );
};

export default BookmarkList;
