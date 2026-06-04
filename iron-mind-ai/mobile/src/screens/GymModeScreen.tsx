/**
 * Gym mode — режим «один в зале», одно упражнение на экране.
 * Большие кнопки, авто-rest overlay, кнопка «Следующее упражнение».
 * Поддерживает: голосовой ввод (web), замену упражнения, заметки, подсказку «было прошлый раз».
 */
import React, { useEffect, useMemo, useRef, useState } from 'react';
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
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { CyclePhaseBanner } from '../components/common/CyclePhaseBanner';
import { RestOverlay } from '../components/workout/RestOverlay';
import { ExercisePickerModal } from '../components/workout/ExercisePickerModal';
import { WorkoutSummaryModal } from '../components/workout/WorkoutSummaryModal';
import { Confetti } from '../components/anim/Confetti';
import { colors, neonGlow, neonTextShadow, radii } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { fontFamilies } from '../theme/typography';
import {
  useActiveWorkoutStore,
  type WorkoutSummary,
} from '../store/activeWorkoutStore';
import { useExerciseNotesStore } from '../store/exerciseNotesStore';
import { useVoiceInput, parseCommand } from '../hooks/useVoiceInput';
import { exercises as catalog } from '../data/exercises';
import { exerciseDisplayName } from '../utils/exerciseDisplayName';
import { t, useLang } from '../i18n';

