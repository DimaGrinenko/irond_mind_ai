/**
 * Сравнение двух фоток прогресса с вертикальным разделителем.
 * Жесты на разделитель сдвигают границу видимости «до/после».
 */
import React, { useEffect, useMemo, useState } from 'react';
import { Dimensions, Image, PanResponder, Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { Card } from '../components/common/Card';
import { useProgressPhotosStore } from '../store/progressPhotosStore';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

export function PhotoCompareScreen() {
  useLang();
  const nav = useNavigation<any>();
  const photos = useProgressPhotosStore((s) => s.photos);
  const hydrate = useProgressPhotosStore((s) => s.hydrate);

  useEffect(() => {
    hydrate();
  }, [hydrate]);

  const sorted = useMemo(() => photos.slice().sort((a, b) => a.date.localeCompare(b.date)), [photos]);
  const [beforeIdx, setBeforeIdx] = useState(0);
  const [afterIdx, setAfterIdx] = useState(Math.max(0, sorted.length - 1));

  useEffect(() => {
    if (sorted.length > 0) {
      setBeforeIdx(0);
      setAfterIdx(sorted.length - 1);
    }
  }, [sorted.length]);

  const before = sorted[beforeIdx];
  const after = sorted[afterIdx];

  const screenW = Dimensions.get('window').width - 32;
  const imgH = screenW * 1.4;
  const [splitX, setSplitX] = useState(screenW / 2);

  const panResponder = useMemo(
    () =>
      PanResponder.create({
        onMoveShouldSetPanResponder: () => true,
        onPanResponderMove: (_, g) => {
          const x = Math.max(0, Math.min(screenW, splitX + g.dx));
          setSplitX(x);
        },
        onPanResponderRelease: (_, g) => {
          setSplitX((x) => Math.max(0, Math.min(screenW, x + g.dx)));
        },
      }),
    [screenW, splitX],
  );

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('photoCompare.title')} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {sorted.length < 2 ? (
          <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
            <Card variant="secondary">
              <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body, textAlign: 'center' }}>
                {t('photoCompare.notEnough')}
              </Text>
              <Pressable
                onPress={() => nav.navigate('ProgressPhotos')}
                style={{
                  marginTop: 12,
                  paddingVertical: 10,
                  alignItems: 'center',
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.borderNeon,
                  backgroundColor: 'rgba(157,107,255,0.12)',
                }}
              >
                <Text style={{ color: colors.purpleLight, fontFamily: fontFamilies.body700, fontSize: 13 }}>
                  {t('photoCompare.openPhotos')}
                </Text>
              </Pressable>
            </Card>
          </View>
        ) : (
          <>
            <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
              <DatePicker
                label={t('photoCompare.before')}
                photos={sorted}
                index={beforeIdx}
                onChange={setBeforeIdx}
              />
              <View style={{ height: 8 }} />
              <DatePicker
                label={t('photoCompare.after')}
                photos={sorted}
                index={afterIdx}
                onChange={setAfterIdx}
              />
            </View>

            <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
              <View
                style={{
                  width: screenW,
                  height: imgH,
                  borderRadius: radii.lg,
                  overflow: 'hidden',
                  backgroundColor: '#000',
                  borderWidth: 1,
                  borderColor: colors.border,
                }}
              >
                {after?.uri ? (
                  <Image
                    source={{ uri: after.uri }}
                    style={{ width: screenW, height: imgH, position: 'absolute', left: 0, top: 0 }}
                    resizeMode="cover"
                  />
                ) : null}
                <View style={{ position: 'absolute', left: 0, top: 0, width: splitX, height: imgH, overflow: 'hidden' }}>
                  {before?.uri ? (
                    <Image
                      source={{ uri: before.uri }}
                      style={{ width: screenW, height: imgH }}
                      resizeMode="cover"
                    />
                  ) : null}
                </View>
                {/* Разделитель */}
                <View
                  {...panResponder.panHandlers}
                  style={{
                    position: 'absolute',
                    left: splitX - 18,
                    top: 0,
                    width: 36,
                    height: imgH,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <View style={{ width: 2, height: imgH, backgroundColor: '#fff', opacity: 0.85 }} />
                  <View
                    style={{
                      position: 'absolute',
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: '#fff',
                      alignItems: 'center',
                      justifyContent: 'center',
                      borderWidth: 1,
                      borderColor: colors.purpleLight,
                    }}
                  >
                    <Ionicons name="resize" size={16} color={colors.purple} />
                  </View>
                </View>

                {/* Labels */}
                <View
                  style={{
                    position: 'absolute',
                    top: 12,
                    left: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                  }}
                >
                  <Text style={{ color: '#fff', fontFamily: fontFamilies.body700, fontSize: 11 }}>
                    {before?.date ?? '—'}
                  </Text>
                </View>
                <View
                  style={{
                    position: 'absolute',
                    top: 12,
                    right: 12,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 8,
                    backgroundColor: 'rgba(0,0,0,0.6)',
                  }}
                >
                  <Text style={{ color: '#fff', fontFamily: fontFamilies.body700, fontSize: 11 }}>
                    {after?.date ?? '—'}
                  </Text>
                </View>
              </View>
            </View>

            {before && after ? (
              <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
                <Card variant="secondary">
                  <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 13 }}>
                    {t('photoCompare.period')}:{' '}
                    <Text style={{ color: colors.text, fontFamily: fontFamilies.body700 }}>
                      {daysBetween(before.date, after.date)} {t('common.days')}
                    </Text>
                    {before.weight != null && after.weight != null ? (
                      <Text>
                        {' · '}{t('photoCompare.weightDelta')}:{' '}
                        <Text style={{ color: colors.text, fontFamily: fontFamilies.body700 }}>
                          {(after.weight - before.weight).toFixed(1)} {t('common.kg')}
                        </Text>
                      </Text>
                    ) : null}
                  </Text>
                </Card>
              </View>
            ) : null}
          </>
        )}
      </ScrollView>
    </View>
  );
}

function DatePicker({
  label,
  photos,
  index,
  onChange,
}: {
  label: string;
  photos: any[];
  index: number;
  onChange: (i: number) => void;
}) {
  return (
    <View
      style={{
        padding: 10,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.bgSecondary,
      }}
    >
      <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body500, fontSize: 10, letterSpacing: 1, marginBottom: 6 }}>
        {label}
      </Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
        {photos.map((p, i) => {
          const active = i === index;
          return (
            <Pressable
              key={p.id}
              onPress={() => onChange(i)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 6,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: active ? colors.borderNeon : colors.border,
                backgroundColor: active ? 'rgba(157,107,255,0.18)' : 'rgba(0,0,0,0.3)',
              }}
            >
              <Text
                style={{
                  color: active ? colors.purpleLight : colors.textSecondary,
                  fontFamily: fontFamilies.body700,
                  fontSize: 11,
                }}
              >
                {p.date}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>
    </View>
  );
}

function daysBetween(a: string, b: string) {
  const d1 = new Date(a).getTime();
  const d2 = new Date(b).getTime();
  return Math.round(Math.abs(d2 - d1) / (1000 * 60 * 60 * 24));
}
