import { BadRequestException, Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  SHOP_ITEMS,
  WHEEL_SECTORS,
  isoDay,
  rollWheel,
  shopItem,
  wheelMultiplier,
  yesterdayIso,
} from './economy.constants';

export type Wallet = {
  leaves: number;
  owned: Array<{ itemId: string; equipped: string | null }>;
  equipped: {
    tree: string | null;
    dumbbell: string | null;
    accent: string | null;
  };
  canSpinToday: boolean;
  wheelStreak: number;
};

/**
 * Leaf economy. The canonical balance is UserProgress.leaves (already credited
 * by workout completion + achievement rewards). This service adds the spend
 * side (shop) and the daily wheel, all server-authoritative.
 */
@Injectable()
export class EconomyService {
  constructor(private readonly prisma: PrismaService) {}

  private progress(userId: string) {
    return this.prisma.userProgress.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  async getWallet(userId: string): Promise<Wallet> {
    const p = await this.progress(userId);
    const owned = await this.prisma.ownedShopItem.findMany({
      where: { userId },
      select: { itemId: true, equipped: true },
    });
    const equipped = {
      tree: null,
      dumbbell: null,
      accent: null,
    } as Wallet['equipped'];
    for (const o of owned) {
      if (
        o.equipped === 'tree' ||
        o.equipped === 'dumbbell' ||
        o.equipped === 'accent'
      ) {
        equipped[o.equipped] = o.itemId;
      }
    }
    return {
      leaves: p.leaves,
      owned,
      equipped,
      canSpinToday: p.lastWheelDate !== isoDay(),
      wheelStreak: p.wheelStreak,
    };
  }

  /** Server-authoritative daily wheel spin. */
  async spinWheel(userId: string) {
    const p = await this.progress(userId);
    const today = isoDay();
    if (p.lastWheelDate === today) {
      throw new BadRequestException('Already spun today');
    }

    const nextStreak =
      p.lastWheelDate === yesterdayIso() ? p.wheelStreak + 1 : 1;
    const sectorIndex = rollWheel();
    const value = WHEEL_SECTORS[sectorIndex].value;
    const multiplier = wheelMultiplier(nextStreak);
    const total = Math.round(value * multiplier);
    const balanceAfter = p.leaves + total;

    await this.prisma.$transaction([
      this.prisma.userProgress.update({
        where: { userId },
        data: {
          leaves: balanceAfter,
          lastWheelDate: today,
          wheelStreak: nextStreak,
        },
      }),
      this.prisma.leafTransaction.create({
        data: { userId, delta: total, reason: 'wheel', balanceAfter },
      }),
    ]);

    return {
      value,
      multiplier,
      total,
      sectorIndex,
      leaves: balanceAfter,
      wheelStreak: nextStreak,
    };
  }

  async buy(userId: string, itemId: string): Promise<Wallet> {
    const def = shopItem(itemId);
    if (!def) throw new BadRequestException('Unknown item');

    const p = await this.progress(userId);
    const already = await this.prisma.ownedShopItem.findUnique({
      where: { userId_itemId: { userId, itemId } },
    });
    if (already) throw new BadRequestException('Already owned');
    if (p.leaves < def.price)
      throw new BadRequestException('Not enough leaves');

    const balanceAfter = p.leaves - def.price;
    await this.prisma.$transaction([
      this.prisma.userProgress.update({
        where: { userId },
        data: { leaves: balanceAfter },
      }),
      this.prisma.ownedShopItem.create({ data: { userId, itemId } }),
      this.prisma.leafTransaction.create({
        data: {
          userId,
          delta: -def.price,
          reason: `shop:${itemId}`,
          balanceAfter,
        },
      }),
    ]);
    return this.getWallet(userId);
  }

  async equip(userId: string, itemId: string): Promise<Wallet> {
    const def = shopItem(itemId);
    if (!def) throw new BadRequestException('Unknown item');
    const owned = await this.prisma.ownedShopItem.findUnique({
      where: { userId_itemId: { userId, itemId } },
    });
    if (!owned) throw new BadRequestException('Item not owned');

    await this.prisma.$transaction([
      this.prisma.ownedShopItem.updateMany({
        where: { userId, equipped: def.category },
        data: { equipped: null },
      }),
      this.prisma.ownedShopItem.update({
        where: { userId_itemId: { userId, itemId } },
        data: { equipped: def.category },
      }),
    ]);
    return this.getWallet(userId);
  }

  async unequip(userId: string, itemId: string): Promise<Wallet> {
    await this.prisma.ownedShopItem.updateMany({
      where: { userId, itemId },
      data: { equipped: null },
    });
    return this.getWallet(userId);
  }

  /** Public shop catalog (ids/prices) — display metadata lives on the client. */
  catalog() {
    return SHOP_ITEMS;
  }
}
