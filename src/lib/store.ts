import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppPreferences {
    isValuesVisible: boolean;
    isSoundEnabled: boolean;
    isNotificationsEnabled: boolean;
    isOledMode: boolean;
    setIsValuesVisible: (visible: boolean) => void;
    setIsSoundEnabled: (enabled: boolean) => void;
    setIsNotificationsEnabled: (enabled: boolean) => void;
    setIsOledMode: (enabled: boolean) => void;
}

export const useAppStore = create<AppPreferences>()(
    persist(
        (set) => ({
            isValuesVisible: true,
            isSoundEnabled: true,
            isNotificationsEnabled: false,
            isOledMode: false,
            setIsValuesVisible: (visible) => set({ isValuesVisible: visible }),
            setIsSoundEnabled: (enabled) => set({ isSoundEnabled: enabled }),
            setIsNotificationsEnabled: (enabled) => set({ isNotificationsEnabled: enabled }),
            setIsOledMode: (enabled) => set({ isOledMode: enabled }),
        }),
        {
            name: 'befitness-preferences',
        }
    )
);
