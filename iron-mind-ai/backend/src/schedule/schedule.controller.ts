import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';
import { ScheduleService } from './schedule.service';
import { CreateScheduledDto } from './dto/create-scheduled.dto';

@UseGuards(JwtGuard)
@Controller('schedule')
export class ScheduleController {
  constructor(private readonly svc: ScheduleService) {}

  @Get()
  list(
    @CurrentUser() user: CurrentUserPayload,
    @Query('from') from?: string,
    @Query('to') to?: string,
  ) {
    return this.svc.list(user.id, from, to);
  }

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateScheduledDto) {
    return this.svc.create(user.id, dto);
  }

  @Patch(':id/complete')
  complete(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.svc.complete(user.id, id);
  }

  @Patch(':id/skip')
  skip(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.svc.skip(user.id, id);
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.svc.remove(user.id, id);
  }
}
