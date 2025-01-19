import { create } from "zustand";
import { LatLng } from "react-native-maps";

type MapComponentProps = {
  locationMarker: { latitude: number; longitude: number };
  destinationMarker: { latitude: number; longitude: number };
  locationName: string;
  destinationName: string;
  choice: number;
  setChoice: (choice: number) => void;
  setLocationMarker: (coordinates: LatLng) => void;
  setDestinationMarker: (coordinates: LatLng) => void;
  setLocationName: (name: string) => void;
  setDestinationName: (name: string) => void;
};

export const useMapStore = create<MapComponentProps>((set) => ({
  locationMarker: { latitude: 31.481757, longitude: 74.396959 },
  destinationMarker: { latitude: 31.463119, longitude: 74.414223 },
  locationName: "Select Start Location",
  destinationName: "Select Destination",
  choice: 0,
  setChoice: (choice) => {
    console.log("Choice Updated to:", choice); // Log whenever choice is updated
    set(() => ({ choice }));
  },
  setLocationMarker: (coordinates) => {
    console.log("Location Marker Updated:", coordinates); // Log updated location marker
    set(() => ({ locationMarker: coordinates }));
  },
  setDestinationMarker: (coordinates) => {
    console.log("Destination Marker Updated:", coordinates); // Log updated destination marker
    set(() => ({ destinationMarker: coordinates }));
  },
  setLocationName: (name) => {
    console.log("Location Name Updated:", name); // Log updated location name
    set(() => ({ locationName: name }));
  },
  setDestinationName: (name) => {
    console.log("Destination Name Updated:", name); // Log updated destination name
    set(() => ({ destinationName: name }));
  },
}));
