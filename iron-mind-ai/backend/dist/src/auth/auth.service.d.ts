import { JwtService } from '@nestjs/jwt';
import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export type AuthPayload = {
    sub: string;
    email: string;
};
export declare class AuthService {
    private readonly prisma;
    private readonly jwt;
    constructor(prisma: PrismaService, jwt: JwtService);
    register(dto: RegisterDto): Promise<{
        token: string;
        user: any;
    }>;
    login(dto: LoginDto): Promise<{
        token: string;
        user: any;
    }>;
    me(userId: string): Promise<{
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
    private issue;
}
