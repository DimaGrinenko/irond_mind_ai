import { getAllAsync, getFirstAsync, runAsync } from './client';

export type WorkoutRow = {
  id: number;
  date: string;
  program_id: string | null;
  name: string | null;
  duration_seconds: number | null;
  calories: number | null;
  completed: number;
};

export async function listWorkouts(limit = 50) {
  return await getAllAsync<WorkoutRow>(
    'SELECT * FROM workouts ORDER BY date DESC, id DESC LIMIT ?',
    [limit],
  );
}

export async function createWorkout(input: { date: string; programId?: string | null; name?: string | null }) {
  const res = await runAsync(
    'INSERT INTO workouts (date, program_id, name, duration_seconds, calories, completed) VALUES (?, ?, ?, NULL, NULL, 0)',
    [input.date, input.programId ?? null, input.name ?? null],
  );
  const id = Number(res?.lastInsertRowId ?? res?.insertId);
  const row = await getFirstAsync<WorkoutRow>('SELECT * FROM workouts WHERE id = ?', [id]);
  if (!row) throw new Error('Workout insert failed');
  return row;
}

export async function setWorkoutCompleted(workoutId: number, completed: boolean) {
  await runAsync('UPDATE workouts SET completed = ? WHERE id = ?', [completed ? 1 : 0, workoutId]);
}

