import { Body, Controller, Get, Post, UseGuards } from '@nestjs/common';
import { JwtGuard } from '../auth/jwt.guard';
import {
  CurrentUser,
  CurrentUserPayload,
} from '../auth/current-user.decorator';
import { EconomyService } from './economy.service';
import { ShopItemDto } from './dto/shop-item.dto';

@UseGuards(JwtGuard)
@Controller('economy')
export class EconomyController {
  constructor(private readonly svc: EconomyService) {}

  @Get('wallet')
  wallet(@CurrentUser() user: CurrentUserPayload) {
    return this.svc.getWallet(user.id);
  }

  @Get('shop')
  shop() {
    return this.svc.catalog();
  }

  @Post('wheel/spin')
  spin(@CurrentUser() user: CurrentUserPayload) {
    return this.svc.spinWheel(user.id);
  }

  @Post('shop/buy')
  buy(@CurrentUser() user: CurrentUserPayload, @Body() dto: ShopItemDto) {
    return this.svc.buy(user.id, dto.itemId);
  }

  @Post('shop/equip')
  equip(@CurrentUser() user: CurrentUserPayload, @Body() dto: ShopItemDto) {
    return this.svc.equip(user.id, dto.itemId);
  }

  @Post('shop/unequip')
  unequip(@CurrentUser() user: CurrentUserPayload, @Body() dto: ShopItemDto) {
    return this.svc.unequip(user.id, dto.itemId);
  }
}
