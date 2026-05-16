import React from 'react';
import { Platform, useWindowDimensions, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '../../theme/tokens';

/**
 * Оборачивает приложение в рамку телефона — нужно только для веб-версии
 * (`expo start --web`), чтобы видеть приложение в «телефонном» виде в браузере,
 * как превью в Radon IDE. На нативе компонент ничего не делает.
 */
const FRAME_W = 400;
const FRAME_H = 858;
const BEZEL = 10;

/** Поддельные safe-area отступы для веба — чтобы контент не лип под «чёлку». */
export const WEB_SAFE_AREA_METRICS = {
  insets: { top: 46, left: 0, right: 0, bottom: 28 },
  frame: { x: 0, y: 0, width: FRAME_W - BEZEL * 2, height: FRAME_H - BEZEL * 2 },
};

export function PhoneFrame({ children }: { children: React.ReactNode }) {
  const { height } = useWindowDimensions();

  if (Platform.OS !== 'web') return <>{children}</>;

  const scale = Math.min(1, (height - 40) / FRAME_H);

  return (
    <View style={{ flex: 1, backgroundColor: '#05060D', alignItems: 'center', justifyContent: 'center' }}>
      {/* Фоновое свечение под палитру приложения */}
      <LinearGradient
        colors={['#0B0A1E', '#05060D', '#0A0716']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, bottom: 0 }}
      />
      <View
        pointerEvents="none"
        style={{ position: 'absolute', top: -120, left: -80, width: 520, height: 520, opacity: 0.5 }}
      >
        <LinearGradient
          colors={['rgba(157,107,255,0.45)', 'rgba(157,107,255,0)']}
          style={{ flex: 1, borderRadius: 260 }}
        />
      </View>
      <View
        pointerEvents="none"
        style={{ position: 'absolute', bottom: -140, right: -100, width: 540, height: 540, opacity: 0.4 }}
      >
        <LinearGradient
          colors={['rgba(0,229,255,0.35)', 'rgba(0,229,255,0)']}
          style={{ flex: 1, borderRadius: 270 }}
        />
      </View>

      <View style={{ transform: [{ scale }], alignItems: 'center', justifyContent: 'center' }}>
        {/* Кнопки слева — звук */}
        <View style={{ position: 'absolute', left: -3, top: 168, width: 4, height: 34, borderTopLeftRadius: 3, borderBottomLeftRadius: 3, backgroundColor: '#15131F' }} />
        <View style={{ position: 'absolute', left: -3, top: 214, width: 4, height: 58, borderTopLeftRadius: 3, borderBottomLeftRadius: 3, backgroundColor: '#15131F' }} />
        <View style={{ position: 'absolute', left: -3, top: 284, width: 4, height: 58, borderTopLeftRadius: 3, borderBottomLeftRadius: 3, backgroundColor: '#15131F' }} />
        {/* Кнопка справа — питание */}
        <View style={{ position: 'absolute', right: -3, top: 238, width: 4, height: 86, borderTopRightRadius: 3, borderBottomRightRadius: 3, backgroundColor: '#15131F' }} />

        {/* Корпус телефона */}
        <View
          style={{
            width: FRAME_W,
            height: FRAME_H,
            borderRadius: 60,
            backgroundColor: '#0B0B12',
            padding: BEZEL,
            borderWidth: 1.5,
            borderColor: 'rgba(157,107,255,0.4)',
            shadowColor: '#9D6BFF',
            shadowOpacity: 0.45,
            shadowRadius: 70,
            shadowOffset: { width: 0, height: 28 },
          }}
        >
          {/* Экран */}
          <View style={{ flex: 1, borderRadius: 50, overflow: 'hidden', backgroundColor: colors.bg }}>
            {children}

            {/* Лёгкий блик стекла поверх экрана */}
            <LinearGradient
              pointerEvents="none"
              colors={['rgba(255,255,255,0.06)', 'rgba(255,255,255,0)']}
              start={{ x: 0, y: 0 }}
              end={{ x: 0.6, y: 0.5 }}
              style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 220 }}
            />
          </View>

          {/* Dynamic Island */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              top: BEZEL + 9,
              left: '50%',
              marginLeft: -62,
              width: 124,
              height: 34,
              borderRadius: 17,
              backgroundColor: '#000',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'flex-end',
              paddingRight: 12,
              zIndex: 10,
            }}
          >
            {/* «Камера» */}
            <View
              style={{
                width: 10,
                height: 10,
                borderRadius: 5,
                backgroundColor: '#0E1230',
                borderWidth: 1,
                borderColor: 'rgba(0,229,255,0.4)',
              }}
            />
          </View>

          {/* Home indicator */}
          <View
            pointerEvents="none"
            style={{
              position: 'absolute',
              bottom: BEZEL + 8,
              left: '50%',
              marginLeft: -67,
              width: 134,
              height: 5,
              borderRadius: 3,
              backgroundColor: 'rgba(255,255,255,0.4)',
              zIndex: 10,
            }}
          />
        </View>
      </View>
    </View>
  );
}
