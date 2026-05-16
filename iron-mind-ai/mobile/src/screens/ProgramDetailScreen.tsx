import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { Card } from '../components/common/Card';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { programs } from '../data/programs';
import { exercises } from '../data/exercises';

type R = RouteProp<RootStackParamList, 'ProgramDetail'>;

export function ProgramDetailScreen({ navigation }: any) {
  const route = useRoute<R>();
  const program = useMemo(() => programs.find((p) => p.id === route.params.programId) ?? programs[0], [route.params.programId]);

  const sample = useMemo(() => exercises.slice(0, 6), []);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Программа" onBack={() => navigation.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 110 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card style={{ padding: 0, overflow: 'hidden', borderRadius: 22 }}>
            <LinearGradient colors={['#4F1FB8', '#7B3FE4', '#FF3FCB'] as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={{ padding: 16, minHeight: 190 }}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View>
                    <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 26 }}>{program.title}</Text>
                    <Text style={{ marginTop: 6, color: 'rgba(255,255,255,0.85)', fontFamily: fontFamilies.body600 }}>
                      {program.weeks} недель · {program.level}
                    </Text>
                  </View>
                  <View
                    style={{
                      width: 72,
                      height: 72,
                      borderRadius: 22,
                      backgroundColor: 'rgba(0,0,0,0.22)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.14)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={program.icon as any} size={34} color="rgba(255,255,255,0.90)" />
                  </View>
                </View>

                <Text style={{ marginTop: 10, color: 'rgba(255,255,255,0.85)', fontFamily: fontFamilies.body, maxWidth: 260 }}>
                  {program.subtitle}
                </Text>

                <Pressable
                  onPress={() => navigation.navigate('Workout')}
                  style={{
                    marginTop: 16,
                    height: 52,
                    borderRadius: radii.md,
                    backgroundColor: 'rgba(0,0,0,0.22)',
                    borderWidth: 1,
                    borderColor: 'rgba(255,255,255,0.18)',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text style={{ color: colors.text, fontFamily: fontFamilies.body700 }}>Начать по программе</Text>
                </Pressable>
              </View>
            </LinearGradient>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>
            Пример упражнений
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 10, gap: 12 }}>
          {sample.map((e) => (
            <Pressable
              key={e.id}
              onPress={() => navigation.navigate('ExerciseDetail', { exerciseId: e.id })}
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
              <View
                style={{
                  width: 90,
                  height: 86,
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: 'rgba(123,63,228,0.18)',
                  borderRightWidth: 1,
                  borderRightColor: 'rgba(42,42,62,0.9)',
                }}
              >
                <Ionicons name="barbell" size={28} color={colors.purpleLight} />
              </View>
              <View style={{ flex: 1, paddingHorizontal: 14 }}>
                <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 15 }}>{e.name}</Text>
                <Text style={{ marginTop: 4, color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 12 }}>
                  {e.primary} · {e.difficulty}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={22} color={colors.textMuted} style={{ marginRight: 12 }} />
            </Pressable>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

