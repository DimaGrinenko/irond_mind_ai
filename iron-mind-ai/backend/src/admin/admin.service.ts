import { Injectable, NotFoundException } from '@nestjs/common';
import { UserRole } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class AdminService {
  constructor(private readonly prisma: PrismaService) {}

  listUsers() {
    return this.prisma.user.findMany({
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        goal: true,
        onboardingCompleted: true,
        createdAt: true,
        _count: { select: { workouts: true, nutritionEntries: true } },
      },
      orderBy: { createdAt: 'desc' },
      take: 200,
    });
  }

  async setRole(userId: string, role: UserRole) {
    const user = await this.prisma.user.findUnique({ where: { id: userId } });
    if (!user) throw new NotFoundException();
    return this.prisma.user.update({
      where: { id: userId },
      data: { role },
      select: { id: true, email: true, name: true, role: true },
    });
  }

  async assignCoach(clientId: string, coachId: string, notes?: string) {
    const [client, coach] = await Promise.all([
      this.prisma.user.findUnique({ where: { id: clientId } }),
      this.prisma.user.findUnique({ where: { id: coachId } }),
    ]);
    if (!client || !coach) throw new NotFoundException();
    if (coach.role !== UserRole.COACH && coach.role !== UserRole.ADMIN) {
      throw new NotFoundException('Пользователь не является тренером');
    }
    return this.prisma.coachAssignment.upsert({
      where: { clientId },
      update: { coachId, notes },
      create: { clientId, coachId, notes },
      include: {
        client: { select: { id: true, name: true, email: true } },
        coach: { select: { id: true, name: true, email: true } },
      },
    });
  }
}
