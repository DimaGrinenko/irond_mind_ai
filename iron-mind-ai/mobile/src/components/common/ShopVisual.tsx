/**
 * Реальные SVG-визуалы для магазина и аур — без emoji.
 * - AuraBadge: круглый бейдж с уникальным паттерном для каждой ауры
 * - TreeSkinVisual: стилизованное дерево в скине
 * - DumbbellSkinVisual: гантеля в скине
 * - AccentSwatch: образец цветовой акцентной темы
 */
import React, { useEffect } from 'react';
import { Platform, Text, View } from 'react-native';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Circle,
  Path,
  Rect,
  G,
  Polygon,
} from 'react-native-svg';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import type { DumbbellAura } from './StreakDumbbell';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';

type AuraBadgeProps = {
  aura: DumbbellAura;
  size?: number;
  locked?: boolean;
  showLabel?: boolean;
};

/** Большой круглый бейдж ауры с уникальным паттерном внутри. */
export function AuraBadge({ aura, size = 96, locked = false, showLabel = false }: AuraBadgeProps) {
  const spin = useSharedValue(0);
  const pulse = useSharedValue(0);

  useEffect(() => {
    if (locked || Platform.OS === 'web') return;
    spin.value = withRepeat(withTiming(1, { duration: 12000, easing: Easing.linear }), -1, false);
    pulse.value = withRepeat(withTiming(1, { duration: 1800, easing: Easing.inOut(Easing.quad) }), -1, true);
  }, [spin, pulse, locked]);

  const orbitalStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${spin.value * 360}deg` }],
  }));
  const pulseStyle = useAnimatedStyle(() => ({
    opacity: 0.4 + pulse.value * 0.5,
    transform: [{ scale: 0.95 + pulse.value * 0.1 }],
  }));

  return (
    <View style={{ alignItems: 'center' }}>
      <View
        style={{
          width: size,
          height: size,
          alignItems: 'center',
          justifyContent: 'center',
          opacity: locked ? 0.35 : 1,
        }}
      >
        {/* Halo glow */}
        <Animated.View
          pointerEvents="none"
          style={[
            {
              position: 'absolute',
              width: size * aura.halo,
              height: size * aura.halo,
              borderRadius: 999,
              backgroundColor: aura.glow,
            },
            pulseStyle,
          ]}
        />

        {/* Core SVG by aura tier */}
        <Svg width={size} height={size} viewBox="0 0 100 100">
          <Defs>
            <RadialGradient id={`core-${aura.id}`} cx="0.5" cy="0.5" r="0.5">
              <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.95" />
              <Stop offset="0.35" stopColor={aura.primary} stopOpacity="0.95" />
              <Stop offset="1" stopColor={aura.secondary} stopOpacity="0.4" />
            </RadialGradient>
            <LinearGradient id={`ring-${aura.id}`} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={aura.primary} />
              <Stop offset="1" stopColor={aura.secondary} />
            </LinearGradient>
            <LinearGradient id={`bell-${aura.id}`} x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor={aura.primary} />
              <Stop offset="1" stopColor={aura.secondary} />
            </LinearGradient>
          </Defs>

          {/* Outer ring */}
          <Circle cx="50" cy="50" r="44" fill="none" stroke={`url(#ring-${aura.id})`} strokeWidth="2" opacity="0.6" />
          {/* Inner core */}
          <Circle cx="50" cy="50" r="34" fill={`url(#core-${aura.id})`} />

          {/* Unique pattern per tier */}
          {renderTierPattern(aura)}

          {/* Mini dumbbell inside */}
          <G>
            <Rect x="22" y="46" width="6" height="8" rx="1.5" fill={`url(#bell-${aura.id})`} />
            <Rect x="28" y="48" width="3" height="4" rx="1" fill={`url(#bell-${aura.id})`} />
            <Rect x="31" y="49" width="38" height="2" rx="1" fill={`url(#bell-${aura.id})`} />
            <Rect x="69" y="48" width="3" height="4" rx="1" fill={`url(#bell-${aura.id})`} />
            <Rect x="72" y="46" width="6" height="8" rx="1.5" fill={`url(#bell-${aura.id})`} />
          </G>
        </Svg>

        {/* Orbiting particles for high tiers (only animated on native) */}
        {!locked && aura.particles > 4 && Platform.OS !== 'web' ? (
          <Animated.View
            pointerEvents="none"
            style={[
              {
                position: 'absolute',
                width: size * 0.95,
                height: size * 0.95,
                alignItems: 'center',
                justifyContent: 'center',
              },
              orbitalStyle,
            ]}
          >
            {Array.from({ length: Math.min(aura.particles, 8) }).map((_, i) => {
              const angle = (i / Math.min(aura.particles, 8)) * Math.PI * 2;
              const r = (size * 0.95) / 2;
              const x = Math.cos(angle) * r * 0.85 + r - 3;
              const y = Math.sin(angle) * r * 0.85 + r - 3;
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
                    backgroundColor: aura.primary,
                    shadowColor: aura.primary,
                    shadowOpacity: 0.9,
                    shadowRadius: 6,
                  }}
                />
              );
            })}
          </Animated.View>
        ) : null}

        {locked ? (
          <View style={{ position: 'absolute', alignItems: 'center', justifyContent: 'center' }}>
            <Svg width={20} height={20} viewBox="0 0 24 24">
              <Path
                d="M12 2a5 5 0 0 0-5 5v3H6a2 2 0 0 0-2 2v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8a2 2 0 0 0-2-2h-1V7a5 5 0 0 0-5-5zm-3 8V7a3 3 0 1 1 6 0v3H9z"
                fill="rgba(255,255,255,0.7)"
              />
            </Svg>
          </View>
        ) : null}
      </View>

      {showLabel ? (
        <>
          <Text
            style={{
              marginTop: 6,
              color: locked ? colors.textMuted : aura.primary,
              fontFamily: fontFamilies.body700,
              fontSize: 11,
              textShadowColor: locked ? 'transparent' : aura.glow,
              textShadowRadius: 8,
            }}
          >
            {aura.name}
          </Text>
          <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 9 }}>
            {aura.days}+ дн
          </Text>
        </>
      ) : null}
    </View>
  );
}

