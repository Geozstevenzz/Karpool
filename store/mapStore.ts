import { create } from "zustand";
import { LatLng } from "react-native-maps";

type MapComponentProps = {
  locationMarker: LatLng;
  destinationMarker: LatLng;
  locationName: string;
  destinationName: string;
  choice: number; // 0: Location marker, 1: Destination marker
  fitToMarkers: boolean; // New: Flag to track whether markers need fitting
  setChoice: (choice: number) => void;
  setLocationMarker: (coordinates: LatLng) => void;
  setDestinationMarker: (coordinates: LatLng) => void;
  setLocationName: (name: string) => void;
  setDestinationName: (name: string) => void;
  resetMarkers: () => void; // Reset markers to default values
  toggleFitToMarkers: (status: boolean) => void; // New: Set fitToMarkers flag
};

export const useMapStore = create<MapComponentProps>((set) => ({
  // Initial States
  locationMarker: { latitude: 31.481757, longitude: 74.396959 }, // Default Start Location
  destinationMarker: { latitude: 31.463119, longitude: 74.414223 }, // Default Destination
  locationName: "Select Start Location",
  destinationName: "Select Destination",
  choice: 0, // Default to setting start location
  fitToMarkers: true, // Default: Automatically fit to markers on map load

  // Update Choice
  setChoice: (choice) => {
    console.log("Choice Updated to:", choice); // Log whenever choice is updated
    set(() => ({ choice }));
  },

  // Update Location Marker
  setLocationMarker: (coordinates) => {
    console.log("Location Marker Updated:", coordinates); // Log updated location marker
    set(() => ({
      locationMarker: coordinates,
      fitToMarkers: true, // Trigger re-centering
    }));
  },

  // Update Destination Marker
  setDestinationMarker: (coordinates) => {
    console.log("Destination Marker Updated:", coordinates); // Log updated destination marker
    set(() => ({
      destinationMarker: coordinates,
      fitToMarkers: true, // Trigger re-centering
    }));
  },

  // Update Location Name
  setLocationName: (name) => {
    console.log("Location Name Updated:", name); // Log updated location name
    set(() => ({ locationName: name }));
  },

  // Update Destination Name
  setDestinationName: (name) => {
    console.log("Destination Name Updated:", name); // Log updated destination name
    set(() => ({ destinationName: name }));
  },

  // Reset Markers to Default State
  resetMarkers: () => {
    console.log("Resetting markers to default values");
    set(() => ({
      locationMarker: { latitude: 31.481757, longitude: 74.396959 },
      destinationMarker: { latitude: 31.463119, longitude: 74.414223 },
      locationName: "Select Start Location",
      destinationName: "Select Destination",
      fitToMarkers: true, // Trigger re-centering
    }));
  },

  // Toggle Fit-To-Markers Flag
  toggleFitToMarkers: (status) => {
    console.log("Fit-To-Markers flag set to:", status);
    set(() => ({ fitToMarkers: status }));
  },
}));
