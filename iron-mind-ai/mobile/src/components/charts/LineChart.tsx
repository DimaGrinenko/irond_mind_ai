import React from 'react';
import { View } from 'react-native';
import Svg, { Defs, LinearGradient, Path, Stop } from 'react-native-svg';
import { colors } from '../../theme/tokens';

type Props = {
  width?: number;
  height?: number;
  series: Array<{ points: number[]; gradientId: string; stroke: string }>;
};

function toPath(points: number[], w: number, h: number, pad = 10) {
  if (points.length === 0) return '';
  const min = Math.min(...points);
  const max = Math.max(...points);
  const range = max - min || 1;
  const dx = (w - pad * 2) / Math.max(1, points.length - 1);
  const scaleY = (h - pad * 2) / range;
  return points
    .map((p, i) => {
      const x = pad + i * dx;
      const y = h - pad - (p - min) * scaleY;
      return `${i === 0 ? 'M' : 'L'} ${x.toFixed(2)} ${y.toFixed(2)}`;
    })
    .join(' ');
}

export function LineChart({ width = 320, height = 140, series }: Props) {
  return (
    <View style={{ width, height }}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="gradPurple" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={colors.purpleLight} stopOpacity="0.9" />
            <Stop offset="1" stopColor={colors.purple} stopOpacity="0.9" />
          </LinearGradient>
          <LinearGradient id="gradBlue" x1="0" y1="0" x2="1" y2="0">
            <Stop offset="0" stopColor={colors.blue} stopOpacity="0.9" />
            <Stop offset="1" stopColor={colors.purpleLight} stopOpacity="0.65" />
          </LinearGradient>
        </Defs>

        {series.map((s) => (
          <Path
            key={s.gradientId}
            d={toPath(s.points, width, height)}
            fill="none"
            stroke={`url(#${s.gradientId})`}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </Svg>
    </View>
  );
}

