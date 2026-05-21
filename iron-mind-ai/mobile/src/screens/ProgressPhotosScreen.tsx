import React, { useEffect } from 'react';
import { Alert, Image, Pressable, ScrollView, Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors, neonGlow, neonTextShadow } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { useProgressPhotosStore } from '../store/progressPhotosStore';
import { daysBetween } from '../utils/date';
import type { ProgressPhotoRow } from '../db/progressPhotosRepo';
import { t, useLang } from '../i18n';

function prettyDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return `${d.getDate()} ${t('common.monthsShort').split(',')[d.getMonth()]}`;
}

export function ProgressPhotosScreen({ navigation }: any) {
  useLang();
  const photos = useProgressPhotosStore((s) => s.photos);
  const hydrate = useProgressPhotosStore((s) => s.hydrate);
  const add = useProgressPhotosStore((s) => s.add);
  const remove = useProgressPhotosStore((s) => s.remove);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const pickFrom = async (source: 'camera' | 'library') => {
    try {
      const perm =
        source === 'camera'
          ? await ImagePicker.requestCameraPermissionsAsync()
          : await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (!perm.granted) {
        Alert.alert(t('common.error'), t('notif.unsupported'));
        return;
      }
      const opts: ImagePicker.ImagePickerOptions = {
        mediaTypes: ['images'],
        quality: 0.7,
        allowsEditing: true,
        aspect: [3, 4],
      };
      const res =
        source === 'camera'
          ? await ImagePicker.launchCameraAsync(opts)
          : await ImagePicker.launchImageLibraryAsync(opts);
      if (res.canceled || !res.assets?.[0]) return;
      await add(res.assets[0].uri);
    } catch (e) {
      console.error('photo add failed:', e);
      Alert.alert(t('common.error'), (e as Error).message);
    }
  };

  const onAdd = () => {
    Alert.alert(t('photos.add'), '', [
      { text: 'Camera', onPress: () => pickFrom('camera') },
      { text: 'Library', onPress: () => pickFrom('library') },
      { text: t('common.cancel'), style: 'cancel' },
    ]);
  };

  const onPhotoPress = (p: ProgressPhotoRow) => {
    Alert.alert(prettyDate(p.date), t('photos.confirmDelete'), [
      {
        text: t('common.delete'),
        style: 'destructive',
        onPress: () => remove(p.id),
      },
      { text: t('common.close'), style: 'cancel' },
    ]);
  };

  // авто «до/после» — самое старое и самое новое фото
  const oldest = photos.length >= 2 ? photos[photos.length - 1] : null;
  const newest = photos.length >= 2 ? photos[0] : null;
  const spanDays = oldest && newest ? daysBetween(oldest.date, newest.date) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={t('photos.title')}
        onBack={() => navigation.goBack()}
      />

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        {/* ===== Сравнение до/после ===== */}
        {oldest && newest ? (
          <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <LinearGradient
                colors={['rgba(157,107,255,0.22)', 'rgba(0,0,0,0)']}
                style={{ padding: 14 }}
              >
                <Text
                  style={[
                    {
                      color: colors.text,
                      fontFamily: fontFamilies.body700,
                      fontSize: 14,
                    },
                    neonTextShadow(colors.purple, 8),
                  ]}
                >
                  {t('pp.transform')}
                </Text>
                <Text
                  style={{
                    marginTop: 2,
                    color: colors.textMuted,
                    fontFamily: fontFamilies.body,
                    fontSize: 12,
                  }}
                >
                  {spanDays > 0
                    ? t('pp.daysProgress', { n: spanDays })
                    : t('pp.beforeAfter')}
                </Text>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                  <ComparePane
                    label={t('pp.before')}
                    photo={oldest}
                    tint={colors.textSecondary}
                  />
                  <ComparePane
                    label={t('pp.after')}
                    photo={newest}
                    tint={colors.cyan}
                  />
                </View>
              </LinearGradient>
            </Card>
          </View>
        ) : null}

        {/* ===== Сетка фото ===== */}
        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <Text
            style={{
              color: colors.textSecondary,
              fontFamily: fontFamilies.body600,
              fontSize: 12,
            }}
          >
            {t('photos.title')} ({photos.length})
          </Text>
        </View>

        {photos.length === 0 ? (
          <View
            style={{
              alignItems: 'center',
              paddingVertical: 48,
              gap: 12,
              paddingHorizontal: 32,
            }}
          >
            <Ionicons
              name="camera-outline"
              size={48}
              color={colors.textMuted}
            />
            <Text
              style={{
                color: colors.textSecondary,
                fontFamily: fontFamilies.body600,
                fontSize: 14,
                textAlign: 'center',
              }}
            >
              {t('photos.empty')}
            </Text>
          </View>
        ) : (
          <View
            style={{
              paddingHorizontal: 16,
              marginTop: 10,
              flexDirection: 'row',
              flexWrap: 'wrap',
              gap: 12,
            }}
          >
            {photos.map((p) => (
              <Pressable
                key={p.id}
                onPress={() => onPhotoPress(p)}
                accessibilityRole="imagebutton"
                accessibilityLabel={t('pp.photoFrom', {
                  date: prettyDate(p.date),
                })}
                style={{
                  width: '47%',
                  aspectRatio: 3 / 4,
                  borderRadius: 18,
                  overflow: 'hidden',
                  borderWidth: 1,
                  borderColor: 'rgba(157,107,255,0.4)',
                  ...neonGlow(colors.purple, 0.3, 14, 5),
                }}
              >
                <Image
                  source={{ uri: p.uri }}
                  style={{ width: '100%', height: '100%' }}
                  resizeMode="cover"
                />
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
                  style={{
                    position: 'absolute',
                    left: 0,
                    right: 0,
                    bottom: 0,
                    height: 56,
                    justifyContent: 'flex-end',
                    padding: 8,
                  }}
                >
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: fontFamilies.body700,
                      fontSize: 12,
                    }}
                  >
                    {prettyDate(p.date)}
                  </Text>
                </LinearGradient>
              </Pressable>
            ))}
          </View>
        )}
      </ScrollView>

      <View style={{ position: 'absolute', left: 16, right: 16, bottom: 18 }}>
        <GradientButton
          title={t('photos.add')}
          onPress={onAdd}
          rightIcon={<Ionicons name="camera" size={18} color={colors.text} />}
        />
      </View>
    </View>
  );
}

function ComparePane({
  label,
  photo,
  tint,
}: {
  label: string;
  photo: ProgressPhotoRow;
  tint: string;
}) {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          aspectRatio: 3 / 4,
          borderRadius: 16,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor:
            tint === colors.cyan ? 'rgba(0,229,255,0.5)' : 'rgba(42,42,62,0.9)',
        }}
      >
        <Image
          source={{ uri: photo.uri }}
          style={{ width: '100%', height: '100%' }}
          resizeMode="cover"
        />
        <View
          style={{
            position: 'absolute',
            top: 8,
            left: 8,
            paddingHorizontal: 8,
            paddingVertical: 3,
            borderRadius: 8,
            backgroundColor: 'rgba(3,4,10,0.8)',
            borderWidth: 1,
            borderColor:
              tint === colors.cyan
                ? 'rgba(0,229,255,0.6)'
                : 'rgba(255,255,255,0.2)',
          }}
        >
          <Text
            style={{
              color: tint,
              fontFamily: fontFamilies.body700,
              fontSize: 10,
              letterSpacing: 1,
            }}
          >
            {label}
          </Text>
        </View>
      </View>
    </View>
  );
}
