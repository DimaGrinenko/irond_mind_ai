import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BodyFigure } from '../components/anatomy/BodyFigure';
import { Card } from '../components/common/Card';
import { FieldRow } from '../components/common/FieldRow';
import { GradientButton } from '../components/common/GradientButton';
import { colors } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { useMeasurementsStore } from '../store/measurementsStore';
import { useNavigation } from '@react-navigation/native';
import { todayRu } from '../utils/date';

function toNumOrNull(s: string) {
  const t = s.replace(',', '.').trim();
  if (!t) return null;
  const n = Number(t);
  return Number.isFinite(n) ? n : null;
}

export function BodyMeasurementsScreen() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const hydrate = useMeasurementsStore((s) => s.hydrate);
  const add = useMeasurementsStore((s) => s.add);
  const rows = useMeasurementsStore((s) => s.rows);

  useEffect(() => {
    hydrate().catch(() => null);
  }, [hydrate]);

  const last = rows[0];

  const [left, setLeft] = useState({
    neck: '',
    shoulders: '',
    chest: '',
    waist: '',
    forearm: '',
  });
  const [right, setRight] = useState({
    hips: '',
    thigh: '',
    biceps: '',
    calf: '',
    weight: '',
  });

  useEffect(() => {
    // подставим последние значения (если есть)
    if (!last) return;
    setLeft({
      neck: last.neck?.toString?.() ?? '',
      shoulders: last.shoulders?.toString?.() ?? '',
      chest: last.chest?.toString?.() ?? '',
      waist: last.waist?.toString?.() ?? '',
      forearm: last.forearm?.toString?.() ?? '',
    });
    setRight({
      hips: last.hips?.toString?.() ?? '',
      thigh: last.thigh?.toString?.() ?? '',
      biceps: last.biceps?.toString?.() ?? '',
      calf: last.calf?.toString?.() ?? '',
      weight: last.weight?.toString?.() ?? '',
    });
  }, [last?.id]);

  const canSave = useMemo(() => {
    const any =
      toNumOrNull(left.neck) ??
      toNumOrNull(left.shoulders) ??
      toNumOrNull(left.chest) ??
      toNumOrNull(left.waist) ??
      toNumOrNull(left.forearm) ??
      toNumOrNull(right.hips) ??
      toNumOrNull(right.thigh) ??
      toNumOrNull(right.biceps) ??
      toNumOrNull(right.calf) ??
      toNumOrNull(right.weight);
    return any !== null && any !== undefined;
  }, [left, right]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
        <Pressable
          onPress={() => nav.goBack()}
          accessibilityRole="button"
          accessibilityLabel="Назад"
          hitSlop={12}
          style={{ paddingVertical: 8, paddingRight: 10 }}
        >
          <Ionicons name="chevron-back" size={20} color={colors.text} />
        </Pressable>
        <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 18 }}>Замеры тела</Text>
        <View style={{ flex: 1 }} />
        <Pressable
          onPress={() => nav.navigate('Calendar')}
          style={{
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.bgSecondary,
          }}
        >
          <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>История</Text>
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 10, alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <Ionicons name="chevron-back" size={16} color={colors.textMuted} />
          <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>{todayRu()}</Text>
          <Ionicons name="chevron-forward" size={16} color={colors.textMuted} />
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <LinearGradient colors={['rgba(79,31,184,0.18)', 'rgba(0,0,0,0)']} style={{ padding: 14 }}>
              <View style={{ flexDirection: 'row', gap: 12 }}>
                <View style={{ width: 110 }}>
                  <FieldRow label="Шея" value={left.neck} onChange={(v) => setLeft((s) => ({ ...s, neck: v }))} compact />
                  <FieldRow
                    label="Грудь"
                    value={left.chest}
                    onChange={(v) => setLeft((s) => ({ ...s, chest: v }))}
                    compact
                  />
                  <FieldRow
                    label="Талия"
                    value={left.waist}
                    onChange={(v) => setLeft((s) => ({ ...s, waist: v }))}
                    compact
                  />
                  <FieldRow
                    label="Плечи"
                    value={left.shoulders}
                    onChange={(v) => setLeft((s) => ({ ...s, shoulders: v }))}
                    compact
                  />
                  <FieldRow
                    label="Предплечье"
                    value={left.forearm}
                    onChange={(v) => setLeft((s) => ({ ...s, forearm: v }))}
                    compact
                  />
                </View>

                <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
                  <BodyFigure width={150} height={210} />
                </View>

                <View style={{ width: 110 }}>
                  <FieldRow label="Таз" value={right.hips} onChange={(v) => setRight((s) => ({ ...s, hips: v }))} compact />
                  <FieldRow
                    label="Бедро"
                    value={right.thigh}
                    onChange={(v) => setRight((s) => ({ ...s, thigh: v }))}
                    compact
                  />
                  <FieldRow
                    label="Бицепс"
                    value={right.biceps}
                    onChange={(v) => setRight((s) => ({ ...s, biceps: v }))}
                    compact
                  />
                  <FieldRow
                    label="Голень"
                    value={right.calf}
                    onChange={(v) => setRight((s) => ({ ...s, calf: v }))}
                    compact
                  />
                  <FieldRow
                    label="Вес"
                    value={right.weight}
                    onChange={(v) => setRight((s) => ({ ...s, weight: v }))}
                    suffix="кг"
                    compact
                  />
                </View>
              </View>
            </LinearGradient>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <GradientButton
            title="Добавить замеры"
            disabled={!canSave}
            onPress={async () => {
              try {
                await add({
                  neck: toNumOrNull(left.neck),
                  chest: toNumOrNull(left.chest),
                  waist: toNumOrNull(left.waist),
                  shoulders: toNumOrNull(left.shoulders),
                  forearm: toNumOrNull(left.forearm),
                  hips: toNumOrNull(right.hips),
                  thigh: toNumOrNull(right.thigh),
                  biceps: toNumOrNull(right.biceps),
                  calf: toNumOrNull(right.calf),
                  weight: toNumOrNull(right.weight),
                });
                await hydrate();
              } catch (e) {
                console.error('Не удалось сохранить замеры:', e);
              }
            }}
          />
          <Text style={{ marginTop: 10, color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11 }}>
            Замеры сохраняются локально в SQLite (оффлайн).
          </Text>
        </View>
      </ScrollView>
    </View>
  );
}

