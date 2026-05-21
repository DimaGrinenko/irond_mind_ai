import type { BottomTabBarProps } from '@react-navigation/bottom-tabs';
import { LinearGradient } from 'expo-linear-gradient';
import React from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import {
  colors,
  glowStrong,
  gradients,
  neonGlow,
  neonTextShadow,
} from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import { useTheme } from '../../theme/useTheme';
import { t, useLang } from '../../i18n';

const TAB_LABELS: Record<string, string> = {
  Home: 'tabs.home',
  Programs: 'tabs.programs',
  AiTrainer: 'tabs.ai',
  Analytics: 'tabs.analytics',
  Profile: 'tabs.profile',
};
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

const inactive = 'rgba(160,157,190,0.7)';

function TabIcon({
  routeName,
  focused,
  activeColor,
  glowColor,
}: {
  routeName: string;
  focused: boolean;
  activeColor: string;
  glowColor: string;
}) {
  const size = 22;
  const color = focused ? activeColor : inactive;
  const name =
    routeName === 'Home'
      ? focused
        ? 'home'
        : 'home-outline'
      : routeName === 'Programs'
        ? focused
          ? 'grid'
          : 'grid-outline'
        : routeName === 'AiTrainer'
          ? focused
            ? 'sparkles'
            : 'sparkles-outline'
          : routeName === 'Analytics'
            ? focused
              ? 'analytics'
              : 'analytics-outline'
            : focused
              ? 'person'
              : 'person-outline';

  return (
    <Ionicons
      name={name as any}
      size={size}
      color={color}
      style={
        focused
          ? { textShadowColor: glowColor, textShadowRadius: 14 }
          : undefined
      }
    />
  );
}

export function CustomTabBar({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) {
  useLang(); // re-render on lang change
  const theme = useTheme();
  const active = theme.accentLight;
  const insets = useSafeAreaInsets();
  const animate = Platform.OS !== 'web';
  const pulse = useSharedValue(0);
  const ringSpin = useSharedValue(0);

  React.useEffect(() => {
    if (!animate) return;
    pulse.value = withRepeat(
      withTiming(1, { duration: 1600, easing: Easing.inOut(Easing.quad) }),
      -1,
      true,
    );
    ringSpin.value = withRepeat(
      withTiming(1, { duration: 6000, easing: Easing.linear }),
      -1,
      false,
    );
  }, [animate, pulse, ringSpin]);

  const centerStyle = useAnimatedStyle(() => {
    if (!animate) return {};
    const s = 1 + pulse.value * 0.04;
    const o = 0.9 + pulse.value * 0.1;
    return { transform: [{ scale: s }], opacity: o };
  });

  const ringStyle = useAnimatedStyle(() => {
    if (!animate) return {};
    return { transform: [{ rotate: `${ringSpin.value * 360}deg` }] };
  });

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        right: 0,
        bottom: 0,
        paddingHorizontal: 16,
        paddingBottom: Math.max(insets.bottom, 12) + 6,
        paddingTop: 12,
        backgroundColor: 'rgba(3,4,10,0.92)',
        borderTopWidth: 1,
        borderTopColor: theme.borderNeon,
      }}
    >
      {/* top neon line */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: 2,
          opacity: 0.85,
        }}
      >
        <LinearGradient
          colors={[
            'rgba(157,107,255,0)',
            'rgba(157,107,255,1)',
            'rgba(255,77,210,1)',
            'rgba(0,229,255,1)',
            'rgba(157,107,255,0)',
          ]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1 }}
        />
      </View>
      <View
        style={{
          flexDirection: 'row',
          alignItems: 'flex-end',
          justifyContent: 'space-between',
        }}
      >
        {state.routes.map((route, index) => {
          const isFocused = state.index === index;
          const { options } = descriptors[route.key];
          const labelKey = TAB_LABELS[route.name];
          const label = labelKey
            ? t(labelKey)
            : ((options.tabBarLabel ?? options.title ?? route.name) as string);

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });
            if (!isFocused && !event.defaultPrevented)
              navigation.navigate(route.name);
          };

          const onLongPress = () =>
            navigation.emit({ type: 'tabLongPress', target: route.key });

          const isCenter = route.name === 'AiTrainer';
          if (isCenter) {
            return (
              <View key={route.key} style={{ width: 78, alignItems: 'center' }}>
                <Animated.View
                  style={[
                    centerStyle,
                    { width: 70, height: 70, marginTop: -28 },
                  ]}
                >
                  {/* spinning aurora ring */}
                  <Animated.View
                    pointerEvents="none"
                    style={[
                      StyleSheet.absoluteFillObject,
                      { borderRadius: 35, overflow: 'hidden' },
                      ringStyle,
                    ]}
                  >
                    <LinearGradient
                      colors={gradients.AURORA as any}
                      start={{ x: 0, y: 0 }}
                      end={{ x: 1, y: 1 }}
                      style={{ flex: 1 }}
                    />
                  </Animated.View>
                  <Pressable
                    accessibilityRole="button"
                    accessibilityState={isFocused ? { selected: true } : {}}
                    accessibilityLabel={options.tabBarAccessibilityLabel}
                    testID={options.tabBarButtonTestID}
                    onPress={onPress}
                    onLongPress={onLongPress}
                    style={{
                      position: 'absolute',
                      top: 2,
                      left: 2,
                      right: 2,
                      bottom: 2,
                      borderRadius: 33,
                      alignItems: 'center',
                      justifyContent: 'center',
                      backgroundColor: colors.bg,
                      borderWidth: 1,
                      borderColor: 'rgba(255,255,255,0.08)',
                      ...glowStrong,
                    }}
                  >
                    <Ionicons
                      name="sparkles"
                      size={28}
                      color={active}
                      style={{
                        textShadowColor: theme.glow,
                        textShadowRadius: 18,
                      }}
                    />
                  </Pressable>
                </Animated.View>
                <Text
                  style={[
                    {
                      marginTop: 8,
                      fontSize: 11,
                      fontFamily: fontFamilies.body700,
                      letterSpacing: 1.2,
                      color: isFocused ? colors.text : colors.textSecondary,
                    },
                    isFocused ? neonTextShadow(theme.glow, 10) : null,
                  ]}
                >
                  {t('tabs.ai')}
                </Text>
              </View>
            );
          }

          return (
            <Pressable
              key={route.key}
              accessibilityRole="button"
              accessibilityState={isFocused ? { selected: true } : {}}
              accessibilityLabel={options.tabBarAccessibilityLabel}
              testID={options.tabBarButtonTestID}
              onPress={onPress}
              onLongPress={onLongPress}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingVertical: 6,
              }}
            >
              {/* active dot */}
              {isFocused ? (
                <View
                  style={{
                    position: 'absolute',
                    top: -2,
                    width: 28,
                    height: 3,
                    borderRadius: 2,
                    backgroundColor: active,
                    ...neonGlow(theme.glow, 0.95, 12, 6),
                  }}
                />
              ) : null}
              <TabIcon
                routeName={route.name}
                focused={isFocused}
                activeColor={active}
                glowColor={theme.glow}
              />
              <Text
                style={[
                  {
                    marginTop: 6,
                    fontSize: 11,
                    fontFamily: fontFamilies.body500,
                    color: isFocused ? colors.text : colors.textSecondary,
                  },
                  isFocused ? neonTextShadow(theme.glow, 10) : null,
                ]}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>
    </View>
  );
}
