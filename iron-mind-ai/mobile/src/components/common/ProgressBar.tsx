import React from 'react';
import { View } from 'react-native';
import { colors, radii } from '../../theme/tokens';

export function ProgressBar({ value, color }: { value: number; color: string }) {
  const v = Math.max(0, Math.min(1, value));
  return (
    <View
      style={{
        height: 8,
        borderRadius: radii.full,
        backgroundColor: 'rgba(255,255,255,0.10)',
        overflow: 'hidden',
      }}
    >
      <View style={{ width: `${v * 100}%`, height: '100%', backgroundColor: color }} />
    </View>
  );
}

