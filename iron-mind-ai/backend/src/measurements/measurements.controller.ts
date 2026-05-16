import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';
import { MeasurementsService } from './measurements.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';

@UseGuards(JwtGuard)
@Controller('measurements')
export class MeasurementsController {
  constructor(private readonly measurements: MeasurementsService) {}

  @Get()
  list(@CurrentUser() user: CurrentUserPayload, @Query('limit') limit?: string) {
    return this.measurements.list(user.id, limit ? Number(limit) : undefined);
  }

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateMeasurementDto) {
    return this.measurements.create(user.id, dto);
  }
}
