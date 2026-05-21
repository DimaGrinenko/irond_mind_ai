import React from 'react';
import { Platform, Text, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Path,
  Rect,
  Circle,
  G,
} from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { t } from '../../i18n';

type Props = {
  days: number;
  size?: number;
};

/**
 * Каждые 30 дней — новая «аура».
 * Каждая аура определяет основной/вторичный цвет, halo-цвет, размер ореола и количество частиц.
 * После 360 дней — финальная «легендарная» аура.
 */
export type DumbbellAura = {
  id: number;
  /** Минимум дней для разблокировки этой ауры. */
  days: number;
  /** Название ауры (RU, fallback). */
  name: string;
  /** i18n-ключ названия ауры. */
  nameKey: string;
  primary: string;
  secondary: string;
  glow: string;
  halo: number;
  particles: number;
};

export const AURAS: DumbbellAura[] = [
  {
    id: 0,
    days: 0,
    name: 'Тень',
    nameKey: 'aura.shadow',
    primary: '#5C5C66',
    secondary: '#3D3D45',
    glow: 'rgba(92,92,102,0.18)',
    halo: 1.0,
    particles: 0,
  },
  {
    id: 1,
    days: 3,
    name: 'Свинец',
    nameKey: 'aura.lead',
    primary: '#B7B7C5',
    secondary: '#8A8A95',
    glow: 'rgba(183,183,197,0.30)',
    halo: 1.02,
    particles: 0,
  },
  {
    id: 2,
    days: 7,
    name: 'Бронза',
    nameKey: 'aura.bronze',
    primary: '#FFB07A',
    secondary: '#C97D3D',
    glow: 'rgba(255,176,122,0.40)',
    halo: 1.06,
    particles: 1,
  },
  {
    id: 3,
    days: 14,
    name: 'Серебро',
    nameKey: 'aura.silver',
    primary: '#E0E0F0',
    secondary: '#9D9DAE',
    glow: 'rgba(224,224,240,0.40)',
    halo: 1.1,
    particles: 2,
  },
  {
    id: 4,
    days: 30,
    name: 'Аметист',
    nameKey: 'aura.amethyst',
    primary: '#9D6BFF',
    secondary: '#7B3FE4',
    glow: 'rgba(157,107,255,0.45)',
    halo: 1.15,
    particles: 3,
  },
  {
    id: 5,
    days: 60,
    name: 'Сапфир',
    nameKey: 'aura.sapphire',
    primary: '#3FA8FF',
    secondary: '#1D6BD9',
    glow: 'rgba(63,168,255,0.50)',
    halo: 1.2,
    particles: 4,
  },
  {
    id: 6,
    days: 90,
    name: 'Циан',
    nameKey: 'aura.cyan',
    primary: '#00E5FF',
    secondary: '#0099CC',
    glow: 'rgba(0,229,255,0.55)',
    halo: 1.25,
    particles: 5,
  },
  {
    id: 7,
    days: 120,
    name: 'Изумруд',
    nameKey: 'aura.emerald',
    primary: '#3FFF96',
    secondary: '#1FC76C',
    glow: 'rgba(63,255,150,0.55)',
    halo: 1.3,
    particles: 6,
  },
  {
    id: 8,
    days: 150,
    name: 'Золото',
    nameKey: 'aura.gold',
    primary: '#FFD27A',
    secondary: '#FFB547',
    glow: 'rgba(255,181,71,0.60)',
    halo: 1.35,
    particles: 7,
  },
  {
    id: 9,
    days: 180,
    name: 'Рубин',
    nameKey: 'aura.ruby',
    primary: '#FF4D6D',
    secondary: '#C9163D',
    glow: 'rgba(255,77,109,0.60)',
    halo: 1.4,
    particles: 8,
  },
  {
    id: 10,
    days: 210,
    name: 'Фуксия',
    nameKey: 'aura.fuchsia',
    primary: '#FF4DD2',
    secondary: '#C9168E',
    glow: 'rgba(255,77,210,0.60)',
    halo: 1.42,
    particles: 8,
  },
  {
    id: 11,
    days: 240,
    name: 'Огонь',
    nameKey: 'aura.fire',
    primary: '#FF6A3F',
    secondary: '#FF1F1F',
    glow: 'rgba(255,106,63,0.65)',
    halo: 1.45,
    particles: 9,
  },
  {
    id: 12,
    days: 270,
    name: 'Лёд',
    nameKey: 'aura.ice',
    primary: '#A0F0FF',
    secondary: '#5099FF',
    glow: 'rgba(160,240,255,0.65)',
    halo: 1.48,
    particles: 9,
  },
  {
    id: 13,
    days: 300,
    name: 'Аурора',
    nameKey: 'aura.aurora',
    primary: '#FF4DD2',
    secondary: '#00E5FF',
    glow: 'rgba(157,107,255,0.65)',
    halo: 1.52,
    particles: 10,
  },
  {
    id: 14,
    days: 330,
    name: 'Чёрное солнце',
    nameKey: 'aura.blacksun',
    primary: '#FFD27A',
    secondary: '#FF4DD2',
    glow: 'rgba(255,210,122,0.70)',
    halo: 1.55,
    particles: 11,
  },
  {
    id: 15,
    days: 360,
    name: 'Бесконечность',
    nameKey: 'aura.infinity',
    primary: '#FFFFFF',
    secondary: '#9D6BFF',
    glow: 'rgba(255,255,255,0.75)',
    halo: 1.6,
    particles: 12,
  },
];

