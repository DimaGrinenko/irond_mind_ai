/**
 * Каталог челленджей. Каждый имеет цель (target) и метрику.
 * Прогресс считается из локальных данных тренировок / поведения.
 */
export type ChallengeMetric =
  | 'workouts_count'       // тренировок выполнено в окне
  | 'days_streak'          // дней подряд
  | 'volume_kg'            // суммарный объём за окно
  | 'max_pr_kg'            // максимум PR по любому упражнению
  | 'workouts_per_week';   // среднее в неделю за окно

export type Challenge = {
  id: string;
  title: string;
  description: string;
  emoji: string;
  metric: ChallengeMetric;
  target: number;
  /** Окно (дней) — за сколько дней цель должна быть достигнута. */
  windowDays: number;
  /** Награда в листиках */
  reward: number;
};

export const CHALLENGES: Challenge[] = [
  {
    id: 'c_30days_squats',
    title: '30 дней приседаний',
    description: '30 дней подряд заходишь в зал или хотя бы дома приседаешь.',
    emoji: '🦵',
    metric: 'days_streak',
    target: 30,
    windowDays: 30,
    reward: 200,
  },
  {
    id: 'c_100kg_pr',
    title: 'Пробей 100 кг',
    description: 'Сделай PR в жиме/тяге/приседе с весом 100 кг или больше.',
    emoji: '🏋️',
    metric: 'max_pr_kg',
    target: 100,
    windowDays: 365,
    reward: 300,
  },
  {
    id: 'c_month_4pw',
    title: '4 тренировки в неделю — месяц',
    description: '16 тренировок за 28 дней. Тренируешься 4 раза в неделю целый месяц.',
    emoji: '📅',
    metric: 'workouts_count',
    target: 16,
    windowDays: 28,
    reward: 250,
  },
  {
    id: 'c_volume_50t_month',
    title: '50 тонн за месяц',
    description: '50 000 кг общего объёма за 30 дней.',
    emoji: '💪',
    metric: 'volume_kg',
    target: 50000,
    windowDays: 30,
    reward: 400,
  },
  {
    id: 'c_streak_7',
    title: 'Неделя без пропусков',
    description: '7 дней подряд заходишь в приложение.',
    emoji: '🔥',
    metric: 'days_streak',
    target: 7,
    windowDays: 7,
    reward: 50,
  },
  {
    id: 'c_streak_100',
    title: '100 дней огня',
    description: '100 дней подряд активности. Для серьёзных.',
    emoji: '⚡',
    metric: 'days_streak',
    target: 100,
    windowDays: 100,
    reward: 1000,
  },
  {
    id: 'c_pr_breaker',
    title: 'Рекордсмен',
    description: '5 PR в одной тренировке.',
    emoji: '🏆',
    metric: 'max_pr_kg',
    target: 5,
    windowDays: 1,
    reward: 150,
  },
];
