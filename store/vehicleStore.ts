import { create } from 'zustand';

export const useVehicleStore = create((set) => ({
  vehicleID: null as string | number | null,
  setVehicleID: (id: string | number) => set({ vehicleID: id }),
}));
