import { create } from 'zustand';
import { ensureWorkoutExercise, upsertExerciseSet } from '../db/workoutSessionRepo';
import { createWorkout, setWorkoutCompleted, type WorkoutRow } from '../db/workoutsRepo';
import { todayIsoDate } from '../utils/date';

export type ActiveExercise = {
  exerciseId: string;
  sets: Array<{ setNumber: number; weight: string; reps: string; done: boolean }>;
};

export type ActiveWorkoutState = {
  workout: WorkoutRow | null;
  title: string;
  exercises: ActiveExercise[];
  startedAt: number | null;

  start: (title: string, exerciseIds: string[]) => Promise<void>;
  updateSet: (exerciseId: string, setNumber: number, patch: Partial<ActiveExercise['sets'][number]>) => void;
  toggleSetDone: (exerciseId: string, setNumber: number) => void;
  addSet: (exerciseId: string) => void;
  persistAll: () => Promise<void>;
  finish: () => Promise<void>;
};

export const useActiveWorkoutStore = create<ActiveWorkoutState>()((set, get) => ({
  workout: null,
  title: 'Грудь + Трицепс',
  exercises: [],
  startedAt: null,

  start: async (title, exerciseIds) => {
    const workout = await createWorkout({ date: todayIsoDate(), programId: null, name: title });
    set({
      workout,
      title,
      startedAt: Date.now(),
      exercises: exerciseIds.map((id) => ({
        exerciseId: id,
        sets: [
          { setNumber: 1, weight: '', reps: '', done: false },
          { setNumber: 2, weight: '', reps: '', done: false },
          { setNumber: 3, weight: '', reps: '', done: false },
        ],
      })),
    });
  },

  updateSet: (exerciseId, setNumber, patch) => {
    set({
      exercises: get().exercises.map((e) =>
        e.exerciseId !== exerciseId
          ? e
          : {
              ...e,
              sets: e.sets.map((s) => (s.setNumber === setNumber ? { ...s, ...patch } : s)),
            },
      ),
    });
  },

  toggleSetDone: (exerciseId, setNumber) => {
    const ex = get().exercises.find((e) => e.exerciseId === exerciseId);
    const s = ex?.sets.find((x) => x.setNumber === setNumber);
    get().updateSet(exerciseId, setNumber, { done: !(s?.done ?? false) });
  },

  addSet: (exerciseId) => {
    set({
      exercises: get().exercises.map((e) => {
        if (e.exerciseId !== exerciseId) return e;
        const next = (e.sets[e.sets.length - 1]?.setNumber ?? 0) + 1;
        return { ...e, sets: [...e.sets, { setNumber: next, weight: '', reps: '', done: false }] };
      }),
    });
  },

  persistAll: async () => {
    const w = get().workout;
    if (!w) return;
    for (const ex of get().exercises) {
      const we = await ensureWorkoutExercise(w.id, ex.exerciseId);
      for (const s of ex.sets) {
        const weight = s.weight.trim() ? Number(s.weight.replace(',', '.')) : null;
        const reps = s.reps.trim() ? Number(s.reps.replace(',', '.')) : null;
        await upsertExerciseSet({
          workoutExerciseId: we.id,
          setNumber: s.setNumber,
          weight: weight !== null && Number.isFinite(weight) ? weight : null,
          reps: reps !== null && Number.isFinite(reps) ? reps : null,
          completed: s.done,
        });
      }
    }
  },

  finish: async () => {
    const w = get().workout;
    if (!w) return;
    await get().persistAll();
    await setWorkoutCompleted(w.id, true);
    set({ workout: null, exercises: [], startedAt: null });
  },
}));

