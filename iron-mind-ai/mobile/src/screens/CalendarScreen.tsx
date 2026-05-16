import { LinearGradient } from 'expo-linear-gradient';
import React, { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { NeonScene3D } from '../components/3d/NeonScene3D';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { useWorkoutsStore } from '../store/workoutsStore';
import { colors } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';

const WEEK_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

export function CalendarScreen({ navigation }: any) {
  const workouts = useWorkoutsStore((s) => s.workouts);
  const hydrate = useWorkoutsStore((s) => s.hydrate);
  const [anchor] = useState(() => new Date());
  const [selectedIso, setSelectedIso] = useState(() => new Date().toISOString().slice(0, 10));

  useEffect(() => {
    hydrate().catch(() => null);
  }, [hydrate]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(anchor);
    return Array.from({ length: 7 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return {
        label: WEEK_LABELS[i],
        date: d.getDate(),
        iso: d.toISOString().slice(0, 10),
      };
    });
  }, [anchor]);

  const dayWorkouts = useMemo(
    () => workouts.filter((w) => w.date === selectedIso),
    [workouts, selectedIso],
  );

  const goToday = () => setSelectedIso(new Date().toISOString().slice(0, 10));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title="Календарь"
        onBack={() => navigation.goBack()}
        right={
          <Pressable
            onPress={goToday}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.borderNeon,
              backgroundColor: colors.bgSecondary,
            }}
          >
            <Text style={{ color: colors.cyan, fontFamily: fontFamilies.body600, fontSize: 12 }}>Сегодня</Text>
          </Pressable>
        }
      />
      <NeonScene3D height={72} />

      <View style={{ paddingHorizontal: 16, marginTop: 4 }}>
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          {weekDays.map((d) => {
            const active = d.iso === selectedIso;
            const hasWorkout = workouts.some((w) => w.date === d.iso);
            return (
              <Pressable key={d.iso} onPress={() => setSelectedIso(d.iso)} style={{ alignItems: 'center', width: 42 }}>
                <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body600, fontSize: 11 }}>{d.label}</Text>
                <View
                  style={{
                    marginTop: 8,
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    borderWidth: 1,
                    borderColor: active ? colors.borderNeon : colors.border,
                    backgroundColor: active ? 'rgba(157,107,255,0.25)' : colors.bgSecondary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: active ? colors.text : colors.textSecondary, fontFamily: fontFamilies.body700, fontSize: 12 }}>
                    {d.date}
                  </Text>
                </View>
                {hasWorkout ? (
                  <View style={{ marginTop: 4, width: 6, height: 6, borderRadius: 3, backgroundColor: colors.cyan }} />
                ) : (
                  <View style={{ marginTop: 4, width: 6, height: 6 }} />
                )}
              </Pressable>
            );
          })}
        </View>
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, marginTop: 14, gap: 12 }}>
          {dayWorkouts.length === 0 ? (
            <Card>
              <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body, textAlign: 'center' }}>
                Нет тренировок на этот день. Начните с главного экрана.
              </Text>
            </Card>
          ) : (
            dayWorkouts.map((w) => (
              <Card key={w.id} style={{ padding: 0, overflow: 'hidden' }}>
                <LinearGradient
                  colors={w.completed ? ['rgba(63,255,150,0.2)', 'rgba(0,0,0,0.95)'] : ['rgba(157,107,255,0.22)', 'rgba(0,0,0,0.95)']}
                  style={{ padding: 14 }}
                >
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                    <View
                      style={{
                        width: 44,
                        height: 44,
                        borderRadius: 16,
                        borderWidth: 1,
                        borderColor: colors.border,
                        backgroundColor: colors.bgSecondary,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons name="barbell" size={20} color={colors.purpleLight} />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>
                        {w.name || 'Тренировка'}
                      </Text>
                      <Text style={{ marginTop: 4, color: colors.textMuted, fontFamily: fontFamilies.body600, fontSize: 12 }}>
                        {w.date} · {w.completed ? 'Завершена' : 'В процессе'}
                        {w.duration_seconds ? ` · ${Math.round(w.duration_seconds / 60)} мин` : ''}
                      </Text>
                    </View>
                    <Pressable onPress={() => navigation.navigate('Workout')} style={{ padding: 8 }}>
                      <Ionicons name="play" size={18} color={colors.cyan} />
                    </Pressable>
                  </View>
                </LinearGradient>
              </Card>
            ))
          )}
        </View>
      </ScrollView>
    </View>
  );
}
