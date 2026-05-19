import React from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { useCycleStore } from '../store/cycleStore';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

function phaseInfo(): Record<'menstrual' | 'follicular' | 'ovulation' | 'luteal', { title: string; advice: string; emoji: string }> {
  return {
    menstrual: { title: t('cycle.phase.menstrual.title'), advice: t('cycle.phase.menstrual.advice'), emoji: '🌑' },
    follicular: { title: t('cycle.phase.follicular.title'), advice: t('cycle.phase.follicular.advice'), emoji: '🌒' },
    ovulation: { title: t('cycle.phase.ovulation.title'), advice: t('cycle.phase.ovulation.advice'), emoji: '🌕' },
    luteal: { title: t('cycle.phase.luteal.title'), advice: t('cycle.phase.luteal.advice'), emoji: '🌘' },
  };
}

export function CycleTrackerScreen() {
  useLang();
  const PHASE_INFO = phaseInfo();
  const nav = useNavigation<any>();
  const enabled = useCycleStore((s) => s.enabled);
  const setEnabled = useCycleStore((s) => s.setEnabled);
  const lastPeriod = useCycleStore((s) => s.lastPeriodStart);
  const setLastPeriod = useCycleStore((s) => s.setLastPeriod);
  const cycleLength = useCycleStore((s) => s.cycleLength);
  const setCycleLength = useCycleStore((s) => s.setCycleLength);
  const phase = useCycleStore((s) => s.currentPhase());
  const day = useCycleStore((s) => s.dayOfCycle());

  const [dateInput, setDateInput] = React.useState(lastPeriod ?? '');
  const [lengthInput, setLengthInput] = React.useState(String(cycleLength));

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('cycle.title')} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Card variant="secondary" style={{ padding: 14, flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>
              {t('cycle.enable')}
            </Text>
            <Switch value={enabled} onValueChange={setEnabled} />
          </Card>
        </View>

        {enabled ? (
          <>
            <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
              <Card variant="secondary">
                <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>
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
                        Alert.alert(t('common.error'), t('cycle.dateFormatError'));
                        return;
                      }
                      setLastPeriod(dateInput);
                    }}
                    style={{
                      paddingHorizontal: 14,
                      borderRadius: radii.md,
                      borderWidth: 1,
                      borderColor: colors.borderNeon,
                      backgroundColor: 'rgba(157,107,255,0.16)',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: colors.purpleLight, fontFamily: fontFamilies.body700, fontSize: 12 }}>
                      {t('common.save')}
                    </Text>
                  </Pressable>
                </View>

                <Text style={{ marginTop: 14, color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 10, letterSpacing: 1 }}>
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
                    onPress={() => setCycleLength(parseInt(lengthInput, 10) || 28)}
                    style={{
                      paddingHorizontal: 14,
                      borderRadius: radii.md,
                      borderWidth: 1,
                      borderColor: colors.borderNeon,
                      backgroundColor: 'rgba(157,107,255,0.16)',
                      justifyContent: 'center',
                    }}
                  >
                    <Text style={{ color: colors.purpleLight, fontFamily: fontFamilies.body700, fontSize: 12 }}>
                      OK
                    </Text>
                  </Pressable>
                </View>
              </Card>
            </View>

            {phase ? (
              <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
                <Card variant="secondary" style={{ padding: 16 }}>
                  <Text style={{ fontSize: 28, marginBottom: 6 }}>{PHASE_INFO[phase].emoji}</Text>
                  <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>
                    {t('cycle.dayOf', { n: day! })} · {PHASE_INFO[phase].title}
                  </Text>
                  <Text style={{ marginTop: 6, color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 13, lineHeight: 19 }}>
                    {PHASE_INFO[phase].advice}
                  </Text>
                </Card>
              </View>
            ) : null}

            {/* Все фазы */}
            <View style={{ paddingHorizontal: 16, marginTop: 12, gap: 8 }}>
              <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12, letterSpacing: 1, marginBottom: 4 }}>
                {t('cycle.allPhases')}
              </Text>
              {(Object.keys(PHASE_INFO) as Array<keyof typeof PHASE_INFO>).map((k) => (
                <View
                  key={k}
                  style={{
                    padding: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: phase === k ? colors.borderNeon : colors.border,
                    backgroundColor: phase === k ? 'rgba(157,107,255,0.10)' : colors.bgSecondary,
                  }}
                >
                  <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 13 }}>
                    {PHASE_INFO[k].emoji} {PHASE_INFO[k].title}
                  </Text>
                  <Text style={{ marginTop: 2, color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11 }}>
                    {PHASE_INFO[k].advice}
                  </Text>
                </View>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
