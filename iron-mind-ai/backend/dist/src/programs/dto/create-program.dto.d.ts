import { FitnessGoalKey, FitnessLevel, ProgramKind } from '@prisma/client';
export declare class CreateProgramDto {
    title: string;
    subtitle?: string;
    description?: string;
    weeks?: number;
    daysPerWeek?: number;
    level?: FitnessLevel;
    goalKey?: FitnessGoalKey;
    kind?: ProgramKind;
    accent?: string;
    iconName?: string;
}
