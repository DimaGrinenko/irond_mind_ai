import { getAllAsync, getFirstAsync, runAsync } from './client';

export type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

export type NutritionEntryRow = {
  id: number;
  date: string;
  meal_type: MealType;
  name: string | null;
  calories: number | null;
  protein: number | null;
  fats: number | null;
  carbs: number | null;
  time: string | null;
};

export async function listNutritionEntries(date: string) {
  return await getAllAsync<NutritionEntryRow>(
    'SELECT * FROM nutrition_entries WHERE date = ? ORDER BY time ASC, id ASC',
    [date],
  );
}

export async function createNutritionEntry(row: Omit<NutritionEntryRow, 'id'>) {
  const res = await runAsync(
    `INSERT INTO nutrition_entries (date, meal_type, name, calories, protein, fats, carbs, time)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    [row.date, row.meal_type, row.name, row.calories, row.protein, row.fats, row.carbs, row.time],
  );
  const id = Number(res?.lastInsertRowId ?? res?.insertId);
  const saved = await getFirstAsync<NutritionEntryRow>('SELECT * FROM nutrition_entries WHERE id = ?', [id]);
  if (!saved) throw new Error('Nutrition entry insert failed');
  return saved;
}

