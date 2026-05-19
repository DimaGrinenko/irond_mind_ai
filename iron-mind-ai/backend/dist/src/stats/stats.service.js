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
exports.StatsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const MUSCLE_MAP = {
    CHEST: 'chest',
    BACK: 'back',
    LEGS: 'legs',
    GLUTES: 'legs',
    CALVES: 'legs',
    SHOULDERS: 'shoulders',
    BICEPS: 'arms',
    TRICEPS: 'arms',
    FOREARMS: 'arms',
    CORE: 'core',
    FULL_BODY: 'other',
    OTHER: 'other',
};
let StatsService = class StatsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async userDashboard(userId, days = 7) {
        const safeDays = Math.min(Math.max(days, 1), 90);
        const since = new Date();
        since.setHours(0, 0, 0, 0);
        since.setDate(since.getDate() - (safeDays - 1));
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { currentProgramId: true },
        });
        const [workouts, nutrition, measurements, totalWorkoutsCount, allTimeSets] = await Promise.all([
            this.prisma.workout.findMany({
                where: { userId, date: { gte: since }, status: client_1.WorkoutStatus.COMPLETED },
                include: { sets: { include: { exercise: { select: { primary: true } } } } },
                orderBy: { date: 'asc' },
            }),
            this.prisma.nutritionEntry.findMany({
                where: { userId, date: { gte: since } },
                orderBy: { date: 'asc' },
            }),
            this.prisma.measurement.findMany({
                where: { userId },
                orderBy: { date: 'desc' },
                take: 2,
            }),
            this.prisma.workout.count({
                where: { userId, status: client_1.WorkoutStatus.COMPLETED },
            }),
            this.prisma.exerciseSet.findMany({
                where: { workout: { userId, status: client_1.WorkoutStatus.COMPLETED } },
                select: { weight: true, reps: true },
            }),
        ]);
        const allTimeVolumeKg = allTimeSets.reduce((s, set) => s + (set.weight ?? 0) * (set.reps ?? 0), 0);
        let programProgress = null;
        if (user?.currentProgramId) {
            const prog = await this.prisma.program.findUnique({
                where: { id: user.currentProgramId },
                select: { id: true, title: true, weeks: true, daysPerWeek: true },
            });
            if (prog) {
                const [total, done] = await Promise.all([
                    this.prisma.scheduledWorkout.count({
                        where: { userId, programId: prog.id },
                    }),
                    this.prisma.scheduledWorkout.count({
                        where: { userId, programId: prog.id, status: 'DONE' },
                    }),
                ]);
                const progress = total > 0 ? Math.min(1, done / total) : 0;
                const treeStage = progress >= 1
                    ? 5
                    : progress >= 0.7
                        ? 5
                        : progress >= 0.4
                            ? 4
                            : progress >= 0.2
                                ? 3
                                : progress > 0
                                    ? 2
                                    : 1;
                programProgress = {
                    id: prog.id,
                    title: prog.title,
                    weeks: prog.weeks,
                    daysPerWeek: prog.daysPerWeek,
                    scheduledTotal: total,
                    scheduledDone: done,
                    scheduledRemaining: total - done,
                    progress,
                    treeStage,
                };
            }
        }
        let volumeKg = 0;
        let totalSets = 0;
        let completedSets = 0;
        const muscleVolumeAbs = {
            chest: 0, back: 0, legs: 0, shoulders: 0, arms: 0, core: 0, other: 0,
        };
        for (const w of workouts) {
            for (const s of w.sets) {
                totalSets += 1;
                if (s.completed)
                    completedSets += 1;
                const v = (s.weight ?? 0) * (s.reps ?? 0);
                volumeKg += v;
                const key = MUSCLE_MAP[s.exercise.primary] ?? 'other';
                muscleVolumeAbs[key] += v;
            }
        }
        const caloriesBurned = workouts.reduce((s, w) => s + (w.calories ?? 0), 0);
        const nutritionCalories = nutrition.reduce((s, n) => s + n.calories, 0);
        const byDay = new Map();
        for (let i = 0; i < safeDays; i++) {
            const d = new Date(since);
            d.setDate(since.getDate() + i);
            byDay.set(toIso(d), { workouts: 0, volume: 0, calories: 0, nutritionCalories: 0 });
        }
        for (const w of workouts) {
            const key = toIso(w.date);
            const row = byDay.get(key);
            if (!row)
                continue;
            row.workouts += 1;
            row.volume += w.sets.reduce((s, set) => s + (set.weight ?? 0) * (set.reps ?? 0), 0);
            row.calories += w.calories ?? 0;
        }
        for (const n of nutrition) {
            const key = toIso(n.date);
            const row = byDay.get(key);
            if (row)
                row.nutritionCalories += n.calories;
        }
        const chart = Array.from(byDay.entries()).map(([date, v]) => ({ date, ...v }));
        const visibleMuscles = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'];
        const maxMuscle = Math.max(1, ...visibleMuscles.map((k) => muscleVolumeAbs[k]));
        const muscleLoad = {
            chest: muscleVolumeAbs.chest / maxMuscle,
            back: muscleVolumeAbs.back / maxMuscle,
            legs: muscleVolumeAbs.legs / maxMuscle,
            shoulders: muscleVolumeAbs.shoulders / maxMuscle,
            arms: muscleVolumeAbs.arms / maxMuscle,
            core: muscleVolumeAbs.core / maxMuscle,
            other: muscleVolumeAbs.other / maxMuscle,
        };
        const weightDelta = measurements.length >= 2 && measurements[0].weight && measurements[1].weight
            ? +(measurements[0].weight - measurements[1].weight).toFixed(1)
            : null;
        const lastWeight = measurements[0]?.weight ?? null;
        return {
            periodDays: safeDays,
            workoutsCount: workouts.length,
            totalWorkoutsAllTime: totalWorkoutsCount,
            totalVolumeKgAllTime: Math.round(allTimeVolumeKg),
            totalSets,
            completedSets,
            volumeKg: Math.round(volumeKg),
            caloriesBurned,
            nutritionCalories,
            avgNutritionCalories: nutrition.length
                ? Math.round(nutritionCalories / safeDays)
                : 0,
            weightDelta,
            lastWeight,
            muscleLoad,
            muscleVolume: muscleVolumeAbs,
            chart,
            program: programProgress,
        };
    }
    async platformOverview() {
        const [users, coaches, workouts, nutritionEntries] = await Promise.all([
            this.prisma.user.count(),
            this.prisma.user.count({ where: { role: 'COACH' } }),
            this.prisma.workout.count({ where: { status: client_1.WorkoutStatus.COMPLETED } }),
            this.prisma.nutritionEntry.count(),
        ]);
        return { users, coaches, workoutsCompleted: workouts, nutritionEntries };
    }
};
exports.StatsService = StatsService;
exports.StatsService = StatsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], StatsService);
function toIso(d) {
    return d.toISOString().slice(0, 10);
}
//# sourceMappingURL=stats.service.js.map