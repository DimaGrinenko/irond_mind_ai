import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

export type Gender = 'male' | 'female' | 'other';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type FitnessGoalKey = 'mass' | 'cut' | 'strength' | 'endurance' | 'abs';
export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'active' | 'very_active';

export type UserState = {
  id: string | null;
  /** Уникальный публичный handle (например @ironbro). Для поиска и приглашений друзей. */
  handle: string | null;

  // Profile
  name: string;
  gender: Gender | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  level: FitnessLevel | null;
  activityLevel: ActivityLevel | null;

  // Goal / program
  goal: string;
  goalKey: FitnessGoalKey | null;
  currentProgramId: string | null;
  programWeek: number;

  // Onboarding state
  onboardingCompleted: boolean;

  // Pro trial / subscription
  /** Дата окончания бесплатного Pro-trial (ISO). null = trial не активирован. */
  proTrialEndsAt: string | null;
  /** Активная платная подписка */
  subscriptionTier: 'free' | 'pro' | 'elite';
  startProTrial: (days?: number) => void;
  setSubscription: (tier: 'free' | 'pro' | 'elite') => void;

  // Nutrition targets
  dailyCaloriesGoal: number;
  dailyProteinGoal: number;
  dailyFatsGoal: number;
  dailyCarbsGoal: number;
  setNutritionGoals: (g: Partial<Pick<UserState, 'dailyCaloriesGoal' | 'dailyProteinGoal' | 'dailyFatsGoal' | 'dailyCarbsGoal'>>) => void;

  // Actions
  setId: (id: string | null) => void;
  setHandle: (handle: string | null) => void;
  setName: (name: string) => void;
  setGender: (gender: Gender) => void;
  setAge: (age: number) => void;
  setHeight: (cm: number) => void;
  setWeight: (kg: number) => void;
  setLevel: (level: FitnessLevel) => void;
  setActivityLevel: (level: ActivityLevel) => void;
  setGoal: (goal: string, key?: FitnessGoalKey | null) => void;
  setProgram: (programId: string | null, week?: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: null,
      handle: null,

      name: '',
      gender: null,
      age: null,
      heightCm: null,
      weightKg: null,
      level: null,
      activityLevel: null,

      goal: '',
      goalKey: null,
      currentProgramId: null,
      programWeek: 1,

      onboardingCompleted: false,

      proTrialEndsAt: null,
      subscriptionTier: 'free',
      startProTrial: (days = 7) => {
        const end = new Date();
        end.setDate(end.getDate() + days);
        set({ proTrialEndsAt: end.toISOString() });
      },
      setSubscription: (subscriptionTier) => set({ subscriptionTier }),

      dailyCaloriesGoal: 2800,
      dailyProteinGoal: 150,
      dailyFatsGoal: 70,
      dailyCarbsGoal: 200,

      setNutritionGoals: (g) => set(g),

      setId: (id) => set({ id }),
      setHandle: (handle) => set({ handle: handle ? handle.replace(/^@/, '').toLowerCase() : null }),
      setName: (name) => set({ name }),
      setGender: (gender) => set({ gender }),
      setAge: (age) => set({ age }),
      setHeight: (heightCm) => set({ heightCm }),
      setWeight: (weightKg) => set({ weightKg }),
      setLevel: (level) => set({ level }),
      setActivityLevel: (activityLevel) => set({ activityLevel }),
      setGoal: (goal, key) => set({ goal, ...(key !== undefined ? { goalKey: key } : {}) }),
      setProgram: (programId, week) =>
        set((s) => ({ currentProgramId: programId, programWeek: week ?? s.programWeek })),
      completeOnboarding: () => set({ onboardingCompleted: true }),
      resetOnboarding: () =>
        set({
          id: null,
          name: '',
          gender: null,
          age: null,
          heightCm: null,
          weightKg: null,
          level: null,
          activityLevel: null,
          goal: '',
          goalKey: null,
          currentProgramId: null,
          programWeek: 1,
          onboardingCompleted: false,
        }),
    }),
    {
      name: 'ai_trainer_user',
      storage: createJSONStorage(() => AsyncStorage),
      version: 4,
      migrate: (persistedState: unknown, version: number) => {
        if (typeof persistedState !== 'object' || persistedState === null) return persistedState;
        const state = persistedState as Record<string, unknown>;
        if (version < 4) {
          // v3 had id: number, now id: string | null
          if (typeof state.id === 'number') state.id = null;
          if (!('activityLevel' in state)) state.activityLevel = null;
        }
        return state;
      },
    },
  ),
);
