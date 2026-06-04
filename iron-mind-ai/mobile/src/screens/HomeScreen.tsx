import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Pressable,
  RefreshControl,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { CyberAthlete } from '../components/anatomy/CyberAthlete';
import { NeonScene3D } from '../components/3d/NeonScene3D';
import { RingChart } from '../components/charts/RingChart';
import { NeonCard } from '../components/common/NeonCard';
import { NeonText } from '../components/common/NeonText';
import { GradientButton } from '../components/common/GradientButton';
import { colors, neonTextShadow } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { fontFamilies } from '../theme/typography';
import { useUserStore } from '../store/userStore';
import { useAppStreakStore } from '../store/appStreakStore';
import { useActiveWorkoutStore } from '../store/activeWorkoutStore';
import { AppearUp } from '../components/anim/Appear';
import { TapScale } from '../components/anim/TapScale';
import { AnimatedCounter } from '../components/anim/AnimatedCounter';
import { Particles } from '../components/anim/Particles';
import { StreakDumbbell } from '../components/common/StreakDumbbell';
import { ProTrialBanner } from '../components/common/ProTrialBanner';
import {
  api,
  type ProgramFull,
  type UserDashboard,
  type ScheduledWorkout,
} from '../api/client';
import { t, useLang, goalLabel, programLabel, dayTitle } from '../i18n';

const VOLUME_PER_LEVEL = 5000; // 5 тонн = +1 уровень

function levelFromVolume(kg: number): {
  level: number;
  progress: number;
  toNext: number;
} {
  const level = Math.floor(kg / VOLUME_PER_LEVEL) + 1;
  const inLevel = kg % VOLUME_PER_LEVEL;
  return {
    level,
    progress: inLevel / VOLUME_PER_LEVEL,
    toNext: VOLUME_PER_LEVEL - inLevel,
  };
}

function todayWeekday(): number {
  return (new Date().getDay() + 6) % 7; // 0=Пн ... 6=Вс
}

