/**
 * Wizard «Составить план тренировок».
 * 4 шага: название → дни недели → выбор упражнений для каждого дня → запуск.
 * Создаёт личную программу на backend и сразу её use().
 */
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { colors, neonGlow, radii } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { fontFamilies } from '../theme/typography';
import { exercises as catalog } from '../data/exercises';
import { localizedExercise } from '../data/exercises_en';
import { api } from '../api/client';
import { useUserStore } from '../store/userStore';
import { t, useLang, muscleLabel, difficultyLabel } from '../i18n';

type Step = 'name' | 'days' | 'exercises' | 'review';

const weekdaysShort = () => [
  t('wd.mon'),
  t('wd.tue'),
  t('wd.wed'),
  t('wd.thu'),
  t('wd.fri'),
  t('wd.sat'),
  t('wd.sun'),
];

type DayDraft = {
  title: string;
  weekday: number;
  exerciseIds: string[];
};

export function PlanBuilderScreen() {
  useLang();
  const theme = useTheme();
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const setProgram = useUserStore((s) => s.setProgram);

  const [step, setStep] = useState<Step>('name');
  const [planTitle, setPlanTitle] = useState(t('plan.defaultTitle'));
  const [days, setDays] = useState<DayDraft[]>([
    { title: t('plan.dayN', { x: 'A' }), weekday: 0, exerciseIds: [] },
    { title: t('plan.dayN', { x: 'B' }), weekday: 2, exerciseIds: [] },
    { title: t('plan.dayN', { x: 'C' }), weekday: 4, exerciseIds: [] },
  ]);
  const [editingDayIdx, setEditingDayIdx] = useState<number | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const conflicts = useMemo(() => {
    const seen = new Map<number, number>();
    const c = new Set<number>();
    days.forEach((d, i) => {
      if (seen.has(d.weekday)) c.add(d.weekday);
      seen.set(d.weekday, i);
    });
    return c;
  }, [days]);

  const canProceedDays =
    days.length > 0 &&
    conflicts.size === 0 &&
    days.every((d) => d.title.trim());
  const canProceedExercises = days.every((d) => d.exerciseIds.length > 0);

  const addDay = () => {
    if (days.length >= 6) return;
    const usedWeekdays = new Set(days.map((d) => d.weekday));
    const nextWd = [0, 1, 2, 3, 4, 5, 6].find((w) => !usedWeekdays.has(w)) ?? 0;
    setDays([
      ...days,
      {
        title: t('plan.dayN', { x: String.fromCharCode(65 + days.length) }),
        weekday: nextWd,
        exerciseIds: [],
      },
    ]);
  };

  const removeDay = (idx: number) => {
    setDays(days.filter((_, i) => i !== idx));
  };

  const updateDay = (idx: number, patch: Partial<DayDraft>) => {
    setDays(days.map((d, i) => (i === idx ? { ...d, ...patch } : d)));
  };

  const onSubmit = async () => {
    if (submitting) return;
    setSubmitting(true);
    try {
      // 1. Создаём личную программу с нуля
      const created = await api.programs.create({
        title: planTitle.trim() || t('plan.defaultTitle'),
        subtitle: t('plan.subtitle'),
        description: t('plan.description'),
        daysPerWeek: days.length,
        weeks: 8,
        kind: 'CUSTOM',
      });
      // 2. Добавляем дни и упражнения
      for (const d of days) {
        const dayRow = await api.programs.addDay(created.id, {
          title: d.title.trim() || t('plan.day'),
          weekday: d.weekday,
        });
        for (const exId of d.exerciseIds) {
          const meta = catalog.find((e) => e.id === exId);
          await api.programs.addExercise(dayRow.id, {
            exerciseId: exId,
            exerciseName: meta?.name ?? exId,
            sets: 3,
            repsMin: 8,
            repsMax: 12,
            restSeconds: 90,
          });
        }
      }

      // 3. Запускаем use с пользовательскими weekdays
      await api.programs.use(created.id, {
        startDate: new Date().toISOString().slice(0, 10),
        weeks: 8,
        weekdays: days.map((d) => d.weekday),
      });

      setProgram(created.id, 1);
      Alert.alert(planTitle, t('plan.createdMsg'), [
        { text: t('common.ok'), onPress: () => nav.goBack() },
      ]);
    } catch (e) {
      Alert.alert(t('common.error'), (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient
        colors={['rgba(157,107,255,0.18)', 'rgba(0,0,0,0)']}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 280 }}
      />

      <View
        style={{
          paddingTop: insets.top + 8,
          paddingHorizontal: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}
      >
        <Pressable
          onPress={() => nav.goBack()}
          hitSlop={12}
          style={{ paddingVertical: 8, paddingRight: 10 }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </Pressable>
        <Text
          style={{
            color: colors.text,
            fontFamily: fontFamilies.body700,
            fontSize: 18,
          }}
        >
          {t('home.composePlan')}
        </Text>
      </View>

      {/* шаги */}
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 14,
          flexDirection: 'row',
          gap: 6,
        }}
      >
        {(['name', 'days', 'exercises', 'review'] as Step[]).map((s, i) => {
          const active = step === s;
          const done =
            ['name', 'days', 'exercises', 'review'].indexOf(step) > i;
          return (
            <View
              key={s}
              style={{
                flex: 1,
                height: 4,
                borderRadius: 2,
                backgroundColor: done
                  ? colors.green
                  : active
                    ? theme.accentLight
                    : 'rgba(255,255,255,0.08)',
              }}
            />
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 180 }}
        showsVerticalScrollIndicator={false}
      >
        {step === 'name' && (
          <View style={{ paddingHorizontal: 16, marginTop: 20, gap: 14 }}>
            <Text
              style={{
                color: colors.text,
                fontFamily: fontFamilies.heading,
                fontSize: 24,
              }}
            >
              {t('plan.q1')}
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: fontFamilies.body,
                fontSize: 13,
              }}
            >
              {t('plan.q1hint')}
            </Text>
            <View
              style={{
                padding: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.borderNeon,
                backgroundColor: 'rgba(157,107,255,0.08)',
              }}
            >
              <Text
                style={{
                  color: theme.accentLight,
                  fontFamily: fontFamilies.body700,
                  fontSize: 11,
                  marginBottom: 4,
                }}
              >
                {t('plan.tipLabel')}
              </Text>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body,
                  fontSize: 12,
                }}
              >
                {t('plan.q1tip')}
              </Text>
            </View>
            <View
              style={{
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: theme.borderNeon,
                backgroundColor: colors.bgSecondary,
                paddingHorizontal: 14,
              }}
            >
              <TextInput
                value={planTitle}
                onChangeText={setPlanTitle}
                placeholder={t('plan.defaultTitle')}
                placeholderTextColor={colors.textMuted}
                autoFocus
                style={{
                  color: colors.text,
                  fontFamily: fontFamilies.body700,
                  fontSize: 18,
                  height: 56,
                }}
                maxLength={60}
              />
            </View>
          </View>
        )}

        {step === 'days' && (
          <View style={{ paddingHorizontal: 16, marginTop: 20, gap: 12 }}>
            <Text
              style={{
                color: colors.text,
                fontFamily: fontFamilies.heading,
                fontSize: 22,
              }}
            >
              {t('plan.step2title')}
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: fontFamilies.body,
                fontSize: 13,
              }}
            >
              {t('plan.step2hint')}
            </Text>

            {days.map((d, idx) => (
              <Card key={idx} style={{ padding: 12 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 10,
                  }}
                >
                  <TextInput
                    value={d.title}
                    onChangeText={(v) => updateDay(idx, { title: v })}
                    style={{
                      flex: 1,
                      color: colors.text,
                      fontFamily: fontFamilies.body700,
                      fontSize: 14,
                      paddingVertical: 4,
                    }}
                    maxLength={40}
                  />
                  <Pressable
                    onPress={() => removeDay(idx)}
                    hitSlop={10}
                    style={{ paddingHorizontal: 6 }}
                  >
                    <Ionicons
                      name="trash-outline"
                      size={16}
                      color={colors.pink}
                    />
                  </Pressable>
                </View>
                <View
                  style={{ flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}
                >
                  {weekdaysShort().map((l, i) => {
                    const active = d.weekday === i;
                    const isConflict = conflicts.has(i) && active;
                    return (
                      <Pressable
                        key={l}
                        onPress={() => updateDay(idx, { weekday: i })}
                        style={{
                          paddingHorizontal: 12,
                          paddingVertical: 8,
                          borderRadius: 10,
                          borderWidth: 1,
                          borderColor: isConflict
                            ? colors.red
                            : active
                              ? theme.borderNeon
                              : colors.border,
                          backgroundColor: active
                            ? 'rgba(157,107,255,0.22)'
                            : 'rgba(0,0,0,0.2)',
                        }}
                      >
                        <Text
                          style={{
                            color: active
                              ? theme.accentLight
                              : colors.textSecondary,
                            fontFamily: fontFamilies.body700,
                            fontSize: 12,
                          }}
                        >
                          {l}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>
              </Card>
            ))}

            {days.length < 6 ? (
              <Pressable
                onPress={addDay}
                style={{
                  paddingVertical: 12,
                  alignItems: 'center',
                  borderRadius: 14,
                  borderWidth: 1,
                  borderStyle: 'dashed',
                  borderColor: theme.borderNeon,
                  backgroundColor: 'rgba(157,107,255,0.08)',
                }}
              >
                <Text
                  style={{
                    color: theme.accentLight,
                    fontFamily: fontFamilies.body700,
                    fontSize: 13,
                  }}
                >
                  {t('plan.addDay')}
                </Text>
              </Pressable>
            ) : null}

            {conflicts.size > 0 ? (
              <Text
                style={{
                  color: colors.red,
                  fontFamily: fontFamilies.body600,
                  fontSize: 12,
                }}
              >
                {t('plan.conflictMsg')}
              </Text>
            ) : null}
          </View>
        )}

        {step === 'exercises' && (
          <View style={{ paddingHorizontal: 16, marginTop: 20, gap: 12 }}>
            <Text
              style={{
                color: colors.text,
                fontFamily: fontFamilies.heading,
                fontSize: 22,
              }}
            >
              {t('plan.step3title')}
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: fontFamilies.body,
                fontSize: 13,
              }}
            >
              {t('plan.step3hint')}
            </Text>

            {days.map((d, idx) => (
              <Pressable
                key={idx}
                onPress={() => setEditingDayIdx(idx)}
                style={{
                  padding: 14,
                  borderRadius: radii.md,
                  borderWidth: 1,
                  borderColor:
                    d.exerciseIds.length > 0
                      ? 'rgba(63,255,150,0.45)'
                      : colors.border,
                  backgroundColor:
                    d.exerciseIds.length > 0
                      ? 'rgba(63,255,150,0.08)'
                      : colors.bgSecondary,
                }}
              >
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontFamily: fontFamilies.body700,
                        fontSize: 14,
                      }}
                    >
                      {d.title} · {weekdaysShort()[d.weekday]}
                    </Text>
                    <Text
                      style={{
                        marginTop: 4,
                        color: colors.textMuted,
                        fontFamily: fontFamilies.body,
                        fontSize: 11,
                      }}
                    >
                      {d.exerciseIds.length > 0
                        ? `${d.exerciseIds.length} ${t('common.exShort')}: ${d.exerciseIds
                            .slice(0, 3)
                            .map(
                              (id) =>
                                catalog.find((e) => e.id === id)?.name ?? id,
                            )
                            .join(', ')}${d.exerciseIds.length > 3 ? '…' : ''}`
                        : t('plan.tapToAdd')}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={18}
                    color={colors.textMuted}
                  />
                </View>
              </Pressable>
            ))}
          </View>
        )}

        {step === 'review' && (
          <View style={{ paddingHorizontal: 16, marginTop: 20, gap: 14 }}>
            <Text
              style={{
                color: colors.text,
                fontFamily: fontFamilies.heading,
                fontSize: 22,
              }}
            >
              {t('plan.step4title')}
            </Text>
            <Card style={{ padding: 14 }}>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: fontFamilies.body700,
                  fontSize: 16,
                }}
              >
                {planTitle}
              </Text>
              <Text
                style={{
                  marginTop: 4,
                  color: colors.textMuted,
                  fontFamily: fontFamilies.body,
                  fontSize: 12,
                }}
              >
                {t('plan.summary', { n: days.length })}
              </Text>
              {days.map((d, idx) => (
                <View key={idx} style={{ marginTop: 10, gap: 4 }}>
                  <Text
                    style={{
                      color: theme.accentLight,
                      fontFamily: fontFamilies.body700,
                      fontSize: 13,
                    }}
                  >
                    {weekdaysShort()[d.weekday]} · {d.title}
                  </Text>
                  {d.exerciseIds.map((id) => {
                    const m = catalog.find((e) => e.id === id);
                    return (
                      <Text
                        key={id}
                        style={{
                          color: colors.textSecondary,
                          fontFamily: fontFamilies.body,
                          fontSize: 12,
                          marginLeft: 8,
                        }}
                      >
                        • {m?.name ?? id}
                      </Text>
                    );
                  })}
                </View>
              ))}
            </Card>
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: fontFamilies.body,
                fontSize: 11,
              }}
            >
              {t('plan.warnReplace')}
            </Text>
          </View>
        )}
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: Math.max(insets.bottom, 12) + 6,
          flexDirection: 'row',
          gap: 10,
        }}
      >
        {step !== 'name' ? (
          <Pressable
            onPress={() => {
              setStep(
                step === 'days'
                  ? 'name'
                  : step === 'exercises'
                    ? 'days'
                    : 'exercises',
              );
            }}
            style={{
              width: 56,
              height: 56,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.bgSecondary,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
        ) : null}

        <View style={{ flex: 1 }}>
          {step === 'review' ? (
            <GradientButton
              title={submitting ? t('use.creating') : t('plan.create')}
              onPress={onSubmit}
              disabled={submitting}
            />
          ) : (
            <GradientButton
              title={t('common.next')}
              onPress={() => {
                if (step === 'name') {
                  if (!planTitle.trim()) {
                    Alert.alert(t('common.error'), t('plan.errName'));
                    return;
                  }
                  setStep('days');
                } else if (step === 'days') {
                  if (!canProceedDays) {
                    Alert.alert(
                      t('common.error'),
                      conflicts.size
                        ? t('plan.errConflict')
                        : t('plan.errFillNames'),
                    );
                    return;
                  }
                  setStep('exercises');
                } else if (step === 'exercises') {
                  if (!canProceedExercises) {
                    Alert.alert(t('common.error'), t('plan.errExercises'));
                    return;
                  }
                  setStep('review');
                }
              }}
            />
          )}
        </View>
      </View>

      <ExercisePickerModal
        visible={editingDayIdx !== null}
        selected={editingDayIdx !== null ? days[editingDayIdx].exerciseIds : []}
        onClose={() => setEditingDayIdx(null)}
        onChange={(ids) => {
          if (editingDayIdx === null) return;
          updateDay(editingDayIdx, { exerciseIds: ids });
        }}
      />
    </View>
  );
}

