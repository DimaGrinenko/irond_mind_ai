import { Type } from 'class-transformer';
import {
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsString,
  MaxLength,
  Min,
  Max,
  Matches,
  ArrayMaxSize,
  ArrayMinSize,
} from 'class-validator';

export class CreateScheduledDto {
  @IsDateString()
  date!: string;

  @IsOptional()
  @Matches(/^([01]\d|2[0-3]):[0-5]\d$/, { message: 'time must be HH:mm' })
  time?: string;

  @IsString()
  @MaxLength(80)
  title!: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  programId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  notes?: string;

  /** Опционально: повторить на дни недели (0=Пн ... 6=Вс) в течение weeks недель */
  @IsOptional()
  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(7)
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  repeatWeekdays?: number[];

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  repeatWeeks?: number;
}
