import { create } from 'zustand';
import { ensureWorkoutExercise, upsertExerciseSet } from '../db/workoutSessionRepo';
import { createWorkout, setWorkoutCompleted, type WorkoutRow } from '../db/workoutsRepo';
import { todayIsoDate } from '../utils/date';
import { api, getToken, type ExerciseHistory } from '../api/client';

export type ActiveExerciseSet = {
  setNumber: number;
  weight: string;
  reps: string;
  done: boolean;
};

export type ActiveExercise = {
  exerciseId: string;
  /** Сколько секунд отдыха между подходами (берётся из ProgramExercise). */
  restSeconds: number;
  /** Подсказки из последней тренировки и максимумов. */
  history: ExerciseHistory | null;
  sets: ActiveExerciseSet[];
};

export type StartExerciseInput = {
  exerciseId: string;
  /** Сколько подходов изначально (default 3). */
  setsCount?: number;
  /** Секунды отдыха между подходами (default 90). */
  restSeconds?: number;
};

export type ActiveWorkoutState = {
  workout: WorkoutRow | null;
  title: string;
  exercises: ActiveExercise[];
  startedAt: number | null;
  backendWorkoutId: string | null;
  scheduledWorkoutId: string | null;
  /** Длительность последней завершённой тренировки в мс (для summary). */
  lastDurationMs: number | null;
  /** Summary последней тренировки (для модалки итогов). */
  lastSummary: WorkoutSummary | null;

  start: (title: string, exercises: StartExerciseInput[] | string[]) => Promise<void>;
  updateSet: (exerciseId: string, setNumber: number, patch: Partial<ActiveExerciseSet>) => void;
  toggleSetDone: (exerciseId: string, setNumber: number) => void;
  addSet: (exerciseId: string) => void;
  /** Заменить упражнение по индексу — подтянет историю нового, скопирует кол-во подходов. */
  replaceExercise: (idx: number, newExerciseId: string) => Promise<void>;
  persistAll: () => Promise<void>;
  finish: () => Promise<WorkoutSummary | null>;
  clearSummary: () => void;
};

export type WorkoutSummary = {
  title: string;
  durationMs: number;
  totalSets: number;
  completedSets: number;
  totalVolumeKg: number;
  exerciseCount: number;
  prs: Array<{ exerciseId: string; weight: number; reps: number; previousMax: number | null }>;
  /** Авто-прогрессия — что добавить в следующий раз. */
  suggestions: Array<{ exerciseId: string; addKg: number; reason: string }>;
};

async function bgFetch<T>(fn: () => Promise<T>): Promise<T | null> {
  try {
    const token = await getToken();
    if (!token) return null;
    return await fn();
  } catch (e) {
    console.warn('[activeWorkout] backend call failed:', (e as Error).message);
    return null;
  }
}

function normalizeStart(input: StartExerciseInput[] | string[]): StartExerciseInput[] {
  return input.map((i) => (typeof i === 'string' ? { exerciseId: i } : i));
}

function initialSets(history: ExerciseHistory | null, count: number): ActiveExerciseSet[] {
  const last = history?.lastSet;
  const lastWeight = last?.weight ?? '';
  const lastReps = last?.reps ?? '';
  return Array.from({ length: count }, (_, idx) => ({
    setNumber: idx + 1,
    weight: lastWeight === '' ? '' : String(lastWeight),
    reps: lastReps === '' ? '' : String(lastReps),
    done: false,
  }));
}

