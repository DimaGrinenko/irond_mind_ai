import React from 'react';
import { Image, Platform, View, type ImageSourcePropType, type ImageStyle, type StyleProp } from 'react-native';
import Animated, { Easing, useAnimatedStyle, useSharedValue, withRepeat, withTiming } from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';

type Props = {
  source: ImageSourcePropType;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain';
  motion?: boolean;
  duration?: number;
  /** Add purple/magenta color-grade overlay to unify with brand palette. Default: true */
  tint?: boolean;
};

const AnimatedImage = Animated.createAnimatedComponent(Image);

/**
 * Фото с медленным Ken Burns зумом + цветокор в фиолетово-розовый.
 */
export function AnimatedPhoto({
  source,
  style,
  resizeMode = 'cover',
  motion = true,
  duration = 8000,
  tint = true,
}: Props) {
  const baseStyle: ImageStyle = { width: '100%', height: '100%' };

  return (
    <View style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
      <KenBurns
        source={source}
        baseStyle={baseStyle}
        style={style}
        resizeMode={resizeMode}
        motion={motion}
        duration={duration}
      />
      {tint ? (
        <LinearGradient
          colors={['rgba(123,63,228,0.45)', 'rgba(255,63,203,0.28)', 'rgba(79,31,184,0.50)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          pointerEvents="none"
        />
      ) : null}
    </View>
  );
}

type KenBurnsProps = {
  source: ImageSourcePropType;
  baseStyle: ImageStyle;
  style?: StyleProp<ImageStyle>;
  resizeMode: 'cover' | 'contain';
  motion: boolean;
  duration: number;
};

function KenBurns(props: KenBurnsProps) {
  if (Platform.OS === 'web' || !props.motion) {
    return <Image source={props.source} style={[props.baseStyle, props.style]} resizeMode={props.resizeMode} />;
  }
  return <AnimatedKenBurns {...props} />;
}

function AnimatedKenBurns({
  source,
  baseStyle,
  style,
  resizeMode,
  duration,
}: KenBurnsProps) {
  const t = useSharedValue(0);

  React.useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [t, duration]);

  const aStyle = useAnimatedStyle(() => {
    const scale = 1.05 + t.value * 0.08;
    const tx = (t.value - 0.5) * 10;
    const ty = (0.5 - t.value) * 6;
    return { transform: [{ scale }, { translateX: tx }, { translateY: ty }] };
  });

  return (
    <AnimatedImage
      source={source}
      style={[baseStyle as any, style as any, aStyle]}
      resizeMode={resizeMode}
    />
  );
}
