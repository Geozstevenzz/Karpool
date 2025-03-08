// store/selectedTripStore.ts
import { create } from 'zustand';

export const useSelectedTripStore = create((set) => ({
  selectedTripId: null as number | null,
  setSelectedTripId: (id: number) => set({ selectedTripId: id }),
}));
