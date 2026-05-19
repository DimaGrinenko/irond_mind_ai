import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

function todayIso() {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayIso() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

/** Спин-сектора колеса (вес = вероятность). */
export const WHEEL_SECTORS = [
  { value: 10,  weight: 28, color: '#9D9DAE' },
  { value: 25,  weight: 22, color: '#3FA8FF' },
  { value: 50,  weight: 18, color: '#00E5FF' },
  { value: 75,  weight: 14, color: '#9D6BFF' },
  { value: 100, weight: 10, color: '#FFD27A' },
  { value: 200, weight: 5,  color: '#FF4DD2' },
  { value: 500, weight: 2,  color: '#FFB547' },
  { value: 1000, weight: 1, color: '#FF4D6D' },
];

/** Спин — выбирает сектор по весам. */
export function spinWheel(): { value: number; index: number } {
  const total = WHEEL_SECTORS.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (let i = 0; i < WHEEL_SECTORS.length; i++) {
    r -= WHEEL_SECTORS[i].weight;
    if (r <= 0) return { value: WHEEL_SECTORS[i].value, index: i };
  }
  return { value: WHEEL_SECTORS[0].value, index: 0 };
}

type State = {
  /** Дата последнего спина */
  lastSpinDate: string | null;
  /** Сколько дней подряд крутил (множитель ×1, ×1.25, ×1.5, ×2 на 7-й день) */
  streakDays: number;
  spin: () => { ok: false } | { ok: true; value: number; multiplier: number; total: number };
  canSpinToday: () => boolean;
};

export const useDailyBonusStore = create<State>()(
  persist(
    (set, get) => ({
      lastSpinDate: null,
      streakDays: 0,
      canSpinToday: () => get().lastSpinDate !== todayIso(),
      spin: () => {
        if (get().lastSpinDate === todayIso()) return { ok: false };
        const last = get().lastSpinDate;
        const nextStreak = last === yesterdayIso() ? get().streakDays + 1 : 1;
        const multiplier =
          nextStreak >= 7 ? 2 :
          nextStreak >= 5 ? 1.5 :
          nextStreak >= 3 ? 1.25 :
          1;
        const { value } = spinWheel();
        const total = Math.round(value * multiplier);
        set({ lastSpinDate: todayIso(), streakDays: nextStreak });
        return { ok: true, value, multiplier, total };
      },
    }),
    {
      name: 'ai_trainer_daily_bonus',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
