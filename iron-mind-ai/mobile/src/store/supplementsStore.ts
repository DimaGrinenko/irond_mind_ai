import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type UserSupplement = {
  id: string;
  /** ссылка на supplements.id */
  supplementId: string;
  /** Своё кастомное название (если хочется) или копия из базы */
  name: string;
  /** Сколько принимать в день */
  dose: string;
  /** Когда принимать */
  timing: string;
  /** Заметка */
  notes?: string;
  /** Активен ли (показывать в трекере) */
  active: boolean;
  addedAt: string;
};

export type SupplementTake = {
  id: string;
  userSupplementId: string;
  date: string; // ISO yyyy-mm-dd
  time: string; // HH:mm
};

export type SupplementsState = {
  items: UserSupplement[];
  log: SupplementTake[];
  add: (s: Omit<UserSupplement, 'id' | 'addedAt' | 'active'>) => void;
  update: (id: string, patch: Partial<UserSupplement>) => void;
  remove: (id: string) => void;
  toggleActive: (id: string) => void;
  registerTake: (userSupplementId: string) => void;
  removeTake: (id: string) => void;
};

function uid() {
  return `${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 8)}`;
}

function todayIso() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}
function nowHHmm() {
  const d = new Date();
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export const useSupplementsStore = create<SupplementsState>()(
  persist(
    (set, get) => ({
      items: [],
      log: [],
      add: (s) => {
        const item: UserSupplement = {
          id: uid(),
          addedAt: new Date().toISOString(),
          active: true,
          ...s,
        };
        set({ items: [...get().items, item] });
      },
      update: (id, patch) => {
        set({ items: get().items.map((x) => (x.id === id ? { ...x, ...patch } : x)) });
      },
      remove: (id) => {
        set({
          items: get().items.filter((x) => x.id !== id),
          log: get().log.filter((t) => t.userSupplementId !== id),
        });
      },
      toggleActive: (id) => {
        set({ items: get().items.map((x) => (x.id === id ? { ...x, active: !x.active } : x)) });
      },
      registerTake: (userSupplementId) => {
        const take: SupplementTake = {
          id: uid(),
          userSupplementId,
          date: todayIso(),
          time: nowHHmm(),
        };
        set({ log: [...get().log, take] });
      },
      removeTake: (id) => {
        set({ log: get().log.filter((t) => t.id !== id) });
      },
    }),
    {
      name: 'ai_trainer_supplements',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