/** Уникальные паттерны по тиру — лучи, кристаллы, спирали. */
function renderTierPattern(aura: DumbbellAura) {
  if (aura.id === 0) return null;
  // Lower tiers — простые точки
  if (aura.id <= 3) {
    return Array.from({ length: 6 }).map((_, i) => {
      const angle = (i / 6) * Math.PI * 2;
      const x = 50 + Math.cos(angle) * 36;
      const y = 50 + Math.sin(angle) * 36;
      return <Circle key={i} cx={x} cy={y} r="1.5" fill={aura.primary} opacity="0.6" />;
    });
  }
  // Mid tiers — рунные знаки 4 направления
  if (aura.id <= 7) {
    return Array.from({ length: 4 }).map((_, i) => {
      const angle = (i / 4) * Math.PI * 2 - Math.PI / 2;
      const cx = 50 + Math.cos(angle) * 38;
      const cy = 50 + Math.sin(angle) * 38;
      return <Polygon key={i} points={`${cx},${cy - 3} ${cx + 3},${cy} ${cx},${cy + 3} ${cx - 3},${cy}`} fill={aura.primary} opacity="0.85" />;
    });
  }
  // High tiers — лучи + кристаллы
  if (aura.id <= 12) {
    return (
      <G>
        {Array.from({ length: 8 }).map((_, i) => {
          const angle = (i / 8) * Math.PI * 2;
          const x1 = 50 + Math.cos(angle) * 36;
          const y1 = 50 + Math.sin(angle) * 36;
          const x2 = 50 + Math.cos(angle) * 44;
          const y2 = 50 + Math.sin(angle) * 44;
          return <Path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={aura.primary} strokeWidth="1.5" opacity="0.9" />;
        })}
      </G>
    );
  }
  // Top tiers — сложная мандала
  return (
    <G>
      {Array.from({ length: 12 }).map((_, i) => {
        const angle = (i / 12) * Math.PI * 2;
        const x1 = 50 + Math.cos(angle) * 34;
        const y1 = 50 + Math.sin(angle) * 34;
        const x2 = 50 + Math.cos(angle) * 46;
        const y2 = 50 + Math.sin(angle) * 46;
        return <Path key={i} d={`M${x1} ${y1} L${x2} ${y2}`} stroke={aura.primary} strokeWidth="1.2" opacity="0.95" />;
      })}
      {Array.from({ length: 6 }).map((_, i) => {
        const angle = (i / 6) * Math.PI * 2 + Math.PI / 12;
        const cx = 50 + Math.cos(angle) * 40;
        const cy = 50 + Math.sin(angle) * 40;
        return <Polygon key={`d${i}`} points={`${cx},${cy - 2.5} ${cx + 2},${cy} ${cx},${cy + 2.5} ${cx - 2},${cy}`} fill={aura.secondary} opacity="0.95" />;
      })}
    </G>
  );
}

