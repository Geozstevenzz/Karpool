import { create } from "zustand";
import { LatLng } from "react-native-maps";

type MapComponentProps = {
    locationMarker: { latitude: number; longitude: number };
    destinationMarker: { latitude: number; longitude: number };
    choice: number;
    setChoice: (choice: number) => void;
    setLocationMarker: (coordinates: LatLng) => void;
    setDestinationMarker: (coordinates: LatLng) => void;
  }

export const useMapStore = create<MapComponentProps>((set) =>({
    locationMarker: {
        latitude: 24.8607,
        longitude: 67.1011,
    },
    destinationMarker: {
        latitude: 24.8607,
        longitude: 67.1011,
    },
    choice: 0,
    setChoice: (userChoice) => set(() => ({choice: userChoice})),
    setLocationMarker: (coordinates) => set(() => ({locationMarker: coordinates})),
    setDestinationMarker: (coordinates) => set(() => ({destinationMarker: coordinates})),
}));

