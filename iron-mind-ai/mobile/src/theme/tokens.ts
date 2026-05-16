// Premium design tokens — neon cyber palette
// AI_Trainer_Design_System + saturated glow accents

export const colors = {
  // Backgrounds — deeper black for higher neon contrast
  bg: '#020308',
  bgSecondary: '#060A14',
  bgCard: '#0B0F1E',
  bgElevated: '#12182E',
  holo: 'rgba(60,255,255,0.12)',
  holoPink: 'rgba(255,77,210,0.14)',
  border: '#1F2440',
  borderStrong: '#2D3358',
  borderNeon: 'rgba(138,92,255,0.55)',

  // Brand accents (electric violet → magenta)
  purpleLight: '#C77BFF',
  purple: '#9D6BFF', // electric_violet — bumped saturation
  purpleDeep: '#5A1FD9',
  pink: '#FF4DD2',
  pinkLight: '#FF7AE0',
  magenta: '#FF1F8F',

  // Cyber palette — vivid
  blue: '#00E5FF',
  cyan: '#3CFFFF',
  cyanSoft: 'rgba(60,255,255,0.35)',
  green: '#3FFF96',
  greenSoft: 'rgba(63,255,150,0.35)',
  red: '#FF4060',
  amber: '#FFB547',
  yellow: '#FFE94D',

  // Text
  text: '#FFFFFF',
  textBright: '#F4ECFF',
  textSecondary: '#A09DBE',
  textMuted: '#5E5C7A',
  textNeon: '#C77BFF',
} as const;

export const gradients = {
  PRIMARY: ['#9D6BFF', '#C77BFF'],
  PRIMARY_DEEP: ['#5A1FD9', '#9D6BFF'],
  HERO: ['#5A1FD9', '#9D6BFF', '#FF4DD2'],
  PREMIUM: ['#9D6BFF', '#C77BFF', '#FF4DD2'],
  CYBER: ['#00E5FF', '#9D6BFF'],
  CYBER_BRIGHT: ['#3CFFFF', '#00E5FF', '#9D6BFF'],
  FIRE: ['#FFB547', '#FF4060', '#FF4DD2'],
  TOXIC: ['#3FFF96', '#00E5FF'],
  AURORA: ['#3FFF96', '#00E5FF', '#9D6BFF', '#FF4DD2'],
  NEON_BORDER: ['#9D6BFF', '#FF4DD2', '#00E5FF', '#9D6BFF'],
  ULTRA: ['#5A1FD9', '#9D6BFF', '#00E5FF', '#FF4DD2', '#3FFF96'],
  DEPTH: ['rgba(2,3,8,0)', 'rgba(157,107,255,0.35)', 'rgba(2,3,8,0.95)'],
  CARD_TINT: ['rgba(157,107,255,0.18)', 'rgba(255,77,210,0.06)', 'rgba(0,0,0,0)'],
  CARD_DEEP: ['rgba(20,24,51,0.9)', 'rgba(8,11,22,0.95)'],
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 40,
  xxxl: 48,
} as const;

export const radii = {
  sm: 12,
  md: 18,
  lg: 24,
  xl: 28,
  xxl: 36,
  full: 9999,
} as const;

// Glow factory — generate React Native shadow style for any color
export function neonGlow(color: string, opacity = 0.7, radius = 24, elevation = 14) {
  return {
    shadowColor: color,
    shadowOpacity: opacity,
    shadowRadius: radius,
    shadowOffset: { width: 0, height: 0 },
    elevation,
  } as const;
}

export const glow = neonGlow(colors.purple, 0.6, 28, 16);
export const glowStrong = neonGlow(colors.purple, 0.85, 42, 22);
export const glowPink = neonGlow(colors.pink, 0.7, 32, 18);
export const glowCyan = neonGlow(colors.cyan, 0.7, 30, 16);
export const glowGreen = neonGlow(colors.green, 0.7, 28, 16);
export const glowAmber = neonGlow(colors.amber, 0.65, 26, 14);
export const glowSubtle = neonGlow(colors.purple, 0.35, 18, 8);

// Text shadow utility — accepts a color, returns RN textShadow* keys
export function neonTextShadow(color: string, radius = 14) {
  return {
    textShadowColor: color,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: radius,
  } as const;
}

