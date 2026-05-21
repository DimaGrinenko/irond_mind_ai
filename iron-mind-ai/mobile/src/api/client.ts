/**
 * Тонкий fetch-клиент к backend.
 * Базовый URL берётся из EXPO_PUBLIC_API_URL (см. .env / app.json -> extra).
 * На web по умолчанию используем `http://<hostname>:4001` (т.е. тот же хост, что и Expo dev server) —
 * иначе сборка пытается ходить на 10.0.2.2 (адрес из Android-эмулятора) и web-версия молча падает на CORS / DNS.
 */

import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'ai_trainer_token';

function resolveBaseUrl(): string {
  const env = process.env.EXPO_PUBLIC_API_URL;
  if (env) return env.replace(/\/$/, '');
  if (Platform.OS === 'web' && typeof window !== 'undefined') {
    const host = window.location?.hostname || 'localhost';
    return `http://${host}:4001`;
  }
  return 'http://10.0.2.2:4001';
}

export const API_BASE_URL = resolveBaseUrl();

let cachedToken: string | null = null;

export async function getToken(): Promise<string | null> {
  if (cachedToken !== null) return cachedToken;
  const v = await AsyncStorage.getItem(TOKEN_KEY);
  cachedToken = v;
  return v;
}

export async function setToken(token: string | null) {
  cachedToken = token;
  if (token) await AsyncStorage.setItem(TOKEN_KEY, token);
  else await AsyncStorage.removeItem(TOKEN_KEY);
}

export class ApiError extends Error {
  status: number;
  data: unknown;
  constructor(message: string, status: number, data: unknown) {
    super(message);
    this.status = status;
    this.data = data;
  }
}

type ReqInit = Omit<RequestInit, 'body'> & { body?: unknown };

export async function request<T = unknown>(
  path: string,
  init: ReqInit = {},
): Promise<T> {
  const token = await getToken();
  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(init.headers as Record<string, string> | undefined),
  };
  if (init.body !== undefined) headers['Content-Type'] = 'application/json';
  if (token) headers.Authorization = `Bearer ${token}`;

  const res = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    headers,
    body: init.body !== undefined ? JSON.stringify(init.body) : undefined,
  });

  const text = await res.text();
  const data = text ? safeJson(text) : null;

  if (!res.ok) {
    const message =
      (data && (data as any).message) || res.statusText || 'Request failed';
    throw new ApiError(
      Array.isArray(message) ? message.join(', ') : String(message),
      res.status,
      data,
    );
  }

  return data as T;
}

function safeJson(t: string) {
  try {
    return JSON.parse(t);
  } catch {
    return t;
  }
}

