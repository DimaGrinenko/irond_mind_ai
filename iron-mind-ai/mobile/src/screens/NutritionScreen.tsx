import React, { useEffect, useMemo, useState } from 'react';
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
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { RingChart } from '../components/charts/RingChart';
import { GradientButton } from '../components/common/GradientButton';
import { CyclePhaseBanner } from '../components/common/CyclePhaseBanner';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { useNutritionStore } from '../store/nutritionStore';
import { useUserStore } from '../store/userStore';
import { foods, type Food, searchFoods, macrosFor } from '../data/foods';
import { localizedFoodName } from '../data/foods_en';
import { useCustomFoodsStore } from '../store/customFoodsStore';
import { useWaterStore } from '../store/waterStore';
import {
  useMealTemplatesStore,
  type MealTemplate,
} from '../store/mealTemplatesStore';
import { BarcodeScannerModal } from '../components/nutrition/BarcodeScannerModal';
import { t, useLang } from '../i18n';

type MealType = 'breakfast' | 'lunch' | 'dinner' | 'snack';

function mealTitle(t_: typeof t, m: string) {
  if (m === 'breakfast') return t_('nutrition.breakfast');
  if (m === 'lunch') return t_('nutrition.lunch');
  if (m === 'dinner') return t_('nutrition.dinner');
  return t_('nutrition.snack');
}

