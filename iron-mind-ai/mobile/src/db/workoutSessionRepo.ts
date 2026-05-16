import { getAllAsync, getFirstAsync, runAsync } from './client';

export type WorkoutExerciseRow = {
  id: number;
  workout_id: number;
  exercise_id: string;
  completed: number;
};

export type ExerciseSetRow = {
  id: number;
  workout_exercise_id: number;
  set_number: number;
  weight: number | null;
  reps: number | null;
  completed: number;
};

export async function ensureWorkoutExercise(workoutId: number, exerciseId: string) {
  const existing = await getFirstAsync<WorkoutExerciseRow>(
    'SELECT * FROM workout_exercises WHERE workout_id = ? AND exercise_id = ?',
    [workoutId, exerciseId],
  );
  if (existing) return existing;
  const res = await runAsync(
    'INSERT INTO workout_exercises (workout_id, exercise_id, completed) VALUES (?, ?, 0)',
    [workoutId, exerciseId],
  );
  const id = Number(res?.lastInsertRowId ?? res?.insertId);
  const saved = await getFirstAsync<WorkoutExerciseRow>('SELECT * FROM workout_exercises WHERE id = ?', [id]);
  if (!saved) throw new Error('Workout exercise insert failed');
  return saved;
}

export async function listExerciseSets(workoutExerciseId: number) {
  return await getAllAsync<ExerciseSetRow>(
    'SELECT * FROM exercise_sets WHERE workout_exercise_id = ? ORDER BY set_number ASC, id ASC',
    [workoutExerciseId],
  );
}

export async function upsertExerciseSet(input: {
  workoutExerciseId: number;
  setNumber: number;
  weight: number | null;
  reps: number | null;
  completed: boolean;
}) {
  const existing = await getFirstAsync<ExerciseSetRow>(
    'SELECT * FROM exercise_sets WHERE workout_exercise_id = ? AND set_number = ?',
    [input.workoutExerciseId, input.setNumber],
  );
  if (existing) {
    await runAsync(
      'UPDATE exercise_sets SET weight = ?, reps = ?, completed = ? WHERE id = ?',
      [input.weight, input.reps, input.completed ? 1 : 0, existing.id],
    );
    const saved = await getFirstAsync<ExerciseSetRow>('SELECT * FROM exercise_sets WHERE id = ?', [existing.id]);
    if (!saved) throw new Error('Exercise set update failed');
    return saved;
  }

  const res = await runAsync(
    'INSERT INTO exercise_sets (workout_exercise_id, set_number, weight, reps, completed) VALUES (?, ?, ?, ?, ?)',
    [input.workoutExerciseId, input.setNumber, input.weight, input.reps, input.completed ? 1 : 0],
  );
  const id = Number(res?.lastInsertRowId ?? res?.insertId);
  const saved = await getFirstAsync<ExerciseSetRow>('SELECT * FROM exercise_sets WHERE id = ?', [id]);
  if (!saved) throw new Error('Exercise set insert failed');
  return saved;
}