export const api = {
  auth: {
    register: (b: {
      email: string;
      password: string;
      name: string;
      goal?: string;
    }) =>
      request<{ token: string; user: any }>('/auth/register', {
        method: 'POST',
        body: b,
      }),
    login: (b: { email: string; password: string }) =>
      request<{ token: string; user: any }>('/auth/login', {
        method: 'POST',
        body: b,
      }),
    me: () => request<any>('/auth/me'),
  },
  users: {
    me: () => request<any>('/users/me'),
    update: (b: Record<string, unknown>) =>
      request<any>('/users/me', { method: 'PATCH', body: b }),
  },
  programs: {
    list: () => request<ProgramSummary[]>('/programs'),
    one: (id: string) => request<ProgramFull>(`/programs/${id}`),
    create: (b: CreateProgramPayload) =>
      request<ProgramFull>('/programs', { method: 'POST', body: b }),
    clone: (id: string) =>
      request<ProgramFull>(`/programs/${id}/clone`, {
        method: 'POST',
        body: {},
      }),
    update: (id: string, b: UpdateProgramPayload) =>
      request<ProgramFull>(`/programs/${id}`, { method: 'PATCH', body: b }),
    remove: (id: string) =>
      request<{ ok: true }>(`/programs/${id}`, { method: 'DELETE' }),
    use: (id: string, b: UseProgramPayload) =>
      request<{ created: number; programId: string }>(`/programs/${id}/use`, {
        method: 'POST',
        body: b,
      }),
    addDay: (id: string, b: CreateProgramDayPayload) =>
      request<ProgramDayWithExercises>(`/programs/${id}/days`, {
        method: 'POST',
        body: b,
      }),
    updateDay: (dayId: string, b: UpdateProgramDayPayload) =>
      request<ProgramDayWithExercises>(`/programs/days/${dayId}`, {
        method: 'PATCH',
        body: b,
      }),
    removeDay: (dayId: string) =>
      request<{ ok: true }>(`/programs/days/${dayId}`, { method: 'DELETE' }),
    addExercise: (dayId: string, b: CreateProgramExercisePayload) =>
      request<ProgramExercise>(`/programs/days/${dayId}/exercises`, {
        method: 'POST',
        body: b,
      }),
    updateExercise: (exerciseId: string, b: UpdateProgramExercisePayload) =>
      request<ProgramExercise>(`/programs/exercises/${exerciseId}`, {
        method: 'PATCH',
        body: b,
      }),
    removeExercise: (exerciseId: string) =>
      request<{ ok: true }>(`/programs/exercises/${exerciseId}`, {
        method: 'DELETE',
      }),
  },
  workouts: {
    list: (limit?: number) =>
      request<any[]>(`/workouts${limit ? `?limit=${limit}` : ''}`),
    create: (b: CreateWorkoutPayload) =>
      request<{ id: string }>('/workouts', { method: 'POST', body: b }),
    finish: (id: string) =>
      request<any>(`/workouts/${id}/finish`, { method: 'PATCH' }),
    upsertSet: (id: string, b: UpsertSetPayload) =>
      request<any>(`/workouts/${id}/sets`, { method: 'POST', body: b }),
    exerciseHistory: (slug: string) =>
      request<ExerciseHistory>(
        `/workouts/exercise-history/${encodeURIComponent(slug)}`,
      ),
    exercise1rmSeries: (slug: string) =>
      request<Array<{ date: string; max1rm: number }>>(
        `/workouts/exercise-1rm-series/${encodeURIComponent(slug)}`,
      ),
  },
  measurements: {
    list: () => request<any[]>('/measurements'),
    create: (b: Record<string, unknown>) =>
      request<any>('/measurements', { method: 'POST', body: b }),
  },
  nutrition: {
    list: (date?: string) =>
      request<any[]>(`/nutrition${date ? `?date=${date}` : ''}`),
    create: (b: Record<string, unknown>) =>
      request<any>('/nutrition', { method: 'POST', body: b }),
    recipeImport: (url: string) =>
      request<{
        url: string;
        title: string;
        ingredients: Array<{ name: string; grams: number; raw: string }>;
        note: string;
      }>('/nutrition/recipe-import', { method: 'POST', body: { url } }),
  },
  chat: {
    list: () => request<any[]>('/chat'),
    send: (content: string) =>
      request<any>('/chat', { method: 'POST', body: { content } }),
  },
  stats: {
    me: (days?: number) =>
      request<UserDashboard>(`/stats/me${days ? `?days=${days}` : ''}`),
    platform: () => request<any>('/stats/platform'),
  },
  admin: {
    users: () => request<any[]>('/admin/users'),
    setRole: (id: string, role: string) =>
      request<any>(`/admin/users/${id}/role`, {
        method: 'PATCH',
        body: { role },
      }),
    assignCoach: (clientId: string, coachId: string, notes?: string) =>
      request<any>(`/admin/clients/${clientId}/coach`, {
        method: 'POST',
        body: { coachId, notes },
      }),
  },
  coach: {
    clients: () => request<any[]>('/coach/clients'),
    client: (id: string) => request<any>(`/coach/clients/${id}`),
    setNotes: (id: string, notes: string) =>
      request<any>(`/coach/clients/${id}/notes`, {
        method: 'PATCH',
        body: { notes },
      }),
  },
  onboarding: {
    preview: (b: OnboardingPayload) =>
      request<OnboardingPlan>('/onboarding/preview', {
        method: 'POST',
        body: b,
      }),
    complete: (b: OnboardingPayload) =>
      request<{ user: any; plan: OnboardingPlan }>('/onboarding/complete', {
        method: 'POST',
        body: b,
      }),
  },
  achievements: {
    progress: () => request<AchievementsProgress>('/achievements/progress'),
    tree: () => request<AchievementNode[]>('/achievements/tree'),
    history: (limit?: number) =>
      request<ActivityEventDto[]>(
        `/achievements/history${limit ? `?limit=${limit}` : ''}`,
      ),
  },
  schedule: {
    list: (from?: string, to?: string) => {
      const q = new URLSearchParams();
      if (from) q.set('from', from);
      if (to) q.set('to', to);
      const qs = q.toString();
      return request<ScheduledWorkout[]>(`/schedule${qs ? `?${qs}` : ''}`);
    },
    create: (b: CreateScheduledPayload) =>
      request<ScheduledWorkout | ScheduledWorkout[]>('/schedule', {
        method: 'POST',
        body: b,
      }),
    complete: (id: string) =>
      request<ScheduledWorkout>(`/schedule/${id}/complete`, {
        method: 'PATCH',
      }),
    skip: (id: string) =>
      request<ScheduledWorkout>(`/schedule/${id}/skip`, { method: 'PATCH' }),
    remove: (id: string) =>
      request<{ ok: true }>(`/schedule/${id}`, { method: 'DELETE' }),
  },
  economy: {
    wallet: () => request<EconomyWallet>('/economy/wallet'),
    spinWheel: () =>
      request<WheelSpinResult>('/economy/wheel/spin', {
        method: 'POST',
        body: {},
      }),
    buy: (itemId: string) =>
      request<EconomyWallet>('/economy/shop/buy', {
        method: 'POST',
        body: { itemId },
      }),
    equip: (itemId: string) =>
      request<EconomyWallet>('/economy/shop/equip', {
        method: 'POST',
        body: { itemId },
      }),
    unequip: (itemId: string) =>
      request<EconomyWallet>('/economy/shop/unequip', {
        method: 'POST',
        body: { itemId },
      }),
  },
  cycle: {
    get: () => request<CycleState>('/cycle'),
    update: (
      body: Partial<
        Pick<CycleState, 'enabled' | 'lastPeriodStart' | 'cycleLength'>
      >,
    ) => request<CycleState>('/cycle', { method: 'PUT', body }),
  },
};

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export type CycleState = {
  enabled: boolean;
  lastPeriodStart: string | null;
  cycleLength: number;
  dayOfCycle: number | null;
  phase: CyclePhase | null;
};

