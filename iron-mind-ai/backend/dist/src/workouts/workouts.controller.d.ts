import { CurrentUserPayload } from '../auth/current-user.decorator';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpsertSetDto } from './dto/upsert-set.dto';
export declare class WorkoutsController {
    private readonly workouts;
    constructor(workouts: WorkoutsService);
    list(user: CurrentUserPayload, limit?: string): import(".prisma/client").Prisma.PrismaPromise<({
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
    create(user: CurrentUserPayload, dto: CreateWorkoutDto): import(".prisma/client").Prisma.Prisma__WorkoutClient<{
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
    exerciseHistory(user: CurrentUserPayload, slug: string): Promise<{
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
    exercise1rmSeries(user: CurrentUserPayload, slug: string): Promise<{
        date: string;
        max1rm: number;
    }[]>;
    one(user: CurrentUserPayload, id: string): Promise<{
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
    finish(user: CurrentUserPayload, id: string): Promise<{
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
    upsertSet(user: CurrentUserPayload, id: string, dto: UpsertSetDto): Promise<{
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
}
