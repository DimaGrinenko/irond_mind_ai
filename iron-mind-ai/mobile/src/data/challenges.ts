/**
 * Каталог челленджей. Каждый имеет цель (target) и метрику.
 * Прогресс считается из локальных данных тренировок / поведения.
 */
import type { Lang } from '../i18n';

export type ChallengeMetric =
  | 'workouts_count' // тренировок выполнено в окне
  | 'days_streak' // дней подряд
  | 'volume_kg' // суммарный объём за окно
  | 'max_pr_kg' // максимум PR по любому упражнению
  | 'workouts_per_week'; // среднее в неделю за окно

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
    description:
      '16 тренировок за 28 дней. Тренируешься 4 раза в неделю целый месяц.',
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

/** EN overlay for challenge title/description (CHALLENGES stays canonical RU). */
const CHALLENGES_EN: Record<string, { title: string; description: string }> = {
  c_30days_squats: {
    title: '30 days of squats',
    description:
      '30 days in a row you hit the gym — or at least squat at home.',
  },
  c_100kg_pr: {
    title: 'Break 100 kg',
    description: 'Hit a PR in bench / deadlift / squat at 100 kg or more.',
  },
  c_month_4pw: {
    title: '4 workouts a week — for a month',
    description:
      '16 workouts in 28 days. Train 4 times a week for a whole month.',
  },
  c_volume_50t_month: {
    title: '50 tons in a month',
    description: '50,000 kg of total volume in 30 days.',
  },
  c_streak_7: {
    title: 'A week with no misses',
    description: '7 days in a row you open the app.',
  },
  c_streak_100: {
    title: '100 days of fire',
    description: '100 days of activity in a row. For the serious ones.',
  },
  c_pr_breaker: {
    title: 'Record breaker',
    description: '5 PRs in a single workout.',
  },
};

/** Localized copy of a challenge. RU = canonical source. */
export function localizedChallenge(c: Challenge, lang: Lang): Challenge {
  if (lang === 'ru') return c;
  const over = CHALLENGES_EN[c.id];
  return over ? { ...c, ...over } : c;
}
