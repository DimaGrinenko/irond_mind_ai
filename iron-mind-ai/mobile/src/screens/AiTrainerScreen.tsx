import { LinearGradient } from 'expo-linear-gradient';
import React, { useMemo, useRef, useState } from 'react';
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors, glowStrong, gradients, neonGlow, neonTextShadow } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { useChatStore } from '../store/chatStore';
import { photos } from '../theme/photos';
import { NeonCard } from '../components/common/NeonCard';
import { NeonText } from '../components/common/NeonText';

export function AiTrainerScreen() {
  const messages = useChatStore((s) => s.messages);
  const send = useChatStore((s) => s.send);
  const [text, setText] = useState('');
  const insets = useSafeAreaInsets();
  const scrollRef = useRef<ScrollView>(null);

  const canSend = useMemo(() => text.trim().length > 0, [text]);

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: colors.bg }}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      {/* aurora background */}
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: -120, right: -80, width: 380, height: 380, opacity: 0.5 }}
      >
        <LinearGradient
          colors={['rgba(0,229,255,0.45)', 'rgba(0,229,255,0)']}
          style={{ flex: 1, borderRadius: 200 }}
        />
      </View>
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: 100, left: -80, width: 360, height: 360, opacity: 0.5 }}
      >
        <LinearGradient
          colors={['rgba(157,107,255,0.55)', 'rgba(157,107,255,0)']}
          style={{ flex: 1, borderRadius: 200 }}
        />
      </View>

      <View style={{ paddingTop: insets.top + 8, paddingHorizontal: 16, paddingBottom: 14, flexDirection: 'row', alignItems: 'center', gap: 8 }}>
        <Ionicons name="sparkles" size={18} color={colors.cyan} style={{ textShadowColor: colors.cyan, textShadowRadius: 14 }} />
        <NeonText variant="heading" glow="purple" glowRadius={12} style={{ fontSize: 22 }}>
          AI Chat
        </NeonText>
      </View>

      <ScrollView
        ref={scrollRef}
        contentContainerStyle={{ paddingHorizontal: 16, paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: true })}
      >
        <NeonCard tint="aurora" intensity={0.95}>
          <View style={{ padding: 16, flexDirection: 'row', gap: 12 }}>
            <View
              style={{
                width: 92,
                height: 132,
                borderRadius: 18,
                backgroundColor: 'rgba(157,107,255,0.10)',
                borderWidth: 1,
                borderColor: 'rgba(157,107,255,0.7)',
                alignItems: 'center',
                justifyContent: 'center',
                overflow: 'hidden',
                ...glowStrong,
              }}
            >
              {photos.ai_avatar ? (
                <>
                  <Image source={photos.ai_avatar} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                  <LinearGradient
                    colors={['rgba(0,0,0,0)', 'rgba(157,107,255,0.6)'] as any}
                    start={{ x: 0.5, y: 0 }}
                    end={{ x: 0.5, y: 1 }}
                    style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
                  />
                </>
              ) : (
                <Ionicons name="person" size={42} color="rgba(255,255,255,0.55)" />
              )}
              {/* online dot */}
              <View
                style={{
                  position: 'absolute',
                  bottom: 8,
                  right: 8,
                  width: 12,
                  height: 12,
                  borderRadius: 6,
                  backgroundColor: colors.green,
                  borderWidth: 2,
                  borderColor: colors.bg,
                  ...neonGlow(colors.green, 0.95, 10, 6),
                }}
              />
            </View>

            <View style={{ flex: 1 }}>
              <Text
                style={[
                  { color: colors.text, fontFamily: fontFamilies.body700, fontSize: 22, lineHeight: 26 },
                  neonTextShadow(colors.cyan, 14),
                ]}
              >
                Привет!
              </Text>
              <Text
                style={[
                  { color: colors.text, fontFamily: fontFamilies.body700, fontSize: 22, lineHeight: 26 },
                  neonTextShadow(colors.purple, 14),
                ]}
              >
                Я твой AI тренер.
              </Text>
              <Text style={{ marginTop: 6, color: colors.textSecondary, fontFamily: fontFamilies.body }}>
                Чем могу помочь сегодня?
              </Text>

              <View style={{ marginTop: 12, gap: 8 }}>
                {(
                  [
                    { t: 'Составь тренировку', icon: 'barbell-outline', tint: colors.purpleLight },
                    { t: 'Скорректируй питание', icon: 'restaurant-outline', tint: colors.green },
                    { t: 'Как улучшить сон?', icon: 'moon-outline', tint: colors.cyan },
                    { t: 'Мотивация', icon: 'sparkles-outline', tint: colors.pink },
                  ] as const
                ).map((x) => (
                  <Pressable
                    key={x.t}
                    onPress={() => send(x.t)}
                    accessibilityRole="button"
                    accessibilityLabel={x.t}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 10,
                      paddingVertical: 10,
                      paddingHorizontal: 12,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: x.tint + '99',
                      backgroundColor: 'rgba(13,16,32,0.7)',
                      ...neonGlow(x.tint, 0.4, 12, 4),
                    }}
                  >
                    <Ionicons name={x.icon as any} size={18} color={x.tint} />
                    <Text style={{ color: colors.text, fontFamily: fontFamilies.body600 }}>{x.t}</Text>
                  </Pressable>
                ))}
              </View>
            </View>
          </View>
        </NeonCard>

        <View style={{ marginTop: 16, gap: 10 }}>
          {messages.map((m) => {
            const isUser = m.role === 'user';
            return (
              <View
                key={m.id}
                style={{
                  alignSelf: isUser ? 'flex-end' : 'flex-start',
                  maxWidth: '88%',
                  borderRadius: 18,
                  borderWidth: 1,
                  borderColor: isUser ? 'rgba(157,107,255,0.6)' : 'rgba(0,229,255,0.4)',
                  overflow: 'hidden',
                  ...neonGlow(isUser ? colors.purple : colors.cyan, 0.4, 14, 6),
                }}
              >
                <LinearGradient
                  colors={
                    isUser
                      ? ['rgba(157,107,255,0.4)', 'rgba(255,77,210,0.15)']
                      : ['rgba(0,229,255,0.18)', 'rgba(8,11,22,0.85)']
                  }
                  style={{ paddingVertical: 12, paddingHorizontal: 14 }}
                >
                  <Text style={{ color: colors.text, fontFamily: fontFamilies.body }}>{m.content}</Text>
                </LinearGradient>
              </View>
            );
          })}
        </View>
      </ScrollView>

      <View
        style={{
          paddingHorizontal: 16,
          paddingTop: 10,
          paddingBottom: Math.max(insets.bottom, 12) + 4,
          borderTopWidth: 1,
          borderTopColor: 'rgba(157,107,255,0.4)',
          backgroundColor: 'rgba(3,4,10,0.92)',
          flexDirection: 'row',
          alignItems: 'flex-end',
          gap: 12,
        }}
      >
        <View style={{ flex: 1 }}>
          <TextInput
            value={text}
            onChangeText={setText}
            placeholder="Напиши сообщение..."
            placeholderTextColor={colors.textMuted}
            style={{
              minHeight: 50,
              borderRadius: 16,
              borderWidth: 1,
              borderColor: text ? 'rgba(157,107,255,0.7)' : colors.borderStrong,
              backgroundColor: 'rgba(13,16,32,0.95)',
              paddingHorizontal: 14,
              paddingVertical: 12,
              color: colors.text,
              fontFamily: fontFamilies.body,
              shadowColor: colors.purple,
              shadowOpacity: text ? 0.5 : 0,
              shadowRadius: 14,
              shadowOffset: { width: 0, height: 0 },
              elevation: text ? 6 : 0,
            }}
          />
        </View>
        <Pressable
          disabled={!canSend}
          accessibilityRole="button"
          accessibilityLabel="Отправить сообщение"
          accessibilityState={{ disabled: !canSend }}
          onPress={() => {
            const t = text.trim();
            setText('');
            send(t);
          }}
          style={{ width: 50, height: 50, borderRadius: 16, overflow: 'hidden', ...glowStrong, opacity: canSend ? 1 : 0.45 }}
        >
          <LinearGradient
            colors={gradients.AURORA as any}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={{ flex: 1, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="arrow-up" size={22} color={colors.text} />
          </LinearGradient>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

