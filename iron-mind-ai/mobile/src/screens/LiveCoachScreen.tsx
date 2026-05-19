import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

export function LiveCoachScreen() {
  useLang();
  const nav = useNavigation<any>();
  const [question, setQuestion] = useState('');
  const [sent, setSent] = useState(false);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('live.title')} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Card variant="secondary" style={{ padding: 14, borderColor: '#FF4DD2', borderWidth: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="diamond" size={18} color="#FF4DD2" />
              <Text style={{ flex: 1, color: '#FF4DD2', fontFamily: fontFamilies.body700, fontSize: 12 }}>
                {t('live.elite')}
              </Text>
            </View>
            <Text style={{ marginTop: 6, color: colors.text, fontFamily: fontFamilies.body, fontSize: 13, lineHeight: 19 }}>
              {t('live.intro')}
            </Text>
          </Card>
        </View>

        {sent ? (
          <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
            <Card variant="secondary" style={{ padding: 14, borderColor: colors.green, borderWidth: 1 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
                <Ionicons name="checkmark-circle" size={18} color={colors.green} />
                <Text style={{ color: colors.green, fontFamily: fontFamilies.body700, fontSize: 13 }}>
                  {t('live.sent')}
                </Text>
              </View>
              <Text style={{ marginTop: 6, color: colors.text, fontFamily: fontFamilies.body, fontSize: 12 }}>
                {t('live.sentBody')}
              </Text>
            </Card>
          </View>
        ) : (
          <>
            <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
              <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>
                {t('live.questionLabel')}
              </Text>
              <TextInput
                value={question}
                onChangeText={setQuestion}
                placeholder={t('live.questionPh')}
                placeholderTextColor={colors.textMuted}
                multiline
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
                title={t('live.send')}
                onPress={() => {
                  if (question.trim().length < 10) {
                    Alert.alert(t('form.shortTitle'), t('live.elaborate'));
                    return;
                  }
                  setSent(true);
                }}
                rightIcon={<Ionicons name="paper-plane" size={18} color="#fff" />}
              />
            </View>

            <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
              <Card variant="secondary">
                <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11, lineHeight: 16 }}>
                  {t('live.note')}
                </Text>
              </Card>
            </View>
          </>
        )}
      </ScrollView>
    </View>
  );
}
