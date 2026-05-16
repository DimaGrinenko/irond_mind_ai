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

const RU_MONTHS = ['янв', 'фев', 'мар', 'апр', 'мая', 'июн', 'июл', 'авг', 'сен', 'окт', 'ноя', 'дек'];
function prettyDate(iso: string) {
  const d = new Date(`${iso}T00:00:00`);
  return `${d.getDate()} ${RU_MONTHS[d.getMonth()]}`;
}

export function ProgressPhotosScreen({ navigation }: any) {
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
        Alert.alert('Нет доступа', 'Разреши доступ к камере/галерее в настройках, чтобы добавлять фото.');
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
      console.error('Не удалось добавить фото:', e);
      Alert.alert('Ошибка', 'Не удалось добавить фото. Попробуй ещё раз.');
    }
  };

  const onAdd = () => {
    Alert.alert('Добавить фото', 'Выбери источник', [
      { text: 'Камера', onPress: () => pickFrom('camera') },
      { text: 'Галерея', onPress: () => pickFrom('library') },
      { text: 'Отмена', style: 'cancel' },
    ]);
  };

  const onPhotoPress = (p: ProgressPhotoRow) => {
    Alert.alert(prettyDate(p.date), 'Что сделать с фото?', [
      { text: 'Удалить', style: 'destructive', onPress: () => remove(p.id) },
      { text: 'Закрыть', style: 'cancel' },
    ]);
  };

  // авто «до/после» — самое старое и самое новое фото
  const oldest = photos.length >= 2 ? photos[photos.length - 1] : null;
  const newest = photos.length >= 2 ? photos[0] : null;
  const spanDays = oldest && newest ? daysBetween(oldest.date, newest.date) : 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title="Фото прогресса" onBack={() => navigation.goBack()} />

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {/* ===== Сравнение до/после ===== */}
        {oldest && newest ? (
          <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
            <Card style={{ padding: 0, overflow: 'hidden' }}>
              <LinearGradient colors={['rgba(157,107,255,0.22)', 'rgba(0,0,0,0)']} style={{ padding: 14 }}>
                <Text style={[{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }, neonTextShadow(colors.purple, 8)]}>
                  Трансформация
                </Text>
                <Text style={{ marginTop: 2, color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 12 }}>
                  {spanDays > 0 ? `${spanDays} дней прогресса` : 'до / после'}
                </Text>
                <View style={{ flexDirection: 'row', gap: 12, marginTop: 12 }}>
                  <ComparePane label="ДО" photo={oldest} tint={colors.textSecondary} />
                  <ComparePane label="ПОСЛЕ" photo={newest} tint={colors.cyan} />
                </View>
              </LinearGradient>
            </Card>
          </View>
        ) : null}

        {/* ===== Сетка фото ===== */}
        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 12 }}>
            Все снимки ({photos.length})
          </Text>
        </View>

        {photos.length === 0 ? (
          <View style={{ alignItems: 'center', paddingVertical: 48, gap: 12, paddingHorizontal: 32 }}>
            <Ionicons name="camera-outline" size={48} color={colors.textMuted} />
            <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600, fontSize: 14, textAlign: 'center' }}>
              Пока нет фото
            </Text>
            <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 12, textAlign: 'center' }}>
              Делай снимок раз в неделю — и через месяц увидишь реальную разницу.
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
                accessibilityLabel={`Фото от ${prettyDate(p.date)}`}
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
                <Image source={{ uri: p.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
                <LinearGradient
                  colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.8)']}
                  style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 56, justifyContent: 'flex-end', padding: 8 }}
                >
                  <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 12 }}>
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
          title="Добавить фото"
          onPress={onAdd}
          rightIcon={<Ionicons name="camera" size={18} color={colors.text} />}
        />
      </View>
    </View>
  );
}

function ComparePane({ label, photo, tint }: { label: string; photo: ProgressPhotoRow; tint: string }) {
  return (
    <View style={{ flex: 1 }}>
      <View
        style={{
          aspectRatio: 3 / 4,
          borderRadius: 16,
          overflow: 'hidden',
          borderWidth: 1,
          borderColor: tint === colors.cyan ? 'rgba(0,229,255,0.5)' : 'rgba(42,42,62,0.9)',
        }}
      >
        <Image source={{ uri: photo.uri }} style={{ width: '100%', height: '100%' }} resizeMode="cover" />
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
            borderColor: tint === colors.cyan ? 'rgba(0,229,255,0.6)' : 'rgba(255,255,255,0.2)',
          }}
        >
          <Text style={{ color: tint, fontFamily: fontFamilies.body700, fontSize: 10, letterSpacing: 1 }}>{label}</Text>
        </View>
      </View>
    </View>
  );
}
