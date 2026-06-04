import { useBottomTabBarHeight } from '@react-navigation/bottom-tabs';
import { Platform } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/** Высота CustomTabBar (центральная кнопка AI выступает вверх). */
const FALLBACK_TAB_BAR = Platform.OS === 'web' ? 88 : 80;

/** Отступ снизу, чтобы контент не уходил под абсолютный tab bar. */
export function useTabBarInset(): number {
  const h = useBottomTabBarHeight();
  return h > 0 ? h : FALLBACK_TAB_BAR;
}

/**
 * Нижний отступ для поля ввода чата (над таб-баром).
 * useBottomTabBarHeight() занижает высоту из‑за выпуклой кнопки AI — добавляем запас.
 */
export function useChatComposerBottom(): number {
  const insets = useSafeAreaInsets();
  const tabH = useBottomTabBarHeight();
  const base = tabH > 0 ? tabH : FALLBACK_TAB_BAR;
  const withFab = base + 72;
  const minFromSafe = insets.bottom + 124;
  return Math.max(withFab, minFromSafe, Platform.OS === 'android' ? 132 : 0);
}
