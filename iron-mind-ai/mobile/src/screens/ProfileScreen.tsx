import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import { useFocusEffect } from '@react-navigation/native';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors, glow, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';
import { useAppStreakStore } from '../store/appStreakStore';
import { useActiveWorkoutStore } from '../store/activeWorkoutStore';
import { NotificationsSection } from '../components/settings/NotificationsSection';
import { ThemeSelector } from '../components/settings/ThemeSelector';
import { t, useLang, useLangStore, goalLabel } from '../i18n';
import { api } from '../api/client';
import { programLabel } from '../i18n';

export function ProfileScreen({ navigation }: any) {
  useLang();
  const userName = useUserStore((s) => s.name);
  const userGoalKey = useUserStore((s) => s.goalKey);
  const userGender = useUserStore((s) => s.gender);
  const userAge = useUserStore((s) => s.age);
  const userHeight = useUserStore((s) => s.heightCm);
  const userWeight = useUserStore((s) => s.weightKg);
  const currentProgramId = useUserStore((s) => s.currentProgramId);
  const authOnline = useAuthStore((s) => s.online);
  const authEmail = useAuthStore((s) => s.email);
  const isAdmin = useAuthStore((s) => s.isAdmin());
  const isCoach = useAuthStore((s) => s.isCoach());
  const [programTitle, setProgramTitle] = useState<string | null>(null);

  const loadProgram = useCallback(async () => {
    if (!currentProgramId) {
      setProgramTitle(null);
      return;
    }
    try {
      const p = await api.programs.one(currentProgramId);
      setProgramTitle(programLabel(p.id, p.title));
    } catch {
      setProgramTitle(null);
    }
  }, [currentProgramId]);

  useFocusEffect(
    useCallback(() => {
      loadProgram();
    }, [loadProgram]),
  );
  useEffect(() => {
    loadProgram();
  }, [loadProgram]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('profile.title')} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <LinearGradient
              colors={['rgba(79,31,184,0.22)', 'rgba(0,0,0,0.95)']}
              style={{ padding: 16 }}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
              >
                <LinearGradient
                  colors={['#7B3FE4', '#B14EFF'] as any}
                  style={{
                    width: 54,
                    height: 54,
                    borderRadius: 18,
                    alignItems: 'center',
                    justifyContent: 'center',
                    ...glow,
                  }}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: fontFamilies.body700,
                      fontSize: 18,
                    }}
                  >
                    {(userName || t('common.guest')).slice(0, 1).toUpperCase()}
                  </Text>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: fontFamilies.body700,
                      fontSize: 16,
                    }}
                  >
                    {userName || t('profile.athlete')}
                  </Text>
                  <Text
                    style={{
                      marginTop: 4,
                      color: colors.textSecondary,
                      fontFamily: fontFamilies.body600,
                      fontSize: 12,
                    }}
                  >
                    {goalLabel(userGoalKey) || t('profile.goalNotSet')}
                  </Text>
                </View>
                <Pressable
                  onPress={() => navigation.navigate('Subscription')}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 10,
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: 'rgba(123,63,228,0.55)',
                    backgroundColor: 'rgba(123,63,228,0.14)',
                  }}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: fontFamilies.body700,
                      fontSize: 12,
                    }}
                  >
                    {t('profile.premium')}
                  </Text>
                </Pressable>
              </View>

              <View
                style={{
                  marginTop: 14,
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                  rowGap: 14,
                }}
              >
                {(
                  [
                    {
                      label: t('profile.achievements'),
                      icon: 'trophy-outline' as const,
                      go: () => navigation.navigate('Achievements'),
                    },
                    {
                      label: t('home.workouts'),
                      icon: 'barbell-outline' as const,
                      go: () => navigation.navigate('WorkoutsHistory'),
                    },
                    {
                      label: t('profile.supplements'),
                      icon: 'flask-outline' as const,
                      go: () => navigation.navigate('Supplements'),
                    },
                    {
                      label: t('profile.calendar'),
                      icon: 'calendar-outline' as const,
                      go: () => navigation.navigate('Calendar'),
                    },
                    {
                      label: t('profile.qa.challenges'),
                      icon: 'flag-outline' as const,
                      go: () => navigation.navigate('Challenges'),
                    },
                    {
                      label: t('profile.qa.shop'),
                      icon: 'leaf-outline' as const,
                      go: () => navigation.navigate('LeafShop'),
                    },
                    {
                      label: t('profile.qa.friends'),
                      icon: 'people-outline' as const,
                      go: () => navigation.navigate('Friends'),
                    },
                    {
                      label: t('profile.qa.wellbeing'),
                      icon: 'pulse-outline' as const,
                      go: () => navigation.navigate('WellbeingDiary'),
                    },
                    userGender === 'female'
                      ? {
                          label: t('profile.qa.cycle'),
                          icon: 'moon-outline' as const,
                          go: () => navigation.navigate('CycleTracker'),
                        }
                      : null,
                    {
                      label: t('profile.qa.aiPlan'),
                      icon: 'sparkles-outline' as const,
                      go: () => navigation.navigate('AiProgramGen'),
                    },
                    {
                      label: t('profile.qa.coach'),
                      icon: 'medal-outline' as const,
                      go: () => navigation.navigate('LiveCoach'),
                    },
                    {
                      label: t('profile.qa.health'),
                      icon: 'heart-outline' as const,
                      go: () => navigation.navigate('HealthSync'),
                    },
                  ].filter(Boolean) as Array<{
                    label: string;
                    icon: any;
                    go: () => void;
                  }>
                ).map((x) => (
                  <Pressable
                    key={x.label}
                    onPress={x.go}
                    style={{ alignItems: 'center', width: 74 }}
                  >
                    <View
                      style={{
                        width: 54,
                        height: 54,
                        borderRadius: 16,
                        backgroundColor: colors.bgSecondary,
                        borderWidth: 1,
                        borderColor: 'rgba(42,42,62,0.9)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons
                        name={x.icon}
                        size={22}
                        color={colors.purpleLight}
                      />
                    </View>
                    <Text
                      style={{
                        marginTop: 8,
                        color: colors.textSecondary,
                        fontFamily: fontFamilies.body600,
                        fontSize: 11,
                        textAlign: 'center',
                      }}
                    >
                      {x.label}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </LinearGradient>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <Text
            style={{
              color: colors.textSecondary,
              fontFamily: fontFamilies.body600,
              fontSize: 12,
            }}
          >
            {t('profile.settings')}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 10, gap: 12 }}>
          {[
            {
              label: t('profile.goal'),
              v: goalLabel(userGoalKey) || t('profile.goalNotSet'),
              icon: 'flag-outline' as const,
              go: undefined,
            },
            {
              label: t('profile.params'),
              v:
                userAge && userHeight && userWeight
                  ? `${userAge} ${t('common.years')} · ${userHeight} ${t('common.cm')} · ${userWeight} ${t('common.kg')}`
                  : t('profile.paramsEmpty'),
              icon: 'body-outline' as const,
              go: () => navigation.navigate('BodyMeasurements'),
            },
            {
              label: t('profile.program'),
              v: currentProgramId
                ? (programTitle ?? t('profile.programActive'))
                : t('profile.programNone'),
              icon: 'barbell-outline' as const,
              go: () =>
                currentProgramId
                  ? navigation.navigate('ProgramDetail', {
                      programId: currentProgramId,
                    })
                  : navigation.navigate('RootTabs', { screen: 'Programs' }),
            },
            {
              label: t('profile.sync'),
              v: authOnline
                ? `${authEmail ?? t('profile.online')}`
                : t('profile.offline'),
              icon: 'cloud-outline' as const,
              go: undefined,
            },
          ].map((x) => (
            <Pressable
              key={x.label}
              onPress={x.go}
              disabled={!x.go}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 18,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.bgSecondary,
                paddingHorizontal: 14,
                paddingVertical: 14,
              }}
            >
              <View
                style={{
                  width: 42,
                  height: 42,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: 'rgba(42,42,62,0.9)',
                  backgroundColor: 'rgba(123,63,228,0.12)',
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 12,
                }}
              >
                <Ionicons name={x.icon} size={20} color={colors.purpleLight} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.text,
                    fontFamily: fontFamilies.body700,
                    fontSize: 13,
                  }}
                >
                  {x.label}
                </Text>
                <Text
                  style={{
                    marginTop: 3,
                    color: colors.textSecondary,
                    fontFamily: fontFamilies.body,
                    fontSize: 12,
                  }}
                >
                  {x.v}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={22}
                color={colors.textMuted}
              />
            </Pressable>
          ))}

          {isCoach ? (
            <Pressable
              onPress={() => navigation.navigate('CoachPanel')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 18,
                borderWidth: 1,
                borderColor: 'rgba(0,229,255,0.45)',
                backgroundColor: 'rgba(0,229,255,0.1)',
                paddingHorizontal: 14,
                paddingVertical: 14,
              }}
            >
              <Ionicons
                name="people"
                size={22}
                color={colors.cyan}
                style={{ marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.cyan,
                    fontFamily: fontFamilies.body700,
                    fontSize: 13,
                  }}
                >
                  {t('profile.coachPanel')}
                </Text>
                <Text
                  style={{
                    marginTop: 3,
                    color: colors.textSecondary,
                    fontSize: 12,
                  }}
                >
                  {t('profile.coachPanelSub')}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={22}
                color={colors.textMuted}
              />
            </Pressable>
          ) : null}

          {isAdmin ? (
            <Pressable
              onPress={() => navigation.navigate('AdminPanel')}
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                borderRadius: 18,
                borderWidth: 1,
                borderColor: 'rgba(255,77,210,0.45)',
                backgroundColor: 'rgba(255,77,210,0.1)',
                paddingHorizontal: 14,
                paddingVertical: 14,
              }}
            >
              <Ionicons
                name="shield-checkmark"
                size={22}
                color={colors.pink}
                style={{ marginRight: 12 }}
              />
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.pink,
                    fontFamily: fontFamilies.body700,
                    fontSize: 13,
                  }}
                >
                  {t('profile.adminPanel')}
                </Text>
                <Text
                  style={{
                    marginTop: 3,
                    color: colors.textSecondary,
                    fontSize: 12,
                  }}
                >
                  {t('profile.adminPanelSub')}
                </Text>
              </View>
              <Ionicons
                name="chevron-forward"
                size={22}
                color={colors.textMuted}
              />
            </Pressable>
          ) : null}
        </View>

        <LanguageSwitcher />

        <ThemeSelector />

        <NotificationsSection />

        <View style={{ paddingHorizontal: 16, marginTop: 10, gap: 12 }}>
          <Pressable
            onPress={() =>
              Alert.alert(t('profile.logoutTitle'), t('profile.logoutBody'), [
                { text: t('common.cancel'), style: 'cancel' },
                {
                  text: t('profile.logoutConfirm'),
                  style: 'destructive',
                  onPress: async () => {
                    await useAuthStore.getState().logout();
                    useUserStore.getState().resetOnboarding();
                    useAppStreakStore.getState().reset();
                    // Сбрасываем активную тренировку если есть
                    const aw = useActiveWorkoutStore.getState();
                    if (aw.workout) {
                      try {
                        await aw.finish();
                      } catch {}
                    }
                  },
                },
              ])
            }
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: 18,
              borderWidth: 1,
              borderColor: 'rgba(255,63,92,0.3)',
              backgroundColor: 'rgba(255,63,92,0.08)',
              paddingHorizontal: 14,
              paddingVertical: 14,
              marginTop: 4,
            }}
          >
            <View
              style={{
                width: 42,
                height: 42,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: 'rgba(255,63,92,0.4)',
                backgroundColor: 'rgba(255,63,92,0.12)',
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 12,
              }}
            >
              <Ionicons name="log-out-outline" size={20} color={colors.red} />
            </View>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.red,
                  fontFamily: fontFamilies.body700,
                  fontSize: 13,
                }}
              >
                {t('profile.logout')}
              </Text>
              <Text
                style={{
                  marginTop: 3,
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body,
                  fontSize: 12,
                }}
              >
                {t('profile.logoutHint')}
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function LanguageSwitcher() {
  const lang = useLang();
  const setLang = useLangStore((s) => s.setLang);
  return (
    <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: fontFamilies.body600,
          fontSize: 12,
          marginBottom: 10,
        }}
      >
        {t('profile.language')}
      </Text>
      <View style={{ flexDirection: 'row', gap: 10 }}>
        {(['ru', 'en'] as const).map((l) => {
          const active = lang === l;
          return (
            <Pressable
              key={l}
              onPress={() => setLang(l)}
              style={{
                flex: 1,
                paddingVertical: 12,
                alignItems: 'center',
                borderRadius: 14,
                borderWidth: 1,
                borderColor: active ? colors.borderNeon : colors.border,
                backgroundColor: active
                  ? 'rgba(157,107,255,0.18)'
                  : colors.bgSecondary,
              }}
            >
              <Text
                style={{
                  color: active ? colors.text : colors.textSecondary,
                  fontFamily: fontFamilies.body700,
                  fontSize: 13,
                }}
              >
                {l === 'ru' ? '🇷🇺  Русский' : '🇬🇧  English'}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
