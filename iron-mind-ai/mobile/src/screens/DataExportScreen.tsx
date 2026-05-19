/**
 * Экспорт данных в CSV. На web — скачивание через blob, на native — share через expo-sharing.
 */
import React, { useState } from 'react';
import { Alert, Platform, Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as FileSystem from 'expo-file-system';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { api } from '../api/client';
import { t, useLang } from '../i18n';

function toCsv(rows: Array<Record<string, unknown>>): string {
  if (rows.length === 0) return '';
  const headers = Array.from(new Set(rows.flatMap((r) => Object.keys(r))));
  const escape = (v: unknown) => {
    if (v === null || v === undefined) return '';
    const s = String(v).replace(/"/g, '""');
    return /[",\n]/.test(s) ? `"${s}"` : s;
  };
  const lines = [headers.join(',')];
  for (const r of rows) lines.push(headers.map((h) => escape(r[h])).join(','));
  return lines.join('\n');
}

async function downloadCsv(filename: string, csv: string) {
  if (Platform.OS === 'web') {
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
    URL.revokeObjectURL(url);
    return;
  }
  try {
    const dir = (FileSystem as any).cacheDirectory || (FileSystem as any).documentDirectory;
    if (!dir) throw new Error('FS not available');
    const path = `${dir}${filename}`;
    await (FileSystem as any).writeAsStringAsync(path, csv, { encoding: 'utf8' });
    const Sharing = await import('expo-sharing');
    if (await Sharing.isAvailableAsync()) {
      await Sharing.shareAsync(path, { mimeType: 'text/csv', dialogTitle: filename });
    } else {
      Alert.alert(t('dataExport.savedTitle'), t('dataExport.savedAlert', { path }));
    }
  } catch (e) {
    Alert.alert('Ошибка', (e as Error).message);
  }
}

export function DataExportScreen() {
  useLang();
  const nav = useNavigation<any>();
  const [busy, setBusy] = useState<string | null>(null);

  const exportWorkouts = async () => {
    setBusy('workouts');
    try {
      const list: any[] = await api.workouts.list(500);
      const rows = list.map((w) => ({
        id: w.id,
        date: w.date,
        title: w.name,
        durationMin: w.durationSec ? Math.round(w.durationSec / 60) : '',
        completed: w.completed ? 1 : 0,
        sets: w.totalSets ?? '',
        volumeKg: w.volumeKg ?? '',
      }));
      await downloadCsv(`workouts_${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
    } catch (e) {
      Alert.alert(t('common.error'), (e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const exportNutrition = async () => {
    setBusy('nutrition');
    try {
      const list: any[] = await api.nutrition.list();
      const rows = list.map((n) => ({
        date: n.date,
        meal: n.meal_type ?? n.mealType,
        name: n.name,
        kcal: n.calories,
        protein: n.protein,
        fats: n.fats,
        carbs: n.carbs,
      }));
      await downloadCsv(`nutrition_${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
    } catch (e) {
      Alert.alert(t('common.error'), (e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  const exportMeasurements = async () => {
    setBusy('measurements');
    try {
      const list: any[] = await api.measurements.list();
      const rows = list.map((m) => ({
        date: m.date,
        weight: m.weight,
        chest: m.chest,
        waist: m.waist,
        hips: m.hips,
        biceps: m.biceps,
        thigh: m.thigh,
        calf: m.calf,
        shoulders: m.shoulders,
        neck: m.neck,
        forearm: m.forearm,
      }));
      await downloadCsv(`measurements_${new Date().toISOString().slice(0, 10)}.csv`, toCsv(rows));
    } catch (e) {
      Alert.alert(t('common.error'), (e as Error).message);
    } finally {
      setBusy(null);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('dataExport.title')} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: 16, marginTop: 14, gap: 12 }}>
          <Card variant="secondary">
            <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 13, lineHeight: 19 }}>
              {t('dataExport.intro')}
            </Text>
          </Card>

          <ExportRow
            label={t('dataExport.workouts')}
            sub={t('dataExport.workoutsSub')}
            icon="barbell-outline"
            tint={colors.purpleLight}
            onPress={exportWorkouts}
            busy={busy === 'workouts'}
          />
          <ExportRow
            label={t('dataExport.nutrition')}
            sub={t('dataExport.nutritionSub')}
            icon="restaurant-outline"
            tint={colors.green}
            onPress={exportNutrition}
            busy={busy === 'nutrition'}
          />
          <ExportRow
            label={t('dataExport.measurements')}
            sub={t('dataExport.measurementsSub')}
            icon="body-outline"
            tint={colors.cyan}
            onPress={exportMeasurements}
            busy={busy === 'measurements'}
          />
        </View>
      </ScrollView>
    </View>
  );
}

function ExportRow({
  label, sub, icon, tint, onPress, busy,
}: {
  label: string; sub: string; icon: keyof typeof import('@expo/vector-icons').Ionicons.glyphMap;
  tint: string; onPress: () => void; busy: boolean;
}) {
  return (
    <Pressable
      onPress={onPress}
      disabled={busy}
      style={{
        padding: 14,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: tint + '55',
        backgroundColor: 'rgba(0,0,0,0.25)',
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        opacity: busy ? 0.5 : 1,
      }}
    >
      <View
        style={{
          width: 42,
          height: 42,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: tint,
          backgroundColor: tint + '22',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Ionicons name={icon} size={20} color={tint} />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>{label}</Text>
        <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11, marginTop: 2 }}>{sub}</Text>
      </View>
      <Ionicons name={busy ? 'hourglass' : 'download'} size={18} color={tint} />
    </Pressable>
  );
}
