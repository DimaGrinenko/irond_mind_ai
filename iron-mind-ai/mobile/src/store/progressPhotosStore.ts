import { create } from 'zustand';
import {
  createProgressPhoto,
  deleteProgressPhoto,
  listProgressPhotos,
  type ProgressPhotoRow,
} from '../db/progressPhotosRepo';
import { todayIsoDate } from '../utils/date';

export type ProgressPhotosState = {
  photos: ProgressPhotoRow[];
  loading: boolean;
  hydrate: () => Promise<void>;
  add: (uri: string, opts?: { note?: string; weight?: number | null }) => Promise<void>;
  remove: (id: number) => Promise<void>;
};

export const useProgressPhotosStore = create<ProgressPhotosState>()((set, get) => ({
  photos: [],
  loading: false,
  hydrate: async () => {
    set({ loading: true });
    try {
      set({ photos: await listProgressPhotos() });
    } catch (e) {
      console.error('Не удалось загрузить фото прогресса:', e);
    } finally {
      set({ loading: false });
    }
  },
  add: async (uri, opts) => {
    const saved = await createProgressPhoto({
      date: todayIsoDate(),
      uri,
      note: opts?.note ?? null,
      weight: opts?.weight ?? null,
    });
    set({ photos: [saved, ...get().photos] });
  },
  remove: async (id) => {
    await deleteProgressPhoto(id);
    set({ photos: get().photos.filter((p) => p.id !== id) });
  },
}));
