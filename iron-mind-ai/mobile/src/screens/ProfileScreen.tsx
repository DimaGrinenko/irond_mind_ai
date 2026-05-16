import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors, glow, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { useAuthStore } from '../store/authStore';
import { useUserStore } from '../store/userStore';

export function ProfileScreen({ navigation }: any) {
  const user = useUserStore();
  const auth = useAuthStore();
  const isAdmin = useAuthStore((s) => s.isAdmin());
  const isCoach = useAuthStore((s) => s.isCoach());

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Профиль" />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <LinearGradient colors={['rgba(79,31,184,0.22)', 'rgba(0,0,0,0.95)']} style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <LinearGradient
                  colors={['#7B3FE4', '#B14EFF'] as any}
                  style={{ width: 54, height: 54, borderRadius: 18, alignItems: 'center', justifyContent: 'center', ...glow }}
                >
                  <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 18 }}>
                    {user.name.slice(0, 1).toUpperCase()}
                  </Text>
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 16 }}>{user.name}</Text>
                  <Text style={{ marginTop: 4, color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>
                    {user.goal}
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
                  <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 12 }}>Премиум</Text>
                </Pressable>
              </View>

              <View style={{ marginTop: 14, flexDirection: 'row', justifyContent: 'space-between' }}>
                {[
                  { t: 'Достижения', icon: 'trophy-outline' as const, go: () => navigation.navigate('Achievements') },
                  { t: 'Сообщество', icon: 'people-outline' as const, go: () => navigation.navigate('Community') },
                  { t: 'Календарь', icon: 'calendar-outline' as const, go: () => navigation.navigate('Calendar') },
                  { t: 'Мотивация', icon: 'sparkles-outline' as const, go: () => navigation.navigate('Motivation') },
                ].map((x) => (
                  <Pressable key={x.t} onPress={x.go} style={{ alignItems: 'center', width: 74 }}>
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
                      <Ionicons name={x.icon} size={22} color={colors.purpleLight} />
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
                      {x.t}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </LinearGradient>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>Настройки</Text>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 10, gap: 12 }}>
          {[
            { t: 'Цель', v: user.goal || '—', icon: 'flag-outline' as const },
            {
              t: 'Параметры',
              v:
                user.age && user.heightCm && user.weightKg
                  ? `${user.age} лет · ${user.heightCm} см · ${user.weightKg} кг`
                  : '—',
              icon: 'body-outline' as const,
            },
            { t: 'Программа', v: user.currentProgramId ? 'Активна' : 'Не выбрана', icon: 'barbell-outline' as const },
            {
              t: 'Синхронизация',
              v: auth.online ? `${auth.email ?? 'онлайн'}` : 'Офлайн · локальная БД',
              icon: 'cloud-outline' as const,
            },
          ].map((x) => (
            <Pressable
              key={x.t}
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
                <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 13 }}>{x.t}</Text>
                <Text style={{ marginTop: 3, color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 12 }}>{x.v}</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
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
              <Ionicons name="people" size={22} color={colors.cyan} style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.cyan, fontFamily: fontFamilies.body700, fontSize: 13 }}>Панель тренера</Text>
                <Text style={{ marginTop: 3, color: colors.textSecondary, fontSize: 12 }}>Клиенты, статистика, заметки</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
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
              <Ionicons name="shield-checkmark" size={22} color={colors.pink} style={{ marginRight: 12 }} />
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.pink, fontFamily: fontFamilies.body700, fontSize: 13 }}>Админ-панель</Text>
                <Text style={{ marginTop: 3, color: colors.textSecondary, fontSize: 12 }}>Пользователи и роли</Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textMuted} />
            </Pressable>
          ) : null}

          <Pressable
            onPress={() =>
              Alert.alert(
                'Выйти из профиля?',
                'Сессия и анкета будут сброшены. Локальные тренировки останутся на устройстве.',
                [
                  { text: 'Отмена', style: 'cancel' },
                  {
                    text: 'Выйти',
                    style: 'destructive',
                    onPress: async () => {
                      await useAuthStore.getState().logout();
                      useUserStore.getState().resetOnboarding();
                    },
                  },
                ],
              )
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
              <Text style={{ color: colors.red, fontFamily: fontFamilies.body700, fontSize: 13 }}>Выйти из профиля</Text>
              <Text style={{ marginTop: 3, color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 12 }}>
                Сбросить анкету
              </Text>
            </View>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

