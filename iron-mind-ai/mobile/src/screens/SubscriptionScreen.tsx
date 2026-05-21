/**
 * Premium pay-wall — UI без реальной интеграции (Stripe/RevenueCat будет позже).
 */
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors, neonGlow, neonTextShadow, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

type Tier = 'free' | 'pro' | 'elite';

type TierDef = {
  id: Tier;
  name: string;
  priceMonth: string;
  priceYear: string;
  tagline: string;
  features: Array<{ text: string; included: boolean }>;
  cta: string;
  highlight?: boolean;
};

function tiers(): TierDef[] {
  return [
    {
      id: 'free',
      name: 'Free',
      priceMonth: '0 ₽',
      priceYear: '0 ₽',
      tagline: t('sub.tagFree'),
      features: [
        { text: t('sub.f.allTemplates'), included: true },
        { text: t('sub.f.onePersonal'), included: true },
        { text: t('sub.f.analytics7'), included: true },
        { text: t('sub.f.ai10'), included: true },
        { text: t('sub.f.measNutri'), included: true },
        { text: t('sub.f.allExercises'), included: true },
        { text: t('sub.f.analyticsExt'), included: false },
        { text: t('sub.f.aiUnlimited'), included: false },
        { text: t('sub.f.themes'), included: false },
        { text: t('sub.f.export'), included: false },
      ],
      cta: t('sub.ctaFree'),
    },
    {
      id: 'pro',
      name: 'Pro',
      priceMonth: '299 ₽',
      priceYear: '1 990 ₽',
      tagline: t('sub.tagPro'),
      highlight: true,
      features: [
        { text: t('sub.f.allFree'), included: true },
        { text: t('sub.f.unlimitedPrograms'), included: true },
        { text: t('sub.f.analytics3m'), included: true },
        { text: t('sub.f.aiCoachUnlimited'), included: true },
        { text: t('sub.f.extHistory'), included: true },
        { text: t('sub.f.suppLog'), included: true },
        { text: t('sub.f.photoCompare'), included: true },
        { text: t('sub.f.workoutNotifs'), included: true },
        { text: t('sub.f.coachPrograms'), included: false },
        { text: t('sub.f.formAnalysis'), included: false },
      ],
      cta: t('sub.ctaPro'),
    },
    {
      id: 'elite',
      name: 'Elite',
      priceMonth: '799 ₽',
      priceYear: '5 990 ₽',
      tagline: t('sub.tagElite'),
      features: [
        { text: t('sub.f.allPro'), included: true },
        { text: t('sub.f.coachProgramsElite'), included: true },
        { text: t('sub.f.aiFormAnalysis'), included: true },
        { text: t('sub.f.personalNutrition'), included: true },
        { text: t('sub.f.priorityUpdates'), included: true },
        { text: t('sub.f.coachConsult'), included: true },
        { text: t('sub.f.merchCommunity'), included: true },
        { text: t('sub.f.allFuture'), included: true },
      ],
      cta: t('sub.ctaElite'),
    },
  ];
}

export function SubscriptionScreen() {
  useLang();
  const nav = useNavigation<any>();
  const [period, setPeriod] = useState<'month' | 'year'>('year');

  const onSubscribe = (tier: Tier) => {
    if (tier === 'free') return;
    Alert.alert(t('sub.soonTitle'), t('sub.soonMsg'), [
      { text: t('common.ok') },
    ]);
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Iron Mind Premium" onBack={() => nav.goBack()} />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 40, paddingHorizontal: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ marginTop: 12 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <LinearGradient
              colors={[
                'rgba(157,107,255,0.32)',
                'rgba(0,229,255,0.18)',
                'rgba(255,77,210,0.18)',
              ]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={{ padding: 20 }}
            >
              <Ionicons
                name="diamond"
                size={32}
                color={colors.cyan}
                style={[
                  { marginBottom: 8 },
                  neonTextShadow(colors.cyan, 16) as any,
                ]}
              />
              <Text
                style={[
                  {
                    color: colors.text,
                    fontFamily: fontFamilies.heading,
                    fontSize: 24,
                  },
                  neonTextShadow(colors.purpleLight, 12),
                ]}
              >
                {t('sub.heroTitle')}
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body,
                  fontSize: 13,
                }}
              >
                {t('sub.heroSub')}
              </Text>
            </LinearGradient>
          </Card>
        </View>

        <View style={{ marginTop: 18, flexDirection: 'row', gap: 8 }}>
          <Pressable
            onPress={() => setPeriod('month')}
            style={[periodBtnStyle, period === 'month' && periodBtnActive]}
          >
            <Text
              style={{
                color:
                  period === 'month'
                    ? colors.purpleLight
                    : colors.textSecondary,
                fontFamily: fontFamilies.body700,
                fontSize: 13,
              }}
            >
              {t('sub.month')}
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setPeriod('year')}
            style={[
              periodBtnStyle,
              period === 'year' && periodBtnActive,
              { position: 'relative' },
            ]}
          >
            <Text
              style={{
                color:
                  period === 'year' ? colors.purpleLight : colors.textSecondary,
                fontFamily: fontFamilies.body700,
                fontSize: 13,
              }}
            >
              {t('sub.year')}
            </Text>
            <View
              style={{
                position: 'absolute',
                top: -8,
                right: -4,
                paddingHorizontal: 6,
                paddingVertical: 2,
                borderRadius: 6,
                backgroundColor: colors.green,
              }}
            >
              <Text
                style={{
                  color: '#000',
                  fontFamily: fontFamilies.body700,
                  fontSize: 9,
                }}
              >
                −40%
              </Text>
            </View>
          </Pressable>
        </View>

        <View style={{ marginTop: 16, gap: 12 }}>
          {tiers().map((tier) => (
            <TierCard
              key={tier.id}
              tier={tier}
              period={period}
              onPress={() => onSubscribe(tier.id)}
            />
          ))}
        </View>

        <View style={{ marginTop: 18 }}>
          <Card variant="secondary">
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: fontFamilies.body,
                fontSize: 12,
                lineHeight: 18,
              }}
            >
              • {t('sub.note1')}
              {'\n'}• {t('sub.note2')}
              {'\n'}• {t('sub.note3')}
              {'\n'}• {t('sub.note4')}
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

