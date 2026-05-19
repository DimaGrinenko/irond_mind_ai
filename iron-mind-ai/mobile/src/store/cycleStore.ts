import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export const PHASE_INFO: Record<CyclePhase, { title: string; advice: string; emoji: string }> = {
  menstrual: {
    title: 'Менструальная (1-5 день)',
    advice: 'Лёгкие тренировки, йога, прогулки. Слушай тело.',
    emoji: '🌑',
  },
  follicular: {
    title: 'Фолликулярная (6-13 день)',
    advice: 'Пик энергии — лучшее окно для PR-силовых и интенсивности.',
    emoji: '🌒',
  },
  ovulation: {
    title: 'Овуляция (14-16 день)',
    advice: 'Сильно вырастает риск травм связок. Избегай максимальных весов.',
    emoji: '🌕',
  },
  luteal: {
    title: 'Лютеиновая (17-28 день)',
    advice: 'Снижение работоспособности. Умеренная нагрузка, больше кардио.',
    emoji: '🌘',
  },
};

type State = {
  lastPeriodStart: string | null;
  cycleLength: number; // обычно 28
  enabled: boolean;
  setEnabled: (v: boolean) => void;
  setLastPeriod: (date: string) => void;
  setCycleLength: (n: number) => void;
  currentPhase: () => CyclePhase | null;
  dayOfCycle: () => number | null;
};

export const useCycleStore = create<State>()(
  persist(
    (set, get) => ({
      lastPeriodStart: null,
      cycleLength: 28,
      enabled: false,
      setEnabled: (v) => set({ enabled: v }),
      setLastPeriod: (date) => set({ lastPeriodStart: date }),
      setCycleLength: (n) => set({ cycleLength: Math.max(20, Math.min(40, n)) }),
      dayOfCycle: () => {
        const start = get().lastPeriodStart;
        if (!start) return null;
        const ms = Date.now() - new Date(start).getTime();
        const days = Math.floor(ms / (1000 * 60 * 60 * 24));
        return (days % get().cycleLength) + 1;
      },
      currentPhase: () => {
        const day = get().dayOfCycle();
        if (day == null) return null;
        if (day <= 5) return 'menstrual';
        if (day <= 13) return 'follicular';
        if (day <= 16) return 'ovulation';
        return 'luteal';
      },
    }),
    {
      name: 'ai_trainer_cycle',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
