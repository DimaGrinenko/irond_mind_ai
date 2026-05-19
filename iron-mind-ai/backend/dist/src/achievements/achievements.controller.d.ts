import { CurrentUserPayload } from '../auth/current-user.decorator';
import { AchievementsService } from './achievements.service';
export declare class AchievementsController {
    private readonly svc;
    constructor(svc: AchievementsService);
    progress(user: CurrentUserPayload): Promise<{
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
    tree(user: CurrentUserPayload): Promise<{
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
    history(user: CurrentUserPayload, limit?: string): Promise<{
        id: string;
        kind: import(".prisma/client").$Enums.ActivityEventKind;
        title: string;
        detail: string | null;
        xp: number;
        occurredAt: Date;
    }[]>;
}
