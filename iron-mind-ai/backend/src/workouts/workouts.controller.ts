import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';
import { WorkoutsService } from './workouts.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpsertSetDto } from './dto/upsert-set.dto';

@UseGuards(JwtGuard)
@Controller('workouts')
export class WorkoutsController {
  constructor(private readonly workouts: WorkoutsService) {}

  @Get()
  list(@CurrentUser() user: CurrentUserPayload, @Query('limit') limit?: string) {
    return this.workouts.list(user.id, limit ? Number(limit) : undefined);
  }

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateWorkoutDto) {
    return this.workouts.create(user.id, dto);
  }

  /** Историю по упражнению (по slug) — последний и максимальный сеты. */
  @Get('exercise-history/:slug')
  exerciseHistory(
    @CurrentUser() user: CurrentUserPayload,
    @Param('slug') slug: string,
  ) {
    return this.workouts.exerciseHistory(user.id, slug);
  }

  /** Серия 1RM (Brzycki) по упражнению по датам. */
  @Get('exercise-1rm-series/:slug')
  exercise1rmSeries(
    @CurrentUser() user: CurrentUserPayload,
    @Param('slug') slug: string,
  ) {
    return this.workouts.exercise1rmSeries(user.id, slug);
  }

  @Get(':id')
  one(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.workouts.byId(user.id, id);
  }

  @Patch(':id/finish')
  finish(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.workouts.finish(user.id, id);
  }

  @Post(':id/sets')
  upsertSet(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpsertSetDto,
  ) {
    return this.workouts.upsertSet(user.id, id, dto);
  }
}