export function NutritionScreen({ navigation }: any) {
  const lang = useLang();
  const insets = useSafeAreaInsets();
  const date = useNutritionStore((s) => s.date);
  const entries = useNutritionStore((s) => s.entries);
  const hydrate = useNutritionStore((s) => s.hydrate);
  const addEntry = useNutritionStore((s) => s.addEntry);
  const remove = useNutritionStore((s) => s.remove);

  const goalCalories = useUserStore((s) => s.dailyCaloriesGoal);
  const goalProtein = useUserStore((s) => s.dailyProteinGoal);
  const goalFats = useUserStore((s) => s.dailyFatsGoal);
  const goalCarbs = useUserStore((s) => s.dailyCarbsGoal);

  const [picker, setPicker] = useState<{ visible: boolean; meal: MealType }>({
    visible: false,
    meal: 'snack',
  });
  const [editingId, setEditingId] = useState<number | null>(null);

  useEffect(() => {
    hydrate().catch(() => null);
  }, [hydrate, date]);

  const totals = useMemo(() => {
    return entries.reduce(
      (acc, e) => {
        acc.calories += e.calories ?? 0;
        acc.protein += e.protein ?? 0;
        acc.fats += e.fats ?? 0;
        acc.carbs += e.carbs ?? 0;
        return acc;
      },
      { calories: 0, protein: 0, fats: 0, carbs: 0 },
    );
  }, [entries]);

  const grouped = useMemo(() => {
    const order: MealType[] = ['breakfast', 'lunch', 'dinner', 'snack'];
    const map = new Map<string, typeof entries>();
    for (const e of entries)
      map.set(e.meal_type, [...(map.get(e.meal_type) ?? []), e]);
    return order.map((k) => ({
      key: k,
      title: mealTitle(t, k),
      items: map.get(k) ?? [],
    }));
  }, [entries]);

  const progress = goalCalories > 0 ? totals.calories / goalCalories : 0;

  const onDeleteEntry = (id: number, name: string | null) => {
    Alert.alert(t('nutrition.confirmDelete'), name ?? '', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => remove(id),
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
          onPress={() => navigation.goBack()}
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
          {t('nutrition.title')}
        </Text>
        <View style={{ flex: 1 }} />
        <View
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
          <Text
            style={{
              color: colors.textSecondary,
              fontFamily: fontFamilies.body600,
              fontSize: 12,
            }}
          >
            {t('common.today')}
          </Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <CyclePhaseBanner context="nutrition" />
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <LinearGradient
              colors={['rgba(21,21,31,0.85)', 'rgba(0,0,0,0.95)']}
              style={{ padding: 16 }}
            >
              <View
                style={{ flexDirection: 'row', gap: 16, alignItems: 'center' }}
              >
                <View
                  style={{
                    width: 96,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <RingChart size={92} strokeWidth={7} progress={progress} />
                  <View style={{ position: 'absolute', alignItems: 'center' }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontFamily: fontFamilies.body700,
                        fontSize: 20,
                      }}
                    >
                      {totals.calories}
                    </Text>
                    <Text
                      style={{
                        color: colors.textMuted,
                        fontFamily: fontFamilies.body600,
                        fontSize: 11,
                      }}
                    >
                      / {goalCalories} {t('common.kcal')}
                    </Text>
                  </View>
                </View>

                <View style={{ flex: 1, gap: 10 }}>
                  {[
                    {
                      label: t('nutrition.proteins'),
                      v: totals.protein,
                      target: goalProtein,
                      c: colors.blue,
                    },
                    {
                      label: t('nutrition.fats'),
                      v: totals.fats,
                      target: goalFats,
                      c: colors.pink,
                    },
                    {
                      label: t('nutrition.carbs'),
                      v: totals.carbs,
                      target: goalCarbs,
                      c: colors.purpleLight,
                    },
                  ].map((x) => (
                    <View key={x.label} style={{ gap: 6 }}>
                      <View
                        style={{ flexDirection: 'row', alignItems: 'center' }}
                      >
                        <Text
                          style={{
                            flex: 1,
                            color: colors.textSecondary,
                            fontFamily: fontFamilies.body600,
                            fontSize: 12,
                          }}
                        >
                          {x.label}
                        </Text>
                        <Text
                          style={{
                            color: colors.textSecondary,
                            fontFamily: fontFamilies.body700,
                            fontSize: 12,
                          }}
                        >
                          {Math.round(x.v)} / {x.target} {t('common.gram')}
                        </Text>
                      </View>
                      <ProgressBar
                        value={x.target > 0 ? x.v / x.target : 0}
                        color={x.c}
                      />
                    </View>
                  ))}
                </View>
              </View>
            </LinearGradient>
          </Card>
        </View>

        <WaterPanel />

        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <Text
            style={{
              color: colors.textSecondary,
              fontFamily: fontFamilies.body600,
              fontSize: 12,
            }}
          >
            {t('nutrition.mealsHeader')}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 10, gap: 12 }}>
          {grouped.map((g) => {
            const kcal = g.items.reduce((s, x) => s + (x.calories ?? 0), 0);
            return (
              <Card key={g.key} variant="secondary" style={{ padding: 14 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    marginBottom: 8,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 12,
                      backgroundColor: 'rgba(123,63,228,0.18)',
                      borderWidth: 1,
                      borderColor: colors.borderNeon,
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: 10,
                    }}
                  >
                    <Ionicons
                      name="restaurant"
                      size={16}
                      color={colors.purpleLight}
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontFamily: fontFamilies.body700,
                        fontSize: 14,
                      }}
                    >
                      {g.title}
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        color: colors.textMuted,
                        fontFamily: fontFamilies.body,
                        fontSize: 11,
                      }}
                    >
                      {g.items.length} {t('nutrition.entries').toLowerCase()} ·{' '}
                      {kcal} {t('common.kcal')}
                    </Text>
                  </View>
                  <Pressable
                    onPress={() =>
                      setPicker({ visible: true, meal: g.key as MealType })
                    }
                    hitSlop={10}
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      backgroundColor: 'rgba(157,107,255,0.18)',
                      borderWidth: 1,
                      borderColor: colors.borderNeon,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="add" size={18} color={colors.purpleLight} />
                  </Pressable>
                </View>
                {g.items.length === 0 ? null : (
                  <View style={{ gap: 6 }}>
                    {g.items.map((e) => (
                      <Pressable
                        key={e.id}
                        onPress={() =>
                          Alert.alert(
                            e.name ?? '—',
                            `${e.calories ?? 0} ${t('common.kcal')} · ${t('nut.pShort')} ${Math.round(e.protein ?? 0)} · ${t('nut.fShort')} ${Math.round(e.fats ?? 0)} · ${t('nut.cShort')} ${Math.round(e.carbs ?? 0)}`,
                            [
                              { text: t('common.cancel'), style: 'cancel' },
                              {
                                text: t('common.delete'),
                                style: 'destructive',
                                onPress: () => remove(e.id),
                              },
                            ],
                          )
                        }
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          paddingVertical: 8,
                          paddingHorizontal: 10,
                          borderRadius: 10,
                          backgroundColor: 'rgba(255,255,255,0.03)',
                        }}
                      >
                        <View style={{ flex: 1 }}>
                          <Text
                            style={{
                              color: colors.text,
                              fontFamily: fontFamilies.body600,
                              fontSize: 13,
                            }}
                          >
                            {e.name ?? '—'}
                          </Text>
                          <Text
                            style={{
                              color: colors.textMuted,
                              fontFamily: fontFamilies.body,
                              fontSize: 11,
                              marginTop: 2,
                            }}
                          >
                            {e.calories ?? 0} {t('common.kcal')} ·{' '}
                            {t('nut.pShort')} {Math.round(e.protein ?? 0)} ·{' '}
                            {t('nut.fShort')} {Math.round(e.fats ?? 0)} ·{' '}
                            {t('nut.cShort')} {Math.round(e.carbs ?? 0)}
                          </Text>
                        </View>
                        <Ionicons
                          name="chevron-forward"
                          size={14}
                          color={colors.textMuted}
                          style={{ marginLeft: 4 }}
                        />
                      </Pressable>
                    ))}
                  </View>
                )}
              </Card>
            );
          })}
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: Math.max(insets.bottom, 12) + 6,
        }}
      >
        <GradientButton
          title={t('nutrition.addMeal')}
          onPress={() => setPicker({ visible: true, meal: 'snack' })}
          rightIcon={<Ionicons name="add" size={18} color={colors.text} />}
        />
      </View>

      <FoodPickerModal
        visible={picker.visible}
        meal={picker.meal}
        onClose={() => setPicker({ visible: false, meal: picker.meal })}
        onAdd={async (food, grams, meal) => {
          const m = macrosFor(food, grams);
          const time = new Date().toTimeString().slice(0, 5);
          await addEntry({
            meal_type: meal,
            name: `${localizedFoodName(food, lang)} (${grams} ${t('common.gram')})`,
            calories: m.calories,
            protein: m.protein,
            fats: m.fats,
            carbs: m.carbs,
            time,
          });
          setPicker({ visible: false, meal });
        }}
      />

      <SaveAsTemplatePrompt entries={entries} />
    </View>
  );
}

