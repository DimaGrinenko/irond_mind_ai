import React from 'react';
import { Platform, Text, View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, RadialGradient, Stop } from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';

type Props = {
  days: number;
  size?: number;
};

/**
 * Анимированный «огонек серии» как в TikTok / Duolingo.
 * Жёлто-оранжевое пламя с пульсацией + свечение, в центре — число дней.
 */
export function StreakFire({ days, size = 96 }: Props) {
  const width = size;
  const height = size * 1.15;

  if (Platform.OS === 'web') {
    return <StaticFire days={days} width={width} height={height} />;
  }
  return <AnimatedFire days={days} size={size} />;
}

function AnimatedFire({ days, size = 96 }: Props) {
  const width = size;
  const height = size * 1.15;

  const t = useSharedValue(0);

  React.useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 1300, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [t]);

  const flameStyle = useAnimatedStyle(() => ({
    transform: [{ scaleY: 1 + t.value * 0.06 }, { scaleX: 1 - t.value * 0.02 }],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.45 + t.value * 0.35,
    transform: [{ scale: 1 + t.value * 0.12 }],
  }));

  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Animated.View
        pointerEvents="none"
        style={[
          {
            position: 'absolute',
            width: width * 1.2,
            height: height * 1.05,
            borderRadius: 999,
            backgroundColor: 'rgba(255,99,71,0.45)',
          },
          glowStyle,
        ]}
      />
      <Animated.View style={flameStyle}>
        <Svg width={width} height={height} viewBox="0 0 100 115">
          <Defs>
            <LinearGradient id="flame" x1="0.5" y1="0" x2="0.5" y2="1">
              <Stop offset="0" stopColor="#FFE9A3" />
              <Stop offset="0.35" stopColor="#FFB547" />
              <Stop offset="0.7" stopColor="#FF6A3F" />
              <Stop offset="1" stopColor="#FF3F5C" />
            </LinearGradient>
            <LinearGradient id="innerFlame" x1="0.5" y1="0" x2="0.5" y2="1">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
              <Stop offset="0.7" stopColor="#FFD27A" stopOpacity="0.5" />
              <Stop offset="1" stopColor="#FF6A3F" stopOpacity="0" />
            </LinearGradient>
            <RadialGradient id="core" cx="0.5" cy="0.55" r="0.45">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.9" />
              <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
            </RadialGradient>
          </Defs>

          {/* Outer flame */}
          <Path
            d="M50 4 C 60 22 78 32 78 56 C 78 80 64 100 50 110 C 36 100 22 80 22 56 C 22 36 38 26 50 4 Z"
            fill="url(#flame)"
          />
          {/* Inner flame */}
          <Path
            d="M50 28 C 56 38 66 46 66 62 C 66 78 58 92 50 100 C 42 92 34 78 34 62 C 34 50 44 42 50 28 Z"
            fill="url(#innerFlame)"
          />
          {/* Core highlight */}
          <Path d="M50 56 C 56 60 60 70 56 86 C 50 92 44 86 44 76 C 44 70 46 62 50 56 Z" fill="url(#core)" />
        </Svg>
      </Animated.View>

      <View
        style={{
          position: 'absolute',
          bottom: height * 0.18,
          alignItems: 'center',
          justifyContent: 'center',
        }}
        pointerEvents="none"
      >
        <Text
          style={{
            color: colors.text,
            fontFamily: fontFamilies.heading,
            fontSize: Math.round(size * 0.32),
            includeFontPadding: false,
          }}
        >
          {days}
        </Text>
      </View>
    </View>
  );
}

function StaticFire({ days, width, height }: { days: number; width: number; height: number }) {
  return (
    <View style={{ width, height, alignItems: 'center', justifyContent: 'center' }}>
      <Svg width={width} height={height} viewBox="0 0 100 115">
        <Defs>
          <LinearGradient id="flameW" x1="0.5" y1="0" x2="0.5" y2="1">
            <Stop offset="0" stopColor="#FFE9A3" />
            <Stop offset="0.35" stopColor="#FFB547" />
            <Stop offset="0.7" stopColor="#FF6A3F" />
            <Stop offset="1" stopColor="#FF3F5C" />
          </LinearGradient>
        </Defs>
        <Path
          d="M50 4 C 60 22 78 32 78 56 C 78 80 64 100 50 110 C 36 100 22 80 22 56 C 22 36 38 26 50 4 Z"
          fill="url(#flameW)"
        />
      </Svg>
      <View style={{ position: 'absolute', bottom: height * 0.18 }}>
        <Text
          style={{
            color: colors.text,
            fontFamily: fontFamilies.heading,
            fontSize: Math.round(width * 0.32),
          }}
        >
          {days}
        </Text>
      </View>
    </View>
  );
}
