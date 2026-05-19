import { ActivityLevel, FitnessGoalKey, Gender } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
export interface NutritionPlan {
    bmr: number;
    tdee: number;
    dailyCalories: number;
    proteinG: number;
    fatsG: number;
    carbsG: number;
    surplusOrDeficit: number;
    programId: string;
    goalLabel: string;
}
export declare class OnboardingService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    calculateBmr(gender: Gender, weightKg: number, heightCm: number, age: number): number;
    buildPlan(input: {
        gender: Gender;
        age: number;
        heightCm: number;
        weightKg: number;
        activityLevel: ActivityLevel;
        goalKey: FitnessGoalKey;
    }): NutritionPlan;
    preview(dto: CompleteOnboardingDto): NutritionPlan;
    complete(userId: string, dto: CompleteOnboardingDto): Promise<{
        user: {
            id: string;
            level: import(".prisma/client").$Enums.FitnessLevel | null;
            goalKey: import(".prisma/client").$Enums.FitnessGoalKey | null;
            createdAt: Date;
            updatedAt: Date;
            name: string;
            email: string;
            role: import(".prisma/client").$Enums.UserRole;
            gender: import(".prisma/client").$Enums.Gender | null;
            age: number | null;
            heightCm: number | null;
            weightKg: number | null;
            activityLevel: import(".prisma/client").$Enums.ActivityLevel | null;
            goal: string | null;
            currentProgramId: string | null;
            programWeek: number;
            onboardingCompleted: boolean;
            dailyCaloriesGoal: number | null;
            dailyProteinGoal: number | null;
            dailyFatsGoal: number | null;
            dailyCarbsGoal: number | null;
        };
        plan: NutritionPlan;
    }>;
}
