import { create } from "zustand";

type UserModeStore = {
    mode: "driver" | "passenger";
    setMode: (mode: "driver" | "passenger") => void;
    
}

export const useUserMode = create<UserModeStore>((set) =>({
    mode: "passenger",
    setMode: (useMode) => set(() => ({mode: useMode})),
    
}));

