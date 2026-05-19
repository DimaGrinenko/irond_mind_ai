import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';
import { ProgramsService } from './programs.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { CreateProgramDayDto } from './dto/create-program-day.dto';
import { UpdateProgramDayDto } from './dto/update-program-day.dto';
import { CreateProgramExerciseDto } from './dto/create-program-exercise.dto';
import { UpdateProgramExerciseDto } from './dto/update-program-exercise.dto';
import { UseProgramDto } from './dto/use-program.dto';

@UseGuards(JwtGuard)
@Controller('programs')
export class ProgramsController {
  constructor(private readonly programs: ProgramsService) {}

  @Get()
  list(@CurrentUser() user: CurrentUserPayload) {
    return this.programs.list(user.id);
  }

  @Get(':id')
  one(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.programs.byId(id, user.id);
  }

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateProgramDto) {
    return this.programs.create(user.id, dto);
  }

  @Post(':id/clone')
  clone(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.programs.clone(user.id, id);
  }

  @Patch(':id')
  update(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UpdateProgramDto,
  ) {
    return this.programs.update(user.id, id, dto);
  }

  @Delete(':id')
  remove(@CurrentUser() user: CurrentUserPayload, @Param('id') id: string) {
    return this.programs.remove(user.id, id);
  }

  @Post(':id/use')
  use(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: UseProgramDto,
  ) {
    return this.programs.use(user.id, id, dto);
  }

  // ---- Дни ----
  @Post(':id/days')
  addDay(
    @CurrentUser() user: CurrentUserPayload,
    @Param('id') id: string,
    @Body() dto: CreateProgramDayDto,
  ) {
    return this.programs.addDay(user.id, id, dto);
  }

  @Patch('days/:dayId')
  updateDay(
    @CurrentUser() user: CurrentUserPayload,
    @Param('dayId') dayId: string,
    @Body() dto: UpdateProgramDayDto,
  ) {
    return this.programs.updateDay(user.id, dayId, dto);
  }

  @Delete('days/:dayId')
  removeDay(@CurrentUser() user: CurrentUserPayload, @Param('dayId') dayId: string) {
    return this.programs.removeDay(user.id, dayId);
  }

  // ---- Упражнения ----
  @Post('days/:dayId/exercises')
  addExercise(
    @CurrentUser() user: CurrentUserPayload,
    @Param('dayId') dayId: string,
    @Body() dto: CreateProgramExerciseDto,
  ) {
    return this.programs.addExercise(user.id, dayId, dto);
  }

  @Patch('exercises/:exerciseId')
  updateExercise(
    @CurrentUser() user: CurrentUserPayload,
    @Param('exerciseId') exerciseId: string,
    @Body() dto: UpdateProgramExerciseDto,
  ) {
    return this.programs.updateExercise(user.id, exerciseId, dto);
  }

  @Delete('exercises/:exerciseId')
  removeExercise(
    @CurrentUser() user: CurrentUserPayload,
    @Param('exerciseId') exerciseId: string,
  ) {
    return this.programs.removeExercise(user.id, exerciseId);
  }
}
