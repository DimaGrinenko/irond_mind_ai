import { Controller, Get, Query, UseGuards } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { JwtGuard } from '../auth/jwt.guard';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { StatsService } from './stats.service';

@Controller('stats')
@UseGuards(JwtGuard)
export class StatsController {
  constructor(private readonly stats: StatsService) {}

  @Get('me')
  me(@CurrentUser() user: { id: string }, @Query('days') days?: string) {
    return this.stats.userDashboard(user.id, days ? Number(days) : 7);
  }

  @Get('platform')
  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  platform() {
    return this.stats.platformOverview();
  }
}
