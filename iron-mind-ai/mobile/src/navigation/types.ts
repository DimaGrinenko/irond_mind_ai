export type RootStackParamList = {
  Onboarding: undefined;
  RootTabs: { screen?: string; params?: any } | undefined;

  // Stack screens over tabs
  ProgramDetail: { programId: string };
  ProgramEdit: { programId: string };
  ExerciseDetail: { exerciseId: string };
  Workout: undefined;
  GymMode: undefined;
  PlanBuilder: undefined;
  WorkoutsHistory: undefined;
  Supplements: undefined;
  Nutrition: undefined;
  BodyMeasurements: undefined;
  Calendar: undefined;
  Achievements: undefined;
  Community: undefined;
  Subscription: undefined;
  Motivation: undefined;
  ProgressPhotos: undefined;
  AdminPanel: undefined;
  CoachPanel: undefined;
  OneRmChart: { exerciseId?: string } | undefined;
  PhotoCompare: undefined;
  DataExport: undefined;
  Challenges: undefined;
  LeafShop: undefined;
  Friends: undefined;
  Duels: { friendId: string; friendName: string; theirVol: number } | undefined;
  FormAnalysis: undefined;
  HealthSync: undefined;
  CycleTracker: undefined;
  WellbeingDiary: undefined;
  BodyFatPhoto: undefined;
  AiProgramGen: undefined;
  LiveCoach: undefined;
  ShareProgram: { programId?: string } | undefined;
};

