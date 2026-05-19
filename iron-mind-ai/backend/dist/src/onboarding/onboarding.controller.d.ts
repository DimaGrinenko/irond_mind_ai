import { CurrentUserPayload } from '../auth/current-user.decorator';
import { OnboardingService } from './onboarding.service';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';
export declare class OnboardingController {
    private readonly onboarding;
    constructor(onboarding: OnboardingService);
    preview(dto: CompleteOnboardingDto): import("./onboarding.service").NutritionPlan;
    complete(user: CurrentUserPayload, dto: CompleteOnboardingDto): Promise<{
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
        plan: import("./onboarding.service").NutritionPlan;
    }>;
}
