import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, RadialGradient, Stop, G } from 'react-native-svg';
import { colors, glow } from '../../theme/tokens';

export type MuscleKey =
  | 'chest'
  | 'shoulders'
  | 'biceps'
  | 'triceps'
  | 'forearms'
  | 'core'
  | 'obliques'
  | 'quads'
  | 'calves'
  | 'neck';

type Props = {
  height?: number;
  width?: number;
  /**
   * Override fill colors for muscle groups. If a muscle isn't in this map,
   * it uses the default neon-purple tint.
   */
  highlights?: Partial<Record<MuscleKey | 'arms' | 'legs' | 'back', string>>;
};

function pick(h: Props['highlights'], key: MuscleKey, fallback: string): string {
  if (!h) return fallback;
  // Backwards-compat aliases used elsewhere in the codebase.
  if (key === 'biceps' || key === 'triceps' || key === 'forearms') {
    return (h[key] as string) ?? (h.arms as string) ?? fallback;
  }
  if (key === 'quads' || key === 'calves') {
    return (h[key] as string) ?? (h.legs as string) ?? fallback;
  }
  return (h[key] as string) ?? fallback;
}

/**
 * Detailed anatomical front-view male torso silhouette.
 * Each muscle group is its own <Path> so it can be highlighted independently.
 */
