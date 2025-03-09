import { create } from 'zustand';

interface DriverStore {
  driverID: string | null;
  setDriverID: (id: string) => void;
}

export const useDriverStore = create<DriverStore>((set) => ({
  driverID: null,
  setDriverID: (id) => set({ driverID: id }),
}));
