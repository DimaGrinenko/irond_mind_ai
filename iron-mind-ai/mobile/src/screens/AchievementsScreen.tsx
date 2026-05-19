import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { captureRef } from 'react-native-view-shot';
import * as Sharing from 'expo-sharing';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { ShareCard } from '../components/achievements/ShareCard';
import {
  api,
  type AchievementNode,
  type AchievementsProgress,
  type ProgramProgressSummary,
  type UserDashboard,
} from '../api/client';
import { useUserStore } from '../store/userStore';
import { useAppStreakStore } from '../store/appStreakStore';
import { colors, neonGlow, neonTextShadow } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { t, useLang, programLabel } from '../i18n';

function stages() {
  return [
    { id: 1 as const, name: t('tree.s1.name'), icon: 'ellipse-outline', desc: t('tree.s1.desc') },
    { id: 2 as const, name: t('tree.s2.name'), icon: 'leaf-outline', desc: t('tree.s2.desc') },
    { id: 3 as const, name: t('tree.s3.name'), icon: 'leaf', desc: t('tree.s3.desc') },
    { id: 4 as const, name: t('tree.s4.name'), icon: 'flower-outline', desc: t('tree.s4.desc') },
    { id: 5 as const, name: t('tree.s5.name'), icon: 'flame', desc: t('tree.s5.desc') },
  ];
}

