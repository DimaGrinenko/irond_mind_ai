import { IsBoolean, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class UpsertSetDto {
  /** cuid из таблицы Exercise. Можно не передавать, если указан exerciseSlug. */
  @IsOptional() @IsString() exerciseId?: string;
  /** slug упражнения (например, "bench_press"). Сервер сам резолвит в exerciseId. */
  @IsOptional() @IsString() exerciseSlug?: string;
  @IsInt() @Min(1) setNumber!: number;
  @IsOptional() @IsNumber() weight?: number;
  @IsOptional() @IsInt() reps?: number;
  @IsOptional() @IsInt() rpeLevel?: number;
  @IsOptional() @IsBoolean() completed?: boolean;
}