function ExercisePickerModal({
  visible,
  selected,
  onClose,
  onChange,
}: {
  visible: boolean;
  selected: string[];
  onClose: () => void;
  onChange: (ids: string[]) => void;
}) {
  const lang = useLang();
  const [q, setQ] = useState('');
  const [local, setLocal] = useState<string[]>(selected);

  React.useEffect(() => {
    if (visible) setLocal(selected);
  }, [visible, selected]);

  const filtered = useMemo(() => {
    const t_ = q.trim().toLowerCase();
    if (!t_) return catalog;
    return catalog.filter(
      (e) =>
        e.name.toLowerCase().includes(t_) ||
        e.primary.toLowerCase().includes(t_),
    );
  }, [q]);

  const toggle = (id: string) => {
    if (local.includes(id)) setLocal(local.filter((x) => x !== id));
    else setLocal([...local, id]);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.78)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: colors.bg,
            borderTopLeftRadius: radii.xl,
            borderTopRightRadius: radii.xl,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 20,
            paddingBottom: 24,
            height: '88%',
            gap: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                flex: 1,
                color: colors.text,
                fontFamily: fontFamilies.heading,
                fontSize: 20,
              }}
            >
              {t('plan.exercisesCount', { n: local.length })}
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>
          <View
            style={{
              borderRadius: radii.md,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.bgSecondary,
              paddingHorizontal: 14,
            }}
          >
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder={t('common.search')}
              placeholderTextColor={colors.textMuted}
              style={{
                color: colors.text,
                fontFamily: fontFamilies.body600,
                fontSize: 15,
                height: 46,
              }}
            />
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 16 }}
          >
            {filtered.map((e) => {
              const active = local.includes(e.id);
              return (
                <Pressable
                  key={e.id}
                  onPress={() => toggle(e.id)}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                    paddingHorizontal: 10,
                    borderRadius: 10,
                    backgroundColor: active
                      ? 'rgba(63,255,150,0.10)'
                      : 'transparent',
                    borderWidth: 1,
                    borderColor: active ? colors.green : colors.border,
                    marginBottom: 6,
                  }}
                >
                  <Ionicons
                    name={active ? 'checkmark-circle' : 'ellipse-outline'}
                    size={20}
                    color={active ? colors.green : 'rgba(255,255,255,0.3)'}
                    style={{ marginRight: 10 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontFamily: fontFamilies.body600,
                        fontSize: 14,
                      }}
                    >
                      {localizedExercise(e, lang).name}
                    </Text>
                    <Text
                      style={{
                        color: colors.textMuted,
                        fontFamily: fontFamilies.body,
                        fontSize: 11,
                        marginTop: 2,
                      }}
                    >
                      {muscleLabel(e.primary)} · {difficultyLabel(e.difficulty)}
                    </Text>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>
          <GradientButton
            title={`OK (${local.length})`}
            onPress={() => {
              onChange(local);
              onClose();
            }}
          />
        </View>
      </View>
    </Modal>
  );
}
