import { CurrentUserPayload } from '../auth/current-user.decorator';
import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { CreateProgramDayDto } from './dto/create-program-day.dto';
import { UpdateProgramDayDto } from './dto/update-program-day.dto';
import { CreateProgramExerciseDto } from './dto/create-program-exercise.dto';
import { UpdateProgramExerciseDto } from './dto/update-program-exercise.dto';
import { UseProgramDto } from './dto/use-program.dto';
export declare class ProgramsController {
    private readonly programs;
    constructor(programs: ProgramsService);
    list(user: CurrentUserPayload): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        title: string;
        subtitle: string;
        weeks: number;
        level: import(".prisma/client").$Enums.FitnessLevel;
        goalKey: import(".prisma/client").$Enums.FitnessGoalKey;
        kind: import(".prisma/client").$Enums.ProgramKind;
        daysPerWeek: number;
        accent: string;
        iconName: string;
        description: string;
        ownerUserId: string | null;
        baseProgramId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    one(user: CurrentUserPayload, id: string): Promise<{
        days: ({
            exercises: {
                id: string;
                sets: number;
                order: number;
                exerciseId: string;
                exerciseName: string;
                repsMin: number;
                repsMax: number;
                restSeconds: number;
                notes: string | null;
                dayId: string;
            }[];
        } & {
            id: string;
            title: string;
            programId: string;
            order: number;
            weekday: number | null;
        })[];
    } & {
        id: string;
        title: string;
        subtitle: string;
        weeks: number;
        level: import(".prisma/client").$Enums.FitnessLevel;
        goalKey: import(".prisma/client").$Enums.FitnessGoalKey;
        kind: import(".prisma/client").$Enums.ProgramKind;
        daysPerWeek: number;
        accent: string;
        iconName: string;
        description: string;
        ownerUserId: string | null;
        baseProgramId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    create(user: CurrentUserPayload, dto: CreateProgramDto): Promise<{
        days: ({
            exercises: {
                id: string;
                sets: number;
                order: number;
                exerciseId: string;
                exerciseName: string;
                repsMin: number;
                repsMax: number;
                restSeconds: number;
                notes: string | null;
                dayId: string;
            }[];
        } & {
            id: string;
            title: string;
            programId: string;
            order: number;
            weekday: number | null;
        })[];
    } & {
        id: string;
        title: string;
        subtitle: string;
        weeks: number;
        level: import(".prisma/client").$Enums.FitnessLevel;
        goalKey: import(".prisma/client").$Enums.FitnessGoalKey;
        kind: import(".prisma/client").$Enums.ProgramKind;
        daysPerWeek: number;
        accent: string;
        iconName: string;
        description: string;
        ownerUserId: string | null;
        baseProgramId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    clone(user: CurrentUserPayload, id: string): Promise<{
        days: ({
            exercises: {
                id: string;
                sets: number;
                order: number;
                exerciseId: string;
                exerciseName: string;
                repsMin: number;
                repsMax: number;
                restSeconds: number;
                notes: string | null;
                dayId: string;
            }[];
        } & {
            id: string;
            title: string;
            programId: string;
            order: number;
            weekday: number | null;
        })[];
    } & {
        id: string;
        title: string;
        subtitle: string;
        weeks: number;
        level: import(".prisma/client").$Enums.FitnessLevel;
        goalKey: import(".prisma/client").$Enums.FitnessGoalKey;
        kind: import(".prisma/client").$Enums.ProgramKind;
        daysPerWeek: number;
        accent: string;
        iconName: string;
        description: string;
        ownerUserId: string | null;
        baseProgramId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    update(user: CurrentUserPayload, id: string, dto: UpdateProgramDto): Promise<{
        days: ({
            exercises: {
                id: string;
                sets: number;
                order: number;
                exerciseId: string;
                exerciseName: string;
                repsMin: number;
                repsMax: number;
                restSeconds: number;
                notes: string | null;
                dayId: string;
            }[];
        } & {
            id: string;
            title: string;
            programId: string;
            order: number;
            weekday: number | null;
        })[];
    } & {
        id: string;
        title: string;
        subtitle: string;
        weeks: number;
        level: import(".prisma/client").$Enums.FitnessLevel;
        goalKey: import(".prisma/client").$Enums.FitnessGoalKey;
        kind: import(".prisma/client").$Enums.ProgramKind;
        daysPerWeek: number;
        accent: string;
        iconName: string;
        description: string;
        ownerUserId: string | null;
        baseProgramId: string | null;
        createdAt: Date;
        updatedAt: Date;
    }>;
    remove(user: CurrentUserPayload, id: string): Promise<{
        ok: boolean;
    }>;
    use(user: CurrentUserPayload, id: string, dto: UseProgramDto): Promise<{
        created: number;
        programId: string;
    }>;
    addDay(user: CurrentUserPayload, id: string, dto: CreateProgramDayDto): Promise<{
        exercises: {
            id: string;
            sets: number;
            order: number;
            exerciseId: string;
            exerciseName: string;
            repsMin: number;
            repsMax: number;
            restSeconds: number;
            notes: string | null;
            dayId: string;
        }[];
    } & {
        id: string;
        title: string;
        programId: string;
        order: number;
        weekday: number | null;
    }>;
    updateDay(user: CurrentUserPayload, dayId: string, dto: UpdateProgramDayDto): Promise<{
        exercises: {
            id: string;
            sets: number;
            order: number;
            exerciseId: string;
            exerciseName: string;
            repsMin: number;
            repsMax: number;
            restSeconds: number;
            notes: string | null;
            dayId: string;
        }[];
    } & {
        id: string;
        title: string;
        programId: string;
        order: number;
        weekday: number | null;
    }>;
    removeDay(user: CurrentUserPayload, dayId: string): Promise<{
        ok: boolean;
    }>;
    addExercise(user: CurrentUserPayload, dayId: string, dto: CreateProgramExerciseDto): Promise<{
        id: string;
        sets: number;
        order: number;
        exerciseId: string;
        exerciseName: string;
        repsMin: number;
        repsMax: number;
        restSeconds: number;
        notes: string | null;
        dayId: string;
    }>;
    updateExercise(user: CurrentUserPayload, exerciseId: string, dto: UpdateProgramExerciseDto): Promise<{
        id: string;
        sets: number;
        order: number;
        exerciseId: string;
        exerciseName: string;
        repsMin: number;
        repsMax: number;
        restSeconds: number;
        notes: string | null;
        dayId: string;
    }>;
    removeExercise(user: CurrentUserPayload, exerciseId: string): Promise<{
        ok: boolean;
    }>;
}
