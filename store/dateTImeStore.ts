import { create } from "zustand";

interface Params {
    selected: boolean;
    color: string | undefined;
}

interface DateType {
    [key: string]: Params;
}

type dateTimeStore = {
    dates: DateType;
    time: Date;
    setDate: (allDates: DateType) => void;
    setTime: (newTime: Date) => void;
    reset: () => void;
};

export const useDateTimeStore = create<dateTimeStore>((set) => ({
    dates: {},
    time: new Date(),
    setDate: (allDates) => set(() => ({ dates: allDates })),
    setTime: (newTime) => set(() => ({ time: newTime })),
    reset: () => set(() => ({ dates: {}, time: new Date() }))
}));
