import { create } from "zustand";

type Trip = {
  tripid: number;
  driverid: number;
  vehicleid: number;
  numberofpassengers: number;
  numberofstops: number;
  overallrating: number;
  price: number;
  triptime: string;
  tripdate: string;
  totalseats: number;
  startlocation: { latitude: number; longitude: number };
  destinationlocation: { latitude: number; longitude: number };
  distance: string; // Distance in km
  estimatedTime: string; // Estimated time in minutes
  username: string;
  profile_photo: string | null;
  vehiclename: string;
  vehiclecolor: string;
  vehiclenumber: string;
  vehicleaverage: number;
};

type TripStore = {
  trips: Trip[];
  setTrips: (trips: Trip[]) => void;
};

export const useTripStore = create<TripStore>((set) => ({
  trips: [],
  setTrips: (trips) => set({ trips }),
}));