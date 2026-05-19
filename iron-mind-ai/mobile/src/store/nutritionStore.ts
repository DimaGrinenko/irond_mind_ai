import { create } from 'zustand';
import {
  createNutritionEntry,
  deleteNutritionEntry,
  listNutritionEntries,
  type MealType,
  type NutritionEntryRow,
} from '../db/nutritionRepo';
import { todayIsoDate } from '../utils/date';

export type NutritionState = {
  date: string;
  entries: NutritionEntryRow[];
  loading: boolean;
  setDate: (date: string) => void;
  hydrate: () => Promise<void>;
  addEntry: (e: Omit<NutritionEntryRow, 'id' | 'date'> & { date?: string }) => Promise<NutritionEntryRow>;
  remove: (id: number) => Promise<void>;
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
  addEntry: async (e) => {
    const date = e.date ?? get().date;
    const row = await createNutritionEntry({
      date,
      meal_type: e.meal_type as MealType,
      name: e.name,
      calories: e.calories,
      protein: e.protein,
      fats: e.fats,
      carbs: e.carbs,
      time: e.time,
    });
    set({ entries: [...get().entries, row] });
    return row;
  },
  remove: async (id) => {
    await deleteNutritionEntry(id);
    set({ entries: get().entries.filter((r) => r.id !== id) });
  },
}));

