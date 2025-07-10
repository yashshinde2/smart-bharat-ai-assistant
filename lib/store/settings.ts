import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface SettingsState {
  voiceOutput: boolean;
  darkMode: boolean;
  healthAlerts: boolean;
  weatherAlerts: boolean;
  emergencyAlerts: boolean;
  language: string;
  setVoiceOutput: (value: boolean) => void;
  setDarkMode: (value: boolean) => void;
  setHealthAlerts: (value: boolean) => void;
  setWeatherAlerts: (value: boolean) => void;
  setEmergencyAlerts: (value: boolean) => void;
  setLanguage: (value: string) => void;
}

export const useSettings = create<SettingsState>()(
  persist(
    (set) => ({
      voiceOutput: true,
      darkMode: false,
      healthAlerts: true,
      weatherAlerts: true,
      emergencyAlerts: true,
      language: 'hi',
      setVoiceOutput: (value) => set({ voiceOutput: value }),
      setDarkMode: (value) => set({ darkMode: value }),
      setHealthAlerts: (value) => set({ healthAlerts: value }),
      setWeatherAlerts: (value) => set({ weatherAlerts: value }),
      setEmergencyAlerts: (value) => set({ emergencyAlerts: value }),
      setLanguage: (value) => set({ language: value }),
    }),
    {
      name: 'app-settings',
    }
  )
);