"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.EconomyService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const economy_constants_1 = require("./economy.constants");
let EconomyService = class EconomyService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    progress(userId) {
        return this.prisma.userProgress.upsert({
            where: { userId },
            update: {},
            create: { userId },
        });
    }
    async getWallet(userId) {
        const p = await this.progress(userId);
        const owned = await this.prisma.ownedShopItem.findMany({
            where: { userId },
            select: { itemId: true, equipped: true },
        });
        const equipped = {
            tree: null,
            dumbbell: null,
            accent: null,
        };
        for (const o of owned) {
            if (o.equipped === 'tree' ||
                o.equipped === 'dumbbell' ||
                o.equipped === 'accent') {
                equipped[o.equipped] = o.itemId;
            }
        }
        return {
            leaves: p.leaves,
            owned,
            equipped,
            canSpinToday: p.lastWheelDate !== (0, economy_constants_1.isoDay)(),
            wheelStreak: p.wheelStreak,
        };
    }
    async spinWheel(userId) {
        const p = await this.progress(userId);
        const today = (0, economy_constants_1.isoDay)();
        if (p.lastWheelDate === today) {
            throw new common_1.BadRequestException('Already spun today');
        }
        const nextStreak = p.lastWheelDate === (0, economy_constants_1.yesterdayIso)() ? p.wheelStreak + 1 : 1;
        const sectorIndex = (0, economy_constants_1.rollWheel)();
        const value = economy_constants_1.WHEEL_SECTORS[sectorIndex].value;
        const multiplier = (0, economy_constants_1.wheelMultiplier)(nextStreak);
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
    async buy(userId, itemId) {
        const def = (0, economy_constants_1.shopItem)(itemId);
        if (!def)
            throw new common_1.BadRequestException('Unknown item');
        const p = await this.progress(userId);
        const already = await this.prisma.ownedShopItem.findUnique({
            where: { userId_itemId: { userId, itemId } },
        });
        if (already)
            throw new common_1.BadRequestException('Already owned');
        if (p.leaves < def.price)
            throw new common_1.BadRequestException('Not enough leaves');
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
    async equip(userId, itemId) {
        const def = (0, economy_constants_1.shopItem)(itemId);
        if (!def)
            throw new common_1.BadRequestException('Unknown item');
        const owned = await this.prisma.ownedShopItem.findUnique({
            where: { userId_itemId: { userId, itemId } },
        });
        if (!owned)
            throw new common_1.BadRequestException('Item not owned');
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
    async unequip(userId, itemId) {
        await this.prisma.ownedShopItem.updateMany({
            where: { userId, itemId },
            data: { equipped: null },
        });
        return this.getWallet(userId);
    }
    catalog() {
        return economy_constants_1.SHOP_ITEMS;
    }
};
exports.EconomyService = EconomyService;
exports.EconomyService = EconomyService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EconomyService);
//# sourceMappingURL=economy.service.js.map