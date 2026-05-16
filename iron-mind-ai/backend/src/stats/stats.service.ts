import { Injectable } from '@nestjs/common';
import { WorkoutStatus } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class StatsService {
  constructor(private readonly prisma: PrismaService) {}

  async userDashboard(userId: string, days = 7) {
    const since = new Date();
    since.setDate(since.getDate() - days);
    since.setHours(0, 0, 0, 0);

    const [workouts, nutrition, measurements] = await Promise.all([
      this.prisma.workout.findMany({
        where: { userId, date: { gte: since }, status: WorkoutStatus.COMPLETED },
        include: { sets: true },
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
    ]);

    const volumeKg = workouts.reduce(
      (sum, w) => sum + w.sets.reduce((s, set) => s + (set.weight ?? 0) * (set.reps ?? 0), 0),
      0,
    );
    const caloriesBurned = workouts.reduce((s, w) => s + (w.calories ?? 0), 0);
    const nutritionCalories = nutrition.reduce((s, n) => s + n.calories, 0);

    const byDay = new Map<string, { workouts: number; volume: number; calories: number }>();
    for (let i = 0; i < days; i++) {
      const d = new Date(since);
      d.setDate(since.getDate() + i);
      byDay.set(d.toISOString().slice(0, 10), { workouts: 0, volume: 0, calories: 0 });
    }
    for (const w of workouts) {
      const key = w.date.toISOString().slice(0, 10);
      const row = byDay.get(key) ?? { workouts: 0, volume: 0, calories: 0 };
      row.workouts += 1;
      row.volume += w.sets.reduce((s, set) => s + (set.weight ?? 0) * (set.reps ?? 0), 0);
      row.calories += w.calories ?? 0;
      byDay.set(key, row);
    }

    const weightDelta =
      measurements.length >= 2 && measurements[0].weight && measurements[1].weight
        ? measurements[0].weight - measurements[1].weight
        : null;

    return {
      periodDays: days,
      workoutsCount: workouts.length,
      volumeKg: Math.round(volumeKg),
      caloriesBurned,
      nutritionCalories,
      weightDelta,
      chart: Array.from(byDay.entries()).map(([date, v]) => ({ date, ...v })),
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
