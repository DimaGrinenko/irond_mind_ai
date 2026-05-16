import { Type } from 'class-transformer';
import { IsBoolean, IsEnum, IsInt, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';

export class UpdateProfileDto {
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsEnum(['MALE', 'FEMALE', 'OTHER']) gender?: 'MALE' | 'FEMALE' | 'OTHER';
  @IsOptional() @Type(() => Number) @IsInt() @Min(10) @Max(110) age?: number;
  @IsOptional() @Type(() => Number) @IsInt() @Min(80) @Max(260) heightCm?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(20) @Max(400) weightKg?: number;
  @IsOptional() @IsEnum(['BEGINNER', 'INTERMEDIATE', 'ADVANCED']) level?: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED';
  @IsOptional() @IsString() goal?: string;
  @IsOptional() @IsEnum(['MASS', 'CUT', 'STRENGTH', 'ENDURANCE', 'ABS']) goalKey?: 'MASS' | 'CUT' | 'STRENGTH' | 'ENDURANCE' | 'ABS';
  @IsOptional() @IsString() currentProgramId?: string;
  @IsOptional() @Type(() => Number) @IsInt() @Min(1) programWeek?: number;
  @IsOptional() @IsBoolean() onboardingCompleted?: boolean;
  @IsOptional() @Type(() => Number) @IsInt() @Min(800) @Max(10000) dailyCaloriesGoal?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(500) dailyProteinGoal?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(300) dailyFatsGoal?: number;
  @IsOptional() @Type(() => Number) @IsNumber() @Min(0) @Max(800) dailyCarbsGoal?: number;
}
