import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
export declare class AdminService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    listUsers(): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
        goal: string | null;
        onboardingCompleted: boolean;
        _count: {
            workouts: number;
            nutritionEntries: number;
        };
    }[]>;
    setRole(userId: string, role: UserRole): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    assignCoach(clientId: string, coachId: string, notes?: string): Promise<{
        coach: {
            id: string;
            name: string;
            email: string;
        };
        client: {
            id: string;
            name: string;
            email: string;
        };
    } & {
        id: string;
        createdAt: Date;
        notes: string | null;
        clientId: string;
        coachId: string;
    }>;
}
