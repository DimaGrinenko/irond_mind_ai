import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ExerciseNote = {
  id: string;
  exerciseId: string;
  text: string;
  date: string; // ISO yyyy-mm-dd
  createdAt: number;
};

type State = {
  notes: ExerciseNote[];
  addNote: (exerciseId: string, text: string) => ExerciseNote;
  removeNote: (id: string) => void;
  notesFor: (exerciseId: string) => ExerciseNote[];
};

function uid() {
  return `n_${Date.now().toString(36)}_${Math.random().toString(36).slice(2, 6)}`;
}

export const useExerciseNotesStore = create<State>()(
  persist(
    (set, get) => ({
      notes: [],
      addNote: (exerciseId, text) => {
        const note: ExerciseNote = {
          id: uid(),
          exerciseId,
          text: text.trim(),
          date: new Date().toISOString().slice(0, 10),
          createdAt: Date.now(),
        };
        set({ notes: [note, ...get().notes] });
        return note;
      },
      removeNote: (id) => set({ notes: get().notes.filter((n) => n.id !== id) }),
      notesFor: (exerciseId) =>
        get()
          .notes.filter((n) => n.exerciseId === exerciseId)
          .sort((a, b) => b.createdAt - a.createdAt),
    }),
    {
      name: 'ai_trainer_exercise_notes',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
