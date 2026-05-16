import { Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import { CurrentUser, CurrentUserPayload } from '../auth/current-user.decorator';
import { NutritionService } from './nutrition.service';
import { CreateNutritionEntryDto } from './dto/create-entry.dto';

@UseGuards(JwtGuard)
@Controller('nutrition')
export class NutritionController {
  constructor(private readonly nutrition: NutritionService) {}

  @Get()
  list(@CurrentUser() user: CurrentUserPayload, @Query('date') date?: string) {
    return this.nutrition.list(user.id, date);
  }

  @Post()
  create(@CurrentUser() user: CurrentUserPayload, @Body() dto: CreateNutritionEntryDto) {
    return this.nutrition.create(user.id, dto);
  }
}
