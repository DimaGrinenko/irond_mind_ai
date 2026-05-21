import React from 'react';
import Svg, {
  Circle,
  Defs,
  RadialGradient,
  Stop,
  Path,
} from 'react-native-svg';
import { useTheme } from '../../theme/useTheme';

export type MoonPhaseKind = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

/**
 * Neon moon-phase glyph — replaces the 🌑🌒🌕🌘 emoji on the cycle tracker.
 *  menstrual  → new (dark) moon
 *  follicular → waxing crescent (lit on the right)
 *  ovulation  → full moon
 *  luteal     → waning crescent (lit on the left)
 */
export function MoonPhase({
  kind,
  size = 28,
}: {
  kind: MoonPhaseKind;
  size?: number;
}) {
  const theme = useTheme();
  const r = size / 2;
  const c = r;
  const lit = theme.accentLight;
  const dark = 'rgba(255,255,255,0.06)';
  const gid = `moonglow_${kind}`;

  return (
    <Svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
      <Defs>
        <RadialGradient id={gid} cx="50%" cy="50%" r="50%">
          <Stop offset="0" stopColor={lit} stopOpacity="0.95" />
          <Stop offset="1" stopColor={theme.accent} stopOpacity="0.55" />
        </RadialGradient>
      </Defs>

      {/* base disc */}
      <Circle
        cx={c}
        cy={c}
        r={r - 1}
        fill={kind === 'menstrual' ? dark : `url(#${gid})`}
        stroke={theme.accent}
        strokeWidth={1}
      />

      {/* crescents: overlay a shadow disc offset to one side */}
      {kind === 'follicular' ? (
        <Path
          d={`M ${c} 1 A ${r - 1} ${r - 1} 0 0 0 ${c} ${size - 1} A ${r * 0.62} ${r - 1} 0 0 1 ${c} 1 Z`}
          fill={dark}
        />
      ) : null}
      {kind === 'luteal' ? (
        <Path
          d={`M ${c} 1 A ${r - 1} ${r - 1} 0 0 1 ${c} ${size - 1} A ${r * 0.62} ${r - 1} 0 0 0 ${c} 1 Z`}
          fill={dark}
        />
      ) : null}
    </Svg>
  );
}
