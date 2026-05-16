import React from 'react';
import { Image, Platform, View, type ImageSourcePropType } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { LinearGradient } from 'expo-linear-gradient';
import { BodyFigure, type MuscleKey } from './BodyFigure';
import { photos } from '../../theme/photos';

export type HeroPhotoKey =
  | 'hero_main'
  | 'program_mass'
  | 'program_relief'
  | 'program_strength'
  | 'program_endurance'
  | 'program_abs'
  | 'ai_avatar';

type Props = {
  photoKey?: HeroPhotoKey;
  width?: number;
  height?: number;
  source?: ImageSourcePropType | null;
  highlights?: Partial<Record<MuscleKey | 'arms' | 'legs' | 'back', string>>;
  pulse?: boolean;
  /** Disable Ken Burns motion (e.g. for tiny thumbnails). Default: enabled. */
  motion?: boolean;
};

const AnimatedImage = Animated.createAnimatedComponent(Image);

export function Hero({
  photoKey,
  source,
  width = 200,
  height = 280,
  highlights,
  pulse = true,
  motion = true,
}: Props) {
  const sourceImg = source ?? (photoKey ? photos[photoKey] : null);

  return (
    <View
      style={{
        width,
        height,
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
      }}
    >
      <PulsingGlow width={width} height={height} pulse={pulse} />

      {sourceImg ? (
        <View
          style={{
            width: width * 0.95,
            height: height * 0.95,
            borderRadius: 28,
            overflow: 'hidden',
            borderWidth: 1,
            borderColor: 'rgba(177,78,255,0.45)',
          }}
        >
          <KenBurnsImage source={sourceImg} motion={motion} />
          {/* Magenta-purple color grade — раз и навсегда сводит любые фото к фирменной палитре */}
          <LinearGradient
            colors={['rgba(123,63,228,0.50)', 'rgba(255,63,203,0.32)', 'rgba(79,31,184,0.55)']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          />
          {/* Виньетка снизу для читаемости текста */}
          <LinearGradient
            colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.65)']}
            start={{ x: 0.5, y: 0.4 }}
            end={{ x: 0.5, y: 1 }}
            style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
          />
          <Shimmer enabled={motion && Platform.OS !== 'web'} />
        </View>
      ) : (
        <BodyFigure width={width * 0.85} height={height * 0.95} highlights={highlights} />
      )}
    </View>
  );
}

function KenBurnsImage({ source, motion }: { source: ImageSourcePropType; motion: boolean }) {
  if (Platform.OS === 'web' || !motion) {
    return <Image source={source} style={{ width: '100%', height: '100%' }} resizeMode="cover" />;
  }
  return <AnimatedKenBurns source={source} />;
}

function AnimatedKenBurns({ source }: { source: ImageSourcePropType }) {
  const t = useSharedValue(0);

  React.useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 7000, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [t]);

  const aStyle = useAnimatedStyle(() => {
    const scale = 1.04 + t.value * 0.08;
    const tx = (t.value - 0.5) * 12;
    const ty = (0.5 - t.value) * 8;
    return {
      transform: [{ scale }, { translateX: tx }, { translateY: ty }],
    };
  });

  return (
    <AnimatedImage
      source={source}
      style={[{ width: '100%', height: '100%' }, aStyle]}
      resizeMode="cover"
    />
  );
}

function Shimmer({ enabled }: { enabled: boolean }) {
  if (!enabled) return null;
  return <ShimmerInner />;
}

function ShimmerInner() {
  const t = useSharedValue(0);

  React.useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 5500, easing: Easing.linear }), -1, false);
  }, [t]);

  const aStyle = useAnimatedStyle(() => ({
    opacity: t.value < 0.15 || t.value > 0.85 ? 0 : 0.55,
    transform: [{ translateX: -150 + t.value * 360 }, { rotate: '20deg' }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          left: 0,
          top: -40,
          width: 90,
          height: 400,
          backgroundColor: 'rgba(255,255,255,0.18)',
        },
        aStyle,
      ]}
    />
  );
}

function PulsingGlow({ width, height, pulse }: { width: number; height: number; pulse: boolean }) {
  if (Platform.OS === 'web' || !pulse) {
    return (
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          width: width * 1.1,
          height: height * 1.05,
          borderRadius: 999,
          backgroundColor: 'rgba(177,78,255,0.20)',
        }}
      />
    );
  }
  return <AnimatedGlow width={width} height={height} />;
}

function AnimatedGlow({ width, height }: { width: number; height: number }) {
  const t = useSharedValue(0);
  React.useEffect(() => {
    t.value = withRepeat(withTiming(1, { duration: 2400, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [t]);

  const aStyle = useAnimatedStyle(() => ({
    opacity: 0.18 + t.value * 0.22,
    transform: [{ scale: 1 + t.value * 0.05 }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        {
          position: 'absolute',
          width: width * 1.1,
          height: height * 1.05,
          borderRadius: 999,
          backgroundColor: 'rgba(177,78,255,0.45)',
        },
        aStyle,
      ]}
    />
  );
}
