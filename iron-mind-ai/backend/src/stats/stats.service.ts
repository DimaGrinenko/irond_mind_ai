import { Injectable } from '@nestjs/common';
import { MuscleGroup, WorkoutStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

type MuscleKey = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'other';

const MUSCLE_MAP: Record<MuscleGroup, MuscleKey> = {
  CHEST: 'chest',
  BACK: 'back',
  LEGS: 'legs',
  GLUTES: 'legs',
  CALVES: 'legs',
  SHOULDERS: 'shoulders',
  BICEPS: 'arms',
  TRICEPS: 'arms',
  FOREARMS: 'arms',
  CORE: 'core',
  FULL_BODY: 'other',
  OTHER: 'other',
};

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async userDashboard(userId: string, days = 7) {
    const safeDays = Math.min(Math.max(days, 1), 90);
    const since = new Date();
    since.setHours(0, 0, 0, 0);
    since.setDate(since.getDate() - (safeDays - 1));

    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { currentProgramId: true },
    });

    const [workouts, nutrition, measurements, totalWorkoutsCount, allTimeSets] =
      await Promise.all([
        this.prisma.workout.findMany({
          where: { userId, date: { gte: since }, status: WorkoutStatus.COMPLETED },
          include: {
            sets: {
              select: {
                id: true,
                exerciseId: true,
                completed: true,
                weight: true,
                reps: true,
              },
            },
          },
          orderBy: { date: 'asc' },
        }),
        this.prisma.nutritionEntry.findMany({
          where: { userId, date: { gte: since } },
          orderBy: { date: 'asc' },
        }),
        this.prisma.measurement.findMany({
          where: { userId },
          orderBy: { date: 'desc' },
          take: 2,
        }),
        this.prisma.workout.count({
          where: { userId, status: WorkoutStatus.COMPLETED },
        }),
        this.prisma.exerciseSet.findMany({
          where: { workout: { userId, status: WorkoutStatus.COMPLETED } },
          select: { weight: true, reps: true },
        }),
      ]);

    const exerciseIds = Array.from(
      new Set(workouts.flatMap((w) => w.sets.map((s) => s.exerciseId))),
    );
    const exercises = exerciseIds.length
      ? await this.prisma.exercise.findMany({
          where: { id: { in: exerciseIds } },
          select: { id: true, primary: true },
        })
      : [];
    const exercisePrimaryById = new Map(exercises.map((e) => [e.id, e.primary]));

    const allTimeVolumeKg = allTimeSets.reduce(
      (s, set) => s + (set.weight ?? 0) * (set.reps ?? 0),
      0,
    );

    // ---- Прогресс по выбранной программе (стержень для «Моё дерево») ----
    type ProgramProgress = {
      id: string;
      title: string;
      weeks: number;
      daysPerWeek: number;
      scheduledTotal: number;
      scheduledDone: number;
      scheduledRemaining: number;
      progress: number;
      treeStage: number;
    } | null;
    let programProgress: ProgramProgress = null;
    if (user?.currentProgramId) {
      const prog = await this.prisma.program.findUnique({
        where: { id: user.currentProgramId },
        select: { id: true, title: true, weeks: true, daysPerWeek: true },
      });
      if (prog) {
        const [total, done] = await Promise.all([
          this.prisma.scheduledWorkout.count({
            where: { userId, programId: prog.id },
          }),
          this.prisma.scheduledWorkout.count({
            where: { userId, programId: prog.id, status: 'DONE' },
          }),
        ]);
        const progress = total > 0 ? Math.min(1, done / total) : 0;
        // 5 стадий: 0=семя, 0..0.2=росток, 0.2..0.4=молодое, 0.4..0.7=крепкое, 0.7..1=могучее
        const treeStage =
          progress >= 1
            ? 5
            : progress >= 0.7
              ? 5
              : progress >= 0.4
                ? 4
                : progress >= 0.2
                  ? 3
                  : progress > 0
                    ? 2
                    : 1;
        programProgress = {
          id: prog.id,
          title: prog.title,
          weeks: prog.weeks,
          daysPerWeek: prog.daysPerWeek,
          scheduledTotal: total,
          scheduledDone: done,
          scheduledRemaining: total - done,
          progress,
          treeStage,
        };
      }
    }

    let volumeKg = 0;
    let totalSets = 0;
    let completedSets = 0;
    const muscleVolumeAbs: Record<MuscleKey, number> = {
      chest: 0, back: 0, legs: 0, shoulders: 0, arms: 0, core: 0, other: 0,
    };

    for (const w of workouts) {
      for (const s of w.sets) {
        totalSets += 1;
        if (s.completed) completedSets += 1;
        const v = (s.weight ?? 0) * (s.reps ?? 0);
        volumeKg += v;
        const primary = exercisePrimaryById.get(s.exerciseId);
        const key = primary ? (MUSCLE_MAP[primary] ?? 'other') : 'other';
        muscleVolumeAbs[key] += v;
      }
    }

    const caloriesBurned = workouts.reduce((s, w) => s + (w.calories ?? 0), 0);
    const nutritionCalories = nutrition.reduce((s, n) => s + n.calories, 0);

    // Daily chart
    const byDay = new Map<
      string,
      { workouts: number; volume: number; calories: number; nutritionCalories: number }
    >();
    for (let i = 0; i < safeDays; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      byDay.set(toIso(d), { workouts: 0, volume: 0, calories: 0, nutritionCalories: 0 });
    }
    for (const w of workouts) {
      const key = toIso(w.date);
      const row = byDay.get(key);
      if (!row) continue; // тренировка вне окна (напр. запланированная в будущем)
      row.workouts += 1;
      row.volume += w.sets.reduce((s, set) => s + (set.weight ?? 0) * (set.reps ?? 0), 0);
      row.calories += w.calories ?? 0;
    }
    for (const n of nutrition) {
      const key = toIso(n.date);
      const row = byDay.get(key);
      if (row) row.nutritionCalories += n.calories;
    }

    const chart = Array.from(byDay.entries()).map(([date, v]) => ({ date, ...v }));

    // Normalised muscle load (excluding "other" from the user-visible distribution)
    const visibleMuscles: MuscleKey[] = ['chest', 'back', 'legs', 'shoulders', 'arms', 'core'];
    const maxMuscle = Math.max(1, ...visibleMuscles.map((k) => muscleVolumeAbs[k]));
    const muscleLoad: Record<MuscleKey, number> = {
      chest: muscleVolumeAbs.chest / maxMuscle,
      back: muscleVolumeAbs.back / maxMuscle,
      legs: muscleVolumeAbs.legs / maxMuscle,
      shoulders: muscleVolumeAbs.shoulders / maxMuscle,
      arms: muscleVolumeAbs.arms / maxMuscle,
      core: muscleVolumeAbs.core / maxMuscle,
      other: muscleVolumeAbs.other / maxMuscle,
    };

    const weightDelta =
      measurements.length >= 2 && measurements[0].weight && measurements[1].weight
        ? +(measurements[0].weight - measurements[1].weight).toFixed(1)
        : null;
    const lastWeight = measurements[0]?.weight ?? null;

    return {
      periodDays: safeDays,
      workoutsCount: workouts.length,
      totalWorkoutsAllTime: totalWorkoutsCount,
      totalVolumeKgAllTime: Math.round(allTimeVolumeKg),
      totalSets,
      completedSets,
      volumeKg: Math.round(volumeKg),
      caloriesBurned,
      nutritionCalories,
      avgNutritionCalories: nutrition.length
        ? Math.round(nutritionCalories / safeDays)
        : 0,
      weightDelta,
      lastWeight,
      muscleLoad,
      muscleVolume: muscleVolumeAbs,
      chart,
      program: programProgress,
    };
  }

  async platformOverview() {
    const [users, coaches, workouts, nutritionEntries] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { role: 'COACH' } }),
      this.prisma.workout.count({ where: { status: WorkoutStatus.COMPLETED } }),
      this.prisma.nutritionEntry.count(),
    ]);
    return { users, coaches, workoutsCompleted: workouts, nutritionEntries };
  }
}

function toIso(d: Date) {
  return d.toISOString().slice(0, 10);
}
