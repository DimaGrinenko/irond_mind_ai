/**
 * @deprecated WorkoutScreen заменён GymModeScreen (более удобный для зала: одно упражнение за раз).
 * Этот экран автоматически редиректит на GymMode и оставлен для обратной совместимости route 'Workout'.
 */
import React, { useEffect } from 'react';
import { useNavigation } from '@react-navigation/native';

export function WorkoutScreen() {
  const nav = useNavigation<any>();
  useEffect(() => {
    nav.replace('GymMode');
  }, [nav]);
  return null;
}
