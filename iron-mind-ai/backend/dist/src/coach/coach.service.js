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
exports.CoachService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const stats_service_1 = require("../stats/stats.service");
let CoachService = class CoachService {
    prisma;
    stats;
    constructor(prisma, stats) {
        this.prisma = prisma;
        this.stats = stats;
    }
    async listClients(coachId) {
        const rows = await this.prisma.coachAssignment.findMany({
            where: { coachId },
            include: {
                client: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                        goal: true,
                        weightKg: true,
                        currentProgramId: true,
                        programWeek: true,
                        onboardingCompleted: true,
                    },
                },
            },
            orderBy: { createdAt: 'desc' },
        });
        return rows.map((r) => ({ ...r.client, assignmentNotes: r.notes, assignedAt: r.createdAt }));
    }
    async clientDetail(coachId, clientId) {
        await this.assertCoachOfClient(coachId, clientId);
        const [user, stats, recentWorkouts, recentNutrition] = await Promise.all([
            this.prisma.user.findUnique({
                where: { id: clientId },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    goal: true,
                    weightKg: true,
                    heightCm: true,
                    age: true,
                    currentProgramId: true,
                    programWeek: true,
                    dailyCaloriesGoal: true,
                    dailyProteinGoal: true,
                },
            }),
            this.stats.userDashboard(clientId, 14),
            this.prisma.workout.findMany({
                where: { userId: clientId, status: client_1.WorkoutStatus.COMPLETED },
                orderBy: { date: 'desc' },
                take: 10,
                include: { sets: { include: { exercise: { select: { name: true } } } } },
            }),
            this.prisma.nutritionEntry.findMany({
                where: { userId: clientId },
                orderBy: { date: 'desc' },
                take: 20,
            }),
        ]);
        if (!user)
            throw new common_1.NotFoundException();
        return { user, stats, recentWorkouts, recentNutrition };
    }
    async addNote(coachId, clientId, notes) {
        await this.assertCoachOfClient(coachId, clientId);
        return this.prisma.coachAssignment.update({
            where: { clientId },
            data: { notes },
        });
    }
    async assertCoachOfClient(coachId, clientId) {
        const row = await this.prisma.coachAssignment.findFirst({ where: { coachId, clientId } });
        if (!row)
            throw new common_1.ForbiddenException('Клиент не закреплён за вами');
    }
};
exports.CoachService = CoachService;
exports.CoachService = CoachService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService,
        stats_service_1.StatsService])
], CoachService);
//# sourceMappingURL=coach.service.js.map