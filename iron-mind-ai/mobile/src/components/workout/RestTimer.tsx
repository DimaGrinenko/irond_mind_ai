import React from 'react';
import { Platform, Pressable, Text, Vibration, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeInDown, FadeOut } from 'react-native-reanimated';
import { RingChart } from '../charts/RingChart';
import { colors, neonGlow, neonTextShadow } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';

const PRESETS = [60, 90, 120] as const;

type Props = {
  /** Меняется при отметке подхода — запускает таймер с текущим пресетом. */
  triggerKey: number;
};

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const ss = String(s % 60).padStart(2, '0');
  return `${m}:${ss}`;
}

/**
 * Таймер отдыха между подходами. Авто-стартует при изменении triggerKey,
 * по окончании вибрирует. Пресеты 60/90/120 секунд.
 */
export function RestTimer({ triggerKey }: Props) {
  const [preset, setPreset] = React.useState<number>(90);
  const [remaining, setRemaining] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const presetRef = React.useRef(preset);
  presetRef.current = preset;

  // авто-старт при отметке подхода
  React.useEffect(() => {
    if (triggerKey <= 0) return;
    setRemaining(presetRef.current);
    setRunning(true);
  }, [triggerKey]);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        if (r <= 1) {
          clearInterval(id);
          setRunning(false);
          if (Platform.OS !== 'web') Vibration.vibrate([0, 250, 120, 250]);
          return 0;
        }
        return r - 1;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running]);

  const progress = running && preset > 0 ? remaining / preset : 0;

  return (
    <Animated.View
      entering={Platform.OS === 'web' ? undefined : FadeInDown.duration(280)}
      exiting={Platform.OS === 'web' ? undefined : FadeOut.duration(160)}
      style={{ borderRadius: 22, overflow: 'hidden', ...neonGlow(colors.cyan, 0.45, 22, 10) }}
    >
      <LinearGradient
        colors={['rgba(0,229,255,0.16)', 'rgba(13,16,32,0.96)']}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{
          borderRadius: 22,
          borderWidth: 1,
          borderColor: 'rgba(0,229,255,0.45)',
          paddingVertical: 12,
          paddingHorizontal: 14,
          flexDirection: 'row',
          alignItems: 'center',
          gap: 14,
        }}
      >
        {running ? (
          <>
            <View style={{ width: 56, height: 56, alignItems: 'center', justifyContent: 'center' }}>
              <RingChart size={56} strokeWidth={6} progress={progress} />
              <Text
                style={[
                  {
                    position: 'absolute',
                    color: colors.text,
                    fontFamily: fontFamilies.body700,
                    fontSize: 14,
                  },
                  neonTextShadow(colors.cyan, 8),
                ]}
              >
                {fmt(remaining)}
              </Text>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.cyan, fontFamily: fontFamilies.body700, fontSize: 12, letterSpacing: 1 }}>
                ОТДЫХ
              </Text>
              <Text style={{ marginTop: 2, color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 12 }}>
                Следующий подход через {fmt(remaining)}
              </Text>
            </View>
            <Pressable
              onPress={() => setRemaining((r) => r + 30)}
              accessibilityRole="button"
              accessibilityLabel="Добавить 30 секунд"
              hitSlop={8}
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: 'rgba(0,229,255,0.5)',
                backgroundColor: 'rgba(0,229,255,0.1)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ color: colors.cyan, fontFamily: fontFamilies.body700, fontSize: 11 }}>+30</Text>
            </Pressable>
            <Pressable
              onPress={() => {
                setRunning(false);
                setRemaining(0);
              }}
              accessibilityRole="button"
              accessibilityLabel="Пропустить отдых"
              hitSlop={8}
              style={{
                width: 40,
                height: 40,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: 'rgba(255,255,255,0.18)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="play-skip-forward" size={16} color={colors.textSecondary} />
            </Pressable>
          </>
        ) : (
          <>
            <View
              style={{
                width: 44,
                height: 44,
                borderRadius: 14,
                borderWidth: 1,
                borderColor: 'rgba(0,229,255,0.45)',
                backgroundColor: 'rgba(0,229,255,0.1)',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Ionicons name="timer-outline" size={22} color={colors.cyan} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 13 }}>
                Таймер отдыха
              </Text>
              <Text style={{ marginTop: 2, color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11 }}>
                Стартует при отметке подхода
              </Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 6 }}>
              {PRESETS.map((p) => {
                const active = p === preset;
                return (
                  <Pressable
                    key={p}
                    onPress={() => setPreset(p)}
                    accessibilityRole="button"
                    accessibilityLabel={`Отдых ${p} секунд`}
                    accessibilityState={{ selected: active }}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 8,
                      borderRadius: 12,
                      borderWidth: 1,
                      borderColor: active ? 'rgba(0,229,255,0.7)' : 'rgba(255,255,255,0.14)',
                      backgroundColor: active ? 'rgba(0,229,255,0.16)' : 'transparent',
                    }}
                  >
                    <Text
                      style={{
                        color: active ? colors.cyan : colors.textSecondary,
                        fontFamily: fontFamilies.body700,
                        fontSize: 12,
                      }}
                    >
                      {p}
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          </>
        )}
      </LinearGradient>
    </Animated.View>
  );
}
