import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type MealTemplateItem = {
  name: string;
  grams: number;
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
};

export type MealTemplate = {
  id: string;
  title: string;
  items: MealTemplateItem[];
  totals: { calories: number; protein: number; fats: number; carbs: number };
  createdAt: number;
};

type State = {
  templates: MealTemplate[];
  add: (title: string, items: MealTemplateItem[]) => MealTemplate;
  remove: (id: string) => void;
  rename: (id: string, title: string) => void;
};

function uid() {
  return `mt_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

function totalsOf(items: MealTemplateItem[]) {
  return items.reduce(
    (acc, x) => {
      acc.calories += x.calories;
      acc.protein += x.protein;
      acc.fats += x.fats;
      acc.carbs += x.carbs;
      return acc;
    },
    { calories: 0, protein: 0, fats: 0, carbs: 0 },
  );
}

export const useMealTemplatesStore = create<State>()(
  persist(
    (set, get) => ({
      templates: [],
      add: (title, items) => {
        const tpl: MealTemplate = {
          id: uid(),
          title: title.trim() || 'Без названия',
          items,
          totals: totalsOf(items),
          createdAt: Date.now(),
        };
        set({ templates: [tpl, ...get().templates] });
        return tpl;
      },
      remove: (id) => set({ templates: get().templates.filter((t) => t.id !== id) }),
      rename: (id, title) =>
        set({
          templates: get().templates.map((t) => (t.id === id ? { ...t, title: title.trim() || t.title } : t)),
        }),
    }),
    {
      name: 'ai_trainer_meal_templates',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
