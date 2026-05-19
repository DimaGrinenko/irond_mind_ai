import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type WellbeingEntry = {
  date: string;
  sleep: number; // 0-100
  energy: number; // 0-100
  stress: number; // 0-100
  note?: string;
};

type State = {
  entries: WellbeingEntry[];
  upsertToday: (patch: Partial<Omit<WellbeingEntry, 'date'>>) => void;
  todayEntry: () => WellbeingEntry | null;
  weekAvg: () => { sleep: number; energy: number; stress: number } | null;
  last7: () => WellbeingEntry[];
  remove: (date: string) => void;
};

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

export const useWellbeingStore = create<State>()(
  persist(
    (set, get) => ({
      entries: [],
      upsertToday: (patch) => {
        const today = todayIso();
        const idx = get().entries.findIndex((e) => e.date === today);
        if (idx >= 0) {
          const next = [...get().entries];
          next[idx] = { ...next[idx], ...patch };
          set({ entries: next });
        } else {
          set({
            entries: [
              { date: today, sleep: 50, energy: 50, stress: 50, ...patch },
              ...get().entries,
            ],
          });
        }
      },
      todayEntry: () => {
        const today = todayIso();
        return get().entries.find((e) => e.date === today) ?? null;
      },
      weekAvg: () => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 7);
        const cutoffIso = cutoff.toISOString().slice(0, 10);
        const recent = get().entries.filter((e) => e.date >= cutoffIso);
        if (recent.length === 0) return null;
        const sum = recent.reduce(
          (acc, e) => ({
            sleep: acc.sleep + e.sleep,
            energy: acc.energy + e.energy,
            stress: acc.stress + e.stress,
          }),
          { sleep: 0, energy: 0, stress: 0 },
        );
        return {
          sleep: Math.round(sum.sleep / recent.length),
          energy: Math.round(sum.energy / recent.length),
          stress: Math.round(sum.stress / recent.length),
        };
      },
      last7: () => {
        const cutoff = new Date();
        cutoff.setDate(cutoff.getDate() - 7);
        const cutoffIso = cutoff.toISOString().slice(0, 10);
        return get().entries.filter((e) => e.date >= cutoffIso).sort((a, b) => a.date.localeCompare(b.date));
      },
      remove: (date) => set({ entries: get().entries.filter((e) => e.date !== date) }),
    }),
    {
      name: 'ai_trainer_wellbeing',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
