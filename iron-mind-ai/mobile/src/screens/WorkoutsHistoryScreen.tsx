/**
 * История завершённых тренировок с детализацией по сетам.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { fontFamilies } from '../theme/typography';
import { api } from '../api/client';
import { exercises as catalog } from '../data/exercises';
import { t, useLang } from '../i18n';

type WorkoutRow = {
  id: string;
  name: string | null;
  date: string;
  durationSeconds: number | null;
  calories: number | null;
  status: string;
  sets: Array<{
    id: string;
    exerciseId: string;
    setNumber: number;
    weight: number | null;
    reps: number | null;
    completed: boolean;
  }>;
};

function fmtDate(iso: string, lang: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString(lang === 'en' ? 'en-US' : 'ru-RU', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function fmtTime(iso: string): string {
  const d = new Date(iso);
  return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
}

export function WorkoutsHistoryScreen() {
  const lang = useLang();
  const theme = useTheme();
  const nav = useNavigation<any>();
  const [items, setItems] = useState<WorkoutRow[]>([]);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const list = await api.workouts.list(30);
      setItems(list as WorkoutRow[]);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );
  useEffect(() => {
    load();
  }, [load]);

  const completed = items.filter((w) => w.status === 'COMPLETED');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('home.workouts')} onBack={() => nav.goBack()} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {loading ? (
          <View style={{ paddingVertical: 36, alignItems: 'center' }}>
            <ActivityIndicator color={theme.accentLight} />
          </View>
        ) : completed.length === 0 ? (
          <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
            <Card variant="secondary">
              <Text
                style={{
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body,
                  textAlign: 'center',
                }}
              >
                {t('analytics.empty', { days: 30 })}
              </Text>
            </Card>
          </View>
        ) : (
          <View style={{ paddingHorizontal: 16, marginTop: 12, gap: 12 }}>
            {completed.map((w) => {
              const totalVol = w.sets.reduce(
                (s, x) => s + (x.weight ?? 0) * (x.reps ?? 0),
                0,
              );
              const setCount = w.sets.length;
              const doneCount = w.sets.filter((s) => s.completed).length;
              const byExercise = new Map<string, typeof w.sets>();
              for (const s of w.sets) {
                const k = s.exerciseId;
                byExercise.set(k, [...(byExercise.get(k) ?? []), s]);
              }
              return (
                <Card key={w.id} variant="secondary" style={{ padding: 14 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 8,
                    }}
                  >
                    <View
                      style={{
                        width: 38,
                        height: 38,
                        borderRadius: 12,
                        backgroundColor: 'rgba(157,107,255,0.18)',
                        borderWidth: 1,
                        borderColor: theme.borderNeon,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 10,
                      }}
                    >
                      <Ionicons
                        name="barbell"
                        size={18}
                        color={theme.accentLight}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: colors.text,
                          fontFamily: fontFamilies.body700,
                          fontSize: 14,
                        }}
                      >
                        {w.name || t('workout.title')}
                      </Text>
                      <Text
                        style={{
                          color: colors.textMuted,
                          fontFamily: fontFamilies.body,
                          fontSize: 11,
                          marginTop: 2,
                        }}
                      >
                        {fmtDate(w.date, lang)} · {fmtTime(w.date)} ·{' '}
                        {Math.round(totalVol)} {t('common.kg')} · {doneCount}/
                        {setCount}
                      </Text>
                    </View>
                  </View>
                  {byExercise.size === 0 ? null : (
                    <View style={{ gap: 4 }}>
                      {Array.from(byExercise.entries()).map(([exId, sets]) => {
                        const meta = catalog.find((e) => e.id === exId);
                        const name = meta?.name ?? exId;
                        const best = sets.reduce(
                          (m, s) => Math.max(m, s.weight ?? 0),
                          0,
                        );
                        return (
                          <View
                            key={exId}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'center',
                            }}
                          >
                            <Text
                              style={{
                                flex: 1,
                                color: colors.textSecondary,
                                fontFamily: fontFamilies.body,
                                fontSize: 12,
                              }}
                            >
                              {name}
                            </Text>
                            <Text
                              style={{
                                color: theme.accentLight,
                                fontFamily: fontFamilies.body700,
                                fontSize: 12,
                              }}
                            >
                              {sets.length}×
                              {best > 0 ? `${best}${t('common.kg')}` : '—'}
                            </Text>
                          </View>
                        );
                      })}
                    </View>
                  )}
                </Card>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}
