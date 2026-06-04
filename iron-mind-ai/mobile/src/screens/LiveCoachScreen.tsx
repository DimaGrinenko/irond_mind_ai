import React, { useCallback, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { useTheme } from '../theme/useTheme';
import { t, useLang } from '../i18n';
import { api } from '../api/client';

const COACH_PREFIX = '[Вопрос из раздела «Тренер»] ';

export function LiveCoachScreen() {
  useLang();
  const theme = useTheme();
  const nav = useNavigation<any>();
  const [question, setQuestion] = useState('');
  const [answer, setAnswer] = useState<string | null>(null);
  const [sending, setSending] = useState(false);
  const [aiLive, setAiLive] = useState(false);

  useFocusEffect(
    useCallback(() => {
      api.chat
        .status()
        .then((s) => setAiLive(s.enabled))
        .catch(() => setAiLive(false));
    }, []),
  );

  const onSend = async () => {
    const trimmed = question.trim();
    if (trimmed.length < 10) {
      Alert.alert(t('form.shortTitle'), t('live.elaborate'));
      return;
    }
    setSending(true);
    setAnswer(null);
    try {
      const resp = await api.chat.send(`${COACH_PREFIX}${trimmed}`);
      setAnswer(resp.aiMsg.content);
      setQuestion('');
    } catch {
      Alert.alert(t('common.error'), t('live.aiOffline'));
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('live.title')} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Card
            variant="secondary"
            style={{ padding: 14, borderColor: '#FF4DD2', borderWidth: 1 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="diamond" size={18} color="#FF4DD2" />
              <Text
                style={{
                  flex: 1,
                  color: '#FF4DD2',
                  fontFamily: fontFamilies.body700,
                  fontSize: 12,
                }}
              >
                {t('live.elite')}
              </Text>
              {aiLive ? (
                <Text
                  style={{
                    color: colors.cyan,
                    fontFamily: fontFamilies.body500,
                    fontSize: 10,
                  }}
                >
                  DeepSeek
                </Text>
              ) : null}
            </View>
            <Text
              style={{
                marginTop: 6,
                color: colors.text,
                fontFamily: fontFamilies.body,
                fontSize: 13,
                lineHeight: 19,
              }}
            >
              {t('live.intro')}
            </Text>
          </Card>
        </View>

        {answer ? (
          <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
            <Card
              variant="secondary"
              style={{ padding: 14, borderColor: colors.green, borderWidth: 1 }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="checkmark-circle" size={18} color={colors.green} />
                <Text
                  style={{
                    color: colors.green,
                    fontFamily: fontFamilies.body700,
                    fontSize: 13,
                  }}
                >
                  {t('live.sent')}
                </Text>
              </View>
              <Text
                style={{
                  marginTop: 6,
                  color: colors.textMuted,
                  fontFamily: fontFamilies.body,
                  fontSize: 11,
                }}
              >
                {t('live.sentBody')}
              </Text>
              <Text
                style={{
                  marginTop: 10,
                  color: colors.text,
                  fontFamily: fontFamilies.body,
                  fontSize: 14,
                  lineHeight: 21,
                }}
              >
                {answer}
              </Text>
            </Card>
            <Pressable
              onPress={() =>
                nav.navigate('RootTabs', { screen: 'AiTrainer' })
              }
              style={{ marginTop: 12, alignItems: 'center', paddingVertical: 10 }}
            >
              <Text
                style={{
                  color: theme.accentLight,
                  fontFamily: fontFamilies.body700,
                  fontSize: 13,
                }}
              >
                {t('live.openAiChat')}
              </Text>
            </Pressable>
          </View>
        ) : null}

        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <Text
            style={{
              color: colors.textMuted,
              fontFamily: fontFamilies.body500,
              fontSize: 10,
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            {t('live.questionLabel')}
          </Text>
          <TextInput
            value={question}
            onChangeText={setQuestion}
            placeholder={t('live.questionPh')}
            placeholderTextColor={colors.textMuted}
            multiline
            editable={!sending}
            style={{
              minHeight: 140,
              padding: 12,
              borderRadius: radii.md,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.bgSecondary,
              color: colors.text,
              fontFamily: fontFamilies.body,
              fontSize: 14,
              textAlignVertical: 'top',
            }}
          />
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <GradientButton
            title={sending ? t('live.sending') : t('live.send')}
            onPress={() => {
              if (!sending) void onSend();
            }}
            rightIcon={
              sending ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Ionicons name="paper-plane" size={18} color="#fff" />
              )
            }
          />
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Card variant="secondary">
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: fontFamilies.body,
                fontSize: 11,
                lineHeight: 16,
              }}
            >
              {t('live.note')}
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