function TierCard({
  tier,
  period,
  onPress,
}: {
  tier: TierDef;
  period: 'month' | 'year';
  onPress: () => void;
}) {
  const price = period === 'month' ? tier.priceMonth : tier.priceYear;
  const sub = period === 'month' ? t('sub.perMonth') : t('sub.perYear');
  return (
    <View
      style={[
        {
          borderRadius: radii.xl,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: tier.highlight ? colors.borderNeon : colors.border,
        },
        tier.highlight ? neonGlow(colors.purple, 0.35, 18, 6) : {},
      ]}
    >
      <LinearGradient
        colors={
          tier.highlight
            ? ['rgba(157,107,255,0.22)', 'rgba(0,229,255,0.10)']
            : ['rgba(13,16,32,0.85)', 'rgba(8,11,22,0.95)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ padding: 18 }}
      >
        {tier.highlight ? (
          <View
            style={{
              alignSelf: 'flex-start',
              paddingHorizontal: 10,
              paddingVertical: 4,
              borderRadius: 8,
              backgroundColor: colors.purpleLight,
              marginBottom: 10,
            }}
          >
            <Text
              style={{
                color: '#000',
                fontFamily: fontFamilies.body700,
                fontSize: 10,
                letterSpacing: 1,
              }}
            >
              {t('sub.popular')}
            </Text>
          </View>
        ) : null}

        <View
          style={{
            flexDirection: 'row',
            alignItems: 'flex-end',
            justifyContent: 'space-between',
          }}
        >
          <View>
            <Text
              style={[
                {
                  color: colors.text,
                  fontFamily: fontFamilies.heading,
                  fontSize: 22,
                },
                tier.highlight ? neonTextShadow(colors.purpleLight, 12) : null,
              ]}
            >
              {tier.name}
            </Text>
            <Text
              style={{
                marginTop: 4,
                color: colors.textSecondary,
                fontFamily: fontFamilies.body,
                fontSize: 12,
              }}
            >
              {tier.tagline}
            </Text>
          </View>
          <View style={{ alignItems: 'flex-end' }}>
            <Text
              style={[
                {
                  color: colors.text,
                  fontFamily: fontFamilies.body700,
                  fontSize: 20,
                },
                tier.highlight ? neonTextShadow(colors.purpleLight, 10) : null,
              ]}
            >
              {price}
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: fontFamilies.body,
                fontSize: 11,
              }}
            >
              {sub}
            </Text>
          </View>
        </View>

        <View style={{ marginTop: 14, gap: 6 }}>
          {tier.features.map((f, i) => (
            <View
              key={`${tier.id}-${i}`}
              style={{ flexDirection: 'row', alignItems: 'flex-start', gap: 8 }}
            >
              <Ionicons
                name={f.included ? 'checkmark-circle' : 'close-circle-outline'}
                size={16}
                color={f.included ? colors.green : colors.textMuted}
                style={{ marginTop: 1 }}
              />
              <Text
                style={{
                  flex: 1,
                  color: f.included ? colors.text : colors.textMuted,
                  fontFamily: fontFamilies.body,
                  fontSize: 12,
                  textDecorationLine: f.included ? 'none' : 'line-through',
                }}
              >
                {f.text}
              </Text>
            </View>
          ))}
        </View>

        <View style={{ marginTop: 16 }}>
          {tier.id === 'free' ? (
            <View
              style={{
                paddingVertical: 12,
                alignItems: 'center',
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.bgSecondary,
              }}
            >
              <Text
                style={{
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body700,
                  fontSize: 13,
                }}
              >
                {tier.cta}
              </Text>
            </View>
          ) : (
            <GradientButton
              title={tier.cta}
              onPress={onPress}
              variant={tier.id === 'elite' ? 'aurora' : 'primary'}
              rightIcon={
                <Ionicons name="arrow-forward" size={18} color="#fff" />
              }
            />
          )}
        </View>
      </LinearGradient>
    </View>
  );
}

const periodBtnStyle = {
  flex: 1,
  paddingVertical: 12,
  alignItems: 'center' as const,
  borderRadius: 14,
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: colors.bgSecondary,
} as const;

const periodBtnActive = {
  borderColor: colors.borderNeon,
  backgroundColor: 'rgba(157,107,255,0.18)',
} as const;
