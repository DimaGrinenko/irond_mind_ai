import { PrismaService } from '../prisma/prisma.service';
export declare class AchievementsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getProgress(userId: string): Promise<{
        treeLevel: number;
        currentXp: number;
        xpToNext: number;
        totalXp: number;
        leaves: number;
        streakDays: number;
        longestStreak: number;
        monthlyGoal: number;
        monthlyDone: number;
        lastWorkoutAt: Date | null;
        todayCompleted: boolean;
    }>;
    getTree(userId: string): Promise<{
        id: string;
        title: string;
        description: string;
        category: import(".prisma/client").$Enums.AchievementCategory;
        iconName: string;
        positionX: number;
        positionY: number;
        xpReward: number;
        leavesReward: number;
        targetValue: number | null;
        targetUnit: string | null;
        status: import(".prisma/client").$Enums.AchievementStatus;
        progress: number;
        currentValue: number;
        unlockedAt: Date | null;
    }[]>;
    getHistory(userId: string, limit?: number): Promise<{
        id: string;
        kind: import(".prisma/client").$Enums.ActivityEventKind;
        title: string;
        detail: string | null;
        xp: number;
        occurredAt: Date;
    }[]>;
    recordWorkoutCompletion(userId: string, workoutTitle?: string): Promise<void>;
    private checkAchievements;
    private isSameDay;
    private isYesterday;
}
