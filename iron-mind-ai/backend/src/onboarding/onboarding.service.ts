import { Injectable, NotFoundException } from '@nestjs/common';
import { ActivityLevel, FitnessGoalKey, Gender, FitnessLevel } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CompleteOnboardingDto } from './dto/complete-onboarding.dto';

const ACTIVITY_MULTIPLIER: Record<ActivityLevel, number> = {
  SEDENTARY: 1.2,
  LIGHT: 1.375,
  MODERATE: 1.55,
  ACTIVE: 1.725,
  VERY_ACTIVE: 1.9,
};

const GOAL_TO_PROGRAM: Record<FitnessGoalKey, string> = {
  MASS: 'mass',
  CUT: 'relief',
  STRENGTH: 'strength',
  ENDURANCE: 'endurance',
  ABS: 'abs',
};

const GOAL_LABEL: Record<FitnessGoalKey, string> = {
  MASS: 'Набор массы',
  CUT: 'Сушка',
  STRENGTH: 'Сила',
  ENDURANCE: 'Выносливость',
  ABS: 'Пресс',
};

export interface NutritionPlan {
  bmr: number;
  tdee: number;
  dailyCalories: number;
  proteinG: number;
  fatsG: number;
  carbsG: number;
  surplusOrDeficit: number;
  programId: string;
  goalLabel: string;
}

@Injectable()
export class OnboardingService {
  constructor(private readonly prisma: PrismaService) {}

  // Mifflin-St Jeor formula for BMR
  calculateBmr(gender: Gender, weightKg: number, heightCm: number, age: number): number {
    const base = 10 * weightKg + 6.25 * heightCm - 5 * age;
    if (gender === 'MALE') return Math.round(base + 5);
    if (gender === 'FEMALE') return Math.round(base - 161);
    // OTHER → midpoint
    return Math.round(base - 78);
  }

  buildPlan(input: {
    gender: Gender;
    age: number;
    heightCm: number;
    weightKg: number;
    activityLevel: ActivityLevel;
    goalKey: FitnessGoalKey;
  }): NutritionPlan {
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

  preview(dto: CompleteOnboardingDto): NutritionPlan {
    return this.buildPlan({
      gender: dto.gender as Gender,
      age: dto.age,
      heightCm: dto.heightCm,
      weightKg: dto.weightKg,
      activityLevel: dto.activityLevel as ActivityLevel,
      goalKey: dto.goalKey as FitnessGoalKey,
    });
  }

  async complete(userId: string, dto: CompleteOnboardingDto) {
    const plan = this.preview(dto);

    const level = (dto.level as FitnessLevel | undefined) ?? FitnessLevel.BEGINNER;

    // ВАЖНО: currentProgramId НЕ назначаем автоматически.
    // Пользователь выберет программу сам в разделе «Программы» после онбординга.
    const user = await this.prisma.user.update({
      where: { id: userId },
      data: {
        name: dto.name,
        gender: dto.gender as Gender,
        age: dto.age,
        heightCm: dto.heightCm,
        weightKg: dto.weightKg,
        activityLevel: dto.activityLevel as ActivityLevel,
        level,
        goal: plan.goalLabel,
        goalKey: dto.goalKey as FitnessGoalKey,
        currentProgramId: null,
        programWeek: 1,
        onboardingCompleted: true,
        dailyCaloriesGoal: plan.dailyCalories,
        dailyProteinGoal: plan.proteinG,
        dailyFatsGoal: plan.fatsG,
        dailyCarbsGoal: plan.carbsG,
      },
    });

    if (!user) throw new NotFoundException('User not found');

    const { passwordHash: _passwordHash, ...safe } = user;
    return { user: safe, plan };
  }
}
