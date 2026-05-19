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
exports.WorkoutsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const achievements_service_1 = require("../achievements/achievements.service");
let WorkoutsService = class WorkoutsService {
    prisma;
    achievements;
    constructor(prisma, achievements) {
        this.prisma = prisma;
        this.achievements = achievements;
    }
    list(userId, limit = 50) {
        return this.prisma.workout.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: Math.min(limit, 200),
            include: { sets: true },
        });
    }
    create(userId, dto) {
        return this.prisma.workout.create({
            data: {
                userId,
                date: dto.date ? new Date(dto.date) : new Date(),
                programId: dto.programId,
                name: dto.name,
                durationSeconds: dto.durationSeconds,
                calories: dto.calories,
            },
        });
    }
    async byId(userId, id) {
        const w = await this.prisma.workout.findUnique({ where: { id }, include: { sets: true } });
        if (!w)
            throw new common_1.NotFoundException();
        if (w.userId !== userId)
            throw new common_1.ForbiddenException();
        return w;
    }
    async finish(userId, id) {
        const workout = await this.byId(userId, id);
        const updated = await this.prisma.workout.update({
            where: { id },
            data: { status: client_1.WorkoutStatus.COMPLETED },
        });
        await this.achievements.recordWorkoutCompletion(userId, workout.name ?? undefined);
        return updated;
    }
    async upsertSet(userId, workoutId, dto) {
        await this.byId(userId, workoutId);
        const exerciseId = await this.resolveExerciseId(dto);
        const existing = await this.prisma.exerciseSet.findFirst({
            where: { workoutId, exerciseId, setNumber: dto.setNumber },
        });
        if (existing) {
            return this.prisma.exerciseSet.update({
                where: { id: existing.id },
                data: {
                    weight: dto.weight,
                    reps: dto.reps,
                    rpeLevel: dto.rpeLevel,
                    completed: dto.completed ?? existing.completed,
                },
            });
        }
        return this.prisma.exerciseSet.create({
            data: {
                workoutId,
                exerciseId,
                setNumber: dto.setNumber,
                weight: dto.weight,
                reps: dto.reps,
                rpeLevel: dto.rpeLevel,
                completed: dto.completed ?? false,
            },
        });
    }
    async exerciseHistory(userId, slug) {
        const exercise = await this.prisma.exercise.findUnique({ where: { slug }, select: { id: true } });
        if (!exercise) {
            return { lastSet: null, maxWeight: null, maxReps: null, maxVolume: null, lastWorkoutDate: null };
        }
        const sets = await this.prisma.exerciseSet.findMany({
            where: {
                exerciseId: exercise.id,
                workout: { userId },
                completed: true,
            },
            include: { workout: { select: { date: true } } },
            orderBy: [{ workout: { date: 'desc' } }, { setNumber: 'desc' }],
            take: 100,
        });
        if (sets.length === 0) {
            return { lastSet: null, maxWeight: null, maxReps: null, maxVolume: null, lastWorkoutDate: null };
        }
        const lastSet = sets[0];
        const lastDate = lastSet.workout.date.toISOString().slice(0, 10);
        const lastWorkoutSets = sets.filter((s) => s.workout.date.toISOString().slice(0, 10) === lastDate);
        let maxWeight = 0;
        let maxReps = 0;
        let maxVolume = 0;
        for (const s of sets) {
            const w = s.weight ?? 0;
            const r = s.reps ?? 0;
            if (w > maxWeight)
                maxWeight = w;
            if (r > maxReps)
                maxReps = r;
            if (w * r > maxVolume)
                maxVolume = w * r;
        }
        return {
            lastSet: {
                weight: lastSet.weight,
                reps: lastSet.reps,
                date: lastSet.workout.date.toISOString(),
            },
            lastWorkoutSets: lastWorkoutSets.map((s) => ({
                setNumber: s.setNumber,
                weight: s.weight,
                reps: s.reps,
            })),
            maxWeight: maxWeight || null,
            maxReps: maxReps || null,
            maxVolume: maxVolume || null,
            lastWorkoutDate: lastSet.workout.date.toISOString(),
        };
    }
    async exercise1rmSeries(userId, slug) {
        const exercise = await this.prisma.exercise.findUnique({ where: { slug }, select: { id: true } });
        if (!exercise)
            return [];
        const sets = await this.prisma.exerciseSet.findMany({
            where: {
                exerciseId: exercise.id,
                workout: { userId },
                completed: true,
                weight: { gt: 0 },
                reps: { gt: 0 },
            },
            include: { workout: { select: { date: true } } },
            orderBy: { workout: { date: 'asc' } },
            take: 2000,
        });
        const byDate = new Map();
        for (const s of sets) {
            const w = s.weight ?? 0;
            const r = s.reps ?? 0;
            if (w <= 0 || r <= 0 || r >= 37)
                continue;
            const oneRm = (w * 36) / (37 - r);
            const date = s.workout.date.toISOString().slice(0, 10);
            const prev = byDate.get(date) ?? 0;
            if (oneRm > prev)
                byDate.set(date, oneRm);
        }
        return Array.from(byDate.entries())
            .sort(([a], [b]) => a.localeCompare(b))
            .map(([date, max1rm]) => ({ date, max1rm: Math.round(max1rm * 10) / 10 }));
    }
    async resolveExerciseId(dto) {
        if (dto.exerciseId)
            return dto.exerciseId;
        if (!dto.exerciseSlug) {
            throw new common_1.BadRequestException('Передай exerciseId или exerciseSlug');
        }
        const ex = await this.prisma.exercise.findUnique({
            where: { slug: dto.exerciseSlug },
            select: { id: true },
        });
        if (ex)
            return ex.id;
        const created = await this.prisma.exercise.create({
            data: {
                slug: dto.exerciseSlug,
                name: dto.exerciseSlug.replace(/_/g, ' '),
                primary: 'OTHER',
                category: 'OTHER',
            },
            select: { id: true },
        });
        return created.id;
    }
};
exports.WorkoutsService = WorkoutsService;
exports.WorkoutsService = WorkoutsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        achievements_service_1.AchievementsService])
], WorkoutsService);
//# sourceMappingURL=workouts.service.js.map