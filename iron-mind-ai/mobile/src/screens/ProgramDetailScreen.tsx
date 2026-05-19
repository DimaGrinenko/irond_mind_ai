import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { api, type ProgramFull } from '../api/client';
import { useUserStore } from '../store/userStore';
import { t, useLang, programLabel, programSubtitle, programDescription, dayTitle } from '../i18n';

type R = RouteProp<RootStackParamList, 'ProgramDetail'>;

const WEEK_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function gradientFor(accent: string): readonly string[] {
  if (accent === 'pink') return ['#7B3FE4', '#FF3FCB'];
  if (accent === 'blue') return ['#3FA8FF', '#7B3FE4'];
  if (accent === 'green') return ['#3FFF8F', '#7B3FE4'];
  return ['#4F1FB8', '#7B3FE4', '#FF3FCB'];
}

export function ProgramDetailScreen() {
  useLang();
  const route = useRoute<R>();
  const navigation = useNavigation<any>();
  const userId = useUserStore((s) => s.id);
  const setProgram = useUserStore((s) => s.setProgram);

  const [program, setProgram_] = useState<ProgramFull | null>(null);
  const [loading, setLoading] = useState(false);
  const [showUseModal, setShowUseModal] = useState(false);
  const [busy, setBusy] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = await api.programs.one(route.params.programId);
      setProgram_(p);
    } catch (e) {
      Alert.alert('Не удалось загрузить программу', (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [route.params.programId]);

  useEffect(() => {
    load();
  }, [load]);

  const isOwned = !!program?.ownerUserId && program.ownerUserId === userId;
  const isTemplate = !program?.ownerUserId;
  const hasDays = (program?.days?.length ?? 0) > 0;

  const onClone = async () => {
    if (!program) return;
    setBusy(true);
    try {
      const cloned = await api.programs.clone(program.id);
      navigation.replace('ProgramEdit', { programId: cloned.id });
    } catch (e) {
      Alert.alert('Ошибка клонирования', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onUse = async (startDate: string, weeks: number, weekdays: number[]) => {
    if (!program) return;
    setBusy(true);
    try {
      const result = await api.programs.use(program.id, { startDate, weeks, weekdays });
      setProgram(program.id);
      setShowUseModal(false);
      Alert.alert(
        'Программа запущена',
        `В календарь добавлено ${result.created} тренировок.`,
        [
          { text: 'Открыть календарь', onPress: () => navigation.navigate('Calendar') },
          { text: 'Ок', style: 'cancel' },
        ],
      );
    } catch (e) {
      Alert.alert('Не удалось запустить', (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const onRemove = () => {
    if (!program) return;
    Alert.alert('Удалить программу?', 'Действие нельзя отменить.', [
      { text: 'Отмена', style: 'cancel' },
      {
        text: 'Удалить',
        style: 'destructive',
        onPress: async () => {
          setBusy(true);
          try {
            await api.programs.remove(program.id);
            navigation.goBack();
          } catch (e) {
            Alert.alert('Ошибка', (e as Error).message);
          } finally {
            setBusy(false);
          }
        },
      },
    ]);
  };

  const onMore = () => {
    if (!program || !isOwned) return;
    const options = ['Редактировать', 'Удалить', 'Отмена'];
    const run = (label: string) => {
      if (label === 'Редактировать') navigation.navigate('ProgramEdit', { programId: program.id });
      else if (label === 'Удалить') onRemove();
    };
    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
          destructiveButtonIndex: 1,
          title: program.title,
        },
        (idx) => {
          if (idx >= 0 && idx < options.length - 1) run(options[idx]);
        },
      );
    } else {
      Alert.alert(program.title, undefined, [
        { text: 'Редактировать', onPress: () => run('Редактировать') },
        { text: 'Удалить', style: 'destructive', onPress: () => run('Удалить') },
        { text: 'Отмена', style: 'cancel' },
      ]);
    }
  };

  if (loading || !program) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader title="Программа" onBack={() => navigation.goBack()} />
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
          <ActivityIndicator color={colors.purpleLight} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title="Программа"
        onBack={() => navigation.goBack()}
        right={
          isOwned ? (
            <Pressable onPress={onMore} hitSlop={12} style={{ paddingVertical: 8 }}>
              <Ionicons name="ellipsis-horizontal" size={20} color={colors.textSecondary} />
            </Pressable>
          ) : null
        }
      />
      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card style={{ padding: 0, overflow: 'hidden', borderRadius: 22 }}>
            <LinearGradient colors={gradientFor(program.accent) as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={{ padding: 16, minHeight: 190 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1, paddingRight: 12 }}>
                    <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 26 }}>
                      {programLabel(program.id, program.title)}
                    </Text>
                    <Text style={{ marginTop: 6, color: 'rgba(255,255,255,0.85)', fontFamily: fontFamilies.body600 }}>
                      {program.weeks} {t('common.weekShort')} · {program.daysPerWeek}{t('common.perWeek')}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 22,
                      backgroundColor: 'rgba(0,0,0,0.22)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.14)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={(program.iconName || 'barbell-outline') as any} size={34} color="rgba(255,255,255,0.90)" />
                  </View>
                </View>

                {programSubtitle(program.id, program.subtitle) ? (
                  <Text style={{ marginTop: 10, color: 'rgba(255,255,255,0.9)', fontFamily: fontFamilies.body, maxWidth: 280 }}>
                    {programSubtitle(program.id, program.subtitle)}
                  </Text>
                ) : null}
                {programDescription(program.id, program.description) ? (
                  <Text
                    style={{
                      marginTop: 8,
                      color: 'rgba(255,255,255,0.75)',
                      fontFamily: fontFamilies.body,
                      fontSize: 12,
                    }}
                  >
                    {programDescription(program.id, program.description)}
                  </Text>
                ) : null}

                <View style={{ marginTop: 16, flexDirection: 'row', gap: 10 }}>
                  <Pressable
                    onPress={() => setShowUseModal(true)}
                    disabled={busy || !hasDays}
                    style={{
                      flex: 1,
                      height: 52,
                      borderRadius: radii.md,
                      backgroundColor: hasDays ? 'rgba(0,0,0,0.30)' : 'rgba(0,0,0,0.45)',
                      borderWidth: 1,
                      borderColor: hasDays ? 'rgba(255,255,255,0.22)' : 'rgba(255,255,255,0.08)',
                      alignItems: 'center',
                      justifyContent: 'center',
                      opacity: hasDays ? 1 : 0.55,
                    }}
                  >
                    <Text style={{ color: colors.text, fontFamily: fontFamilies.body700 }}>
                      Использовать программу
                    </Text>
                  </Pressable>
                  {isTemplate ? (
                    <Pressable
                      onPress={onClone}
                      disabled={busy}
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: radii.md,
                        backgroundColor: 'rgba(0,0,0,0.30)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.22)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="copy-outline" size={22} color={colors.text} />
                    </Pressable>
                  ) : null}
                  {isOwned ? (
                    <Pressable
                      onPress={() => navigation.navigate('ProgramEdit', { programId: program.id })}
                      disabled={busy}
                      style={{
                        width: 52,
                        height: 52,
                        borderRadius: radii.md,
                        backgroundColor: 'rgba(0,0,0,0.30)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.22)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="create-outline" size={22} color={colors.text} />
                    </Pressable>
                  ) : null}
                </View>
              </View>
            </LinearGradient>
          </Card>
        </View>

        {isTemplate && hasDays ? (
          <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
            <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 12 }}>
              Системный шаблон. Чтобы редактировать — сначала «Клонировать».
            </Text>
          </View>
        ) : null}

        {!hasDays ? (
          <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
            <Card>
              <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>
                Программа без расписания
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body,
                  fontSize: 12,
                }}
              >
                Это базовая карточка без готового плана тренировок. Клонируй и собери свой
                полный план в редакторе — или выбери один из шаблонов с днями.
              </Text>
              {isTemplate ? (
                <Pressable
                  onPress={onClone}
                  disabled={busy}
                  style={{
                    marginTop: 12,
                    paddingVertical: 12,
                    alignItems: 'center',
                    borderRadius: radii.md,
                    borderWidth: 1,
                    borderColor: colors.borderNeon,
                    backgroundColor: 'rgba(157,107,255,0.12)',
                  }}
                >
                  <Text
                    style={{
                      color: colors.purpleLight,
                      fontFamily: fontFamilies.body700,
                      fontSize: 13,
                    }}
                  >
                    Клонировать и редактировать
                  </Text>
                </Pressable>
              ) : null}
            </Card>
          </View>
        ) : null}

        {hasDays ? (
          <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
            <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12, letterSpacing: 1 }}>
              ДНИ ПРОГРАММЫ
            </Text>
          </View>
        ) : null}

        <View style={{ paddingHorizontal: 16, marginTop: 10, gap: 12 }}>
          {!hasDays ? null : (
            program.days.map((d, idx) => (
              <Card key={d.id} style={{ padding: 14 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      backgroundColor: 'rgba(157,107,255,0.18)',
                      borderWidth: 1,
                      borderColor: colors.borderNeon,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}
                  >
                    <Text style={{ color: colors.purpleLight, fontFamily: fontFamilies.body700, fontSize: 13 }}>
                      {idx + 1}
                    </Text>
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 15 }}>
                      {dayTitle(d.title)}
                    </Text>
                    <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 12, marginTop: 2 }}>
                      {d.weekday !== null && d.weekday !== undefined ? WEEK_LABELS[d.weekday] + ' · ' : ''}
                      {d.exercises.length} {t('common.exShort')}
                    </Text>
                  </View>
                </View>
                <View style={{ gap: 6 }}>
                  {d.exercises.map((e) => (
                    <View
                      key={e.id}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        paddingVertical: 6,
                        paddingHorizontal: 10,
                        borderRadius: 10,
                        backgroundColor: 'rgba(255,255,255,0.03)',
                      }}
                    >
                      <Ionicons name="barbell-outline" size={14} color={colors.purpleLight} style={{ marginRight: 8 }} />
                      <Text style={{ flex: 1, color: colors.text, fontFamily: fontFamilies.body600, fontSize: 13 }}>
                        {e.exerciseName}
                      </Text>
                      <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 12 }}>
                        {e.sets}×{e.repsMin}-{e.repsMax}
                      </Text>
                    </View>
                  ))}
                </View>
              </Card>
            ))
          )}
        </View>
      </ScrollView>

      <UseProgramModal
        visible={showUseModal}
        onClose={() => setShowUseModal(false)}
        program={program}
        busy={busy}
        onSubmit={onUse}
      />
    </View>
  );
}

