import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CHALLENGES } from '../data/challenges';

export type ChallengeProgress = {
  id: string;
  joined: boolean;
  /** Дата старта (для окна) */
  startedAt: string | null;
  current: number;
  completedAt: string | null;
  rewardClaimed: boolean;
};

type State = {
  progress: Record<string, ChallengeProgress>;
  join: (id: string) => void;
  leave: (id: string) => void;
  setCurrent: (id: string, current: number) => void;
  complete: (id: string) => void;
  claim: (id: string) => number; // вернёт начисленные листики
};

export const useChallengesStore = create<State>()(
  persist(
    (set, get) => ({
      progress: {},
      join: (id) => {
        const today = new Date().toISOString().slice(0, 10);
        set({
          progress: {
            ...get().progress,
            [id]: { id, joined: true, startedAt: today, current: 0, completedAt: null, rewardClaimed: false },
          },
        });
      },
      leave: (id) => {
        const next = { ...get().progress };
        delete next[id];
        set({ progress: next });
      },
      setCurrent: (id, current) => {
        const p = get().progress[id];
        if (!p) return;
        set({ progress: { ...get().progress, [id]: { ...p, current } } });
      },
      complete: (id) => {
        const p = get().progress[id];
        if (!p) return;
        const today = new Date().toISOString().slice(0, 10);
        set({ progress: { ...get().progress, [id]: { ...p, completedAt: today } } });
      },
      claim: (id) => {
        const p = get().progress[id];
        if (!p || !p.completedAt || p.rewardClaimed) return 0;
        const def = CHALLENGES.find((c) => c.id === id);
        if (!def) return 0;
        set({ progress: { ...get().progress, [id]: { ...p, rewardClaimed: true } } });
        return def.reward;
      },
    }),
    {
      name: 'ai_trainer_challenges',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
