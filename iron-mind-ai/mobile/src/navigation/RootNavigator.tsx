import { createNativeStackNavigator } from '@react-navigation/native-stack';
import React from 'react';
import type { RootStackParamList } from './types';
import { RootTabs } from './RootTabs';
import { AchievementsScreen } from '../screens/AchievementsScreen';
import { BodyMeasurementsScreen } from '../screens/BodyMeasurementsScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { CommunityScreen } from '../screens/CommunityScreen';
import { ExerciseDetailScreen } from '../screens/ExerciseDetailScreen';
import { MotivationScreen } from '../screens/MotivationScreen';
import { NutritionScreen } from '../screens/NutritionScreen';
import { ProgramDetailScreen } from '../screens/ProgramDetailScreen';
import { SubscriptionScreen } from '../screens/SubscriptionScreen';
import { WorkoutScreen } from '../screens/WorkoutScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ProgressPhotosScreen } from '../screens/ProgressPhotosScreen';
import { AdminPanelScreen } from '../screens/AdminPanelScreen';
import { CoachPanelScreen } from '../screens/CoachPanelScreen';
import { useUserStore } from '../store/userStore';

const Stack = createNativeStackNavigator<RootStackParamList>();

export function RootNavigator() {
  const onboarded = useUserStore((s) => s.onboardingCompleted);

  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
        animation: 'fade',
        animationDuration: 220,
        gestureEnabled: false,
        contentStyle: { backgroundColor: '#000' },
      }}
    >
      {!onboarded ? (
        <Stack.Screen name="Onboarding" component={OnboardingScreen} />
      ) : (
        <>
          <Stack.Screen name="RootTabs" component={RootTabs} />
          <Stack.Screen name="ProgramDetail" component={ProgramDetailScreen} />
          <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
          <Stack.Screen name="Workout" component={WorkoutScreen} />
          <Stack.Screen name="Nutrition" component={NutritionScreen} />
          <Stack.Screen name="BodyMeasurements" component={BodyMeasurementsScreen} />
          <Stack.Screen name="Calendar" component={CalendarScreen} />
          <Stack.Screen name="Achievements" component={AchievementsScreen} />
          <Stack.Screen name="Community" component={CommunityScreen} />
          <Stack.Screen name="Subscription" component={SubscriptionScreen} />
          <Stack.Screen name="Motivation" component={MotivationScreen} />
          <Stack.Screen name="ProgressPhotos" component={ProgressPhotosScreen} />
          <Stack.Screen name="AdminPanel" component={AdminPanelScreen} />
          <Stack.Screen name="CoachPanel" component={CoachPanelScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
