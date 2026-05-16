import { getAllAsync, getFirstAsync } from './client';

export type WeeklyStats = {
  workoutsCount: number;
  volumeKg: number;
  nutritionCalories: number;
  chartWorkouts: number[];
  chartVolume: number[];
  muscleLoad: Record<string, number>;
};

const MUSCLE_MAP: Record<string, string> = {
  bench_press: 'chest',
  incline_db_press: 'chest',
  db_fly: 'chest',
  squat: 'legs',
  leg_press: 'legs',
  deadlift: 'back',
  lat_pulldown: 'back',
  ohp: 'shoulders',
  plank: 'core',
};

export async function loadWeeklyStats(days = 7): Promise<WeeklyStats> {
  const since = new Date();
  since.setDate(since.getDate() - (days - 1));
  since.setHours(0, 0, 0, 0);
  const sinceIso = since.toISOString().slice(0, 10);

  const workouts = await getAllAsync<{ id: number; date: string; completed: number }>(
    'SELECT id, date, completed FROM workouts WHERE date >= ? ORDER BY date ASC',
    [sinceIso],
  );
  const completed = workouts.filter((w) => w.completed === 1);

  const sets = await getAllAsync<{ weight: number | null; reps: number | null; exercise_id: string; date: string }>(
    `SELECT es.weight, es.reps, we.exercise_id, w.date
     FROM exercise_sets es
     JOIN workout_exercises we ON we.id = es.workout_exercise_id
     JOIN workouts w ON w.id = we.workout_id
     WHERE w.date >= ? AND es.completed = 1 AND w.completed = 1`,
    [sinceIso],
  );

  const nutrition = await getAllAsync<{ calories: number; date: string }>(
    'SELECT calories, date FROM nutrition_entries WHERE date >= ?',
    [sinceIso],
  );

  let volumeKg = 0;
  const muscleLoad: Record<string, number> = {
    chest: 0,
    back: 0,
    legs: 0,
    shoulders: 0,
    arms: 0,
    core: 0,
  };

  for (const s of sets) {
    const v = (s.weight ?? 0) * (s.reps ?? 0);
    volumeKg += v;
    const key = MUSCLE_MAP[s.exercise_id] ?? 'core';
    if (key === 'arms') muscleLoad.arms += v;
    else muscleLoad[key] = (muscleLoad[key] ?? 0) + v;
  }

  const chartWorkouts: number[] = [];
  const chartVolume: number[] = [];
  for (let i = 0; i < days; i++) {
    const d = new Date(since);
    d.setDate(since.getDate() + i);
    const key = d.toISOString().slice(0, 10);
    chartWorkouts.push(completed.filter((w) => w.date === key).length);
    const dayVol = sets.filter((s) => s.date === key).reduce((acc, s) => acc + (s.weight ?? 0) * (s.reps ?? 0), 0);
    chartVolume.push(Math.round(dayVol / 100) || 0);
  }

  const maxMuscle = Math.max(1, ...Object.values(muscleLoad));
  const normalized: Record<string, number> = {};
  for (const [k, v] of Object.entries(muscleLoad)) normalized[k] = v / maxMuscle;

  const nutritionCalories = nutrition.reduce((s, n) => s + (n.calories ?? 0), 0);

  return {
    workoutsCount: completed.length,
    volumeKg: Math.round(volumeKg),
    nutritionCalories,
    chartWorkouts,
    chartVolume,
    muscleLoad: normalized,
  };
}

export async function loadLatestWeight(): Promise<number | null> {
  const row = await getFirstAsync<{ weight: number | null }>(
    'SELECT weight FROM measurements WHERE weight IS NOT NULL ORDER BY date DESC LIMIT 1',
  );
  return row?.weight ?? null;
}
