/**
 * AI-тренер — чат с DeepSeek через backend POST /chat.
 */
import React, { useCallback, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../components/common/Card';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors, neonGlow, neonTextShadow } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { fontFamilies } from '../theme/typography';
import { api, ApiError } from '../api/client';
import { t, useLang } from '../i18n';
import { useAuthStore } from '../store/authStore';
import { useChatComposerBottom } from '../hooks/useTabBarInset';

const CHAT_COMPOSER_HEIGHT = 72;

type Msg = {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt?: string;
};

const DEMO_EMAIL = 'user@ironmind.local';
const DEMO_PASSWORD = 'user12345';

function quickPrompts() {
  return [
    t('ai.q1'),
    t('ai.q2'),
    t('ai.q3'),
    t('ai.q4'),
    t('ai.q5'),
    t('ai.q6'),
  ];
}

export function AiTrainerScreen() {
  useLang();
  const theme = useTheme();
  const composerBottom = useChatComposerBottom();
  const authOnline = useAuthStore((s) => s.online);
  const authLogin = useAuthStore((s) => s.login);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aiLive, setAiLive] = useState(false);
  const [aiProvider, setAiProvider] = useState<string | null>(null);
  const [loginBusy, setLoginBusy] = useState(false);
  const scrollRef = useRef<ScrollView>(null);

  const scrollToEnd = useCallback(() => {
    requestAnimationFrame(() =>
      scrollRef.current?.scrollToEnd({ animated: true }),
    );
  }, []);

  const load = useCallback(async () => {
    if (!authOnline) {
      setMessages([]);
      setAiLive(false);
      setAiProvider(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    try {
      const [list, status] = await Promise.all([
        api.chat.list(),
        api.chat.status(),
      ]);
      setMessages(list as Msg[]);
      setAiLive(status.enabled);
      setAiProvider(status.label);
    } catch {
      setMessages([]);
      setAiLive(false);
      setAiProvider(null);
    } finally {
      setLoading(false);
    }
  }, [authOnline]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  React.useEffect(() => {
    if (messages.length > 0) scrollToEnd();
  }, [messages.length, sending, scrollToEnd]);

  const demoLogin = async () => {
    setLoginBusy(true);
    try {
      await authLogin(DEMO_EMAIL, DEMO_PASSWORD);
      await load();
    } catch {
      Alert.alert(t('common.error'), t('ai.loginFailed'));
    } finally {
      setLoginBusy(false);
    }
  };

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;

    if (!authOnline) {
      Alert.alert(t('common.error'), t('ai.needLogin'), [
        { text: t('common.cancel'), style: 'cancel' },
        { text: t('ai.demoLogin'), onPress: () => void demoLogin() },
      ]);
      return;
    }

    setInput('');
    const optimistic: Msg = {
      id: `tmp_${Date.now()}`,
      role: 'USER',
      content: trimmed,
    };
    setMessages((prev) => [...prev, optimistic]);
    setSending(true);
    scrollToEnd();
    try {
      const resp = await api.chat.send(trimmed);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== optimistic.id),
        resp.userMsg as Msg,
        resp.aiMsg as Msg,
      ]);
      if (resp.meta.source === 'llm') {
        setAiLive(true);
        if (resp.meta.provider) setAiProvider(resp.meta.provider);
      } else if (resp.meta.source === 'rules' && resp.meta.llmError) {
        const err = resp.meta.llmError;
        const msg =
          err.includes('402') || /insufficient balance/i.test(err)
            ? t('ai.billingError')
            : t('ai.llmErrorGeneric', { error: err });
        Alert.alert(t('ai.rulesFallback'), msg);
      }
    } catch (e) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      if (e instanceof ApiError && e.status === 401) {
        Alert.alert(t('common.error'), t('ai.needLogin'), [
          { text: t('common.cancel'), style: 'cancel' },
          { text: t('ai.demoLogin'), onPress: () => void demoLogin() },
        ]);
      } else {
        setMessages((prev) => [
          ...prev,
          {
            id: `err_${Date.now()}`,
            role: 'ASSISTANT',
            content: e instanceof ApiError ? e.message : t('ai.networkError'),
          },
        ]);
      }
    } finally {
      setSending(false);
    }
  };

  const showEmptyIntro = !loading && messages.length === 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('ai.title')} />
      <View style={{ paddingHorizontal: 16, paddingBottom: 8 }}>
        <Text
          style={{
            color: aiLive ? colors.cyan : colors.textMuted,
            fontFamily: fontFamilies.body500,
            fontSize: 11,
            lineHeight: 16,
          }}
        >
          {aiLive
            ? t('ai.modeLive', { provider: aiProvider ?? 'DeepSeek' })
            : t('ai.modeRules')}
        </Text>
        <Text
          style={{
            marginTop: 4,
            color: colors.textMuted,
            fontFamily: fontFamilies.body,
            fontSize: 10,
            lineHeight: 14,
          }}
        >
          {t('ai.inputHint')}
        </Text>
      </View>

      {!authOnline ? (
        <View style={{ paddingHorizontal: 16, marginBottom: 8 }}>
          <Card variant="secondary" style={{ padding: 12 }}>
            <Text
              style={{
                color: colors.textSecondary,
                fontFamily: fontFamilies.body,
                fontSize: 12,
                lineHeight: 18,
              }}
            >
              {t('ai.needLogin')}
            </Text>
            <Pressable
              onPress={() => void demoLogin()}
              disabled={loginBusy}
              style={{
                marginTop: 10,
                paddingVertical: 10,
                alignItems: 'center',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.borderNeon,
                backgroundColor: 'rgba(157,107,255,0.15)',
              }}
            >
              {loginBusy ? (
                <ActivityIndicator color={theme.accentLight} />
              ) : (
                <Text
                  style={{
                    color: theme.accentLight,
                    fontFamily: fontFamilies.body700,
                    fontSize: 12,
                  }}
                >
                  {t('ai.demoLogin')}
                </Text>
              )}
            </Pressable>
          </Card>
        </View>
      ) : null}

      <View style={{ flex: 1 }}>
        <ScrollView
          ref={scrollRef}
          style={{ flex: 1 }}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: composerBottom + CHAT_COMPOSER_HEIGHT + 20,
            paddingTop: 4,
            flexGrow: 1,
          }}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
          onContentSizeChange={() => {
            if (messages.length > 0 || sending) scrollToEnd();
          }}
        >
          {loading ? (
            <View style={{ paddingVertical: 36, alignItems: 'center' }}>
              <ActivityIndicator color={theme.accentLight} />
            </View>
          ) : null}

          {showEmptyIntro ? (
            <View style={{ gap: 14, marginBottom: 12 }}>
              <Card variant="secondary" style={{ padding: 18 }}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                    marginBottom: 8,
                  }}
                >
                  <Ionicons name="sparkles" size={22} color={colors.cyan} />
                  <Text
                    style={[
                      {
                        color: colors.text,
                        fontFamily: fontFamilies.heading,
                        fontSize: 20,
                      },
                      neonTextShadow(colors.cyan, 12),
                    ]}
                  >
                    Iron Mind AI
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
                  {t('ai.intro')}
                </Text>
              </Card>

              <View>
                <Text
                  style={{
                    color: colors.textMuted,
                    fontFamily: fontFamilies.body500,
                    fontSize: 11,
                    letterSpacing: 1,
                    marginBottom: 8,
                  }}
                >
                  {t('ai.tryAsking')}
                </Text>
                <View style={{ gap: 8 }}>
                  {quickPrompts().map((p) => (
                    <Pressable
                      key={p}
                      onPress={() => void sendMessage(p)}
                      disabled={sending}
                      style={{
                        padding: 12,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: theme.borderNeon,
                        backgroundColor: 'rgba(157,107,255,0.08)',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
                        opacity: sending ? 0.6 : 1,
                      }}
                    >
                      <Ionicons
                        name="chatbubble-ellipses-outline"
                        size={16}
                        color={theme.accentLight}
                      />
                      <Text
                        style={{
                          flex: 1,
                          color: colors.text,
                          fontFamily: fontFamilies.body600,
                          fontSize: 13,
                        }}
                      >
                        {p}
                      </Text>
                      <Ionicons
                        name="arrow-forward"
                        size={16}
                        color={colors.textMuted}
                      />
                    </Pressable>
                  ))}
                </View>
              </View>
            </View>
          ) : null}

          {messages.length > 0 ? (
            <View style={{ gap: 10 }}>
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
            </View>
          ) : null}

          {sending ? (
            <View
              style={{
                alignSelf: 'flex-start',
                marginTop: 10,
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 16,
                borderTopLeftRadius: 4,
                backgroundColor: colors.bgSecondary,
                borderWidth: 1,
                borderColor: colors.border,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <ActivityIndicator size="small" color={theme.accentLight} />
              <Text
                style={{
                  color: colors.textMuted,
                  fontFamily: fontFamilies.body,
                  fontSize: 12,
                }}
              >
                {t('ai.thinking')}
              </Text>
            </View>
          ) : null}
        </ScrollView>

        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? composerBottom : 0}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: composerBottom,
          }}
        >
          <View
            style={{
              paddingHorizontal: 12,
              paddingTop: 10,
              paddingBottom: 10,
              minHeight: CHAT_COMPOSER_HEIGHT,
              borderTopWidth: 1,
              borderTopColor: colors.border,
              backgroundColor: colors.bg,
              flexDirection: 'row',
              alignItems: 'flex-end',
              gap: 8,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: -4 },
              shadowOpacity: 0.35,
              shadowRadius: 8,
              elevation: 16,
            }}
          >
            <View
              style={{
                flex: 1,
                borderRadius: 20,
                borderWidth: 1,
                borderColor: theme.borderNeon,
                backgroundColor: colors.bgSecondary,
                paddingHorizontal: 14,
                paddingVertical: 6,
                minHeight: 48,
                maxHeight: 120,
              }}
            >
              <TextInput
                value={input}
                onChangeText={setInput}
                placeholder={t('ai.placeholder')}
                placeholderTextColor={colors.textMuted}
                style={{
                  color: colors.text,
                  fontFamily: fontFamilies.body600,
                  fontSize: 15,
                  paddingVertical: 8,
                  maxHeight: 100,
                  minHeight: 40,
                }}
                multiline
                editable={!sending}
                onSubmitEditing={() => void sendMessage(input)}
                blurOnSubmit={false}
                accessibilityLabel={t('ai.placeholder')}
              />
            </View>
            <Pressable
              onPress={() => void sendMessage(input)}
              disabled={!input.trim() || sending}
              style={{
                width: 48,
                height: 48,
                borderRadius: 24,
                backgroundColor:
                  input.trim() && !sending
                    ? theme.accentLight
                    : colors.bgSecondary,
                alignItems: 'center',
                justifyContent: 'center',
                borderWidth: 1,
                borderColor:
                  input.trim() && !sending ? theme.accentLight : colors.border,
                ...(input.trim() && !sending
                  ? neonGlow(theme.accent, 0.55, 18, 6)
                  : {}),
              }}
            >
              <Ionicons
                name="send"
                size={20}
                color={input.trim() && !sending ? '#fff' : colors.textMuted}
              />
            </Pressable>
          </View>
        </KeyboardAvoidingView>
      </View>
    </View>
  );
}

