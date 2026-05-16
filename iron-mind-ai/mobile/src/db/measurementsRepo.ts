import { getAllAsync, getFirstAsync, runAsync } from './client';

export type MeasurementsRow = {
  id: number;
  date: string;
  weight: number | null;
  chest: number | null;
  waist: number | null;
  hips: number | null;
  biceps: number | null;
  thigh: number | null;
  calf: number | null;
  neck: number | null;
  shoulders: number | null;
  forearm: number | null;
};

export async function listMeasurements(limit = 90) {
  return await getAllAsync<MeasurementsRow>(
    'SELECT * FROM measurements ORDER BY date DESC, id DESC LIMIT ?',
    [limit],
  );
}

export async function createMeasurement(row: Omit<MeasurementsRow, 'id'>) {
  const res = await runAsync(
    `INSERT INTO measurements (date, weight, chest, waist, hips, biceps, thigh, calf, neck, shoulders, forearm)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      row.date,
      row.weight,
      row.chest,
      row.waist,
      row.hips,
      row.biceps,
      row.thigh,
      row.calf,
      row.neck,
      row.shoulders,
      row.forearm,
    ],
  );
  const id = Number(res?.lastInsertRowId ?? res?.insertId);
  const saved = await getFirstAsync<MeasurementsRow>('SELECT * FROM measurements WHERE id = ?', [id]);
  if (!saved) throw new Error('Measurement insert failed');
  return saved;
}

