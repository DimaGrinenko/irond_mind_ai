import { Injectable } from '@nestjs/common';
import {
  ActivityLevel,
  FitnessGoalKey,
  FitnessLevel,
  Gender,
  Prisma,
} from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    const { passwordHash: _passwordHash, ...safe } = user;
    return safe;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const data: Prisma.UserUpdateInput = {
      name: dto.name,
      gender: dto.gender as Gender | undefined,
      age: dto.age,
      heightCm: dto.heightCm,
      weightKg: dto.weightKg,
      level: dto.level as FitnessLevel | undefined,
      activityLevel: dto.activityLevel as ActivityLevel | undefined,
      goal: dto.goal,
      goalKey: dto.goalKey as FitnessGoalKey | undefined,
      currentProgramId: dto.currentProgramId,
      programWeek: dto.programWeek,
      onboardingCompleted: dto.onboardingCompleted,
      dailyCaloriesGoal: dto.dailyCaloriesGoal,
      dailyProteinGoal: dto.dailyProteinGoal,
      dailyFatsGoal: dto.dailyFatsGoal,
      dailyCarbsGoal: dto.dailyCarbsGoal,
    };

    const user = await this.prisma.user.update({ where: { id: userId }, data });
    const { passwordHash: _passwordHash, ...safe } = user;
    return safe;
  }
}
