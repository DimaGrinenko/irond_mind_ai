import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { daysBetween, todayIsoDate } from '../utils/date';

export const XP_PER_LEVEL = 500;
export const WEEKLY_GOAL = 4;

/** Уровень по суммарному XP (1-based). */
export function levelForXp(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}
/** Прогресс внутри текущего уровня, 0..1. */
export function levelProgress(xp: number): number {
  return (xp % XP_PER_LEVEL) / XP_PER_LEVEL;
}
/** XP, набранный внутри текущего уровня. */
export function xpInLevel(xp: number): number {
  return xp % XP_PER_LEVEL;
}

export type AwardResult = {
  gainedXp: number;
  leveledUp: boolean;
  level: number;
  streak: number;
};

export type ProgressState = {
  xp: number;
  streak: number;
  bestStreak: number;
  totalWorkouts: number;
  lastWorkoutDate: string | null;
  weekStartDate: string | null;
  weekWorkouts: number;
  /** Начислить прогресс за завершённую тренировку. */
  awardWorkout: () => AwardResult;
  reset: () => void;
};

export const useProgressStore = create<ProgressState>()(
  persist(
    (set, get) => ({
      xp: 0,
      streak: 0,
      bestStreak: 0,
      totalWorkouts: 0,
      lastWorkoutDate: null,
      weekStartDate: null,
      weekWorkouts: 0,

      awardWorkout: () => {
        const s = get();
        const today = todayIsoDate();
        const prevLevel = levelForXp(s.xp);

        // --- стрик ---
        let streak = s.streak;
        if (s.lastWorkoutDate === today) {
          // вторая тренировка за день — стрик не меняем
        } else if (s.lastWorkoutDate && daysBetween(s.lastWorkoutDate, today) === 1) {
          streak = s.streak + 1;
        } else {
          streak = 1;
        }

        // --- недельное окно (скользящие 7 дней) ---
        let weekStartDate = s.weekStartDate;
        let weekWorkouts = s.weekWorkouts;
        if (!weekStartDate || daysBetween(weekStartDate, today) >= 7) {
          weekStartDate = today;
          weekWorkouts = 0;
        }
        weekWorkouts += 1;

        // --- XP: база + бонус за стрик ---
        const gainedXp = 100 + Math.min(streak, 14) * 10;
        const xp = s.xp + gainedXp;
        const level = levelForXp(xp);

        set({
          xp,
          streak,
          bestStreak: Math.max(s.bestStreak, streak),
          totalWorkouts: s.totalWorkouts + 1,
          lastWorkoutDate: today,
          weekStartDate,
          weekWorkouts,
        });

        return { gainedXp, leveledUp: level > prevLevel, level, streak };
      },

      reset: () =>
        set({
          xp: 0,
          streak: 0,
          bestStreak: 0,
          totalWorkouts: 0,
          lastWorkoutDate: null,
          weekStartDate: null,
          weekWorkouts: 0,
        }),
    }),
    {
      name: 'ai_trainer_progress',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
