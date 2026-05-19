import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class CreateProgramExerciseDto {
  @IsOptional()
  @IsString()
  @MaxLength(60)
  exerciseId?: string;

  /** Альтернатива exerciseId — slug упражнения; сервер сам резолвит в id или создаёт заглушку. */
  @IsOptional()
  @IsString()
  @MaxLength(60)
  exerciseSlug?: string;

  @IsString()
  @MaxLength(120)
  exerciseName!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(20)
  sets?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  repsMin?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(100)
  repsMax?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(900)
  restSeconds?: number;

  @IsOptional()
  @IsString()
  @MaxLength(300)
  notes?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  order?: number;
}
