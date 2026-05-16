import { create } from 'zustand';
import { createWorkout, listWorkouts, setWorkoutCompleted, type WorkoutRow } from '../db/workoutsRepo';
import { todayIsoDate } from '../utils/date';

export type WorkoutsState = {
  workouts: WorkoutRow[];
  loading: boolean;
  hydrate: () => Promise<void>;
  startQuickWorkout: () => Promise<WorkoutRow>;
  markCompleted: (workoutId: number, completed: boolean) => Promise<void>;
};

export const useWorkoutsStore = create<WorkoutsState>()((set, get) => ({
  workouts: [],
  loading: false,
  hydrate: async () => {
    set({ loading: true });
    try {
      const workouts = await listWorkouts(50);
      set({ workouts });
    } finally {
      set({ loading: false });
    }
  },
  startQuickWorkout: async () => {
    const w = await createWorkout({ date: todayIsoDate(), programId: null, name: 'Сегодняшняя тренировка' });
    set({ workouts: [w, ...get().workouts] });
    return w;
  },
  markCompleted: async (workoutId, completed) => {
    await setWorkoutCompleted(workoutId, completed);
    set({
      workouts: get().workouts.map((w) => (w.id === workoutId ? { ...w, completed: completed ? 1 : 0 } : w)),
    });
  },
}));

