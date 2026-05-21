import React from 'react';
import { Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import {
  CHALLENGES,
  localizedChallenge,
  type Challenge,
} from '../data/challenges';
import { useChallengesStore } from '../store/challengesStore';
import { useLeafEconomyStore } from '../store/leafEconomyStore';
import { colors } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

export function ChallengesScreen() {
  const lang = useLang();
  const nav = useNavigation<any>();
  const progress = useChallengesStore((s) => s.progress);
  const join = useChallengesStore((s) => s.join);
  const leave = useChallengesStore((s) => s.leave);
  const claim = useChallengesStore((s) => s.claim);
  const earn = useLeafEconomyStore((s) => s.earn);
  const leaves = useLeafEconomyStore((s) => s.leaves);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('challenges.title')} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <Card
            variant="secondary"
            style={{
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Ionicons name="leaf" size={20} color={colors.green} />
            <Text
              style={{
                flex: 1,
                color: colors.text,
                fontFamily: fontFamilies.body700,
                fontSize: 14,
              }}
            >
              {t('challenges.leaves', { n: leaves })}
            </Text>
            <Pressable
              onPress={() => nav.navigate('LeafShop')}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.green,
                backgroundColor: 'rgba(63,255,150,0.16)',
              }}
            >
              <Text
                style={{
                  color: colors.green,
                  fontFamily: fontFamilies.body700,
                  fontSize: 11,
                }}
              >
                {t('challenges.toShop')}
              </Text>
            </Pressable>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12, gap: 10 }}>
          {CHALLENGES.map((c) => (
            <ChallengeCard
              key={c.id}
              c={localizedChallenge(c, lang)}
              joined={!!progress[c.id]?.joined}
              current={progress[c.id]?.current ?? 0}
              completed={!!progress[c.id]?.completedAt}
              rewardClaimed={!!progress[c.id]?.rewardClaimed}
              onJoin={() => join(c.id)}
              onLeave={() => leave(c.id)}
              onClaim={() => {
                const r = claim(c.id);
                if (r > 0) earn(r, c.id);
              }}
            />
          ))}
        </View>
      </ScrollView>
    </View>
  );
}

function ChallengeCard({
  c,
  joined,
  current,
  completed,
  rewardClaimed,
  onJoin,
  onLeave,
  onClaim,
}: {
  c: Challenge;
  joined: boolean;
  current: number;
  completed: boolean;
  rewardClaimed: boolean;
  onJoin: () => void;
  onLeave: () => void;
  onClaim: () => void;
}) {
  const theme = useTheme();
  const ratio = Math.min(1, current / c.target);
  return (
    <Card
      variant="secondary"
      style={{
        padding: 14,
        borderColor: completed
          ? colors.amber
          : joined
            ? theme.borderNeon
            : colors.border,
        borderWidth: 1,
      }}
    >
      <View
        style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}
      >
        <Text style={{ fontSize: 22, marginRight: 10 }}>{c.emoji}</Text>
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.text,
              fontFamily: fontFamilies.body700,
              fontSize: 14,
            }}
          >
            {c.title}
          </Text>
          <Text
            style={{
              color: colors.textMuted,
              fontFamily: fontFamilies.body,
              fontSize: 11,
              marginTop: 2,
            }}
          >
            🌿 {c.reward} · {t('challenges.window', { n: c.windowDays })}
          </Text>
        </View>
        {!joined ? (
          <Pressable
            onPress={onJoin}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: theme.borderNeon,
              backgroundColor: 'rgba(157,107,255,0.18)',
            }}
          >
            <Text
              style={{
                color: theme.accentLight,
                fontFamily: fontFamilies.body700,
                fontSize: 11,
              }}
            >
              {t('challenges.join')}
            </Text>
          </Pressable>
        ) : completed && !rewardClaimed ? (
          <Pressable
            onPress={onClaim}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.amber,
              backgroundColor: 'rgba(255,181,71,0.22)',
            }}
          >
            <Text
              style={{
                color: colors.amber,
                fontFamily: fontFamilies.body700,
                fontSize: 11,
              }}
            >
              {t('challenges.claim')}
            </Text>
          </Pressable>
        ) : rewardClaimed ? (
          <Text
            style={{
              color: colors.green,
              fontFamily: fontFamilies.body700,
              fontSize: 11,
            }}
          >
            {t('challenges.received')}
          </Text>
        ) : (
          <Pressable onPress={onLeave} hitSlop={8}>
            <Ionicons
              name="close-circle-outline"
              size={20}
              color={colors.textMuted}
            />
          </Pressable>
        )}
      </View>
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: fontFamilies.body,
          fontSize: 12,
          marginBottom: 8,
        }}
      >
        {c.description}
      </Text>
      {joined ? (
        <>
          <View
            style={{
              flexDirection: 'row',
              justifyContent: 'space-between',
              marginBottom: 4,
            }}
          >
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: fontFamilies.body500,
                fontSize: 10,
              }}
            >
              {current} / {c.target}
            </Text>
            <Text
              style={{
                color: theme.accentLight,
                fontFamily: fontFamilies.body700,
                fontSize: 10,
              }}
            >
              {Math.round(ratio * 100)}%
            </Text>
          </View>
          <ProgressBar
            value={ratio}
            color={completed ? colors.amber : theme.accentLight}
          />
        </>
      ) : null}
    </Card>
  );
}