/** Локализованное название ауры. */
export function auraName(a: DumbbellAura): string {
  return t(a.nameKey);
}

/** Подобрать ауру по дням стрика. */
export function auraFor(days: number): DumbbellAura {
  let aura = AURAS[0];
  for (const a of AURAS) {
    if (days >= a.days) aura = a;
  }
  return aura;
}

/** Дни до следующей ауры. null = нет следующей (max). */
export function nextAuraIn(
  days: number,
): { aura: DumbbellAura; daysLeft: number } | null {
  const current = auraFor(days);
  const next = AURAS.find((a) => a.id === current.id + 1);
  if (!next) return null;
  return { aura: next, daysLeft: next.days - days };
}

/** Тир по дням захода. */
function tierFor(days: number) {
  if (days >= 60)
    return {
      id: 5,
      primary: '#FF4DD2',
      secondary: '#9D6BFF',
      glow: 'rgba(255,77,210,0.55)',
      halo: 1.45,
      particles: 8,
    };
  if (days >= 30)
    return {
      id: 4,
      primary: '#FFD27A',
      secondary: '#FFB547',
      glow: 'rgba(255,181,71,0.55)',
      halo: 1.3,
      particles: 6,
    };
  if (days >= 14)
    return {
      id: 3,
      primary: '#00E5FF',
      secondary: '#3FA8FF',
      glow: 'rgba(0,229,255,0.45)',
      halo: 1.18,
      particles: 4,
    };
  if (days >= 7)
    return {
      id: 2,
      primary: '#9D6BFF',
      secondary: '#7B3FE4',
      glow: 'rgba(157,107,255,0.4)',
      halo: 1.08,
      particles: 2,
    };
  if (days >= 3)
    return {
      id: 1,
      primary: '#B7B7C5',
      secondary: '#8A8A95',
      glow: 'rgba(183,183,197,0.3)',
      halo: 1.0,
      particles: 0,
    };
  return {
    id: 0,
    primary: '#5C5C66',
    secondary: '#3D3D45',
    glow: 'rgba(92,92,102,0.18)',
    halo: 1.0,
    particles: 0,
  };
}

/** Размер гантели растёт со стриком (1.0 → 1.35) до 360 дней. */
function growthScale(days: number) {
  const min = 1,
    max = 1.35;
  if (days <= 0) return 0.9;
  const k = Math.min(1, days / 360);
  return min + (max - min) * k;
}

export function StreakDumbbell({ days, size = 96 }: Props) {
  const aura = auraFor(days);
  // Делаем из ауры tier-совместимый объект для существующих компонентов
  const tier = {
    id: aura.id > 0 ? Math.min(aura.id, 5) : 0,
    primary: aura.primary,
    secondary: aura.secondary,
    glow: aura.glow,
    halo: aura.halo,
    particles: aura.particles,
  };
  const scale = growthScale(days);
  const w = size * scale;
  const h = size * 1.05 * scale;

  if (Platform.OS === 'web') {
    return <StaticDumbbell days={days} width={w} height={h} tier={tier} />;
  }
  return <AnimatedDumbbell days={days} width={w} height={h} tier={tier} />;
}

function AnimatedDumbbell({
  days,
  width,
  height,
  tier,
}: {
  days: number;
  width: number;
  height: number;
  tier: ReturnType<typeof tierFor>;
}) {
  const t = useSharedValue(0);
  React.useEffect(() => {
    if (tier.id === 0) return; // не пульсируем для пустого стрика
    t.value = withRepeat(
      withTiming(1, { duration: 1500, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
  }, [t, tier.id]);

  const glowStyle = useAnimatedStyle(() => ({
    opacity: 0.35 + t.value * 0.4,
    transform: [{ scale: 1 + t.value * 0.1 }],
  }));

  const dumbbellStyle = useAnimatedStyle(() => ({
    transform: [{ scale: 1 + t.value * 0.03 }],
  }));

  return (
    <View
      style={{ width, height, alignItems: 'center', justifyContent: 'center' }}
    >
      {/* Halo glow */}
      {tier.id > 0 ? (
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              width: width * tier.halo,
              height: height * tier.halo,
              borderRadius: 999,
              backgroundColor: tier.glow,
            },
            glowStyle,
          ]}
        />
      ) : null}

      {/* Particles вокруг для высоких тиров */}
      {tier.particles > 0 ? (
        <Particles
          count={tier.particles}
          radius={width * 0.55}
          color={tier.primary}
        />
      ) : null}

      <Animated.View style={dumbbellStyle}>
        <DumbbellSvg width={width} height={height} tier={tier} />
      </Animated.View>

      <View
        style={{
          position: 'absolute',
          bottom: -2,
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 999,
          backgroundColor: 'rgba(13,16,32,0.85)',
          borderWidth: 1,
          borderColor: tier.primary + (tier.id > 0 ? 'AA' : '55'),
        }}
        pointerEvents="none"
      >
        <Text
          style={{
            color: colors.text,
            fontFamily: fontFamilies.heading,
            fontSize: Math.round(width * 0.22),
            includeFontPadding: false,
            textShadowColor: tier.primary,
            textShadowRadius: 8,
          }}
        >
          {days}
        </Text>
      </View>
    </View>
  );
}

