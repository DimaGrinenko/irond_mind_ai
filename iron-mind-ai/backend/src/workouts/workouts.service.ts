import { BadRequestException, ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { WorkoutStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateWorkoutDto } from './dto/create-workout.dto';
import { UpsertSetDto } from './dto/upsert-set.dto';
import { AchievementsService } from '../achievements/achievements.service';

@Injectable()
export class WorkoutsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly achievements: AchievementsService,
  ) {}

  async list(userId: string, limit = 50) {
    const workouts = await this.prisma.workout.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: Math.min(limit, 200),
      include: {
        sets: {
          orderBy: [{ setNumber: 'asc' }],
          include: {
            exercise: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });

    const programIds = [
      ...new Set(
        workouts.map((w) => w.programId).filter((id): id is string => !!id),
      ),
    ];
    const programs =
      programIds.length > 0
        ? await this.prisma.program.findMany({
            where: { id: { in: programIds } },
            select: { id: true, title: true },
          })
        : [];
    const programById = new Map(programs.map((p) => [p.id, p]));

    return workouts.map((w) => ({
      ...w,
      program: w.programId ? (programById.get(w.programId) ?? null) : null,
    }));
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
    const w = await this.prisma.workout.findUnique({
      where: { id },
      include: {
        sets: {
          orderBy: [{ setNumber: 'asc' }],
          include: {
            exercise: { select: { id: true, name: true, slug: true } },
          },
        },
      },
    });
    if (!w) throw new NotFoundException();
    if (w.userId !== userId) throw new ForbiddenException();
    return w;
  }

  async remove(userId: string, id: string) {
    await this.byId(userId, id);
    await this.prisma.scheduledWorkout.updateMany({
      where: { userId, workoutId: id },
      data: { workoutId: null },
    });
    await this.prisma.workout.delete({ where: { id } });
    return { ok: true as const };
  }

  async finish(userId: string, id: string) {
    const workout = await this.byId(userId, id);
    const updated = await this.prisma.workout.update({
      where: { id },
      data: { status: WorkoutStatus.COMPLETED },
    });
    await this.achievements.recordWorkoutCompletion(userId, workout.name ?? undefined);
    return updated;
  }

  async upsertSet(userId: string, workoutId: string, dto: UpsertSetDto) {
    await this.byId(userId, workoutId);
    const exerciseId = await this.resolveExerciseId(dto);
    const existing = await this.prisma.exerciseSet.findFirst({
      where: { workoutId, exerciseId, setNumber: dto.setNumber },
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
        exerciseId,
        setNumber: dto.setNumber,
        weight: dto.weight,
        reps: dto.reps,
        rpeLevel: dto.rpeLevel,
        completed: dto.completed ?? false,
      },
    });
  }

  /**
   * История по упражнению (slug). Возвращает:
   * - lastSet — последний по дате сет (для prefill веса/повторов)
   * - maxWeight — максимальный вес когда-либо
   * - maxVolume — максимальный (вес × повторы) когда-либо
   * - lastWorkoutDate — дата последней тренировки с этим упражнением
   */
  async exerciseHistory(userId: string, slug: string) {
    const exercise = await this.prisma.exercise.findUnique({ where: { slug }, select: { id: true } });
    if (!exercise) {
      return { lastSet: null, maxWeight: null, maxReps: null, maxVolume: null, lastWorkoutDate: null };
    }
    const sets = await this.prisma.exerciseSet.findMany({
      where: {
        exerciseId: exercise.id,
        workout: { userId },
        completed: true,
      },
      include: { workout: { select: { date: true } } },
      orderBy: [{ workout: { date: 'desc' } }, { setNumber: 'desc' }],
      take: 100,
    });

    if (sets.length === 0) {
      return { lastSet: null, maxWeight: null, maxReps: null, maxVolume: null, lastWorkoutDate: null };
    }

    // Последний сет — первый в отсортированном списке (по дате desc)
    const lastSet = sets[0];
    // Берём все сеты последней тренировки чтобы дать «вес × повторы»
    const lastDate = lastSet.workout.date.toISOString().slice(0, 10);
    const lastWorkoutSets = sets.filter((s) => s.workout.date.toISOString().slice(0, 10) === lastDate);

    let maxWeight = 0;
    let maxReps = 0;
    let maxVolume = 0;
    for (const s of sets) {
      const w = s.weight ?? 0;
      const r = s.reps ?? 0;
      if (w > maxWeight) maxWeight = w;
      if (r > maxReps) maxReps = r;
      if (w * r > maxVolume) maxVolume = w * r;
    }

    return {
      lastSet: {
        weight: lastSet.weight,
        reps: lastSet.reps,
        date: lastSet.workout.date.toISOString(),
      },
      lastWorkoutSets: lastWorkoutSets.map((s) => ({
        setNumber: s.setNumber,
        weight: s.weight,
        reps: s.reps,
      })),
      maxWeight: maxWeight || null,
      maxReps: maxReps || null,
      maxVolume: maxVolume || null,
      lastWorkoutDate: lastSet.workout.date.toISOString(),
    };
  }

  /**
   * История 1RM (Brzycki) по упражнению.
   * Возвращает массив `{date, max1rm}` — на каждый день берём максимум по Brzycki: weight × 36 / (37 - reps).
   */
  async exercise1rmSeries(userId: string, slug: string) {
    const exercise = await this.prisma.exercise.findUnique({ where: { slug }, select: { id: true } });
    if (!exercise) return [];
    const sets = await this.prisma.exerciseSet.findMany({
      where: {
        exerciseId: exercise.id,
        workout: { userId },
        completed: true,
        weight: { gt: 0 },
        reps: { gt: 0 },
      },
      include: { workout: { select: { date: true } } },
      orderBy: { workout: { date: 'asc' } },
      take: 2000,
    });
    const byDate = new Map<string, number>();
    for (const s of sets) {
      const w = s.weight ?? 0;
      const r = s.reps ?? 0;
      if (w <= 0 || r <= 0 || r >= 37) continue;
      const oneRm = (w * 36) / (37 - r);
      const date = s.workout.date.toISOString().slice(0, 10);
      const prev = byDate.get(date) ?? 0;
      if (oneRm > prev) byDate.set(date, oneRm);
    }
    return Array.from(byDate.entries())
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, max1rm]) => ({ date, max1rm: Math.round(max1rm * 10) / 10 }));
  }

  private async resolveExerciseId(dto: UpsertSetDto): Promise<string> {
    if (dto.exerciseId) return dto.exerciseId;
    if (!dto.exerciseSlug) {
      throw new BadRequestException('Передай exerciseId или exerciseSlug');
    }
    const ex = await this.prisma.exercise.findUnique({
      where: { slug: dto.exerciseSlug },
      select: { id: true },
    });
    if (ex) return ex.id;
    // Авто-создание заглушки, чтобы клиент мог отправлять любые slug упражнений
    const created = await this.prisma.exercise.create({
      data: {
        slug: dto.exerciseSlug,
        name: dto.exerciseSlug.replace(/_/g, ' '),
        primary: 'OTHER',
        category: 'OTHER',
      },
      select: { id: true },
    });
    return created.id;
  }
}
