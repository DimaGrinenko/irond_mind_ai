import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, StyleSheet, View, type ViewProps } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { colors, neonGlow, radii } from '../../theme/tokens';

type Tint = 'purple' | 'pink' | 'cyan' | 'green' | 'amber' | 'aurora';

const TINT_MAP: Record<Tint, { stroke: readonly string[]; fill: readonly string[]; glowColor: string }> = {
  purple: {
    stroke: ['rgba(157,107,255,0.95)', 'rgba(199,123,255,0.55)', 'rgba(157,107,255,0.95)'],
    fill: ['rgba(157,107,255,0.18)', 'rgba(0,0,0,0)'],
    glowColor: colors.purple,
  },
  pink: {
    stroke: ['rgba(255,77,210,0.95)', 'rgba(255,31,143,0.55)', 'rgba(255,77,210,0.95)'],
    fill: ['rgba(255,77,210,0.18)', 'rgba(0,0,0,0)'],
    glowColor: colors.pink,
  },
  cyan: {
    stroke: ['rgba(60,255,255,0.9)', 'rgba(0,229,255,0.5)', 'rgba(60,255,255,0.9)'],
    fill: ['rgba(0,229,255,0.16)', 'rgba(0,0,0,0)'],
    glowColor: colors.cyan,
  },
  green: {
    stroke: ['rgba(63,255,150,0.9)', 'rgba(0,229,255,0.5)', 'rgba(63,255,150,0.9)'],
    fill: ['rgba(63,255,150,0.16)', 'rgba(0,0,0,0)'],
    glowColor: colors.green,
  },
  amber: {
    stroke: ['rgba(255,181,71,0.95)', 'rgba(255,64,96,0.55)', 'rgba(255,181,71,0.95)'],
    fill: ['rgba(255,181,71,0.16)', 'rgba(0,0,0,0)'],
    glowColor: colors.amber,
  },
  aurora: {
    stroke: ['rgba(63,255,150,0.85)', 'rgba(0,229,255,0.85)', 'rgba(157,107,255,0.85)', 'rgba(255,77,210,0.85)'],
    fill: ['rgba(157,107,255,0.16)', 'rgba(255,77,210,0.06)', 'rgba(0,0,0,0)'],
    glowColor: colors.purple,
  },
};

type Props = ViewProps & {
  tint?: Tint;
  borderRadius?: number;
  intensity?: number; // 0..1 — multiplier for glow + opacity
  animated?: boolean;
  inner?: ViewProps['style'];
};

export function NeonCard({
  tint = 'purple',
  borderRadius = radii.xl,
  intensity = 1,
  animated = true,
  inner,
  style,
  children,
  ...rest
}: Props) {
  const palette = TINT_MAP[tint];
  const pulse = useSharedValue(0);

  React.useEffect(() => {
    if (!animated || Platform.OS === 'web') return;
    pulse.value = withRepeat(
      withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [animated, pulse]);

  const aGlow = useAnimatedStyle(() => {
    const o = (0.55 + pulse.value * 0.45) * intensity;
    return { opacity: o };
  });

  const glowStyle = neonGlow(palette.glowColor, 0.55 * intensity, 26, 14);

  return (
    <View {...rest} style={[{ borderRadius }, glowStyle, style]}>
      {/* gradient stroke */}
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFillObject, { borderRadius, overflow: 'hidden' }, animated ? aGlow : null]}
      >
        <LinearGradient
          colors={palette.stroke as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ flex: 1, borderRadius }}
        />
      </Animated.View>

      {/* inner card body — masks the stroke leaving a 1.5px halo */}
      <View
        style={[
          {
            margin: 1.4,
            borderRadius: borderRadius - 1,
            overflow: 'hidden',
            backgroundColor: colors.bgCard,
          },
          inner,
        ]}
      >
        <LinearGradient
          colors={palette.fill as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={StyleSheet.absoluteFillObject}
        />
        {children}
      </View>
    </View>
  );
}
