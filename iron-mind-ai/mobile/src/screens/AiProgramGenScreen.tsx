/**
 * AI генератор плана на 4 недели. Pro-фича. Сейчас — детерминированный шаблон под цель/уровень,
 * который потом можно отдать в /programs POST через api.programs.create.
 */
import React, { useMemo, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { useUserStore } from '../store/userStore';
import { api } from '../api/client';
import { colors } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

type GenDay = { weekday: number; title: string; exercises: Array<{ slug: string; name: string; sets: number; repsMin: number; repsMax: number; restSeconds: number }> };
type GenProgram = { title: string; subtitle: string; weeks: number; daysPerWeek: number; days: GenDay[] };

function buildTemplates(): Record<string, GenProgram> {
  return {
    mass_beginner: {
      title: t('aiGen.tplMassBeginner'),
      subtitle: t('aiGen.tplMassBeginnerSub'),
      weeks: 4,
      daysPerWeek: 3,
      days: [
        { weekday: 0, title: t('aiGen.dayTitleA'), exercises: [
          { slug: 'bench_press', name: 'Bench Press', sets: 3, repsMin: 6, repsMax: 10, restSeconds: 120 },
          { slug: 'deadlift', name: 'Deadlift', sets: 3, repsMin: 5, repsMax: 8, restSeconds: 180 },
          { slug: 'pull_up', name: 'Pull-ups', sets: 3, repsMin: 6, repsMax: 12, restSeconds: 90 },
          { slug: 'plank', name: 'Plank', sets: 3, repsMin: 30, repsMax: 60, restSeconds: 60 },
        ]},
        { weekday: 2, title: t('aiGen.dayTitleB'), exercises: [
          { slug: 'squat', name: 'Squat', sets: 3, repsMin: 6, repsMax: 10, restSeconds: 150 },
          { slug: 'overhead_press', name: 'Overhead Press', sets: 3, repsMin: 6, repsMax: 10, restSeconds: 120 },
          { slug: 'bent_over_row', name: 'Bent-over Row', sets: 3, repsMin: 6, repsMax: 10, restSeconds: 120 },
        ]},
        { weekday: 4, title: t('aiGen.dayTitleARepeat'), exercises: [
          { slug: 'bench_press', name: 'Bench Press', sets: 3, repsMin: 6, repsMax: 10, restSeconds: 120 },
          { slug: 'romanian_deadlift', name: 'Romanian DL', sets: 3, repsMin: 8, repsMax: 12, restSeconds: 120 },
          { slug: 'lat_pulldown', name: 'Lat Pulldown', sets: 3, repsMin: 8, repsMax: 12, restSeconds: 90 },
        ]},
      ],
    },
    mass_intermediate: {
      title: t('aiGen.tplMassMid'),
      subtitle: t('aiGen.tplMassMidSub'),
      weeks: 4,
      daysPerWeek: 4,
      days: [
        { weekday: 0, title: t('aiGen.upper1'), exercises: [
          { slug: 'bench_press', name: 'Bench Press', sets: 4, repsMin: 6, repsMax: 8, restSeconds: 150 },
          { slug: 'bent_over_row', name: 'Bent-over Row', sets: 4, repsMin: 6, repsMax: 8, restSeconds: 120 },
          { slug: 'overhead_press', name: 'Overhead Press', sets: 3, repsMin: 8, repsMax: 10, restSeconds: 90 },
          { slug: 'barbell_curl', name: 'Barbell Curl', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 60 },
        ]},
        { weekday: 1, title: t('aiGen.lower1'), exercises: [
          { slug: 'squat', name: 'Squat', sets: 4, repsMin: 6, repsMax: 8, restSeconds: 180 },
          { slug: 'romanian_deadlift', name: 'Romanian DL', sets: 4, repsMin: 8, repsMax: 10, restSeconds: 120 },
          { slug: 'leg_press', name: 'Leg Press', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: 'calf_raise', name: 'Calf Raise', sets: 4, repsMin: 12, repsMax: 15, restSeconds: 60 },
        ]},
        { weekday: 3, title: t('aiGen.upper2'), exercises: [
          { slug: 'incline_db_press', name: 'Incline DB Press', sets: 4, repsMin: 8, repsMax: 10, restSeconds: 120 },
          { slug: 'pull_up', name: 'Pull-ups', sets: 4, repsMin: 6, repsMax: 10, restSeconds: 120 },
          { slug: 'lateral_raise', name: 'Lateral Raise', sets: 4, repsMin: 10, repsMax: 15, restSeconds: 60 },
        ]},
        { weekday: 4, title: t('aiGen.lower2'), exercises: [
          { slug: 'deadlift', name: 'Deadlift', sets: 4, repsMin: 5, repsMax: 6, restSeconds: 180 },
          { slug: 'front_squat', name: 'Front Squat', sets: 3, repsMin: 6, repsMax: 8, restSeconds: 150 },
          { slug: 'leg_curl', name: 'Leg Curl', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 60 },
        ]},
      ],
    },
    cut_intermediate: {
      title: t('aiGen.tplCutMid'),
      subtitle: t('aiGen.tplCutMidSub'),
      weeks: 4,
      daysPerWeek: 5,
      days: [
        { weekday: 0, title: t('aiGen.push'), exercises: [
          { slug: 'bench_press', name: 'Bench Press', sets: 4, repsMin: 8, repsMax: 12, restSeconds: 90 },
          { slug: 'overhead_press', name: 'Overhead Press', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 75 },
          { slug: 'tricep_dip', name: 'Dips', sets: 3, repsMin: 10, repsMax: 15, restSeconds: 60 },
        ]},
        { weekday: 1, title: t('aiGen.pull'), exercises: [
          { slug: 'pull_up', name: 'Pull-ups', sets: 4, repsMin: 8, repsMax: 12, restSeconds: 90 },
          { slug: 'bent_over_row', name: 'Bent-over Row', sets: 4, repsMin: 8, repsMax: 12, restSeconds: 90 },
          { slug: 'barbell_curl', name: 'Barbell Curl', sets: 3, repsMin: 10, repsMax: 15, restSeconds: 60 },
        ]},
        { weekday: 2, title: t('aiGen.legs'), exercises: [
          { slug: 'squat', name: 'Squat', sets: 4, repsMin: 8, repsMax: 12, restSeconds: 120 },
          { slug: 'romanian_deadlift', name: 'Romanian DL', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 90 },
          { slug: 'walking_lunge', name: 'Walking Lunge', sets: 3, repsMin: 12, repsMax: 15, restSeconds: 60 },
        ]},
        { weekday: 4, title: t('aiGen.cardioCore'), exercises: [
          { slug: 'cardio_run', name: 'Cardio 30 min', sets: 1, repsMin: 30, repsMax: 30, restSeconds: 0 },
          { slug: 'plank', name: 'Plank', sets: 4, repsMin: 45, repsMax: 60, restSeconds: 30 },
        ]},
        { weekday: 5, title: t('aiGen.fullUpper'), exercises: [
          { slug: 'incline_db_press', name: 'Incline DB Press', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 75 },
          { slug: 'lat_pulldown', name: 'Lat Pulldown', sets: 3, repsMin: 10, repsMax: 12, restSeconds: 75 },
          { slug: 'lateral_raise', name: 'Lateral Raise', sets: 3, repsMin: 12, repsMax: 15, restSeconds: 45 },
        ]},
      ],
    },
  };
}

export function AiProgramGenScreen() {
  useLang();
  const nav = useNavigation<any>();
  const goalKey = useUserStore((s) => s.goalKey);
  const level = useUserStore((s) => s.level);
  const [busy, setBusy] = useState(false);

  const TEMPLATES = useMemo(() => buildTemplates(), []);

  const recommendedKey = useMemo(() => {
    if (goalKey === 'cut') return 'cut_intermediate';
    if (level === 'beginner') return 'mass_beginner';
    return 'mass_intermediate';
  }, [goalKey, level]);

  const template = TEMPLATES[recommendedKey];

  const generate = async () => {
    setBusy(true);
    try {
      // Создаём программу в backend через api.programs.create
      const prog: any = await api.programs.create({
        title: `${template.title} · AI`,
        subtitle: template.subtitle,
        description: 'Сгенерирована Iron Mind AI под твою цель и уровень.',
        weeks: template.weeks,
        daysPerWeek: template.daysPerWeek,
      } as any);
      // Добавляем дни и упражнения
      for (const d of template.days) {
        const day: any = await api.programs.addDay(prog.id, {
          weekday: d.weekday,
          title: d.title,
        } as any);
        for (const ex of d.exercises) {
          await api.programs.addExercise(day.id, {
            exerciseSlug: ex.slug,
            exerciseName: ex.name,
            sets: ex.sets,
            repsMin: ex.repsMin,
            repsMax: ex.repsMax,
            restSeconds: ex.restSeconds,
          } as any);
        }
      }
      Alert.alert(t('aiGen.doneTitle'), t('aiGen.doneMsg'));
      nav.navigate('ProgramDetail', { programId: prog.id });
    } catch (e) {
      Alert.alert(t('common.error'), (e as Error).message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('aiGen.title')} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Card variant="secondary" style={{ padding: 14, borderColor: colors.amber, borderWidth: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="star" size={18} color={colors.amber} />
              <Text style={{ flex: 1, color: colors.amber, fontFamily: fontFamilies.body700, fontSize: 12 }}>
                {t('aiGen.pro')}
              </Text>
            </View>
            <Text style={{ marginTop: 6, color: colors.text, fontFamily: fontFamilies.body, fontSize: 13, lineHeight: 19 }}>
              {t('aiGen.intro', { goal: goalKey ?? t('aiGen.goalNone'), level: level ?? t('aiGen.levelNone') })}
            </Text>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card variant="secondary" style={{ padding: 14 }}>
            <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>
              {template.title}
            </Text>
            <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11, marginTop: 2 }}>
              {template.subtitle} · {t('aiGen.weeks', { n: template.weeks })} · {t('aiGen.daysPerWeek', { n: template.daysPerWeek })}
            </Text>
            <View style={{ marginTop: 10, gap: 6 }}>
              {template.days.map((d, i) => (
                <View key={i} style={{ paddingVertical: 6, borderTopWidth: i > 0 ? 1 : 0, borderTopColor: colors.border }}>
                  <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 12 }}>
                    {t('aiGen.dayN', { n: i + 1 })} · {d.title}
                  </Text>
                  <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11, marginTop: 2 }}>
                    {d.exercises.map((e) => e.name).join(' · ')}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <GradientButton
            title={busy ? t('aiGen.generating') : t('aiGen.generate')}
            disabled={busy}
            onPress={generate}
            rightIcon={busy ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="sparkles" size={18} color="#fff" />}
          />
        </View>
      </ScrollView>
    </View>
  );
}
