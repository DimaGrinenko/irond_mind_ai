import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors, radii } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { fontFamilies } from '../theme/typography';
import { exercises as exerciseCatalog } from '../data/exercises';
import { localizedExercise } from '../data/exercises_en';
import {
  api,
  type ProgramDayWithExercises,
  type ProgramExercise,
  type ProgramFull,
} from '../api/client';
import { t, useLang, muscleLabel, difficultyLabel } from '../i18n';

type R = RouteProp<RootStackParamList, 'ProgramEdit'>;

const weekLabels = () => [
  t('wd.mon'),
  t('wd.tue'),
  t('wd.wed'),
  t('wd.thu'),
  t('wd.fri'),
  t('wd.sat'),
  t('wd.sun'),
];

export function ProgramEditScreen() {
  useLang();
  const theme = useTheme();
  const route = useRoute<R>();
  const navigation = useNavigation<any>();

  const [program, setProgram] = useState<ProgramFull | null>(null);
  const [loading, setLoading] = useState(false);
  const [busy, setBusy] = useState(false);

  const [editTitle, setEditTitle] = useState(false);
  const [titleDraft, setTitleDraft] = useState('');
  const [subtitleDraft, setSubtitleDraft] = useState('');
  const [descriptionDraft, setDescriptionDraft] = useState('');

  const [addDayOpen, setAddDayOpen] = useState(false);
  const [pickExerciseFor, setPickExerciseFor] = useState<string | null>(null);
  const [editExercise, setEditExercise] = useState<ProgramExercise | null>(
    null,
  );

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const p = await api.programs.one(route.params.programId);
      setProgram(p);
      setTitleDraft(p.title);
      setSubtitleDraft(p.subtitle);
      setDescriptionDraft(p.description);
    } catch (e) {
      Alert.alert(t('progEdit.loadFailed'), (e as Error).message);
    } finally {
      setLoading(false);
    }
  }, [route.params.programId]);

  useEffect(() => {
    load();
  }, [load]);

  const saveMeta = async () => {
    if (!program) return;
    setBusy(true);
    try {
      const updated = await api.programs.update(program.id, {
        title: titleDraft.trim() || program.title,
        subtitle: subtitleDraft.trim(),
        description: descriptionDraft.trim(),
      });
      setProgram((prev) =>
        prev ? { ...prev, ...updated, days: prev.days } : prev,
      );
      setEditTitle(false);
    } catch (e) {
      Alert.alert(t('progEdit.saveFailed'), (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const addDay = async (title: string, weekday: number | null) => {
    if (!program) return;
    setBusy(true);
    try {
      const day = await api.programs.addDay(program.id, {
        title,
        weekday: weekday ?? undefined,
      });
      setProgram((prev) =>
        prev
          ? {
              ...prev,
              days: [...prev.days, day].sort((a, b) => a.order - b.order),
            }
          : prev,
      );
      setAddDayOpen(false);
    } catch (e) {
      Alert.alert(t('common.error'), (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const updateDay = async (
    dayId: string,
    patch: { title?: string; weekday?: number | null },
  ) => {
    setBusy(true);
    try {
      const updated = await api.programs.updateDay(dayId, {
        title: patch.title,
        weekday: patch.weekday ?? undefined,
      });
      setProgram((prev) =>
        prev
          ? {
              ...prev,
              days: prev.days.map((d) => (d.id === dayId ? updated : d)),
            }
          : prev,
      );
    } catch (e) {
      Alert.alert(t('common.error'), (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const removeDay = (dayId: string) => {
    Alert.alert(t('progEdit.deleteDayConfirm'), t('progEdit.deleteDayMsg'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          setBusy(true);
          try {
            await api.programs.removeDay(dayId);
            setProgram((prev) =>
              prev
                ? { ...prev, days: prev.days.filter((d) => d.id !== dayId) }
                : prev,
            );
          } catch (e) {
            Alert.alert(t('common.error'), (e as Error).message);
          } finally {
            setBusy(false);
          }
        },
      },
    ]);
  };

  const addExerciseToDay = async (
    dayId: string,
    cat: { id: string; name: string },
  ) => {
    setBusy(true);
    try {
      const created = await api.programs.addExercise(dayId, {
        exerciseId: cat.id,
        exerciseName: cat.name,
      });
      setProgram((prev) =>
        prev
          ? {
              ...prev,
              days: prev.days.map((d) =>
                d.id === dayId
                  ? { ...d, exercises: [...d.exercises, created] }
                  : d,
              ),
            }
          : prev,
      );
      setPickExerciseFor(null);
    } catch (e) {
      Alert.alert(t('common.error'), (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const saveExercise = async (e: ProgramExercise) => {
    setBusy(true);
    try {
      const updated = await api.programs.updateExercise(e.id, {
        exerciseName: e.exerciseName,
        sets: e.sets,
        repsMin: e.repsMin,
        repsMax: e.repsMax,
        restSeconds: e.restSeconds,
        notes: e.notes ?? undefined,
      });
      setProgram((prev) =>
        prev
          ? {
              ...prev,
              days: prev.days.map((d) =>
                d.id === updated.dayId
                  ? {
                      ...d,
                      exercises: d.exercises.map((x) =>
                        x.id === updated.id ? updated : x,
                      ),
                    }
                  : d,
              ),
            }
          : prev,
      );
      setEditExercise(null);
    } catch (e) {
      Alert.alert(t('progEdit.notSaved'), (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  const removeExercise = (exId: string, dayId: string) => {
    Alert.alert(t('progEdit.deleteExerciseConfirm'), undefined, [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          setBusy(true);
          try {
            await api.programs.removeExercise(exId);
            setProgram((prev) =>
              prev
                ? {
                    ...prev,
                    days: prev.days.map((d) =>
                      d.id === dayId
                        ? {
                            ...d,
                            exercises: d.exercises.filter((x) => x.id !== exId),
                          }
                        : d,
                    ),
                  }
                : prev,
            );
          } catch (e) {
            Alert.alert(t('common.error'), (e as Error).message);
          } finally {
            setBusy(false);
          }
        },
      },
    ]);
  };

  if (loading || !program) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <ScreenHeader
          title={t('pe.editorShort')}
          onBack={() => navigation.goBack()}
        />
        <View
          style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
        >
          <ActivityIndicator color={theme.accentLight} />
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={t('pe.title')}
        onBack={() => navigation.goBack()}
        right={busy ? <ActivityIndicator color={theme.accentLight} /> : null}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 140 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card style={{ padding: 16 }}>
            {editTitle ? (
              <View style={{ gap: 10 }}>
                <Field label={t('common.name')}>
                  <TextInput
                    value={titleDraft}
                    onChangeText={setTitleDraft}
                    style={inputStyle}
                    maxLength={80}
                  />
                </Field>
                <Field label={t('pe.subtitle')}>
                  <TextInput
                    value={subtitleDraft}
                    onChangeText={setSubtitleDraft}
                    style={inputStyle}
                    maxLength={140}
                  />
                </Field>
                <Field label={t('pe.description')}>
                  <TextInput
                    value={descriptionDraft}
                    onChangeText={setDescriptionDraft}
                    style={[
                      inputStyle,
                      { height: 96, paddingTop: 12, textAlignVertical: 'top' },
                    ]}
                    multiline
                    maxLength={500}
                  />
                </Field>
                <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
                  <Pressable
                    onPress={() => {
                      setEditTitle(false);
                      setTitleDraft(program.title);
                      setSubtitleDraft(program.subtitle);
                      setDescriptionDraft(program.description);
                    }}
                    style={{
                      flex: 1,
                      paddingVertical: 12,
                      alignItems: 'center',
                      borderRadius: radii.md,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.textSecondary,
                        fontFamily: fontFamilies.body600,
                      }}
                    >
                      {t('common.cancel')}
                    </Text>
                  </Pressable>
                  <View style={{ flex: 1 }}>
                    <GradientButton
                      title={t('common.save')}
                      onPress={saveMeta}
                      disabled={busy}
                    />
                  </View>
                </View>
              </View>
            ) : (
              <View>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontFamily: fontFamilies.body700,
                        fontSize: 22,
                      }}
                    >
                      {program.title}
                    </Text>
                    {program.subtitle ? (
                      <Text
                        style={{
                          marginTop: 4,
                          color: colors.textSecondary,
                          fontFamily: fontFamilies.body,
                          fontSize: 13,
                        }}
                      >
                        {program.subtitle}
                      </Text>
                    ) : null}
                  </View>
                  <Pressable
                    onPress={() => setEditTitle(true)}
                    hitSlop={10}
                    style={{
                      width: 40,
                      height: 40,
                      borderRadius: 14,
                      backgroundColor: 'rgba(157,107,255,0.18)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons
                      name="create-outline"
                      size={18}
                      color={theme.accentLight}
                    />
                  </Pressable>
                </View>
                {program.description ? (
                  <Text
                    style={{
                      marginTop: 10,
                      color: colors.textMuted,
                      fontFamily: fontFamilies.body,
                      fontSize: 12,
                    }}
                  >
                    {program.description}
                  </Text>
                ) : null}
              </View>
            )}
          </Card>
        </View>

        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 18,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Text
            style={{
              flex: 1,
              color: colors.textSecondary,
              fontFamily: fontFamilies.body600,
              fontSize: 12,
              letterSpacing: 1,
            }}
          >
            {t('pe.daysCount', { n: program.days.length })}
          </Text>
          <Pressable
            onPress={() => setAddDayOpen(true)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: theme.borderNeon,
              backgroundColor: 'rgba(157,107,255,0.12)',
            }}
          >
            <Ionicons name="add" size={16} color={theme.accentLight} />
            <Text
              style={{
                marginLeft: 4,
                color: theme.accentLight,
                fontFamily: fontFamilies.body700,
                fontSize: 12,
              }}
            >
              {t('plan.day')}
            </Text>
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 10, gap: 12 }}>
          {program.days.map((day) => (
            <DayCard
              key={day.id}
              day={day}
              onRename={(title) => updateDay(day.id, { title })}
              onWeekday={(weekday) => updateDay(day.id, { weekday })}
              onRemove={() => removeDay(day.id)}
              onAddExercise={() => setPickExerciseFor(day.id)}
              onEditExercise={(e) => setEditExercise(e)}
              onRemoveExercise={(eid) => removeExercise(eid, day.id)}
            />
          ))}
          {program.days.length === 0 ? (
            <Card>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body,
                  textAlign: 'center',
                }}
              >
                {t('pe.noDays')}
              </Text>
            </Card>
          ) : null}
        </View>
      </ScrollView>

      <AddDayModal
        visible={addDayOpen}
        onClose={() => setAddDayOpen(false)}
        onAdd={addDay}
        busy={busy}
      />

      <PickExerciseModal
        visible={pickExerciseFor !== null}
        onClose={() => setPickExerciseFor(null)}
        onPick={(cat) => {
          if (pickExerciseFor) addExerciseToDay(pickExerciseFor, cat);
        }}
      />

      <EditExerciseModal
        exercise={editExercise}
        onClose={() => setEditExercise(null)}
        onSave={saveExercise}
        busy={busy}
      />
    </View>
  );
}

function DayCard({
  day,
  onRename,
  onWeekday,
  onRemove,
  onAddExercise,
  onEditExercise,
  onRemoveExercise,
}: {
  day: ProgramDayWithExercises;
  onRename: (title: string) => void;
  onWeekday: (wd: number | null) => void;
  onRemove: () => void;
  onAddExercise: () => void;
  onEditExercise: (e: ProgramExercise) => void;
  onRemoveExercise: (id: string) => void;
}) {
  const theme = useTheme();
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState(day.title);

  useEffect(() => setDraft(day.title), [day.title]);

  return (
    <Card style={{ padding: 14 }}>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 10 }}
      >
        <View style={{ flex: 1 }}>
          {editing ? (
            <TextInput
              value={draft}
              onChangeText={setDraft}
              onBlur={() => {
                setEditing(false);
                if (draft.trim() && draft.trim() !== day.title)
                  onRename(draft.trim());
                else setDraft(day.title);
              }}
              autoFocus
              style={[inputStyle, { height: 40, fontSize: 14 }]}
              maxLength={60}
            />
          ) : (
            <Pressable onPress={() => setEditing(true)}>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: fontFamilies.body700,
                  fontSize: 16,
                }}
              >
                {day.title}
              </Text>
            </Pressable>
          )}
        </View>
        <Pressable
          onPress={onRemove}
          hitSlop={10}
          style={{ paddingHorizontal: 6 }}
        >
          <Ionicons name="trash-outline" size={18} color={colors.pink} />
        </Pressable>
      </View>

      <View
        style={{
          flexDirection: 'row',
          gap: 6,
          marginBottom: 12,
          flexWrap: 'wrap',
        }}
      >
        <Pressable
          onPress={() => onWeekday(null)}
          style={[
            chipStyle,
            day.weekday === null && {
              borderColor: theme.borderNeon,
              backgroundColor: 'rgba(157,107,255,0.18)',
            },
          ]}
        >
          <Text
            style={{
              color:
                day.weekday === null ? theme.accentLight : colors.textMuted,
              fontFamily: fontFamilies.body600,
              fontSize: 11,
            }}
          >
            —
          </Text>
        </Pressable>
        {weekLabels().map((l, i) => {
          const active = day.weekday === i;
          return (
            <Pressable
              key={l}
              onPress={() => onWeekday(i)}
              style={[
                chipStyle,
                active && {
                  borderColor: theme.borderNeon,
                  backgroundColor: 'rgba(157,107,255,0.18)',
                },
              ]}
            >
              <Text
                style={{
                  color: active ? theme.accentLight : colors.textSecondary,
                  fontFamily: fontFamilies.body600,
                  fontSize: 11,
                }}
              >
                {l}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <View style={{ gap: 6 }}>
        {day.exercises.map((e) => (
          <View
            key={e.id}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              paddingVertical: 8,
              paddingHorizontal: 10,
              borderRadius: 10,
              backgroundColor: 'rgba(255,255,255,0.03)',
            }}
          >
            <Pressable style={{ flex: 1 }} onPress={() => onEditExercise(e)}>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: fontFamilies.body600,
                  fontSize: 13,
                }}
              >
                {e.exerciseName}
              </Text>
              <Text
                style={{
                  color: colors.textMuted,
                  fontFamily: fontFamilies.body,
                  fontSize: 11,
                  marginTop: 2,
                }}
              >
                {e.sets}×{e.repsMin}-{e.repsMax} ·{' '}
                {t('pe.restLine', { s: e.restSeconds })}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => onRemoveExercise(e.id)}
              hitSlop={10}
              style={{ paddingHorizontal: 6 }}
            >
              <Ionicons name="close" size={16} color={colors.textMuted} />
            </Pressable>
          </View>
        ))}

        <Pressable
          onPress={onAddExercise}
          style={{
            marginTop: 4,
            paddingVertical: 10,
            alignItems: 'center',
            borderRadius: 10,
            borderWidth: 1,
            borderStyle: 'dashed',
            borderColor: colors.border,
          }}
        >
          <Text
            style={{
              color: theme.accentLight,
              fontFamily: fontFamilies.body600,
              fontSize: 12,
            }}
          >
            {t('pe.addExercise')}
          </Text>
        </Pressable>
      </View>
    </Card>
  );
}

function AddDayModal({
  visible,
  onClose,
  onAdd,
  busy,
}: {
  visible: boolean;
  onClose: () => void;
  onAdd: (title: string, weekday: number | null) => void;
  busy: boolean;
}) {
  const theme = useTheme();
  const [title, setTitle] = useState('');
  const [wd, setWd] = useState<number | null>(null);

  useEffect(() => {
    if (visible) {
      setTitle('');
      setWd(null);
    }
  }, [visible]);

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
          backgroundColor: 'rgba(0,0,0,0.7)',
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
            paddingBottom: 32,
            gap: 14,
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
              {t('pe.newDay')}
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>
          <Field label={t('common.name')}>
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={t('pe.dayNamePh')}
              placeholderTextColor={colors.textMuted}
              style={inputStyle}
              maxLength={60}
            />
          </Field>
          <Field label={t('pe.weekdayOptional')}>
            <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
              <Pressable
                onPress={() => setWd(null)}
                style={[
                  chipStyle,
                  wd === null && {
                    borderColor: theme.borderNeon,
                    backgroundColor: 'rgba(157,107,255,0.18)',
                  },
                ]}
              >
                <Text
                  style={{
                    color: wd === null ? theme.accentLight : colors.textMuted,
                    fontFamily: fontFamilies.body600,
                    fontSize: 11,
                  }}
                >
                  —
                </Text>
              </Pressable>
              {weekLabels().map((l, i) => {
                const active = wd === i;
                return (
                  <Pressable
                    key={l}
                    onPress={() => setWd(i)}
                    style={[
                      chipStyle,
                      active && {
                        borderColor: theme.borderNeon,
                        backgroundColor: 'rgba(157,107,255,0.18)',
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: active
                          ? theme.accentLight
                          : colors.textSecondary,
                        fontFamily: fontFamilies.body600,
                        fontSize: 11,
                      }}
                    >
                      {l}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>
          <GradientButton
            title={t('common.add')}
            onPress={() => {
              const trimmed = title.trim();
              if (!trimmed) {
                Alert.alert(t('common.nameRequired'));
                return;
              }
              onAdd(trimmed, wd);
            }}
            disabled={busy}
          />
        </View>
      </View>
    </Modal>
  );
}

function PickExerciseModal({
  visible,
  onClose,
  onPick,
}: {
  visible: boolean;
  onClose: () => void;
  onPick: (cat: { id: string; name: string }) => void;
}) {
  const lang = useLang();
  const theme = useTheme();
  const [q, setQ] = useState('');

  useEffect(() => {
    if (visible) setQ('');
  }, [visible]);

  const filtered = useMemo(() => {
    const t = q.trim().toLowerCase();
    if (!t) return exerciseCatalog;
    return exerciseCatalog.filter(
      (e) =>
        e.name.toLowerCase().includes(t) || e.primary.toLowerCase().includes(t),
    );
  }, [q]);

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
          backgroundColor: 'rgba(0,0,0,0.75)',
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
            paddingBottom: 32,
            gap: 12,
            height: '85%',
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
              {t('pe.pickExercise')}
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>
          <TextInput
            value={q}
            onChangeText={setQ}
            placeholder={t('common.search')}
            placeholderTextColor={colors.textMuted}
            style={inputStyle}
          />
          <ScrollView
            contentContainerStyle={{ paddingBottom: 16 }}
            showsVerticalScrollIndicator={false}
          >
            {filtered.map((e) => (
              <Pressable
                key={e.id}
                onPress={() => onPick({ id: e.id, name: e.name })}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 12,
                  paddingHorizontal: 12,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                }}
              >
                <Ionicons
                  name="barbell-outline"
                  size={18}
                  color={theme.accentLight}
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
                <Ionicons
                  name="add-circle"
                  size={20}
                  color={theme.accentLight}
                />
              </Pressable>
            ))}
            {filtered.length === 0 ? (
              <Text
                style={{
                  color: colors.textMuted,
                  textAlign: 'center',
                  paddingVertical: 24,
                }}
              >
                {t('pe.nothingFound')}
              </Text>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function EditExerciseModal({
  exercise,
  onClose,
  onSave,
  busy,
}: {
  exercise: ProgramExercise | null;
  onClose: () => void;
  onSave: (e: ProgramExercise) => void;
  busy: boolean;
}) {
  const theme = useTheme();
  const [draft, setDraft] = useState<ProgramExercise | null>(null);
  const [pickReplace, setPickReplace] = useState(false);

  useEffect(() => {
    setDraft(exercise);
  }, [exercise]);

  if (!draft) return null;

  return (
    <Modal
      visible={!!exercise}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.75)',
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
            paddingBottom: 32,
            gap: 12,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: fontFamilies.heading,
                  fontSize: 20,
                }}
              >
                {draft.exerciseName}
              </Text>
              <Pressable
                onPress={() => setPickReplace(true)}
                style={{
                  marginTop: 4,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 4,
                }}
              >
                <Ionicons
                  name="swap-horizontal"
                  size={12}
                  color={theme.accentLight}
                />
                <Text
                  style={{
                    color: theme.accentLight,
                    fontFamily: fontFamilies.body600,
                    fontSize: 11,
                  }}
                >
                  {t('pe.replaceExercise')}
                </Text>
              </Pressable>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <PickExerciseModal
            visible={pickReplace}
            onClose={() => setPickReplace(false)}
            onPick={(cat) => {
              setDraft({
                ...draft,
                exerciseId: cat.id,
                exerciseName: cat.name,
              });
              setPickReplace(false);
            }}
          />

          <View style={{ flexDirection: 'row', gap: 10 }}>
            <NumberField
              label={t('pe.sets')}
              value={draft.sets}
              onChange={(v) => setDraft({ ...draft, sets: clamp(v, 1, 20) })}
            />
            <NumberField
              label={t('pe.repsFrom')}
              value={draft.repsMin}
              onChange={(v) =>
                setDraft({ ...draft, repsMin: clamp(v, 1, 100) })
              }
            />
            <NumberField
              label={t('pe.repsTo')}
              value={draft.repsMax}
              onChange={(v) =>
                setDraft({ ...draft, repsMax: clamp(v, 1, 100) })
              }
            />
          </View>

          <Field label={t('pe.restLabel')}>
            <View style={{ flexDirection: 'row', gap: 8 }}>
              {[45, 60, 90, 120, 180].map((s) => {
                const active = draft.restSeconds === s;
                return (
                  <Pressable
                    key={s}
                    onPress={() => setDraft({ ...draft, restSeconds: s })}
                    style={[
                      chipStyle,
                      { flex: 1, paddingVertical: 10 },
                      active && {
                        borderColor: theme.borderNeon,
                        backgroundColor: 'rgba(157,107,255,0.18)',
                      },
                    ]}
                  >
                    <Text
                      style={{
                        color: active
                          ? theme.accentLight
                          : colors.textSecondary,
                        fontFamily: fontFamilies.body600,
                        fontSize: 12,
                      }}
                    >
                      {s}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </Field>

          <Field label={t('pe.noteOptional')}>
            <TextInput
              value={draft.notes ?? ''}
              onChangeText={(v) => setDraft({ ...draft, notes: v })}
              placeholder={t('pe.notePh')}
              placeholderTextColor={colors.textMuted}
              style={[
                inputStyle,
                { height: 64, paddingTop: 12, textAlignVertical: 'top' },
              ]}
              multiline
              maxLength={300}
            />
          </Field>

          <View style={{ flexDirection: 'row', gap: 10, marginTop: 4 }}>
            <Pressable
              onPress={onClose}
              style={{
                flex: 1,
                paddingVertical: 14,
                alignItems: 'center',
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text
                style={{
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body600,
                }}
              >
                {t('common.cancel')}
              </Text>
            </Pressable>
            <View style={{ flex: 1 }}>
              <GradientButton
                title={t('common.save')}
                disabled={busy}
                onPress={() => {
                  if (draft.repsMin > draft.repsMax) {
                    Alert.alert(
                      t('progEdit.repsRangeTitle'),
                      t('progEdit.repsRangeMsg'),
                    );
                    return;
                  }
                  onSave(draft);
                }}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
}

function NumberField({
  label,
  value,
  onChange,
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          color: colors.textMuted,
          fontFamily: fontFamilies.body500,
          fontSize: 11,
          letterSpacing: 1,
          marginBottom: 6,
        }}
      >
        {label.toUpperCase()}
      </Text>
      <TextInput
        value={String(value)}
        onChangeText={(t) => {
          const n = parseInt(t.replace(/\D+/g, ''), 10);
          onChange(Number.isFinite(n) ? n : 0);
        }}
        keyboardType="number-pad"
        style={[inputStyle, { textAlign: 'center' }]}
      />
    </View>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <View>
      <Text
        style={{
          color: colors.textMuted,
          fontFamily: fontFamilies.body500,
          fontSize: 11,
          letterSpacing: 1,
          marginBottom: 6,
        }}
      >
        {label.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

function clamp(v: number, lo: number, hi: number) {
  return Math.max(lo, Math.min(hi, v));
}

const inputStyle = {
  color: colors.text,
  fontFamily: fontFamilies.body600,
  fontSize: 15,
  height: 50,
  borderRadius: radii.md,
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: colors.bgSecondary,
  paddingHorizontal: 14,
} as const;

const chipStyle = {
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: colors.bgSecondary,
  alignItems: 'center',
  justifyContent: 'center',
} as const;
