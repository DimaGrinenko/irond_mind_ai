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
exports.ScheduleService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const achievements_service_1 = require("../achievements/achievements.service");
let ScheduleService = class ScheduleService {
    prisma;
    achievements;
    constructor(prisma, achievements) {
        this.prisma = prisma;
        this.achievements = achievements;
    }
    list(userId, from, to) {
        return this.prisma.scheduledWorkout.findMany({
            where: {
                userId,
                ...(from || to
                    ? {
                        date: {
                            ...(from ? { gte: new Date(from) } : {}),
                            ...(to ? { lte: new Date(to) } : {}),
                        },
                    }
                    : {}),
            },
            orderBy: { date: 'asc' },
        });
    }
    async create(userId, dto) {
        const dates = this.expandDates(dto);
        if (dates.length === 1) {
            return this.prisma.scheduledWorkout.create({
                data: {
                    userId,
                    date: dates[0],
                    time: dto.time,
                    title: dto.title,
                    programId: dto.programId,
                    notes: dto.notes,
                },
            });
        }
        await this.prisma.scheduledWorkout.createMany({
            data: dates.map((d) => ({
                userId,
                date: d,
                time: dto.time,
                title: dto.title,
                programId: dto.programId,
                notes: dto.notes,
            })),
        });
        return this.prisma.scheduledWorkout.findMany({
            where: {
                userId,
                date: { gte: dates[0], lte: dates[dates.length - 1] },
                title: dto.title,
            },
            orderBy: { date: 'asc' },
        });
    }
    async complete(userId, id) {
        const item = await this.ensureOwn(userId, id);
        const updated = await this.prisma.scheduledWorkout.update({
            where: { id },
            data: { status: client_1.ScheduledWorkoutStatus.DONE, completedAt: new Date() },
        });
        const workout = await this.prisma.workout.create({
            data: {
                userId,
                date: item.date,
                name: item.title,
                programId: item.programId,
                status: 'COMPLETED',
            },
        });
        await this.prisma.scheduledWorkout.update({
            where: { id },
            data: { workoutId: workout.id },
        });
        await this.achievements.recordWorkoutCompletion(userId, item.title);
        return updated;
    }
    async skip(userId, id) {
        await this.ensureOwn(userId, id);
        return this.prisma.scheduledWorkout.update({
            where: { id },
            data: { status: client_1.ScheduledWorkoutStatus.SKIPPED },
        });
    }
    async remove(userId, id) {
        await this.ensureOwn(userId, id);
        await this.prisma.scheduledWorkout.delete({ where: { id } });
        return { ok: true };
    }
    async ensureOwn(userId, id) {
        const item = await this.prisma.scheduledWorkout.findUnique({ where: { id } });
        if (!item)
            throw new common_1.NotFoundException();
        if (item.userId !== userId)
            throw new common_1.ForbiddenException();
        return item;
    }
    expandDates(dto) {
        const start = new Date(dto.date);
        start.setHours(0, 0, 0, 0);
        if (!dto.repeatWeekdays || dto.repeatWeekdays.length === 0) {
            return [start];
        }
        const weeks = dto.repeatWeeks ?? 4;
        const result = [];
        const startMonday = new Date(start);
        const startWeekday = (start.getDay() + 6) % 7;
        startMonday.setDate(start.getDate() - startWeekday);
        for (let w = 0; w < weeks; w++) {
            for (const wd of dto.repeatWeekdays) {
                const d = new Date(startMonday);
                d.setDate(startMonday.getDate() + w * 7 + wd);
                if (d.getTime() >= start.getTime())
                    result.push(d);
            }
        }
        return result.sort((a, b) => a.getTime() - b.getTime());
    }
};
exports.ScheduleService = ScheduleService;
exports.ScheduleService = ScheduleService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        achievements_service_1.AchievementsService])
], ScheduleService);
//# sourceMappingURL=schedule.service.js.map