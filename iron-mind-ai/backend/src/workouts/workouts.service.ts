import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { WorkoutStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpsertSetDto } from './dto/upsert-set.dto';

@Injectable()
export class WorkoutsService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string, limit = 50) {
    return this.prisma.workout.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: Math.min(limit, 200),
      include: { sets: true },
    });
  }

  create(userId: string, dto: CreateWorkoutDto) {
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

  async byId(userId: string, id: string) {
    const w = await this.prisma.workout.findUnique({ where: { id }, include: { sets: true } });
    if (!w) throw new NotFoundException();
    if (w.userId !== userId) throw new ForbiddenException();
    return w;
  }

  async finish(userId: string, id: string) {
    await this.byId(userId, id);
    return this.prisma.workout.update({
      where: { id },
      data: { status: WorkoutStatus.COMPLETED },
    });
  }

  async upsertSet(userId: string, workoutId: string, dto: UpsertSetDto) {
    await this.byId(userId, workoutId);
    const existing = await this.prisma.exerciseSet.findFirst({
      where: { workoutId, exerciseId: dto.exerciseId, setNumber: dto.setNumber },
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
        exerciseId: dto.exerciseId,
        setNumber: dto.setNumber,
        weight: dto.weight,
        reps: dto.reps,
        rpeLevel: dto.rpeLevel,
        completed: dto.completed ?? false,
      },
    });
  }
}
