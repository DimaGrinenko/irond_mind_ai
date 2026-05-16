import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { colors } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { useActiveWorkoutStore } from '../store/activeWorkoutStore';
import { useProgressStore } from '../store/progressStore';
import { exercises } from '../data/exercises';
import { Confetti } from '../components/anim/Confetti';
import { RestTimer } from '../components/workout/RestTimer';
import { LevelUpOverlay } from '../components/workout/LevelUpOverlay';

function formatHms(ms: number) {
  const s = Math.floor(ms / 1000);
  const hh = String(Math.floor(s / 3600)).padStart(2, '0');
  const mm = String(Math.floor((s % 3600) / 60)).padStart(2, '0');
  const ss = String(s % 60).padStart(2, '0');
  return `${hh}:${mm}:${ss}`;
}

export function WorkoutScreen({ navigation }: any) {
  const title = useActiveWorkoutStore((s) => s.title);
  const workout = useActiveWorkoutStore((s) => s.workout);
  const list = useActiveWorkoutStore((s) => s.exercises);
  const startedAt = useActiveWorkoutStore((s) => s.startedAt);
  const persistAll = useActiveWorkoutStore((s) => s.persistAll);
  const finish = useActiveWorkoutStore((s) => s.finish);
  const updateSet = useActiveWorkoutStore((s) => s.updateSet);
  const toggleSetDone = useActiveWorkoutStore((s) => s.toggleSetDone);
  const addSet = useActiveWorkoutStore((s) => s.addSet);

  const awardWorkout = useProgressStore((s) => s.awardWorkout);

  const insets = useSafeAreaInsets();
  const [now, setNow] = useState(Date.now());
  useEffect(() => {
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);

  const [confettiKey, setConfettiKey] = useState(0);
  const [restKey, setRestKey] = useState(0);
  const [awardResult, setAwardResult] = useState<ReturnType<typeof awardWorkout> | null>(null);
  const [finishing, setFinishing] = useState(false);
  const finishTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Отметка подхода как выполненного запускает таймер отдыха.
  const handleToggleSet = (exerciseId: string, setNumber: number, wasDone: boolean) => {
    toggleSetDone(exerciseId, setNumber);
    if (!wasDone) setRestKey((k) => k + 1);
  };

  useEffect(
    () => () => {
      if (finishTimer.current) clearTimeout(finishTimer.current);
    },
    [],
  );

  const handleFinish = async () => {
    if (finishing || !workout) return;
    setFinishing(true);
    setConfettiKey(Date.now());
    try {
      await persistAll();
    } catch (e) {
      setFinishing(false);
      console.error('Не удалось сохранить тренировку:', e);
      return;
    }
    // Начисляем XP/стрик и показываем праздничный оверлей
    setAwardResult(awardWorkout());
    // Пауза, чтобы конфетти и оверлей уровня были видны до ухода с экрана
    finishTimer.current = setTimeout(async () => {
      try {
        await finish();
      } catch (e) {
        console.error('Не удалось завершить тренировку:', e);
      }
      navigation.goBack();
    }, 2400);
  };

  const duration = startedAt ? formatHms(now - startedAt) : '00:00:00';

  const exerciseCount = list.length;

  const items = useMemo(
    () =>
      list.map((x) => ({
        ...x,
        meta: exercises.find((e) => e.id === x.exerciseId),
      })),
    [list],
  );

  if (!workout) {
    return (
      <View style={{ flex: 1, backgroundColor: colors.bg }}>
        <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            onPress={() => navigation.goBack()}
            accessibilityRole="button"
            accessibilityLabel="Назад"
            hitSlop={12}
            style={{ paddingVertical: 8, paddingRight: 10 }}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
          <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 18 }}>Тренировка</Text>
        </View>
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', padding: 24, gap: 12 }}>
          <Ionicons name="barbell-outline" size={48} color={colors.textMuted} />
          <Text
            style={{
              color: colors.textSecondary,
              fontFamily: fontFamilies.body600,
              fontSize: 14,
              textAlign: 'center',
            }}
          >
            Активная тренировка не запущена.{'\n'}Начни тренировку с главного экрана.
          </Text>
        </View>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
        <Pressable
          onPress={() => navigation.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Назад"
          hitSlop={12}
          style={{ paddingVertical: 8, paddingRight: 10 }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </Pressable>
        <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 18 }}>Тренировка</Text>
        <View style={{ flex: 1 }} />
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
            <Ionicons name="time-outline" size={16} color={colors.purpleLight} />
            <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>{duration}</Text>
          </View>
          <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body600, fontSize: 12 }}>
            {exerciseCount} упражнений
          </Text>
        </View>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 6 }}>
        <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>{title}</Text>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, marginTop: 12, gap: 12 }}>
          {items.map((x) => (
            <Card key={x.exerciseId} variant="secondary" style={{ padding: 0, overflow: 'hidden' }}>
              <LinearGradient colors={['rgba(21,21,31,0.85)', 'rgba(0,0,0,0.95)']} style={{ padding: 12 }}>
                <View style={{ flexDirection: 'row', gap: 12, alignItems: 'center' }}>
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 18,
                      backgroundColor: 'rgba(123,63,228,0.12)',
                      borderWidth: 1,
                      borderColor: 'rgba(42,42,62,0.9)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="barbell" size={22} color={colors.purpleLight} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>
                      {x.meta?.name ?? x.exerciseId}
                    </Text>
                    <Text style={{ marginTop: 4, color: colors.textMuted, fontFamily: fontFamilies.body600, fontSize: 12 }}>
                      {x.sets.length} подхода
                    </Text>
                  </View>
                  <Pressable
                    onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: x.exerciseId })}
                    style={{
                      width: 34,
                      height: 34,
                      borderRadius: 17,
                      backgroundColor: 'rgba(123,63,228,0.12)',
                      borderWidth: 1,
                      borderColor: 'rgba(123,63,228,0.35)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="chevron-forward" size={18} color={colors.purpleLight} />
                  </Pressable>
                </View>

                <View style={{ marginTop: 12, gap: 10 }}>
                  {x.sets.map((s) => (
                    <View
                      key={`${x.exerciseId}-${s.setNumber}`}
                      style={{
                        flexDirection: 'row',
                        alignItems: 'center',
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: 'rgba(42,42,62,0.9)',
                        backgroundColor: 'rgba(15,15,26,0.55)',
                        paddingVertical: 10,
                        paddingHorizontal: 12,
                        gap: 10,
                      }}
                    >
                      <Text style={{ width: 22, color: colors.textSecondary, fontFamily: fontFamilies.body700 }}>
                        {s.setNumber}
                      </Text>
                      <View style={{ flex: 1, flexDirection: 'row', gap: 10 }}>
                        <TextInput
                          value={s.weight}
                          onChangeText={(v) => updateSet(x.exerciseId, s.setNumber, { weight: v })}
                          placeholder="кг"
                          placeholderTextColor={colors.textMuted}
                          keyboardType="numeric"
                          style={{
                            flex: 1,
                            height: 34,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: 'rgba(42,42,62,0.9)',
                            paddingHorizontal: 10,
                            color: colors.text,
                            fontFamily: fontFamilies.body600,
                            backgroundColor: 'rgba(0,0,0,0.18)',
                          }}
                        />
                        <TextInput
                          value={s.reps}
                          onChangeText={(v) => updateSet(x.exerciseId, s.setNumber, { reps: v })}
                          placeholder="повт"
                          placeholderTextColor={colors.textMuted}
                          keyboardType="numeric"
                          style={{
                            flex: 1,
                            height: 34,
                            borderRadius: 12,
                            borderWidth: 1,
                            borderColor: 'rgba(42,42,62,0.9)',
                            paddingHorizontal: 10,
                            color: colors.text,
                            fontFamily: fontFamilies.body600,
                            backgroundColor: 'rgba(0,0,0,0.18)',
                          }}
                        />
                      </View>
                      <Pressable
                        onPress={() => handleToggleSet(x.exerciseId, s.setNumber, s.done)}
                        accessibilityRole="checkbox"
                        accessibilityState={{ checked: s.done }}
                        accessibilityLabel={`Подход ${s.setNumber}`}
                        hitSlop={10}
                        style={{ paddingLeft: 2 }}
                      >
                        <Ionicons
                          name={s.done ? 'checkmark-circle' : 'ellipse-outline'}
                          size={20}
                          color={s.done ? colors.green : 'rgba(255,255,255,0.22)'}
                        />
                      </Pressable>
                    </View>
                  ))}

                  <Pressable
                    onPress={() => addSet(x.exerciseId)}
                    style={{
                      alignSelf: 'flex-start',
                      marginTop: 2,
                      paddingHorizontal: 12,
                      paddingVertical: 10,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: 'rgba(42,42,62,0.9)',
                      backgroundColor: 'rgba(15,15,26,0.45)',
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 8,
                    }}
                  >
                    <Ionicons name="add" size={18} color={colors.purpleLight} />
                    <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body700, fontSize: 12 }}>
                      Добавить подход
                    </Text>
                  </Pressable>
                </View>
              </LinearGradient>
            </Card>
          ))}
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', left: 16, right: 16, bottom: Math.max(insets.bottom, 12) + 6, gap: 10 }}>
        <RestTimer triggerKey={restKey} />
        <GradientButton
          title={finishing ? 'Сохраняем…' : 'Завершить тренировку'}
          disabled={finishing}
          onPress={handleFinish}
        />
      </View>

      <Confetti triggerKey={confettiKey} />
      <LevelUpOverlay result={awardResult} />
    </View>
  );
}

