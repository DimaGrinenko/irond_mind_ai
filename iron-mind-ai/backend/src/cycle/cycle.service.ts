import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UpdateCycleDto } from './dto/update-cycle.dto';

export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';

export type CycleState = {
  enabled: boolean;
  lastPeriodStart: string | null;
  cycleLength: number;
  dayOfCycle: number | null;
  phase: CyclePhase | null;
};

const MS_PER_DAY = 1000 * 60 * 60 * 24;

/** Day within the cycle (1-based), or null if no start date. */
export function dayOfCycle(
  lastPeriodStart: string | null,
  cycleLength: number,
  now: Date = new Date(),
): number | null {
  if (!lastPeriodStart) return null;
  const start = new Date(lastPeriodStart + 'T00:00:00');
  if (Number.isNaN(start.getTime())) return null;
  const days = Math.floor((now.getTime() - start.getTime()) / MS_PER_DAY);
  if (days < 0) return null;
  return (days % cycleLength) + 1;
}

/** Phase from the day-of-cycle. Boundaries scale loosely with cycle length. */
export function phaseForDay(
  day: number | null,
  cycleLength = 28,
): CyclePhase | null {
  if (day == null) return null;
  // Ovulation ~ midpoint; luteal is the back half.
  const ovulationDay = Math.round(cycleLength / 2);
  if (day <= 5) return 'menstrual';
  if (day < ovulationDay - 1) return 'follicular';
  if (day <= ovulationDay + 1) return 'ovulation';
  return 'luteal';
}

@Injectable()
export class CycleService {
  constructor(private readonly prisma: PrismaService) {}

  private progress(userId: string) {
    return this.prisma.userProgress.upsert({
      where: { userId },
      update: {},
      create: { userId },
    });
  }

  async get(userId: string): Promise<CycleState> {
    const p = await this.progress(userId);
    const day = dayOfCycle(p.cycleLastPeriod, p.cycleLength);
    return {
      enabled: p.cycleEnabled,
      lastPeriodStart: p.cycleLastPeriod,
      cycleLength: p.cycleLength,
      dayOfCycle: p.cycleEnabled ? day : null,
      phase: p.cycleEnabled ? phaseForDay(day, p.cycleLength) : null,
    };
  }

  async update(userId: string, dto: UpdateCycleDto): Promise<CycleState> {
    await this.progress(userId);
    await this.prisma.userProgress.update({
      where: { userId },
      data: {
        ...(dto.enabled !== undefined ? { cycleEnabled: dto.enabled } : {}),
        ...(dto.lastPeriodStart !== undefined
          ? { cycleLastPeriod: dto.lastPeriodStart }
          : {}),
        ...(dto.cycleLength !== undefined
          ? { cycleLength: dto.cycleLength }
          : {}),
      },
    });
    return this.get(userId);
  }
}
