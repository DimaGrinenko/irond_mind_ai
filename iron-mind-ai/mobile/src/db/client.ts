import { Platform } from 'react-native';
import * as SQLite from 'expo-sqlite';

type SqlValue = string | number | null;

let _db: any | null = null;

function getDb() {
  if (_db) return _db;
  if (Platform.OS === 'web') {
    throw new Error('SQLite is not available on web');
  }
  const anySQLite = SQLite as any;
  if (typeof anySQLite.openDatabaseSync === 'function') {
    _db = anySQLite.openDatabaseSync('ai_trainer.db');
  } else {
    _db = anySQLite.openDatabase('ai_trainer.db');
  }
  return _db;
}

export async function execAsync(sql: string) {
  if (Platform.OS === 'web') return;
  const db = getDb();
  if (typeof db.execAsync === 'function') {
    await db.execAsync(sql);
    return;
  }
  await new Promise<void>((resolve, reject) => {
    db.transaction(
      (tx: any) => {
        tx.executeSql(sql);
      },
      (err: any) => reject(err),
      () => resolve(),
    );
  });
}

export async function runAsync(sql: string, params: SqlValue[] = []) {
  if (Platform.OS === 'web') return { lastInsertRowId: 0, changes: 0 } as any;
  const db = getDb();
  if (typeof db.runAsync === 'function') {
    return await db.runAsync(sql, params);
  }
  return await new Promise<any>((resolve, reject) => {
    db.transaction(
      (tx: any) => {
        tx.executeSql(
          sql,
          params,
          (_: any, result: any) => resolve(result),
          (_: any, err: any) => {
            reject(err);
            return true;
          },
        );
      },
      (err: any) => reject(err),
    );
  });
}

export async function getAllAsync<T = any>(sql: string, params: SqlValue[] = []) {
  if (Platform.OS === 'web') return [] as T[];
  const db = getDb();
  if (typeof db.getAllAsync === 'function') {
    return (await db.getAllAsync(sql, params)) as T[];
  }
  const res = await runAsync(sql, params);
  return ((res as any)?.rows?._array ?? []) as T[];
}

export async function getFirstAsync<T = any>(sql: string, params: SqlValue[] = []) {
  if (Platform.OS === 'web') return null;
  const db = getDb();
  if (typeof db.getFirstAsync === 'function') {
    return (await db.getFirstAsync(sql, params)) as T | null;
  }
  const rows = await getAllAsync<T>(sql, params);
  return rows[0] ?? null;
}
