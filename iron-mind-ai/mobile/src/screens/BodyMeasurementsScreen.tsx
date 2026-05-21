import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BodyFigure } from '../components/anatomy/BodyFigure';
import { Card } from '../components/common/Card';
import { FieldRow } from '../components/common/FieldRow';
import { GradientButton } from '../components/common/GradientButton';
import { colors } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { fontFamilies } from '../theme/typography';
import { useMeasurementsStore } from '../store/measurementsStore';
import { useUserStore } from '../store/userStore';
import { useNavigation } from '@react-navigation/native';
import { todayRu } from '../utils/date';
import type { MeasurementsRow } from '../db/measurementsRepo';
import { computeBju } from '../utils/adaptiveBju';
import { t, useLang } from '../i18n';

function toNumOrNull(s: string) {
  const t = s.replace(',', '.').trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

const EMPTY = {
  neck: '',
  shoulders: '',
  chest: '',
  waist: '',
  forearm: '',
  hips: '',
  thigh: '',
  biceps: '',
  calf: '',
  weight: '',
};
type FormState = typeof EMPTY;

export function BodyMeasurementsScreen() {
  useLang();
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const hydrate = useMeasurementsStore((s) => s.hydrate);
  const add = useMeasurementsStore((s) => s.add);
  const remove = useMeasurementsStore((s) => s.remove);
  const rows = useMeasurementsStore((s) => s.rows);

  useEffect(() => {
    hydrate().catch(() => null);
  }, [hydrate]);

  const [form, setForm] = useState<FormState>(EMPTY);
  const [bjuSuggestion, setBjuSuggestion] = useState<ReturnType<
    typeof computeBju
  > | null>(null);
  const userGender = useUserStore((s) => s.gender);
  const userAge = useUserStore((s) => s.age);
  const userHeight = useUserStore((s) => s.heightCm);
  const userActivity = useUserStore((s) => s.activityLevel);
  const userGoalKey = useUserStore((s) => s.goalKey);
  const setWeight = useUserStore((s) => s.setWeight);
  const setNutritionGoals = useUserStore((s) => s.setNutritionGoals);
  const currentCalories = useUserStore((s) => s.dailyCaloriesGoal);

  const canSave = useMemo(() => {
    return Object.values(form).some((v) => toNumOrNull(v) !== null);
  }, [form]);

  const onSubmit = async () => {
    try {
      const newWeight = toNumOrNull(form.weight);
      await add({
        neck: toNumOrNull(form.neck),
        chest: toNumOrNull(form.chest),
        waist: toNumOrNull(form.waist),
        shoulders: toNumOrNull(form.shoulders),
        forearm: toNumOrNull(form.forearm),
        hips: toNumOrNull(form.hips),
        thigh: toNumOrNull(form.thigh),
        biceps: toNumOrNull(form.biceps),
        calf: toNumOrNull(form.calf),
        weight: newWeight,
      });
      setForm(EMPTY);
      await hydrate();
      if (newWeight && newWeight > 0) {
        setWeight(newWeight);
        const suggestion = computeBju({
          gender: userGender,
          age: userAge,
          heightCm: userHeight,
          weightKg: newWeight,
          activity: userActivity,
          goalKey: userGoalKey,
        });
        if (
          suggestion &&
          Math.abs(suggestion.calories - currentCalories) >= 50
        ) {
          setBjuSuggestion(suggestion);
        }
      }
    } catch (e) {
      Alert.alert(t('common.error'), (e as Error).message);
    }
  };

  const applyBju = () => {
    if (!bjuSuggestion) return;
    setNutritionGoals({
      dailyCaloriesGoal: bjuSuggestion.calories,
      dailyProteinGoal: bjuSuggestion.protein,
      dailyFatsGoal: bjuSuggestion.fats,
      dailyCarbsGoal: bjuSuggestion.carbs,
    });
    setBjuSuggestion(null);
  };

  const onDelete = (id: number) => {
    Alert.alert(t('meas.confirmDelete'), t('meas.confirmDeleteBody'), [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: async () => {
          try {
            await remove(id);
          } catch (e) {
            Alert.alert(t('common.error'), (e as Error).message);
          }
        },
      },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
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
          {t('meas.title')}
        </Text>
        <View style={{ flex: 1 }} />
      </View>

      <View
        style={{ paddingHorizontal: 16, marginTop: 10, alignItems: 'center' }}
      >
        <Text
          style={{
            color: colors.textSecondary,
            fontFamily: fontFamilies.body600,
            fontSize: 12,
          }}
        >
          {todayRu()}
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {bjuSuggestion ? (
          <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <Card
              variant="secondary"
              style={{
                padding: 14,
                borderColor: colors.cyan,
                borderWidth: 1,
                backgroundColor: 'rgba(0,229,255,0.08)',
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 8,
                  marginBottom: 6,
                }}
              >
                <Ionicons name="calculator" size={18} color={colors.cyan} />
                <Text
                  style={{
                    color: colors.cyan,
                    fontFamily: fontFamilies.body700,
                    fontSize: 13,
                  }}
                >
                  {t('meas.bjuTitle')}
                </Text>
              </View>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: fontFamilies.body,
                  fontSize: 12,
                  marginBottom: 8,
                }}
              >
                {t('meas.bjuLine', {
                  current: currentCalories,
                  kcal: bjuSuggestion.calories,
                  p: bjuSuggestion.protein,
                  f: bjuSuggestion.fats,
                  c: bjuSuggestion.carbs,
                })}
              </Text>
              <View style={{ flexDirection: 'row', gap: 8 }}>
                <Pressable
                  onPress={applyBju}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.cyan,
                    backgroundColor: 'rgba(0,229,255,0.18)',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: colors.cyan,
                      fontFamily: fontFamilies.body700,
                      fontSize: 12,
                    }}
                  >
                    {t('meas.bjuApply')}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={() => setBjuSuggestion(null)}
                  style={{
                    flex: 1,
                    paddingVertical: 10,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.bgSecondary,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontFamily: fontFamilies.body700,
                      fontSize: 12,
                    }}
                  >
                    {t('meas.bjuLater')}
                  </Text>
                </Pressable>
              </View>
            </Card>
          </View>
        ) : null}
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <LinearGradient
              colors={['rgba(79,31,184,0.18)', 'rgba(0,0,0,0)']}
              style={{ padding: 14 }}
            >
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ width: 110 }}>
                  <FieldRow
                    label={t('meas.neck')}
                    value={form.neck}
                    onChange={(v) => setForm((s) => ({ ...s, neck: v }))}
                    compact
                  />
                  <FieldRow
                    label={t('meas.chest')}
                    value={form.chest}
                    onChange={(v) => setForm((s) => ({ ...s, chest: v }))}
                    compact
                  />
                  <FieldRow
                    label={t('meas.waist')}
                    value={form.waist}
                    onChange={(v) => setForm((s) => ({ ...s, waist: v }))}
                    compact
                  />
                  <FieldRow
                    label={t('meas.shoulders')}
                    value={form.shoulders}
                    onChange={(v) => setForm((s) => ({ ...s, shoulders: v }))}
                    compact
                  />
                  <FieldRow
                    label={t('meas.forearm')}
                    value={form.forearm}
                    onChange={(v) => setForm((s) => ({ ...s, forearm: v }))}
                    compact
                  />
                </View>

                <View
                  style={{
                    flex: 1,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <BodyFigure width={150} height={210} />
                </View>

                <View style={{ width: 110 }}>
                  <FieldRow
                    label={t('meas.hips')}
                    value={form.hips}
                    onChange={(v) => setForm((s) => ({ ...s, hips: v }))}
                    compact
                  />
                  <FieldRow
                    label={t('meas.thigh')}
                    value={form.thigh}
                    onChange={(v) => setForm((s) => ({ ...s, thigh: v }))}
                    compact
                  />
                  <FieldRow
                    label={t('meas.biceps')}
                    value={form.biceps}
                    onChange={(v) => setForm((s) => ({ ...s, biceps: v }))}
                    compact
                  />
                  <FieldRow
                    label={t('meas.calf')}
                    value={form.calf}
                    onChange={(v) => setForm((s) => ({ ...s, calf: v }))}
                    compact
                  />
                  <FieldRow
                    label={t('meas.weight')}
                    value={form.weight}
                    onChange={(v) => setForm((s) => ({ ...s, weight: v }))}
                    suffix={t('common.kg')}
                    compact
                  />
                </View>
              </View>
            </LinearGradient>
          </Card>
        </View>

        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 14,
            flexDirection: 'row',
            gap: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <GradientButton
              title={t('meas.add')}
              disabled={!canSave}
              onPress={onSubmit}
            />
          </View>
          {canSave ? (
            <Pressable
              onPress={() => setForm(EMPTY)}
              style={{
                width: 56,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.bgSecondary,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          ) : null}
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
          <Text
            style={{
              color: colors.textSecondary,
              fontFamily: fontFamilies.body600,
              fontSize: 12,
              letterSpacing: 1,
            }}
          >
            {t('meas.history')} ({rows.length})
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 10, gap: 10 }}>
          {rows.length === 0 ? (
            <Card variant="secondary">
              <Text
                style={{
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body,
                  textAlign: 'center',
                }}
              >
                {t('meas.empty')}
              </Text>
            </Card>
          ) : (
            rows.map((r) => (
              <HistoryItem key={r.id} row={r} onDelete={() => onDelete(r.id)} />
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}

function formatDateRu(iso: string): string {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return iso;
  return d.toLocaleDateString(undefined, {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function HistoryItem({
  row,
  onDelete,
}: {
  row: MeasurementsRow;
  onDelete: () => void;
}) {
  const theme = useTheme();
  const fields: Array<{
    label: string;
    v: number | null | undefined;
    suffix?: string;
  }> = [
    { label: t('meas.weight'), v: row.weight, suffix: t('common.kg') },
    { label: t('meas.chest'), v: row.chest, suffix: t('common.cm') },
    { label: t('meas.waist'), v: row.waist, suffix: t('common.cm') },
    { label: t('meas.biceps'), v: row.biceps, suffix: t('common.cm') },
    { label: t('meas.thigh'), v: row.thigh, suffix: t('common.cm') },
    { label: t('meas.shoulders'), v: row.shoulders, suffix: t('common.cm') },
    { label: t('meas.hips'), v: row.hips, suffix: t('common.cm') },
    { label: t('meas.neck'), v: row.neck, suffix: t('common.cm') },
    { label: t('meas.calf'), v: row.calf, suffix: t('common.cm') },
    { label: t('meas.forearm'), v: row.forearm, suffix: t('common.cm') },
  ].filter((f) => f.v !== null && f.v !== undefined);

  return (
    <Card variant="secondary" style={{ padding: 14 }}>
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}
      >
        <Ionicons
          name="calendar-outline"
          size={14}
          color={theme.accentLight}
          style={{ marginRight: 6 }}
        />
        <Text
          style={{
            flex: 1,
            color: colors.text,
            fontFamily: fontFamilies.body700,
            fontSize: 13,
          }}
        >
          {formatDateRu(row.date)}
        </Text>
        <Pressable
          onPress={onDelete}
          hitSlop={10}
          style={{ paddingHorizontal: 6 }}
        >
          <Ionicons name="trash-outline" size={16} color={colors.pink} />
        </Pressable>
      </View>
      {fields.length === 0 ? (
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: fontFamilies.body,
            fontSize: 12,
          }}
        >
          {t('meas.emptyRow')}
        </Text>
      ) : (
        <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {fields.map((f) => (
            <View
              key={f.label}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: 'rgba(255,255,255,0.03)',
              }}
            >
              <Text
                style={{
                  color: colors.textMuted,
                  fontFamily: fontFamilies.body,
                  fontSize: 10,
                }}
              >
                {f.label}
              </Text>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: fontFamilies.body700,
                  fontSize: 13,
                  marginTop: 2,
                }}
              >
                {f.v} {f.suffix ?? ''}
              </Text>
            </View>
          ))}
        </View>
      )}
    </Card>
  );
}
