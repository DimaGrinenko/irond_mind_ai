import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors, glow, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';

type Plan = { id: '1m' | '3m' | '12m'; label: string; price: number; oldPrice?: number; badge?: string };

const plans: Plan[] = [
  { id: '1m', label: '1 месяц', price: 899 },
  { id: '3m', label: '3 месяца', price: 2290, oldPrice: 2690, badge: '-15%' },
  { id: '12m', label: '12 месяцев', price: 7990, oldPrice: 15980, badge: '-50%' },
];

export function SubscriptionScreen({ navigation }: any) {
  const [selected, setSelected] = useState<Plan['id']>('12m');
  const current = useMemo(() => plans.find((p) => p.id === selected) ?? plans[0], [selected]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Подписка" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <LinearGradient colors={['rgba(79,31,184,0.22)', 'rgba(0,0,0,0.95)']} style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                <View
                  style={{
                    width: 34,
                    height: 34,
                    borderRadius: 12,
                    backgroundColor: 'rgba(255,255,255,0.06)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.12)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name="trophy" size={18} color="#F8D14A" />
                </View>
                <View>
                  <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 16 }}>Премиум</Text>
                  <Text style={{ marginTop: 2, color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>
                    Доступ ко всем функциям
                  </Text>
                </View>
              </View>

              <View style={{ marginTop: 14, gap: 10 }}>
                {[
                  'Все программы тренировок',
                  'AI чат без ограничений',
                  'Планы питания',
                  'Аналитика прогресса',
                  'Видео упражнений',
                  'Индивидуальные рекомендации',
                  'Приоритетная поддержка',
                ].map((t) => (
                  <View key={t} style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Ionicons name="star" size={14} color="#F8D14A" />
                    <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>{t}</Text>
                  </View>
                ))}
              </View>

              <View style={{ marginTop: 16, flexDirection: 'row', gap: 12 }}>
                <View style={{ flex: 1, gap: 10 }}>
                  {plans.map((p) => {
                    const active = p.id === selected;
                    return (
                      <Pressable
                        key={p.id}
                        onPress={() => setSelected(p.id)}
                        style={{
                          paddingVertical: 10,
                          paddingHorizontal: 12,
                          borderRadius: 14,
                          borderWidth: 1,
                          borderColor: active ? 'rgba(123,63,228,0.65)' : 'rgba(42,42,62,0.9)',
                          backgroundColor: active ? 'rgba(123,63,228,0.14)' : 'rgba(15,15,26,0.55)',
                        }}
                      >
                        <Text style={{ color: active ? colors.text : colors.textSecondary, fontFamily: fontFamilies.body700, fontSize: 12 }}>
                          {p.label}
                        </Text>
                      </Pressable>
                    );
                  })}
                </View>

                <View
                  style={{
                    width: 150,
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: 'rgba(123,63,228,0.65)',
                    backgroundColor: 'rgba(15,15,26,0.55)',
                    padding: 12,
                    ...glow,
                  }}
                >
                  <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12, textAlign: 'right' }}>
                    {current.price} ₽
                  </Text>
                  {current.oldPrice ? (
                    <Text style={{ marginTop: 6, color: 'rgba(255,255,255,0.35)', fontFamily: fontFamilies.body600, fontSize: 12, textAlign: 'right', textDecorationLine: 'line-through' }}>
                      {current.oldPrice} ₽
                    </Text>
                  ) : null}

                  <View style={{ flex: 1 }} />
                  <Text style={{ marginTop: 28, color: colors.textMuted, fontFamily: fontFamilies.body600, fontSize: 11 }}>
                    Лучший выбор
                  </Text>

                  {current.badge ? (
                    <View
                      style={{
                        position: 'absolute',
                        right: 10,
                        bottom: 10,
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 999,
                        backgroundColor: 'rgba(248,209,74,0.18)',
                        borderWidth: 1,
                        borderColor: 'rgba(248,209,74,0.45)',
                      }}
                    >
                      <Text style={{ color: '#F8D14A', fontFamily: fontFamilies.body700, fontSize: 11 }}>{current.badge}</Text>
                    </View>
                  ) : null}
                </View>
              </View>
            </LinearGradient>
          </Card>
        </View>
      </ScrollView>

      <View style={{ position: 'absolute', left: 16, right: 16, bottom: 18 }}>
        <GradientButton
          title="Оформить подписку"
          onPress={() =>
            Alert.alert(
              'Подписка',
              `Вы выбрали тариф "${current.label}" за ${current.price} ₽. Оплата будет доступна в релизной версии.`,
              [{ text: 'Понятно' }],
            )
          }
          rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.text} />}
        />
      </View>
    </View>
  );
}

