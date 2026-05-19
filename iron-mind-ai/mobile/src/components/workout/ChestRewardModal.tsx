/**
 * Сундук-награда после тренировки.
 * Тиры по «качеству» сессии: BRONZE → SILVER → GOLD → LEGENDARY (PR + всё выполнено).
 * Variable reward по тиру (см. roll()). Лотерея «честная» — лучше работал = лучшие дропы.
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Modal, Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import Svg, { Defs, LinearGradient as SvgGrad, Stop, Path, Rect, Circle, G } from 'react-native-svg';
import Animated, {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withSequence,
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { GradientButton } from '../common/GradientButton';
import { colors, radii } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import type { WorkoutSummary } from '../../store/activeWorkoutStore';
import { useLeafEconomyStore } from '../../store/leafEconomyStore';
import { t } from '../../i18n';

export type ChestTier = 'bronze' | 'silver' | 'gold' | 'legendary';
export type ChestReward = {
  kind: 'leaves' | 'streak_freeze' | 'aura_peek' | 'coupon' | 'pr_boost';
  amount: number;
  /** Локализованное название для UI */
  label: string;
  /** Подзаголовок */
  sub?: string;
  /** Уровень редкости — common/rare/epic/jackpot */
  rarity: 'common' | 'rare' | 'epic' | 'jackpot';
};

const TIER_INFO: Record<ChestTier, { name: string; primary: string; secondary: string; minLeaves: number; maxLeaves: number; rareChance: number; jackpotChance: number }> = {
  bronze:    { name: 'Бронзовый', primary: '#FFB07A', secondary: '#C97D3D', minLeaves: 10,  maxLeaves: 40,  rareChance: 0.05, jackpotChance: 0.005 },
  silver:    { name: 'Серебряный', primary: '#E0E0F0', secondary: '#9D9DAE', minLeaves: 25,  maxLeaves: 80,  rareChance: 0.10, jackpotChance: 0.02 },
  gold:      { name: 'Золотой',   primary: '#FFD27A', secondary: '#FFB547', minLeaves: 60,  maxLeaves: 180, rareChance: 0.20, jackpotChance: 0.05 },
  legendary: { name: 'Легендарный', primary: '#FF4DD2', secondary: '#9D6BFF', minLeaves: 150, maxLeaves: 500, rareChance: 0.40, jackpotChance: 0.15 },
};

/** Определить тир сундука по сводке тренировки. */
export function tierForSummary(s: WorkoutSummary): ChestTier {
  const ratio = s.totalSets > 0 ? s.completedSets / s.totalSets : 0;
  if (s.prs.length >= 3 && ratio === 1) return 'legendary';
  if (s.prs.length >= 1 && ratio >= 0.9) return 'gold';
  if (ratio >= 0.85) return 'silver';
  return 'bronze';
}

/** Бросить кубики — что выпадет из сундука. */
function rollReward(tier: ChestTier): ChestReward {
  const info = TIER_INFO[tier];
  const r = Math.random();
  if (r < info.jackpotChance) {
    return {
      kind: 'leaves',
      amount: info.maxLeaves * 2,
      label: `🌿 ${info.maxLeaves * 2} листиков`,
      sub: 'ДЖЕКПОТ!',
      rarity: 'jackpot',
    };
  }
  if (r < info.jackpotChance + info.rareChance) {
    // Эпическая награда — non-leaves
    const epic = Math.random();
    if (epic < 0.45) {
      return { kind: 'streak_freeze', amount: 1, label: 'Заморозка стрика', sub: 'спасёт серию на 1 день', rarity: 'epic' };
    }
    if (epic < 0.75) {
      return { kind: 'coupon', amount: 30, label: 'Купон −30%', sub: 'на скин в магазине · 24ч', rarity: 'rare' };
    }
    if (epic < 0.92) {
      return { kind: 'pr_boost', amount: 50, label: 'PR Boost', sub: '+50% листиков следующая тренировка', rarity: 'rare' };
    }
    return { kind: 'aura_peek', amount: 1, label: 'Превью следующей ауры', sub: 'на 24 часа', rarity: 'epic' };
  }
  // Common — рандом листиков в диапазоне
  const amount = Math.round(info.minLeaves + Math.random() * (info.maxLeaves - info.minLeaves));
  return {
    kind: 'leaves',
    amount,
    label: `🌿 ${amount} листиков`,
    rarity: amount > info.maxLeaves * 0.7 ? 'rare' : 'common',
  };
}

type Props = {
  visible: boolean;
  summary: WorkoutSummary | null;
  onClose: () => void;
};

