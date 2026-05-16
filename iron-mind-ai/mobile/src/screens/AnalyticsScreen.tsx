import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { BodyFigure } from '../components/anatomy/BodyFigure';
import { NeonScene3D } from '../components/3d/NeonScene3D';
import { LineChart } from '../components/charts/LineChart';
import { Card } from '../components/common/Card';
import { NeonText } from '../components/common/NeonText';
import { ProgressBar } from '../components/common/ProgressBar';
import { loadWeeklyStats, type WeeklyStats } from '../db/statsRepo';
import { colors } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';

const MUSCLE_UI: Array<{ key: string; name: string; color: string }> = [
  { key: 'chest', name: 'Грудь', color: colors.pink },
  { key: 'back', name: 'Спина', color: colors.blue },
  { key: 'legs', name: 'Ноги', color: colors.green },
  { key: 'shoulders', name: 'Плечи', color: colors.purpleLight },
  { key: 'arms', name: 'Руки', color: colors.red },
  { key: 'core', name: 'Пресс', color: colors.amber },
];

export function AnalyticsScreen() {
  const insets = useSafeAreaInsets();
  const purple = colors.purpleLight;
  const blue = colors.blue;
  const [stats, setStats] = useState<WeeklyStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadWeeklyStats(7)
      .then(setStats)
      .catch(() => setStats(null))
      .finally(() => setLoading(false));
  }, []);

  const maxVol = Math.max(1, ...(stats?.chartVolume ?? [1]));
  const volNorm = (stats?.chartVolume ?? []).map((v) => (v / maxVol) * 100);
  const wNorm = (stats?.chartWorkouts ?? []).map((v) => Math.min(100, v * 35));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <NeonScene3D height={100} />
      <ScrollView
        style={{ flex: 1, marginTop: -60 }}
        contentContainerStyle={{ paddingTop: insets.top + 8, paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
          <NeonText variant="eyebrow" glow="purple" style={{ fontSize: 20 }}>
            Аналитика
          </NeonText>
          <View style={{ flex: 1 }} />
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.borderNeon,
              backgroundColor: colors.bgSecondary,
            }}
          >
            <Text style={{ color: colors.cyan, fontFamily: fontFamilies.body600 }}>7 дней · LIVE</Text>
            <Ionicons name="pulse" size={16} color={colors.cyan} />
          </View>
        </View>

        {loading ? (
          <ActivityIndicator color={colors.purple} style={{ marginTop: 40 }} />
        ) : (
          <>
            <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
              <Card variant="secondary" style={{ paddingVertical: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <View style={{ width: '32%' }}>
                    <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 12 }}>Тренировки</Text>
                    <Text style={{ marginTop: 6, color: colors.text, fontFamily: fontFamilies.body700, fontSize: 18 }}>
                      {stats?.workoutsCount ?? 0}
                    </Text>
                  </View>
                  <View style={{ width: '32%' }}>
                    <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 12 }}>Калории еды</Text>
                    <Text style={{ marginTop: 6, color: colors.text, fontFamily: fontFamilies.body700, fontSize: 18 }}>
                      {(stats?.nutritionCalories ?? 0).toLocaleString('ru')}
                    </Text>
                  </View>
                  <View style={{ width: '32%' }}>
                    <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 12 }}>Объём</Text>
                    <Text style={{ marginTop: 6, color: colors.text, fontFamily: fontFamilies.body700, fontSize: 16 }}>
                      {(stats?.volumeKg ?? 0).toLocaleString('ru')} кг
                    </Text>
                  </View>
                </View>
              </Card>
            </View>

            <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
              <Card variant="secondary" style={{ padding: 0, overflow: 'hidden' }}>
                <View style={{ paddingVertical: 12, paddingHorizontal: 12 }}>
                  <LineChart
                    width={328}
                    height={130}
                    series={[
                      { points: volNorm.length ? volNorm : [0, 0, 0, 0, 0, 0, 0], gradientId: 'gradPurple', stroke: purple },
                      { points: wNorm.length ? wNorm : [0, 0, 0, 0, 0, 0, 0], gradientId: 'gradBlue', stroke: blue },
                    ]}
                  />
                  <View style={{ marginTop: 6, flexDirection: 'row', justifyContent: 'space-between' }}>
                    {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map((d) => (
                      <Text key={d} style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 11 }}>
                        {d}
                      </Text>
                    ))}
                  </View>
                </View>
              </Card>
            </View>

            <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
              <Card variant="secondary">
                <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 13 }}>Нагрузка по группам</Text>
                <View style={{ flexDirection: 'row', gap: 14, marginTop: 12 }}>
                  <View style={{ width: 120 }}>
                    <BodyFigure
                      width={120}
                      height={150}
                      highlights={{
                        chest: colors.pink,
                        back: colors.blue,
                        legs: colors.green,
                        shoulders: colors.purpleLight,
                        arms: colors.red,
                        core: colors.amber,
                      }}
                    />
                  </View>
                  <View style={{ flex: 1, gap: 12 }}>
                    {MUSCLE_UI.map((x) => {
                      const v = stats?.muscleLoad[x.key] ?? 0;
                      return (
                        <View key={x.name} style={{ gap: 6 }}>
                          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                            <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: x.color, marginRight: 8 }} />
                            <Text style={{ flex: 1, color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>
                              {x.name}
                            </Text>
                            <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>
                              {Math.round(v * 100)}%
                            </Text>
                          </View>
                          <ProgressBar value={v} color={x.color} />
                        </View>
                      );
                    })}
                  </View>
                </View>
              </Card>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
