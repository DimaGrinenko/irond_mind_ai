export const schemaSql = `
PRAGMA journal_mode = WAL;
PRAGMA foreign_keys = ON;

CREATE TABLE IF NOT EXISTS user (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  goal TEXT,
  current_program_id TEXT,
  program_week INTEGER DEFAULT 1
);

CREATE TABLE IF NOT EXISTS workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  program_id TEXT,
  name TEXT,
  duration_seconds INTEGER,
  calories INTEGER,
  completed INTEGER DEFAULT 0
);

CREATE TABLE IF NOT EXISTS workout_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_id INTEGER,
  exercise_id TEXT,
  completed INTEGER DEFAULT 0,
  FOREIGN KEY (workout_id) REFERENCES workouts(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS exercise_sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_exercise_id INTEGER,
  set_number INTEGER,
  weight REAL,
  reps INTEGER,
  completed INTEGER DEFAULT 0,
  FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS measurements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  weight REAL,
  chest REAL, waist REAL, hips REAL,
  biceps REAL, thigh REAL, calf REAL,
  neck REAL, shoulders REAL, forearm REAL
);

CREATE TABLE IF NOT EXISTS nutrition_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  meal_type TEXT,
  name TEXT,
  calories INTEGER,
  protein REAL, fats REAL, carbs REAL,
  time TEXT
);

CREATE TABLE IF NOT EXISTS chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT,
  content TEXT,
  timestamp TEXT
);

CREATE TABLE IF NOT EXISTS progress_photos (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  uri TEXT NOT NULL,
  note TEXT,
  weight REAL
);
`;

