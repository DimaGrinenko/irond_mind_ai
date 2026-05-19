import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { registerCustomFoods, type Food } from '../data/foods';

export type CustomFood = Food & { custom: true };

type State = {
  list: CustomFood[];
  add: (f: Omit<CustomFood, 'id' | 'custom'>) => CustomFood;
  remove: (id: string) => void;
  hydrate: () => void;
};

function uid() {
  return `my_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export const useCustomFoodsStore = create<State>()(
  persist(
    (set, get) => ({
      list: [],
      add: (f) => {
        const item: CustomFood = { ...f, id: uid(), custom: true };
        const next = [item, ...get().list];
        set({ list: next });
        registerCustomFoods(next);
        return item;
      },
      remove: (id) => {
        const next = get().list.filter((x) => x.id !== id);
        set({ list: next });
        registerCustomFoods(next);
      },
      hydrate: () => {
        registerCustomFoods(get().list);
      },
    }),
    {
      name: 'ai_trainer_custom_foods',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
      onRehydrateStorage: () => (state) => {
        if (state) registerCustomFoods(state.list);
      },
    },
  ),
);
