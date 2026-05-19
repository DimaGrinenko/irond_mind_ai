import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';
import { AchievementsService } from './achievements.service';

@UseGuards(JwtGuard)
@Controller('achievements')
export class AchievementsController {
  constructor(private readonly svc: AchievementsService) {}

  @Get('progress')
  progress(@CurrentUser() user: CurrentUserPayload) {
    return this.svc.getProgress(user.id);
  }

  @Get('tree')
  tree(@CurrentUser() user: CurrentUserPayload) {
    return this.svc.getTree(user.id);
  }

  @Get('history')
  history(@CurrentUser() user: CurrentUserPayload, @Query('limit') limit?: string) {
    const n = limit ? Math.min(50, Math.max(1, parseInt(limit, 10))) : 12;
    return this.svc.getHistory(user.id, n);
  }
}
