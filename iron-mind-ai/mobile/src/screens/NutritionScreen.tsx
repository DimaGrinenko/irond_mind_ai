import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { RingChart } from '../components/charts/RingChart';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { useNutritionStore } from '../store/nutritionStore';
import { useUserStore } from '../store/userStore';

type TabKey = 'Рацион' | 'Рецепты';

function mealTitle(t: string) {
  if (t === 'breakfast') return 'Завтрак';
  if (t === 'lunch') return 'Обед';
  if (t === 'dinner') return 'Ужин';
  return 'Перекус';
}

export function NutritionScreen({ navigation }: any) {
  const insets = useSafeAreaInsets();
  const date = useNutritionStore((s) => s.date);
  const entries = useNutritionStore((s) => s.entries);
  const hydrate = useNutritionStore((s) => s.hydrate);
  const addQuickSnack = useNutritionStore((s) => s.addQuickSnack);
  const goals = useUserStore((s) => ({
    calories: s.dailyCaloriesGoal,
    protein: s.dailyProteinGoal,
    fats: s.dailyFatsGoal,
    carbs: s.dailyCarbsGoal,
  }));
  const [tab, setTab] = useState<TabKey>('Рацион');

  useEffect(() => {
    hydrate().catch(() => null);
  }, [hydrate, date]);

  const totals = useMemo(() => {
    const sum = entries.reduce(
      (acc, e) => {
        acc.calories += e.calories ?? 0;
        acc.protein += e.protein ?? 0;
        acc.fats += e.fats ?? 0;
        acc.carbs += e.carbs ?? 0;
        return acc;
      },
      { calories: 0, protein: 0, fats: 0, carbs: 0 },
    );
    return sum;
  }, [entries]);

  const grouped = useMemo(() => {
    const order = ['breakfast', 'lunch', 'dinner', 'snack'] as const;
    const map = new Map<string, typeof entries>();
    for (const e of entries) map.set(e.meal_type, [...(map.get(e.meal_type) ?? []), e]);
    return order.map((k) => ({ key: k, title: mealTitle(k), items: map.get(k) ?? [] }));
  }, [entries]);

  const progress = totals.calories / goals.calories;

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
        <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 18 }}>Питание</Text>
        <View style={{ flex: 1 }} />
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            paddingHorizontal: 12,
            paddingVertical: 8,
            borderRadius: 14,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.bgSecondary,
          }}
        >
          <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>Сегодня</Text>
          <Ionicons name="chevron-down" size={16} color={colors.textSecondary} />
        </Pressable>
      </View>

      <View style={{ paddingHorizontal: 16, marginTop: 10, flexDirection: 'row', justifyContent: 'space-between' }}>
        {(['Рацион', 'Рецепты'] as TabKey[]).map((t) => {
          const active = t === tab;
          return (
            <Pressable key={t} onPress={() => setTab(t)} style={{ paddingVertical: 10 }}>
              <Text style={{ color: active ? colors.text : colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>
                {t}
              </Text>
              <View style={{ marginTop: 8, height: 2, borderRadius: 2, backgroundColor: active ? colors.purpleLight : 'transparent' }} />
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <LinearGradient colors={['rgba(21,21,31,0.85)', 'rgba(0,0,0,0.95)']} style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}>
                <View style={{ width: 96, alignItems: 'center', justifyContent: 'center' }}>
                  <RingChart size={92} strokeWidth={7} progress={progress} />
                  <View style={{ position: 'absolute', alignItems: 'center' }}>
                    <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 20 }}>
                      {totals.calories}
                    </Text>
                    <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body600, fontSize: 11 }}>
                      / {goals.calories} ккал
                    </Text>
                  </View>
                </View>

                <View style={{ flex: 1, gap: 10 }}>
                  {[
                    { label: 'Белки', v: totals.protein, t: goals.protein, c: colors.blue },
                    { label: 'Жиры', v: totals.fats, t: goals.fats, c: colors.pink },
                    { label: 'Углеводы', v: totals.carbs, t: goals.carbs, c: colors.purpleLight },
                  ].map((x) => (
                    <View key={x.label} style={{ gap: 6 }}>
                      <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                        <Text style={{ flex: 1, color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>
                          {x.label}
                        </Text>
                        <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body700, fontSize: 12 }}>
                          {Math.round(x.v)} г
                        </Text>
                        <Ionicons name="chevron-forward" size={14} color={colors.textMuted} style={{ marginLeft: 6 }} />
                      </View>
                      <ProgressBar value={x.v / x.t} color={x.c} />
                    </View>
                  ))}
                </View>
              </View>
            </LinearGradient>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>Приёмы пищи</Text>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 10, gap: 12 }}>
          {grouped.map((g) => {
            const kcal = g.items.reduce((s, x) => s + (x.calories ?? 0), 0);
            const time = g.items[0]?.time ?? '';
            return (
              <Pressable
                key={g.key}
                onPress={() => {
                  Alert.alert(
                    g.title,
                    `Записей: ${g.items.length}\nКалории: ${kcal} ккал`,
                    [
                      { text: 'Отмена', style: 'cancel' },
                      {
                        text: 'Добавить перекус',
                        onPress: async () => {
                          await addQuickSnack();
                          await hydrate();
                        },
                      },
                    ],
                  );
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.bgSecondary,
                  overflow: 'hidden',
                }}
              >
                <View style={{ flex: 1, paddingHorizontal: 14, paddingVertical: 14 }}>
                  <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>{g.title}</Text>
                  <Text style={{ marginTop: 4, color: colors.textMuted, fontFamily: fontFamilies.body600, fontSize: 12 }}>
                    {time ? `${time} · ` : ''}
                    {kcal} ккал
                  </Text>
                </View>
                <View style={{ width: 46, height: 46, marginRight: 12, borderRadius: 16, backgroundColor: 'rgba(123,63,228,0.10)', borderWidth: 1, borderColor: 'rgba(42,42,62,0.9)', alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name="fast-food" size={18} color={colors.purpleLight} />
                </View>
                <Ionicons name="chevron-forward" size={22} color={colors.textMuted} style={{ marginRight: 12 }} />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', left: 16, right: 16, bottom: 18 }}>
        <Pressable
          onPress={async () => {
            await addQuickSnack();
            await hydrate();
          }}
          style={{ borderRadius: radii.md, overflow: 'hidden' }}
        >
          <LinearGradient colors={['#7B3FE4', '#B14EFF'] as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
            <View style={{ height: 56, borderRadius: radii.md, alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: colors.text, fontFamily: fontFamilies.body700 }}>Добавить приём пищи</Text>
            </View>
          </LinearGradient>
        </Pressable>
      </View>
    </View>
  );
}