export function BodyFigure({ height = 320, width = 200, highlights }: Props) {
  const baseFill = 'url(#bodyGrad)';

  const c = {
    chest: pick(highlights, 'chest', 'rgba(177,78,255,0.55)'),
    shoulders: pick(highlights, 'shoulders', 'rgba(177,78,255,0.40)'),
    biceps: pick(highlights, 'biceps', 'rgba(177,78,255,0.35)'),
    triceps: pick(highlights, 'triceps', 'rgba(177,78,255,0.25)'),
    forearms: pick(highlights, 'forearms', 'rgba(177,78,255,0.22)'),
    core: pick(highlights, 'core', 'rgba(255,63,203,0.45)'),
    obliques: pick(highlights, 'obliques', 'rgba(177,78,255,0.30)'),
    quads: pick(highlights, 'quads', 'rgba(123,63,228,0.55)'),
    calves: pick(highlights, 'calves', 'rgba(123,63,228,0.40)'),
    neck: pick(highlights, 'neck', 'rgba(177,78,255,0.30)'),
  };

  return (
    <View style={[{ width, height }, glow]}>
      <Svg width={width} height={height} viewBox="0 0 200 320">
        <Defs>
          <LinearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
            <Stop offset="0" stopColor={colors.purpleDeep} stopOpacity="0.65" />
            <Stop offset="0.55" stopColor={colors.purple} stopOpacity="0.45" />
            <Stop offset="1" stopColor={colors.pink} stopOpacity="0.20" />
          </LinearGradient>
          <RadialGradient id="ambient" cx="50%" cy="50%" r="60%">
            <Stop offset="0" stopColor={colors.purpleLight} stopOpacity="0.35" />
            <Stop offset="1" stopColor={colors.purpleLight} stopOpacity="0" />
          </RadialGradient>
          <LinearGradient id="muscleGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0" stopColor={colors.purpleLight} stopOpacity="0.95" />
            <Stop offset="1" stopColor={colors.pink} stopOpacity="0.6" />
          </LinearGradient>
        </Defs>

        {/* Ambient backdrop */}
        <Path d="M0 160 Q100 -40 200 160 Q100 360 0 160 Z" fill="url(#ambient)" opacity={0.55} />

        {/* === HEAD === */}
        <Path
          d="M100 8 C84 8 76 22 76 38 C76 52 82 62 88 66 C90 70 86 76 84 80 C82 84 90 86 100 86 C110 86 118 84 116 80 C114 76 110 70 112 66 C118 62 124 52 124 38 C124 22 116 8 100 8 Z"
          fill={baseFill}
          stroke="rgba(177,78,255,0.45)"
          strokeWidth={1}
        />

        {/* === NECK === */}
        <Path
          d="M88 80 L86 96 Q100 100 114 96 L112 80 Q100 84 88 80 Z"
          fill={c.neck}
          stroke="rgba(177,78,255,0.35)"
          strokeWidth={0.8}
        />

        {/* === TORSO BASE === */}
        <Path
          d="M70 100 C58 102 46 110 42 124 L38 156 C36 170 38 184 44 196 L48 220 C50 232 60 240 72 244 L76 248 L86 240 Q100 246 114 240 L124 248 L128 244 C140 240 150 232 152 220 L156 196 C162 184 164 170 162 156 L158 124 C154 110 142 102 130 100 Q100 110 70 100 Z"
          fill={baseFill}
          stroke="rgba(177,78,255,0.35)"
          strokeWidth={1}
        />

        {/* === SHOULDERS / DELTOIDS === */}
        <Path
          d="M68 102 C56 102 44 108 38 122 C36 132 40 142 48 148 C56 142 60 130 70 122 C72 114 70 108 68 102 Z"
          fill={c.shoulders}
          stroke="rgba(177,78,255,0.55)"
          strokeWidth={0.8}
        />
        <Path
          d="M132 102 C144 102 156 108 162 122 C164 132 160 142 152 148 C144 142 140 130 130 122 C128 114 130 108 132 102 Z"
          fill={c.shoulders}
          stroke="rgba(177,78,255,0.55)"
          strokeWidth={0.8}
        />

        {/* === PECS / CHEST === */}
        <Path
          d="M70 118 C76 116 86 114 96 116 L98 148 Q88 158 76 156 C66 152 60 142 60 132 C62 124 66 120 70 118 Z"
          fill={c.chest}
          stroke="rgba(255,63,203,0.55)"
          strokeWidth={0.9}
        />
        <Path
          d="M130 118 C124 116 114 114 104 116 L102 148 Q112 158 124 156 C134 152 140 142 140 132 C138 124 134 120 130 118 Z"
          fill={c.chest}
          stroke="rgba(255,63,203,0.55)"
          strokeWidth={0.9}
        />

        {/* === BICEPS === */}
        <Path
          d="M40 124 C32 130 28 144 30 160 C32 172 40 178 48 174 C50 162 50 144 48 132 C46 126 42 124 40 124 Z"
          fill={c.biceps}
          stroke="rgba(177,78,255,0.45)"
          strokeWidth={0.8}
        />
        <Path
          d="M160 124 C168 130 172 144 170 160 C168 172 160 178 152 174 C150 162 150 144 152 132 C154 126 158 124 160 124 Z"
          fill={c.biceps}
          stroke="rgba(177,78,255,0.45)"
          strokeWidth={0.8}
        />

        {/* === TRICEPS (visible side strip) === */}
        <Path
          d="M28 142 C24 152 24 166 28 178 C32 184 36 184 40 180 C38 168 36 156 38 144 C36 142 30 140 28 142 Z"
          fill={c.triceps}
          stroke="rgba(177,78,255,0.35)"
          strokeWidth={0.7}
        />
        <Path
          d="M172 142 C176 152 176 166 172 178 C168 184 164 184 160 180 C162 168 164 156 162 144 C164 142 170 140 172 142 Z"
          fill={c.triceps}
          stroke="rgba(177,78,255,0.35)"
          strokeWidth={0.7}
        />

        {/* === FOREARMS === */}
        <Path
          d="M28 180 C24 196 24 212 30 226 C36 232 42 232 46 226 C42 212 42 196 42 184 C38 180 32 178 28 180 Z"
          fill={c.forearms}
          stroke="rgba(177,78,255,0.35)"
          strokeWidth={0.7}
        />
        <Path
          d="M172 180 C176 196 176 212 170 226 C164 232 158 232 154 226 C158 212 158 196 158 184 C162 180 168 178 172 180 Z"
          fill={c.forearms}
          stroke="rgba(177,78,255,0.35)"
          strokeWidth={0.7}
        />

        {/* === ABS (6-pack + lower belly) === */}
        {/* upper row */}
        <Path d="M88 152 L100 152 L100 168 L88 168 Z" fill={c.core} stroke="rgba(255,63,203,0.55)" strokeWidth={0.6} />
        <Path d="M100 152 L112 152 L112 168 L100 168 Z" fill={c.core} stroke="rgba(255,63,203,0.55)" strokeWidth={0.6} />
        {/* middle row */}
        <Path d="M88 170 L100 170 L100 186 L88 186 Z" fill={c.core} stroke="rgba(255,63,203,0.55)" strokeWidth={0.6} />
        <Path d="M100 170 L112 170 L112 186 L100 186 Z" fill={c.core} stroke="rgba(255,63,203,0.55)" strokeWidth={0.6} />
        {/* lower row */}
        <Path d="M88 188 L100 188 L100 204 L88 204 Z" fill={c.core} stroke="rgba(255,63,203,0.55)" strokeWidth={0.6} />
        <Path d="M100 188 L112 188 L112 204 L100 204 Z" fill={c.core} stroke="rgba(255,63,203,0.55)" strokeWidth={0.6} />
        {/* lower belly V */}
        <Path
          d="M86 206 Q100 218 114 206 Q108 226 100 230 Q92 226 86 206 Z"
          fill={c.core}
          stroke="rgba(255,63,203,0.40)"
          strokeWidth={0.6}
        />

        {/* === OBLIQUES === */}
        <Path
          d="M70 156 C66 168 64 184 68 198 C72 200 78 198 82 196 L82 160 Q76 156 70 156 Z"
          fill={c.obliques}
          stroke="rgba(177,78,255,0.35)"
          strokeWidth={0.6}
        />
        <Path
          d="M130 156 C134 168 136 184 132 198 C128 200 122 198 118 196 L118 160 Q124 156 130 156 Z"
          fill={c.obliques}
          stroke="rgba(177,78,255,0.35)"
          strokeWidth={0.6}
        />

        {/* === HIPS / PELVIS === */}
        <Path
          d="M70 224 C70 240 80 250 100 252 C120 250 130 240 130 224 C120 226 110 226 100 226 C90 226 80 226 70 224 Z"
          fill={baseFill}
          stroke="rgba(177,78,255,0.30)"
          strokeWidth={0.8}
        />

        {/* === QUADS === */}
        <Path
          d="M68 248 C62 260 60 274 62 290 L66 312 C68 318 76 320 84 318 C86 304 88 286 90 268 C90 254 84 248 76 248 Q70 248 68 248 Z"
          fill={c.quads}
          stroke="rgba(123,63,228,0.55)"
          strokeWidth={0.8}
        />
        <Path
          d="M132 248 C138 260 140 274 138 290 L134 312 C132 318 124 320 116 318 C114 304 112 286 110 268 C110 254 116 248 124 248 Q130 248 132 248 Z"
          fill={c.quads}
          stroke="rgba(123,63,228,0.55)"
          strokeWidth={0.8}
        />

        {/* Inner-thigh seams via fine lines */}
        <Path d="M100 252 L98 318" stroke="rgba(255,255,255,0.18)" strokeWidth={0.6} />
        <Path d="M100 252 L102 318" stroke="rgba(255,255,255,0.18)" strokeWidth={0.6} />
      </Svg>
    </View>
  );
}
