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
exports.OnboardingService = void 0;
const common_1 = require("@nestjs/common");
const client_1 = require("@prisma/client");
const prisma_service_1 = require("../prisma/prisma.service");
const ACTIVITY_MULTIPLIER = {
    SEDENTARY: 1.2,
    LIGHT: 1.375,
    MODERATE: 1.55,
    ACTIVE: 1.725,
    VERY_ACTIVE: 1.9,
};
const GOAL_TO_PROGRAM = {
    MASS: 'mass',
    CUT: 'relief',
    STRENGTH: 'strength',
    ENDURANCE: 'endurance',
    ABS: 'abs',
};
const GOAL_LABEL = {
    MASS: 'Набор массы',
    CUT: 'Сушка',
    STRENGTH: 'Сила',
    ENDURANCE: 'Выносливость',
    ABS: 'Пресс',
};
let OnboardingService = class OnboardingService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    calculateBmr(gender, weightKg, heightCm, age) {
        const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
        if (gender === 'MALE')
            return Math.round(base + 5);
        if (gender === 'FEMALE')
            return Math.round(base - 161);
        return Math.round(base - 78);
    }
    buildPlan(input) {
        const bmr = this.calculateBmr(input.gender, input.weightKg, input.heightCm, input.age);
        const tdee = Math.round(bmr * ACTIVITY_MULTIPLIER[input.activityLevel]);
        let dailyCalories = tdee;
        let surplusOrDeficit = 0;
        switch (input.goalKey) {
            case 'MASS':
                surplusOrDeficit = Math.round(tdee * 0.1);
                dailyCalories = tdee + surplusOrDeficit;
                break;
            case 'CUT':
                surplusOrDeficit = -Math.round(tdee * 0.2);
                dailyCalories = tdee + surplusOrDeficit;
                break;
            case 'STRENGTH':
                surplusOrDeficit = Math.round(tdee * 0.05);
                dailyCalories = tdee + surplusOrDeficit;
                break;
            case 'ENDURANCE':
                dailyCalories = tdee;
                break;
            case 'ABS':
                surplusOrDeficit = -Math.round(tdee * 0.1);
                dailyCalories = tdee + surplusOrDeficit;
                break;
        }
        const proteinPerKg = input.goalKey === 'CUT' || input.goalKey === 'ABS' ? 2.2 : 1.8;
        const proteinG = Math.round(input.weightKg * proteinPerKg);
        const fatsG = Math.round(input.weightKg * 0.9);
        const proteinKcal = proteinG * 4;
        const fatsKcal = fatsG * 9;
        const carbsKcal = Math.max(0, dailyCalories - proteinKcal - fatsKcal);
        const carbsG = Math.round(carbsKcal / 4);
        return {
            bmr,
            tdee,
            dailyCalories,
            proteinG,
            fatsG,
            carbsG,
            surplusOrDeficit,
            programId: GOAL_TO_PROGRAM[input.goalKey],
            goalLabel: GOAL_LABEL[input.goalKey],
        };
    }
    preview(dto) {
        return this.buildPlan({
            gender: dto.gender,
            age: dto.age,
            heightCm: dto.heightCm,
            weightKg: dto.weightKg,
            activityLevel: dto.activityLevel,
            goalKey: dto.goalKey,
        });
    }
    async complete(userId, dto) {
        const plan = this.preview(dto);
        const level = dto.level ?? client_1.FitnessLevel.BEGINNER;
        const user = await this.prisma.user.update({
            where: { id: userId },
            data: {
                name: dto.name,
                gender: dto.gender,
                age: dto.age,
                heightCm: dto.heightCm,
                weightKg: dto.weightKg,
                activityLevel: dto.activityLevel,
                level,
                goal: plan.goalLabel,
                goalKey: dto.goalKey,
                currentProgramId: null,
                programWeek: 1,
                onboardingCompleted: true,
                dailyCaloriesGoal: plan.dailyCalories,
                dailyProteinGoal: plan.proteinG,
                dailyFatsGoal: plan.fatsG,
                dailyCarbsGoal: plan.carbsG,
            },
        });
        if (!user)
            throw new common_1.NotFoundException('User not found');
        const { passwordHash: _passwordHash, ...safe } = user;
        return { user: safe, plan };
    }
};
exports.OnboardingService = OnboardingService;
exports.OnboardingService = OnboardingService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OnboardingService);
//# sourceMappingURL=onboarding.service.js.map