export type EconomyWallet = {
  leaves: number;
  owned: Array<{ itemId: string; equipped: string | null }>;
  equipped: {
    tree: string | null;
    dumbbell: string | null;
    accent: string | null;
  };
  canSpinToday: boolean;
  wheelStreak: number;
};

export type WheelSpinResult = {
  value: number;
  multiplier: number;
  total: number;
  sectorIndex: number;
  leaves: number;
  wheelStreak: number;
};

export type ScheduledStatus = 'PLANNED' | 'DONE' | 'SKIPPED';

export type ScheduledWorkout = {
  id: string;
  userId: string;
  date: string;
  time: string | null;
  title: string;
  programId: string | null;
  notes: string | null;
  status: ScheduledStatus;
  completedAt: string | null;
  workoutId: string | null;
};

export type CreateScheduledPayload = {
  date: string;
  time?: string;
  title: string;
  programId?: string;
  notes?: string;
  repeatWeekdays?: number[];
  repeatWeeks?: number;
};

export type AchievementsProgress = {
  treeLevel: number;
  currentXp: number;
  xpToNext: number;
  totalXp: number;
  leaves: number;
  streakDays: number;
  longestStreak: number;
  monthlyGoal: number;
  monthlyDone: number;
  lastWorkoutAt: string | null;
  todayCompleted: boolean;
};

export type AchievementCategory =
  | 'STRENGTH'
  | 'CARDIO'
  | 'ENDURANCE'
  | 'BODY'
  | 'STREAK'
  | 'MILESTONE';

export type AchievementStatus = 'LOCKED' | 'IN_PROGRESS' | 'UNLOCKED';

export type AchievementNode = {
  id: string;
  title: string;
  description: string;
  category: AchievementCategory;
  iconName: string;
  positionX: number;
  positionY: number;
  xpReward: number;
  leavesReward: number;
  targetValue: number | null;
  targetUnit: string | null;
  status: AchievementStatus;
  progress: number;
  currentValue: number;
  unlockedAt: string | null;
};

export type ActivityEventDto = {
  id: string;
  kind: 'WORKOUT_COMPLETED' | 'REST_DAY' | 'ACHIEVEMENT_UNLOCKED' | 'PR_SET';
  title: string;
  detail: string | null;
  xp: number;
  occurredAt: string;
};

export type OnboardingPayload = {
  gender: 'MALE' | 'FEMALE' | 'OTHER';
  age: number;
  heightCm: number;
  weightKg: number;
  activityLevel: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'ACTIVE' | 'VERY_ACTIVE';
  goalKey: 'MASS' | 'CUT' | 'STRENGTH' | 'ENDURANCE' | 'ABS';
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  name?: string;
};

export type CreateWorkoutPayload = {
  date?: string;
  programId?: string;
  name?: string;
  durationSeconds?: number;
  calories?: number;
};

