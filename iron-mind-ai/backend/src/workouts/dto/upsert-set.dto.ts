import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpsertSetDto {
  @IsString() exerciseId!: string;
  @IsInt() @Min(1) setNumber!: number;
  @IsOptional() @IsNumber() weight?: number;
  @IsOptional() @IsInt() reps?: number;
  @IsOptional() @IsInt() rpeLevel?: number;
  @IsOptional() @IsBoolean() completed?: boolean;
}
