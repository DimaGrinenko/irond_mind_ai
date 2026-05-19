import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { CreateProgramDayDto } from './dto/create-program-day.dto';
import { UpdateProgramDayDto } from './dto/update-program-day.dto';
import { CreateProgramExerciseDto } from './dto/create-program-exercise.dto';
import { UpdateProgramExerciseDto } from './dto/update-program-exercise.dto';
import { UseProgramDto } from './dto/use-program.dto';
export declare class ProgramsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId?: string): Prisma.PrismaPromise<{
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
    byId(id: string, userId?: string): Promise<{
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
    create(userId: string, dto: CreateProgramDto): Promise<{
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
    clone(userId: string, baseProgramId: string): Promise<{
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
    update(userId: string, id: string, dto: UpdateProgramDto): Promise<{
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
    remove(userId: string, id: string): Promise<{
        ok: boolean;
    }>;
    addDay(userId: string, programId: string, dto: CreateProgramDayDto): Promise<{
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
    updateDay(userId: string, dayId: string, dto: UpdateProgramDayDto): Promise<{
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
    removeDay(userId: string, dayId: string): Promise<{
        ok: boolean;
    }>;
    addExercise(userId: string, dayId: string, dto: CreateProgramExerciseDto): Promise<{
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
    private resolveExerciseId;
    updateExercise(userId: string, exerciseId: string, dto: UpdateProgramExerciseDto): Promise<{
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
    removeExercise(userId: string, exerciseId: string): Promise<{
        ok: boolean;
    }>;
    use(userId: string, programId: string, dto: UseProgramDto): Promise<{
        created: number;
        programId: string;
    }>;
    private ensureOwn;
    private resolveWeekdays;
}
