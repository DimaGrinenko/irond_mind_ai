import React from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type Achievement = {
  id: string;
  title: string;
  subtitle: string;
  icon: React.ComponentProps<typeof Ionicons>['name'];
  progress: number; // 0..1
  valueText?: string;
};

export const achievements: Achievement[] = [
  {
    id: 'streak_12',
    title: 'Серия',
    subtitle: '12 дней подряд',
    icon: 'flash',
    progress: 12 / 15,
    valueText: '12',
  },
  {
    id: 'first_workout',
    title: 'Первая тренировка',
    subtitle: 'Сделай 1 тренировку',
    icon: 'barbell',
    progress: 1,
  },
  {
    id: 'streak_30',
    title: '30 дней подряд',
    subtitle: 'Серия 30 дней',
    icon: 'calendar',
    progress: 12 / 30,
  },
  {
    id: 'workouts_100',
    title: '100 тренировок',
    subtitle: 'Всего 100 тренировок',
    icon: 'trophy',
    progress: 0.28,
  },
  {
    id: 'chest',
    title: 'Прокачал грудь',
    subtitle: 'Сделай 20 сетов на грудь',
    icon: 'heart',
    progress: 0.55,
  },
  {
    id: 'strong',
    title: 'Силач',
    subtitle: 'Побей личный рекорд',
    icon: 'sparkles',
    progress: 0.3,
  },
];

