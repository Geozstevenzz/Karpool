import { create } from "zustand";
import { LatLng } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";

type Bookmark = {
  name: string;
  coordinates: LatLng;
};

type MapComponentProps = {
  locationMarker: LatLng;
  destinationMarker: LatLng;
  locationName: string;
  destinationName: string;
  choice: number;
  fitToMarkers: boolean;
  bookmarks: Bookmark[];
  setChoice: (choice: number) => void;
  setLocationMarker: (coordinates: LatLng) => void;
  setDestinationMarker: (coordinates: LatLng) => void;
  setLocationName: (name: string) => void;
  setDestinationName: (name: string) => void;
  resetMarkers: () => void;
  toggleFitToMarkers: (status: boolean) => void;
  addBookmark: (name: string, coordinates: LatLng) => void;
  removeBookmark: (name: string) => void;
  loadBookmarks: () => void;
  clearBookmarks: () => void;
  selectBookmark: (bookmark: Bookmark, type: "start" | "destination") => void;
};

export const useMapStore = create<MapComponentProps>((set, get) => ({
  locationMarker: { latitude: 31.481757, longitude: 74.396959 },
  destinationMarker: { latitude: 31.463119, longitude: 74.414223 },
  locationName: "Select Start Location",
  destinationName: "Select Destination",
  choice: 0,
  fitToMarkers: true,
  bookmarks: [],

  setChoice: (choice) => set(() => ({ choice })),
  
  setLocationMarker: (coordinates) =>
    set(() => ({ locationMarker: coordinates, fitToMarkers: true })),
    
  setDestinationMarker: (coordinates) =>
    set(() => ({ destinationMarker: coordinates, fitToMarkers: true })),
    
  setLocationName: (name) => set(() => ({ locationName: name })),
    
  setDestinationName: (name) => set(() => ({ destinationName: name })),
    
  resetMarkers: () =>
    set(() => ({
      locationMarker: { latitude: 31.481757, longitude: 74.396959 },
      destinationMarker: { latitude: 31.463119, longitude: 74.414223 },
      locationName: "Select Start Location",
      destinationName: "Select Destination",
      fitToMarkers: true,
    })),

  toggleFitToMarkers: (status) => set(() => ({ fitToMarkers: status })),

  addBookmark: async (name, coordinates) => {
    const { bookmarks } = get();

    // Prevent duplicate bookmarks
    if (bookmarks.some((bookmark) => bookmark.name === name)) {
      console.log("Bookmark already exists:", name);
      return;
    }

    const updatedBookmarks = [...bookmarks, { name, coordinates }];
    await AsyncStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));

    set(() => ({ bookmarks: updatedBookmarks }));
    console.log("Bookmark added:", name);
  },

  removeBookmark: async (name) => {
    const { bookmarks } = get();
    const updatedBookmarks = bookmarks.filter(
      (bookmark) => bookmark.name !== name
    );

    await AsyncStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    set(() => ({ bookmarks: updatedBookmarks }));
    console.log("Bookmark removed:", name);
  },

  loadBookmarks: async () => {
    const storedBookmarks = await AsyncStorage.getItem("bookmarks");
    if (storedBookmarks) {
      set(() => ({ bookmarks: JSON.parse(storedBookmarks) }));
      console.log("Bookmarks loaded from storage.");
    }
  },

  clearBookmarks: async () => {
    await AsyncStorage.removeItem("bookmarks");
    set(() => ({ bookmarks: [] }));
    console.log("All bookmarks cleared.");
  },

  selectBookmark: (bookmark, type: "start" | "destination") => {
    if (type === "start") {
      set(() => ({
        locationMarker: bookmark.coordinates,
        locationName: bookmark.name,
        choice: 0,
      }));
    } else if (type === "destination") {
      set(() => ({
        destinationMarker: bookmark.coordinates,
        destinationName: bookmark.name,
        choice: 1,
      }));
    }
  },

  resetMapState: () =>
    set({
      locationMarker: { latitude: 31.481757, longitude: 74.396959 },
      destinationMarker: { latitude: 31.463119, longitude: 74.414223 },
      locationName: "Select Start Location",
      destinationName: "Select Destination",
      choice: 0,
      fitToMarkers: true,
    }),
}));
