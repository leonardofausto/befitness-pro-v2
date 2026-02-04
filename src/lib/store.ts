import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface AppPreferences {
    isValuesVisible: boolean;
    isSoundEnabled: boolean;
    isNotificationsEnabled: boolean;
    setIsValuesVisible: (visible: boolean) => void;
    setIsSoundEnabled: (enabled: boolean) => void;
    setIsNotificationsEnabled: (enabled: boolean) => void;
}

export const useAppStore = create<AppPreferences>()(
    persist(
        (set) => ({
            isValuesVisible: true,
            isSoundEnabled: true,
            isNotificationsEnabled: false,
            setIsValuesVisible: (visible) => set({ isValuesVisible: visible }),
            setIsSoundEnabled: (enabled) => set({ isSoundEnabled: enabled }),
            setIsNotificationsEnabled: (enabled) => set({ isNotificationsEnabled: enabled }),
        }),
        {
            name: 'befitness-preferences',
        }
    )
);
