import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api, type CycleState as ServerCycle } from '../api/client';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

/**
 * Menstrual-cycle store. The server (UserProgress.cycle*) is canonical; the
 * local cache is optimistic and reconciled on every refresh()/mutation.
 * Phase/day are computed locally for instant UI but mirror the backend formula.
 */
type State = {
  lastPeriodStart: string | null;
  cycleLength: number; // 20..40, обычно 28
  enabled: boolean;
  /** Подтянуть состояние с сервера (источник истины). */
  refresh: () => Promise<void>;
  applyServer: (s: ServerCycle) => void;
  setEnabled: (v: boolean) => void;
  setLastPeriod: (date: string) => void;
  setCycleLength: (n: number) => void;
  currentPhase: () => CyclePhase | null;
  dayOfCycle: () => number | null;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

export function computeDayOfCycle(
  lastPeriodStart: string | null,
  cycleLength: number,
): number | null {
  if (!lastPeriodStart) return null;
  const start = new Date(lastPeriodStart + 'T00:00:00');
  if (Number.isNaN(start.getTime())) return null;
  const days = Math.floor((Date.now() - start.getTime()) / MS_PER_DAY);
  if (days < 0) return null;
  return (days % cycleLength) + 1;
}

export function phaseForDay(
  day: number | null,
  cycleLength = 28,
): CyclePhase | null {
  if (day == null) return null;
  const ovulationDay = Math.round(cycleLength / 2);
  if (day <= 5) return 'menstrual';
  if (day < ovulationDay - 1) return 'follicular';
  if (day <= ovulationDay + 1) return 'ovulation';
  return 'luteal';
}

export const useCycleStore = create<State>()(
  persist(
    (set, get) => ({
      lastPeriodStart: null,
      cycleLength: 28,
      enabled: false,
      applyServer: (s) =>
        set({
          enabled: s.enabled,
          lastPeriodStart: s.lastPeriodStart,
          cycleLength: s.cycleLength,
        }),
      refresh: async () => {
        try {
          get().applyServer(await api.cycle.get());
        } catch {
          /* offline — оставляем локальный кэш */
        }
      },
      setEnabled: (v) => {
        set({ enabled: v });
        api.cycle.update({ enabled: v }).catch(() => get().refresh());
      },
      setLastPeriod: (date) => {
        set({ lastPeriodStart: date });
        api.cycle
          .update({ lastPeriodStart: date })
          .catch(() => get().refresh());
      },
      setCycleLength: (n) => {
        const clamped = Math.max(20, Math.min(40, n));
        set({ cycleLength: clamped });
        api.cycle.update({ cycleLength: clamped }).catch(() => get().refresh());
      },
      dayOfCycle: () =>
        computeDayOfCycle(get().lastPeriodStart, get().cycleLength),
      currentPhase: () => phaseForDay(get().dayOfCycle(), get().cycleLength),
    }),
    {
      name: 'ai_trainer_cycle',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
