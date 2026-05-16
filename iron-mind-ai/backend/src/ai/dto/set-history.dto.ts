import { Type } from 'class-transformer';
import {
  ArrayNotEmpty,
  IsArray,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
  ValidateNested,
} from 'class-validator';

export class SetHistoryItemDto {
  @IsString()
  exerciseId!: string;

  @IsNumber()
  @Min(0)
  weight!: number;

  @IsInt()
  @Min(0)
  reps!: number;

  @IsInt()
  @Min(1)
  @Max(10)
  rpeLevel!: number;

  @IsOptional()
  @IsString()
  performedAt?: string;
}

export class SetHistoryDto {
  @IsArray()
  @ArrayNotEmpty()
  @ValidateNested({ each: true })
  @Type(() => SetHistoryItemDto)
  sets!: SetHistoryItemDto[];
}

