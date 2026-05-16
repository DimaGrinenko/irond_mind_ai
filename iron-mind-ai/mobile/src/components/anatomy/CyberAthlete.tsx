import React from 'react';
import { Platform, View } from 'react-native';
import Svg, {
  Circle,
  Defs,
  Ellipse,
  G,
  LinearGradient,
  Path,
  RadialGradient,
  Rect,
  Stop,
} from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/tokens';

type Props = {
  width?: number;
  height?: number;
  /** Отключить анимацию (для мелких статичных превью). */
  animated?: boolean;
};

/**
 * Кибер-атлет — стилизованная SVG-фигура робота-бодибилдера.
 * Псевдо-3D: неоновые контуры, светящееся ядро, парение, наклон и scan-line.
 */
export function CyberAthlete({ width = 200, height = 260, animated = true }: Props) {
  if (Platform.OS === 'web' || !animated) {
    return (
      <View style={{ width, height }}>
        <AthleteStatic width={width} height={height} />
      </View>
    );
  }
  return <AthleteAnimated width={width} height={height} />;
}

function AthleteAnimated({ width, height }: { width: number; height: number }) {
  const t = useSharedValue(0);
  const tilt = useSharedValue(0);
  const scan = useSharedValue(0);
  const pulse = useSharedValue(0);

  React.useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 3200, easing: Easing.inOut(Easing.quad) }), -1, true);
    tilt.value = withRepeat(withTiming(1, { duration: 5200, easing: Easing.inOut(Easing.sin) }), -1, true);
    scan.value = withRepeat(withTiming(1, { duration: 2600, easing: Easing.linear }), -1, false);
    pulse.value = withRepeat(withTiming(1, { duration: 1400, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [t, tilt, scan, pulse]);

  const floatStyle = useAnimatedStyle(() => ({
    transform: [
      { perspective: 600 },
      { translateY: -6 + t.value * 12 },
      { rotateY: `${-8 + tilt.value * 16}deg` },
      { rotateZ: `${-1.5 + tilt.value * 3}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + pulse.value * 0.4,
    transform: [{ scale: 0.9 + pulse.value * 0.18 }],
  }));

  const coreStyle = useAnimatedStyle(() => ({
    opacity: 0.5 + pulse.value * 0.5,
    transform: [{ scale: 0.8 + pulse.value * 0.5 }],
  }));

  const scanStyle = useAnimatedStyle(() => ({
    opacity: scan.value < 0.1 || scan.value > 0.9 ? 0 : 0.55,
    transform: [{ translateY: scan.value * height }],
  }));

  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      {/* фоновое неоновое свечение */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            width: width * 0.92,
            height: height * 0.86,
            borderRadius: 999,
            backgroundColor: 'rgba(157,107,255,0.4)',
          },
          glowStyle,
        ]}
      />
      <Animated.View style={floatStyle}>
        <AthleteStatic width={width} height={height} />
        {/* пульс ядра поверх торса */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              left: width * 0.5 - width * 0.11,
              top: height * 0.46 - width * 0.11,
              width: width * 0.22,
              height: width * 0.22,
              borderRadius: 999,
              backgroundColor: 'rgba(0,229,255,0.7)',
            },
            coreStyle,
          ]}
        />
      </Animated.View>
      {/* scan-line */}
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            top: 0,
            width: width * 0.78,
            height: 2,
            backgroundColor: colors.cyan,
            shadowColor: colors.cyan,
            shadowOpacity: 0.9,
            shadowRadius: 8,
          },
          scanStyle,
        ]}
      />
    </View>
  );
}

/** Статичная SVG-фигура — общая для веба и нативной анимации. */
function AthleteStatic({ width, height }: { width: number; height: number }) {
  return (
    <Svg width={width} height={height} viewBox="0 0 200 260">
      <Defs>
        <LinearGradient id="metal" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#2A2350" />
          <Stop offset="0.5" stopColor="#161235" />
          <Stop offset="1" stopColor="#0A0820" />
        </LinearGradient>
        <LinearGradient id="metalLight" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor="#4A3C8C" />
          <Stop offset="1" stopColor="#1C1640" />
        </LinearGradient>
        <LinearGradient id="neon" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor="#C77BFF" />
          <Stop offset="0.5" stopColor="#9D6BFF" />
          <Stop offset="1" stopColor="#00E5FF" />
        </LinearGradient>
        <RadialGradient id="core" cx="0.5" cy="0.5" r="0.5">
          <Stop offset="0" stopColor="#FFFFFF" />
          <Stop offset="0.4" stopColor="#3CFFFF" />
          <Stop offset="1" stopColor="#00E5FF" stopOpacity="0" />
        </RadialGradient>
        <LinearGradient id="visor" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor="#00E5FF" stopOpacity="0" />
          <Stop offset="0.5" stopColor="#3CFFFF" />
          <Stop offset="1" stopColor="#00E5FF" stopOpacity="0" />
        </LinearGradient>
      </Defs>

      {/* ===== НОГИ ===== */}
      {/* бёдра */}
      <Path d="M84 168 L96 168 L94 214 L78 214 Z" fill="url(#metalLight)" stroke="url(#neon)" strokeWidth="1.6" />
      <Path d="M104 168 L116 168 L122 214 L106 214 Z" fill="url(#metalLight)" stroke="url(#neon)" strokeWidth="1.6" />
      {/* колени */}
      <Circle cx="85" cy="216" r="7" fill="url(#metal)" stroke="url(#neon)" strokeWidth="1.4" />
      <Circle cx="115" cy="216" r="7" fill="url(#metal)" stroke="url(#neon)" strokeWidth="1.4" />
      {/* голени */}
      <Path d="M80 222 L92 222 L90 250 L80 250 Z" fill="url(#metal)" stroke="url(#neon)" strokeWidth="1.4" />
      <Path d="M108 222 L120 222 L120 250 L110 250 Z" fill="url(#metal)" stroke="url(#neon)" strokeWidth="1.4" />
      {/* стопы */}
      <Path d="M78 250 L92 250 L94 258 L74 258 Z" fill="url(#metal)" stroke="url(#neon)" strokeWidth="1.4" />
      <Path d="M108 250 L122 250 L126 258 L106 258 Z" fill="url(#metal)" stroke="url(#neon)" strokeWidth="1.4" />

      {/* ===== ТАЗ ===== */}
      <Path d="M82 150 L118 150 L116 170 L84 170 Z" fill="url(#metal)" stroke="url(#neon)" strokeWidth="1.6" />

      {/* ===== РУКИ ===== */}
      {/* бицепсы */}
      <Ellipse cx="44" cy="108" rx="15" ry="22" fill="url(#metalLight)" stroke="url(#neon)" strokeWidth="1.8" />
      <Ellipse cx="156" cy="108" rx="15" ry="22" fill="url(#metalLight)" stroke="url(#neon)" strokeWidth="1.8" />
      {/* локти */}
      <Circle cx="44" cy="134" r="6" fill="url(#metal)" stroke="url(#neon)" strokeWidth="1.4" />
      <Circle cx="156" cy="134" r="6" fill="url(#metal)" stroke="url(#neon)" strokeWidth="1.4" />
      {/* предплечья */}
      <Path d="M36 140 L52 140 L50 172 L40 172 Z" fill="url(#metal)" stroke="url(#neon)" strokeWidth="1.6" />
      <Path d="M148 140 L164 140 L160 172 L150 172 Z" fill="url(#metal)" stroke="url(#neon)" strokeWidth="1.6" />
      {/* кулаки */}
      <Circle cx="45" cy="178" r="8" fill="url(#metalLight)" stroke="url(#neon)" strokeWidth="1.6" />
      <Circle cx="155" cy="178" r="8" fill="url(#metalLight)" stroke="url(#neon)" strokeWidth="1.6" />

      {/* ===== ТОРС ===== */}
      {/* пресс-сегменты */}
      <Path d="M86 116 L114 116 L116 152 L84 152 Z" fill="url(#metal)" stroke="url(#neon)" strokeWidth="1.6" />
      <Path d="M92 124 L108 124" stroke="url(#neon)" strokeWidth="1.2" opacity="0.7" />
      <Path d="M92 134 L108 134" stroke="url(#neon)" strokeWidth="1.2" opacity="0.7" />
      <Path d="M100 118 L100 150" stroke="url(#neon)" strokeWidth="1.2" opacity="0.7" />

      {/* ===== ГРУДНЫЕ ПЛИТЫ ===== */}
      <Path d="M70 78 Q70 64 88 64 L98 64 L98 110 Q82 112 74 102 Q68 92 70 78 Z" fill="url(#metalLight)" stroke="url(#neon)" strokeWidth="1.8" />
      <Path d="M130 78 Q130 64 112 64 L102 64 L102 110 Q118 112 126 102 Q132 92 130 78 Z" fill="url(#metalLight)" stroke="url(#neon)" strokeWidth="1.8" />

      {/* ===== ЯДРО (реактор) ===== */}
      <Circle cx="100" cy="120" r="13" fill="url(#metal)" stroke="url(#neon)" strokeWidth="2" />
      <Circle cx="100" cy="120" r="9" fill="url(#core)" />
      <Circle cx="100" cy="120" r="4" fill="#FFFFFF" />

      {/* ===== ДЕЛЬТЫ / ПЛЕЧИ ===== */}
      <Circle cx="50" cy="74" r="18" fill="url(#metalLight)" stroke="url(#neon)" strokeWidth="2" />
      <Circle cx="150" cy="74" r="18" fill="url(#metalLight)" stroke="url(#neon)" strokeWidth="2" />
      <Circle cx="50" cy="74" r="6" fill="url(#neon)" opacity="0.85" />
      <Circle cx="150" cy="74" r="6" fill="url(#neon)" opacity="0.85" />

      {/* ===== ТРАПЕЦИИ ===== */}
      <Path d="M78 56 L122 56 L132 70 L68 70 Z" fill="url(#metal)" stroke="url(#neon)" strokeWidth="1.6" />

      {/* ===== ШЕЯ ===== */}
      <Rect x="92" y="44" width="16" height="14" rx="3" fill="url(#metal)" stroke="url(#neon)" strokeWidth="1.4" />

      {/* ===== ГОЛОВА / ШЛЕМ ===== */}
      <Path d="M82 16 Q82 4 100 4 Q118 4 118 16 L118 34 Q118 46 100 46 Q82 46 82 34 Z" fill="url(#metalLight)" stroke="url(#neon)" strokeWidth="2" />
      {/* визор */}
      <Rect x="86" y="22" width="28" height="8" rx="4" fill="url(#visor)" />
      <Rect x="86" y="22" width="28" height="8" rx="4" fill="none" stroke={colors.cyan} strokeWidth="1" opacity="0.8" />
      {/* антенна */}
      <Path d="M100 4 L100 -4" stroke="url(#neon)" strokeWidth="2" />
      <Circle cx="100" cy="-5" r="2.5" fill={colors.cyan} />
    </Svg>
  );
}
