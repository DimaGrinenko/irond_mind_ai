import { Type } from 'class-transformer';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';
import { FitnessGoalKey, FitnessLevel, ProgramKind } from '@prisma/client';

export class CreateProgramDto {
  @IsString()
  @MaxLength(80)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(140)
  subtitle?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  description?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(52)
  weeks?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(7)
  daysPerWeek?: number;

  @IsOptional()
  @IsEnum(FitnessLevel)
  level?: FitnessLevel;

  @IsOptional()
  @IsEnum(FitnessGoalKey)
  goalKey?: FitnessGoalKey;

  @IsOptional()
  @IsEnum(ProgramKind)
  kind?: ProgramKind;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  accent?: string;

  @IsOptional()
  @IsString()
  @MaxLength(60)
  iconName?: string;
}
