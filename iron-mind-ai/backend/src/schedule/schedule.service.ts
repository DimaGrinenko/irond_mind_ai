import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { ScheduledWorkoutStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { AchievementsService } from '../achievements/achievements.service';
import { CreateScheduledDto } from './dto/create-scheduled.dto';

@Injectable()
export class ScheduleService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly achievements: AchievementsService,
  ) {}

  list(userId: string, from?: string, to?: string) {
    return this.prisma.scheduledWorkout.findMany({
      where: {
        userId,
        ...(from || to
          ? {
              date: {
                ...(from ? { gte: new Date(from) } : {}),
                ...(to ? { lte: new Date(to) } : {}),
              },
            }
          : {}),
      },
      orderBy: { date: 'asc' },
    });
  }

  async create(userId: string, dto: CreateScheduledDto) {
    const dates = this.expandDates(dto);

    if (dates.length === 1) {
      return this.prisma.scheduledWorkout.create({
        data: {
          userId,
          date: dates[0],
          time: dto.time,
          title: dto.title,
          programId: dto.programId,
          notes: dto.notes,
        },
      });
    }

    await this.prisma.scheduledWorkout.createMany({
      data: dates.map((d) => ({
        userId,
        date: d,
        time: dto.time,
        title: dto.title,
        programId: dto.programId,
        notes: dto.notes,
      })),
    });

    return this.prisma.scheduledWorkout.findMany({
      where: {
        userId,
        date: { gte: dates[0], lte: dates[dates.length - 1] },
        title: dto.title,
      },
      orderBy: { date: 'asc' },
    });
  }

  async complete(userId: string, id: string) {
    const item = await this.ensureOwn(userId, id);
    const updated = await this.prisma.scheduledWorkout.update({
      where: { id },
      data: { status: ScheduledWorkoutStatus.DONE, completedAt: new Date() },
    });
    // Создаём фактическую тренировку и обновляем прогресс / достижения
    const workout = await this.prisma.workout.create({
      data: {
        userId,
        date: item.date,
        name: item.title,
        programId: item.programId,
        status: 'COMPLETED',
      },
    });
    await this.prisma.scheduledWorkout.update({
      where: { id },
      data: { workoutId: workout.id },
    });
    await this.achievements.recordWorkoutCompletion(userId, item.title);
    return updated;
  }

  async skip(userId: string, id: string) {
    await this.ensureOwn(userId, id);
    return this.prisma.scheduledWorkout.update({
      where: { id },
      data: { status: ScheduledWorkoutStatus.SKIPPED },
    });
  }

  async remove(userId: string, id: string) {
    await this.ensureOwn(userId, id);
    await this.prisma.scheduledWorkout.delete({ where: { id } });
    return { ok: true };
  }

  private async ensureOwn(userId: string, id: string) {
    const item = await this.prisma.scheduledWorkout.findUnique({ where: { id } });
    if (!item) throw new NotFoundException();
    if (item.userId !== userId) throw new ForbiddenException();
    return item;
  }

  private expandDates(dto: CreateScheduledDto): Date[] {
    const start = new Date(dto.date);
    start.setHours(0, 0, 0, 0);
    if (!dto.repeatWeekdays || dto.repeatWeekdays.length === 0) {
      return [start];
    }
    const weeks = dto.repeatWeeks ?? 4;
    const result: Date[] = [];
    const startMonday = new Date(start);
    const startWeekday = (start.getDay() + 6) % 7; // 0=Пн ... 6=Вс
    startMonday.setDate(start.getDate() - startWeekday);
    for (let w = 0; w < weeks; w++) {
      for (const wd of dto.repeatWeekdays) {
        const d = new Date(startMonday);
        d.setDate(startMonday.getDate() + w * 7 + wd);
        if (d.getTime() >= start.getTime()) result.push(d);
      }
    }
    return result.sort((a, b) => a.getTime() - b.getTime());
  }
}
