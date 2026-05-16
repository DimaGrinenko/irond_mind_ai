import React from 'react';
import { Platform, View } from 'react-native';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';

export function AppearUp({
  children,
  delayMs = 0,
}: {
  children: React.ReactNode;
  delayMs?: number;
}) {
  if (Platform.OS === 'web') return <View>{children}</View>;
  return (
    <Animated.View entering={FadeInUp.duration(420).delay(delayMs)}>
      {children}
    </Animated.View>
  );
}

export function AppearDown({
  children,
  delayMs = 0,
}: {
  children: React.ReactNode;
  delayMs?: number;
}) {
  if (Platform.OS === 'web') return <View>{children}</View>;
  return (
    <Animated.View entering={FadeInDown.duration(420).delay(delayMs)}>
      {children}
    </Animated.View>
  );
}

