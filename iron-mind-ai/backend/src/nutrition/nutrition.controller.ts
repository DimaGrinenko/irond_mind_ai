import { BadRequestException, Body, Controller, Get, Post, Query, UseGuards } from '@nestjs/common';
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

  /** Импорт рецепта по URL — парсит ингредиенты и считает БЖУ. */
  @Post('recipe-import')
  recipeImport(@Body() body: { url?: string }) {
    if (!body?.url) throw new BadRequestException('url required');
    return this.nutrition.recipeImport(body.url);
  }
}