function StaticDumbbell({
  days,
  width,
  height,
  tier,
}: {
  days: number;
  width: number;
  height: number;
  tier: ReturnType<typeof tierFor>;
}) {
  return (
    <View
      style={{ width, height, alignItems: 'center', justifyContent: 'center' }}
    >
      {tier.id > 0 ? (
        <View
          pointerEvents="none"
          style={{
            position: 'absolute',
            width: width * tier.halo,
            height: height * tier.halo,
            borderRadius: 999,
            backgroundColor: tier.glow,
            opacity: 0.55,
          }}
        />
      ) : null}
      <DumbbellSvg width={width} height={height} tier={tier} />
      <View
        style={{
          position: 'absolute',
          bottom: -2,
          paddingHorizontal: 8,
          paddingVertical: 2,
          borderRadius: 999,
          backgroundColor: 'rgba(13,16,32,0.85)',
          borderWidth: 1,
          borderColor: tier.primary + 'AA',
        }}
      >
        <Text
          style={{
            color: colors.text,
            fontFamily: fontFamilies.heading,
            fontSize: Math.round(width * 0.22),
          }}
        >
          {days}
        </Text>
      </View>
    </View>
  );
}

function DumbbellSvg({
  width,
  height,
  tier,
}: {
  width: number;
  height: number;
  tier: ReturnType<typeof tierFor>;
}) {
  return (
    <Svg width={width} height={height} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id="bell" x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={tier.primary} />
          <Stop offset="1" stopColor={tier.secondary} />
        </LinearGradient>
        <LinearGradient id="bar" x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={tier.secondary} />
          <Stop offset="0.5" stopColor={tier.primary} />
          <Stop offset="1" stopColor={tier.secondary} />
        </LinearGradient>
        <RadialGradient id="highlight" cx="0.35" cy="0.35" r="0.7">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.55" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* Левая «голова» гантели */}
      <G>
        <Rect x="6" y="34" width="14" height="32" rx="3" fill="url(#bell)" />
        <Rect x="20" y="40" width="6" height="20" rx="2" fill="url(#bell)" />
        <Rect
          x="8"
          y="36"
          width="8"
          height="14"
          rx="2"
          fill="url(#highlight)"
        />
      </G>

      {/* Гриф */}
      <Rect x="26" y="45" width="48" height="10" rx="3" fill="url(#bar)" />
      <Rect
        x="28"
        y="47"
        width="44"
        height="3"
        rx="1.5"
        fill="#FFFFFF"
        fillOpacity="0.22"
      />

      {/* Правая «голова» */}
      <G>
        <Rect x="80" y="34" width="14" height="32" rx="3" fill="url(#bell)" />
        <Rect x="74" y="40" width="6" height="20" rx="2" fill="url(#bell)" />
        <Rect
          x="84"
          y="36"
          width="8"
          height="14"
          rx="2"
          fill="url(#highlight)"
        />
      </G>

      {/* Лёгкий блик-свечение на грифе */}
      {tier.id >= 3 ? (
        <Circle cx="50" cy="50" r="22" fill={tier.primary} fillOpacity="0.08" />
      ) : null}
    </Svg>
  );
}

function Particles({
  count,
  radius,
  color,
}: {
  count: number;
  radius: number;
  color: string;
}) {
  return (
    <View
      pointerEvents="none"
      style={{
        position: 'absolute',
        width: radius * 2,
        height: radius * 2,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {Array.from({ length: count }).map((_, i) => {
        const angle = (i / count) * Math.PI * 2;
        const r = radius * (0.85 + (i % 2) * 0.1);
        const x = Math.cos(angle) * r + radius - 3;
        const y = Math.sin(angle) * r + radius - 3;
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: x,
              top: y,
              width: 6,
              height: 6,
              borderRadius: 3,
              backgroundColor: color,
              opacity: 0.7,
              shadowColor: color,
              shadowOpacity: 0.9,
              shadowRadius: 6,
              shadowOffset: { width: 0, height: 0 },
              elevation: 4,
            }}
          />
        );
      })}
    </View>
  );
}