function SaveAsTemplatePrompt({ entries }: { entries: any[] }) {
  const add = useMealTemplatesStore((s) => s.add);
  const [visible, setVisible] = React.useState(false);
  const [title, setTitle] = React.useState('');
  const [selectedMeal, setSelectedMeal] = React.useState<MealType>('lunch');

  const itemsForMeal = entries.filter((e) => e.meal_type === selectedMeal);
  const canSave = itemsForMeal.length > 0 && title.trim().length > 0;

  return (
    <>
      <Pressable
        onPress={() => setVisible(true)}
        style={{
          position: 'absolute',
          right: 16,
          bottom: 80,
          width: 44,
          height: 44,
          borderRadius: 22,
          borderWidth: 1,
          borderColor: colors.amber,
          backgroundColor: 'rgba(255,181,71,0.18)',
          alignItems: 'center',
          justifyContent: 'center',
        }}
        accessibilityLabel={t('nut.saveAsTemplate')}
      >
        <Ionicons name="bookmark" size={18} color={colors.amber} />
      </Pressable>

      <Modal
        visible={visible}
        transparent
        animationType="slide"
        onRequestClose={() => setVisible(false)}
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
                  fontSize: 18,
                }}
              >
                {t('nut.saveAsTemplate')}
              </Text>
              <Pressable onPress={() => setVisible(false)} hitSlop={12}>
                <Ionicons name="close" size={22} color={colors.textSecondary} />
              </Pressable>
            </View>
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: fontFamilies.body,
                fontSize: 12,
                marginBottom: 10,
              }}
            >
              {t('nut.saveTemplateHint')}
            </Text>

            <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10 }}>
              {(['breakfast', 'lunch', 'dinner', 'snack'] as MealType[]).map(
                (m) => {
                  const active = m === selectedMeal;
                  const label =
                    m === 'breakfast'
                      ? t('nutrition.breakfast')
                      : m === 'lunch'
                        ? t('nutrition.lunch')
                        : m === 'dinner'
                          ? t('nutrition.dinner')
                          : t('nutrition.snack');
                  return (
                    <Pressable
                      key={m}
                      onPress={() => setSelectedMeal(m)}
                      style={{
                        flex: 1,
                        paddingVertical: 8,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: active ? colors.borderNeon : colors.border,
                        backgroundColor: active
                          ? 'rgba(157,107,255,0.18)'
                          : colors.bgSecondary,
                        alignItems: 'center',
                      }}
                    >
                      <Text
                        style={{
                          color: active
                            ? colors.purpleLight
                            : colors.textSecondary,
                          fontFamily: fontFamilies.body700,
                          fontSize: 11,
                        }}
                      >
                        {label} (
                        {entries.filter((e) => e.meal_type === m).length})
                      </Text>
                    </Pressable>
                  );
                },
              )}
            </View>

            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder={t('nut.templateNamePh')}
              placeholderTextColor={colors.textMuted}
              style={{
                color: colors.text,
                fontFamily: fontFamilies.body600,
                fontSize: 14,
                height: 44,
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.bgSecondary,
                paddingHorizontal: 12,
                marginBottom: 12,
              }}
            />
            <Pressable
              disabled={!canSave}
              onPress={() => {
                add(
                  title.trim(),
                  itemsForMeal.map((e) => {
                    // Извлекаем граммовку из name "Курица (150 г)"
                    const match = (e.name as string)?.match(
                      /\((\d+)\s*[гg]\)$/,
                    );
                    const grams = match ? parseInt(match[1], 10) : 100;
                    return {
                      name:
                        (e.name as string)?.replace(/\s*\(\d+\s*[гg]\)$/, '') ??
                        '—',
                      grams,
                      calories: e.calories ?? 0,
                      protein: e.protein ?? 0,
                      fats: e.fats ?? 0,
                      carbs: e.carbs ?? 0,
                    };
                  }),
                );
                setVisible(false);
                setTitle('');
              }}
              style={{
                paddingVertical: 14,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: canSave ? colors.amber : colors.border,
                backgroundColor: canSave
                  ? 'rgba(255,181,71,0.18)'
                  : colors.bgSecondary,
                alignItems: 'center',
                opacity: canSave ? 1 : 0.5,
              }}
            >
              <Text
                style={{
                  color: canSave ? colors.amber : colors.textMuted,
                  fontFamily: fontFamilies.body700,
                  fontSize: 13,
                }}
              >
                {t('nut.saveTemplateBtn')}
              </Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </>
  );
}

