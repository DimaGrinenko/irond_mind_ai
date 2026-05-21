import React from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Card } from '../components/common/Card';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { MoonPhase, type MoonPhaseKind } from '../components/common/MoonPhase';
import { useCycleStore } from '../store/cycleStore';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { useTheme } from '../theme/useTheme';
import { t, useLang } from '../i18n';

type PhaseKey = MoonPhaseKind;

function phaseInfo(): Record<PhaseKey, { title: string; advice: string }> {
  return {
    menstrual: {
      title: t('cycle.phase.menstrual.title'),
      advice: t('cycle.phase.menstrual.advice'),
    },
    follicular: {
      title: t('cycle.phase.follicular.title'),
      advice: t('cycle.phase.follicular.advice'),
    },
    ovulation: {
      title: t('cycle.phase.ovulation.title'),
      advice: t('cycle.phase.ovulation.advice'),
    },
    luteal: {
      title: t('cycle.phase.luteal.title'),
      advice: t('cycle.phase.luteal.advice'),
    },
  };
}

export function CycleTrackerScreen() {
  useLang();
  const theme = useTheme();
  const PHASE_INFO = phaseInfo();
  const nav = useNavigation<any>();
  const enabled = useCycleStore((s) => s.enabled);
  const setEnabled = useCycleStore((s) => s.setEnabled);
  const lastPeriod = useCycleStore((s) => s.lastPeriodStart);
  const setLastPeriod = useCycleStore((s) => s.setLastPeriod);
  const cycleLength = useCycleStore((s) => s.cycleLength);
  const setCycleLength = useCycleStore((s) => s.setCycleLength);
  const refresh = useCycleStore((s) => s.refresh);
  const phase = useCycleStore((s) => s.currentPhase());
  const day = useCycleStore((s) => s.dayOfCycle());

  const [dateInput, setDateInput] = React.useState(lastPeriod ?? '');
  const [lengthInput, setLengthInput] = React.useState(String(cycleLength));

  // Sync from server on mount; reflect server values into local inputs.
  React.useEffect(() => {
    refresh();
  }, [refresh]);
  React.useEffect(() => {
    setDateInput(lastPeriod ?? '');
  }, [lastPeriod]);
  React.useEffect(() => {
    setLengthInput(String(cycleLength));
  }, [cycleLength]);

  const accentBg = theme.accentSoft;
  const accentBorder = theme.borderNeon;
  const accentText = theme.accentLight;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('cycle.title')} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Card
            variant="secondary"
            style={{ padding: 14, flexDirection: 'row', alignItems: 'center' }}
          >
            <Text
              style={{
                flex: 1,
                color: colors.text,
                fontFamily: fontFamilies.body700,
                fontSize: 14,
              }}
            >
              {t('cycle.enable')}
            </Text>
            <Switch
              value={enabled}
              onValueChange={setEnabled}
              trackColor={{ true: theme.accent }}
            />
          </Card>
        </View>

        {enabled ? (
          <>
            <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
              <Card variant="secondary">
                <Text
                  style={{
                    color: colors.textMuted,
                    fontFamily: fontFamilies.body500,
                    fontSize: 10,
                    letterSpacing: 1,
                    marginBottom: 6,
                  }}
                >
                  {t('cycle.lastPeriodLabel')}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8 }}>
                  <TextInput
                    value={dateInput}
                    onChangeText={setDateInput}
                    placeholder="2026-05-10"
                    placeholderTextColor={colors.textMuted}
                    style={{
                      flex: 1,
                      height: 44,
                      borderRadius: radii.md,
                      borderWidth: 1,
                      borderColor: colors.border,
                      backgroundColor: colors.bgSecondary,
                      paddingHorizontal: 12,
                      color: colors.text,
                      fontFamily: fontFamilies.body600,
                      fontSize: 14,
                    }}
                  />
                  <Pressable
                    onPress={() => {
                      if (!/^\d{4}-\d{2}-\d{2}$/.test(dateInput)) {
                        Alert.alert(
                          t('common.error'),
                          t('cycle.dateFormatError'),
                        );
                        return;
                      }
                      setLastPeriod(dateInput);
                    }}
                    style={{
                      paddingHorizontal: 14,
                      borderRadius: radii.md,
                      borderWidth: 1,
                      borderColor: accentBorder,
                      backgroundColor: accentBg,
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: accentText,
                        fontFamily: fontFamilies.body700,
                        fontSize: 12,
                      }}
                    >
                      {t('common.save')}
                    </Text>
                  </Pressable>
                </View>

                <Text
                  style={{
                    marginTop: 14,
                    color: colors.textMuted,
                    fontFamily: fontFamilies.body500,
                    fontSize: 10,
                    letterSpacing: 1,
                  }}
                >
                  {t('cycle.cycleLengthLabel')}
                </Text>
                <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
                  <TextInput
                    value={lengthInput}
                    onChangeText={setLengthInput}
                    keyboardType="number-pad"
                    style={{
                      flex: 1,
                      height: 44,
                      borderRadius: radii.md,
                      borderWidth: 1,
                      borderColor: colors.border,
                      backgroundColor: colors.bgSecondary,
                      paddingHorizontal: 12,
                      color: colors.text,
                      fontFamily: fontFamilies.body600,
                      fontSize: 14,
                    }}
                  />
                  <Pressable
                    onPress={() =>
                      setCycleLength(parseInt(lengthInput, 10) || 28)
                    }
                    style={{
                      paddingHorizontal: 14,
                      borderRadius: radii.md,
                      borderWidth: 1,
                      borderColor: accentBorder,
                      backgroundColor: accentBg,
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: accentText,
                        fontFamily: fontFamilies.body700,
                        fontSize: 12,
                      }}
                    >
                      OK
                    </Text>
                  </Pressable>
                </View>
              </Card>
            </View>

            {phase ? (
              <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
                <Card variant="secondary" style={{ padding: 16 }}>
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      marginBottom: 8,
                    }}
                  >
                    <MoonPhase kind={phase} size={34} />
                    <Text
                      style={{
                        flex: 1,
                        color: colors.text,
                        fontFamily: fontFamilies.body700,
                        fontSize: 14,
                      }}
                    >
                      {t('cycle.dayOf', { n: day! })} ·{' '}
                      {PHASE_INFO[phase].title}
                    </Text>
                  </View>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontFamily: fontFamilies.body,
                      fontSize: 13,
                      lineHeight: 19,
                    }}
                  >
                    {PHASE_INFO[phase].advice}
                  </Text>
                </Card>
              </View>
            ) : null}

            {/* Все фазы */}
            <View style={{ paddingHorizontal: 16, marginTop: 12, gap: 8 }}>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body600,
                  fontSize: 12,
                  letterSpacing: 1,
                  marginBottom: 4,
                }}
              >
                {t('cycle.allPhases')}
              </Text>
              {(Object.keys(PHASE_INFO) as PhaseKey[]).map((k) => (
                <View
                  key={k}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 12,
                    padding: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: phase === k ? accentBorder : colors.border,
                    backgroundColor:
                      phase === k ? accentBg : colors.bgSecondary,
                  }}
                >
                  <MoonPhase kind={k} size={24} />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontFamily: fontFamilies.body700,
                        fontSize: 13,
                      }}
                    >
                      {PHASE_INFO[k].title}
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        color: colors.textMuted,
                        fontFamily: fontFamilies.body,
                        fontSize: 11,
                      }}
                    >
                      {PHASE_INFO[k].advice}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
