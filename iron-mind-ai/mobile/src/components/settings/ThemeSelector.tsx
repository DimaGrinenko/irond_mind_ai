import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Pressable, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, neonGlow } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import {
  SELECTABLE_THEMES,
  THEMES,
  themeFromAccentSkin,
  type ThemeId,
} from '../../theme/themes';
import { useThemeId } from '../../theme/useTheme';
import { useThemeStore } from '../../store/themeStore';
import { useLeafEconomyStore } from '../../store/leafEconomyStore';
import { t, useLang } from '../../i18n';

function Swatch({
  selected,
  gradient,
  onPress,
  glow,
}: {
  selected: boolean;
  gradient: readonly string[];
  onPress: () => void;
  glow: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      style={{
        width: 46,
        height: 46,
        borderRadius: 23,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: selected ? 2 : 1,
        borderColor: selected ? colors.text : colors.border,
        ...(selected ? neonGlow(glow, 0.8, 18, 8) : null),
      }}
    >
      <LinearGradient
        colors={gradient as any}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={{ width: 34, height: 34, borderRadius: 17 }}
      />
      {selected ? (
        <View style={{ position: 'absolute' }}>
          <Ionicons name="checkmark" size={18} color={colors.text} />
        </View>
      ) : null}
    </Pressable>
  );
}

export function ThemeSelector() {
  useLang();
  const activeId = useThemeId();
  const manualThemeId = useThemeStore((s) => s.manualThemeId);
  const setTheme = useThemeStore((s) => s.setTheme);
  const equippedAccent = useLeafEconomyStore((s) => s.equipped.accent);
  const lockedByShop = themeFromAccentSkin(equippedAccent) !== null;

  return (
    <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: fontFamilies.body600,
          fontSize: 12,
          marginBottom: 10,
        }}
      >
        {t('theme.title')}
      </Text>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}
      >
        {/* Auto chip */}
        <Pressable
          onPress={() => setTheme(null)}
          style={{
            height: 46,
            paddingHorizontal: 16,
            borderRadius: 23,
            alignItems: 'center',
            justifyContent: 'center',
            borderWidth: manualThemeId === null ? 2 : 1,
            borderColor: manualThemeId === null ? colors.text : colors.border,
            backgroundColor: colors.bgSecondary,
          }}
        >
          <Text
            style={{
              color: colors.text,
              fontFamily: fontFamilies.body700,
              fontSize: 13,
            }}
          >
            {t('theme.auto')}
          </Text>
        </Pressable>

        {SELECTABLE_THEMES.map((id: ThemeId) => {
          const th = THEMES[id];
          // The selected ring follows the *manual* pick; the resolved theme (activeId)
          // may differ when a shop accent overrides it.
          const selected = manualThemeId === id;
          return (
            <Swatch
              key={id}
              selected={selected}
              gradient={th.gradientPrimary}
              glow={th.glow}
              onPress={() => setTheme(id)}
            />
          );
        })}
      </View>

      {lockedByShop ? (
        <Text
          style={{
            color: colors.amber,
            fontFamily: fontFamilies.body500,
            fontSize: 11,
            marginTop: 8,
          }}
        >
          {t('theme.lockedByShop')} · {t(`theme.${activeId}`)}
        </Text>
      ) : manualThemeId === null ? (
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: fontFamilies.body500,
            fontSize: 11,
            marginTop: 8,
          }}
        >
          {t('theme.autoHint')} · {t(`theme.${activeId}`)}
        </Text>
      ) : null}
    </View>
  );
}
