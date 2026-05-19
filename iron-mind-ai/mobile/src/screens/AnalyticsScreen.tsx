import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ActivityIndicator, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useNavigation } from '@react-navigation/native';
import { BodyFigure } from '../components/anatomy/BodyFigure';
import { NeonScene3D } from '../components/3d/NeonScene3D';
import { LineChart } from '../components/charts/LineChart';
import { Card } from '../components/common/Card';
import { NeonText } from '../components/common/NeonText';
import { ProgressBar } from '../components/common/ProgressBar';
import { colors } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { api, type UserDashboard } from '../api/client';
import { t, useLang } from '../i18n';

function getMuscleUI() {
  return [
    { key: 'chest' as const, name: t('analytics.muscleChest'), color: colors.pink },
    { key: 'back' as const, name: t('analytics.muscleBack'), color: colors.blue },
    { key: 'legs' as const, name: t('analytics.muscleLegs'), color: colors.green },
    { key: 'shoulders' as const, name: t('analytics.muscleShoulders'), color: colors.purpleLight },
    { key: 'arms' as const, name: t('analytics.muscleArms'), color: colors.red },
    { key: 'core' as const, name: t('analytics.muscleCore'), color: colors.amber },
  ];
}

/** rgba хелпер для масштаба интенсивности нагрузки. */
function alphaColor(base: string, alpha: number): string {
  const m = base.match(/^#([0-9a-f]{6})$/i);
  if (m) {
    const r = parseInt(m[1].slice(0, 2), 16);
    const g = parseInt(m[1].slice(2, 4), 16);
    const b = parseInt(m[1].slice(4, 6), 16);
    return `rgba(${r},${g},${b},${alpha.toFixed(2)})`;
  }
  const rgba = base.match(/^rgba?\(([^)]+)\)$/);
  if (rgba) {
    const parts = rgba[1].split(',').map((s) => s.trim());
    return `rgba(${parts[0]},${parts[1]},${parts[2]},${alpha.toFixed(2)})`;
  }
  return base;
}

