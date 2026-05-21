import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NeonScene3D } from '../components/3d/NeonScene3D';
import { NeonCard } from '../components/common/NeonCard';
import { NeonText } from '../components/common/NeonText';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { api } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { colors, neonTextShadow } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

type AdminUser = {
  id: string;
  email: string;
  name: string;
  role: string;
  _count?: { workouts: number; nutritionEntries: number };
};

export function AdminPanelScreen({ navigation }: any) {
  useLang();
  const theme = useTheme();
  const online = useAuthStore((s) => s.online);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [platform, setPlatform] = useState<{
    users: number;
    coaches: number;
    workoutsCompleted: number;
  } | null>(null);

  const load = useCallback(async () => {
    if (!online) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [u, p] = await Promise.all([
        api.admin.users(),
        api.stats.platform(),
      ]);
      setUsers(u);
      setPlatform(p);
    } catch {
      Alert.alert(t('common.error'), t('admin.loadError'));
    } finally {
      setLoading(false);
    }
  }, [online]);

  useEffect(() => {
    load();
  }, [load]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={t('admin.title')}
        onBack={() => navigation.goBack()}
      />
      <NeonScene3D height={160} />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 120,
          marginTop: -100,
        }}
        showsVerticalScrollIndicator={false}
      >
        <NeonText variant="eyebrow" glow="pink">
          IRON MIND · CONTROL
        </NeonText>
        {!online && (
          <NeonCard style={{ marginTop: 12 }}>
            <Text
              style={{
                color: colors.textSecondary,
                fontFamily: fontFamilies.body,
              }}
            >
              {t('admin.offlineHint')}
            </Text>
          </NeonCard>
        )}
        {loading && online ? (
          <ActivityIndicator
            color={theme.accentLight}
            style={{ marginTop: 24 }}
          />
        ) : null}
        {platform && (
          <View
            style={{
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 10,
              marginTop: 14,
            }}
          >
            {[
              {
                label: t('admin.statUsers'),
                v: platform.users,
                c: colors.cyan,
              },
              {
                label: t('admin.statCoaches'),
                v: platform.coaches,
                c: colors.pink,
              },
              {
                label: t('admin.statWorkouts'),
                v: platform.workoutsCompleted,
                c: colors.green,
              },
            ].map((x) => (
              <NeonCard
                key={x.label}
                style={{ width: '31%', minWidth: 100, padding: 12 }}
              >
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: 10,
                    fontFamily: fontFamilies.body600,
                  }}
                >
                  {x.label}
                </Text>
                <Text
                  style={{
                    marginTop: 6,
                    color: x.c,
                    fontSize: 20,
                    fontFamily: fontFamilies.body700,
                    ...neonTextShadow(x.c, 12),
                  }}
                >
                  {x.v}
                </Text>
              </NeonCard>
            ))}
          </View>
        )}
        <Text
          style={{
            marginTop: 20,
            color: colors.textSecondary,
            fontFamily: fontFamilies.body600,
            fontSize: 12,
          }}
        >
          {t('admin.manageAccounts')}
        </Text>
        {users.map((u) => (
          <NeonCard key={u.id} style={{ marginTop: 10 }}>
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}
            >
              <LinearGradient
                colors={[theme.accent, colors.pink]}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{ color: '#fff', fontFamily: fontFamilies.body700 }}
                >
                  {u.name.slice(0, 1)}
                </Text>
              </LinearGradient>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.text,
                    fontFamily: fontFamilies.body700,
                  }}
                >
                  {u.name}
                </Text>
                <Text
                  style={{
                    color: colors.textMuted,
                    fontSize: 11,
                    marginTop: 2,
                  }}
                >
                  {u.email}
                </Text>
                <Text
                  style={{ color: colors.cyan, fontSize: 11, marginTop: 4 }}
                >
                  {t('admin.userMeta', {
                    role: u.role,
                    w: u._count?.workouts ?? 0,
                    n: u._count?.nutritionEntries ?? 0,
                  })}
                </Text>
              </View>
              {u.role !== 'ADMIN' && (
                <Pressable
                  onPress={() =>
                    api.admin
                      .setRole(u.id, u.role === 'COACH' ? 'USER' : 'COACH')
                      .then(load)
                      .catch(() =>
                        Alert.alert(t('common.error'), t('admin.roleError')),
                      )
                  }
                  style={{ padding: 8 }}
                >
                  <Ionicons
                    name="swap-horizontal"
                    size={22}
                    color={theme.accentLight}
                  />
                </Pressable>
              )}
            </View>
          </NeonCard>
        ))}
      </ScrollView>
    </View>
  );
}
