import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { colors } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';

export function ScreenHeader({
  title,
  onBack,
  right,
}: {
  title: string;
  onBack?: () => void;
  right?: React.ReactNode;
}) {
  const insets = useSafeAreaInsets();
  return (
    <View
      style={{
        paddingTop: insets.top + 8,
        paddingHorizontal: 16,
        flexDirection: 'row',
        alignItems: 'center',
      }}
    >
      <View style={{ width: 40 }}>
        {onBack ? (
          <Pressable
            onPress={onBack}
            accessibilityRole="button"
            accessibilityLabel="Назад"
            hitSlop={12}
            style={{ paddingVertical: 8, paddingRight: 10 }}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
        ) : null}
      </View>
      <View style={{ flex: 1, alignItems: 'center' }}>
        <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 18 }}>{title}</Text>
      </View>
      <View style={{ width: 40, alignItems: 'flex-end' }}>{right ?? null}</View>
    </View>
  );
}
