/**
 * Шеринг программ. Скаффолд: генерация короткого кода для своей программы + ввод чужого кода.
 * Реальный backend endpoint /programs/share + /programs/clone-by-code будет добавлен отдельно.
 */
import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Share, Text, TextInput, View } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return Array.from({ length: 8 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

export function ShareProgramScreen() {
  useLang();
  const route = useRoute<any>();
  const nav = useNavigation<any>();
  const programId: string | undefined = route.params?.programId;

  const [code, setCode] = useState<string | null>(programId ? genCode() : null);
  const [inputCode, setInputCode] = useState('');

  const share = async () => {
    if (!code) return;
    try {
      await Share.share({
        message: `Iron Mind AI program code: ${code}\nhttps://iron-mind.app/p/${code}`,
      });
    } catch {
      /* noop */
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('share.title')} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {code ? (
          <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
            <Card variant="secondary" style={{ padding: 16 }}>
              <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 12 }}>
                {t('share.codeHint')}
              </Text>
              <Text
                style={{
                  marginTop: 16,
                  color: colors.text,
                  fontFamily: fontFamilies.heading,
                  fontSize: 32,
                  letterSpacing: 6,
                  textAlign: 'center',
                }}
              >
                {code}
              </Text>
              <View style={{ marginTop: 16, flexDirection: 'row', gap: 8 }}>
                <Pressable
                  onPress={() => setCode(genCode())}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.bgSecondary,
                    alignItems: 'center',
                  }}
                >
                  <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body700, fontSize: 12 }}>
                    {t('share.newCode')}
                  </Text>
                </Pressable>
                <Pressable
                  onPress={share}
                  style={{
                    flex: 1,
                    paddingVertical: 12,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: colors.borderNeon,
                    backgroundColor: 'rgba(157,107,255,0.18)',
                    alignItems: 'center',
                    flexDirection: 'row',
                    justifyContent: 'center',
                    gap: 6,
                  }}
                >
                  <Ionicons name="share-social" size={14} color={colors.purpleLight} />
                  <Text style={{ color: colors.purpleLight, fontFamily: fontFamilies.body700, fontSize: 12 }}>
                    {t('share.shareBtn')}
                  </Text>
                </Pressable>
              </View>
            </Card>
          </View>
        ) : null}

        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <Card variant="secondary" style={{ padding: 16 }}>
            <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>
              {t('share.applyTitle')}
            </Text>
            <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11, marginTop: 4 }}>
              {t('share.applyHint')}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
              <TextInput
                value={inputCode}
                onChangeText={(v) => setInputCode(v.toUpperCase().slice(0, 8))}
                placeholder="ABCD1234"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
                style={{
                  flex: 1,
                  height: 48,
                  borderRadius: radii.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.bgSecondary,
                  paddingHorizontal: 14,
                  color: colors.text,
                  fontFamily: fontFamilies.body700,
                  fontSize: 16,
                  letterSpacing: 3,
                }}
              />
              <Pressable
                onPress={() =>
                  Alert.alert(t('common.loading'), t('share.inProgress', { code: inputCode || '—' }))
                }
                style={{
                  paddingHorizontal: 16,
                  borderRadius: radii.md,
                  borderWidth: 1,
                  borderColor: colors.cyan,
                  backgroundColor: 'rgba(0,229,255,0.16)',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: colors.cyan, fontFamily: fontFamilies.body700, fontSize: 12 }}>
                  {t('share.applyBtn')}
                </Text>
              </Pressable>
            </View>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Card variant="secondary">
            <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11, lineHeight: 16 }}>
              {t('share.note')}
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
