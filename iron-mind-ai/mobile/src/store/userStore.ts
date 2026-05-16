import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';

export type Gender = 'male' | 'female' | 'other';
export type FitnessLevel = 'beginner' | 'intermediate' | 'advanced';
export type FitnessGoalKey = 'mass' | 'cut' | 'strength' | 'endurance' | 'abs';

export type UserState = {
  id: number;

  // Profile
  name: string;
  gender: Gender | null;
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  level: FitnessLevel | null;

  // Goal / program
  goal: string;
  goalKey: FitnessGoalKey | null;
  currentProgramId: string | null;
  programWeek: number;

  // Onboarding state
  onboardingCompleted: boolean;

  // Nutrition targets
  dailyCaloriesGoal: number;
  dailyProteinGoal: number;
  dailyFatsGoal: number;
  dailyCarbsGoal: number;
  setNutritionGoals: (g: Partial<Pick<UserState, 'dailyCaloriesGoal' | 'dailyProteinGoal' | 'dailyFatsGoal' | 'dailyCarbsGoal'>>) => void;

  // Actions
  setName: (name: string) => void;
  setGender: (gender: Gender) => void;
  setAge: (age: number) => void;
  setHeight: (cm: number) => void;
  setWeight: (kg: number) => void;
  setLevel: (level: FitnessLevel) => void;
  setGoal: (goal: string, key?: FitnessGoalKey | null) => void;
  setProgram: (programId: string | null, week?: number) => void;
  completeOnboarding: () => void;
  resetOnboarding: () => void;
};

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      id: 1,

      name: '',
      gender: null,
      age: null,
      heightCm: null,
      weightKg: null,
      level: null,

      goal: '',
      goalKey: null,
      currentProgramId: null,
      programWeek: 1,

      onboardingCompleted: false,

      dailyCaloriesGoal: 2800,
      dailyProteinGoal: 150,
      dailyFatsGoal: 70,
      dailyCarbsGoal: 200,

      setNutritionGoals: (g) => set(g),

      setName: (name) => set({ name }),
      setGender: (gender) => set({ gender }),
      setAge: (age) => set({ age }),
      setHeight: (heightCm) => set({ heightCm }),
      setWeight: (weightKg) => set({ weightKg }),
      setLevel: (level) => set({ level }),
      setGoal: (goal, key) => set({ goal, ...(key !== undefined ? { goalKey: key } : {}) }),
      setProgram: (programId, week) =>
        set((s) => ({ currentProgramId: programId, programWeek: week ?? s.programWeek })),
      completeOnboarding: () => set({ onboardingCompleted: true }),
      resetOnboarding: () =>
        set({
          name: '',
          gender: null,
          age: null,
          heightCm: null,
          weightKg: null,
          level: null,
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
      version: 3,
    },
  ),
);
