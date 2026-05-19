/**
 * Замер % жира по двум фоткам (фронт + бок). Vision-AI интеграция в работе.
 * Пока экран показывает scaffold с предупреждением и кнопкой импорта фоток.
 */
import React, { useState } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Card } from '../components/common/Card';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

export function BodyFatPhotoScreen() {
  useLang();
  const nav = useNavigation<any>();
  const [frontUri, setFrontUri] = useState<string | null>(null);
  const [sideUri, setSideUri] = useState<string | null>(null);

  const pick = async (which: 'front' | 'side') => {
    try {
      const res = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 0.7,
      });
      if (!res.canceled && res.assets[0]) {
        if (which === 'front') setFrontUri(res.assets[0].uri);
        else setSideUri(res.assets[0].uri);
      }
    } catch (e) {
      Alert.alert(t('common.error'), (e as Error).message);
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('bodyFat.title')} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Card variant="secondary">
            <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>
              {t('bodyFat.uploadTwo')}
            </Text>
            <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11, marginTop: 4, lineHeight: 16 }}>
              {t('bodyFat.hint')}
            </Text>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 14, flexDirection: 'row', gap: 10 }}>
          <PhotoSlot label={t('bodyFat.front')} uri={frontUri} onPress={() => pick('front')} />
          <PhotoSlot label={t('bodyFat.side')} uri={sideUri} onPress={() => pick('side')} />
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <Pressable
            disabled={!frontUri || !sideUri}
            onPress={() =>
              Alert.alert(t('bodyFat.aiTitle'), t('bodyFat.aiNote'))
            }
            style={{
              paddingVertical: 14,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: frontUri && sideUri ? colors.cyan : colors.border,
              backgroundColor: frontUri && sideUri ? 'rgba(0,229,255,0.16)' : colors.bgSecondary,
              alignItems: 'center',
              opacity: frontUri && sideUri ? 1 : 0.5,
            }}
          >
            <Text style={{ color: frontUri && sideUri ? colors.cyan : colors.textMuted, fontFamily: fontFamilies.body700, fontSize: 13 }}>
              {t('bodyFat.evaluate')}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

function PhotoSlot({ label, uri, onPress }: { label: string; uri: string | null; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        flex: 1,
        aspectRatio: 0.7,
        borderRadius: radii.lg,
        borderWidth: 1,
        borderColor: uri ? colors.borderNeon : colors.border,
        backgroundColor: uri ? 'transparent' : colors.bgSecondary,
        overflow: 'hidden',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {uri ? (
        <Image source={{ uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
      ) : (
        <>
          <Ionicons name="camera-outline" size={28} color={colors.textMuted} />
          <Text style={{ marginTop: 6, color: colors.textMuted, fontFamily: fontFamilies.body700, fontSize: 11 }}>
            {label}
          </Text>
        </>
      )}
    </Pressable>
  );
}