export function AnalyticsScreen() {
  useLang();
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const purple = colors.purpleLight;
  const blue = colors.blue;
  const [stats, setStats] = useState<UserDashboard | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [days, setDays] = useState<number>(7);
  const MUSCLE_UI = getMuscleUI();
  const PERIODS = [
    { days: 7, label: t('analytics.days7') },
    { days: 30, label: t('analytics.days30') },
  ];

  const load = useCallback(async (period: number) => {
    setLoading(true);
    setError(null);
    try {
      const s = await api.stats.me(period);
      setStats(s);
    } catch (e) {
      setError((e as Error).message);
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load(days);
    }, [load, days]),
  );

  useEffect(() => {
    load(days);
  }, [load, days]);

  const chart = stats?.chart ?? [];
  const maxVol = Math.max(1, ...chart.map((c) => c.volume));
  const volNorm = chart.map((c) => (c.volume / maxVol) * 100);
  const wNorm = chart.map((c) => Math.min(100, c.workouts * 35));
  const isEmpty = (stats?.workoutsCount ?? 0) === 0 && (stats?.nutritionCalories ?? 0) === 0;

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
            {t('analytics.title')}
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
            <Text style={{ color: colors.cyan, fontFamily: fontFamilies.body600 }}>
              {days} {t('common.days')} · {t('analytics.live')}
            </Text>
            <Ionicons name="pulse" size={16} color={colors.cyan} />
          </View>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 10, flexDirection: 'row', gap: 8 }}>
          {PERIODS.map((p) => {
            const active = days === p.days;
            return (
              <Pressable
                key={p.days}
                onPress={() => setDays(p.days)}
                style={{
                  flex: 1,
                  paddingVertical: 10,
                  alignItems: 'center',
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: active ? colors.borderNeon : colors.border,
                  backgroundColor: active ? 'rgba(157,107,255,0.18)' : colors.bgSecondary,
                }}
              >
                <Text
                  style={{
                    color: active ? colors.purpleLight : colors.textSecondary,
                    fontFamily: fontFamilies.body700,
                    fontSize: 12,
                  }}
                >
                  {p.label}
                </Text>
              </Pressable>
            );
          })}
        </View>

        {loading && !stats ? (
          <ActivityIndicator color={colors.purple} style={{ marginTop: 40 }} />
        ) : error ? (
          <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
            <Card variant="secondary">
              <Text style={{ color: colors.red, fontFamily: fontFamilies.body600, marginBottom: 8 }}>
                {t('analytics.errLoad')}
              </Text>
              <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 12 }}>
                {error}
              </Text>
              <Pressable
                onPress={() => load(days)}
                style={{
                  marginTop: 12,
                  paddingVertical: 10,
                  alignItems: 'center',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.borderNeon,
                  backgroundColor: 'rgba(157,107,255,0.12)',
                }}
              >
                <Text style={{ color: colors.purpleLight, fontFamily: fontFamilies.body700, fontSize: 13 }}>
                  {t('analytics.retry')}
                </Text>
              </Pressable>
            </Card>
          </View>
        ) : (
          <>
            <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
              <Card variant="secondary" style={{ paddingVertical: 12 }}>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                  <StatCell label={t('analytics.workouts')} value={(stats?.workoutsCount ?? 0).toString()} />
                  <StatCell
                    label={t('analytics.nutritionCal')}
                    value={(stats?.nutritionCalories ?? 0).toLocaleString('ru')}
                  />
                  <StatCell label={t('analytics.volume')} value={`${(stats?.volumeKg ?? 0).toLocaleString('ru')} ${t('common.kg')}`} small />
                </View>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 14 }}>
                  <StatCell label={t('analytics.sets')} value={`${stats?.completedSets ?? 0}/${stats?.totalSets ?? 0}`} small />
                  <StatCell
                    label={t('analytics.burned')}
                    value={`${(stats?.caloriesBurned ?? 0).toLocaleString('ru')} ${t('common.kcal')}`}
                    small
                  />
                  <StatCell
                    label={t('analytics.weight')}
                    value={
                      stats?.lastWeight !== null && stats?.lastWeight !== undefined
                        ? `${stats.lastWeight} ${t('common.kg')}${stats.weightDelta !== null ? ` (${stats.weightDelta > 0 ? '+' : ''}${stats.weightDelta})` : ''}`
                        : '—'
                    }
                    small
                  />
                </View>
              </Card>
            </View>

            {isEmpty ? (
              <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
                <Card variant="secondary">
                  <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body, textAlign: 'center' }}>
                    {t('analytics.empty', { days })}
                  </Text>
                </Card>
              </View>
            ) : null}

            <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
              <Card variant="secondary" style={{ padding: 0, overflow: 'hidden' }}>
                <View style={{ paddingVertical: 12, paddingHorizontal: 12 }}>
                  <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 11, letterSpacing: 1, marginBottom: 6 }}>
                    {t('analytics.chartHeader')}
                  </Text>
                  <LineChart
                    width={328}
                    height={130}
                    series={[
                      { points: volNorm.length ? volNorm : new Array(days).fill(0), gradientId: 'gradPurple', stroke: purple },
                      { points: wNorm.length ? wNorm : new Array(days).fill(0), gradientId: 'gradBlue', stroke: blue },
                    ]}
                  />
                  <View style={{ marginTop: 6, flexDirection: 'row', justifyContent: 'space-between' }}>
                    {(days === 7
                      ? ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс']
                      : ['', '5', '10', '15', '20', '25', '30']
                    ).map((d, i) => (
                      <Text key={`${d}-${i}`} style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 11 }}>
                        {d}
                      </Text>
                    ))}
                  </View>
                  <View style={{ marginTop: 8, flexDirection: 'row', gap: 12 }}>
                    <Legend color={purple} label={t('analytics.volume')} />
                    <Legend color={blue} label={t('analytics.workouts')} />
                  </View>
                </View>
              </Card>
            </View>

            <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
              <Card variant="secondary">
                <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 13 }}>{t('analytics.muscleHeader')}</Text>
                <View style={{ flexDirection: 'row', gap: 14, marginTop: 12 }}>
                  <View style={{ width: 120 }}>
                    <BodyFigure
                      width={120}
                      height={150}
                      highlights={{
                        chest: alphaColor(colors.pink, 0.15 + 0.7 * (stats?.muscleLoad.chest ?? 0)),
                        back: alphaColor(colors.blue, 0.15 + 0.7 * (stats?.muscleLoad.back ?? 0)),
                        legs: alphaColor(colors.green, 0.15 + 0.7 * (stats?.muscleLoad.legs ?? 0)),
                        shoulders: alphaColor(colors.purpleLight, 0.15 + 0.7 * (stats?.muscleLoad.shoulders ?? 0)),
                        arms: alphaColor(colors.red, 0.15 + 0.7 * (stats?.muscleLoad.arms ?? 0)),
                        core: alphaColor(colors.amber, 0.15 + 0.7 * (stats?.muscleLoad.core ?? 0)),
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

            {/* Что отстаёт */}
            {stats && (() => {
              const entries: Array<{ key: keyof typeof stats.muscleLoad; name: string; v: number }> = MUSCLE_UI.map(
                (x) => ({ key: x.key, name: x.name, v: stats.muscleLoad[x.key] ?? 0 }),
              );
              const lowest = entries.sort((a, b) => a.v - b.v).slice(0, 2).filter((e) => e.v < 0.3);
              if (lowest.length === 0) return null;
              return (
                <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
                  <Card
                    variant="secondary"
                    style={{
                      padding: 14,
                      borderColor: colors.amber,
                      borderWidth: 1,
                      backgroundColor: 'rgba(255,181,71,0.08)',
                    }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                      <Ionicons name="alert-circle" size={18} color={colors.amber} />
                      <Text style={{ color: colors.amber, fontFamily: fontFamilies.body700, fontSize: 13 }}>
                        {t('analytics.lagging')}
                      </Text>
                    </View>
                    <Text style={{ color: colors.text, fontFamily: fontFamilies.body, fontSize: 13, lineHeight: 18 }}>
                      {t('analytics.laggingHint', {
                        groups: lowest.map((e) => `${e.name} (${Math.round(e.v * 100)}%)`).join(', '),
                      })}
                    </Text>
                  </Card>
                </View>
              );
            })()}

            {/* Прогноз восстановления */}
            {stats && stats.muscleLoad ? (() => {
              const muscleLoadValues = Object.values(stats.muscleLoad);
              const loaded = muscleLoadValues.filter((v) => v >= 0.3).length;
              const restHours = Math.max(36, 48 + loaded * 6); // 48h baseline + 6h per loaded group
              const target = new Date(Date.now() + restHours * 3600 * 1000);
              const fmt = `${target.toLocaleDateString('ru')} ${String(target.getHours()).padStart(2, '0')}:00`;
              return (
                <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
                  <Card variant="secondary" style={{ padding: 14, borderColor: colors.green + '55', borderWidth: 1 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                      <Ionicons name="moon" size={18} color={colors.green} />
                      <Text style={{ flex: 1, color: colors.text, fontFamily: fontFamilies.body700, fontSize: 13 }}>
                        {t('analytics.recovery')}
                      </Text>
                      <Text style={{ color: colors.green, fontFamily: fontFamilies.body700, fontSize: 13 }}>
                        {t('analytics.recoveryHrs', { h: restHours })}
                      </Text>
                    </View>
                    <Text style={{ marginTop: 6, color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 12 }}>
                      {t('analytics.recoveryHint', { when: fmt })}
                    </Text>
                  </Card>
                </View>
              );
            })() : null}

            {/* Quick links — 1RM / Photo compare / CSV / Form / Challenges / Shop / Friends */}
            <View style={{ paddingHorizontal: 16, marginTop: 12, gap: 8 }}>
              <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12, letterSpacing: 1, marginBottom: 4 }}>
                {t('analytics.tools')}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <ToolBtn icon="trending-up" label={t('analytics.tools.oneRm')} tint={colors.purpleLight} onPress={() => nav.navigate('OneRmChart')} />
                <ToolBtn icon="images-outline" label={t('analytics.tools.before')} tint={colors.pink} onPress={() => nav.navigate('PhotoCompare')} />
                <ToolBtn icon="download-outline" label={t('analytics.tools.csv')} tint={colors.cyan} onPress={() => nav.navigate('DataExport')} />
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <ToolBtn icon="flag-outline" label={t('analytics.tools.challenges')} tint={colors.amber} onPress={() => nav.navigate('Challenges')} />
                <ToolBtn icon="leaf-outline" label={t('analytics.tools.shop')} tint={colors.green} onPress={() => nav.navigate('LeafShop')} />
                <ToolBtn icon="people-outline" label={t('analytics.tools.friends')} tint={colors.purpleLight} onPress={() => nav.navigate('Friends')} />
              </View>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <ToolBtn icon="videocam-outline" label={t('analytics.tools.form')} tint={colors.pink} onPress={() => nav.navigate('FormAnalysis')} />
              </View>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}

function StatCell({ label, value, small }: { label: string; value: string; small?: boolean }) {
  return (
    <View style={{ width: '32%' }}>
      <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 12 }}>{label}</Text>
      <Text style={{ marginTop: 6, color: colors.text, fontFamily: fontFamilies.body700, fontSize: small ? 14 : 18 }}>
        {value}
      </Text>
    </View>
  );
}

function ToolBtn({ icon, label, tint, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; tint: string; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: tint + '55',
        backgroundColor: 'rgba(0,0,0,0.25)',
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Ionicons name={icon} size={18} color={tint} />
      <Text style={{ color: tint, fontFamily: fontFamilies.body700, fontSize: 10, textAlign: 'center' }}>{label}</Text>
    </Pressable>
  );
}

function Legend({ color, label }: { color: string; label: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
      <View style={{ width: 8, height: 8, borderRadius: 4, backgroundColor: color }} />
      <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 11 }}>{label}</Text>
    </View>
  );
}
