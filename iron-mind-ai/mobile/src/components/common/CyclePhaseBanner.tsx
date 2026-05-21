import React from 'react';
import { Text, View } from 'react-native';
import { MoonPhase } from './MoonPhase';
import { useCycleStore } from '../../store/cycleStore';
import { useUserStore } from '../../store/userStore';
import { colors, radii } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { useTheme } from '../../theme/useTheme';
import { t, useLang } from '../../i18n';

/**
 * Surfaces the user's current menstrual-cycle phase + contextual advice.
 * Renders nothing unless the user is female, has cycle tracking enabled, and
 * a phase can be computed. Used in workout (load) and nutrition contexts.
 */
export function CyclePhaseBanner({
  context = 'training',
}: {
  context?: 'training' | 'nutrition';
}) {
  useLang();
  const theme = useTheme();
  const gender = useUserStore((s) => s.gender);
  const enabled = useCycleStore((s) => s.enabled);
  const phase = useCycleStore((s) => s.currentPhase());
  const day = useCycleStore((s) => s.dayOfCycle());

  if (gender !== 'female' || !enabled || !phase) return null;

  const advice =
    context === 'nutrition'
      ? t(`cycle.nutrition.${phase}`)
      : t(`cycle.phase.${phase}.advice`);
  const title = t(`cycle.phase.${phase}.title`);

  return (
    <View
      style={{
        marginHorizontal: 16,
        marginTop: 12,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        padding: 12,
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: theme.borderNeon,
        backgroundColor: theme.accentSoft,
      }}
    >
      <MoonPhase kind={phase} size={30} />
      <View style={{ flex: 1 }}>
        <Text
          style={{
            color: theme.accentLight,
            fontFamily: fontFamilies.body700,
            fontSize: 10,
            letterSpacing: 1.2,
            textTransform: 'uppercase',
          }}
        >
          {t('cycle.bannerEyebrow')} ·{' '}
          {day != null ? t('cycle.dayOf', { n: day }) : title}
        </Text>
        <Text
          style={{
            marginTop: 3,
            color: colors.text,
            fontFamily: fontFamilies.body,
            fontSize: 12,
            lineHeight: 17,
          }}
        >
          {advice}
        </Text>
      </View>
    </View>
  );
}
