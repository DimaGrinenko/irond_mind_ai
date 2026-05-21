/**
 * График 1RM по упражнению. Использует /workouts/exercise-1rm-series/:slug.
 * Можно переключать упражнение из списка.
 */
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { LineChart } from '../components/charts/LineChart';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { ExercisePickerModal } from '../components/workout/ExercisePickerModal';
import { colors, radii } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { fontFamilies } from '../theme/typography';
import { api } from '../api/client';
import { exercises as catalog } from '../data/exercises';
import { t, useLang } from '../i18n';

type Series = Array<{ date: string; max1rm: number }>;

export function OneRmChartScreen() {
  useLang();
  const theme = useTheme();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const initialId = route.params?.exerciseId ?? 'bench_press';
  const [exerciseId, setExerciseId] = useState<string>(initialId);
  const [data, setData] = useState<Series>([]);
  const [loading, setLoading] = useState(true);
  const [pickerVisible, setPickerVisible] = useState(false);

  const meta = catalog.find((e) => e.id === exerciseId);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const s = await api.workouts.exercise1rmSeries(exerciseId);
      setData(s);
    } catch {
      setData([]);
    } finally {
      setLoading(false);
    }
  }, [exerciseId]);

  useEffect(() => {
    load();
  }, [load]);

  const max1rm = useMemo(
    () => data.reduce((m, d) => (d.max1rm > m ? d.max1rm : m), 0),
    [data],
  );
  const min1rm = useMemo(
    () => data.reduce((m, d) => (m === 0 || d.max1rm < m ? d.max1rm : m), 0),
    [data],
  );
  const range = Math.max(1, max1rm - min1rm);
  const norm = data.map((d) =>
    Math.max(4, ((d.max1rm - min1rm) / range) * 100),
  );

  const first = data[0];
  const last = data[data.length - 1];
  const growth = first && last ? last.max1rm - first.max1rm : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('oneRm.title')} onBack={() => nav.goBack()} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 16, marginTop: 6 }}>
          <Pressable
            onPress={() => setPickerVisible(true)}
            style={{
              padding: 14,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: theme.borderNeon,
              backgroundColor: 'rgba(157,107,255,0.10)',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Ionicons name="barbell" size={20} color={theme.accentLight} />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.textMuted,
                  fontSize: 10,
                  fontFamily: fontFamilies.body500,
                  letterSpacing: 1,
                }}
              >
                {t('oneRm.exercise')}
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: fontFamilies.body700,
                  fontSize: 14,
                  marginTop: 2,
                }}
              >
                {meta?.name ?? exerciseId}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card variant="secondary" style={{ padding: 16 }}>
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: fontFamilies.body500,
                fontSize: 10,
                letterSpacing: 1,
                marginBottom: 10,
              }}
            >
              {t('oneRm.chartHeader')}
            </Text>

            {loading ? (
              <ActivityIndicator
                color={theme.accentLight}
                style={{ paddingVertical: 30 }}
              />
            ) : data.length === 0 ? (
              <Text
                style={{
                  color: colors.textMuted,
                  fontFamily: fontFamilies.body,
                  fontSize: 12,
                  textAlign: 'center',
                  paddingVertical: 24,
                }}
              >
                {t('oneRm.empty')}
              </Text>
            ) : (
              <>
                <LineChart
                  width={320}
                  height={140}
                  series={[
                    {
                      points: norm,
                      gradientId: 'gradPurple',
                      stroke: theme.accentLight,
                    },
                  ]}
                />
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    marginTop: 8,
                  }}
                >
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontSize: 10,
                      fontFamily: fontFamilies.body500,
                    }}
                  >
                    {t('oneRm.min', { value: min1rm.toFixed(1) })}
                  </Text>
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontSize: 10,
                      fontFamily: fontFamilies.body500,
                    }}
                  >
                    {t('oneRm.max', { value: max1rm.toFixed(1) })}
                  </Text>
                </View>

                <View style={{ flexDirection: 'row', gap: 8, marginTop: 14 }}>
                  <Stat
                    label={t('oneRm.current')}
                    value={`${last?.max1rm.toFixed(1) ?? '—'} ${t('common.kg')}`}
                    tint={theme.accentLight}
                  />
                  <Stat
                    label={t('oneRm.growth')}
                    value={`${growth >= 0 ? '+' : ''}${growth.toFixed(1)} ${t('common.kg')}`}
                    tint={growth >= 0 ? colors.green : colors.pink}
                  />
                  <Stat
                    label={t('oneRm.points')}
                    value={String(data.length)}
                    tint={colors.cyan}
                  />
                </View>
              </>
            )}
          </Card>
        </View>

        {/* История значений */}
        {data.length > 0 ? (
          <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <Card variant="secondary">
              <Text
                style={{
                  color: colors.textMuted,
                  fontFamily: fontFamilies.body500,
                  fontSize: 10,
                  letterSpacing: 1,
                  marginBottom: 10,
                }}
              >
                {t('oneRm.history')}
              </Text>
              {data
                .slice()
                .reverse()
                .map((d) => (
                  <View
                    key={d.date}
                    style={{
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      paddingVertical: 8,
                      borderBottomWidth: 1,
                      borderBottomColor: colors.border,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.textSecondary,
                        fontFamily: fontFamilies.body,
                        fontSize: 12,
                      }}
                    >
                      {d.date}
                    </Text>
                    <Text
                      style={{
                        color: colors.text,
                        fontFamily: fontFamilies.body700,
                        fontSize: 12,
                      }}
                    >
                      {d.max1rm} {t('common.kg')}
                    </Text>
                  </View>
                ))}
            </Card>
          </View>
        ) : null}
      </ScrollView>

      <ExercisePickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onPick={(e) => setExerciseId(e.id)}
      />
    </View>
  );
}

function Stat({
  label,
  value,
  tint,
}: {
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: tint + '55',
        backgroundColor: 'rgba(0,0,0,0.25)',
      }}
    >
      <Text
        style={{
          color: colors.textMuted,
          fontFamily: fontFamilies.body500,
          fontSize: 9,
          letterSpacing: 0.5,
        }}
      >
        {label.toUpperCase()}
      </Text>
      <Text
        style={{
          marginTop: 4,
          color: tint,
          fontFamily: fontFamilies.body700,
          fontSize: 14,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
