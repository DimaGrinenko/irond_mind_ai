import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import type { ThemeId } from '../theme/themes';

type ThemeState = {
  /** Explicit user choice. null = follow gender default (and shop accent overrides anyway). */
  manualThemeId: ThemeId | null;
  setTheme: (id: ThemeId | null) => void;
  /** Reset to automatic (gender / shop driven). */
  clearTheme: () => void;
};

export const useThemeStore = create<ThemeState>()(
  persist(
    (set) => ({
      manualThemeId: null,
      setTheme: (manualThemeId) => set({ manualThemeId }),
      clearTheme: () => set({ manualThemeId: null }),
    }),
    {
      name: 'ai_trainer_theme',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
