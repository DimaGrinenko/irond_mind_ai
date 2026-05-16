import { IsOptional, IsString, IsInt, IsDateString, Min } from 'class-validator';

export class CreateWorkoutDto {
  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsString() programId?: string;
  @IsOptional() @IsString() name?: string;
  @IsOptional() @IsInt() @Min(0) durationSeconds?: number;
  @IsOptional() @IsInt() @Min(0) calories?: number;
}
