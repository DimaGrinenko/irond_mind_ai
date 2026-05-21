import {
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
} from 'class-validator';

export class UpdateCycleDto {
  @IsOptional()
  @IsBoolean()
  enabled?: boolean;

  @IsOptional()
  @IsString()
  @Matches(/^\d{4}-\d{2}-\d{2}$/, {
    message: 'lastPeriodStart must be YYYY-MM-DD',
  })
  lastPeriodStart?: string;

  @IsOptional()
  @IsInt()
  @Min(20)
  @Max(40)
  cycleLength?: number;
}
