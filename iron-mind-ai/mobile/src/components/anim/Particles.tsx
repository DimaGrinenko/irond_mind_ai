import React from 'react';
import { Platform, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  count?: number;
  color?: string;
  /** Высота поля рассеивания (по умолчанию 360) */
  height?: number;
};

/**
 * Слой плавающих частиц на фоне — фиолетовые точки, плавно дрейфующие вверх.
 * Используется как абсолютный фон, поверх него — контент.
 */
export function Particles(props: Props) {
  if (Platform.OS === 'web') return null;
  return <ParticlesField {...props} />;
}

function ParticlesField({ count = 18, color = 'rgba(177,78,255,0.65)', height = 380 }: Props) {
  const seeds = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => ({
        id: i,
        x: Math.random() * 100, // %
        size: 2 + Math.random() * 4,
        delay: Math.random() * 4000,
        duration: 6000 + Math.random() * 4000,
        opacity: 0.35 + Math.random() * 0.5,
      })),
    [count],
  );

  return (
    <View
      pointerEvents="none"
      style={{ position: 'absolute', left: 0, right: 0, top: 0, height, overflow: 'hidden' }}
    >
      {seeds.map((s) => (
        <Particle key={s.id} {...s} color={color} fieldHeight={height} />
      ))}
    </View>
  );
}

function Particle({
  x,
  size,
  delay,
  duration,
  opacity,
  color,
  fieldHeight,
}: {
  x: number;
  size: number;
  delay: number;
  duration: number;
  opacity: number;
  color: string;
  fieldHeight: number;
}) {
  const t = useSharedValue(0);

  React.useEffect(() => {
    t.value = withDelay(
      delay,
      withRepeat(withTiming(1, { duration, easing: Easing.linear }), -1, false),
    );
  }, [t, delay, duration]);

  const style = useAnimatedStyle(() => {
    const translateY = -t.value * fieldHeight;
    const o = t.value < 0.1 ? t.value / 0.1 : t.value > 0.85 ? (1 - t.value) / 0.15 : 1;
    const drift = Math.sin(t.value * Math.PI * 2) * 12;
    return {
      transform: [{ translateY }, { translateX: drift }],
      opacity: o * opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: `${x}%`,
          bottom: 0,
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: color,
          shadowColor: color,
          shadowOpacity: 1,
          shadowRadius: size * 1.5,
          shadowOffset: { width: 0, height: 0 },
        },
        style,
      ]}
    />
  );
}
