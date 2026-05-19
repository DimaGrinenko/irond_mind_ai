import { CurrentUserPayload } from '../auth/current-user.decorator';
import { ScheduleService } from './schedule.service';
import { CreateScheduledDto } from './dto/create-scheduled.dto';
export declare class ScheduleController {
    private readonly svc;
    constructor(svc: ScheduleService);
    list(user: CurrentUserPayload, from?: string, to?: string): import(".prisma/client").Prisma.PrismaPromise<{
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
    create(user: CurrentUserPayload, dto: CreateScheduledDto): Promise<{
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
    complete(user: CurrentUserPayload, id: string): Promise<{
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
    skip(user: CurrentUserPayload, id: string): Promise<{
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
    remove(user: CurrentUserPayload, id: string): Promise<{
        ok: boolean;
    }>;
}
