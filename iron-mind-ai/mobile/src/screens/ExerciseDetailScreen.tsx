import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { BodyFigure } from '../components/anatomy/BodyFigure';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { exercises } from '../data/exercises';

type R = RouteProp<RootStackParamList, 'ExerciseDetail'>;

export function ExerciseDetailScreen({ navigation }: any) {
  const route = useRoute<R>();
  const ex = useMemo(() => exercises.find((e) => e.id === route.params.exerciseId) ?? exercises[0], [route.params.exerciseId]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={ex.name}
        onBack={() => navigation.goBack()}
        right={
          <Pressable
            onPress={() => Alert.alert('Видео', 'Видео упражнения скоро добавим.')}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 10,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: 'rgba(42,42,62,0.9)',
              backgroundColor: 'rgba(15,15,26,0.55)',
            }}
          >
            <Ionicons name="play" size={14} color={colors.textSecondary} />
            <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>Видео</Text>
          </Pressable>
        }
      />

      <ScrollView contentContainerStyle={{ paddingBottom: 130 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <LinearGradient colors={['rgba(79,31,184,0.22)', 'rgba(0,0,0,0)']} style={{ padding: 16 }}>
              <View style={{ flexDirection: 'row', gap: 10, alignItems: 'center' }}>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: 'rgba(42,42,62,0.9)',
                    backgroundColor: 'rgba(15,15,26,0.55)',
                  }}
                >
                  <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>{ex.primary}</Text>
                </View>
                <View
                  style={{
                    paddingHorizontal: 10,
                    paddingVertical: 6,
                    borderRadius: 999,
                    borderWidth: 1,
                    borderColor: 'rgba(42,42,62,0.9)',
                    backgroundColor: 'rgba(15,15,26,0.55)',
                  }}
                >
                  <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>
                    {ex.difficulty} упражнение
                  </Text>
                </View>
              </View>

              <View style={{ marginTop: 12, borderRadius: 18, overflow: 'hidden', borderWidth: 1, borderColor: 'rgba(42,42,62,0.9)' }}>
                <View style={{ height: 168, backgroundColor: 'rgba(0,0,0,0.35)', alignItems: 'center', justifyContent: 'center' }}>
                  <View
                    style={{
                      width: 56,
                      height: 56,
                      borderRadius: 28,
                      backgroundColor: 'rgba(0,0,0,0.45)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.18)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="play" size={22} color={colors.text} />
                  </View>
                </View>
              </View>

              <View style={{ marginTop: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
                <View style={{ width: 140, alignItems: 'center' }}>
                  <BodyFigure
                    width={120}
                    height={160}
                    highlights={{
                      chest: ex.primary === 'Грудь' ? colors.pink : 'rgba(255,255,255,0.06)',
                      back: ex.primary === 'Спина' ? colors.blue : 'rgba(255,255,255,0.04)',
                      shoulders: ex.primary === 'Плечи' ? colors.purpleLight : 'rgba(255,255,255,0.04)',
                      arms: ex.primary === 'Бицепс' || ex.primary === 'Трицепс' ? colors.red : 'rgba(255,255,255,0.04)',
                      legs: ex.primary === 'Ноги' ? colors.green : 'rgba(255,255,255,0.03)',
                      core: ex.primary === 'Пресс' ? '#F8D14A' : 'rgba(255,255,255,0.03)',
                    }}
                  />
                </View>

                <View style={{ flex: 1, paddingLeft: 12 }}>
                  <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 12 }}>Рабочие мышцы</Text>
                  <View style={{ marginTop: 8, gap: 6 }}>
                    {[ex.primary, ...ex.secondary].slice(0, 3).map((m) => (
                      <View key={m} style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                        <View style={{ width: 6, height: 6, borderRadius: 3, backgroundColor: colors.pink }} />
                        <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>{m}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <Card variant="card">
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              {['Инструкция', 'Техника', 'Советы'].map((t, i) => (
                <View key={t} style={{ alignItems: 'center', flex: 1 }}>
                  <Text style={{ color: i === 0 ? colors.text : colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>{t}</Text>
                  <View style={{ marginTop: 10, height: 2, width: '70%', backgroundColor: i === 0 ? colors.purpleLight : 'transparent', borderRadius: 2 }} />
                </View>
              ))}
            </View>

            <View style={{ marginTop: 10, gap: 10 }}>
              {ex.steps.slice(0, 4).map((s, idx) => (
                <View key={s} style={{ flexDirection: 'row', gap: 10 }}>
                  <View
                    style={{
                      width: 22,
                      height: 22,
                      borderRadius: 11,
                      borderWidth: 1,
                      borderColor: 'rgba(123,63,228,0.6)',
                      backgroundColor: 'rgba(123,63,228,0.15)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 11 }}>{idx + 1}</Text>
                  </View>
                  <Text style={{ flex: 1, color: colors.textSecondary, fontFamily: fontFamilies.body }}>{s}</Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <Card variant="secondary" style={{ paddingVertical: 14 }}>
            <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 13 }}>Подходы</Text>
            <View style={{ marginTop: 10, gap: 10 }}>
              {[1, 2, 3, 4].map((n, idx) => (
                <View
                  key={n}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 14,
                    borderWidth: 1,
                    borderColor: 'rgba(42,42,62,0.9)',
                    backgroundColor: 'rgba(15,15,26,0.55)',
                    paddingVertical: 10,
                    paddingHorizontal: 12,
                  }}
                >
                  <Text style={{ width: 24, color: colors.textSecondary, fontFamily: fontFamilies.body600 }}>{n}</Text>
                  <Text style={{ flex: 1, color: colors.text, fontFamily: fontFamilies.body600 }}>
                    {idx === 0 ? '20 кг' : idx === 1 ? '60 кг' : '70 кг'}
                  </Text>
                  <Text style={{ width: 36, textAlign: 'right', color: colors.textSecondary, fontFamily: fontFamilies.body600 }}>
                    {idx === 0 ? '12' : idx === 1 ? '10' : '8'}
                  </Text>
                  <Ionicons name={idx === 3 ? 'checkmark-circle' : 'ellipse-outline'} size={18} color={idx === 3 ? colors.green : 'rgba(255,255,255,0.22)'} style={{ marginLeft: 10 }} />
                </View>
              ))}
            </View>
          </Card>
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 18,
        }}
      >
        <GradientButton title="Записать результат" onPress={() => navigation.navigate('Workout')} />
      </View>
    </View>
  );
}

