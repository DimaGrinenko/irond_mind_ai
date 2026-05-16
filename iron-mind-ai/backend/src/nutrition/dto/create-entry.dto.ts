import { IsDateString, IsEnum, IsInt, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class CreateNutritionEntryDto {
  @IsOptional() @IsDateString() date?: string;
  @IsEnum(['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK']) mealType!: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
  @IsString() name!: string;
  @IsInt() @Min(0) calories!: number;
  @IsOptional() @IsNumber() protein?: number;
  @IsOptional() @IsNumber() fats?: number;
  @IsOptional() @IsNumber() carbs?: number;
  @IsOptional() @IsString() time?: string;
}
