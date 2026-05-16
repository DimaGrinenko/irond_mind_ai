import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { WorkoutStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { StatsService } from '../stats/stats.service';

@Injectable()
export class CoachService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly stats: StatsService,
  ) {}

  async listClients(coachId: string) {
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

  async clientDetail(coachId: string, clientId: string) {
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
        where: { userId: clientId, status: WorkoutStatus.COMPLETED },
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
    if (!user) throw new NotFoundException();
    return { user, stats, recentWorkouts, recentNutrition };
  }

  async addNote(coachId: string, clientId: string, notes: string) {
    await this.assertCoachOfClient(coachId, clientId);
    return this.prisma.coachAssignment.update({
      where: { clientId },
      data: { notes },
    });
  }

  private async assertCoachOfClient(coachId: string, clientId: string) {
    const row = await this.prisma.coachAssignment.findFirst({ where: { coachId, clientId } });
    if (!row) throw new ForbiddenException('Клиент не закреплён за вами');
  }
}
