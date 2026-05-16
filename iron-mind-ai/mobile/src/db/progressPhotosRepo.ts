import { getAllAsync, getFirstAsync, runAsync } from './client';

export type ProgressPhotoRow = {
  id: number;
  date: string;
  uri: string;
  note: string | null;
  weight: number | null;
};

export async function listProgressPhotos(limit = 200) {
  return await getAllAsync<ProgressPhotoRow>(
    'SELECT * FROM progress_photos ORDER BY date DESC, id DESC LIMIT ?',
    [limit],
  );
}

export async function createProgressPhoto(row: Omit<ProgressPhotoRow, 'id'>) {
  const res = await runAsync(
    'INSERT INTO progress_photos (date, uri, note, weight) VALUES (?, ?, ?, ?)',
    [row.date, row.uri, row.note, row.weight],
  );
  const id = Number(res?.lastInsertRowId ?? res?.insertId);
  const saved = await getFirstAsync<ProgressPhotoRow>('SELECT * FROM progress_photos WHERE id = ?', [id]);
  if (!saved) throw new Error('Progress photo insert failed');
  return saved;
}

export async function deleteProgressPhoto(id: number) {
  await runAsync('DELETE FROM progress_photos WHERE id = ?', [id]);
}
