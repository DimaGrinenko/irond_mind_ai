import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../components/common/Card';
import { colors, gradients, radii, spacing } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { programs } from '../data/programs';
import { photos } from '../theme/photos';
import { AnimatedPhoto } from '../components/anim/AnimatedPhoto';

function programPhoto(id: string) {
  const key = `program_${id}` as keyof typeof photos;
  return photos[key] ?? null;
}

type TabKey = 'Мои' | 'Рекомендуемые' | 'Популярные' | 'Новые';

function accentGrad(accent: 'purple' | 'pink' | 'blue' | 'green') {
  if (accent === 'pink') return ['#7B3FE4', '#FF3FCB'];
  if (accent === 'blue') return ['#3FA8FF', '#7B3FE4'];
  if (accent === 'green') return ['#3FFF8F', '#7B3FE4'];
  return gradients.PRIMARY;
}

function accentGradStop(accent: 'purple' | 'pink' | 'blue' | 'green') {
  if (accent === 'pink') return 'rgba(123,63,228,0.85)';
  if (accent === 'blue') return 'rgba(63,168,255,0.78)';
  if (accent === 'green') return 'rgba(63,255,143,0.55)';
  return 'rgba(123,63,228,0.85)';
}

export function ProgramsScreen() {
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState<TabKey>('Рекомендуемые');

  const featured = useMemo(() => programs.find((p) => p.id === 'relief') ?? programs[0], []);
  const others = useMemo(() => programs.filter((p) => p.id !== featured.id), [featured.id]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView contentContainerStyle={{ paddingBottom: 112 }} showsVerticalScrollIndicator={false}>
        <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, flexDirection: 'row', alignItems: 'center' }}>
          <Pressable
            onPress={() => nav.navigate('RootTabs', { screen: 'Home' })}
            accessibilityRole="button"
            accessibilityLabel="Назад"
            hitSlop={12}
            style={{ paddingVertical: 8, paddingRight: 10 }}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 18 }}>Программы</Text>
          </View>
          <Pressable
            onPress={() => nav.navigate('Calendar')}
            style={{ paddingVertical: 8, paddingLeft: 10 }}
          >
            <Ionicons name="calendar-outline" size={20} color={colors.textSecondary} />
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12, flexDirection: 'row', justifyContent: 'space-between' }}>
          {(['Мои', 'Рекомендуемые', 'Популярные', 'Новые'] as TabKey[]).map((t) => {
            const active = t === tab;
            return (
              <Pressable key={t} onPress={() => setTab(t)} style={{ paddingVertical: 10 }}>
                <Text style={{ color: active ? colors.text : colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>
                  {t}
                </Text>
                <View
                  style={{
                    marginTop: 8,
                    height: 2,
                    borderRadius: 2,
                    backgroundColor: active ? colors.purpleLight : 'transparent',
                  }}
                />
              </Pressable>
            );
          })}
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <Card style={{ padding: 0, overflow: 'hidden', borderRadius: 22 }}>
            <LinearGradient colors={accentGrad(featured.accent) as any} start={{ x: 0, y: 0 }} end={{ x: 1, y: 1 }}>
              <View style={{ padding: 16, minHeight: 210 }}>
                {programPhoto(featured.id) ? (
                  <View
                    style={{
                      position: 'absolute',
                      right: 0,
                      top: 0,
                      bottom: 0,
                      width: 200,
                      borderTopRightRadius: 22,
                      borderBottomRightRadius: 22,
                      overflow: 'hidden',
                    }}
                  >
                    <AnimatedPhoto source={programPhoto(featured.id) as any} duration={9000} />
                    <LinearGradient
                      colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.05)', accentGradStop(featured.accent)] as any}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                    />
                    <LinearGradient
                      colors={[accentGradStop(featured.accent), 'rgba(0,0,0,0)'] as any}
                      start={{ x: 0, y: 0.5 }}
                      end={{ x: 1, y: 0.5 }}
                      style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 80 }}
                    />
                  </View>
                ) : (
                  <View
                    style={{
                      position: 'absolute',
                      right: -10,
                      top: 10,
                      width: 160,
                      height: 190,
                      borderRadius: 28,
                      backgroundColor: 'rgba(0,0,0,0.25)',
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.12)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name={featured.icon as any} size={72} color="rgba(255,255,255,0.22)" />
                  </View>
                )}

                <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 28 }}>{featured.title}</Text>
                <Text style={{ marginTop: 6, color: colors.text, fontFamily: fontFamilies.body600 }}>
                  {featured.weeks} недель
                </Text>
                <Text style={{ marginTop: 6, color: 'rgba(255,255,255,0.85)', fontFamily: fontFamilies.body, maxWidth: 190 }}>
                  {featured.subtitle}
                </Text>

                <View style={{ marginTop: 12, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                  <Text style={{ color: 'rgba(255,255,255,0.75)', fontFamily: fontFamilies.body600, fontSize: 12 }}>
                    Сложность
                  </Text>
                  <View style={{ flexDirection: 'row', gap: 6 }}>
                    {[0, 1, 2].map((i) => (
                      <View
                        key={i}
                        style={{
                          width: 6,
                          height: 6,
                          borderRadius: 3,
                          backgroundColor: i < (featured.level === 'Базовый' ? 1 : featured.level === 'Средний' ? 2 : 3) ? colors.text : 'rgba(255,255,255,0.28)',
                        }}
                      />
                    ))}
                  </View>
                </View>

                <Pressable
                  onPress={() => nav.navigate('ProgramDetail', { programId: featured.id })}
                  style={{ marginTop: 16, borderRadius: radii.md, overflow: 'hidden' }}
                >
                  <LinearGradient colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.25)']}>
                    <View
                      style={{
                        height: 46,
                        borderRadius: radii.md,
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.18)',
                      }}
                    >
                      <Text style={{ color: colors.text, fontFamily: fontFamilies.body700 }}>Выбрать программу</Text>
                    </View>
                  </LinearGradient>
                </Pressable>
              </View>
            </LinearGradient>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>Другие программы</Text>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 10, gap: 12 }}>
          {others.map((p) => (
            <Pressable
              key={p.id}
              onPress={() => nav.navigate('ProgramDetail', { programId: p.id })}
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
              {programPhoto(p.id) ? (
                <View style={{ width: 90, height: 86, overflow: 'hidden' }}>
                  <AnimatedPhoto source={programPhoto(p.id) as any} duration={11000} />
                  <LinearGradient
                    colors={[accentGradStop(p.accent), 'rgba(0,0,0,0)'] as any}
                    start={{ x: 0, y: 0.5 }}
                    end={{ x: 1, y: 0.5 }}
                    style={{ position: 'absolute', left: 0, top: 0, bottom: 0, width: 36 }}
                  />
                </View>
              ) : (
                <LinearGradient colors={accentGrad(p.accent) as any} style={{ width: 90, height: 86, alignItems: 'center', justifyContent: 'center' }}>
                  <Ionicons name={p.icon as any} size={32} color="rgba(255,255,255,0.85)" />
                </LinearGradient>
              )}
              <View style={{ flex: 1, paddingHorizontal: 14 }}>
                <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 15 }}>{p.title}</Text>
                <Text style={{ marginTop: 4, color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 12 }}>
                  {p.weeks} недель · {p.subtitle}
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
