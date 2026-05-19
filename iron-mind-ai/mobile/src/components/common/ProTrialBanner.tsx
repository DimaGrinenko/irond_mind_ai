/**
 * Pro trial баннер с countdown — показывается только когда trial активен и < 7 дней.
 * При тапе ведёт в SubscriptionScreen.
 */
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';
import { useProAccess } from '../../hooks/useProAccess';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { t } from '../../i18n';

export function ProTrialBanner() {
  const nav = useNavigation<any>();
  const { isTrialing, trialDaysLeft, isPaid } = useProAccess();

  if (isPaid || !isTrialing || trialDaysLeft == null) return null;

  // Цвет — амбер до 3 дней, красный 0-2 (давим loss aversion)
  const urgent = trialDaysLeft <= 2;
  const tint = urgent ? '#FF4D6D' : '#FFD27A';

  return (
    <Pressable onPress={() => nav.navigate('Subscription')} style={{ paddingHorizontal: 16, marginTop: 12 }}>
      <View
        style={{
          borderRadius: 16,
          borderWidth: 1,
          borderColor: tint + 'AA',
          overflow: 'hidden',
        }}
      >
        <LinearGradient
          colors={urgent
            ? ['rgba(255,77,109,0.25)', 'rgba(13,16,32,0.95)']
            : ['rgba(255,210,122,0.18)', 'rgba(13,16,32,0.92)']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
          style={{ padding: 14, flexDirection: 'row', alignItems: 'center', gap: 12 }}
        >
          <View
            style={{
              width: 46,
              height: 46,
              borderRadius: 14,
              backgroundColor: tint + '22',
              borderWidth: 1,
              borderColor: tint,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="star" size={22} color={tint} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: tint, fontFamily: fontFamilies.body700, fontSize: 12, letterSpacing: 1 }}>
              {urgent ? t('proTrial.urgent') : t('proTrial.label')}
            </Text>
            <Text style={{ marginTop: 2, color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>
              {t('proTrial.daysLeft', { n: trialDaysLeft })}
            </Text>
            <Text style={{ marginTop: 2, color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 11 }}>
              {urgent ? t('proTrial.loseFeatures') : t('proTrial.usingFeatures')}
            </Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color={tint} />
        </LinearGradient>
      </View>
    </Pressable>
  );
}
