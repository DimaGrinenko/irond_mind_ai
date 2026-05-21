import { Body, Controller, Get, Put, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../auth/current-user.decorator';
import { CycleService } from './cycle.service';
import { UpdateCycleDto } from './dto/update-cycle.dto';

@UseGuards(JwtGuard)
@Controller('cycle')
export class CycleController {
  constructor(private readonly svc: CycleService) {}

  @Get()
  get(@CurrentUser() user: CurrentUserPayload) {
    return this.svc.get(user.id);
  }

  @Put()
  update(@CurrentUser() user: CurrentUserPayload, @Body() dto: UpdateCycleDto) {
    return this.svc.update(user.id, dto);
  }
}
