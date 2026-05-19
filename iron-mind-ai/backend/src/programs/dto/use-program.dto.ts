import { Type } from 'class-transformer';
import { ArrayMaxSize, IsArray, IsDateString, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UseProgramDto {
  /** ISO-дата, с которой стартует первая неделя плана (00:00 локали). */
  @IsDateString()
  startDate!: string;

  /** Сколько недель сгенерировать. По умолчанию — Program.weeks (но не больше 12). */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(12)
  weeks?: number;

  /**
   * Для каждого дня программы (по index в program.days, отсортированных по order)
   * — выбранный пользователем день недели (0=Пн ... 6=Вс).
   * Если не передан — используется default из program.days[*].weekday или авто-раскладка.
   */
  @IsOptional()
  @IsArray()
  @ArrayMaxSize(7)
  @Type(() => Number)
  @IsInt({ each: true })
  @Min(0, { each: true })
  @Max(6, { each: true })
  weekdays?: number[];
}
