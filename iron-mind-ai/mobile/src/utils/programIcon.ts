import type { ComponentProps } from 'react';
import { Ionicons } from '@expo/vector-icons';

export type IoniconName = ComponentProps<typeof Ionicons>['name'];

/** Иконки из seed/API, которых нет в Ionicons — подменяем на близкие. */
const ALIASES: Record<string, IoniconName> = {
  'pulse-outline': 'pulse',
  'fitness-outline': 'body-outline',
};

export function programIconName(raw?: string | null): IoniconName {
  const name = (raw || 'barbell-outline').trim();
  if (ALIASES[name]) return ALIASES[name];
  if (name in Ionicons.glyphMap) return name as IoniconName;
  return 'barbell-outline';
}
