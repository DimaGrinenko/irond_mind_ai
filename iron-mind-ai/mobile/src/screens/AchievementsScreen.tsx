import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { RingChart } from '../components/charts/RingChart';
import { ProgressBar } from '../components/common/ProgressBar';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { achievements } from '../data/achievements';
import { colors, neonGlow, neonTextShadow } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import {
  WEEKLY_GOAL,
  levelForXp,
  levelProgress,
  useProgressStore,
  xpInLevel,
  XP_PER_LEVEL,
} from '../store/progressStore';

function StatTile({ icon, label, value, tint }: { icon: keyof typeof Ionicons.glyphMap; label: string; value: string; tint: string }) {
  return (
    <View
      style={{
        flex: 1,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: 'rgba(42,42,62,0.9)',
        backgroundColor: 'rgba(15,15,26,0.55)',
        paddingVertical: 12,
        alignItems: 'center',
        gap: 4,
      }}
    >
      <Ionicons name={icon} size={18} color={tint} />
      <Text style={[{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 18 }, neonTextShadow(tint, 8)]}>
        {value}
      </Text>
      <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 11 }}>{label}</Text>
    </View>
  );
}

export function AchievementsScreen({ navigation }: any) {
  const xp = useProgressStore((s) => s.xp);
  const streak = useProgressStore((s) => s.streak);
  const bestStreak = useProgressStore((s) => s.bestStreak);
  const totalWorkouts = useProgressStore((s) => s.totalWorkouts);
  const weekWorkouts = useProgressStore((s) => s.weekWorkouts);

  const level = levelForXp(xp);
  const progress = levelProgress(xp);
  const inLevel = xpInLevel(xp);
  const weekProgress = Math.min(1, weekWorkouts / WEEKLY_GOAL);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Достижения" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* ===== Карточка уровня ===== */}
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <LinearGradient colors={['rgba(157,107,255,0.26)', 'rgba(0,0,0,0)']} style={{ padding: 18 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 18 }}>
                <View style={{ width: 110, height: 110, alignItems: 'center', justifyContent: 'center' }}>
                  <RingChart size={110} strokeWidth={9} progress={progress} />
                  <View style={{ position: 'absolute', alignItems: 'center' }}>
                    <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body600, fontSize: 10, letterSpacing: 1 }}>
                      УРОВЕНЬ
                    </Text>
                    <Text
                      style={[
                        { color: colors.text, fontFamily: fontFamilies.heading, fontSize: 34 },
                        neonTextShadow('rgba(157,107,255,0.8)', 14),
                      ]}
                    >
                      {level}
                    </Text>
                  </View>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={[{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 17 }, neonTextShadow(colors.purple, 10)]}>
                    Кибер-атлет
                  </Text>
                  <Text style={{ marginTop: 4, color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 12 }}>
                    {inLevel} / {XP_PER_LEVEL} XP до уровня {level + 1}
                  </Text>
                  <View style={{ marginTop: 10 }}>
                    <ProgressBar value={progress} color={colors.purpleLight} />
                  </View>
                  <Text style={{ marginTop: 8, color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 11 }}>
                    Всего опыта: {xp} XP
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: 'row', gap: 10, marginTop: 16 }}>
                <StatTile icon="flame" label="Серия" value={`${streak}`} tint={colors.amber} />
                <StatTile icon="ribbon" label="Рекорд" value={`${bestStreak}`} tint={colors.pink} />
                <StatTile icon="barbell" label="Тренировок" value={`${totalWorkouts}`} tint={colors.cyan} />
              </View>
            </LinearGradient>
          </Card>
        </View>

        {/* ===== Челлендж недели ===== */}
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card variant="secondary">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
              <View
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: 'rgba(63,255,150,0.5)',
                  backgroundColor: 'rgba(63,255,150,0.1)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="trophy" size={20} color={colors.green} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>Челлендж недели</Text>
                <Text style={{ marginTop: 2, color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 12 }}>
                  {weekWorkouts} из {WEEKLY_GOAL} тренировок
                </Text>
              </View>
              {weekProgress >= 1 ? (
                <Ionicons name="checkmark-circle" size={26} color={colors.green} />
              ) : (
                <Text style={{ color: colors.green, fontFamily: fontFamilies.body700, fontSize: 16 }}>
                  {Math.round(weekProgress * 100)}%
                </Text>
              )}
            </View>
            <View style={{ marginTop: 12 }}>
              <ProgressBar value={weekProgress} color={colors.green} />
            </View>
          </Card>
        </View>

        {/* ===== Сетка достижений ===== */}
        <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>Награды</Text>
        </View>
        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 10,
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: 12,
          }}
        >
          {achievements.map((a) => {
            const unlocked = a.progress >= 1;
            return (
              <View
                key={a.id}
                style={{
                  width: '47%',
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: unlocked ? 'rgba(157,107,255,0.5)' : 'rgba(42,42,62,0.9)',
                  backgroundColor: 'rgba(15,15,26,0.6)',
                  padding: 14,
                  ...(unlocked ? neonGlow(colors.purple, 0.35, 16, 6) : null),
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: 14,
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: unlocked ? 'rgba(157,107,255,0.6)' : 'rgba(42,42,62,0.9)',
                    backgroundColor: unlocked ? 'rgba(157,107,255,0.14)' : 'rgba(0,0,0,0.25)',
                  }}
                >
                  <Ionicons
                    name={a.icon as keyof typeof Ionicons.glyphMap}
                    size={20}
                    color={unlocked ? colors.purpleLight : colors.textMuted}
                  />
                </View>
                <Text
                  style={{
                    marginTop: 10,
                    color: unlocked ? colors.text : colors.textSecondary,
                    fontFamily: fontFamilies.body700,
                    fontSize: 13,
                  }}
                >
                  {a.title}
                </Text>
                <Text style={{ marginTop: 2, color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11 }}>
                  {a.subtitle}
                </Text>
                <View style={{ marginTop: 10 }}>
                  <ProgressBar value={a.progress} color={unlocked ? colors.purpleLight : colors.textMuted} />
                </View>
              </View>
            );
          })}
        </View>
      </ScrollView>
    </View>
  );
}
