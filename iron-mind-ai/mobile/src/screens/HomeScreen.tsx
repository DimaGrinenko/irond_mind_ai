import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { CyberAthlete } from '../components/anatomy/CyberAthlete';
import { NeonScene3D } from '../components/3d/NeonScene3D';
import { RingChart } from '../components/charts/RingChart';
import { NeonCard } from '../components/common/NeonCard';
import { NeonText } from '../components/common/NeonText';
import { GradientButton } from '../components/common/GradientButton';
import { colors, neonTextShadow } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { useUserStore } from '../store/userStore';
import { useWorkoutsStore } from '../store/workoutsStore';
import { useActiveWorkoutStore } from '../store/activeWorkoutStore';
import { levelForXp, useProgressStore } from '../store/progressStore';
import { useNavigation } from '@react-navigation/native';
import { AppearUp } from '../components/anim/Appear';
import { TapScale } from '../components/anim/TapScale';
import { AnimatedCounter } from '../components/anim/AnimatedCounter';
import { Particles } from '../components/anim/Particles';
import { StreakFire } from '../components/common/StreakFire';

export function HomeScreen() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const user = useUserStore();
  const hydrateWorkouts = useWorkoutsStore((s) => s.hydrate);
  const startActive = useActiveWorkoutStore((s) => s.start);
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const totalWorkouts = useProgressStore((s) => s.totalWorkouts);
  const level = levelForXp(xp);

  useEffect(() => {
    hydrateWorkouts().catch(() => null);
  }, [hydrateWorkouts]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* aurora background blob */}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: -100, left: -80, width: 400, height: 400, opacity: 0.55 }}
      >
        <LinearGradient
          colors={['rgba(157,107,255,0.55)', 'rgba(157,107,255,0)']}
          style={{ flex: 1, borderRadius: 200 }}
        />
      </View>
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: 220, right: -100, width: 360, height: 360, opacity: 0.45 }}
      >
        <LinearGradient
          colors={['rgba(255,77,210,0.45)', 'rgba(255,77,210,0)']}
          style={{ flex: 1, borderRadius: 180 }}
        />
      </View>
      <Particles count={26} height={620} />
      <ScrollView contentContainerStyle={{ paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="sparkles" size={18} color={colors.cyan} style={{ textShadowColor: colors.cyan, textShadowRadius: 12 }} />
            <NeonText variant="eyebrow" glow="cyan" glowRadius={10}>
              AI TRAINER
            </NeonText>
          </View>
          <View style={{ flex: 1 }} />
          <Pressable
            onPress={() => nav.navigate('Subscription')}
            accessibilityRole="button"
            accessibilityLabel="Подписка"
            hitSlop={10}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              borderWidth: 1,
              borderColor: 'rgba(157,107,255,0.55)',
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(13,16,32,0.7)',
              shadowColor: colors.purple,
              shadowOpacity: 0.6,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 0 },
              elevation: 8,
            }}
          >
            <Ionicons name="notifications-outline" size={18} color={colors.purpleLight} />
          </Pressable>
        </View>

        <AppearUp delayMs={0}>
          <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
            <Text
              style={[
                { color: colors.text, fontFamily: fontFamilies.body700, fontSize: 28, lineHeight: 32 },
                neonTextShadow('rgba(157,107,255,0.55)', 14),
              ]}
            >
              Привет,
            </Text>
            <Text
              style={[
                { color: colors.text, fontFamily: fontFamilies.body700, fontSize: 28, lineHeight: 32 },
                neonTextShadow('rgba(255,77,210,0.65)', 16),
              ]}
            >
              {user.name} <Text style={{ fontSize: 22 }}>👋</Text>
            </Text>

            <NeonText variant="eyebrow" glow="none" style={{ marginTop: 14, color: colors.textMuted }}>
              Твоя цель
            </NeonText>
            <Text
              style={[
                { marginTop: 4, color: colors.text, fontFamily: fontFamilies.body600 },
                neonTextShadow('rgba(157,107,255,0.35)', 8),
              ]}
            >
              {user.goal}
            </Text>
          </View>
        </AppearUp>

        <AppearUp delayMs={80}>
          <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
            <NeonCard tint="purple" intensity={0.85}>
              <View style={{ padding: 16, flexDirection: 'row', gap: 14, alignItems: 'center' }}>
                <View
                  style={{
                    width: 56,
                    height: 56,
                    borderRadius: 16,
                    backgroundColor: 'rgba(13,16,32,0.9)',
                    borderWidth: 1,
                    borderColor: 'rgba(157,107,255,0.6)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    shadowColor: colors.purple,
                    shadowOpacity: 0.7,
                    shadowRadius: 16,
                    shadowOffset: { width: 0, height: 0 },
                    elevation: 8,
                  }}
                >
                  <Ionicons name="barbell" size={24} color={colors.purpleLight} />
                </View>

                <View style={{ flex: 1 }}>
                  <NeonText variant="eyebrow" glow="none" style={{ color: colors.textMuted }}>
                    Текущая программа
                  </NeonText>
                  <Text
                    style={[
                      { marginTop: 4, color: colors.text, fontFamily: fontFamilies.body700, fontSize: 15 },
                      neonTextShadow('rgba(157,107,255,0.55)', 10),
                    ]}
                  >
                    Масса · Продвинутый
                  </Text>
                  <Text style={{ marginTop: 2, color: colors.textSecondary, fontFamily: fontFamilies.body }}>
                    Неделя 1 из 12
                  </Text>
                </View>

                <View style={{ alignItems: 'center', justifyContent: 'center' }}>
                  <RingChart size={58} strokeWidth={7} progress={0.78} />
                  <Text
                    style={[
                      {
                        position: 'absolute',
                        color: colors.text,
                        fontFamily: fontFamilies.body700,
                        fontSize: 13,
                      },
                      neonTextShadow(colors.purple, 10),
                    ]}
                  >
                    78%
                  </Text>
                </View>
              </View>
            </NeonCard>
          </View>
        </AppearUp>

        <AppearUp delayMs={140}>
          <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <NeonCard tint="cyan" intensity={0.7}>
              <View style={{ padding: 16, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ alignItems: 'flex-start' }}>
                    <NeonText variant="eyebrow" glow="none" style={{ color: colors.textMuted }}>
                      Тренировки
                    </NeonText>
                    <AnimatedCounter
                      to={totalWorkouts}
                      style={[
                        { marginTop: 6, color: colors.text, fontFamily: fontFamilies.body700, fontSize: 22 },
                        neonTextShadow(colors.cyan, 12),
                      ]}
                    />
                  </View>
                  <View style={{ alignItems: 'flex-start' }}>
                    <NeonText variant="eyebrow" glow="none" style={{ color: colors.textMuted }}>
                      Уровень
                    </NeonText>
                    <AnimatedCounter
                      to={level}
                      duration={900}
                      style={[
                        { marginTop: 6, color: colors.text, fontFamily: fontFamilies.body700, fontSize: 22 },
                        neonTextShadow(colors.amber, 12),
                      ]}
                    />
                  </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <StreakFire days={streak} size={72} />
                  <NeonText variant="eyebrow" glow="amber" glowRadius={8} style={{ marginTop: 2, fontSize: 10 }}>
                    ДНЕЙ ПОДРЯД
                  </NeonText>
                </View>
              </View>
            </NeonCard>
          </View>
        </AppearUp>

        <AppearUp delayMs={200}>
          <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <NeonCard tint="aurora" intensity={0.95}>
              <View style={{ padding: 16, flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1 }}>
                  <NeonText variant="eyebrow" glow="pink" glowRadius={10}>
                    Сегодняшняя тренировка
                  </NeonText>
                  <Text
                    style={[
                      { marginTop: 10, color: colors.text, fontFamily: fontFamilies.body700, fontSize: 18 },
                      neonTextShadow('rgba(255,77,210,0.65)', 14),
                    ]}
                  >
                    Грудь + Трицепс
                  </Text>
                  <Text style={{ marginTop: 4, color: colors.textSecondary, fontFamily: fontFamilies.body }}>
                    6 упражнений · ~58 мин
                  </Text>

                  <View style={{ marginTop: 14 }}>
                    <GradientButton
                      variant="aurora"
                      title="Начать тренировку"
                      rightIcon={<Ionicons name="flash" size={18} color="#fff" />}
                      onPress={async () => {
                        await startActive('Грудь + Трицепс', [
                          'bench_press',
                          'incline_db_press',
                          'db_fly',
                          'dips',
                          'skull_crushers',
                          'cable_pushdown',
                        ]);
                        nav.navigate('Workout');
                      }}
                    />
                  </View>
                </View>

                <View style={{ width: 160, alignItems: 'flex-end', justifyContent: 'flex-end' }}>
                  <HeroBody />
                </View>
              </View>
            </NeonCard>
          </View>
        </AppearUp>

        <AppearUp delayMs={260}>
          <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
            <NeonText variant="eyebrow" glow="purple" glowRadius={10}>
              Быстрые действия
            </NeonText>
            <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
              {(
                [
                  { t: 'Замеры тела', icon: 'body-outline', tint: colors.cyan, go: () => nav.navigate('BodyMeasurements') },
                  { t: 'Питание', icon: 'restaurant-outline', tint: colors.green, go: () => nav.navigate('Nutrition') },
                  { t: 'Фото', icon: 'camera-outline', tint: colors.amber, go: () => nav.navigate('ProgressPhotos') },
                  { t: 'Аналитика', icon: 'analytics-outline', tint: colors.pink, go: () => nav.navigate('RootTabs', { screen: 'Analytics' }) },
                ] as const
              ).map((x) => (
                <TapScale
                  key={x.t}
                  onPress={x.go}
                  accessibilityRole="button"
                  accessibilityLabel={x.t}
                  style={{ alignItems: 'center', width: 78 }}
                >
                  <View
                    style={{
                      width: 58,
                      height: 58,
                      borderRadius: 18,
                      backgroundColor: 'rgba(13,16,32,0.95)',
                      borderWidth: 1,
                      borderColor: x.tint + 'AA',
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: x.tint,
                      shadowOpacity: 0.7,
                      shadowRadius: 14,
                      shadowOffset: { width: 0, height: 0 },
                      elevation: 8,
                    }}
                  >
                    <Ionicons name={x.icon as any} size={22} color={x.tint} />
                  </View>
                  <Text
                    style={{
                      marginTop: 8,
                      color: colors.textSecondary,
                      fontFamily: fontFamilies.body500,
                      fontSize: 11,
                      textAlign: 'center',
                    }}
                  >
                    {x.t}
                  </Text>
                </TapScale>
              ))}
            </View>
          </View>
        </AppearUp>
      </ScrollView>
    </View>
  );
}

function HeroBody() {
  return (
    <View style={{ width: 170, height: 220, alignItems: 'center', justifyContent: 'flex-end' }}>
      <NeonScene3D height={220}>
        <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
          <CyberAthlete width={160} height={210} />
        </View>
      </NeonScene3D>
    </View>
  );
}

