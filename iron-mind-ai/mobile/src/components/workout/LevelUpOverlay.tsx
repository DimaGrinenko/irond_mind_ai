import React from 'react';
import { Platform, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, {
  Easing,
  FadeIn,
  FadeOut,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { colors, gradients, neonGlow, neonTextShadow } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import type { AwardResult } from '../../store/progressStore';

type Props = {
  /** Результат начисления XP; при смене показывает оверлей. */
  result: AwardResult | null;
};

/** Праздничный оверлей: «+XP» и «Новый уровень» после тренировки. */
export function LevelUpOverlay({ result }: Props) {
  const [shown, setShown] = React.useState<AwardResult | null>(null);

  React.useEffect(() => {
    if (!result) return;
    setShown(result);
    const t = setTimeout(() => setShown(null), 2400);
    return () => clearTimeout(t);
  }, [result]);

  if (!shown) return null;

  return (
    <Animated.View
      entering={Platform.OS === 'web' ? undefined : FadeIn.duration(220)}
      exiting={Platform.OS === 'web' ? undefined : FadeOut.duration(260)}
      pointerEvents="none"
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(3,4,10,0.78)',
      }}
    >
      <Badge result={shown} />
    </Animated.View>
  );
}

function Badge({ result }: { result: AwardResult }) {
  const scale = useSharedValue(0.6);
  const spin = useSharedValue(0);

  React.useEffect(() => {
    scale.value = withSpring(1, { damping: 11, stiffness: 160 });
    if (Platform.OS !== 'web') {
      spin.value = withRepeat(withTiming(1, { duration: 6000, easing: Easing.linear }), -1, false);
    }
  }, [scale, spin]);

  const popStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.value }] }));
  const ringStyle = useAnimatedStyle(() => ({ transform: [{ rotate: `${spin.value * 360}deg` }] }));

  return (
    <Animated.View style={[{ alignItems: 'center' }, popStyle]}>
      <View style={{ width: 150, height: 150, alignItems: 'center', justifyContent: 'center' }}>
        {/* вращающееся неоновое кольцо */}
        <Animated.View
          style={[
            { position: 'absolute', width: 150, height: 150, borderRadius: 75, overflow: 'hidden' },
            ringStyle,
          ]}
        >
          <LinearGradient colors={gradients.AURORA} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }} style={{ flex: 1 }} />
        </Animated.View>
        <View
          style={{
            width: 132,
            height: 132,
            borderRadius: 66,
            backgroundColor: colors.bg,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: 1,
            borderColor: 'rgba(157,107,255,0.4)',
            ...neonGlow(colors.purple, 0.7, 30, 16),
          }}
        >
          <Ionicons
            name={result.leveledUp ? 'trophy' : 'flash'}
            size={40}
            color={result.leveledUp ? colors.amber : colors.cyan}
            style={{ textShadowColor: result.leveledUp ? colors.amber : colors.cyan, textShadowRadius: 16 }}
          />
          <Text
            style={[
              { marginTop: 6, color: colors.text, fontFamily: fontFamilies.body700, fontSize: 20 },
              neonTextShadow(colors.cyan, 12),
            ]}
          >
            +{result.gainedXp} XP
          </Text>
        </View>
      </View>

      <Text
        style={[
          { marginTop: 14, color: colors.text, fontFamily: fontFamilies.heading, fontSize: 22, textAlign: 'center' },
          neonTextShadow('rgba(157,107,255,0.7)', 16),
        ]}
      >
        {result.leveledUp ? `УРОВЕНЬ ${result.level}!` : 'ТРЕНИРОВКА ЗАСЧИТАНА'}
      </Text>
      <Text style={{ marginTop: 6, color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 13 }}>
        {result.streak > 1 ? `🔥 Серия ${result.streak} дней` : 'Так держать!'}
      </Text>
    </Animated.View>
  );
}
