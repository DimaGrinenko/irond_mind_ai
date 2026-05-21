import React from 'react';
import { Platform, Pressable, Text, Vibration, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Circle,
  Defs,
  Stop,
  LinearGradient as SvgGrad,
} from 'react-native-svg';
import Animated, { FadeIn, FadeOut } from 'react-native-reanimated';
import { colors, neonGlow, neonTextShadow } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { t, useLang } from '../../i18n';

type Props = {
  triggerKey: number;
  seconds: number;
  onSkip?: () => void;
  onDone?: () => void;
};

const PRESETS = [60, 90, 120, 180] as const;
const SIZE = 240;
const STROKE = 14;
const RAD = (SIZE - STROKE) / 2;
const CIRC = 2 * Math.PI * RAD;

function fmt(s: number) {
  const m = Math.floor(s / 60);
  const ss = String(s % 60).padStart(2, '0');
  return `${m}:${ss}`;
}

let beepCtx: AudioContext | null = null;
function beep(freq: number, ms = 120) {
  if (Platform.OS !== 'web') return;
  try {
    const AC =
      (window as any).AudioContext || (window as any).webkitAudioContext;
    if (!beepCtx) beepCtx = new AC();
    const ctx = beepCtx!;
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();
    osc.frequency.value = freq;
    osc.type = 'sine';
    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + ms / 1000);
  } catch {
    /* noop */
  }
}

/**
 * Полноэкранный overlay таймера отдыха.
 * Появляется когда triggerKey изменился. Останавливается на 0, вибрирует, играет beep в последние 3с.
 */