// ============= TREE SKIN VISUAL =============
type TreeSkinId = 'tree_skin_aurora' | 'tree_skin_gold' | 'tree_skin_neon_red';

export function TreeSkinVisual({ id, size = 84 }: { id: TreeSkinId; size?: number }) {
  const palette =
    id === 'tree_skin_aurora'
      ? { trunk: '#6B3FFF', leaf1: '#00E5FF', leaf2: '#FF4DD2', leaf3: '#FFD27A' }
      : id === 'tree_skin_gold'
        ? { trunk: '#8A6B1F', leaf1: '#FFD27A', leaf2: '#FFB547', leaf3: '#FFFFFF' }
        : { trunk: '#5C1F26', leaf1: '#FF4D6D', leaf2: '#FF8042', leaf3: '#9D2D3B' };

  return (
    <Svg width={size} height={size * 1.2} viewBox="0 0 100 120">
      <Defs>
        <RadialGradient id={`crown-${id}`} cx="0.5" cy="0.5" r="0.6">
          <Stop offset="0" stopColor={palette.leaf3} stopOpacity="0.9" />
          <Stop offset="0.5" stopColor={palette.leaf1} stopOpacity="0.8" />
          <Stop offset="1" stopColor={palette.leaf2} stopOpacity="0.6" />
        </RadialGradient>
        <LinearGradient id={`trunk-${id}`} x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0" stopColor={palette.trunk} stopOpacity="1" />
          <Stop offset="1" stopColor={palette.trunk} stopOpacity="0.6" />
        </LinearGradient>
      </Defs>
      {/* Crown */}
      <Circle cx="50" cy="38" r="32" fill={`url(#crown-${id})`} />
      <Circle cx="34" cy="46" r="20" fill={`url(#crown-${id})`} opacity="0.85" />
      <Circle cx="66" cy="46" r="20" fill={`url(#crown-${id})`} opacity="0.85" />
      {/* Trunk */}
      <Rect x="46" y="60" width="8" height="44" rx="2" fill={`url(#trunk-${id})`} />
      {/* Branches */}
      <Path d="M50 75 L34 70" stroke={palette.trunk} strokeWidth="2.5" />
      <Path d="M50 75 L66 70" stroke={palette.trunk} strokeWidth="2.5" />
      {/* Ground */}
      <Rect x="20" y="102" width="60" height="3" rx="1.5" fill={palette.trunk} opacity="0.4" />
      {/* Sparkles for aurora/gold */}
      {(id === 'tree_skin_aurora' || id === 'tree_skin_gold') && (
        <G>
          {Array.from({ length: 5 }).map((_, i) => {
            const cx = 25 + i * 12;
            const cy = 12 + (i % 2) * 8;
            return <Circle key={i} cx={cx} cy={cy} r="1.5" fill={palette.leaf3} opacity="0.9" />;
          })}
        </G>
      )}
    </Svg>
  );
}

