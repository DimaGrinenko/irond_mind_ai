import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpsertSetDto } from './dto/upsert-set.dto';
import { AchievementsService } from '../achievements/achievements.service';
export declare class WorkoutsService {
    private readonly prisma;
    private readonly achievements;
    constructor(prisma: PrismaService, achievements: AchievementsService);
    list(userId: string, limit?: number): import(".prisma/client").Prisma.PrismaPromise<({
        sets: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            exerciseId: string;
            weight: number | null;
            reps: number | null;
            rpeLevel: number | null;
            workoutId: string;
            setNumber: number;
            completed: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        programId: string | null;
        userId: string;
        date: Date;
        durationSeconds: number | null;
        calories: number | null;
        status: import(".prisma/client").$Enums.WorkoutStatus;
    })[]>;
    create(userId: string, dto: CreateWorkoutDto): import(".prisma/client").Prisma.Prisma__WorkoutClient<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        programId: string | null;
        userId: string;
        date: Date;
        durationSeconds: number | null;
        calories: number | null;
        status: import(".prisma/client").$Enums.WorkoutStatus;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    byId(userId: string, id: string): Promise<{
        sets: {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            exerciseId: string;
            weight: number | null;
            reps: number | null;
            rpeLevel: number | null;
            workoutId: string;
            setNumber: number;
            completed: boolean;
        }[];
    } & {
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        programId: string | null;
        userId: string;
        date: Date;
        durationSeconds: number | null;
        calories: number | null;
        status: import(".prisma/client").$Enums.WorkoutStatus;
    }>;
    finish(userId: string, id: string): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        name: string | null;
        programId: string | null;
        userId: string;
        date: Date;
        durationSeconds: number | null;
        calories: number | null;
        status: import(".prisma/client").$Enums.WorkoutStatus;
    }>;
    upsertSet(userId: string, workoutId: string, dto: UpsertSetDto): Promise<{
        id: string;
        createdAt: Date;
        updatedAt: Date;
        exerciseId: string;
        weight: number | null;
        reps: number | null;
        rpeLevel: number | null;
        workoutId: string;
        setNumber: number;
        completed: boolean;
    }>;
    exerciseHistory(userId: string, slug: string): Promise<{
        lastSet: null;
        maxWeight: null;
        maxReps: null;
        maxVolume: null;
        lastWorkoutDate: null;
        lastWorkoutSets?: undefined;
    } | {
        lastSet: {
            weight: number | null;
            reps: number | null;
            date: string;
        };
        lastWorkoutSets: {
            setNumber: number;
            weight: number | null;
            reps: number | null;
        }[];
        maxWeight: number | null;
        maxReps: number | null;
        maxVolume: number | null;
        lastWorkoutDate: string;
    }>;
    exercise1rmSeries(userId: string, slug: string): Promise<{
        date: string;
        max1rm: number;
    }[]>;
    private resolveExerciseId;
}
