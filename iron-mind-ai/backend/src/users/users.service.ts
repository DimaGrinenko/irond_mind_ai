import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateProfileDto } from './dto/update-profile.dto';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({ where: { id } });
    if (!user) return null;
    const { passwordHash: _, ...safe } = user;
    return safe;
  }

  async updateProfile(userId: string, dto: UpdateProfileDto) {
    const data: Prisma.UserUpdateInput = {
      name: dto.name,
      gender: dto.gender as any,
      age: dto.age,
      heightCm: dto.heightCm,
      weightKg: dto.weightKg,
      level: dto.level as any,
      goal: dto.goal,
      goalKey: dto.goalKey as any,
      currentProgramId: dto.currentProgramId,
      programWeek: dto.programWeek,
      onboardingCompleted: dto.onboardingCompleted,
    };

    const user = await this.prisma.user.update({ where: { id: userId }, data });
    const { passwordHash: _, ...safe } = user;
    return safe;
  }
}