// ============= DUMBBELL SKIN VISUAL =============
type DumbbellSkinId = 'dumbbell_chrome' | 'dumbbell_gold';

export function DumbbellSkinVisual({ id, size = 84 }: { id: DumbbellSkinId; size?: number }) {
  const palette =
    id === 'dumbbell_chrome'
      ? { primary: '#E8E8F0', secondary: '#909098', highlight: '#FFFFFF', glow: 'rgba(232,232,240,0.45)' }
      : { primary: '#FFD27A', secondary: '#B8821F', highlight: '#FFF7D6', glow: 'rgba(255,210,122,0.55)' };

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id={`b-${id}`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={palette.primary} />
          <Stop offset="0.5" stopColor={palette.highlight} />
          <Stop offset="1" stopColor={palette.secondary} />
        </LinearGradient>
        <LinearGradient id={`bar-${id}`} x1="0" y1="0" x2="1" y2="0">
          <Stop offset="0" stopColor={palette.secondary} />
          <Stop offset="0.5" stopColor={palette.primary} />
          <Stop offset="1" stopColor={palette.secondary} />
        </LinearGradient>
        <RadialGradient id={`shine-${id}`} cx="0.3" cy="0.3" r="0.6">
          <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.7" />
          <Stop offset="1" stopColor="#FFFFFF" stopOpacity="0" />
        </RadialGradient>
      </Defs>
      <Circle cx="50" cy="50" r="48" fill={palette.glow} opacity="0.5" />
      <G>
        <Rect x="8" y="32" width="16" height="36" rx="4" fill={`url(#b-${id})`} />
        <Rect x="24" y="40" width="7" height="20" rx="2.5" fill={`url(#b-${id})`} />
        <Rect x="10" y="34" width="10" height="16" rx="3" fill={`url(#shine-${id})`} />
      </G>
      <Rect x="31" y="46" width="38" height="8" rx="3" fill={`url(#bar-${id})`} />
      <Rect x="34" y="47" width="32" height="2" rx="1" fill="#FFFFFF" fillOpacity="0.4" />
      <G>
        <Rect x="76" y="32" width="16" height="36" rx="4" fill={`url(#b-${id})`} />
        <Rect x="69" y="40" width="7" height="20" rx="2.5" fill={`url(#b-${id})`} />
        <Rect x="80" y="34" width="10" height="16" rx="3" fill={`url(#shine-${id})`} />
      </G>
    </Svg>
  );
}

// ============= ACCENT SWATCH =============
type AccentId = 'accent_cyan' | 'accent_pink' | 'accent_amber';

export function AccentSwatch({ id, size = 84 }: { id: AccentId; size?: number }) {
  const color = id === 'accent_cyan' ? '#00E5FF' : id === 'accent_pink' ? '#FF4DD2' : '#FFB547';
  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <LinearGradient id={`a-${id}`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={color} stopOpacity="0.4" />
          <Stop offset="1" stopColor={color} stopOpacity="1" />
        </LinearGradient>
      </Defs>
      {/* Sample UI elements with the accent color */}
      <Rect x="14" y="20" width="72" height="12" rx="6" fill={`url(#a-${id})`} />
      <Rect x="14" y="40" width="56" height="8" rx="4" fill={color} opacity="0.5" />
      <Rect x="14" y="56" width="42" height="8" rx="4" fill={color} opacity="0.3" />
      <Circle cx="50" cy="82" r="10" fill={color} opacity="0.85" />
      <Circle cx="50" cy="82" r="5" fill="#FFFFFF" opacity="0.9" />
    </Svg>
  );
}

/** Универсальная обёртка — выбирает визуал по category+id. */
export function ShopItemVisual({
  category, id, size = 60,
}: {
  category: 'tree' | 'dumbbell' | 'accent';
  id: string;
  size?: number;
}) {
  if (category === 'tree') return <TreeSkinVisual id={id as TreeSkinId} size={size} />;
  if (category === 'dumbbell') return <DumbbellSkinVisual id={id as DumbbellSkinId} size={size} />;
  return <AccentSwatch id={id as AccentId} size={size} />;
}
