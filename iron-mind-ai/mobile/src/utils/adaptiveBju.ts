/**
 * Адаптивные KBJU — пересчёт под текущий вес/цель/активность по Mifflin-St Jeor.
 */
import type { Gender, FitnessGoalKey, ActivityLevel } from '../store/userStore';

const ACTIVITY_FACTOR: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

const GOAL_DELTA: Record<FitnessGoalKey, number> = {
  mass: 0.15,      // профицит 15%
  cut: -0.20,      // дефицит 20%
  strength: 0.05,  // лёгкий профицит
  endurance: 0,    // поддержка
  abs: -0.15,      // лёгкий дефицит
};

export type BjuTargets = {
  calories: number;
  protein: number;
  fats: number;
  carbs: number;
  bmr: number;
  tdee: number;
};

export function computeBju({
  gender,
  age,
  heightCm,
  weightKg,
  activity,
  goalKey,
}: {
  gender: Gender | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  activity: ActivityLevel | null;
  goalKey: FitnessGoalKey | null;
}): BjuTargets | null {
  if (!gender || !age || !heightCm || !weightKg || !activity || !goalKey) return null;

  const bmr =
    gender === 'female'
      ? 10 * weightKg + 6.25 * heightCm - 5 * age - 161
      : 10 * weightKg + 6.25 * heightCm - 5 * age + 5;

  const tdee = bmr * ACTIVITY_FACTOR[activity];
  const calories = Math.round(tdee * (1 + GOAL_DELTA[goalKey]));

  // Белок: 2.0г/кг для mass, 2.4г/кг для cut, 1.8 для остальных
  const proteinPerKg = goalKey === 'cut' ? 2.4 : goalKey === 'mass' ? 2.0 : 1.8;
  const protein = Math.round(weightKg * proteinPerKg);

  // Жиры: 25-30% от калорий
  const fats = Math.round((calories * 0.27) / 9);

  // Углеводы — остаток
  const proteinKcal = protein * 4;
  const fatsKcal = fats * 9;
  const carbsKcal = Math.max(0, calories - proteinKcal - fatsKcal);
  const carbs = Math.round(carbsKcal / 4);

  return { calories, protein, fats, carbs, bmr: Math.round(bmr), tdee: Math.round(tdee) };
}