function fmtTimer(ms: number): string {
  const s = Math.floor(ms / 1000);
  const mm = String(Math.floor(s / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${mm}:${ss}`;
}

export function GymModeScreen() {
  useLang();
  const theme = useTheme();
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const list = useActiveWorkoutStore((s) => s.exercises);
  const title = useActiveWorkoutStore((s) => s.title);
  const startedAt = useActiveWorkoutStore((s) => s.startedAt);
  const workout = useActiveWorkoutStore((s) => s.workout);
  const updateSet = useActiveWorkoutStore((s) => s.updateSet);
  const toggleSetDone = useActiveWorkoutStore((s) => s.toggleSetDone);
  const addSet = useActiveWorkoutStore((s) => s.addSet);
  const replaceExercise = useActiveWorkoutStore((s) => s.replaceExercise);
  const finish = useActiveWorkoutStore((s) => s.finish);

  const notesFor = useExerciseNotesStore((s) => s.notesFor);
  const addNote = useExerciseNotesStore((s) => s.addNote);
  const removeNote = useExerciseNotesStore((s) => s.removeNote);

  const [idx, setIdx] = useState(0);
  const [restKey, setRestKey] = useState(0);
  const [now, setNow] = useState(Date.now());
  const [finishing, setFinishing] = useState(false);
  const [summary, setSummary] = useState<WorkoutSummary | null>(null);
  const [summaryVisible, setSummaryVisible] = useState(false);
  const [confetti, setConfetti] = useState(0);
  const [pickerVisible, setPickerVisible] = useState(false);
  const [notesVisible, setNotesVisible] = useState(false);
  const [noteDraft, setNoteDraft] = useState('');
  const [voiceTargetSet, setVoiceTargetSet] = useState<number | null>(null);
  const [handsFree, setHandsFree] = useState(false);
  const [lastCommand, setLastCommand] = useState<string | null>(null);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(
    () => () => {
      if (finishTimer.current) clearTimeout(finishTimer.current);
    },
    [],
  );

  const current = list[idx];

  const {
    listening,
    supported: voiceSupported,
    start: voiceStart,
    stop: voiceStop,
  } = useVoiceInput(
    (parsed, raw) => {
      if (handsFree) {
        const cmd = parseCommand(raw);
        setLastCommand(raw);
        if (!cmd) return;
        if (cmd.kind === 'next') {
          if (idx < list.length - 1) setIdx((i) => i + 1);
        } else if (cmd.kind === 'prev') {
          if (idx > 0) setIdx((i) => i - 1);
        } else if (cmd.kind === 'done' && current) {
          const undone = current.sets.find((s) => !s.done);
          if (undone) {
            toggleSetDone(current.exerciseId, undone.setNumber);
            setRestKey((k) => k + 1);
          }
        } else if (cmd.kind === 'add_set' && current) {
          addSet(current.exerciseId);
        } else if (
          (cmd.kind === 'plus_kg' || cmd.kind === 'minus_kg') &&
          current
        ) {
          const target =
            current.sets.find((s) => !s.done) ??
            current.sets[current.sets.length - 1];
          if (target) {
            const cur = Number(target.weight.replace(',', '.')) || 0;
            const next =
              cmd.kind === 'plus_kg' ? cur + cmd.kg : Math.max(0, cur - cmd.kg);
            updateSet(current.exerciseId, target.setNumber, {
              weight: String(next),
            });
          }
        } else if (cmd.kind === 'finish') {
          handleFinish();
        }
        return;
      }
      if (!current || voiceTargetSet == null) return;
      const patch: { weight?: string; reps?: string } = {};
      if (parsed.weight !== undefined) patch.weight = String(parsed.weight);
      if (parsed.reps !== undefined) patch.reps = String(parsed.reps);
      if (Object.keys(patch).length) {
        updateSet(current.exerciseId, voiceTargetSet, patch);
      }
      setVoiceTargetSet(null);
    },
    { continuous: handsFree },
  );

  if (!workout || list.length === 0) {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: colors.bg,
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <Ionicons name="barbell-outline" size={48} color={colors.textMuted} />
        <Text
          style={{
            marginTop: 12,
            color: colors.textSecondary,
            fontFamily: fontFamilies.body600,
            fontSize: 14,
            textAlign: 'center',
          }}
        >
          {t('workout.notActive')}
          {'\n'}
          {t('workout.startFromHome')}
        </Text>
        <Pressable
          onPress={() => nav.goBack()}
          style={{
            marginTop: 16,
            paddingVertical: 10,
            paddingHorizontal: 18,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.border,
          }}
        >
          <Text
            style={{ color: colors.text, fontFamily: fontFamilies.body700 }}
          >
            {t('common.back')}
          </Text>
        </Pressable>
      </View>
    );
  }

  if (!current) return null;

  const meta = catalog.find((e) => e.id === current.exerciseId);
  const exerciseName = exerciseDisplayName(
    current.exerciseId,
    meta?.name,
  );
  const isLast = idx === list.length - 1;
  const allSetsDone = current.sets.every((s) => s.done);
  const exerciseNotes = notesFor(current.exerciseId);

  const duration = startedAt ? fmtTimer(now - startedAt) : '00:00';

  const onSetToggle = (setNumber: number, wasDone: boolean) => {
    toggleSetDone(current.exerciseId, setNumber);
    if (!wasDone) {
      setRestKey((k) => k + 1);
    }
  };

  const goNext = () => {
    if (!isLast) setIdx((i) => i + 1);
  };
  const goPrev = () => {
    if (idx > 0) setIdx((i) => i - 1);
  };

  const handleFinish = async () => {
    if (finishing) return;
    setFinishing(true);
    setConfetti(Date.now());
    try {
      const result = await finish();
      if (result) {
        setSummary(result);
        setSummaryVisible(true);
      }
    } catch (e) {
      console.error('finish failed:', e);
    } finally {
      setFinishing(false);
    }
  };

  const handleVoiceTap = (setNumber: number) => {
    if (!voiceSupported) {
      Alert.alert(t('gym.voice'), t('gym.voiceOnlyWeb'));
      return;
    }
    if (listening) {
      voiceStop();
      setVoiceTargetSet(null);
      return;
    }
    setVoiceTargetSet(setNumber);
    voiceStart();
  };

  const lastWorkoutSets = current.history?.lastWorkoutSets ?? [];

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient
        colors={['rgba(157,107,255,0.18)', 'rgba(0,0,0,0)']}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 320 }}
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
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.text,
              fontFamily: fontFamilies.body700,
              fontSize: 16,
            }}
          >
            {title}
          </Text>
          <Text
            style={{
              color: colors.textMuted,
              fontFamily: fontFamilies.body,
              fontSize: 11,
              marginTop: 2,
            }}
          >
            {idx + 1}/{list.length} · {duration}
            {handsFree && lastCommand ? (
              <Text>
                {' · '}
                <Ionicons name="mic" size={11} color={colors.textMuted} />{' '}
                {lastCommand}
              </Text>
            ) : (
              ''
            )}
          </Text>
        </View>
        {voiceSupported ? (
          <Pressable
            onPress={() => {
              if (handsFree) {
                setHandsFree(false);
                voiceStop();
              } else {
                setHandsFree(true);
                setTimeout(() => voiceStart(), 50);
              }
            }}
            hitSlop={10}
            style={{
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: handsFree ? colors.pink : colors.border,
              backgroundColor: handsFree
                ? 'rgba(255,77,210,0.22)'
                : colors.bgSecondary,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 4,
            }}
          >
            <Ionicons
              name={handsFree ? 'mic' : 'mic-off-outline'}
              size={14}
              color={handsFree ? colors.pink : colors.textSecondary}
            />
            <Text
              style={{
                color: handsFree ? colors.pink : colors.textSecondary,
                fontFamily: fontFamilies.body700,
                fontSize: 10,
              }}
            >
              {handsFree ? 'Hands-free' : t('gym.voice')}
            </Text>
          </Pressable>
        ) : null}
      </View>

      {/* Big progress bar of exercises */}
      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 12,
          flexDirection: 'row',
          gap: 4,
        }}
      >
        {list.map((_, i) => (
          <View
            key={i}
            style={{
              flex: 1,
              height: 4,
              borderRadius: 2,
              backgroundColor:
                i < idx
                  ? colors.green
                  : i === idx
                    ? theme.accentLight
                    : 'rgba(255,255,255,0.08)',
            }}
          />
        ))}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 220 }}
        showsVerticalScrollIndicator={false}
      >
        <CyclePhaseBanner context="training" />
        <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <LinearGradient
              colors={['rgba(157,107,255,0.22)', 'rgba(0,0,0,0)']}
              style={{ padding: 18 }}
            >
              <View
                style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}
              >
                <Text
                  style={[
                    {
                      flex: 1,
                      color: colors.text,
                      fontFamily: fontFamilies.heading,
                      fontSize: 22,
                      lineHeight: 26,
                    },
                    neonTextShadow(theme.accentLight, 12),
                  ]}
                >
                  {exerciseName}
                </Text>
                <Pressable
                  onPress={() => setPickerVisible(true)}
                  hitSlop={10}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.borderNeon,
                    backgroundColor: 'rgba(157,107,255,0.16)',
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Ionicons
                    name="swap-horizontal"
                    size={14}
                    color={theme.accentLight}
                  />
                  <Text
                    style={{
                      color: theme.accentLight,
                      fontFamily: fontFamilies.body700,
                      fontSize: 11,
                    }}
                  >
                    {t('gym.replace')}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => {
                    setNoteDraft('');
                    setNotesVisible(true);
                  }}
                  hitSlop={10}
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 8,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor:
                      exerciseNotes.length > 0 ? colors.amber : colors.border,
                    backgroundColor:
                      exerciseNotes.length > 0
                        ? 'rgba(255,181,71,0.12)'
                        : colors.bgSecondary,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 4,
                  }}
                >
                  <Ionicons
                    name="document-text-outline"
                    size={14}
                    color={
                      exerciseNotes.length > 0
                        ? colors.amber
                        : colors.textSecondary
                    }
                  />
                  <Text
                    style={{
                      color:
                        exerciseNotes.length > 0
                          ? colors.amber
                          : colors.textSecondary,
                      fontFamily: fontFamilies.body700,
                      fontSize: 11,
                    }}
                  >
                    {exerciseNotes.length > 0 ? exerciseNotes.length : '·'}
                  </Text>
                </Pressable>
              </View>
              <Text
                style={{
                  marginTop: 6,
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body,
                  fontSize: 12,
                }}
              >
                {meta?.primary ?? ''} · {t('workout.rest')}{' '}
                {current.restSeconds} {t('common.seconds')}
              </Text>

              {current.history?.maxWeight ? (
                <View
                  style={{
                    marginTop: 12,
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 12,
                    backgroundColor: 'rgba(255,181,71,0.14)',
                    borderWidth: 1,
                    borderColor: colors.amber,
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 6,
                  }}
                >
                  <Ionicons name="trophy" size={14} color={colors.amber} />
                  <Text
                    style={{
                      color: colors.amber,
                      fontFamily: fontFamilies.body700,
                      fontSize: 12,
                    }}
                  >
                    PR: {current.history.maxWeight} {t('common.kg')}
                  </Text>
                </View>
              ) : (
                <Text
                  style={{
                    marginTop: 12,
                    color: colors.textMuted,
                    fontFamily: fontFamilies.body,
                    fontSize: 11,
                  }}
                >
                  {t('workout.firstTime')}
                </Text>
              )}

              {exerciseNotes.length > 0 ? (
                <View
                  style={{
                    marginTop: 10,
                    padding: 10,
                    borderRadius: 10,
                    backgroundColor: 'rgba(255,181,71,0.08)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,181,71,0.35)',
                  }}
                >
                  <Text
                    style={{
                      color: colors.amber,
                      fontSize: 10,
                      fontFamily: fontFamilies.body700,
                      marginBottom: 4,
                    }}
                  >
                    📝 {t('gym.notes')}
                  </Text>
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: fontFamilies.body,
                      fontSize: 12,
                    }}
                  >
                    {exerciseNotes[0].text}
                  </Text>
                </View>
              ) : null}
            </LinearGradient>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 14, gap: 10 }}>
          {current.sets.map((s) => {
            const setWeight = Number(s.weight.replace(',', '.'));
            const isPR =
              s.done &&
              Number.isFinite(setWeight) &&
              current.history?.maxWeight != null &&
              setWeight > current.history.maxWeight;
            const lastSet = lastWorkoutSets.find(
              (ls) => ls.setNumber === s.setNumber,
            );
            return (
              <View
                key={`${current.exerciseId}-${s.setNumber}`}
                style={{
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: isPR
                    ? colors.amber
                    : s.done
                      ? colors.green
                      : 'rgba(42,42,62,0.9)',
                  backgroundColor: s.done
                    ? 'rgba(63,255,150,0.08)'
                    : 'rgba(15,15,26,0.55)',
                  paddingVertical: 12,
                  paddingHorizontal: 14,
                  gap: 6,
                  ...(s.done ? neonGlow(colors.green, 0.3, 10, 3) : {}),
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: 'rgba(157,107,255,0.18)',
                      borderWidth: 1,
                      borderColor: theme.borderNeon,
                    }}
                  >
                    <Text
                      style={{
                        color: theme.accentLight,
                        fontFamily: fontFamilies.body700,
                        fontSize: 14,
                      }}
                    >
                      {s.setNumber}
                    </Text>
                  </View>
                  <View style={{ flex: 1, flexDirection: 'row', gap: 8 }}>
                    <TextInput
                      value={s.weight}
                      onChangeText={(v) =>
                        updateSet(current.exerciseId, s.setNumber, {
                          weight: v,
                        })
                      }
                      placeholder={t('common.kg')}
                      placeholderTextColor={colors.textMuted}
                      keyboardType="numeric"
                      style={inputBigStyle}
                    />
                    <Text
                      style={{
                        color: colors.textMuted,
                        alignSelf: 'center',
                        fontFamily: fontFamilies.body700,
                      }}
                    >
                      ×
                    </Text>
                    <TextInput
                      value={s.reps}
                      onChangeText={(v) =>
                        updateSet(current.exerciseId, s.setNumber, { reps: v })
                      }
                      placeholder={t('common.reps')}
                      placeholderTextColor={colors.textMuted}
                      keyboardType="numeric"
                      style={inputBigStyle}
                    />
                  </View>
                  {isPR ? (
                    <View
                      style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 8,
                        backgroundColor: 'rgba(255,181,71,0.18)',
                        borderWidth: 1,
                        borderColor: colors.amber,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.amber,
                          fontFamily: fontFamilies.body700,
                          fontSize: 10,
                        }}
                      >
                        PR!
                      </Text>
                    </View>
                  ) : null}
                  {voiceSupported ? (
                    <Pressable
                      onPress={() => handleVoiceTap(s.setNumber)}
                      hitSlop={8}
                      style={{
                        width: 36,
                        height: 36,
                        borderRadius: 12,
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor:
                          listening && voiceTargetSet === s.setNumber
                            ? 'rgba(255,77,210,0.22)'
                            : 'rgba(255,255,255,0.04)',
                        borderWidth: 1,
                        borderColor:
                          listening && voiceTargetSet === s.setNumber
                            ? colors.pink
                            : 'rgba(255,255,255,0.14)',
                      }}
                    >
                      <Ionicons
                        name={
                          listening && voiceTargetSet === s.setNumber
                            ? 'mic'
                            : 'mic-outline'
                        }
                        size={16}
                        color={
                          listening && voiceTargetSet === s.setNumber
                            ? colors.pink
                            : colors.textSecondary
                        }
                      />
                    </Pressable>
                  ) : null}
                  <Pressable
                    onPress={() => onSetToggle(s.setNumber, s.done)}
                    hitSlop={10}
                    style={{
                      width: 44,
                      height: 44,
                      borderRadius: 14,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: s.done
                        ? 'rgba(63,255,150,0.18)'
                        : 'rgba(255,255,255,0.05)',
                      borderWidth: 1,
                      borderColor: s.done ? colors.green : colors.border,
                    }}
                  >
                    <Ionicons
                      name={s.done ? 'checkmark-circle' : 'ellipse-outline'}
                      size={26}
                      color={s.done ? colors.green : 'rgba(255,255,255,0.4)'}
                    />
                  </Pressable>
                </View>
                {/* Подсказка «было прошлый раз» */}
                {lastSet && lastSet.weight != null && lastSet.reps != null ? (
                  <Text
                    style={{
                      marginLeft: 46,
                      color: colors.textMuted,
                      fontFamily: fontFamilies.body,
                      fontSize: 10,
                    }}
                  >
                    {t('gym.wasLast', {
                      weight: lastSet.weight,
                      reps: lastSet.reps,
                    })}
                  </Text>
                ) : null}
              </View>
            );
          })}

          <Pressable
            onPress={() => addSet(current.exerciseId)}
            style={{
              alignSelf: 'flex-start',
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderStyle: 'dashed',
              borderColor: colors.border,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <Ionicons name="add" size={16} color={theme.accentLight} />
            <Text
              style={{
                color: theme.accentLight,
                fontFamily: fontFamilies.body700,
                fontSize: 12,
              }}
            >
              {t('workout.addSet')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: Math.max(insets.bottom, 12) + 6,
          gap: 10,
        }}
      >
        <View style={{ flexDirection: 'row', gap: 10 }}>
          {idx > 0 ? (
            <Pressable
              onPress={goPrev}
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
            {isLast ? (
              <GradientButton
                title={finishing ? t('workout.saving') : t('workout.finish')}
                onPress={handleFinish}
                disabled={finishing}
                rightIcon={
                  <Ionicons
                    name="checkmark-circle"
                    size={18}
                    color={colors.text}
                  />
                }
              />
            ) : (
              <GradientButton
                title={
                  allSetsDone
                    ? t('gym.nextExercise', { n: idx + 2, total: list.length })
                    : t('gym.next', { n: idx + 2, total: list.length })
                }
                onPress={goNext}
                rightIcon={
                  <Ionicons
                    name="arrow-forward"
                    size={18}
                    color={colors.text}
                  />
                }
              />
            )}
          </View>
        </View>
      </View>

      <RestOverlay triggerKey={restKey} seconds={current.restSeconds} />

      <Confetti triggerKey={confetti} />

      <ExercisePickerModal
        visible={pickerVisible}
        preferGroup={meta?.primary}
        excludeIds={list.map((e) => e.exerciseId)}
        onClose={() => setPickerVisible(false)}
        onPick={async (ex) => {
          await replaceExercise(idx, ex.id);
        }}
      />

      <WorkoutSummaryModal
        visible={summaryVisible}
        summary={summary}
        onClose={() => {
          setSummaryVisible(false);
          nav.goBack();
        }}
      />

      <Modal
        visible={notesVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNotesVisible(false)}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.85)',
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
              maxHeight: '92%',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  color: colors.text,
                  fontFamily: fontFamilies.heading,
                  fontSize: 20,
                }}
              >
                {t('gym.notesTitle')} · {exerciseName}
              </Text>
              <Pressable onPress={() => setNotesVisible(false)} hitSlop={12}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </Pressable>
            </View>
            <TextInput
              value={noteDraft}
              onChangeText={setNoteDraft}
              placeholder={t('gym.notesPh')}
              placeholderTextColor={colors.textMuted}
              multiline
              style={{
                minHeight: 84,
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: colors.border,
                paddingHorizontal: 12,
                paddingVertical: 10,
                color: colors.text,
                fontFamily: fontFamilies.body,
                fontSize: 14,
                backgroundColor: colors.bgSecondary,
                textAlignVertical: 'top',
              }}
            />
            <GradientButton
              title={t('gym.notesSave')}
              onPress={() => {
                if (noteDraft.trim())
                  addNote(current.exerciseId, noteDraft.trim());
                setNoteDraft('');
              }}
              rightIcon={
                <Ionicons name="checkmark" size={18} color={colors.text} />
              }
            />
            <ScrollView style={{ marginTop: 14, maxHeight: 280 }}>
              {exerciseNotes.map((n) => (
                <View
                  key={n.id}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.bgSecondary,
                    marginBottom: 8,
                    flexDirection: 'row',
                    gap: 8,
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontFamily: fontFamilies.body,
                        fontSize: 13,
                      }}
                    >
                      {n.text}
                    </Text>
                    <Text
                      style={{
                        marginTop: 4,
                        color: colors.textMuted,
                        fontFamily: fontFamilies.body,
                        fontSize: 10,
                      }}
                    >
                      {n.date}
                    </Text>
                  </View>
                  <Pressable onPress={() => removeNote(n.id)} hitSlop={8}>
                    <Ionicons
                      name="trash-outline"
                      size={16}
                      color={colors.pink}
                    />
                  </Pressable>
                </View>
              ))}
              {exerciseNotes.length === 0 ? (
                <Text
                  style={{
                    color: colors.textMuted,
                    textAlign: 'center',
                    paddingVertical: 16,
                  }}
                >
                  {t('gym.notesEmpty')}
                </Text>
              ) : null}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const inputBigStyle = {
  flex: 1,
  height: 44,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: 'rgba(42,42,62,0.9)',
  paddingHorizontal: 12,
  color: colors.text,
  fontFamily: fontFamilies.body700,
  fontSize: 18,
  textAlign: 'center' as const,
  backgroundColor: 'rgba(0,0,0,0.25)',
} as const;
