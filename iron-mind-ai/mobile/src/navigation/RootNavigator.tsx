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
import { ProgramEditScreen } from '../screens/ProgramEditScreen';
import { SubscriptionScreen } from '../screens/SubscriptionScreen';
import { WorkoutScreen } from '../screens/WorkoutScreen';
import { GymModeScreen } from '../screens/GymModeScreen';
import { PlanBuilderScreen } from '../screens/PlanBuilderScreen';
import { WorkoutsHistoryScreen } from '../screens/WorkoutsHistoryScreen';
import { SupplementsScreen } from '../screens/SupplementsScreen';
import { OnboardingScreen } from '../screens/OnboardingScreen';
import { ProgressPhotosScreen } from '../screens/ProgressPhotosScreen';
import { AdminPanelScreen } from '../screens/AdminPanelScreen';
import { CoachPanelScreen } from '../screens/CoachPanelScreen';
import { OneRmChartScreen } from '../screens/OneRmChartScreen';
import { PhotoCompareScreen } from '../screens/PhotoCompareScreen';
import { DataExportScreen } from '../screens/DataExportScreen';
import { ChallengesScreen } from '../screens/ChallengesScreen';
import { LeafShopScreen } from '../screens/LeafShopScreen';
import { FriendsScreen } from '../screens/FriendsScreen';
import { DuelsScreen } from '../screens/DuelsScreen';
import { FormAnalysisScreen } from '../screens/FormAnalysisScreen';
import { WellbeingDiaryScreen } from '../screens/WellbeingDiaryScreen';
import { CycleTrackerScreen } from '../screens/CycleTrackerScreen';
import { HealthSyncScreen } from '../screens/HealthSyncScreen';
import { BodyFatPhotoScreen } from '../screens/BodyFatPhotoScreen';
import { AiProgramGenScreen } from '../screens/AiProgramGenScreen';
import { LiveCoachScreen } from '../screens/LiveCoachScreen';
import { ShareProgramScreen } from '../screens/ShareProgramScreen';
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
          <Stack.Screen name="ProgramEdit" component={ProgramEditScreen} />
          <Stack.Screen name="ExerciseDetail" component={ExerciseDetailScreen} />
          <Stack.Screen name="Workout" component={WorkoutScreen} />
          <Stack.Screen name="GymMode" component={GymModeScreen} />
          <Stack.Screen name="PlanBuilder" component={PlanBuilderScreen} />
          <Stack.Screen name="WorkoutsHistory" component={WorkoutsHistoryScreen} />
          <Stack.Screen name="Supplements" component={SupplementsScreen} />
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
          <Stack.Screen name="OneRmChart" component={OneRmChartScreen} />
          <Stack.Screen name="PhotoCompare" component={PhotoCompareScreen} />
          <Stack.Screen name="DataExport" component={DataExportScreen} />
          <Stack.Screen name="Challenges" component={ChallengesScreen} />
          <Stack.Screen name="LeafShop" component={LeafShopScreen} />
          <Stack.Screen name="Friends" component={FriendsScreen} />
          <Stack.Screen name="Duels" component={DuelsScreen} />
          <Stack.Screen name="FormAnalysis" component={FormAnalysisScreen} />
          <Stack.Screen name="WellbeingDiary" component={WellbeingDiaryScreen} />
          <Stack.Screen name="CycleTracker" component={CycleTrackerScreen} />
          <Stack.Screen name="HealthSync" component={HealthSyncScreen} />
          <Stack.Screen name="BodyFatPhoto" component={BodyFatPhotoScreen} />
          <Stack.Screen name="AiProgramGen" component={AiProgramGenScreen} />
          <Stack.Screen name="LiveCoach" component={LiveCoachScreen} />
          <Stack.Screen name="ShareProgram" component={ShareProgramScreen} />
        </>
      )}
    </Stack.Navigator>
  );
}
