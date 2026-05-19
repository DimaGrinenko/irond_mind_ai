import { PrismaService } from '../prisma/prisma.service';
import { AchievementsService } from '../achievements/achievements.service';
import { CreateScheduledDto } from './dto/create-scheduled.dto';
export declare class ScheduleService {
    private readonly prisma;
    private readonly achievements;
    constructor(prisma: PrismaService, achievements: AchievementsService);
    list(userId: string, from?: string, to?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        programId: string | null;
        notes: string | null;
        time: string | null;
        userId: string;
        date: Date;
        status: import(".prisma/client").$Enums.ScheduledWorkoutStatus;
        programDayId: string | null;
        completedAt: Date | null;
        workoutId: string | null;
    }[]>;
    create(userId: string, dto: CreateScheduledDto): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        programId: string | null;
        notes: string | null;
        time: string | null;
        userId: string;
        date: Date;
        status: import(".prisma/client").$Enums.ScheduledWorkoutStatus;
        programDayId: string | null;
        completedAt: Date | null;
        workoutId: string | null;
    } | {
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        programId: string | null;
        notes: string | null;
        time: string | null;
        userId: string;
        date: Date;
        status: import(".prisma/client").$Enums.ScheduledWorkoutStatus;
        programDayId: string | null;
        completedAt: Date | null;
        workoutId: string | null;
    }[]>;
    complete(userId: string, id: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        programId: string | null;
        notes: string | null;
        time: string | null;
        userId: string;
        date: Date;
        status: import(".prisma/client").$Enums.ScheduledWorkoutStatus;
        programDayId: string | null;
        completedAt: Date | null;
        workoutId: string | null;
    }>;
    skip(userId: string, id: string): Promise<{
        id: string;
        title: string;
        createdAt: Date;
        updatedAt: Date;
        programId: string | null;
        notes: string | null;
        time: string | null;
        userId: string;
        date: Date;
        status: import(".prisma/client").$Enums.ScheduledWorkoutStatus;
        programDayId: string | null;
        completedAt: Date | null;
        workoutId: string | null;
    }>;
    remove(userId: string, id: string): Promise<{
        ok: boolean;
    }>;
    private ensureOwn;
    private expandDates;
}
