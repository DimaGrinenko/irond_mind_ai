import React from 'react';
import { Text, TextInput, View } from 'react-native';
import { colors, radii } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { t } from '../../i18n';

type Props = {
  label: string;
  value: string;
  onChange: (v: string) => void;
  suffix?: string;
  compact?: boolean;
};

export function FieldRow({ label, value, onChange, suffix, compact }: Props) {
  const suffixLabel = suffix ?? t('common.cm');
  return (
    <View style={{ marginBottom: compact ? 8 : 12 }}>
      <Text
        style={{
          color: colors.textMuted,
          fontFamily: fontFamilies.body500,
          fontSize: 11,
        }}
      >
        {label}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 8,
          marginTop: 6,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChange}
          keyboardType="numeric"
          placeholder="0"
          placeholderTextColor="rgba(255,255,255,0.25)"
          style={{
            flex: 1,
            height: 36,
            borderRadius: radii.md,
            borderWidth: 1,
            borderColor: 'rgba(42,42,62,0.95)',
            backgroundColor: 'rgba(15,15,26,0.65)',
            paddingHorizontal: 12,
            color: colors.text,
            fontFamily: fontFamilies.body600,
            fontSize: 13,
          }}
        />
        <Text
          style={{
            color: colors.textSecondary,
            fontFamily: fontFamilies.body600,
            fontSize: 12,
          }}
        >
          {suffixLabel}
        </Text>
      </View>
    </View>
  );
}
