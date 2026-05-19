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
exports.AchievementsService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const XP_PER_LEVEL = 1000;
let AchievementsService = class AchievementsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    async getProgress(userId) {
        let progress = await this.prisma.userProgress.findUnique({ where: { userId } });
        if (!progress) {
            progress = await this.prisma.userProgress.create({
                data: { userId },
            });
        }
        return {
            treeLevel: progress.treeLevel,
            currentXp: progress.currentXp,
            xpToNext: XP_PER_LEVEL,
            totalXp: progress.totalXp,
            leaves: progress.leaves,
            streakDays: progress.streakDays,
            longestStreak: progress.longestStreak,
            monthlyGoal: progress.monthlyGoal,
            monthlyDone: progress.monthlyDone,
            lastWorkoutAt: progress.lastWorkoutAt,
            todayCompleted: this.isSameDay(progress.lastWorkoutAt, new Date()),
        };
    }
    async getTree(userId) {
        const [achievements, userAchievements] = await Promise.all([
            this.prisma.achievement.findMany({ orderBy: { sortOrder: 'asc' } }),
            this.prisma.userAchievement.findMany({ where: { userId } }),
        ]);
        const byId = new Map(userAchievements.map((ua) => [ua.achievementId, ua]));
        return achievements.map((a) => {
            const ua = byId.get(a.id);
            return {
                id: a.id,
                title: a.title,
                description: a.description,
                category: a.category,
                iconName: a.iconName,
                positionX: a.positionX,
                positionY: a.positionY,
                xpReward: a.xpReward,
                leavesReward: a.leavesReward,
                targetValue: a.targetValue,
                targetUnit: a.targetUnit,
                status: ua?.status ?? client_1.AchievementStatus.LOCKED,
                progress: ua?.progress ?? 0,
                currentValue: ua?.currentValue ?? 0,
                unlockedAt: ua?.unlockedAt ?? null,
            };
        });
    }
    async getHistory(userId, limit = 12) {
        const events = await this.prisma.activityEvent.findMany({
            where: { userId },
            orderBy: { occurredAt: 'desc' },
            take: limit,
        });
        return events.map((e) => ({
            id: e.id,
            kind: e.kind,
            title: e.title,
            detail: e.detail,
            xp: e.xp,
            occurredAt: e.occurredAt,
        }));
    }
    async recordWorkoutCompletion(userId, workoutTitle) {
        const progress = await this.prisma.userProgress.upsert({
            where: { userId },
            update: {},
            create: { userId },
        });
        const now = new Date();
        const lastWorkoutAt = progress.lastWorkoutAt;
        let streakDays = progress.streakDays;
        if (!lastWorkoutAt) {
            streakDays = 1;
        }
        else if (this.isSameDay(lastWorkoutAt, now)) {
        }
        else if (this.isYesterday(lastWorkoutAt, now)) {
            streakDays = streakDays + 1;
        }
        else {
            streakDays = 1;
        }
        const longestStreak = Math.max(streakDays, progress.longestStreak);
        const monthAnchor = progress.monthAnchor;
        const sameMonth = monthAnchor.getMonth() === now.getMonth() && monthAnchor.getFullYear() === now.getFullYear();
        const monthlyDone = sameMonth ? progress.monthlyDone + 1 : 1;
        const nextMonthAnchor = sameMonth ? monthAnchor : now;
        const xpGain = 10 + Math.min(streakDays - 1, 10);
        const leavesGain = 5;
        const newCurrentXp = progress.currentXp + xpGain;
        const levelUps = Math.floor(newCurrentXp / XP_PER_LEVEL);
        const finalCurrentXp = newCurrentXp - levelUps * XP_PER_LEVEL;
        const finalLevel = progress.treeLevel + levelUps;
        const finalTotalXp = progress.totalXp + xpGain;
        await this.prisma.userProgress.update({
            where: { userId },
            data: {
                treeLevel: finalLevel,
                currentXp: finalCurrentXp,
                totalXp: finalTotalXp,
                leaves: progress.leaves + leavesGain,
                streakDays,
                longestStreak,
                lastWorkoutAt: now,
                monthlyDone,
                monthAnchor: nextMonthAnchor,
            },
        });
        await this.prisma.activityEvent.create({
            data: {
                userId,
                kind: client_1.ActivityEventKind.WORKOUT_COMPLETED,
                title: workoutTitle ?? 'Тренировка завершена',
                xp: xpGain,
            },
        });
        const [totalWorkoutsAllTime, allTimeSets] = await Promise.all([
            this.prisma.workout.count({ where: { userId, status: 'COMPLETED' } }),
            this.prisma.exerciseSet.findMany({
                where: { workout: { userId, status: 'COMPLETED' } },
                select: { weight: true, reps: true },
            }),
        ]);
        const totalVolumeKg = allTimeSets.reduce((s, set) => s + (set.weight ?? 0) * (set.reps ?? 0), 0);
        await this.checkAchievements(userId, {
            workoutsTotal: totalWorkoutsAllTime,
            streakDays,
            longestStreak,
            totalVolumeKg,
        });
    }
    async checkAchievements(userId, ctx) {
        const vol = Math.round(ctx.totalVolumeKg);
        const updates = [
            { id: 'first_workout', currentValue: ctx.workoutsTotal, targetValue: 1, reward: { xp: 30, leaves: 50 } },
            { id: 'workouts_5', currentValue: ctx.workoutsTotal, targetValue: 5, reward: { xp: 40, leaves: 20 } },
            { id: 'workouts_10', currentValue: ctx.workoutsTotal, targetValue: 10, reward: { xp: 60, leaves: 30 } },
            { id: 'workouts_25', currentValue: ctx.workoutsTotal, targetValue: 25, reward: { xp: 100, leaves: 60 } },
            { id: 'workouts_50', currentValue: ctx.workoutsTotal, targetValue: 50, reward: { xp: 200, leaves: 120 } },
            { id: 'workouts_100', currentValue: ctx.workoutsTotal, targetValue: 100, reward: { xp: 500, leaves: 300 } },
            { id: 'streak_3', currentValue: ctx.longestStreak, targetValue: 3, reward: { xp: 25, leaves: 15 } },
            { id: 'streak_7', currentValue: ctx.longestStreak, targetValue: 7, reward: { xp: 60, leaves: 30 } },
            { id: 'streak_14', currentValue: ctx.longestStreak, targetValue: 14, reward: { xp: 120, leaves: 60 } },
            { id: 'streak_30', currentValue: ctx.longestStreak, targetValue: 30, reward: { xp: 300, leaves: 180 } },
            { id: 'volume_1k', currentValue: vol, targetValue: 1000, reward: { xp: 40, leaves: 20 } },
            { id: 'volume_5k', currentValue: vol, targetValue: 5000, reward: { xp: 80, leaves: 40 } },
            { id: 'volume_25k', currentValue: vol, targetValue: 25000, reward: { xp: 150, leaves: 80 } },
            { id: 'volume_100k', currentValue: vol, targetValue: 100000, reward: { xp: 400, leaves: 200 } },
        ];
        for (const u of updates) {
            const existing = await this.prisma.userAchievement.findUnique({
                where: { userId_achievementId: { userId, achievementId: u.id } },
            });
            if (existing && existing.status === client_1.AchievementStatus.UNLOCKED)
                continue;
            const isUnlocked = u.currentValue >= u.targetValue;
            const isInProgress = u.currentValue > 0;
            const data = {
                userId,
                achievementId: u.id,
                currentValue: u.currentValue,
                progress: Math.min(1, u.currentValue / u.targetValue),
                status: isUnlocked
                    ? client_1.AchievementStatus.UNLOCKED
                    : isInProgress
                        ? client_1.AchievementStatus.IN_PROGRESS
                        : client_1.AchievementStatus.LOCKED,
                unlockedAt: isUnlocked ? new Date() : null,
            };
            await this.prisma.userAchievement.upsert({
                where: { userId_achievementId: { userId, achievementId: u.id } },
                update: {
                    currentValue: data.currentValue,
                    progress: data.progress,
                    status: data.status,
                    unlockedAt: data.unlockedAt,
                },
                create: data,
            });
            if (isUnlocked) {
                await this.prisma.userProgress.update({
                    where: { userId },
                    data: {
                        totalXp: { increment: u.reward.xp },
                        currentXp: { increment: u.reward.xp },
                        leaves: { increment: u.reward.leaves },
                    },
                });
                await this.prisma.activityEvent.create({
                    data: {
                        userId,
                        kind: client_1.ActivityEventKind.ACHIEVEMENT_UNLOCKED,
                        title: `Достижение: ${u.id}`,
                        xp: u.reward.xp,
                    },
                });
            }
        }
    }
    isSameDay(a, b) {
        if (!a)
            return false;
        return a.getFullYear() === b.getFullYear() && a.getMonth() === b.getMonth() && a.getDate() === b.getDate();
    }
    isYesterday(a, b) {
        const yesterday = new Date(b);
        yesterday.setDate(b.getDate() - 1);
        return this.isSameDay(a, yesterday);
    }
};
exports.AchievementsService = AchievementsService;
exports.AchievementsService = AchievementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], AchievementsService);
//# sourceMappingURL=achievements.service.js.map