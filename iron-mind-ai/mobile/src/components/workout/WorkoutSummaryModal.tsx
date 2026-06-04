import React from 'react';
import { Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { GradientButton } from '../common/GradientButton';
import { colors, neonGlow, neonTextShadow, radii } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/typography';
import type { WorkoutSummary } from '../../store/activeWorkoutStore';
import { exerciseDisplayName } from '../../utils/exerciseDisplayName';
import { t, useLang } from '../../i18n';

function fmtDuration(ms: number) {
  const s = Math.floor(ms / 1000);
  const m = Math.floor(s / 60);
  const sec = s % 60;
  if (m === 0) return `${sec} ${t('common.seconds')}`;
  return `${m} ${t('common.minutes')} ${sec} ${t('common.seconds')}`;
}

export function WorkoutSummaryModal({
  visible,
  summary,
  onClose,
}: {
  visible: boolean;
  summary: WorkoutSummary | null;
  onClose: () => void;
}) {
  useLang();
  const theme = useTheme();
  if (!summary) return null;
  const completionPct =
    summary.totalSets > 0
      ? Math.round((summary.completedSets / summary.totalSets) * 100)
      : 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.85)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 16,
        }}
      >
        <View
          style={{
            width: '100%',
            maxHeight: '88%',
            borderRadius: radii.xl,
            overflow: 'hidden',
            ...neonGlow(theme.accent, 0.45, 40, 14),
          }}
        >
          <LinearGradient
            colors={[
              'rgba(157,107,255,0.32)',
              'rgba(0,229,255,0.18)',
              'rgba(0,0,0,0.95)',
            ]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <View
              style={{
                padding: 20,
                borderWidth: 1,
                borderColor: 'rgba(157,107,255,0.4)',
                borderRadius: radii.xl,
              }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginBottom: 14,
                }}
              >
                <Ionicons
                  name="trophy"
                  size={26}
                  color={colors.amber}
                  style={neonTextShadow(colors.amber, 14) as any}
                />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text
                    style={[
                      {
                        color: colors.text,
                        fontFamily: fontFamilies.heading,
                        fontSize: 22,
                      },
                      neonTextShadow(theme.accentLight, 12),
                    ]}
                  >
                    {t('ws.title')}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontFamily: fontFamilies.body,
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {summary.title}
                  </Text>
                </View>
                <Pressable onPress={onClose} hitSlop={10}>
                  <Ionicons
                    name="close"
                    size={22}
                    color={colors.textSecondary}
                  />
                </Pressable>
              </View>

              <ScrollView showsVerticalScrollIndicator={false}>
                <View
                  style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}
                >
                  <StatCell
                    label={t('ws.time')}
                    value={fmtDuration(summary.durationMs)}
                    icon="time-outline"
                  />
                  <StatCell
                    label={t('ws.volume')}
                    value={`${summary.totalVolumeKg.toLocaleString('ru')} ${t('common.kg')}`}
                    icon="barbell-outline"
                  />
                </View>

                <View
                  style={{ flexDirection: 'row', gap: 10, marginBottom: 14 }}
                >
                  <StatCell
                    label={t('ws.sets')}
                    value={`${summary.completedSets}/${summary.totalSets}`}
                    icon="checkmark-circle-outline"
                    sub={`${completionPct}%`}
                  />
                  <StatCell
                    label={t('ws.exercises')}
                    value={summary.exerciseCount.toString()}
                    icon="fitness-outline"
                  />
                </View>

                {summary.prs.length > 0 ? (
                  <View style={{ marginBottom: 14 }}>
                    <Text
                      style={{
                        color: colors.amber,
                        fontFamily: fontFamilies.body700,
                        fontSize: 13,
                        letterSpacing: 1,
                        marginBottom: 8,
                      }}
                    >
                      {t('ws.prs', { n: summary.prs.length })}
                    </Text>
                    <View style={{ gap: 8 }}>
                      {summary.prs.map((pr) => (
                        <View
                          key={pr.exerciseId}
                          style={{
                            padding: 12,
                            borderRadius: 14,
                            borderWidth: 1,
                            borderColor: colors.amber,
                            backgroundColor: 'rgba(255,181,71,0.12)',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Ionicons
                            name="flame"
                            size={18}
                            color={colors.amber}
                            style={{ marginRight: 10 }}
                          />
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                color: colors.text,
                                fontFamily: fontFamilies.body700,
                                fontSize: 13,
                              }}
                            >
                              {exerciseDisplayName(pr.exerciseId) ||
                                t('history.unknownExercise')}
                            </Text>
                            <Text
                              style={{
                                color: colors.amber,
                                fontFamily: fontFamilies.body600,
                                fontSize: 11,
                                marginTop: 2,
                              }}
                            >
                              {pr.weight} {t('common.kg')} × {pr.reps}
                              {pr.previousMax !== null
                                ? ` ${t('ws.wasKg', { x: pr.previousMax })}`
                                : ` ${t('ws.firstRecord')}`}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}

                {summary.suggestions.length > 0 ? (
                  <View style={{ marginBottom: 14 }}>
                    <Text
                      style={{
                        color: colors.cyan,
                        fontFamily: fontFamilies.body700,
                        fontSize: 13,
                        letterSpacing: 1,
                        marginBottom: 8,
                      }}
                    >
                      {t('ws.nextTime')}
                    </Text>
                    <View style={{ gap: 8 }}>
                      {summary.suggestions.map((s) => (
                        <View
                          key={s.exerciseId}
                          style={{
                            padding: 12,
                            borderRadius: 14,
                            borderWidth: 1,
                            borderColor: colors.cyan,
                            backgroundColor: 'rgba(0,229,255,0.08)',
                            flexDirection: 'row',
                            alignItems: 'center',
                          }}
                        >
                          <Ionicons
                            name="trending-up"
                            size={18}
                            color={colors.cyan}
                            style={{ marginRight: 10 }}
                          />
                          <View style={{ flex: 1 }}>
                            <Text
                              style={{
                                color: colors.text,
                                fontFamily: fontFamilies.body700,
                                fontSize: 13,
                              }}
                            >
                              {exerciseDisplayName(s.exerciseId) ||
                                t('history.unknownExercise')}{' '}
                              · +{s.addKg}{' '}
                              {t('common.kg')}
                            </Text>
                            <Text
                              style={{
                                color: colors.textMuted,
                                fontFamily: fontFamilies.body,
                                fontSize: 11,
                                marginTop: 2,
                              }}
                            >
                              {s.reason}
                            </Text>
                          </View>
                        </View>
                      ))}
                    </View>
                  </View>
                ) : null}
              </ScrollView>

              <GradientButton
                title={t('common.done')}
                onPress={onClose}
                rightIcon={
                  <Ionicons name="checkmark" size={18} color={colors.text} />
                }
              />
            </View>
          </LinearGradient>
        </View>
      </View>
    </Modal>
  );
}

function StatCell({
  label,
  value,
  icon,
  sub,
}: {
  label: string;
  value: string;
  icon: keyof typeof Ionicons.glyphMap;
  sub?: string;
}) {
  const theme = useTheme();
  return (
    <View
      style={{
        flex: 1,
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: 'rgba(0,0,0,0.3)',
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6 }}>
        <Ionicons name={icon} size={14} color={theme.accentLight} />
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: fontFamilies.body500,
            fontSize: 10,
            letterSpacing: 1,
          }}
        >
          {label.toUpperCase()}
        </Text>
      </View>
      <Text
        style={[
          {
            marginTop: 6,
            color: colors.text,
            fontFamily: fontFamilies.body700,
            fontSize: 18,
          },
          neonTextShadow(theme.accentLight, 8),
        ]}
      >
        {value}
      </Text>
      {sub ? (
        <Text
          style={{
            marginTop: 2,
            color: colors.textMuted,
            fontFamily: fontFamilies.body,
            fontSize: 10,
          }}
        >
          {sub}
        </Text>
      ) : null}
    </View>
  );
}