export type UpsertSetPayload = {
  exerciseId?: string;
  exerciseSlug?: string;
  setNumber: number;
  weight?: number;
  reps?: number;
  rpeLevel?: number;
  completed?: boolean;
};

export type ExerciseHistory = {
  lastSet: { weight: number | null; reps: number | null; date: string } | null;
  lastWorkoutSets?: Array<{
    setNumber: number;
    weight: number | null;
    reps: number | null;
  }>;
  maxWeight: number | null;
  maxReps: number | null;
  maxVolume: number | null;
  lastWorkoutDate: string | null;
};

export type MuscleLoad = {
  chest: number;
  back: number;
  legs: number;
  shoulders: number;
  arms: number;
  core: number;
  other: number;
};

export type StatsChartPoint = {
  date: string;
  workouts: number;
  volume: number;
  calories: number;
  nutritionCalories: number;
};

export type ProgramProgressSummary = {
  id: string;
  title: string;
  weeks: number;
  daysPerWeek: number;
  scheduledTotal: number;
  scheduledDone: number;
  scheduledRemaining: number;
  progress: number;
  treeStage: number;
};

export type UserDashboard = {
  periodDays: number;
  workoutsCount: number;
  totalWorkoutsAllTime: number;
  totalVolumeKgAllTime: number;
  totalSets: number;
  completedSets: number;
  volumeKg: number;
  caloriesBurned: number;
  nutritionCalories: number;
  avgNutritionCalories: number;
  weightDelta: number | null;
  lastWeight: number | null;
  muscleLoad: MuscleLoad;
  muscleVolume: MuscleLoad;
  chart: StatsChartPoint[];
  program: ProgramProgressSummary | null;
};

export type ProgramKind =
  | 'FULL_BODY'
  | 'UPPER_LOWER'
  | 'PUSH_PULL_LEGS'
  | 'SPLIT'
  | 'CUSTOM';
export type FitnessLevelEnum = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
export type FitnessGoalEnum = 'MASS' | 'CUT' | 'STRENGTH' | 'ENDURANCE' | 'ABS';

export type ProgramSummary = {
  id: string;
  title: string;
  subtitle: string;
  weeks: number;
  level: FitnessLevelEnum;
  goalKey: FitnessGoalEnum;
  kind: ProgramKind;
  daysPerWeek: number;
  accent: string;
  iconName: string;
  description: string;
  ownerUserId: string | null;
  baseProgramId: string | null;
  createdAt: string;
  updatedAt: string;
};

export type ProgramExercise = {
  id: string;
  dayId: string;
  order: number;
  exerciseId: string;
  exerciseName: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSeconds: number;
  notes: string | null;
};

export type ProgramDayWithExercises = {
  id: string;
  programId: string;
  order: number;
  title: string;
  weekday: number | null;
  exercises: ProgramExercise[];
};

export type ProgramFull = ProgramSummary & {
  days: ProgramDayWithExercises[];
};

export type UpdateProgramPayload = Partial<{
  title: string;
  subtitle: string;
  description: string;
  weeks: number;
  daysPerWeek: number;
  accent: string;
  iconName: string;
}>;

export type CreateProgramPayload = {
  title: string;
  subtitle?: string;
  description?: string;
  weeks?: number;
  daysPerWeek?: number;
  level?: FitnessLevelEnum;
  goalKey?: FitnessGoalEnum;
  kind?: ProgramKind;
  accent?: string;
  iconName?: string;
};

export type CreateProgramDayPayload = {
  title: string;
  weekday?: number;
  order?: number;
};

export type UpdateProgramDayPayload = Partial<CreateProgramDayPayload>;

export type CreateProgramExercisePayload = {
  exerciseId?: string;
  /** Альтернатива exerciseId — slug упражнения. Backend сам резолвит или создаст заглушку. */
  exerciseSlug?: string;
  exerciseName: string;
  sets?: number;
  repsMin?: number;
  repsMax?: number;
  restSeconds?: number;
  notes?: string;
  order?: number;
};

export type UpdateProgramExercisePayload =
  Partial<CreateProgramExercisePayload>;

export type UseProgramPayload = {
  startDate: string;
  weeks?: number;
  /** Для каждого дня программы (по index в сортировке по order) — выбранный weekday 0..6. */
  weekdays?: number[];
};

export type OnboardingPlan = {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  proteinG: number;
  fatsG: number;
  carbsG: number;
  surplusOrDeficit: number;
  programId: string;
  goalLabel: string;
};
