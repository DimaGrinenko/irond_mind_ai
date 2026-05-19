import { create } from 'zustand';
import {
  createMeasurement,
  deleteMeasurement,
  listMeasurements,
  type MeasurementsRow,
} from '../db/measurementsRepo';
import { todayIsoDate } from '../utils/date';

export type MeasurementInput = {
  weight?: number | null;
  chest?: number | null;
  waist?: number | null;
  hips?: number | null;
  biceps?: number | null;
  thigh?: number | null;
  calf?: number | null;
  neck?: number | null;
  shoulders?: number | null;
  forearm?: number | null;
};

export type MeasurementsState = {
  rows: MeasurementsRow[];
  loading: boolean;
  hydrate: () => Promise<void>;
  add: (input: MeasurementInput) => Promise<MeasurementsRow>;
  remove: (id: number) => Promise<void>;
};

export const useMeasurementsStore = create<MeasurementsState>()((set, get) => ({
  rows: [],
  loading: false,
  hydrate: async () => {
    set({ loading: true });
    try {
      set({ rows: await listMeasurements(90) });
    } finally {
      set({ loading: false });
    }
  },
  add: async (input) => {
    const saved = await createMeasurement({
      date: todayIsoDate(),
      weight: input.weight ?? null,
      chest: input.chest ?? null,
      waist: input.waist ?? null,
      hips: input.hips ?? null,
      biceps: input.biceps ?? null,
      thigh: input.thigh ?? null,
      calf: input.calf ?? null,
      neck: input.neck ?? null,
      shoulders: input.shoulders ?? null,
      forearm: input.forearm ?? null,
    });
    set({ rows: [saved, ...get().rows] });
    return saved;
  },
  remove: async (id) => {
    await deleteMeasurement(id);
    set({ rows: get().rows.filter((r) => r.id !== id) });
  },
}));
