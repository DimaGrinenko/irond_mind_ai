import { AuthService } from './auth.service';
import { LoginDto } from './dto/login.dto';
import { RegisterDto } from './dto/register.dto';
import { CurrentUserPayload } from './current-user.decorator';
export declare class AuthController {
    private readonly auth;
    constructor(auth: AuthService);
    register(dto: RegisterDto): Promise<{
        token: string;
        user: any;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: any;
    }>;
    me(user: CurrentUserPayload): Promise<{
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
    }>;
}