export function AchievementsScreen() {
  useLang();
  const nav = useNavigation<any>();
  const STAGES = stages();
  const [stats, setStats] = useState<UserDashboard | null>(null);
  const [tree, setTree] = useState<AchievementNode[]>([]);
  const [achProgress, setAchProgress] = useState<AchievementsProgress | null>(null);
  const [loading, setLoading] = useState(true);
  const [sharing, setSharing] = useState(false);
  const shareRef = useRef<View>(null);
  const userName = useUserStore((s) => s.name);
  const userCurrentProgramId = useUserStore((s) => s.currentProgramId);
  const appStreak = useAppStreakStore((s) => s.streakDays);

  const load = useCallback(async () => {
    try {
      const [s, tr, p] = await Promise.all([
        api.stats.me(30),
        api.achievements.tree(),
        api.achievements.progress(),
      ]);
      setStats(s);
      setTree(tr);
      setAchProgress(p);
    } catch {
      setStats(null);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(useCallback(() => { load(); }, [load]));
  useEffect(() => { load(); }, [load]);

  const program: ProgramProgressSummary | null = stats?.program ?? null;
  const stage = program?.treeStage ?? 1;
  const progress = program?.progress ?? 0;
  const currentStageDef = STAGES.find((s) => s.id === stage) ?? STAGES[0];

  const handleShare = async () => {
    if (sharing) return;
    setSharing(true);
    try {
      const uri = await captureRef(shareRef, { format: 'png', quality: 1, width: 1080, height: 1920 });
      const ok = await Sharing.isAvailableAsync();
      if (!ok) {
        Alert.alert(t('tree.shareError'));
        return;
      }
      await Sharing.shareAsync(uri, { dialogTitle: t('tree.shareDialog'), mimeType: 'image/png' });
    } catch (e) {
      Alert.alert(t('common.error'), (e as Error).message);
    } finally {
      setSharing(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={t('tree.title')}
        onBack={() => nav.goBack()}
        right={
          <Pressable
            onPress={handleShare}
            disabled={sharing || loading || !program}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: 6,
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.borderNeon,
              backgroundColor: 'rgba(157,107,255,0.14)',
              opacity: sharing || loading || !program ? 0.5 : 1,
            }}
          >
            {sharing ? (
              <ActivityIndicator color={colors.purpleLight} size="small" />
            ) : (
              <Ionicons name="share-social" size={14} color={colors.purpleLight} />
            )}
            <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 12 }}>
              {sharing ? '...' : t('tree.share')}
            </Text>
          </Pressable>
        }
      />

      {/* Off-screen ShareCard для captureRef */}
      <View ref={shareRef} collapsable={false} style={{ position: 'absolute', left: -10000, top: 0 }}>
        <ShareCard
          treeLevel={stage}
          totalXp={Math.round((program?.scheduledDone ?? 0) * 100)}
          leaves={program?.scheduledDone ?? 0}
          streakDays={0}
          unlocked={stage}
          total={5}
          userName={userName || t('profile.athlete')}
        />
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <LinearGradient
              colors={['rgba(157,107,255,0.32)', 'rgba(0,229,255,0.10)', 'rgba(0,0,0,0)']}
              style={{ padding: 18 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Ionicons name={(currentStageDef.icon as any)} size={22} color={colors.purpleLight} />
                <View style={{ flex: 1 }}>
                  <Text
                    style={[
                      { color: colors.text, fontFamily: fontFamilies.heading, fontSize: 22 },
                      neonTextShadow(colors.purpleLight, 10),
                    ]}
                  >
                    {t('tree.titleUpper')}
                  </Text>
                  <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 12 }}>
                    {t('tree.stem')}
                  </Text>
                </View>
              </View>

              {program ? (
                <>
                  <View style={{ marginTop: 18, flexDirection: 'row', alignItems: 'center', gap: 10 }}>
                    <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 11, letterSpacing: 1 }}>
                      {t('tree.stage')}
                    </Text>
                    <Text style={[
                      { color: colors.text, fontFamily: fontFamilies.body700, fontSize: 16 },
                      neonTextShadow(colors.purpleLight, 10),
                    ]}>
                      {stage}/5 · {currentStageDef.name}
                    </Text>
                  </View>
                  <View style={{ marginTop: 10 }}>
                    <ProgressBar value={progress} color={colors.purpleLight} />
                  </View>
                  <Text style={{ marginTop: 6, color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 11 }}>
                    {t('tree.workoutsOf', {
                      done: program.scheduledDone,
                      total: program.scheduledTotal,
                      program: programLabel(program.id, program.title),
                    })}
                  </Text>
                </>
              ) : (
                <View style={{ marginTop: 16 }}>
                  <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 13 }}>
                    {userCurrentProgramId ? t('tree.emptyButHasProgram') : t('tree.empty')}
                  </Text>
                  <Pressable
                    onPress={() =>
                      userCurrentProgramId
                        ? nav.navigate('ProgramDetail', { programId: userCurrentProgramId })
                        : nav.navigate('RootTabs', { screen: 'Programs' })
                    }
                    style={{
                      marginTop: 12,
                      paddingVertical: 12,
                      paddingHorizontal: 16,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: colors.borderNeon,
                      backgroundColor: 'rgba(157,107,255,0.12)',
                      alignSelf: 'flex-start',
                    }}
                  >
                    <Text style={{ color: colors.purpleLight, fontFamily: fontFamilies.body700, fontSize: 13 }}>
                      {userCurrentProgramId ? t('tree.openProgram') : t('tree.chooseProgram')}
                    </Text>
                  </Pressable>
                </View>
              )}
            </LinearGradient>
          </Card>
        </View>

        {/* Дерево — визуал из 5 стадий */}
        <View style={{ marginTop: 18, paddingHorizontal: 16 }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12, letterSpacing: 1 }}>
            {t('tree.stages')}
          </Text>
        </View>

        <View style={{ marginTop: 12, paddingHorizontal: 16, alignItems: 'center' }}>
          <TreeVisual stage={stage} />
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 18, gap: 10 }}>
          {STAGES.map((s) => (
            <StageRow key={s.id} stage={s} active={stage === s.id} reached={stage >= s.id} />
          ))}
        </View>

        {loading ? (
          <View style={{ paddingVertical: 36, alignItems: 'center' }}>
            <ActivityIndicator color={colors.purpleLight} />
          </View>
        ) : null}

        {program ? (
          <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
            <Card variant="secondary">
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                <Ionicons name="trending-up" size={20} color={colors.cyan} />
                <Text
                  style={{
                    flex: 1,
                    color: colors.textSecondary,
                    fontFamily: fontFamilies.body500,
                    fontSize: 12,
                    lineHeight: 18,
                  }}
                >
                  {t('tree.progressHint', { n: program.scheduledRemaining })}
                </Text>
              </View>
            </Card>
          </View>
        ) : null}

        {/* Огонёк (серия дней захода) + workout-streak от backend */}
        <View style={{ paddingHorizontal: 16, marginTop: 18 }}>
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <FireBox label={t('tree.appStreak')} value={appStreak} sub={t('tree.consecutive')} tint={colors.amber} icon="flame" />
            <FireBox
              label={t('tree.workoutStreak')}
              value={achProgress?.streakDays ?? 0}
              sub={t('tree.bestStreak', { n: achProgress?.longestStreak ?? 0 })}
              tint={colors.cyan}
              icon="barbell"
            />
          </View>
        </View>

        {/* Листики достижений */}
        <View style={{ paddingHorizontal: 16, marginTop: 22 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12, letterSpacing: 1 }}>
              {t('tree.leavesCount', {
                unlocked: tree.filter((a) => a.status === 'UNLOCKED').length,
                total: tree.length,
              })}
            </Text>
          </View>
          <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11, marginTop: 4 }}>
            {t('tree.leavesHint')}
          </Text>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 10, flexDirection: 'row', flexWrap: 'wrap', gap: 8 }}>
          {tree.map((a) => (
            <LeafBadge key={a.id} node={a} />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function FireBox({
  label, value, sub, tint, icon,
}: {
  label: string; value: number; sub: string; tint: string;
  icon: keyof typeof Ionicons.glyphMap;
}) {
  return (
    <View
      style={{
        flex: 1,
        padding: 14,
        borderRadius: 18,
        borderWidth: 1,
        borderColor: tint + '55',
        backgroundColor: 'rgba(0,0,0,0.35)',
        ...neonGlow(tint, 0.4, 20, 8),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Ionicons name={icon} size={16} color={tint} />
        <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 10, letterSpacing: 1 }}>
          {label.toUpperCase()}
        </Text>
      </View>
      <Text style={[
        { marginTop: 8, color: colors.text, fontFamily: fontFamilies.body700, fontSize: 22 },
        neonTextShadow(tint, 12),
      ]}>
        {value}
      </Text>
      <Text style={{ marginTop: 2, color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 10 }}>
        {sub}
      </Text>
    </View>
  );
}

function LeafBadge({ node }: { node: AchievementNode }) {
  const unlocked = node.status === 'UNLOCKED';
  const inProgress = node.status === 'IN_PROGRESS';
  const tint = unlocked ? colors.green : inProgress ? colors.purpleLight : colors.textMuted;
  return (
    <View
      style={{
        width: '48%',
        padding: 10,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: unlocked ? tint + '88' : inProgress ? colors.borderNeon : colors.border,
        backgroundColor: unlocked
          ? 'rgba(63,255,150,0.12)'
          : inProgress
            ? 'rgba(157,107,255,0.08)'
            : colors.bgSecondary,
        ...(unlocked ? neonGlow(colors.green, 0.35, 14, 4) : {}),
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 10,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: unlocked ? 'rgba(63,255,150,0.22)' : 'rgba(0,0,0,0.4)',
            borderWidth: 1,
            borderColor: unlocked ? tint : colors.border,
          }}
        >
          <Ionicons name={node.iconName as any} size={14} color={tint} />
        </View>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: unlocked ? colors.text : colors.textSecondary,
              fontFamily: fontFamilies.body700,
              fontSize: 11,
            }}
            numberOfLines={1}
          >
            {node.title}
          </Text>
        </View>
      </View>
      <Text
        style={{
          marginTop: 6,
          color: colors.textMuted,
          fontFamily: fontFamilies.body,
          fontSize: 10,
        }}
        numberOfLines={2}
      >
        {node.description}
      </Text>
      {inProgress && node.targetValue ? (
        <View style={{ marginTop: 6 }}>
          <ProgressBar value={Math.min(1, node.currentValue / node.targetValue)} color={tint} />
        </View>
      ) : null}
    </View>
  );
}

function TreeVisual({ stage }: { stage: number }) {
  // Простой неоновый «силуэт» дерева, ствол растёт с ростом stage
  const trunkHeight = 40 + stage * 30;
  const crownSize = stage === 1 ? 24 : stage === 2 ? 56 : stage === 3 ? 86 : stage === 4 ? 116 : 144;
  return (
    <View
      style={{
        width: 240,
        height: 280,
        alignItems: 'center',
        justifyContent: 'flex-end',
        position: 'relative',
      }}
    >
      {/* Свечение под кроной */}
      {stage > 1 ? (
        <View
          style={{
            position: 'absolute',
            top: 280 - trunkHeight - crownSize - 20,
            width: crownSize + 40,
            height: crownSize + 40,
            borderRadius: (crownSize + 40) / 2,
            backgroundColor: 'rgba(157,107,255,0.18)',
            ...neonGlow(colors.purple, 0.4, 60, 12),
          }}
        />
      ) : null}

      {/* Крона/семя */}
      {stage === 1 ? (
        <View
          style={{
            position: 'absolute',
            bottom: trunkHeight - 4,
            width: 36,
            height: 36,
            borderRadius: 18,
            borderWidth: 2,
            borderColor: colors.purpleLight,
            backgroundColor: 'rgba(157,107,255,0.18)',
            ...neonGlow(colors.purple, 0.55, 22, 8),
          }}
        />
      ) : (
        <LinearGradient
          colors={['rgba(0,229,255,0.35)', 'rgba(157,107,255,0.65)', 'rgba(255,77,210,0.45)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{
            position: 'absolute',
            bottom: trunkHeight - 14,
            width: crownSize,
            height: crownSize,
            borderRadius: crownSize / 2,
            borderWidth: 1.5,
            borderColor: 'rgba(157,107,255,0.65)',
          }}
        />
      )}

      {/* Иконка-листик в центре кроны */}
      {stage > 1 ? (
        <View
          style={{
            position: 'absolute',
            bottom: trunkHeight - 14 + crownSize / 2 - 14,
            width: 28,
            height: 28,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons
            name={(stage >= 5 ? 'flame' : stage >= 4 ? 'flower' : 'leaf') as any}
            size={22}
            color={colors.cyan}
            style={{ textShadowColor: colors.cyan, textShadowRadius: 14 }}
          />
        </View>
      ) : null}

      {/* Ствол */}
      <View
        style={{
          width: stage === 1 ? 4 : stage === 2 ? 6 : stage === 3 ? 8 : stage === 4 ? 12 : 16,
          height: trunkHeight,
          borderRadius: 8,
          backgroundColor: 'rgba(157,107,255,0.55)',
          marginBottom: 8,
          ...neonGlow(colors.purple, 0.6, 18, 6),
        }}
      />

      {/* Земля */}
      <View
        style={{
          width: 200,
          height: 4,
          borderRadius: 4,
          backgroundColor: 'rgba(157,107,255,0.35)',
        }}
      />
    </View>
  );
}

function StageRow({
  stage,
  active,
  reached,
}: {
  stage: ReturnType<typeof stages>[number];
  active: boolean;
  reached: boolean;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        paddingVertical: 12,
        paddingHorizontal: 14,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: active ? colors.borderNeon : reached ? 'rgba(157,107,255,0.25)' : colors.border,
        backgroundColor: active
          ? 'rgba(157,107,255,0.18)'
          : reached
            ? 'rgba(157,107,255,0.06)'
            : colors.bgSecondary,
        ...(active ? neonGlow(colors.purple, 0.45, 18, 6) : {}),
      }}
    >
      <View
        style={{
          width: 38,
          height: 38,
          borderRadius: 12,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 1,
          borderColor: reached ? 'rgba(157,107,255,0.6)' : colors.border,
          backgroundColor: reached ? 'rgba(157,107,255,0.18)' : 'rgba(0,0,0,0.3)',
        }}
      >
        <Ionicons
          name={stage.icon as any}
          size={18}
          color={reached ? colors.purpleLight : colors.textMuted}
        />
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ color: reached ? colors.text : colors.textSecondary, fontFamily: fontFamilies.body700, fontSize: 14 }}>
          {stage.id}. {stage.name}
        </Text>
        <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 12, marginTop: 2 }}>
          {stage.desc}
        </Text>
      </View>
      {active ? (
        <Text style={{ color: colors.purpleLight, fontFamily: fontFamilies.body700, fontSize: 11 }}>
          {t('tree.now')}
        </Text>
      ) : reached ? (
        <Ionicons name="checkmark-circle" size={18} color={colors.purpleLight} />
      ) : null}
    </View>
  );
}
