import React from 'react';
import { Text, type TextProps } from 'react-native';
import { colors, neonTextShadow } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';

type Variant = 'heading' | 'eyebrow' | 'title' | 'value';
type Glow = 'purple' | 'pink' | 'cyan' | 'green' | 'amber' | 'none';

const GLOW_COLOR: Record<Glow, string | null> = {
  purple: colors.purple,
  pink: colors.pink,
  cyan: colors.cyan,
  green: colors.green,
  amber: colors.amber,
  none: null,
};

type Props = TextProps & {
  variant?: Variant;
  glow?: Glow;
  glowRadius?: number;
};

export function NeonText({ variant = 'title', glow = 'purple', glowRadius = 14, style, children, ...rest }: Props) {
  const variantStyle = (() => {
    switch (variant) {
      case 'heading':
        return { fontFamily: fontFamilies.heading, fontSize: 26, color: colors.text, letterSpacing: 0.5 };
      case 'eyebrow':
        return {
          fontFamily: fontFamilies.body700,
          fontSize: 11,
          color: colors.textNeon,
          letterSpacing: 1.4,
          textTransform: 'uppercase' as const,
        };
      case 'value':
        return { fontFamily: fontFamilies.heading, fontSize: 32, color: colors.text, letterSpacing: 0.5 };
      case 'title':
      default:
        return { fontFamily: fontFamilies.body700, fontSize: 18, color: colors.text };
    }
  })();

  const glowColor = GLOW_COLOR[glow];
  const glowStyle = glowColor ? neonTextShadow(glowColor, glowRadius) : null;

  return (
    <Text {...rest} style={[variantStyle, glowStyle, style]}>
      {children}
    </Text>
  );
}