const WEEK_LABELS_SHORT = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];
const DEFAULT_SLOTS: Record<number, number[]> = {
  1: [0],
  2: [0, 3],
  3: [0, 2, 4],
  4: [0, 1, 3, 4],
  5: [0, 1, 2, 3, 4],
  6: [0, 1, 2, 3, 4, 5],
  7: [0, 1, 2, 3, 4, 5, 6],
};

function initialWeekdays(program: ProgramFull): number[] {
  const fallback =
    DEFAULT_SLOTS[Math.min(Math.max(program.daysPerWeek || program.days.length, 1), 7)] ?? [0, 2, 4];
  return program.days.map((d, idx) => d.weekday ?? fallback[idx % fallback.length]);
}

function UseProgramModal({
  visible,
  onClose,
  program,
  busy,
  onSubmit,
}: {
  visible: boolean;
  onClose: () => void;
  program: ProgramFull;
  busy: boolean;
  onSubmit: (startDate: string, weeks: number, weekdays: number[]) => void;
}) {
  const [start, setStart] = useState<Date>(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  });
  const [weeks, setWeeks] = useState<number>(Math.min(program.weeks || 4, 12));
  const [weekdays, setWeekdays] = useState<number[]>(() => initialWeekdays(program));

  useEffect(() => {
    if (visible) {
      const d = new Date();
      d.setHours(0, 0, 0, 0);
      setStart(d);
      setWeeks(Math.min(program.weeks || 4, 12));
      setWeekdays(initialWeekdays(program));
    }
  }, [visible, program]);

  const presets = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const monday = new Date(today);
    const wd = (today.getDay() + 6) % 7;
    monday.setDate(today.getDate() - wd);
    const nextMonday = new Date(monday);
    nextMonday.setDate(monday.getDate() + 7);
    return [
      { label: 'Сегодня', date: today },
      { label: 'Завтра', date: addDays(today, 1) },
      { label: 'Со след. понедельника', date: nextMonday },
    ];
  }, []);

  const fmt = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;

  const conflict = new Set<number>();
  const seen = new Set<number>();
  for (const w of weekdays) {
    if (seen.has(w)) conflict.add(w);
    seen.add(w);
  }
  const hasConflict = conflict.size > 0;

  const setDayWeekday = (idx: number, wd: number) => {
    setWeekdays((prev) => prev.map((v, i) => (i === idx ? wd : v)));
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
        <View
          style={{
            backgroundColor: colors.bg,
            borderTopLeftRadius: radii.xl,
            borderTopRightRadius: radii.xl,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 20,
            paddingBottom: 24,
            maxHeight: '92%',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}>
            <Text style={{ flex: 1, color: colors.text, fontFamily: fontFamilies.heading, fontSize: 20 }}>
              Запустить программу
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={{ gap: 14, paddingBottom: 8 }}>
            <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 12 }}>
              Выбери дату старта, длительность и день недели для каждой тренировки.
              Старые запланированные тренировки этой программы будут заменены.
            </Text>

            <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 11, letterSpacing: 1 }}>
              СТАРТ
            </Text>
            <View style={{ gap: 8 }}>
              {presets.map((p) => {
                const active = fmt(p.date) === fmt(start);
                return (
                  <Pressable
                    key={p.label}
                    onPress={() => setStart(p.date)}
                    style={{
                      paddingVertical: 12,
                      paddingHorizontal: 14,
                      borderRadius: radii.md,
                      borderWidth: 1,
                      borderColor: active ? 'rgba(123,63,228,0.55)' : colors.border,
                      backgroundColor: active ? 'rgba(123,63,228,0.18)' : colors.bgSecondary,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <Ionicons
                      name={active ? 'radio-button-on' : 'radio-button-off'}
                      size={18}
                      color={active ? colors.purpleLight : colors.textMuted}
                      style={{ marginRight: 10 }}
                    />
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>
                        {p.label}
                      </Text>
                      <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 12, marginTop: 2 }}>
                        {fmt(p.date)}
                      </Text>
                    </View>
                  </Pressable>
                );
              })}
            </View>

            <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 11, letterSpacing: 1 }}>
              ДЛИТЕЛЬНОСТЬ
            </Text>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {[2, 4, 8, 12].map((w) => {
                const active = weeks === w;
                return (
                  <Pressable
                    key={w}
                    onPress={() => setWeeks(w)}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      alignItems: 'center',
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: active ? 'rgba(123,63,228,0.55)' : colors.border,
                      backgroundColor: active ? 'rgba(123,63,228,0.18)' : colors.bgSecondary,
                    }}
                  >
                    <Text style={{ color: active ? colors.text : colors.textSecondary, fontFamily: fontFamilies.body700, fontSize: 13 }}>
                      {w} нед.
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 11, letterSpacing: 1 }}>
              ДНИ НЕДЕЛИ ({program.days.length} {program.days.length === 1 ? 'тренировка' : 'тренировок'})
            </Text>
            <View style={{ gap: 8 }}>
              {program.days.map((d, idx) => (
                <View
                  key={d.id}
                  style={{
                    padding: 12,
                    borderRadius: radii.md,
                    borderWidth: 1,
                    borderColor: conflict.has(weekdays[idx]) ? colors.red : colors.border,
                    backgroundColor: colors.bgSecondary,
                    gap: 8,
                  }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                    <View
                      style={{
                        width: 26,
                        height: 26,
                        borderRadius: 8,
                        backgroundColor: 'rgba(157,107,255,0.18)',
                        borderWidth: 1,
                        borderColor: colors.borderNeon,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Text style={{ color: colors.purpleLight, fontFamily: fontFamilies.body700, fontSize: 11 }}>
                        {idx + 1}
                      </Text>
                    </View>
                    <Text style={{ flex: 1, color: colors.text, fontFamily: fontFamilies.body700, fontSize: 13 }}>
                      {dayTitle(d.title)}
                    </Text>
                    <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11 }}>
                      {d.exercises.length} {t('common.exShort')}
                    </Text>
                  </View>
                  <View style={{ flexDirection: 'row', gap: 5, flexWrap: 'wrap' }}>
                    {WEEK_LABELS_SHORT.map((l, i) => {
                      const active = weekdays[idx] === i;
                      const isConflict = conflict.has(i) && active;
                      return (
                        <Pressable
                          key={l}
                          onPress={() => setDayWeekday(idx, i)}
                          style={{
                            paddingHorizontal: 12,
                            paddingVertical: 8,
                            borderRadius: 10,
                            borderWidth: 1,
                            borderColor: isConflict
                              ? colors.red
                              : active
                                ? colors.borderNeon
                                : colors.border,
                            backgroundColor: active
                              ? 'rgba(157,107,255,0.22)'
                              : 'rgba(0,0,0,0.25)',
                          }}
                        >
                          <Text
                            style={{
                              color: active ? colors.purpleLight : colors.textSecondary,
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
                </View>
              ))}
            </View>

            {hasConflict ? (
              <Text style={{ color: colors.red, fontFamily: fontFamilies.body600, fontSize: 12 }}>
                Два дня программы попадают на один день недели. Выбери разные дни.
              </Text>
            ) : null}

            <GradientButton
              title={busy ? 'Создаём…' : 'Создать план'}
              onPress={() => onSubmit(fmt(start), weeks, weekdays)}
              disabled={busy || hasConflict}
              rightIcon={
                busy ? (
                  <ActivityIndicator color={colors.text} />
                ) : (
                  <Ionicons name="calendar" size={18} color={colors.text} />
                )
              }
            />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function addDays(d: Date, n: number) {
  const x = new Date(d);
  x.setDate(d.getDate() + n);
  return x;
}
