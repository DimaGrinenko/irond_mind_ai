import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type Friend = {
  id: string;
  /** @handle */
  handle: string;
  name: string;
  /** ожидание приглашения / принят */
  status: 'pending' | 'accepted';
  addedAt: number;
};

type State = {
  friends: Friend[];
  /** Отправить инвайт по @handle или userId. Возвращает созданую запись (или null если уже есть). */
  invite: (target: string) => Friend | null;
  remove: (id: string) => void;
  search: (q: string) => Friend[];
};

function uid() {
  return `fr_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function normalizeHandle(s: string): string {
  return s.trim().replace(/^@/, '').toLowerCase();
}

export const useFriendsStore = create<State>()(
  persist(
    (set, get) => ({
      friends: [],
      invite: (target) => {
        const t = target.trim();
        if (!t) return null;
        const isId = t.length > 12 && !/\s/.test(t);
        const handle = isId ? null : normalizeHandle(t);
        const existing = get().friends.find(
          (f) => (handle && f.handle === handle) || (isId && f.id === t),
        );
        if (existing) return existing;
        const friend: Friend = {
          id: isId ? t : uid(),
          handle: handle ?? t.slice(0, 8),
          name: handle ?? t,
          status: 'pending',
          addedAt: Date.now(),
        };
        set({ friends: [friend, ...get().friends] });
        return friend;
      },
      remove: (id) => set({ friends: get().friends.filter((f) => f.id !== id) }),
      search: (q) => {
        const term = normalizeHandle(q);
        if (!term) return get().friends;
        return get().friends.filter(
          (f) => f.handle.includes(term) || f.name.toLowerCase().includes(term) || f.id.includes(term),
        );
      },
    }),
    {
      name: 'ai_trainer_friends',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
