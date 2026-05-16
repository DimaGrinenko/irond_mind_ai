import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View, type PressableProps, type ViewStyle } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors, glowStrong, gradients, neonTextShadow, radii } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';

type Variant = 'primary' | 'cyber' | 'fire' | 'aurora';

const GRADIENT_BY_VARIANT: Record<Variant, readonly string[]> = {
  primary: gradients.PRIMARY,
  cyber: gradients.CYBER_BRIGHT,
  fire: gradients.FIRE,
  aurora: gradients.AURORA,
};

type Props = PressableProps & {
  title: string;
  rightIcon?: React.ReactNode;
  variant?: Variant;
};

export function GradientButton({ title, rightIcon, variant = 'primary', style, ...props }: Props) {
  const outerStyle = (typeof style === 'function' ? undefined : style) as any as ViewStyle | undefined;
  const colorsForVariant = GRADIENT_BY_VARIANT[variant];

  const pulse = useSharedValue(0);
  const shine = useSharedValue(-1);

  React.useEffect(() => {
    if (Platform.OS === 'web') return;
    pulse.value = withRepeat(withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.quad) }), -1, true);
    shine.value = withRepeat(withTiming(1, { duration: 2400, easing: Easing.linear }), -1, false);
  }, [pulse, shine]);

  const aGlow = useAnimatedStyle(() => {
    const s = 1 + pulse.value * 0.025;
    const o = 0.85 + pulse.value * 0.15;
    return { transform: [{ scale: s }], opacity: o };
  });

  const aShine = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: shine.value * 220 }, { skewX: '-18deg' }],
      opacity: shine.value > -0.6 && shine.value < 0.6 ? 0.45 : 0,
    };
  });

  const ButtonInner = Platform.OS === 'web' ? View : Animated.View;

  return (
    <Pressable
      {...props}
      style={[{ borderRadius: radii.md, overflow: 'hidden' }, outerStyle]}
    >
      <LinearGradient
        colors={colorsForVariant as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ borderRadius: radii.md }}
      >
        <ButtonInner
          style={[
            {
              height: 56,
              borderRadius: radii.md,
              alignItems: 'center',
              justifyContent: 'center',
              flexDirection: 'row',
              gap: 10,
              paddingHorizontal: 18,
              backgroundColor: 'rgba(0,0,0,0.18)',
              overflow: 'hidden',
            },
            glowStrong,
            Platform.OS !== 'web' ? aGlow : null,
          ]}
        >
          {/* shine sweep */}
          {Platform.OS !== 'web' ? (
            <Animated.View
              pointerEvents="none"
              style={[
                StyleSheet.absoluteFillObject,
                { width: 80, backgroundColor: 'rgba(255,255,255,0.55)', left: -120 },
                aShine,
              ]}
            />
          ) : null}
          <Text
            style={[
              { color: colors.text, fontFamily: fontFamilies.body700, fontSize: 15, letterSpacing: 0.6 },
              neonTextShadow('rgba(255,255,255,0.95)', 8),
            ]}
          >
            {title}
          </Text>
          {rightIcon ? <View style={{ marginLeft: 2 }}>{rightIcon}</View> : null}
        </ButtonInner>
      </LinearGradient>
    </Pressable>
  );
}