export function HomeScreen() {
  useLang();
  const theme = useTheme();
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const userName = useUserStore((s) => s.name);
  const userGoalKey = useUserStore((s) => s.goalKey);
  const currentProgramId = useUserStore((s) => s.currentProgramId);
  const streakDays = useAppStreakStore((s) => s.streakDays);
  const startActive = useActiveWorkoutStore((s) => s.start);

  const [program, setProgram] = useState<ProgramFull | null>(null);
  const [stats, setStats] = useState<UserDashboard | null>(null);
  const [todayScheduled, setTodayScheduled] = useState<ScheduledWorkout[]>([]);

  const loadProgram = useCallback(async () => {
    if (!currentProgramId) {
      setProgram(null);
      return;
    }
    try {
      const p = await api.programs.one(currentProgramId);
      setProgram(p);
    } catch {
      setProgram(null);
    }
  }, [currentProgramId]);

  const loadStats = useCallback(async () => {
    try {
      const s = await api.stats.me(30);
      setStats(s);
    } catch {
      setStats(null);
    }
  }, []);

  const loadTodayScheduled = useCallback(async () => {
    try {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const iso = today.toISOString().slice(0, 10);
      const list = await api.schedule.list(iso, iso);
      setTodayScheduled(list);
    } catch {
      setTodayScheduled([]);
    }
  }, []);

  const [refreshing, setRefreshing] = useState(false);
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([loadProgram(), loadStats(), loadTodayScheduled()]);
    setRefreshing(false);
  }, [loadProgram, loadStats, loadTodayScheduled]);

  useFocusEffect(
    useCallback(() => {
      loadProgram();
      loadStats();
      loadTodayScheduled();
    }, [loadProgram, loadStats, loadTodayScheduled]),
  );

  const todayDone = todayScheduled.some((s) => s.status === 'DONE');

  const todayDay = useMemo(() => {
    if (!program?.days?.length) return null;
    const wd = todayWeekday();
    // 1) ищем по weekday
    const byWeekday = program.days.find((d) => d.weekday === wd);
    if (byWeekday) return byWeekday;
    // 2) fallback — первый день в программе
    return program.days[0];
  }, [program]);

  const totalWorkouts = stats?.totalWorkoutsAllTime ?? 0;
  const totalVolume = stats?.totalVolumeKgAllTime ?? 0;
  const lvl = levelFromVolume(totalVolume);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* aurora background blobs */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: -100,
          left: -80,
          width: 400,
          height: 400,
          opacity: 0.55,
        }}
      >
        <LinearGradient
          colors={[theme.accentSoft, 'rgba(0,0,0,0)']}
          style={{ flex: 1, borderRadius: 200 }}
        />
      </View>
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 220,
          right: -100,
          width: 360,
          height: 360,
          opacity: 0.45,
        }}
      >
        <LinearGradient
          colors={['rgba(255,77,210,0.45)', 'rgba(255,77,210,0)']}
          style={{ flex: 1, borderRadius: 180 }}
        />
      </View>
      <Particles count={26} height={620} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 112 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={theme.accentLight}
            colors={[theme.accentLight]}
          />
        }
      >
        <View
          style={{
            paddingTop: insets.top + 8,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons
              name="sparkles"
              size={18}
              color={colors.cyan}
              style={{ textShadowColor: colors.cyan, textShadowRadius: 12 }}
            />
            <NeonText variant="eyebrow" glow="cyan" glowRadius={10}>
              AI TRAINER
            </NeonText>
          </View>
          <View style={{ flex: 1 }} />
          <Pressable
            onPress={() => nav.navigate('Subscription')}
            hitSlop={10}
            style={{
              width: 38,
              height: 38,
              borderRadius: 19,
              borderWidth: 1,
              borderColor: theme.borderNeon,
              alignItems: 'center',
              justifyContent: 'center',
              backgroundColor: 'rgba(13,16,32,0.7)',
              shadowColor: theme.glow,
              shadowOpacity: 0.6,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 0 },
              elevation: 8,
            }}
          >
            <Ionicons
              name="notifications-outline"
              size={18}
              color={theme.accentLight}
            />
          </Pressable>
        </View>

        <AppearUp delayMs={0}>
          <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
            <Text
              style={[
                {
                  color: colors.text,
                  fontFamily: fontFamilies.body700,
                  fontSize: 28,
                  lineHeight: 32,
                },
                neonTextShadow(theme.glow, 14),
              ]}
            >
              {t('home.greeting')}
            </Text>
            <Text
              style={[
                {
                  color: colors.text,
                  fontFamily: fontFamilies.body700,
                  fontSize: 28,
                  lineHeight: 32,
                },
                neonTextShadow(theme.glow, 16),
              ]}
            >
              {userName || t('profile.athlete')}
            </Text>

            {userGoalKey ? (
              <>
                <NeonText
                  variant="eyebrow"
                  glow="none"
                  style={{ marginTop: 14, color: colors.textMuted }}
                >
                  {t('home.goal')}
                </NeonText>
                <Text
                  style={[
                    {
                      marginTop: 4,
                      color: colors.text,
                      fontFamily: fontFamilies.body600,
                    },
                    neonTextShadow(theme.glow, 8),
                  ]}
                >
                  {goalLabel(userGoalKey)}
                </Text>
              </>
            ) : null}
          </View>
        </AppearUp>

        <ProTrialBanner />

        {/* Текущая программа — из API */}
        <AppearUp delayMs={80}>
          <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
            {program ? (
              <Pressable
                onPress={() =>
                  nav.navigate('ProgramDetail', { programId: program.id })
                }
              >
                <NeonCard tint="purple" intensity={0.85}>
                  <View
                    style={{
                      padding: 16,
                      flexDirection: 'row',
                      gap: 14,
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        width: 56,
                        height: 56,
                        borderRadius: 16,
                        backgroundColor: 'rgba(13,16,32,0.9)',
                        borderWidth: 1,
                        borderColor: theme.borderNeon,
                        alignItems: 'center',
                        justifyContent: 'center',
                        shadowColor: theme.glow,
                        shadowOpacity: 0.7,
                        shadowRadius: 16,
                        shadowOffset: { width: 0, height: 0 },
                        elevation: 8,
                      }}
                    >
                      <Ionicons
                        name={(program.iconName || 'barbell') as any}
                        size={24}
                        color={theme.accentLight}
                      />
                    </View>

                    <View style={{ flex: 1 }}>
                      <NeonText
                        variant="eyebrow"
                        glow="none"
                        style={{ color: colors.textMuted }}
                      >
                        {t('home.currentProgram')}
                      </NeonText>
                      <Text
                        style={[
                          {
                            marginTop: 4,
                            color: colors.text,
                            fontFamily: fontFamilies.body700,
                            fontSize: 15,
                          },
                          neonTextShadow(theme.glow, 10),
                        ]}
                      >
                        {programLabel(program.id, program.title)}
                      </Text>
                      <Text
                        style={{
                          marginTop: 2,
                          color: colors.textSecondary,
                          fontFamily: fontFamilies.body,
                        }}
                      >
                        {program.weeks > 0
                          ? `${program.daysPerWeek}${t('common.perWeek')} · ${program.weeks} ${t('common.weekShort')}`
                          : '—'}
                      </Text>
                    </View>

                    <Ionicons
                      name="chevron-forward"
                      size={20}
                      color={colors.textMuted}
                    />
                  </View>
                </NeonCard>
              </Pressable>
            ) : (
              <NeonCard tint="aurora" intensity={0.95}>
                <View style={{ padding: 16 }}>
                  <NeonText variant="eyebrow" glow="pink" glowRadius={10}>
                    {t('home.composePlan').toUpperCase()}
                  </NeonText>
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: fontFamilies.body700,
                      fontSize: 16,
                      marginTop: 6,
                    }}
                  >
                    {t('home.startWithProgram')}
                  </Text>
                  <Text
                    style={{
                      marginTop: 4,
                      color: colors.textSecondary,
                      fontFamily: fontFamilies.body,
                      fontSize: 12,
                    }}
                  >
                    {t('home.composeHint')}
                  </Text>
                  <View
                    style={{ marginTop: 14, flexDirection: 'row', gap: 10 }}
                  >
                    <Pressable
                      onPress={() => nav.navigate('PlanBuilder')}
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: colors.borderNeon,
                        backgroundColor: theme.accentSoft,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <Ionicons
                        name="construct-outline"
                        size={16}
                        color={theme.accentLight}
                      />
                      <Text
                        style={{
                          color: theme.accentLight,
                          fontFamily: fontFamilies.body700,
                          fontSize: 12,
                        }}
                      >
                        {t('home.composePlan')}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() =>
                        nav.navigate('RootTabs', { screen: 'Programs' })
                      }
                      style={{
                        flex: 1,
                        paddingVertical: 12,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: colors.border,
                        backgroundColor: colors.bgSecondary,
                        alignItems: 'center',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <Ionicons
                        name="grid-outline"
                        size={16}
                        color={colors.textSecondary}
                      />
                      <Text
                        style={{
                          color: colors.textSecondary,
                          fontFamily: fontFamilies.body700,
                          fontSize: 12,
                        }}
                      >
                        {t('home.openPrograms')}
                      </Text>
                    </Pressable>
                  </View>
                </View>
              </NeonCard>
            )}
          </View>
        </AppearUp>

        {/* Тренировки / Уровень / Дни захода */}
        <AppearUp delayMs={140}>
          <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <NeonCard tint="cyan" intensity={0.7}>
              <View
                style={{
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 12,
                }}
              >
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                  }}
                >
                  <View style={{ alignItems: 'flex-start' }}>
                    <NeonText
                      variant="eyebrow"
                      glow="none"
                      style={{ color: colors.textMuted }}
                    >
                      {t('home.workouts')}
                    </NeonText>
                    <AnimatedCounter
                      to={totalWorkouts}
                      style={[
                        {
                          marginTop: 6,
                          color: colors.text,
                          fontFamily: fontFamilies.body700,
                          fontSize: 22,
                        },
                        neonTextShadow(colors.cyan, 12),
                      ]}
                    />
                  </View>
                  <View style={{ alignItems: 'flex-start' }}>
                    <NeonText
                      variant="eyebrow"
                      glow="none"
                      style={{ color: colors.textMuted }}
                    >
                      {t('home.level')}
                    </NeonText>
                    <AnimatedCounter
                      to={lvl.level}
                      duration={900}
                      style={[
                        {
                          marginTop: 6,
                          color: colors.text,
                          fontFamily: fontFamilies.body700,
                          fontSize: 22,
                        },
                        neonTextShadow(colors.amber, 12),
                      ]}
                    />
                    <Text
                      style={{
                        color: colors.textMuted,
                        fontFamily: fontFamilies.body,
                        fontSize: 10,
                        marginTop: 2,
                      }}
                    >
                      {t('home.volumeKg', {
                        v: totalVolume.toLocaleString('ru'),
                      })}
                    </Text>
                  </View>
                </View>
                <View style={{ alignItems: 'center' }}>
                  <StreakDumbbell days={streakDays} size={72} />
                  <NeonText
                    variant="eyebrow"
                    glow="amber"
                    glowRadius={8}
                    style={{ marginTop: 10, fontSize: 10 }}
                  >
                    {t('home.streak').toUpperCase()}
                  </NeonText>
                </View>
              </View>
            </NeonCard>
          </View>
        </AppearUp>

        {/* Сегодняшняя тренировка — показывается только когда есть программа */}
        {program ? (
          <AppearUp delayMs={200}>
            <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
              <NeonCard tint="aurora" intensity={0.95}>
                <View style={{ padding: 16, flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    {todayDone ? (
                      <>
                        <NeonText variant="eyebrow" glow="cyan" glowRadius={10}>
                          {t('home.today').toUpperCase()}
                        </NeonText>
                        <Text
                          style={[
                            {
                              marginTop: 10,
                              color: colors.text,
                              fontFamily: fontFamilies.body700,
                              fontSize: 18,
                            },
                            neonTextShadow(colors.green, 12),
                          ]}
                        >
                          ✅ {t('home.todayDone')}
                        </Text>
                        <Text
                          style={{
                            marginTop: 4,
                            color: colors.textSecondary,
                            fontFamily: fontFamilies.body,
                            fontSize: 13,
                          }}
                        >
                          {t('home.todayDoneHint')}
                        </Text>
                        <View style={{ marginTop: 14 }}>
                          <GradientButton
                            variant="cyber"
                            title={t('home.openHistory')}
                            rightIcon={
                              <Ionicons name="time" size={18} color="#fff" />
                            }
                            onPress={() => nav.navigate('WorkoutsHistory')}
                          />
                        </View>
                      </>
                    ) : todayDay ? (
                      <>
                        <NeonText variant="eyebrow" glow="pink" glowRadius={10}>
                          {t('home.today').toUpperCase()}
                        </NeonText>
                        <Text
                          style={[
                            {
                              marginTop: 10,
                              color: colors.text,
                              fontFamily: fontFamilies.body700,
                              fontSize: 18,
                            },
                            neonTextShadow(theme.glow, 14),
                          ]}
                        >
                          {dayTitle(todayDay.title)}
                        </Text>
                        <Text
                          style={{
                            marginTop: 4,
                            color: colors.textSecondary,
                            fontFamily: fontFamilies.body,
                          }}
                        >
                          {todayDay.exercises.length} {t('common.exShort')} ·{' '}
                          {programLabel(program.id, program.title)}
                        </Text>

                        <View style={{ marginTop: 14 }}>
                          <GradientButton
                            variant="aurora"
                            title={t('home.startWorkout')}
                            rightIcon={
                              <Ionicons name="flash" size={18} color="#fff" />
                            }
                            onPress={async () => {
                              const inputs = todayDay.exercises.map((e) => ({
                                exerciseId: e.exerciseId,
                                setsCount: e.sets,
                                restSeconds: e.restSeconds,
                              }));
                              await startActive(todayDay.title, inputs);
                              nav.navigate('GymMode');
                            }}
                          />
                        </View>
                      </>
                    ) : (
                      <>
                        <NeonText variant="eyebrow" glow="pink" glowRadius={10}>
                          {t('home.composePlan').toUpperCase()}
                        </NeonText>
                        <Text
                          style={[
                            {
                              marginTop: 10,
                              color: colors.text,
                              fontFamily: fontFamilies.body700,
                              fontSize: 18,
                            },
                            neonTextShadow(theme.glow, 14),
                          ]}
                        >
                          {t('home.planNoDays')}
                        </Text>
                        <Text
                          style={{
                            marginTop: 4,
                            color: colors.textSecondary,
                            fontFamily: fontFamilies.body,
                          }}
                        >
                          {t('home.editPlan')}
                        </Text>
                        <View style={{ marginTop: 14 }}>
                          <GradientButton
                            variant="aurora"
                            title={t('home.openProgram')}
                            rightIcon={
                              <Ionicons
                                name="arrow-forward"
                                size={18}
                                color="#fff"
                              />
                            }
                            onPress={() =>
                              nav.navigate('ProgramDetail', {
                                programId: program.id,
                              })
                            }
                          />
                        </View>
                      </>
                    )}
                  </View>

                  <View
                    style={{
                      width: 160,
                      alignItems: 'flex-end',
                      justifyContent: 'flex-end',
                    }}
                  >
                    <HeroBody />
                  </View>
                </View>
              </NeonCard>
            </View>
          </AppearUp>
        ) : null}

        {/* AI tip */}
        <AppearUp delayMs={230}>
          <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <Pressable
              onPress={() => nav.navigate('RootTabs', { screen: 'AiTrainer' })}
            >
              <NeonCard tint="cyan" intensity={0.6}>
                <View
                  style={{
                    padding: 14,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                  }}
                >
                  <View
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: 'rgba(0,229,255,0.45)',
                      backgroundColor: 'rgba(0,229,255,0.12)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="sparkles" size={22} color={colors.cyan} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <NeonText
                      variant="eyebrow"
                      glow="cyan"
                      glowRadius={8}
                      style={{ fontSize: 10 }}
                    >
                      {t('home.aiTip').toUpperCase()}
                    </NeonText>
                    <Text
                      style={{
                        marginTop: 4,
                        color: colors.text,
                        fontFamily: fontFamilies.body600,
                        fontSize: 13,
                      }}
                    >
                      {todayDone
                        ? t('home.todayMissing')
                        : todayDay
                          ? t('home.todayActive', {
                              title: dayTitle(todayDay.title),
                            })
                          : t('home.pickProgFirst')}
                    </Text>
                    <Text
                      style={{
                        marginTop: 6,
                        color: colors.cyan,
                        fontFamily: fontFamilies.body700,
                        fontSize: 11,
                      }}
                    >
                      {t('home.aiTipMore')} →
                    </Text>
                  </View>
                </View>
              </NeonCard>
            </Pressable>
          </View>
        </AppearUp>

        {/* Быстрые действия */}
        <AppearUp delayMs={260}>
          <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
            <NeonText variant="eyebrow" glow="purple" glowRadius={10}>
              {t('home.quickActions')}
            </NeonText>
            <View
              style={{
                marginTop: 12,
                flexDirection: 'row',
                justifyContent: 'space-between',
              }}
            >
              {(
                [
                  {
                    label: t('home.measurements'),
                    icon: 'body-outline',
                    tint: colors.cyan,
                    go: () => nav.navigate('BodyMeasurements'),
                  },
                  {
                    label: t('home.nutrition'),
                    icon: 'restaurant-outline',
                    tint: colors.green,
                    go: () => nav.navigate('Nutrition'),
                  },
                  {
                    label: t('home.photos'),
                    icon: 'camera-outline',
                    tint: colors.amber,
                    go: () => nav.navigate('ProgressPhotos'),
                  },
                  {
                    label: t('home.analytics'),
                    icon: 'analytics-outline',
                    tint: colors.pink,
                    go: () => nav.navigate('RootTabs', { screen: 'Analytics' }),
                  },
                ] as const
              ).map((x) => (
                <TapScale
                  key={x.label}
                  onPress={x.go}
                  accessibilityRole="button"
                  accessibilityLabel={x.label}
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
                    {x.label}
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
    <View
      style={{
        width: 170,
        height: 220,
        alignItems: 'center',
        justifyContent: 'flex-end',
      }}
    >
      <NeonScene3D height={220}>
        <View style={{ position: 'absolute', right: 0, bottom: 0 }}>
          <CyberAthlete width={160} height={210} />
        </View>
      </NeonScene3D>
    </View>
  );
}
