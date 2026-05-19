import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

function todayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

type DayLog = { date: string; glasses: number };

type WaterState = {
  glassMl: number;
  dailyTargetMl: number;
  /** Если true — цель пересчитывается по весу пользователя автоматически (35 мл/кг). */
  autoTarget: boolean;
  history: DayLog[];
  add: (count?: number) => void;
  remove: () => void;
  reset: () => void;
  setTarget: (ml: number) => void;
  setAutoTarget: (v: boolean) => void;
  /** Пересчитать цель из веса по формуле 35 мл/кг. */
  computeTargetFromWeight: (weightKg: number | null) => number;
  todayMl: () => number;
  progress: () => number;
};

export const useWaterStore = create<WaterState>()(
  persist(
    (set, get) => ({
      glassMl: 250,
      dailyTargetMl: 2500,
      autoTarget: true,
      history: [],
      add: (count = 1) => {
        const today = todayIso();
        const hist = [...get().history];
        const idx = hist.findIndex((d) => d.date === today);
        if (idx >= 0) hist[idx] = { ...hist[idx], glasses: hist[idx].glasses + count };
        else hist.push({ date: today, glasses: count });
        set({ history: hist });
      },
      remove: () => {
        const today = todayIso();
        const hist = [...get().history];
        const idx = hist.findIndex((d) => d.date === today);
        if (idx >= 0 && hist[idx].glasses > 0) {
          hist[idx] = { ...hist[idx], glasses: hist[idx].glasses - 1 };
        }
        set({ history: hist });
      },
      reset: () => {
        const today = todayIso();
        set({ history: get().history.filter((d) => d.date !== today) });
      },
      setTarget: (ml) => set({ dailyTargetMl: Math.max(500, Math.min(8000, ml)), autoTarget: false }),
      setAutoTarget: (v) => set({ autoTarget: v }),
      computeTargetFromWeight: (weightKg) => {
        if (!weightKg || weightKg <= 0) return get().dailyTargetMl;
        // ISSN / WHO: 30-40 мл/кг для активного спортсмена.
        const target = Math.round((weightKg * 35) / 50) * 50; // округление до 50 мл
        if (get().autoTarget) set({ dailyTargetMl: target });
        return target;
      },
      todayMl: () => {
        const today = todayIso();
        const d = get().history.find((x) => x.date === today);
        return (d?.glasses ?? 0) * get().glassMl;
      },
      progress: () => {
        const cur = get().todayMl();
        return Math.min(1, cur / get().dailyTargetMl);
      },
    }),
    {
      name: 'ai_trainer_water',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
