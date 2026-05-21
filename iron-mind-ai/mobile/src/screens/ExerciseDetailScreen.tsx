import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Linking,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../navigation/types';
import { BodyFigure } from '../components/anatomy/BodyFigure';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors, radii } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { fontFamilies } from '../theme/typography';
import { exercises } from '../data/exercises';
import { localizedExercise } from '../data/exercises_en';
import { useActiveWorkoutStore } from '../store/activeWorkoutStore';
import { t, useLang, muscleLabel, difficultyLabel } from '../i18n';

type R = RouteProp<RootStackParamList, 'ExerciseDetail'>;

function youtubeId(url: string): string | null {
  // https://www.youtube.com/watch?v=XXX или https://youtu.be/XXX
  const m1 = url.match(/[?&]v=([^&]+)/);
  if (m1) return m1[1];
  const m2 = url.match(/youtu\.be\/([^?]+)/);
  if (m2) return m2[1];
  return null;
}

export function ExerciseDetailScreen() {
  const lang = useLang();
  const theme = useTheme();
  const route = useRoute<R>();
  const navigation = useNavigation<any>();
  const ex = useMemo(
    () =>
      localizedExercise(
        exercises.find((e) => e.id === route.params.exerciseId) ?? exercises[0],
        lang,
      ),
    [route.params.exerciseId, lang],
  );
  const hasVideo = !!ex.videoUrl;
  const [videoOpen, setVideoOpen] = useState(false);
  const ytId = ex.videoUrl ? youtubeId(ex.videoUrl) : null;

  const activeWorkout = useActiveWorkoutStore((s) => s.workout);

  const openExternal = async () => {
    if (!ex.videoUrl) return;
    try {
      await Linking.openURL(ex.videoUrl);
    } catch {
      Alert.alert(t('common.error'), 'Linking failed');
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={ex.name}
        onBack={() => navigation.goBack()}
        right={
          hasVideo ? (
            <Pressable
              onPress={openExternal}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.bgSecondary,
              }}
            >
              <Ionicons
                name="open-outline"
                size={14}
                color={theme.accentLight}
              />
            </Pressable>
          ) : null
        }
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 130 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card style={{ padding: 0, overflow: 'hidden' }}>
            <LinearGradient
              colors={['rgba(79,31,184,0.22)', 'rgba(0,0,0,0)']}
              style={{ padding: 16 }}
            >
              <View
                style={{
                  flexDirection: 'row',
                  gap: 10,
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}
              >
                <Tag>{muscleLabel(ex.primary)}</Tag>
                <Tag>{difficultyLabel(ex.difficulty)}</Tag>
                <Tag>{ex.equipment}</Tag>
              </View>

              {/* Видео-плейсхолдер / WebView */}
              <View
                style={{
                  marginTop: 12,
                  borderRadius: 18,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: hasVideo
                    ? 'rgba(123,63,228,0.55)'
                    : 'rgba(42,42,62,0.9)',
                  aspectRatio: 16 / 9,
                  backgroundColor: 'rgba(0,0,0,0.55)',
                }}
              >
                {videoOpen && ytId && Platform.OS !== 'web' ? (
                  <YoutubeEmbed videoId={ytId} />
                ) : videoOpen && ytId && Platform.OS === 'web' ? (
                  // На web можно показать iframe через WebView, но проще — открыть в новой вкладке
                  <Pressable
                    onPress={openExternal}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Ionicons name="logo-youtube" size={48} color="#FF0000" />
                    <Text
                      style={{
                        marginTop: 8,
                        color: colors.textSecondary,
                        fontFamily: fontFamilies.body,
                        fontSize: 12,
                      }}
                    >
                      Tap to open
                    </Text>
                  </Pressable>
                ) : (
                  <Pressable
                    onPress={() => (hasVideo ? setVideoOpen(true) : null)}
                    style={{
                      flex: 1,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                    disabled={!hasVideo}
                  >
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 32,
                        backgroundColor: hasVideo
                          ? 'rgba(123,63,228,0.45)'
                          : 'rgba(0,0,0,0.45)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.18)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons
                        name={hasVideo ? 'play' : 'videocam-off'}
                        size={28}
                        color={hasVideo ? colors.text : colors.textMuted}
                      />
                    </View>
                    <Text
                      style={{
                        marginTop: 10,
                        color: colors.textSecondary,
                        fontFamily: fontFamilies.body600,
                        fontSize: 12,
                      }}
                    >
                      {hasVideo ? t('ed.tapToWatch') : t('ed.videoSoon')}
                    </Text>
                  </Pressable>
                )}
              </View>

              <View
                style={{
                  marginTop: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View style={{ width: 130, alignItems: 'center' }}>
                  <BodyFigure
                    width={120}
                    height={160}
                    highlights={{
                      chest:
                        ex.primary === 'Грудь'
                          ? colors.pink
                          : 'rgba(255,255,255,0.06)',
                      back:
                        ex.primary === 'Спина'
                          ? colors.blue
                          : 'rgba(255,255,255,0.04)',
                      shoulders:
                        ex.primary === 'Плечи'
                          ? theme.accentLight
                          : 'rgba(255,255,255,0.04)',
                      arms:
                        ex.primary === 'Бицепс' || ex.primary === 'Трицепс'
                          ? colors.red
                          : 'rgba(255,255,255,0.04)',
                      legs:
                        ex.primary === 'Ноги' || ex.primary === 'Ягодицы'
                          ? colors.green
                          : 'rgba(255,255,255,0.03)',
                      core:
                        ex.primary === 'Пресс'
                          ? '#F8D14A'
                          : 'rgba(255,255,255,0.03)',
                    }}
                  />
                </View>

                <View style={{ flex: 1, paddingLeft: 12 }}>
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontFamily: fontFamilies.body500,
                      fontSize: 11,
                      letterSpacing: 1,
                    }}
                  >
                    {t('ed.workingMuscles')}
                  </Text>
                  <View style={{ marginTop: 8, gap: 6 }}>
                    {[ex.primary, ...ex.secondary].slice(0, 4).map((m, i) => (
                      <View
                        key={`${m}-${i}`}
                        style={{
                          flexDirection: 'row',
                          alignItems: 'center',
                          gap: 8,
                        }}
                      >
                        <View
                          style={{
                            width: 6,
                            height: 6,
                            borderRadius: 3,
                            backgroundColor:
                              i === 0 ? colors.pink : colors.textMuted,
                          }}
                        />
                        <Text
                          style={{
                            color: i === 0 ? colors.text : colors.textSecondary,
                            fontFamily: fontFamilies.body600,
                            fontSize: 12,
                          }}
                        >
                          {muscleLabel(m)}
                          {i === 0 ? t('ed.primaryMuscle') : ''}
                        </Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            </LinearGradient>
          </Card>
        </View>

        {/* Техника */}
        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <Card variant="secondary" style={{ padding: 14 }}>
            <Text
              style={{
                color: colors.text,
                fontFamily: fontFamilies.body700,
                fontSize: 14,
                marginBottom: 10,
              }}
            >
              {t('ed.technique')}
            </Text>
            <View style={{ gap: 10 }}>
              {ex.steps.map((s, idx) => (
                <View
                  key={`${s}-${idx}`}
                  style={{ flexDirection: 'row', gap: 10 }}
                >
                  <View
                    style={{
                      width: 24,
                      height: 24,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: theme.borderNeon,
                      backgroundColor: 'rgba(123,63,228,0.15)',
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: theme.accentLight,
                        fontFamily: fontFamilies.body700,
                        fontSize: 11,
                      }}
                    >
                      {idx + 1}
                    </Text>
                  </View>
                  <Text
                    style={{
                      flex: 1,
                      color: colors.textSecondary,
                      fontFamily: fontFamilies.body,
                      fontSize: 13,
                    }}
                  >
                    {s}
                  </Text>
                </View>
              ))}
            </View>
          </Card>
        </View>

        {/* Советы */}
        {ex.tips.length > 0 ? (
          <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
            <Card variant="secondary" style={{ padding: 14 }}>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: fontFamilies.body700,
                  fontSize: 14,
                  marginBottom: 10,
                }}
              >
                {t('ed.tips')}
              </Text>
              <View style={{ gap: 6 }}>
                {ex.tips.map((tip, idx) => (
                  <Text
                    key={`${tip}-${idx}`}
                    style={{
                      color: colors.textSecondary,
                      fontFamily: fontFamilies.body,
                      fontSize: 13,
                    }}
                  >
                    • {tip}
                  </Text>
                ))}
              </View>
            </Card>
          </View>
        ) : null}
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 18,
        }}
      >
        <GradientButton
          title={activeWorkout ? t('ed.backToWorkout') : t('ed.startWorkout')}
          onPress={() => {
            if (activeWorkout) navigation.navigate('GymMode');
            else navigation.goBack();
          }}
        />
      </View>
    </View>
  );
}

function Tag({ children }: { children: React.ReactNode }) {
  return (
    <View
      style={{
        paddingHorizontal: 10,
        paddingVertical: 6,
        borderRadius: 999,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: 'rgba(15,15,26,0.55)',
      }}
    >
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: fontFamilies.body600,
          fontSize: 11,
        }}
      >
        {children}
      </Text>
    </View>
  );
}

/** Ленивый импорт WebView чтобы не падать на web */
function YoutubeEmbed({ videoId }: { videoId: string }) {
  const [WebViewComp, setWebViewComp] = React.useState<any>(null);
  React.useEffect(() => {
    import('react-native-webview')
      .then((m) => setWebViewComp(() => m.WebView))
      .catch(() => setWebViewComp(null));
  }, []);
  if (!WebViewComp) {
    return (
      <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}>
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: fontFamilies.body,
            fontSize: 12,
          }}
        >
          Loading…
        </Text>
      </View>
    );
  }
  const url = `https://www.youtube.com/embed/${videoId}?autoplay=1&playsinline=1&rel=0&modestbranding=1`;
  return (
    <WebViewComp
      source={{ uri: url }}
      allowsInlineMediaPlayback
      mediaPlaybackRequiresUserAction={false}
      style={{ flex: 1, backgroundColor: '#000' }}
    />
  );
}