function WaterPanel() {
  const userWeight = useUserStore((s) => s.weightKg);
  const glasses = useWaterStore(
    (s) =>
      s.history.find((d) => d.date === new Date().toISOString().slice(0, 10))
        ?.glasses ?? 0,
  );
  const glassMl = useWaterStore((s) => s.glassMl);
  const target = useWaterStore((s) => s.dailyTargetMl);
  const autoTarget = useWaterStore((s) => s.autoTarget);
  const add = useWaterStore((s) => s.add);
  const remove = useWaterStore((s) => s.remove);
  const computeTargetFromWeight = useWaterStore(
    (s) => s.computeTargetFromWeight,
  );

  // Авто-пересчёт цели при изменении веса
  React.useEffect(() => {
    if (autoTarget && userWeight) {
      computeTargetFromWeight(userWeight);
    }
  }, [autoTarget, userWeight, computeTargetFromWeight]);

  const cur = glasses * glassMl;
  const pct = Math.min(100, Math.round((cur / target) * 100));
  const done = cur >= target;

  return (
    <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
      <Card variant="secondary" style={{ padding: 14 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View
            style={{
              width: 56,
              height: 56,
              borderRadius: 28,
              borderWidth: 2,
              borderColor: done ? colors.green : colors.cyan,
              backgroundColor: done
                ? 'rgba(63,255,150,0.20)'
                : 'rgba(0,229,255,0.14)',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons
              name="water"
              size={28}
              color={done ? colors.green : colors.cyan}
            />
          </View>
          <View style={{ flex: 1 }}>
            <Text
              style={{
                color: colors.text,
                fontFamily: fontFamilies.body700,
                fontSize: 14,
              }}
            >
              {t('foods.water')}
            </Text>
            <Text
              style={{
                marginTop: 2,
                color: colors.textMuted,
                fontFamily: fontFamilies.body,
                fontSize: 11,
              }}
            >
              {cur} / {target} {t('common.ml')} · {pct}%
              {userWeight && autoTarget
                ? ` · ${t('nut.waterFromWeight', { kg: userWeight })}`
                : ''}
            </Text>
            {/* progress bar */}
            <View
              style={{
                marginTop: 6,
                height: 6,
                borderRadius: 3,
                backgroundColor: 'rgba(0,229,255,0.10)',
                overflow: 'hidden',
              }}
            >
              <View
                style={{
                  width: `${pct}%`,
                  height: '100%',
                  backgroundColor: done ? colors.green : colors.cyan,
                }}
              />
            </View>
          </View>
          <Pressable
            onPress={() => add(1)}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 12,
              borderRadius: 14,
              backgroundColor: 'rgba(0,229,255,0.18)',
              borderWidth: 1,
              borderColor: colors.cyan,
              alignItems: 'center',
              minWidth: 80,
            }}
          >
            <Text
              style={{
                color: colors.cyan,
                fontFamily: fontFamilies.body700,
                fontSize: 13,
              }}
            >
              +{glassMl}
              {t('common.ml')}
            </Text>
            <Text
              style={{
                marginTop: 2,
                color: colors.cyan,
                fontFamily: fontFamilies.body,
                fontSize: 9,
              }}
            >
              {t('nut.drank')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => remove()}
            hitSlop={8}
            disabled={glasses === 0}
            style={{
              width: 32,
              height: 32,
              borderRadius: 10,
              borderWidth: 1,
              borderColor: colors.border,
              alignItems: 'center',
              justifyContent: 'center',
              opacity: glasses === 0 ? 0.3 : 1,
            }}
          >
            <Ionicons name="remove" size={16} color={colors.textSecondary} />
          </Pressable>
        </View>
      </Card>
    </View>
  );
}

type FoodTab = 'all' | 'by' | 'ru' | 'my';

function FoodPickerModal({
  visible,
  meal,
  onClose,
  onAdd,
}: {
  visible: boolean;
  meal: MealType;
  onClose: () => void;
  onAdd: (food: Food, grams: number, meal: MealType) => void;
}) {
  const lang = useLang();
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Food | null>(null);
  const [grams, setGrams] = useState('100');
  const [selMeal, setSelMeal] = useState<MealType>(meal);
  const [tab, setTab] = useState<FoodTab>('all');
  const [showCustomForm, setShowCustomForm] = useState(false);
  const [showScanner, setShowScanner] = useState(false);
  const [showTemplates, setShowTemplates] = useState(false);

  const customList = useCustomFoodsStore((s) => s.list);
  const addCustom = useCustomFoodsStore((s) => s.add);
  const removeCustom = useCustomFoodsStore((s) => s.remove);
  const hydrateCustom = useCustomFoodsStore((s) => s.hydrate);

  const templates = useMealTemplatesStore((s) => s.templates);
  const addTemplate = useMealTemplatesStore((s) => s.add);
  const removeTemplate = useMealTemplatesStore((s) => s.remove);

  useEffect(() => {
    hydrateCustom();
  }, [hydrateCustom]);

  useEffect(() => {
    if (visible) {
      setQ('');
      setSelected(null);
      setGrams('100');
      setSelMeal(meal);
      setShowCustomForm(false);
      setTab('all');
    }
  }, [visible, meal]);

  const filtered = useMemo(() => {
    if (tab === 'my') return [...customList];
    if (tab === 'by') return searchFoods(q, 'by');
    if (tab === 'ru') return searchFoods(q, 'ru');
    return searchFoods(q, 'all');
  }, [q, tab, customList]);
  const gramsNum = Math.max(0, parseInt(grams || '0', 10) || 0);
  const macros = selected ? macrosFor(selected, gramsNum) : null;

  const meals: Array<{ key: MealType; label: string }> = [
    { key: 'breakfast', label: t('nutrition.breakfast') },
    { key: 'lunch', label: t('nutrition.lunch') },
    { key: 'dinner', label: t('nutrition.dinner') },
    { key: 'snack', label: t('nutrition.snack') },
  ];

  const foodTabs: Array<{ key: FoodTab; label: string }> = [
    { key: 'all', label: t('foods.tabCommon') },
    { key: 'by', label: t('foods.tabBy') },
    { key: 'ru', label: t('foods.tabRu') },
    { key: 'my', label: `${t('foods.tabMy')} (${customList.length})` },
  ];

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
          backgroundColor: 'rgba(0,0,0,0.78)',
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
              {t('nutrition.pickFood')}
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* meal selector */}
          <View
            style={{
              flexDirection: 'row',
              gap: 6,
              flexWrap: 'wrap',
              marginBottom: 12,
            }}
          >
            {meals.map((m) => {
              const active = selMeal === m.key;
              return (
                <Pressable
                  key={m.key}
                  onPress={() => setSelMeal(m.key)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: active ? colors.borderNeon : colors.border,
                    backgroundColor: active
                      ? 'rgba(157,107,255,0.18)'
                      : colors.bgSecondary,
                  }}
                >
                  <Text
                    style={{
                      color: active ? colors.purpleLight : colors.textSecondary,
                      fontFamily: fontFamilies.body700,
                      fontSize: 12,
                    }}
                  >
                    {m.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* region tabs */}
          <View style={{ flexDirection: 'row', gap: 6, marginBottom: 10 }}>
            {foodTabs.map((ft) => {
              const active = tab === ft.key;
              return (
                <Pressable
                  key={ft.key}
                  onPress={() => {
                    setTab(ft.key);
                    setSelected(null);
                  }}
                  style={{
                    flex: 1,
                    paddingVertical: 8,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: active ? colors.borderNeon : colors.border,
                    backgroundColor: active
                      ? 'rgba(157,107,255,0.18)'
                      : colors.bgSecondary,
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: active ? colors.purpleLight : colors.textSecondary,
                      fontFamily: fontFamilies.body700,
                      fontSize: 10,
                    }}
                  >
                    {ft.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>

          {/* search row + actions */}
          <View style={{ flexDirection: 'row', gap: 8, marginBottom: 10 }}>
            <View
              style={{
                flex: 1,
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.bgSecondary,
                paddingHorizontal: 14,
              }}
            >
              <TextInput
                value={q}
                onChangeText={setQ}
                placeholder={t('nutrition.search')}
                placeholderTextColor={colors.textMuted}
                style={{
                  color: colors.text,
                  fontFamily: fontFamilies.body600,
                  fontSize: 15,
                  height: 46,
                }}
              />
            </View>
            <Pressable
              onPress={() => setShowScanner(true)}
              style={{
                paddingHorizontal: 12,
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: colors.cyan,
                backgroundColor: 'rgba(0,229,255,0.12)',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="barcode-outline" size={18} color={colors.cyan} />
            </Pressable>
            <Pressable
              onPress={() => setShowTemplates((v) => !v)}
              style={{
                paddingHorizontal: 12,
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: showTemplates ? colors.amber : colors.border,
                backgroundColor: showTemplates
                  ? 'rgba(255,181,71,0.16)'
                  : colors.bgSecondary,
                justifyContent: 'center',
              }}
            >
              <Ionicons
                name="bookmarks-outline"
                size={18}
                color={showTemplates ? colors.amber : colors.textSecondary}
              />
            </Pressable>
            <Pressable
              onPress={() => setShowCustomForm((v) => !v)}
              style={{
                paddingHorizontal: 12,
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: showCustomForm ? '#FFB547' : colors.borderNeon,
                backgroundColor: showCustomForm
                  ? 'rgba(255,181,71,0.16)'
                  : 'rgba(157,107,255,0.16)',
                justifyContent: 'center',
              }}
            >
              <Text
                style={{
                  color: showCustomForm ? '#FFB547' : colors.purpleLight,
                  fontFamily: fontFamilies.body700,
                  fontSize: 11,
                }}
              >
                {showCustomForm ? '×' : '+'}
              </Text>
            </Pressable>
          </View>

          {showTemplates ? (
            <View
              style={{
                padding: 12,
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: colors.amber,
                backgroundColor: 'rgba(255,181,71,0.06)',
                marginBottom: 12,
              }}
            >
              <Text
                style={{
                  color: colors.amber,
                  fontFamily: fontFamilies.body700,
                  fontSize: 11,
                  marginBottom: 8,
                }}
              >
                {t('nut.mealTemplates')}
              </Text>
              {templates.length === 0 ? (
                <Text
                  style={{
                    color: colors.textMuted,
                    fontFamily: fontFamilies.body,
                    fontSize: 12,
                  }}
                >
                  {t('nut.noTemplates')}
                </Text>
              ) : (
                templates.map((tpl) => (
                  <View
                    key={tpl.id}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      paddingVertical: 6,
                    }}
                  >
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: colors.text,
                          fontFamily: fontFamilies.body700,
                          fontSize: 13,
                        }}
                      >
                        {tpl.title}
                      </Text>
                      <Text
                        style={{
                          color: colors.textMuted,
                          fontFamily: fontFamilies.body,
                          fontSize: 10,
                          marginTop: 2,
                        }}
                      >
                        {t('nut.productsCount', { n: tpl.items.length })} ·{' '}
                        {Math.round(tpl.totals.calories)} {t('common.kcal')} ·{' '}
                        {t('nut.pShort')} {Math.round(tpl.totals.protein)}{' '}
                        {t('nut.fShort')} {Math.round(tpl.totals.fats)}{' '}
                        {t('nut.cShort')} {Math.round(tpl.totals.carbs)}
                      </Text>
                    </View>
                    <Pressable
                      onPress={() => {
                        // apply all items as one entry per item
                        tpl.items.forEach((it) => {
                          onAdd(
                            {
                              id: `tpl_${tpl.id}_${it.name}`,
                              name: it.name,
                              kcal: Math.round(
                                (it.calories * 100) / Math.max(1, it.grams),
                              ),
                              protein: it.protein,
                              fats: it.fats,
                              carbs: it.carbs,
                              category: 'other',
                            } as any,
                            it.grams,
                            selMeal,
                          );
                        });
                        setShowTemplates(false);
                      }}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: colors.amber,
                        backgroundColor: 'rgba(255,181,71,0.18)',
                      }}
                    >
                      <Text
                        style={{
                          color: colors.amber,
                          fontFamily: fontFamilies.body700,
                          fontSize: 11,
                        }}
                      >
                        {t('common.apply')}
                      </Text>
                    </Pressable>
                    <Pressable
                      onPress={() => removeTemplate(tpl.id)}
                      hitSlop={8}
                      style={{ marginLeft: 6 }}
                    >
                      <Ionicons
                        name="trash-outline"
                        size={14}
                        color={colors.pink}
                      />
                    </Pressable>
                  </View>
                ))
              )}
            </View>
          ) : null}

          {showCustomForm ? (
            <CustomFoodForm
              defaultMeal={selMeal}
              onSave={(food, grams) => {
                const saved = addCustom(food);
                onAdd(saved, grams, selMeal);
              }}
              onCancel={() => setShowCustomForm(false)}
            />
          ) : null}

          {selected ? (
            <View
              style={{
                padding: 14,
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: colors.borderNeon,
                backgroundColor: 'rgba(157,107,255,0.12)',
                marginBottom: 12,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 8,
                }}
              >
                <Text
                  style={{
                    flex: 1,
                    color: colors.text,
                    fontFamily: fontFamilies.body700,
                    fontSize: 14,
                  }}
                >
                  {selected.emoji ?? ''} {selected.name}
                </Text>
                <Pressable onPress={() => setSelected(null)} hitSlop={8}>
                  <Ionicons name="close" size={18} color={colors.textMuted} />
                </Pressable>
              </View>
              <View
                style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}
              >
                <Text
                  style={{
                    color: colors.textMuted,
                    fontFamily: fontFamilies.body500,
                    fontSize: 11,
                  }}
                >
                  {t('nutrition.grams').toUpperCase()}
                </Text>
                <TextInput
                  value={grams}
                  onChangeText={setGrams}
                  keyboardType="number-pad"
                  style={{
                    flex: 1,
                    color: colors.text,
                    fontFamily: fontFamilies.body700,
                    fontSize: 16,
                    height: 40,
                    borderRadius: 10,
                    borderWidth: 1,
                    borderColor: colors.border,
                    paddingHorizontal: 12,
                    backgroundColor: 'rgba(0,0,0,0.3)',
                  }}
                />
              </View>
              {macros ? (
                <View style={{ marginTop: 10, flexDirection: 'row', gap: 12 }}>
                  <MacroPill
                    label={t('common.kcal')}
                    value={macros.calories}
                    tint={colors.amber}
                  />
                  <MacroPill
                    label={t('nut.pShort')}
                    value={macros.protein}
                    tint={colors.blue}
                  />
                  <MacroPill
                    label={t('nut.fShort')}
                    value={macros.fats}
                    tint={colors.pink}
                  />
                  <MacroPill
                    label={t('nut.cShort')}
                    value={macros.carbs}
                    tint={colors.purpleLight}
                  />
                </View>
              ) : null}
              <View style={{ marginTop: 14 }}>
                <GradientButton
                  title={t('nutrition.save')}
                  onPress={() => {
                    if (gramsNum <= 0) {
                      Alert.alert(t('common.error'), 'g > 0');
                      return;
                    }
                    onAdd(selected, gramsNum, selMeal);
                  }}
                />
              </View>
            </View>
          ) : null}

          <BarcodeScannerModal
            visible={showScanner}
            onClose={() => setShowScanner(false)}
            onProduct={(p) => {
              const food: Food = {
                id: `bc_${p.barcode}`,
                name: p.name,
                kcal: p.kcal,
                protein: p.protein,
                fats: p.fats,
                carbs: p.carbs,
                category: 'other',
                brand: p.brand,
                emoji: '📦',
              };
              // Saving в кастомные, чтобы появилось в Мои
              const saved = addCustom(food);
              setSelected(saved);
              setShowScanner(false);
            }}
          />

          {/* список продуктов */}
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 360 }}
          >
            {filtered.map((f) => (
              <Pressable
                key={f.id}
                onPress={() => setSelected(f)}
                onLongPress={() => {
                  if (tab === 'my' || (f as any).custom) {
                    Alert.alert(f.name, t('foods.delMy'), [
                      { text: t('common.cancel'), style: 'cancel' },
                      {
                        text: t('common.delete'),
                        style: 'destructive',
                        onPress: () => removeCustom(f.id),
                      },
                    ]);
                  }
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: 18 }}>{f.emoji ?? '🍽'}</Text>
                <View style={{ flex: 1 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 6,
                    }}
                  >
                    <Text
                      style={{
                        color: colors.text,
                        fontFamily: fontFamilies.body600,
                        fontSize: 14,
                      }}
                    >
                      {localizedFoodName(f, lang)}
                    </Text>
                    {(f as any).custom ? (
                      <Text
                        style={{
                          color: colors.amber,
                          fontSize: 10,
                          fontFamily: fontFamilies.body700,
                        }}
                      >
                        ★
                      </Text>
                    ) : null}
                  </View>
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontFamily: fontFamilies.body,
                      fontSize: 11,
                      marginTop: 2,
                    }}
                  >
                    {f.kcal} {t('common.kcal')} · {t('nut.pShort')} {f.protein}{' '}
                    · {t('nut.fShort')} {f.fats} · {t('nut.cShort')} {f.carbs}{' '}
                    {t('nut.per100g')}
                    {f.brand ? ` · ${f.brand}` : ''}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={18}
                  color={colors.textMuted}
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
                {tab === 'my' ? t('foods.myEmpty') : '—'}
              </Text>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

function CustomFoodForm({
  defaultMeal: _meal,
  onSave,
  onCancel,
}: {
  defaultMeal: MealType;
  onSave: (food: Omit<Food, 'id'>, grams: number) => void;
  onCancel: () => void;
}) {
  const [name, setName] = useState('');
  const [kcal, setKcal] = useState('');
  const [protein, setProtein] = useState('');
  const [fats, setFats] = useState('');
  const [carbs, setCarbs] = useState('');
  const [grams, setGrams] = useState('100');

  const ok = name.trim().length > 0 && parseInt(kcal || '0', 10) > 0;

  return (
    <View
      style={{
        padding: 14,
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: '#FFB547',
        backgroundColor: 'rgba(255,181,71,0.08)',
        marginBottom: 12,
      }}
    >
      <Text
        style={{
          color: '#FFB547',
          fontFamily: fontFamilies.body700,
          fontSize: 12,
          marginBottom: 8,
        }}
      >
        {t('foods.customTitle')}
      </Text>
      <Text
        style={{
          color: colors.textMuted,
          fontFamily: fontFamilies.body,
          fontSize: 11,
          marginBottom: 8,
        }}
      >
        {t('foods.savedToMy')}
      </Text>

      <TextInput
        value={name}
        onChangeText={setName}
        placeholder={t('foods.customNamePh')}
        placeholderTextColor={colors.textMuted}
        style={{
          color: colors.text,
          fontFamily: fontFamilies.body600,
          fontSize: 14,
          height: 42,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 12,
          backgroundColor: 'rgba(0,0,0,0.3)',
          marginBottom: 8,
        }}
      />

      <View style={{ flexDirection: 'row', gap: 6, marginBottom: 8 }}>
        <NutInput label={t('foods.kcal100')} value={kcal} onChange={setKcal} />
        <NutInput
          label={t('foods.protein100')}
          value={protein}
          onChange={setProtein}
        />
        <NutInput label={t('foods.fats100')} value={fats} onChange={setFats} />
        <NutInput
          label={t('foods.carbs100')}
          value={carbs}
          onChange={setCarbs}
        />
      </View>

      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          marginBottom: 10,
        }}
      >
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: fontFamilies.body500,
            fontSize: 11,
          }}
        >
          {t('nutrition.grams').toUpperCase()}
        </Text>
        <TextInput
          value={grams}
          onChangeText={setGrams}
          keyboardType="number-pad"
          style={{
            flex: 1,
            color: colors.text,
            fontFamily: fontFamilies.body700,
            fontSize: 15,
            height: 40,
            borderRadius: 10,
            borderWidth: 1,
            borderColor: colors.border,
            paddingHorizontal: 12,
            backgroundColor: 'rgba(0,0,0,0.3)',
          }}
        />
      </View>

      <View style={{ flexDirection: 'row', gap: 8 }}>
        <Pressable
          onPress={onCancel}
          style={{
            flex: 1,
            paddingVertical: 12,
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
            {t('common.cancel')}
          </Text>
        </Pressable>
        <Pressable
          disabled={!ok}
          onPress={() => {
            const food: Omit<Food, 'id'> = {
              name: name.trim(),
              kcal: parseInt(kcal || '0', 10) || 0,
              protein: parseFloat(protein || '0') || 0,
              fats: parseFloat(fats || '0') || 0,
              carbs: parseFloat(carbs || '0') || 0,
              category: 'other',
              emoji: '⭐',
            };
            onSave(food, Math.max(1, parseInt(grams || '100', 10) || 100));
          }}
          style={{
            flex: 1,
            paddingVertical: 12,
            borderRadius: 12,
            borderWidth: 1,
            borderColor: ok ? '#FFB547' : colors.border,
            backgroundColor: ok ? 'rgba(255,181,71,0.22)' : colors.bgSecondary,
            alignItems: 'center',
            opacity: ok ? 1 : 0.5,
          }}
        >
          <Text
            style={{
              color: ok ? '#FFB547' : colors.textMuted,
              fontFamily: fontFamilies.body700,
              fontSize: 12,
            }}
          >
            {t('foods.saveCustom')}
          </Text>
        </Pressable>
      </View>
    </View>
  );
}

function NutInput({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (s: string) => void;
}) {
  return (
    <View style={{ flex: 1 }}>
      <Text
        style={{
          color: colors.textMuted,
          fontFamily: fontFamilies.body500,
          fontSize: 9,
          marginBottom: 4,
          letterSpacing: 0.5,
        }}
      >
        {label}
      </Text>
      <TextInput
        value={value}
        onChangeText={onChange}
        keyboardType="decimal-pad"
        style={{
          color: colors.text,
          fontFamily: fontFamilies.body700,
          fontSize: 13,
          height: 38,
          borderRadius: 10,
          borderWidth: 1,
          borderColor: colors.border,
          paddingHorizontal: 8,
          backgroundColor: 'rgba(0,0,0,0.3)',
          textAlign: 'center',
        }}
      />
    </View>
  );
}

function MacroPill({
  label,
  value,
  tint,
}: {
  label: string;
  value: number;
  tint: string;
}) {
  return (
    <View
      style={{
        flex: 1,
        padding: 8,
        borderRadius: 10,
        borderWidth: 1,
        borderColor: tint + '55',
        backgroundColor: 'rgba(0,0,0,0.25)',
        alignItems: 'center',
      }}
    >
      <Text
        style={{
          color: colors.textMuted,
          fontFamily: fontFamilies.body500,
          fontSize: 10,
          letterSpacing: 1,
        }}
      >
        {label.toUpperCase()}
      </Text>
      <Text
        style={{
          marginTop: 2,
          color: tint,
          fontFamily: fontFamilies.body700,
          fontSize: 14,
        }}
      >
        {value}
      </Text>
    </View>
  );
}
