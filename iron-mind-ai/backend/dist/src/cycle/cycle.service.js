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
exports.CycleService = void 0;
exports.dayOfCycle = dayOfCycle;
exports.phaseForDay = phaseForDay;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const MS_PER_DAY = 1000 * 60 * 60 * 24;
function dayOfCycle(lastPeriodStart, cycleLength, now = new Date()) {
    if (!lastPeriodStart)
        return null;
    const start = new Date(lastPeriodStart + 'T00:00:00');
    if (Number.isNaN(start.getTime()))
        return null;
    const days = Math.floor((now.getTime() - start.getTime()) / MS_PER_DAY);
    if (days < 0)
        return null;
    return (days % cycleLength) + 1;
}
function phaseForDay(day, cycleLength = 28) {
    if (day == null)
        return null;
    const ovulationDay = Math.round(cycleLength / 2);
    if (day <= 5)
        return 'menstrual';
    if (day < ovulationDay - 1)
        return 'follicular';
    if (day <= ovulationDay + 1)
        return 'ovulation';
    return 'luteal';
}
let CycleService = class CycleService {
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
    async get(userId) {
        const p = await this.progress(userId);
        const day = dayOfCycle(p.cycleLastPeriod, p.cycleLength);
        return {
            enabled: p.cycleEnabled,
            lastPeriodStart: p.cycleLastPeriod,
            cycleLength: p.cycleLength,
            dayOfCycle: p.cycleEnabled ? day : null,
            phase: p.cycleEnabled ? phaseForDay(day, p.cycleLength) : null,
        };
    }
    async update(userId, dto) {
        await this.progress(userId);
        await this.prisma.userProgress.update({
            where: { userId },
            data: {
                ...(dto.enabled !== undefined ? { cycleEnabled: dto.enabled } : {}),
                ...(dto.lastPeriodStart !== undefined
                    ? { cycleLastPeriod: dto.lastPeriodStart }
                    : {}),
                ...(dto.cycleLength !== undefined
                    ? { cycleLength: dto.cycleLength }
                    : {}),
            },
        });
        return this.get(userId);
    }
};
exports.CycleService = CycleService;
exports.CycleService = CycleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], CycleService);
//# sourceMappingURL=cycle.service.js.map