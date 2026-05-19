export declare class CompleteOnboardingDto {
    gender: 'MALE' | 'FEMALE' | 'OTHER';
    age: number;
    heightCm: number;
    weightKg: number;
    activityLevel: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'ACTIVE' | 'VERY_ACTIVE';
    goalKey: 'MASS' | 'CUT' | 'STRENGTH' | 'ENDURANCE' | 'ABS';
    level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
    name?: string;
}