function MessageBubble({ message }: { message: Msg }) {
  const isUser = message.role === 'USER';
  return (
    <View
      style={{
        alignSelf: isUser ? 'flex-end' : 'flex-start',
        maxWidth: '85%',
        borderRadius: 18,
        ...(isUser ? { borderTopRightRadius: 4 } : { borderTopLeftRadius: 4 }),
        overflow: 'hidden',
      }}
    >
      <LinearGradient
        colors={
          isUser
            ? ['rgba(157,107,255,0.45)', 'rgba(123,63,228,0.35)']
            : ['rgba(15,15,26,0.95)', 'rgba(8,11,22,0.95)']
        }
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
      >
        <View
          style={{
            paddingHorizontal: 14,
            paddingVertical: 10,
            borderWidth: 1,
            borderColor: isUser ? 'rgba(157,107,255,0.55)' : colors.border,
            borderRadius: 18,
            ...(isUser
              ? { borderTopRightRadius: 4 }
              : { borderTopLeftRadius: 4 }),
          }}
        >
          {!isUser ? (
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 4,
                marginBottom: 4,
              }}
            >
              <Ionicons name="sparkles" size={11} color={colors.cyan} />
              <Text
                style={{
                  color: colors.cyan,
                  fontFamily: fontFamilies.body700,
                  fontSize: 10,
                  letterSpacing: 0.5,
                }}
              >
                AI
              </Text>
            </View>
          ) : null}
          <Text
            style={{
              color: colors.text,
              fontFamily: fontFamilies.body,
              fontSize: 14,
              lineHeight: 20,
            }}
          >
            {message.content}
          </Text>
        </View>
      </LinearGradient>
    </View>
  );
}
