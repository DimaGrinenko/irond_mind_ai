// Theme presets — swappable accent identities layered over the base tokens.
// The base palette (backgrounds, text, neutral cyber colors) stays in tokens.ts.
// A theme only overrides the *accent* surface: brand color, glow, primary gradients.
//
// Resolution (see useTheme.ts): equipped leaf-shop accent skin > explicit user pick > gender default.

export type ThemeId = 'cyber' | 'rose' | 'cyan' | 'pink' | 'amber';

export type Theme = {
  id: ThemeId;
  /** Primary brand accent — replaces direct uses of colors.purple. */
  accent: string;
  accentLight: string;
  accentDeep: string;
  /** Tinted text color (replaces colors.textNeon). */
  accentText: string;
  /** Color fed into neonGlow()/neonTextShadow(). */
  glow: string;
  /** Neon border color for accent surfaces. */
  borderNeon: string;
  /** Soft translucent accent fill (rgba). */
  accentSoft: string;
  /** Primary button / CTA gradient. */
  gradientPrimary: readonly string[];
  /** Rich multi-stop hero gradient. */
  gradientHero: readonly string[];
  /** NeonCard default stroke gradient. */
  cardStroke: readonly string[];
  /** NeonCard default fill gradient. */
  cardFill: readonly string[];
  /** Which NeonCard tint / NeonText glow this theme maps its accent onto. */
  tintKey: 'purple' | 'pink' | 'cyan' | 'amber';
};

export const THEMES: Record<ThemeId, Theme> = {
  // Default — electric violet (current look). Default for male/other.
  cyber: {
    id: 'cyber',
    accent: '#9D6BFF',
    accentLight: '#C77BFF',
    accentDeep: '#5A1FD9',
    accentText: '#C77BFF',
    glow: '#9D6BFF',
    borderNeon: 'rgba(138,92,255,0.55)',
    accentSoft: 'rgba(157,107,255,0.18)',
    gradientPrimary: ['#9D6BFF', '#C77BFF'],
    gradientHero: ['#5A1FD9', '#9D6BFF', '#FF4DD2'],
    cardStroke: [
      'rgba(157,107,255,0.95)',
      'rgba(199,123,255,0.55)',
      'rgba(157,107,255,0.95)',
    ],
    cardFill: ['rgba(157,107,255,0.18)', 'rgba(0,0,0,0)'],
    tintKey: 'purple',
  },
  // Rose / magenta — default for female.
  rose: {
    id: 'rose',
    accent: '#FF4DD2',
    accentLight: '#FF9AE6',
    accentDeep: '#B5179E',
    accentText: '#FF9AE6',
    glow: '#FF4DD2',
    borderNeon: 'rgba(255,77,210,0.55)',
    accentSoft: 'rgba(255,77,210,0.18)',
    gradientPrimary: ['#FF4DD2', '#FF9AE6'],
    gradientHero: ['#B5179E', '#FF1F8F', '#FF7AE0'],
    cardStroke: [
      'rgba(255,77,210,0.95)',
      'rgba(255,154,230,0.55)',
      'rgba(255,77,210,0.95)',
    ],
    cardFill: ['rgba(255,77,210,0.18)', 'rgba(0,0,0,0)'],
    tintKey: 'pink',
  },
  // Shop accent: cyan.
  cyan: {
    id: 'cyan',
    accent: '#00E5FF',
    accentLight: '#3CFFFF',
    accentDeep: '#0077B6',
    accentText: '#7DF9FF',
    glow: '#00E5FF',
    borderNeon: 'rgba(0,229,255,0.55)',
    accentSoft: 'rgba(0,229,255,0.16)',
    gradientPrimary: ['#00E5FF', '#3CFFFF'],
    gradientHero: ['#0077B6', '#00E5FF', '#9D6BFF'],
    cardStroke: [
      'rgba(60,255,255,0.9)',
      'rgba(0,229,255,0.5)',
      'rgba(60,255,255,0.9)',
    ],
    cardFill: ['rgba(0,229,255,0.16)', 'rgba(0,0,0,0)'],
    tintKey: 'cyan',
  },
  // Shop accent: hot pink.
  pink: {
    id: 'pink',
    accent: '#FF1F8F',
    accentLight: '#FF7AE0',
    accentDeep: '#C2185B',
    accentText: '#FF7AE0',
    glow: '#FF1F8F',
    borderNeon: 'rgba(255,31,143,0.55)',
    accentSoft: 'rgba(255,31,143,0.16)',
    gradientPrimary: ['#FF1F8F', '#FF7AE0'],
    gradientHero: ['#C2185B', '#FF1F8F', '#FF7AE0'],
    cardStroke: [
      'rgba(255,31,143,0.95)',
      'rgba(255,122,224,0.55)',
      'rgba(255,31,143,0.95)',
    ],
    cardFill: ['rgba(255,31,143,0.16)', 'rgba(0,0,0,0)'],
    tintKey: 'pink',
  },
  // Shop accent: amber.
  amber: {
    id: 'amber',
    accent: '#FFB547',
    accentLight: '#FFE94D',
    accentDeep: '#FF7A00',
    accentText: '#FFD27D',
    glow: '#FFB547',
    borderNeon: 'rgba(255,181,71,0.55)',
    accentSoft: 'rgba(255,181,71,0.16)',
    gradientPrimary: ['#FFB547', '#FFE94D'],
    gradientHero: ['#FF7A00', '#FFB547', '#FFE94D'],
    cardStroke: [
      'rgba(255,181,71,0.95)',
      'rgba(255,64,96,0.55)',
      'rgba(255,181,71,0.95)',
    ],
    cardFill: ['rgba(255,181,71,0.16)', 'rgba(0,0,0,0)'],
    tintKey: 'amber',
  },
};

/** Themes a user can pick manually in the theme selector (shop accents are auto-applied). */
export const SELECTABLE_THEMES: ThemeId[] = [
  'cyber',
  'rose',
  'cyan',
  'pink',
  'amber',
];

/** Map an equipped leaf-shop accent skin id → theme id (null if none). */
export function themeFromAccentSkin(
  accentSkin: string | undefined,
): ThemeId | null {
  switch (accentSkin) {
    case 'accent_cyan':
      return 'cyan';
    case 'accent_pink':
      return 'pink';
    case 'accent_amber':
      return 'amber';
    default:
      return null;
  }
}

/**
 * Resolve the active theme id.
 * Priority: equipped shop accent skin > explicit manual pick > gender default.
 */
export function resolveThemeId(input: {
  equippedAccent?: string;
  manualThemeId?: ThemeId | null;
  gender?: 'male' | 'female' | 'other' | null;
}): ThemeId {
  const fromShop = themeFromAccentSkin(input.equippedAccent);
  if (fromShop) return fromShop;
  if (input.manualThemeId) return input.manualThemeId;
  return input.gender === 'female' ? 'rose' : 'cyber';
}