export function RestOverlay({ triggerKey, seconds, onSkip, onDone }: Props) {
  useLang();
  const [preset, setPreset] = React.useState<number>(seconds || 90);
  const [remaining, setRemaining] = React.useState(0);
  const [running, setRunning] = React.useState(false);
  const presetRef = React.useRef(preset);
  presetRef.current = preset;
  const beepFiredRef = React.useRef<Record<number, boolean>>({});

  React.useEffect(() => {
    if (seconds && seconds > 0) {
      setPreset(seconds);
      presetRef.current = seconds;
    }
  }, [seconds]);

  React.useEffect(() => {
    if (triggerKey <= 0) return;
    setRemaining(presetRef.current);
    setRunning(true);
    beepFiredRef.current = {};
  }, [triggerKey]);

  React.useEffect(() => {
    if (!running) return;
    const id = setInterval(() => {
      setRemaining((r) => {
        const next = r - 1;
        if (next <= 3 && next >= 1 && !beepFiredRef.current[next]) {
          beepFiredRef.current[next] = true;
          beep(880, 90);
        }
        if (next <= 0) {
          clearInterval(id);
          setRunning(false);
          if (Platform.OS !== 'web') Vibration.vibrate([0, 250, 120, 250]);
          else beep(1320, 220);
          onDone?.();
          return 0;
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [running, onDone]);

  if (!running) return null;

  const progress = preset > 0 ? remaining / preset : 0;
  const offset = CIRC * (1 - progress);

  return (
    <Animated.View
      entering={Platform.OS === 'web' ? undefined : FadeIn.duration(180)}
      exiting={Platform.OS === 'web' ? undefined : FadeOut.duration(140)}
      pointerEvents="auto"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        zIndex: 999,
        backgroundColor: 'rgba(3,4,10,0.92)',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 24,
      }}
    >
      <LinearGradient
        colors={[
          'rgba(0,229,255,0.18)',
          'rgba(157,107,255,0.12)',
          'rgba(3,4,10,0)',
        ]}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 320 }}
      />

      <Text
        style={{
          color: colors.cyan,
          fontFamily: fontFamilies.body700,
          fontSize: 12,
          letterSpacing: 3,
          marginBottom: 18,
        }}
      >
        {t('ro.rest')}
      </Text>

      <View
        style={{
          width: SIZE,
          height: SIZE,
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <Svg width={SIZE} height={SIZE}>
          <Defs>
            <SvgGrad id="restRing" x1="0" y1="0" x2="1" y2="1">
              <Stop offset="0" stopColor="#00E5FF" />
              <Stop offset="0.5" stopColor="#9D6BFF" />
              <Stop offset="1" stopColor="#FF4DD2" />
            </SvgGrad>
          </Defs>
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RAD}
            stroke="rgba(255,255,255,0.08)"
            strokeWidth={STROKE}
            fill="transparent"
          />
          <Circle
            cx={SIZE / 2}
            cy={SIZE / 2}
            r={RAD}
            stroke="url(#restRing)"
            strokeWidth={STROKE}
            fill="transparent"
            strokeDasharray={`${CIRC} ${CIRC}`}
            strokeDashoffset={offset}
            strokeLinecap="round"
            transform={`rotate(-90 ${SIZE / 2} ${SIZE / 2})`}
          />
        </Svg>
        <View style={{ position: 'absolute', alignItems: 'center' }}>
          <Text
            style={[
              {
                color: colors.text,
                fontFamily: fontFamilies.heading,
                fontSize: 64,
                lineHeight: 70,
                includeFontPadding: false,
              },
              neonTextShadow(colors.cyan, 16),
            ]}
          >
            {fmt(remaining)}
          </Text>
          <Text
            style={{
              color: colors.textMuted,
              fontFamily: fontFamilies.body,
              fontSize: 12,
              marginTop: 4,
            }}
          >
            {t('ro.outOf', { x: fmt(preset) })}
          </Text>
        </View>
      </View>

      {/* ±15s buttons */}
      <View style={{ flexDirection: 'row', gap: 16, marginTop: 28 }}>
        <Pressable
          onPress={() => setRemaining((r) => Math.max(1, r - 15))}
          style={{
            width: 80,
            height: 56,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: 'rgba(255,255,255,0.18)',
            backgroundColor: 'rgba(255,255,255,0.04)',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontFamily: fontFamilies.body700,
              fontSize: 18,
            }}
          >
            −15
          </Text>
        </Pressable>
        <Pressable
          onPress={() => setRemaining((r) => r + 15)}
          style={{
            width: 80,
            height: 56,
            borderRadius: 18,
            borderWidth: 1,
            borderColor: 'rgba(0,229,255,0.5)',
            backgroundColor: 'rgba(0,229,255,0.14)',
            alignItems: 'center',
            justifyContent: 'center',
            ...neonGlow(colors.cyan, 0.45, 14, 6),
          }}
        >
          <Text
            style={{
              color: colors.cyan,
              fontFamily: fontFamilies.body700,
              fontSize: 18,
            }}
          >
            +15
          </Text>
        </Pressable>
      </View>

      {/* Пресеты */}
      <View style={{ flexDirection: 'row', gap: 8, marginTop: 22 }}>
        {PRESETS.map((p) => {
          const active = p === preset;
          return (
            <Pressable
              key={p}
              onPress={() => {
                setPreset(p);
                presetRef.current = p;
                setRemaining(p);
                beepFiredRef.current = {};
              }}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: active
                  ? 'rgba(0,229,255,0.6)'
                  : 'rgba(255,255,255,0.14)',
                backgroundColor: active
                  ? 'rgba(0,229,255,0.16)'
                  : 'transparent',
              }}
            >
              <Text
                style={{
                  color: active ? colors.cyan : colors.textSecondary,
                  fontFamily: fontFamilies.body700,
                  fontSize: 12,
                }}
              >
                {p < 60 ? t('ro.sec', { p }) : t('ro.min', { p: p / 60 })}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <Pressable
        onPress={() => {
          setRunning(false);
          setRemaining(0);
          onSkip?.();
        }}
        style={{
          marginTop: 32,
          paddingHorizontal: 28,
          paddingVertical: 14,
          borderRadius: 16,
          borderWidth: 1,
          borderColor: 'rgba(255,255,255,0.2)',
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <Ionicons name="play-skip-forward" size={16} color={colors.text} />
        <Text
          style={{
            color: colors.text,
            fontFamily: fontFamilies.body700,
            fontSize: 13,
          }}
        >
          {t('ro.skip')}
        </Text>
      </Pressable>
    </Animated.View>
  );
}
