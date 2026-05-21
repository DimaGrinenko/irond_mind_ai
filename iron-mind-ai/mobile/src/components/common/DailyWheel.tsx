/**
 * Колесо удачи — одно вращение в день, growing множитель по серии.
 */
import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Defs,
  LinearGradient as SvgGrad,
  Stop,
  Path,
  Circle,
  G,
  Text as SvgText,
} from 'react-native-svg';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { useDailyBonusStore, WHEEL_SECTORS } from '../../store/dailyBonusStore';
import { useLeafEconomyStore } from '../../store/leafEconomyStore';
import { api } from '../../api/client';
import { colors, radii } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { t } from '../../i18n';

const SIZE = 220;

export function DailyWheel({ embed = false }: { embed?: boolean }) {
  const canSpin = useDailyBonusStore((s) => s.canSpinToday());
  const spin = useDailyBonusStore((s) => s.spin);
  const streakDays = useDailyBonusStore((s) => s.streakDays);
  const applyDaily = useDailyBonusStore((s) => s.applyWallet);
  const applyLeaf = useLeafEconomyStore((s) => s.applyWallet);
  const [result, setResult] = useState<{
    total: number;
    multiplier: number;
  } | null>(null);
  const [spinning, setSpinning] = useState(false);

  const angle = useSharedValue(0);

  // Подтянуть серверный кошелёк (баланс + можно ли крутить сегодня + стрик).
  useEffect(() => {
    api.economy
      .wallet()
      .then((w) => {
        applyLeaf(w);
        applyDaily(w.canSpinToday, w.wheelStreak);
      })
      .catch(() => {
        /* offline — локальный кэш */
      });
  }, [applyDaily, applyLeaf]);

  const handleSpin = async () => {
    if (!canSpin || spinning) return;
    setSpinning(true);
    const res = await spin();
    if (!res.ok) {
      setSpinning(false);
      return;
    }
    const sectorAngle = 360 / WHEEL_SECTORS.length;
    const targetCenter = -(res.sectorIndex * sectorAngle + sectorAngle / 2); // стрелка наверху
    const spins = 5;
    angle.value = withTiming(spins * 360 + targetCenter, {
      duration: 3200,
      easing: Easing.out(Easing.cubic),
    });
    setTimeout(() => {
      setResult({ total: res.total, multiplier: res.multiplier });
      setSpinning(false);
    }, 3300);
  };

  const wheelStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${angle.value}deg` }],
  }));

  return (
    <View
      style={[{ paddingHorizontal: embed ? 0 : 16, marginTop: embed ? 0 : 12 }]}
    >
      <View
        style={{
          padding: 16,
          borderRadius: 18,
          borderWidth: 1,
          borderColor: canSpin ? '#FFD27A88' : colors.border,
          backgroundColor: canSpin
            ? 'rgba(255,210,122,0.08)'
            : colors.bgSecondary,
          alignItems: 'center',
        }}
      >
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            alignSelf: 'stretch',
            marginBottom: 10,
          }}
        >
          <Ionicons
            name="ribbon"
            size={18}
            color={canSpin ? '#FFD27A' : colors.textMuted}
          />
          <Text
            style={{
              flex: 1,
              marginLeft: 8,
              color: colors.text,
              fontFamily: fontFamilies.body700,
              fontSize: 14,
            }}
          >
            {t('wheel.title')}
          </Text>
          {streakDays >= 3 ? (
            <Text
              style={{
                color: '#FFD27A',
                fontFamily: fontFamilies.body700,
                fontSize: 11,
              }}
            >
              {t('wheel.streak', {
                n: streakDays,
                mult: streakDays >= 7 ? 2 : streakDays >= 5 ? 1.5 : 1.25,
              })}
            </Text>
          ) : null}
        </View>

        <View
          style={{
            width: SIZE,
            height: SIZE,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          {/* Стрелка */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: -2,
              zIndex: 2,
              width: 0,
              height: 0,
              borderLeftWidth: 10,
              borderRightWidth: 10,
              borderTopWidth: 16,
              borderLeftColor: 'transparent',
              borderRightColor: 'transparent',
              borderTopColor: '#FFD27A',
            }}
          />
          <Animated.View style={[{ width: SIZE, height: SIZE }, wheelStyle]}>
            <Svg width={SIZE} height={SIZE} viewBox="0 0 200 200">
              <Defs>
                <SvgGrad id="rim" x1="0" y1="0" x2="1" y2="1">
                  <Stop offset="0" stopColor="#FFD27A" />
                  <Stop offset="1" stopColor="#FFB547" />
                </SvgGrad>
              </Defs>
              <Circle
                cx="100"
                cy="100"
                r="98"
                fill="none"
                stroke="url(#rim)"
                strokeWidth="3"
              />
              {WHEEL_SECTORS.map((sector, i) => {
                const a1 =
                  (i / WHEEL_SECTORS.length) * Math.PI * 2 - Math.PI / 2;
                const a2 =
                  ((i + 1) / WHEEL_SECTORS.length) * Math.PI * 2 - Math.PI / 2;
                const x1 = 100 + Math.cos(a1) * 96;
                const y1 = 100 + Math.sin(a1) * 96;
                const x2 = 100 + Math.cos(a2) * 96;
                const y2 = 100 + Math.sin(a2) * 96;
                const aMid = (a1 + a2) / 2;
                const tx = 100 + Math.cos(aMid) * 60;
                const ty = 100 + Math.sin(aMid) * 60;
                return (
                  <G key={i}>
                    <Path
                      d={`M100 100 L${x1} ${y1} A96 96 0 0 1 ${x2} ${y2} Z`}
                      fill={sector.color}
                      fillOpacity="0.85"
                    />
                    <SvgText
                      x={tx}
                      y={ty + 4}
                      fill="#0A0A14"
                      fontSize="14"
                      fontWeight="700"
                      textAnchor="middle"
                    >
                      {sector.value}
                    </SvgText>
                  </G>
                );
              })}
              {/* Центральный hub */}
              <Circle
                cx="100"
                cy="100"
                r="14"
                fill="#1A1A28"
                stroke="#FFD27A"
                strokeWidth="2"
              />
            </Svg>
          </Animated.View>
        </View>

        {result ? (
          <View style={{ marginTop: 12, alignItems: 'center' }}>
            <Text
              style={{
                color: '#FFD27A',
                fontFamily: fontFamilies.body700,
                fontSize: 16,
              }}
            >
              {t('wheel.gotN', { n: result.total })}
            </Text>
            {result.multiplier > 1 ? (
              <Text
                style={{
                  marginTop: 2,
                  color: colors.pink,
                  fontFamily: fontFamilies.body700,
                  fontSize: 12,
                }}
              >
                ×{result.multiplier} streak bonus
              </Text>
            ) : null}
          </View>
        ) : null}

        <View style={{ marginTop: 14 }}>
          {canSpin ? (
            <Pressable
              onPress={handleSpin}
              style={{
                paddingHorizontal: 28,
                paddingVertical: 12,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: '#FFD27A',
                backgroundColor: 'rgba(255,210,122,0.22)',
              }}
            >
              <Text
                style={{
                  color: '#FFD27A',
                  fontFamily: fontFamilies.body700,
                  fontSize: 13,
                }}
              >
                {t('wheel.cta')}
              </Text>
            </Pressable>
          ) : (
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: fontFamilies.body,
                fontSize: 12,
              }}
            >
              {result ? t('wheel.tomorrow') : t('wheel.todayDone')}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
