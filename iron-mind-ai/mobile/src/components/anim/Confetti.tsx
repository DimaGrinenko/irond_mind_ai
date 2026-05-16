import React from 'react';
import { Platform, View } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from 'react-native-reanimated';

type Props = {
  /** При смене значения активируется новый «взрыв» */
  triggerKey: number;
  count?: number;
  colors?: string[];
};

const PALETTE = ['#8A5CFF', '#B14EFF', '#FF3FCB', '#00D1FF', '#FFB547', '#3FFF8F'];

/**
 * Burst-конфетти: разлетается в стороны при смене triggerKey.
 */
export function Confetti({ triggerKey, count = 36, colors = PALETTE }: Props) {
  // Hooks must run unconditionally — keep useMemo above any early returns.
  const pieces = React.useMemo(
    () =>
      Array.from({ length: count }, (_, i) => {
        const angle = (Math.PI * 2 * i) / count + Math.random() * 0.3;
        const distance = 140 + Math.random() * 160;
        return {
          id: `${triggerKey}-${i}`,
          dx: Math.cos(angle) * distance,
          dy: Math.sin(angle) * distance,
          color: colors[i % colors.length],
          size: 6 + Math.random() * 6,
          rotation: Math.random() * 360,
          delay: Math.random() * 80,
        };
      }),
    [triggerKey, count, colors],
  );

  if (Platform.OS === 'web') return null;
  if (!triggerKey) return null;

  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {pieces.map((p) => (
        <Piece key={p.id} {...p} />
      ))}
    </View>
  );
}

function Piece({
  dx,
  dy,
  color,
  size,
  rotation,
  delay,
}: {
  dx: number;
  dy: number;
  color: string;
  size: number;
  rotation: number;
  delay: number;
}) {
  const t = useSharedValue(0);

  React.useEffect(() => {
    t.value = withDelay(delay, withTiming(1, { duration: 1100, easing: Easing.out(Easing.cubic) }));
  }, [t, delay]);

  const style = useAnimatedStyle(() => {
    const x = dx * t.value;
    const y = dy * t.value + t.value * t.value * 80; // gravity
    const opacity = t.value < 0.85 ? 1 : (1 - t.value) / 0.15;
    return {
      transform: [{ translateX: x }, { translateY: y }, { rotate: `${rotation * t.value}deg` }],
      opacity,
    };
  });

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size * 0.4,
          borderRadius: 2,
          backgroundColor: color,
          shadowColor: color,
          shadowOpacity: 0.9,
          shadowRadius: 8,
          shadowOffset: { width: 0, height: 0 },
        },
        style,
      ]}
    />
  );
}
