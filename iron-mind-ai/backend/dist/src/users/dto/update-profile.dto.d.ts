export declare class UpdateProfileDto {
    name?: string;
    gender?: 'MALE' | 'FEMALE' | 'OTHER';
    age?: number;
    heightCm?: number;
    weightKg?: number;
    level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    activityLevel?: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'ACTIVE' | 'VERY_ACTIVE';
    goal?: string;
    goalKey?: 'MASS' | 'CUT' | 'STRENGTH' | 'ENDURANCE' | 'ABS';
    currentProgramId?: string;
    programWeek?: number;
    onboardingCompleted?: boolean;
    dailyCaloriesGoal?: number;
    dailyProteinGoal?: number;
    dailyFatsGoal?: number;
    dailyCarbsGoal?: number;
}