export function ChestRewardModal({ visible, summary, onClose }: Props) {
  const earn = useLeafEconomyStore((s) => s.earn);
  const [opened, setOpened] = useState(false);
  const [reward, setReward] = useState<ChestReward | null>(null);

  const tier: ChestTier | null = useMemo(() => (summary ? tierForSummary(summary) : null), [summary]);
  const tierInfo = tier ? TIER_INFO[tier] : null;

  // Reanimated values
  const shake = useSharedValue(0);
  const lid = useSharedValue(0);
  const glow = useSharedValue(0);
  const rewardScale = useSharedValue(0);

  useEffect(() => {
    if (visible) {
      setOpened(false);
      setReward(null);
      shake.value = 0;
      lid.value = 0;
      glow.value = 0;
      rewardScale.value = 0;
    }
  }, [visible, shake, lid, glow, rewardScale]);

  const handleOpen = () => {
    if (opened || !tier) return;
    setOpened(true);
    // Shake → open → reward burst
    shake.value = withSequence(
      withTiming(1, { duration: 90, easing: Easing.inOut(Easing.quad) }),
      withTiming(-1, { duration: 90 }),
      withTiming(1, { duration: 90 }),
      withTiming(-1, { duration: 90 }),
      withTiming(0, { duration: 60 }),
    );
    lid.value = withDelay(440, withTiming(1, { duration: 380, easing: Easing.out(Easing.back(1.5)) }));
    glow.value = withDelay(440, withTiming(1, { duration: 600 }));
    const r = rollReward(tier);
    setTimeout(() => {
      setReward(r);
      if (r.kind === 'leaves') earn(r.amount, `chest_${tier}`);
      rewardScale.value = withSpring(1, { damping: 8, stiffness: 110 });
    }, 700);
  };

  const chestStyle = useAnimatedStyle(() => ({
    transform: [
      { translateX: interpolate(shake.value, [-1, 0, 1], [-6, 0, 6]) },
      { rotate: `${interpolate(shake.value, [-1, 0, 1], [-2, 0, 2])}deg` },
    ],
  }));

  const lidStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: interpolate(lid.value, [0, 1], [0, -30]) },
      { rotate: `${interpolate(lid.value, [0, 1], [0, -28])}deg` },
    ],
  }));

  const glowStyle = useAnimatedStyle(() => ({
    opacity: glow.value * 0.85,
    transform: [{ scale: 0.7 + glow.value * 0.6 }],
  }));

  const rewardCardStyle = useAnimatedStyle(() => ({
    opacity: rewardScale.value,
    transform: [{ scale: rewardScale.value }],
  }));

  if (!visible || !tier || !tierInfo) return null;

  return (
    <Modal visible={visible} transparent animationType="fade" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.92)', justifyContent: 'center', alignItems: 'center', padding: 16 }}>
        <View
          style={{
            width: '100%',
            maxWidth: 380,
            padding: 24,
            borderRadius: radii.xl,
            backgroundColor: colors.bg,
            borderWidth: 1,
            borderColor: tierInfo.primary + '88',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              color: tierInfo.primary,
              fontFamily: fontFamilies.heading,
              fontSize: 16,
              letterSpacing: 2,
              textShadowColor: tierInfo.primary,
              textShadowRadius: 12,
            }}
          >
            {tierInfo.name.toUpperCase()} {t('chest.title')}
          </Text>
          {summary ? (
            <Text style={{ marginTop: 4, color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11 }}>
              {summary.completedSets}/{summary.totalSets} · {summary.prs.length > 0 ? `${summary.prs.length} PR` : t('chest.solid')}
            </Text>
          ) : null}

          {/* Chest area */}
          <View style={{ width: 240, height: 220, alignItems: 'center', justifyContent: 'center', marginTop: 18 }}>
            <Animated.View
              pointerEvents="none"
              style={[
                {
                  position: 'absolute',
                  width: 240,
                  height: 240,
                  borderRadius: 120,
                  backgroundColor: tierInfo.primary + '44',
                },
                glowStyle,
              ]}
            />
            <Animated.View style={chestStyle}>
              <ChestSvg tier={tier} lidStyle={lidStyle} primary={tierInfo.primary} secondary={tierInfo.secondary} />
            </Animated.View>

            {reward ? (
              <Animated.View
                style={[
                  {
                    position: 'absolute',
                    top: -20,
                    width: 280,
                    alignItems: 'center',
                  },
                  rewardCardStyle,
                ]}
              >
                <View
                  style={{
                    paddingVertical: 14,
                    paddingHorizontal: 18,
                    borderRadius: 18,
                    borderWidth: 2,
                    borderColor: rarityColor(reward.rarity),
                    backgroundColor: 'rgba(13,16,32,0.95)',
                    alignItems: 'center',
                    shadowColor: rarityColor(reward.rarity),
                    shadowOpacity: 0.7,
                    shadowRadius: 20,
                  }}
                >
                  <Text
                    style={{
                      color: rarityColor(reward.rarity),
                      fontFamily: fontFamilies.body700,
                      fontSize: 10,
                      letterSpacing: 2,
                    }}
                  >
                    {rarityLabel(reward.rarity)}
                  </Text>
                  <Text
                    style={{
                      marginTop: 4,
                      color: colors.text,
                      fontFamily: fontFamilies.body700,
                      fontSize: 18,
                      textShadowColor: rarityColor(reward.rarity),
                      textShadowRadius: 8,
                    }}
                  >
                    {reward.label}
                  </Text>
                  {reward.sub ? (
                    <Text style={{ marginTop: 2, color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 11 }}>
                      {reward.sub}
                    </Text>
                  ) : null}
                </View>
              </Animated.View>
            ) : null}
          </View>

          {!opened ? (
            <Text style={{ marginTop: 8, color: colors.text, fontFamily: fontFamilies.body, fontSize: 13, textAlign: 'center' }}>
              {t('chest.tapToOpen')}
            </Text>
          ) : null}

          <View style={{ marginTop: 24, width: '100%' }}>
            {!opened ? (
              <GradientButton
                title={t('chest.open')}
                onPress={handleOpen}
                rightIcon={<Ionicons name="gift" size={18} color="#fff" />}
              />
            ) : reward ? (
              <GradientButton
                title={t('chest.claim')}
                onPress={onClose}
                rightIcon={<Ionicons name="checkmark-circle" size={18} color="#fff" />}
              />
            ) : (
              <Text style={{ color: colors.textMuted, textAlign: 'center', fontFamily: fontFamilies.body }}>
                {t('chest.opening')}
              </Text>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
}

function rarityColor(r: ChestReward['rarity']) {
  switch (r) {
    case 'common': return '#9D9DAE';
    case 'rare': return '#3FA8FF';
    case 'epic': return '#9D6BFF';
    case 'jackpot': return '#FFD27A';
  }
}

function rarityLabel(r: ChestReward['rarity']) {
  switch (r) {
    case 'common': return 'ОБЫЧНОЕ';
    case 'rare': return 'РЕДКОЕ';
    case 'epic': return 'ЭПИК';
    case 'jackpot': return '★ ДЖЕКПОТ ★';
  }
}

function ChestSvg({
  tier, lidStyle, primary, secondary,
}: {
  tier: ChestTier;
  lidStyle: any;
  primary: string;
  secondary: string;
}) {
  const id = tier;
  return (
    <View style={{ width: 200, height: 160 }}>
      <Svg width="100%" height="100%" viewBox="0 0 200 160">
        <Defs>
          <SvgGrad id={`body-${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={primary} />
            <Stop offset="1" stopColor={secondary} />
          </SvgGrad>
          <SvgGrad id={`metal-${id}`} x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor="#FFFFFF" stopOpacity="0.6" />
            <Stop offset="1" stopColor={secondary} />
          </SvgGrad>
        </Defs>
        {/* Body */}
        <Rect x="24" y="70" width="152" height="78" rx="6" fill={`url(#body-${id})`} />
        {/* Side bands */}
        <Rect x="24" y="100" width="152" height="6" fill={secondary} opacity="0.55" />
        <Rect x="48" y="70" width="6" height="78" fill={secondary} opacity="0.55" />
        <Rect x="146" y="70" width="6" height="78" fill={secondary} opacity="0.55" />
        {/* Keyhole */}
        <Circle cx="100" cy="118" r="6" fill="#1A1A28" />
        <Rect x="98" y="118" width="4" height="10" fill="#1A1A28" />
      </Svg>
      {/* Lid (animated separately) */}
      <Animated.View
        style={[
          { position: 'absolute', top: 0, left: 0, width: 200, height: 80 },
          lidStyle,
        ]}
      >
        <Svg width="100%" height="100%" viewBox="0 0 200 80">
          <Defs>
            <SvgGrad id={`lid-${id}`} x1="0" y1="0" x2="0" y2="1">
              <Stop offset="0" stopColor={primary} />
              <Stop offset="1" stopColor={secondary} />
            </SvgGrad>
          </Defs>
          {/* Curved lid */}
          <Path d="M24 78 Q24 30 100 30 Q176 30 176 78 L176 78 L24 78 Z" fill={`url(#lid-${id})`} />
          {/* Band on lid */}
          <Rect x="48" y="30" width="6" height="48" fill={secondary} opacity="0.55" />
          <Rect x="146" y="30" width="6" height="48" fill={secondary} opacity="0.55" />
          {/* Latch */}
          <Rect x="92" y="58" width="16" height="20" rx="2" fill={`url(#metal-${id})`} />
          <Circle cx="100" cy="68" r="3" fill="#1A1A28" />
        </Svg>
      </Animated.View>
    </View>
  );
}