export const useActiveWorkoutStore = create<ActiveWorkoutState>()((set, get) => ({
  workout: null,
  title: '',
  exercises: [],
  startedAt: null,
  backendWorkoutId: null,
  scheduledWorkoutId: null,
  lastDurationMs: null,
  lastSummary: null,

  start: async (title, raw) => {
    const inputs = normalizeStart(raw);
    const workout = await createWorkout({ date: todayIsoDate(), programId: null, name: title });

    const backend = await bgFetch(() =>
      api.workouts.create({ date: new Date().toISOString(), name: title }),
    );

    // Параллельно подтянем историю для каждого упражнения
    const histories = await Promise.all(
      inputs.map((i) => bgFetch(() => api.workouts.exerciseHistory(i.exerciseId))),
    );

    // Найти PLANNED тренировку на сегодня с таким же title
    const today = todayIsoDate();
    const schedule = await bgFetch(() => api.schedule.list(today, today));
    const matchedScheduled = Array.isArray(schedule)
      ? schedule.find((s) => s.status === 'PLANNED' && s.title === title) ?? null
      : null;

    const exercises: ActiveExercise[] = inputs.map((i, idx) => {
      const h = histories[idx];
      return {
        exerciseId: i.exerciseId,
        restSeconds: i.restSeconds ?? 90,
        history: h,
        sets: initialSets(h, 3),
      };
    });

    set({
      workout,
      title,
      startedAt: Date.now(),
      backendWorkoutId: backend?.id ?? null,
      scheduledWorkoutId: matchedScheduled?.id ?? null,
      exercises,
      lastDurationMs: null,
      lastSummary: null,
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
        const last = e.sets[e.sets.length - 1];
        return {
          ...e,
          sets: [
            ...e.sets,
            { setNumber: next, weight: last?.weight ?? '', reps: last?.reps ?? '', done: false },
          ],
        };
      }),
    });
  },

  replaceExercise: async (idx, newExerciseId) => {
    const current = get().exercises[idx];
    if (!current) return;
    const setsCount = current.sets.length || 3;
    const history = await bgFetch(() => api.workouts.exerciseHistory(newExerciseId));
    const newEx: ActiveExercise = {
      exerciseId: newExerciseId,
      restSeconds: current.restSeconds,
      history,
      sets: initialSets(history, setsCount),
    };
    const list = [...get().exercises];
    list[idx] = newEx;
    set({ exercises: list });
  },

  persistAll: async () => {
    const w = get().workout;
    const backendId = get().backendWorkoutId;
    if (!w) return;

    for (const ex of get().exercises) {
      const we = await ensureWorkoutExercise(w.id, ex.exerciseId);
      for (const s of ex.sets) {
        const weight = s.weight.trim() ? Number(s.weight.replace(',', '.')) : null;
        const reps = s.reps.trim() ? Number(s.reps.replace(',', '.')) : null;
        const cleanWeight = weight !== null && Number.isFinite(weight) ? weight : null;
        const cleanReps = reps !== null && Number.isFinite(reps) ? reps : null;

        await upsertExerciseSet({
          workoutExerciseId: we.id,
          setNumber: s.setNumber,
          weight: cleanWeight,
          reps: cleanReps,
          completed: s.done,
        });

        if (backendId) {
          await bgFetch(() =>
            api.workouts.upsertSet(backendId, {
              exerciseSlug: ex.exerciseId,
              setNumber: s.setNumber,
              weight: cleanWeight ?? undefined,
              reps: cleanReps ?? undefined,
              completed: s.done,
            }),
          );
        }
      }
    }
  },

  finish: async () => {
    const state = get();
    const w = state.workout;
    const backendId = state.backendWorkoutId;
    const scheduledId = state.scheduledWorkoutId;
    if (!w) return null;

    await state.persistAll();
    await setWorkoutCompleted(w.id, true);
    if (backendId) await bgFetch(() => api.workouts.finish(backendId));
    if (scheduledId) await bgFetch(() => api.schedule.complete(scheduledId));

    // Считаем summary
    let totalSets = 0;
    let completedSets = 0;
    let totalVolumeKg = 0;
    const prs: WorkoutSummary['prs'] = [];

    for (const ex of state.exercises) {
      for (const s of ex.sets) {
        totalSets += 1;
        if (s.done) completedSets += 1;
        const w_ = Number(s.weight.replace(',', '.'));
        const r_ = Number(s.reps.replace(',', '.'));
        if (Number.isFinite(w_) && Number.isFinite(r_)) {
          totalVolumeKg += w_ * r_;
          if (s.done && ex.history?.maxWeight !== null && ex.history?.maxWeight !== undefined) {
            if (w_ > ex.history.maxWeight) {
              const existing = prs.find((p) => p.exerciseId === ex.exerciseId);
              if (!existing || w_ > existing.weight) {
                const idx = prs.findIndex((p) => p.exerciseId === ex.exerciseId);
                const entry = { exerciseId: ex.exerciseId, weight: w_, reps: r_, previousMax: ex.history.maxWeight };
                if (idx >= 0) prs[idx] = entry;
                else prs.push(entry);
              }
            }
          } else if (s.done && ex.history?.maxWeight === null && w_ > 0) {
            // первая тренировка с этим упражнением → автоматически PR
            const idx = prs.findIndex((p) => p.exerciseId === ex.exerciseId);
            const entry = { exerciseId: ex.exerciseId, weight: w_, reps: r_, previousMax: null };
            if (idx < 0) prs.push(entry);
          }
        }
      }
    }

    // Auto-progression: упражнения где все подходы выполнены и веса не падали — предложить добавить.
    // Используем эвристику: если упражнение базовое (жим/тяга/приседы — по ключевым словам), добавляем +5кг; иначе +2.5кг.
    const heavyHints = ['bench', 'press', 'squat', 'deadlift', 'row', 'жим', 'присед', 'тяга'];
    const suggestions: WorkoutSummary['suggestions'] = [];
    for (const ex of state.exercises) {
      if (ex.sets.length === 0) continue;
      const allDone = ex.sets.every((s) => s.done);
      if (!allDone) continue;
      const weights = ex.sets
        .map((s) => Number(s.weight.replace(',', '.')))
        .filter((n) => Number.isFinite(n) && n > 0);
      if (weights.length < ex.sets.length) continue;
      const minWeight = Math.min(...weights);
      // Все reps выполнены — допустим достиг верхней планки.
      const isHeavy = heavyHints.some((h) => ex.exerciseId.toLowerCase().includes(h));
      const addKg = isHeavy ? 5 : 2.5;
      suggestions.push({
        exerciseId: ex.exerciseId,
        addKg,
        reason: `Все подходы выполнены при ${minWeight} кг — пора прибавлять`,
      });
    }

    const durationMs = state.startedAt ? Date.now() - state.startedAt : 0;
    const summary: WorkoutSummary = {
      title: state.title,
      durationMs,
      totalSets,
      completedSets,
      totalVolumeKg: Math.round(totalVolumeKg),
      exerciseCount: state.exercises.length,
      prs,
      suggestions,
    };

    set({
      workout: null,
      exercises: [],
      startedAt: null,
      backendWorkoutId: null,
      scheduledWorkoutId: null,
      lastDurationMs: durationMs,
      lastSummary: summary,
    });

    return summary;
  },

  clearSummary: () => set({ lastSummary: null }),
}));
