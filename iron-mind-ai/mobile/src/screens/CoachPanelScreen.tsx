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
import { ProgressBar } from '../components/common/ProgressBar';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { api } from '../api/client';
import { useAuthStore } from '../store/authStore';
import { colors } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

type Client = {
  id: string;
  name: string;
  email: string;
  goal?: string;
  assignmentNotes?: string;
};

export function CoachPanelScreen({ navigation }: any) {
  useLang();
  const online = useAuthStore((s) => s.online);
  const [loading, setLoading] = useState(true);
  const [clients, setClients] = useState<Client[]>([]);
  const [selected, setSelected] = useState<any>(null);

  const loadClients = useCallback(async () => {
    if (!online) {
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      setClients(await api.coach.clients());
    } catch {
      Alert.alert(t('common.error'), t('coach.loadError'));
    } finally {
      setLoading(false);
    }
  }, [online]);

  useEffect(() => {
    loadClients();
  }, [loadClients]);

  const openClient = async (id: string) => {
    try {
      setSelected(await api.coach.client(id));
    } catch {
      Alert.alert(t('common.error'), t('coach.noAccess'));
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={t('coach.title')}
        onBack={() => navigation.goBack()}
      />
      <NeonScene3D height={140} />
      <ScrollView
        contentContainerStyle={{
          padding: 16,
          paddingBottom: 120,
          marginTop: -90,
        }}
        showsVerticalScrollIndicator={false}
      >
        <NeonText variant="eyebrow" glow="cyan">
          COACH DESK · LIVE STATS
        </NeonText>
        {!online && (
          <NeonCard style={{ marginTop: 12 }}>
            <Text
              style={{
                color: colors.textSecondary,
                fontFamily: fontFamilies.body,
              }}
            >
              {t('coach.offlineHint')}
            </Text>
          </NeonCard>
        )}
        {loading && online ? (
          <ActivityIndicator color={colors.cyan} style={{ marginTop: 20 }} />
        ) : null}
        {clients.map((c) => (
          <Pressable key={c.id} onPress={() => openClient(c.id)}>
            <NeonCard style={{ marginTop: 10 }}>
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
              >
                <Ionicons
                  name="person-circle-outline"
                  size={36}
                  color={colors.cyan}
                />
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: fontFamilies.body700,
                    }}
                  >
                    {c.name}
                  </Text>
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontSize: 11,
                      marginTop: 2,
                    }}
                  >
                    {c.goal || c.email}
                  </Text>
                  {c.assignmentNotes ? (
                    <Text
                      style={{
                        color: colors.purpleLight,
                        fontSize: 11,
                        marginTop: 4,
                      }}
                    >
                      {c.assignmentNotes}
                    </Text>
                  ) : null}
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textMuted}
                />
              </View>
            </NeonCard>
          </Pressable>
        ))}
        {selected && (
          <NeonCard style={{ marginTop: 16 }}>
            <Text
              style={{
                color: colors.text,
                fontFamily: fontFamilies.body700,
                fontSize: 16,
              }}
            >
              {selected.user?.name}
            </Text>
            <Text
              style={{ color: colors.textMuted, marginTop: 6, fontSize: 12 }}
            >
              {t('coach.stats14d', {
                w: selected.stats?.workoutsCount ?? 0,
                v: selected.stats?.volumeKg ?? 0,
              })}
            </Text>
            <View style={{ marginTop: 12, gap: 8 }}>
              <Text style={{ color: colors.textSecondary, fontSize: 12 }}>
                {t('coach.nutritionKcal')}
              </Text>
              <ProgressBar
                value={Math.min(
                  1,
                  (selected.stats?.nutritionCalories ?? 0) /
                    ((selected.user?.dailyCaloriesGoal ?? 2500) * 14),
                )}
                color={colors.green}
              />
            </View>
            <Text
              style={{
                marginTop: 12,
                color: colors.cyan,
                fontFamily: fontFamilies.body600,
                fontSize: 12,
              }}
            >
              {t('coach.recentWorkouts', {
                n: selected.recentWorkouts?.length ?? 0,
              })}
            </Text>
          </NeonCard>
        )}
      </ScrollView>
    </View>
  );
}
