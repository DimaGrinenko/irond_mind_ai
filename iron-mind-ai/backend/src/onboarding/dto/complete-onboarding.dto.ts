import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class CompleteOnboardingDto {
  @IsEnum(['MALE', 'FEMALE', 'OTHER'])
  gender!: 'MALE' | 'FEMALE' | 'OTHER';

  @Type(() => Number)
  @IsInt()
  @Min(10)
  @Max(110)
  age!: number;

  @Type(() => Number)
  @IsInt()
  @Min(80)
  @Max(260)
  heightCm!: number;

  @Type(() => Number)
  @IsNumber()
  @Min(20)
  @Max(400)
  weightKg!: number;

  @IsEnum(['SEDENTARY', 'LIGHT', 'MODERATE', 'ACTIVE', 'VERY_ACTIVE'])
  activityLevel!: 'SEDENTARY' | 'LIGHT' | 'MODERATE' | 'ACTIVE' | 'VERY_ACTIVE';

  @IsEnum(['MASS', 'CUT', 'STRENGTH', 'ENDURANCE', 'ABS'])
  goalKey!: 'MASS' | 'CUT' | 'STRENGTH' | 'ENDURANCE' | 'ABS';

  @IsOptional()
  @IsEnum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED'])
  level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';

  @IsOptional()
  @IsString()
  name?: string;
}
