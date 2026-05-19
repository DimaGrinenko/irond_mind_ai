/**
 * Разбор техники упражнения. Текстовый вариант (Vision-API заглушка):
 * пользователь описывает что чувствует / как выполняет, AI даёт разбор.
 * Реальная Vision-интеграция планируется отдельно.
 */
import React, { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, Text, TextInput, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { ExercisePickerModal } from '../components/workout/ExercisePickerModal';
import { api } from '../api/client';
import { exercises as catalog } from '../data/exercises';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

export function FormAnalysisScreen() {
  useLang();
  const nav = useNavigation<any>();
  const [exerciseId, setExerciseId] = useState<string>('squat');
  const [description, setDescription] = useState('');
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pickerVisible, setPickerVisible] = useState(false);

  const meta = catalog.find((e) => e.id === exerciseId);

  const ask = async () => {
    if (description.trim().length < 10) {
      Alert.alert(t('form.shortTitle'), t('form.short'));
      return;
    }
    setLoading(true);
    setAnalysis(null);
    try {
      const prompt = `Analyze technique for exercise "${meta?.name ?? exerciseId}". I do it like: ${description}. List 3 main mistakes I might be making and how to fix them. Short and to the point.`;
      const res: any = await api.chat.send(prompt);
      const reply = res?.aiMsg?.content ?? res?.reply ?? t('form.noReply');
      setAnalysis(reply);
    } catch (e) {
      Alert.alert(t('common.error'), (e as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('form.title')} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Card variant="secondary">
            <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11, lineHeight: 16 }}>
              {t('form.intro')}
            </Text>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Pressable
            onPress={() => setPickerVisible(true)}
            style={{
              padding: 12,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.borderNeon,
              backgroundColor: 'rgba(157,107,255,0.10)',
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Ionicons name="barbell" size={20} color={colors.purpleLight} />
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.textMuted, fontSize: 10, fontFamily: fontFamilies.body500, letterSpacing: 1 }}>
                {t('form.exercise')}
              </Text>
              <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14, marginTop: 2 }}>
                {meta?.name ?? exerciseId}
              </Text>
            </View>
            <Ionicons name="chevron-down" size={18} color={colors.textMuted} />
          </Pressable>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>
            {t('form.descLabel')}
          </Text>
          <TextInput
            value={description}
            onChangeText={setDescription}
            placeholder={t('form.descPh')}
            placeholderTextColor={colors.textMuted}
            multiline
            style={{
              minHeight: 120,
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

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <GradientButton
            title={loading ? t('form.analyzing') : t('form.btn')}
            onPress={ask}
            disabled={loading}
            rightIcon={loading ? <ActivityIndicator color="#fff" size="small" /> : <Ionicons name="sparkles" size={18} color="#fff" />}
          />
        </View>

        {analysis ? (
          <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
            <Card variant="secondary" style={{ padding: 14 }}>
              <View style={{ flexDirection: 'row', gap: 8, marginBottom: 8 }}>
                <Ionicons name="sparkles" size={16} color={colors.cyan} />
                <Text style={{ color: colors.cyan, fontFamily: fontFamilies.body700, fontSize: 12 }}>
                  {t('form.aiHeader')}
                </Text>
              </View>
              <Text style={{ color: colors.text, fontFamily: fontFamilies.body, fontSize: 13, lineHeight: 20 }}>
                {analysis}
              </Text>
            </Card>
          </View>
        ) : null}
      </ScrollView>

      <ExercisePickerModal
        visible={pickerVisible}
        onClose={() => setPickerVisible(false)}
        onPick={(e) => setExerciseId(e.id)}
      />
    </View>
  );
}
