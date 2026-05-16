import React from 'react';
import type { Ionicons } from '@expo/vector-icons';

export type Program = {
  id: string;
  title: string;
  weeks: number;
  level: 'Базовый' | 'Средний' | 'Продвинутый';
  subtitle: string;
  accent: 'purple' | 'pink' | 'blue' | 'green';
  icon: React.ComponentProps<typeof Ionicons>['name'];
};

export const programs: Program[] = [
  {
    id: 'mass',
    title: 'МАССА',
    weeks: 12,
    level: 'Продвинутый',
    subtitle: 'Набор массы',
    accent: 'purple',
    icon: 'barbell',
  },
  {
    id: 'relief',
    title: 'РЕЛЬЕФ',
    weeks: 12,
    level: 'Средний',
    subtitle: 'Сжигай жир и прогрессируй мышцы',
    accent: 'pink',
    icon: 'flame',
  },
  {
    id: 'strength',
    title: 'СИЛА',
    weeks: 10,
    level: 'Продвинутый',
    subtitle: 'Увеличение силы',
    accent: 'blue',
    icon: 'flash',
  },
  {
    id: 'endurance',
    title: 'ВЫНОСЛИВОСТЬ',
    weeks: 8,
    level: 'Средний',
    subtitle: 'Развитие выносливости',
    accent: 'green',
    icon: 'pulse',
  },
  {
    id: 'abs',
    title: 'ПРЕСС',
    weeks: 4,
    level: 'Базовый',
    subtitle: 'Рельефный пресс',
    accent: 'purple',
    icon: 'sparkles',
  },
];

