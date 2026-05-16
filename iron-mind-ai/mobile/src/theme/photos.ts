/**
 * Манифест фото-ассетов.
 *
 * Чтобы заменить фото — положи новый файл в `mobile/assets/photos/`
 * под тем же именем, или замени require ниже.
 *
 * Если файл не задан (null) — компоненты автоматически фоллбэкаются
 * на нашу неоновую SVG-фигуру (BodyFigure).
 */

import type { ImageSourcePropType } from 'react-native';

type PhotoKey =
  | 'hero_main'
  | 'ai_avatar'
  | 'program_mass'
  | 'program_relief'
  | 'program_strength'
  | 'program_endurance'
  | 'program_abs';

export const photos: Record<PhotoKey, ImageSourcePropType | null> = {
  hero_main: require('../../assets/photos/hero_main.jpg'),
  ai_avatar: require('../../assets/photos/ai_avatar.jpg'),
  program_mass: require('../../assets/photos/program_mass.jpg'),
  program_relief: require('../../assets/photos/program_relief.jpg'),
  program_strength: require('../../assets/photos/program_strength.jpg'),
  program_endurance: require('../../assets/photos/program_endurance.jpg'),
  program_abs: require('../../assets/photos/program_abs.jpg'),
};
