/**
 * История завершённых тренировок с детализацией по сетам.
 */
import React, { useCallback, useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
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
import { api, ApiError } from '../api/client';
import { exerciseDisplayName } from '../utils/exerciseDisplayName';
import {
  workoutDisplayName,
  workoutProgramSubtitle,
} from '../utils/workoutDisplayName';
import { t, useLang } from '../i18n';

type WorkoutRow = {
  id: string;
  name: string | null;
  programId?: string | null;
  program?: { id: string; title: string } | null;
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
    exercise?: { id: string; name: string; slug: string };
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
  const [deletingId, setDeletingId] = useState<string | null>(null);

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

  const confirmDelete = (w: WorkoutRow) => {
    const title = workoutDisplayName(w.name, w.program);
    Alert.alert(t('history.deleteTitle'), `${title}\n\n${t('history.deleteBody')}`, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => void deleteWorkout(w.id),
      },
    ]);
  };

  const deleteWorkout = async (id: string) => {
    setDeletingId(id);
    try {
      await api.workouts.remove(id);
      setItems((prev) => prev.filter((x) => x.id !== id));
    } catch (e) {
      Alert.alert(
        t('common.error'),
        e instanceof ApiError ? e.message : t('history.deleteFailed'),
      );
    } finally {
      setDeletingId(null);
    }
  };

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
              const sessionTitle = workoutDisplayName(w.name, w.program);
              const programSub = workoutProgramSubtitle(
                sessionTitle,
                w.program,
              );
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
                        {sessionTitle}
                      </Text>
                      {programSub ? (
                        <Text
                          style={{
                            color: colors.textSecondary,
                            fontFamily: fontFamilies.body,
                            fontSize: 11,
                            marginTop: 2,
                          }}
                        >
                          {programSub}
                        </Text>
                      ) : null}
                      <Text
                        style={{
                          color: colors.textMuted,
                          fontFamily: fontFamilies.body,
                          fontSize: 11,
                          marginTop: programSub ? 2 : 2,
                        }}
                      >
                        {fmtDate(w.date, lang)} · {fmtTime(w.date)} ·{' '}
                        {Math.round(totalVol)} {t('common.kg')} · {doneCount}/
                        {setCount} {t('history.setsShort')}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => confirmDelete(w)}
                      disabled={deletingId === w.id}
                      hitSlop={10}
                      accessibilityRole="button"
                      accessibilityLabel={t('common.delete')}
                      style={{
                        width: 40,
                        height: 40,
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: 'rgba(255,80,120,0.35)',
                        backgroundColor: 'rgba(255,60,100,0.1)',
                      }}
                    >
                      {deletingId === w.id ? (
                        <ActivityIndicator size="small" color="#FF6B9A" />
                      ) : (
                        <Ionicons
                          name="trash-outline"
                          size={20}
                          color="#FF6B9A"
                        />
                      )}
                    </Pressable>
                  </View>
                  {byExercise.size === 0 ? null : (
                    <View style={{ gap: 4 }}>
                      {Array.from(byExercise.entries()).map(([exId, sets]) => {
                        const exMeta = sets[0]?.exercise;
                        const name =
                          exerciseDisplayName(
                            exId,
                            exMeta?.name,
                            exMeta?.slug,
                          ) || t('history.unknownExercise');
                        const doneSets = sets.filter((s) => s.completed);
                        const count = doneSets.length || sets.length;
                        let best = 0;
                        let bestReps = 0;
                        for (const s of sets) {
                          const w = s.weight ?? 0;
                          if (w >= best) {
                            best = w;
                            bestReps = s.reps ?? bestReps;
                          }
                        }
                        const vol = sets.reduce(
                          (s, x) => s + (x.weight ?? 0) * (x.reps ?? 0),
                          0,
                        );
                        return (
                          <View
                            key={exId}
                            style={{
                              flexDirection: 'row',
                              alignItems: 'flex-start',
                              paddingVertical: 4,
                              borderTopWidth: 1,
                              borderTopColor: 'rgba(255,255,255,0.06)',
                            }}
                          >
                            <View style={{ flex: 1, paddingRight: 8 }}>
                              <Text
                                style={{
                                  color: colors.text,
                                  fontFamily: fontFamilies.body600,
                                  fontSize: 13,
                                }}
                              >
                                {name}
                              </Text>
                              <Text
                                style={{
                                  marginTop: 2,
                                  color: colors.textMuted,
                                  fontFamily: fontFamilies.body,
                                  fontSize: 11,
                                }}
                              >
                                {t('history.setsCount', { n: count })}
                                {vol > 0
                                  ? ` · ${Math.round(vol)} ${t('common.kg')}`
                                  : ''}
                              </Text>
                            </View>
                            <Text
                              style={{
                                color: theme.accentLight,
                                fontFamily: fontFamilies.body700,
                                fontSize: 12,
                                textAlign: 'right',
                              }}
                            >
                              {best > 0
                                ? t('history.bestSet', {
                                    w: best,
                                    r: bestReps > 0 ? bestReps : '—',
                                  })
                                : '—'}
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
