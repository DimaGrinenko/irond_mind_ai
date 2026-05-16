import React from 'react';
import { View, type ViewProps } from 'react-native';
import { colors, neonGlow, radii, spacing } from '../../theme/tokens';

type Props = ViewProps & {
  variant?: 'secondary' | 'card';
  glowColor?: string;
  glowOpacity?: number;
};

export function Card({ variant = 'secondary', glowColor, glowOpacity = 0.35, style, ...props }: Props) {
  const bg = variant === 'secondary' ? colors.bgSecondary : colors.bgCard;
  const glow = glowColor ? neonGlow(glowColor, glowOpacity, 22, 10) : null;
  return (
    <View
      {...props}
      style={[
        {
          backgroundColor: bg,
          borderRadius: radii.lg,
          borderWidth: 1,
          borderColor: glowColor ? colors.borderNeon : colors.border,
          padding: spacing.lg,
        },
        glow,
        style,
      ]}
    />
  );
}
