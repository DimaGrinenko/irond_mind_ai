import { UserRole } from '@prisma/client';
import { AdminService } from './admin.service';
declare class SetRoleDto {
    role: UserRole;
}
declare class AssignCoachDto {
    coachId: string;
    notes?: string;
}
export declare class AdminController {
    private readonly admin;
    constructor(admin: AdminService);
    users(): import(".prisma/client").Prisma.PrismaPromise<{
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
    setRole(id: string, dto: SetRoleDto): Promise<{
        id: string;
        name: string;
        email: string;
        role: import(".prisma/client").$Enums.UserRole;
    }>;
    assignCoach(clientId: string, dto: AssignCoachDto): Promise<{
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
export {};
