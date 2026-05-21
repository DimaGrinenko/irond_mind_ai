/**
 * Сканер штрих-кодов. На web использует нативный BarcodeDetector API (Chrome/Edge) + getUserMedia.
 * На native (без expo-barcode-scanner) показывает ручной ввод кода.
 */
import React, { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../common/Card';
import { GradientButton } from '../common/GradientButton';
import { colors, radii } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/typography';
import { lookupOFF, type OFFProduct } from '../../utils/openFoodFacts';
import { t, useLang } from '../../i18n';

type Props = {
  visible: boolean;
  onClose: () => void;
  onProduct: (p: OFFProduct) => void;
};

export function BarcodeScannerModal({ visible, onClose, onProduct }: Props) {
  useLang();
  const theme = useTheme();
  const [manualCode, setManualCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [last, setLast] = useState<OFFProduct | null>(null);
  const videoRef = useRef<any>(null);
  const stopRef = useRef<() => void>(() => {});

  const handleLookup = useCallback(
    async (code: string) => {
      if (!code) return;
      setLoading(true);
      setError(null);
      const p = await lookupOFF(code);
      setLoading(false);
      if (p) {
        setLast(p);
        onProduct(p);
      } else {
        setError(t('bc.notFound', { code }));
      }
    },
    [onProduct],
  );

  // Запускаем камеру на web с BarcodeDetector
  useEffect(() => {
    if (!visible || Platform.OS !== 'web') return;
    const win: any = window;
    if (!win.BarcodeDetector) {
      setError(t('bc.notSupported'));
      return;
    }
    let stream: MediaStream | null = null;
    let cancelled = false;
    const detector = new win.BarcodeDetector({
      formats: ['ean_13', 'ean_8', 'upc_a', 'upc_e', 'code_128'],
    });

    (async () => {
      try {
        stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: 'environment' },
        });
        if (cancelled) return;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        }
        const loop = async () => {
          if (cancelled || !videoRef.current) return;
          try {
            const res: any[] = await detector.detect(videoRef.current);
            if (res.length > 0) {
              cancelled = true;
              handleLookup(res[0].rawValue);
              return;
            }
          } catch {
            /* keep trying */
          }
          requestAnimationFrame(loop);
        };
        requestAnimationFrame(loop);
      } catch (e) {
        setError(t('bc.cameraError', { msg: (e as Error).message }));
      }
    })();

    stopRef.current = () => {
      cancelled = true;
      if (stream) stream.getTracks().forEach((t) => t.stop());
    };
    return () => stopRef.current();
  }, [visible, handleLookup]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.85)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: colors.bg,
            borderTopLeftRadius: radii.xl,
            borderTopRightRadius: radii.xl,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 20,
            paddingBottom: 24,
            maxHeight: '92%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                flex: 1,
                color: colors.text,
                fontFamily: fontFamilies.heading,
                fontSize: 20,
              }}
            >
              {t('bc.title')}
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          {Platform.OS === 'web' && !error ? (
            <View
              style={{
                width: '100%',
                height: 260,
                borderRadius: radii.lg,
                overflow: 'hidden',
                backgroundColor: '#000',
                marginBottom: 12,
              }}
            >
              {/* @ts-ignore web video element */}
              <video
                ref={videoRef as any}
                autoPlay
                playsInline
                muted
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover' as any,
                }}
              />
            </View>
          ) : null}

          {error ? (
            <Card variant="secondary" style={{ marginBottom: 12 }}>
              <Text
                style={{
                  color: colors.pink,
                  fontFamily: fontFamilies.body,
                  fontSize: 12,
                }}
              >
                {error}
              </Text>
            </Card>
          ) : null}

          <Text
            style={{
              color: colors.textMuted,
              fontFamily: fontFamilies.body500,
              fontSize: 10,
              letterSpacing: 1,
              marginBottom: 6,
            }}
          >
            {t('bc.enterManually')}
          </Text>
          <View style={{ flexDirection: 'row', gap: 8 }}>
            <TextInput
              value={manualCode}
              onChangeText={setManualCode}
              placeholder="4607034574321"
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
              style={{
                flex: 1,
                color: colors.text,
                fontFamily: fontFamilies.body600,
                fontSize: 14,
                height: 44,
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.bgSecondary,
                paddingHorizontal: 12,
              }}
            />
            <Pressable
              onPress={() => handleLookup(manualCode.trim())}
              disabled={loading}
              style={{
                paddingHorizontal: 16,
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: theme.borderNeon,
                backgroundColor: 'rgba(157,107,255,0.16)',
                justifyContent: 'center',
              }}
            >
              {loading ? (
                <ActivityIndicator color={theme.accentLight} size="small" />
              ) : (
                <Text
                  style={{
                    color: theme.accentLight,
                    fontFamily: fontFamilies.body700,
                    fontSize: 12,
                  }}
                >
                  {t('bc.find')}
                </Text>
              )}
            </Pressable>
          </View>

          {last ? (
            <Card variant="secondary" style={{ marginTop: 14 }}>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: fontFamilies.body700,
                  fontSize: 14,
                }}
              >
                {last.name}
              </Text>
              {last.brand ? (
                <Text
                  style={{
                    color: colors.textMuted,
                    fontFamily: fontFamilies.body,
                    fontSize: 11,
                    marginTop: 2,
                  }}
                >
                  {last.brand}
                </Text>
              ) : null}
              <Text
                style={{
                  marginTop: 6,
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body,
                  fontSize: 12,
                }}
              >
                {last.kcal} {t('common.kcal')} · {t('nut.pShort')}{' '}
                {last.protein} · {t('nut.fShort')} {last.fats} ·{' '}
                {t('nut.cShort')} {last.carbs} {t('nut.per100g')}
              </Text>
            </Card>
          ) : null}

          <Text
            style={{
              color: colors.textMuted,
              fontFamily: fontFamilies.body,
              fontSize: 10,
              marginTop: 12,
              lineHeight: 14,
            }}
          >
            {t('bc.footer')}
          </Text>
        </View>
      </View>
    </Modal>
  );
}
