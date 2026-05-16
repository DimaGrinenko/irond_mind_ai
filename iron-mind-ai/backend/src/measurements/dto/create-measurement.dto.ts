import { IsDateString, IsNumber, IsOptional } from 'class-validator';

export class CreateMeasurementDto {
  @IsOptional() @IsDateString() date?: string;
  @IsOptional() @IsNumber() weight?: number;
  @IsOptional() @IsNumber() chest?: number;
  @IsOptional() @IsNumber() waist?: number;
  @IsOptional() @IsNumber() hips?: number;
  @IsOptional() @IsNumber() biceps?: number;
  @IsOptional() @IsNumber() thigh?: number;
  @IsOptional() @IsNumber() calf?: number;
  @IsOptional() @IsNumber() neck?: number;
  @IsOptional() @IsNumber() shoulders?: number;
  @IsOptional() @IsNumber() forearm?: number;
}
