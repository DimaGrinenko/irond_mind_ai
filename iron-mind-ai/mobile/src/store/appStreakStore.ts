import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

function todayIso(): string {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function isYesterday(iso: string): boolean {
  if (!iso) return false;
  const t = new Date();
  t.setHours(0, 0, 0, 0);
  const y = new Date(t);
  y.setDate(t.getDate() - 1);
  return iso === y.toISOString().slice(0, 10);
}

function monthOf(iso: string): string {
  return iso.slice(0, 7); // YYYY-MM
}

function daysBetween(a: string, b: string): number {
  const d1 = new Date(a);
  const d2 = new Date(b);
  return Math.round((d2.getTime() - d1.getTime()) / (1000 * 60 * 60 * 24));
}

export type StreakFreezeUse = { date: string };

export type AppStreakState = {
  streakDays: number;
  longestStreak: number;
  lastOpenDate: string | null;
  /** Использованные «заморозки» — список дат. На каждый месяц даём бесплатных 2. */
  freezesUsed: StreakFreezeUse[];
  freezesPerMonth: number;
  /** Зарегистрировать заход — вызывается при mount App.
   *  Если пропустили 1 день и есть свободный freeze в этом месяце — автоматически потратим его. */
  registerOpen: () => { used: boolean; brokeStreak: boolean };
  freezeRemainingThisMonth: () => number;
  reset: () => void;
};

export const useAppStreakStore = create<AppStreakState>()(
  persist(
    (set, get) => ({
      streakDays: 0,
      longestStreak: 0,
      lastOpenDate: null,
      freezesUsed: [],
      freezesPerMonth: 2,

      registerOpen: () => {
        const today = todayIso();
        const last = get().lastOpenDate;
        if (last === today) return { used: false, brokeStreak: false };

        let next: number;
        let used = false;
        let brokeStreak = false;

        if (!last) {
          next = 1;
        } else if (isYesterday(last)) {
          next = get().streakDays + 1;
        } else {
          // пропущен 1+ день — проверим freeze
          const gap = Math.max(1, daysBetween(last, today) - 1);
          const month = monthOf(today);
          const usedThisMonth = get().freezesUsed.filter((f) => monthOf(f.date) === month).length;
          const remaining = get().freezesPerMonth - usedThisMonth;
          if (gap === 1 && remaining > 0) {
            next = get().streakDays + 1;
            used = true;
            set({ freezesUsed: [...get().freezesUsed, { date: today }] });
          } else {
            next = 1;
            brokeStreak = true;
          }
        }

        const longest = Math.max(get().longestStreak, next);
        set({ streakDays: next, longestStreak: longest, lastOpenDate: today });
        return { used, brokeStreak };
      },

      freezeRemainingThisMonth: () => {
        const month = monthOf(todayIso());
        const usedThisMonth = get().freezesUsed.filter((f) => monthOf(f.date) === month).length;
        return Math.max(0, get().freezesPerMonth - usedThisMonth);
      },

      reset: () => set({ streakDays: 0, longestStreak: 0, lastOpenDate: null, freezesUsed: [] }),
    }),
    {
      name: 'ai_trainer_app_streak',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
    },
  ),
);
