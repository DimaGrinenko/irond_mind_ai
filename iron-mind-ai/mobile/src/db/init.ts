import { execAsync, getFirstAsync, runAsync } from './client';
import { schemaSql } from './schema';

export async function initDb() {
  await execAsync(schemaSql);

  // Seed hardcoded user "Александр"
  const existing = await getFirstAsync<{ id: number }>('SELECT id FROM user WHERE id = 1');
  if (!existing) {
    await runAsync(
      'INSERT INTO user (id, name, goal, current_program_id, program_week) VALUES (1, ?, ?, ?, ?)',
      ['Александр', 'Набор мышечной массы', 'mass', 1],
    );
  }
}

