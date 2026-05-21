/**
 * AI-тренер — чат с искусственным интеллектом.
 * Использует backend /chat (с fallback на rule-based когда нет ANTHROPIC_API_KEY).
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../components/common/Card';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors, neonGlow, neonTextShadow } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { fontFamilies } from '../theme/typography';
import { api } from '../api/client';
import { t, useLang } from '../i18n';

type Msg = {
  id: string;
  role: 'USER' | 'ASSISTANT';
  content: string;
  createdAt?: string;
};

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
  const insets = useSafeAreaInsets();
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState('');
  const [sending, setSending] = useState(false);
  const [loading, setLoading] = useState(true);
  const scrollRef = useRef<ScrollView>(null);

  const load = useCallback(async () => {
    try {
      const list = await api.chat.list();
      setMessages(list as Msg[]);
    } catch {
      setMessages([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );
  useEffect(() => {
    load();
  }, [load]);

  useEffect(() => {
    if (messages.length > 0) {
      requestAnimationFrame(() =>
        scrollRef.current?.scrollToEnd({ animated: true }),
      );
    }
  }, [messages.length]);

  const sendMessage = async (text: string) => {
    const trimmed = text.trim();
    if (!trimmed || sending) return;
    setInput('');
    const optimistic: Msg = {
      id: `tmp_${Date.now()}`,
      role: 'USER',
      content: trimmed,
    };
    setMessages((prev) => [...prev, optimistic]);
    setSending(true);
    try {
      const resp = await api.chat.send(trimmed);
      setMessages((prev) => [
        ...prev.filter((m) => m.id !== optimistic.id),
        resp.userMsg as Msg,
        resp.aiMsg as Msg,
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          id: `err_${Date.now()}`,
          role: 'ASSISTANT',
          content: t('ai.networkError'),
        },
      ]);
    } finally {
      setSending(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('ai.title')} />
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={80}
      >
        <ScrollView
          ref={scrollRef}
          contentContainerStyle={{
            paddingHorizontal: 16,
            paddingBottom: 16,
            paddingTop: 12,
          }}
          showsVerticalScrollIndicator={false}
        >
          {loading ? (
            <View style={{ paddingVertical: 36, alignItems: 'center' }}>
              <ActivityIndicator color={theme.accentLight} />
            </View>
          ) : messages.length === 0 ? (
            <View style={{ gap: 14 }}>
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
                      onPress={() => sendMessage(p)}
                      style={{
                        padding: 12,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: theme.borderNeon,
                        backgroundColor: 'rgba(157,107,255,0.08)',
                        flexDirection: 'row',
                        alignItems: 'center',
                        gap: 10,
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
          ) : (
            <View style={{ gap: 10 }}>
              {messages.map((m) => (
                <MessageBubble key={m.id} message={m} />
              ))}
              {sending ? (
                <View
                  style={{
                    alignSelf: 'flex-start',
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
            </View>
          )}
        </ScrollView>

        <View
          style={{
            paddingHorizontal: 12,
            paddingTop: 8,
            paddingBottom: Math.max(insets.bottom, 12) + 8,
            borderTopWidth: 1,
            borderTopColor: colors.border,
            backgroundColor: 'rgba(3,4,10,0.95)',
            flexDirection: 'row',
            alignItems: 'flex-end',
            gap: 8,
          }}
        >
          <View
            style={{
              flex: 1,
              borderRadius: 20,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.bgSecondary,
              paddingHorizontal: 14,
              paddingVertical: 4,
              minHeight: 44,
              maxHeight: 110,
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
                fontSize: 14,
                paddingVertical: 10,
                maxHeight: 100,
              }}
              multiline
              editable={!sending}
              onSubmitEditing={() => sendMessage(input)}
              blurOnSubmit={false}
            />
          </View>
          <Pressable
            onPress={() => sendMessage(input)}
            disabled={!input.trim() || sending}
            style={{
              width: 44,
              height: 44,
              borderRadius: 22,
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
              size={18}
              color={input.trim() && !sending ? '#fff' : colors.textMuted}
            />
          </Pressable>
        </View>
      </KeyboardAvoidingView>
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
