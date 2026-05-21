import { useLeafEconomyStore } from '../store/leafEconomyStore';
import { useThemeStore } from '../store/themeStore';
import { useUserStore } from '../store/userStore';
import { THEMES, resolveThemeId, type Theme, type ThemeId } from './themes';

/**
 * Active theme hook. Subscribes to the three inputs that drive accent identity:
 *  - equipped leaf-shop accent skin (highest priority)
 *  - explicit manual theme pick
 *  - user gender (default: female → rose, else → cyber)
 *
 * Returns the resolved Theme object. Re-renders when any input changes.
 */
export function useTheme(): Theme {
  const equippedAccent = useLeafEconomyStore((s) => s.equipped.accent);
  const manualThemeId = useThemeStore((s) => s.manualThemeId);
  const gender = useUserStore((s) => s.gender);
  const id = resolveThemeId({ equippedAccent, manualThemeId, gender });
  return THEMES[id];
}

/** Just the resolved theme id (lighter — for selectors that only need the id). */
export function useThemeId(): ThemeId {
  const equippedAccent = useLeafEconomyStore((s) => s.equipped.accent);
  const manualThemeId = useThemeStore((s) => s.manualThemeId);
  const gender = useUserStore((s) => s.gender);
  return resolveThemeId({ equippedAccent, manualThemeId, gender });
}
