import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { Particles } from '../components/anim/Particles';
import { TapScale } from '../components/anim/TapScale';
import { motivationQuotes } from '../data/motivation';
import { colors, glow, radii, spacing } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

export function MotivationScreen({ navigation }: any) {
  const lang = useLang();
  const theme = useTheme();
  const [seed, setSeed] = useState(() => Math.floor(Date.now() / 1000));
  const quote = useMemo(() => {
    const quotes = motivationQuotes(lang);
    return quotes[Math.abs(seed) % quotes.length];
  }, [seed, lang]);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <LinearGradient
        colors={['rgba(138,92,255,0.32)', 'rgba(0,0,0,0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 320 }}
      />
      <Particles count={16} height={420} />

      <ScreenHeader title={t('mot.title')} onBack={() => navigation.goBack()} />

      <View
        style={{
          flex: 1,
          justifyContent: 'center',
          paddingHorizontal: spacing.md,
        }}
      >
        <Animated.View
          key={seed}
          entering={FadeIn.duration(380)}
          exiting={FadeOut.duration(180)}
          style={{
            borderRadius: radii.xl,
            borderWidth: 1,
            borderColor: 'rgba(138,92,255,0.45)',
            overflow: 'hidden',
            ...glow,
          }}
        >
          <LinearGradient
            colors={[
              'rgba(138,92,255,0.20)',
              'rgba(255,63,203,0.10)',
              'rgba(0,0,0,0.85)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ paddingVertical: 36, paddingHorizontal: 24 }}
          >
            <View style={{ alignItems: 'center', marginBottom: 14 }}>
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  backgroundColor: 'rgba(138,92,255,0.18)',
                  borderWidth: 1,
                  borderColor: 'rgba(138,92,255,0.55)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="sparkles" size={22} color={theme.accentLight} />
              </View>
            </View>

            <Text
              style={{
                color: colors.text,
                fontFamily: fontFamilies.heading,
                fontSize: 22,
                lineHeight: 30,
                textAlign: 'center',
              }}
            >
              «{quote}»
            </Text>

            <Text
              style={{
                marginTop: 18,
                textAlign: 'center',
                color: colors.textMuted,
                fontFamily: fontFamilies.body600,
                fontSize: 12,
                letterSpacing: 1.2,
              }}
            >
              AI TRAINER · DAILY INSIGHT
            </Text>
          </LinearGradient>
        </Animated.View>
      </View>

      <View style={{ paddingHorizontal: spacing.md, paddingBottom: 32 }}>
        <TapScale
          onPress={() =>
            setSeed((s) => s + 1 + Math.floor(Math.random() * 1000))
          }
          style={{
            height: 58,
            borderRadius: radii.lg,
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: colors.bgSecondary,
            borderWidth: 1,
            borderColor: 'rgba(138,92,255,0.6)',
            flexDirection: 'row',
            gap: 10,
            ...glow,
          }}
        >
          <Ionicons name="refresh" size={20} color={theme.accentLight} />
          <Text
            style={{
              color: colors.text,
              fontFamily: fontFamilies.body700,
              fontSize: 15,
            }}
          >
            {t('mot.anotherQuote')}
          </Text>
        </TapScale>
      </View>
    </View>
  );
}
