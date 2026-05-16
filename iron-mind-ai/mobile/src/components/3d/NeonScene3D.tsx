import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/tokens';

type OrbSpec = { size: number; left: number; top: number; colors: [string, string]; delay: number };

const ORBS: OrbSpec[] = [
  { size: 140, left: -20, top: 10, colors: ['rgba(157,107,255,0.75)', 'rgba(157,107,255,0)'], delay: 0 },
  { size: 110, left: 180, top: 40, colors: ['rgba(0,229,255,0.65)', 'rgba(0,229,255,0)'], delay: 400 },
  { size: 90, left: 90, top: 120, colors: ['rgba(255,77,210,0.7)', 'rgba(255,77,210,0)'], delay: 800 },
  { size: 70, left: 220, top: 150, colors: ['rgba(63,255,150,0.55)', 'rgba(63,255,150,0)'], delay: 200 },
];

function NeonOrb({ spec }: { spec: OrbSpec }) {
  const t = useSharedValue(0);
  const spin = useSharedValue(0);

  useEffect(() => {
    t.value = withDelay(
      spec.delay,
      withRepeat(withTiming(1, { duration: 4200, easing: Easing.inOut(Easing.sin) }), -1, true),
    );
    spin.value = withRepeat(withTiming(1, { duration: 12000, easing: Easing.linear }), -1, false);
  }, [spec.delay, spin, t]);

  const style = useAnimatedStyle(() => ({
    transform: [
      { perspective: 800 },
      { translateY: interpolate(t.value, [0, 1], [0, -18]) },
      { translateX: interpolate(t.value, [0, 1], [0, 10]) },
      { rotateY: `${interpolate(spin.value, [0, 1], [-22, 22])}deg` },
      { rotateX: `${interpolate(t.value, [0, 1], [8, -12])}deg` },
      { scale: 0.92 + t.value * 0.14 },
    ],
    opacity: 0.55 + t.value * 0.35,
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        styles.orb,
        { width: spec.size, height: spec.size, left: spec.left, top: spec.top, borderRadius: spec.size / 2 },
        style,
      ]}
    >
      <LinearGradient colors={spec.colors} style={StyleSheet.absoluteFill} />
      <View style={[styles.ring, { borderColor: spec.colors[0].replace(/[\d.]+\)$/, '0.9)') }]} />
    </Animated.View>
  );
}

type Props = { height?: number; children?: React.ReactNode };

/** Парящие неоновые сферы — псевдо-3D сцена для премиум-экранов */
export function NeonScene3D({ height = 220, children }: Props) {
  const grid = useSharedValue(0);
  useEffect(() => {
    grid.value = withRepeat(withTiming(1, { duration: 8000, easing: Easing.linear }), -1, false);
  }, [grid]);

  const gridStyle = useAnimatedStyle(() => ({
    transform: [{ perspective: 600 }, { rotateX: '62deg' }, { translateY: interpolate(grid.value, [0, 1], [0, 24]) }],
    opacity: 0.22,
  }));

  return (
    <View style={[styles.wrap, { height }]}>
      <Animated.View style={[styles.grid, gridStyle]} pointerEvents="none">
        {Array.from({ length: 8 }).map((_, i) => (
          <View key={`h${i}`} style={[styles.gridLine, { top: i * 18 }]} />
        ))}
        {Array.from({ length: 12 }).map((_, i) => (
          <View key={`v${i}`} style={[styles.gridLineV, { left: i * 28 }]} />
        ))}
      </Animated.View>
      {ORBS.map((o, i) => (
        <NeonOrb key={i} spec={o} />
      ))}
      <LinearGradient
        colors={['rgba(3,4,10,0)', 'rgba(3,4,10,0.85)']}
        style={styles.fade}
        pointerEvents="none"
      />
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { overflow: 'hidden', position: 'relative' },
  orb: { position: 'absolute', overflow: 'hidden' },
  ring: {
    ...StyleSheet.absoluteFillObject,
    borderRadius: 999,
    borderWidth: 1.5,
  },
  grid: {
    position: 'absolute',
    left: -40,
    right: -40,
    bottom: -60,
    height: 200,
  },
  gridLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 1,
    backgroundColor: 'rgba(157,107,255,0.35)',
  },
  gridLineV: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    width: 1,
    backgroundColor: 'rgba(0,229,255,0.2)',
  },
  fade: { position: 'absolute', left: 0, right: 0, bottom: 0, height: 80 },
});
