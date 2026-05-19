import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { useWellbeingStore } from '../store/wellbeingStore';
import { colors } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

function sliders() {
  return [
    { key: 'sleep' as const, label: t('wellbeing.sleep'), emoji: '😴', icon: 'moon-outline' as keyof typeof Ionicons.glyphMap, color: '#9D6BFF' },
    { key: 'energy' as const, label: t('wellbeing.energy'), emoji: '⚡', icon: 'flash-outline' as keyof typeof Ionicons.glyphMap, color: '#FFB547' },
    { key: 'stress' as const, label: t('wellbeing.stress'), emoji: '😖', icon: 'pulse-outline' as keyof typeof Ionicons.glyphMap, color: '#FF4DD2' },
  ];
}

function todayIsoLocal() {
  return new Date().toISOString().slice(0, 10);
}

function cutoff7Iso() {
  const d = new Date();
  d.setDate(d.getDate() - 7);
  return d.toISOString().slice(0, 10);
}

export function WellbeingDiaryScreen() {
  useLang();
  const SLIDERS = sliders();
  const nav = useNavigation<any>();
  const entries = useWellbeingStore((s) => s.entries);
  const upsert = useWellbeingStore((s) => s.upsertToday);

  const today = useMemo(() => {
    const iso = todayIsoLocal();
    return entries.find((e) => e.date === iso) ?? null;
  }, [entries]);

  const last7 = useMemo(() => {
    const c = cutoff7Iso();
    return entries.filter((e) => e.date >= c).sort((a, b) => a.date.localeCompare(b.date));
  }, [entries]);

  const avg = useMemo(() => {
    if (last7.length === 0) return null;
    const sum = last7.reduce(
      (a, e) => ({
        sleep: a.sleep + e.sleep,
        energy: a.energy + e.energy,
        stress: a.stress + e.stress,
      }),
      { sleep: 0, energy: 0, stress: 0 },
    );
    return {
      sleep: Math.round(sum.sleep / last7.length),
      energy: Math.round(sum.energy / last7.length),
      stress: Math.round(sum.stress / last7.length),
    };
  }, [last7]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('wellbeing.title')} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Card variant="secondary">
            <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>
              {t('wellbeing.howToday')}
            </Text>
            <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11, marginTop: 2 }}>
              {t('wellbeing.hint')}
            </Text>

            <View style={{ marginTop: 18, gap: 18 }}>
              {SLIDERS.map((s) => {
                const value = today?.[s.key] ?? 50;
                return (
                  <View key={s.key}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <Text style={{ fontSize: 16 }}>{s.emoji}</Text>
                      <Text style={{ flex: 1, marginLeft: 8, color: colors.text, fontFamily: fontFamilies.body700, fontSize: 13 }}>
                        {s.label}
                      </Text>
                      <Text style={{ color: s.color, fontFamily: fontFamilies.body700, fontSize: 14 }}>
                        {value}
                      </Text>
                    </View>
                    <View style={{ flexDirection: 'row', gap: 4 }}>
                      {[0, 20, 40, 60, 80, 100].map((v) => {
                        const active = value >= v;
                        return (
                          <Pressable
                            key={v}
                            onPress={() => upsert({ [s.key]: v } as any)}
                            style={{
                              flex: 1,
                              height: 36,
                              borderRadius: 8,
                              backgroundColor: active ? s.color : 'rgba(255,255,255,0.05)',
                              alignItems: 'center',
                              justifyContent: 'center',
                              borderWidth: 1,
                              borderColor: active ? s.color : colors.border,
                            }}
                          >
                            <Text
                              style={{
                                color: active ? '#fff' : colors.textMuted,
                                fontFamily: fontFamilies.body700,
                                fontSize: 10,
                              }}
                            >
                              {v}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </View>
                  </View>
                );
              })}
            </View>
          </Card>
        </View>

        {avg ? (
          <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
            <Card variant="secondary">
              <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12, letterSpacing: 1, marginBottom: 8 }}>
                {t('wellbeing.weekAvg')}
              </Text>
              <View style={{ flexDirection: 'row', gap: 10 }}>
                {SLIDERS.map((s) => (
                  <View
                    key={s.key}
                    style={{
                      flex: 1,
                      padding: 10,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: s.color + '55',
                      backgroundColor: 'rgba(0,0,0,0.25)',
                      alignItems: 'center',
                    }}
                  >
                    <Text style={{ fontSize: 18 }}>{s.emoji}</Text>
                    <Text style={{ marginTop: 4, color: s.color, fontFamily: fontFamilies.body700, fontSize: 18 }}>
                      {avg[s.key]}
                    </Text>
                    <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 10 }}>
                      {s.label}
                    </Text>
                  </View>
                ))}
              </View>
            </Card>
          </View>
        ) : null}

        {last7.length > 0 ? (
          <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
            <Card variant="secondary">
              <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12, letterSpacing: 1, marginBottom: 6 }}>
                {t('wellbeing.history')}
              </Text>
              {last7.map((e) => (
                <View
                  key={e.date}
                  style={{
                    flexDirection: 'row',
                    paddingVertical: 8,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ width: 90, color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 12 }}>
                    {e.date}
                  </Text>
                  <Text style={{ color: '#9D6BFF', fontFamily: fontFamilies.body700, fontSize: 12 }}>
                    💤 {e.sleep}
                  </Text>
                  <Text style={{ marginLeft: 10, color: '#FFB547', fontFamily: fontFamilies.body700, fontSize: 12 }}>
                    ⚡ {e.energy}
                  </Text>
                  <Text style={{ marginLeft: 10, color: '#FF4DD2', fontFamily: fontFamilies.body700, fontSize: 12 }}>
                    😖 {e.stress}
                  </Text>
                </View>
              ))}
            </Card>
          </View>
        ) : null}
      </ScrollView>
    </View>
  );
}
