import { create } from 'zustand';
import { createNutritionEntry, listNutritionEntries, type MealType, type NutritionEntryRow } from '../db/nutritionRepo';
import { todayIsoDate } from '../utils/date';

export type NutritionState = {
  date: string;
  entries: NutritionEntryRow[];
  loading: boolean;
  setDate: (date: string) => void;
  hydrate: () => Promise<void>;
  addQuickSnack: () => Promise<NutritionEntryRow>;
};

export const useNutritionStore = create<NutritionState>()((set, get) => ({
  date: todayIsoDate(),
  entries: [],
  loading: false,
  setDate: (date) => set({ date }),
  hydrate: async () => {
    set({ loading: true });
    try {
      set({ entries: await listNutritionEntries(get().date) });
    } finally {
      set({ loading: false });
    }
  },
  addQuickSnack: async () => {
    const date = get().date;
    const row = await createNutritionEntry({
      date,
      meal_type: 'snack' as MealType,
      name: 'Протеиновый батончик',
      calories: 210,
      protein: 20,
      fats: 7,
      carbs: 18,
      time: '16:30',
    });
    set({ entries: [...get().entries, row] });
    return row;
  },
}));

