import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, ProgramKind } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateProgramDto } from './dto/create-program.dto';
import { UpdateProgramDto } from './dto/update-program.dto';
import { CreateProgramDayDto } from './dto/create-program-day.dto';
import { UpdateProgramDayDto } from './dto/update-program-day.dto';
import { CreateProgramExerciseDto } from './dto/create-program-exercise.dto';
import { UpdateProgramExerciseDto } from './dto/update-program-exercise.dto';
import { UseProgramDto } from './dto/use-program.dto';

const FULL_PROGRAM_INCLUDE = {
  days: {
    orderBy: { order: 'asc' as const },
    include: {
      exercises: { orderBy: { order: 'asc' as const } },
    },
  },
} satisfies Prisma.ProgramInclude;

@Injectable()
export class ProgramsService {
  constructor(private readonly prisma: PrismaService) {}

  /** Список программ, видимых пользователю: системные шаблоны + личные. */
  list(userId?: string) {
    return this.prisma.program.findMany({
      where: userId
        ? { OR: [{ ownerUserId: null }, { ownerUserId: userId }] }
        : { ownerUserId: null },
      orderBy: [{ ownerUserId: 'asc' }, { id: 'asc' }],
    });
  }

  async byId(id: string, userId?: string) {
    const p = await this.prisma.program.findUnique({
      where: { id },
      include: FULL_PROGRAM_INCLUDE,
    });
    if (!p) throw new NotFoundException('Программа не найдена');
    if (p.ownerUserId && p.ownerUserId !== userId) {
      throw new ForbiddenException('Нет доступа к программе');
    }
    return p;
  }

  /** Создать пустую личную программу с нуля. */
  async create(userId: string, dto: CreateProgramDto) {
    const newId = `usr_${userId.slice(0, 6)}_custom_${Date.now().toString(36)}`;
    return this.prisma.program.create({
      data: {
        id: newId,
        title: dto.title,
        subtitle: dto.subtitle ?? '',
        description: dto.description ?? '',
        weeks: dto.weeks ?? 8,
        daysPerWeek: dto.daysPerWeek ?? 3,
        level: dto.level ?? 'INTERMEDIATE',
        goalKey: dto.goalKey ?? 'MASS',
        kind: dto.kind ?? 'CUSTOM',
        accent: dto.accent ?? 'purple',
        iconName: dto.iconName ?? 'barbell-outline',
        ownerUserId: userId,
        baseProgramId: null,
      },
      include: FULL_PROGRAM_INCLUDE,
    });
  }

  /** Клонировать системный/чужой шаблон в личную программу пользователя. */
  async clone(userId: string, baseProgramId: string) {
    const base = await this.prisma.program.findUnique({
      where: { id: baseProgramId },
      include: FULL_PROGRAM_INCLUDE,
    });
    if (!base) throw new NotFoundException('Программа-источник не найдена');
    // Клонировать можно либо системный шаблон, либо собственную программу
    if (base.ownerUserId && base.ownerUserId !== userId) {
      throw new ForbiddenException('Нет доступа к программе');
    }

    const newId = `usr_${userId.slice(0, 6)}_${base.id}_${Date.now().toString(36)}`;

    return this.prisma.program.create({
      data: {
        id: newId,
        title: base.title,
        subtitle: base.subtitle,
        weeks: base.weeks,
        level: base.level,
        goalKey: base.goalKey,
        kind: base.kind,
        daysPerWeek: base.daysPerWeek,
        accent: base.accent,
        iconName: base.iconName,
        description: base.description,
        ownerUserId: userId,
        baseProgramId: base.id,
        days: {
          create: base.days.map((d) => ({
            order: d.order,
            title: d.title,
            weekday: d.weekday,
            exercises: {
              create: d.exercises.map((e) => ({
                order: e.order,
                exerciseId: e.exerciseId,
                exerciseName: e.exerciseName,
                sets: e.sets,
                repsMin: e.repsMin,
                repsMax: e.repsMax,
                restSeconds: e.restSeconds,
                notes: e.notes,
              })),
            },
          })),
        },
      },
      include: FULL_PROGRAM_INCLUDE,
    });
  }

  async update(userId: string, id: string, dto: UpdateProgramDto) {
    await this.ensureOwn(userId, id);
    return this.prisma.program.update({
      where: { id },
      data: dto,
      include: FULL_PROGRAM_INCLUDE,
    });
  }

  async remove(userId: string, id: string) {
    await this.ensureOwn(userId, id);
    await this.prisma.program.delete({ where: { id } });
    return { ok: true };
  }

  // ---- Дни ----

  async addDay(userId: string, programId: string, dto: CreateProgramDayDto) {
    await this.ensureOwn(userId, programId);
    const count = await this.prisma.programDay.count({ where: { programId } });
    return this.prisma.programDay.create({
      data: {
        programId,
        title: dto.title,
        weekday: dto.weekday ?? null,
        order: dto.order ?? count,
      },
      include: { exercises: { orderBy: { order: 'asc' } } },
    });
  }

  async updateDay(userId: string, dayId: string, dto: UpdateProgramDayDto) {
    const day = await this.prisma.programDay.findUnique({
      where: { id: dayId },
      select: { programId: true },
    });
    if (!day) throw new NotFoundException('День не найден');
    await this.ensureOwn(userId, day.programId);
    return this.prisma.programDay.update({
      where: { id: dayId },
      data: dto,
      include: { exercises: { orderBy: { order: 'asc' } } },
    });
  }

  async removeDay(userId: string, dayId: string) {
    const day = await this.prisma.programDay.findUnique({
      where: { id: dayId },
      select: { programId: true },
    });
    if (!day) throw new NotFoundException('День не найден');
    await this.ensureOwn(userId, day.programId);
    await this.prisma.programDay.delete({ where: { id: dayId } });
    return { ok: true };
  }

  // ---- Упражнения в дне ----

  async addExercise(userId: string, dayId: string, dto: CreateProgramExerciseDto) {
    const day = await this.prisma.programDay.findUnique({
      where: { id: dayId },
      select: { programId: true },
    });
    if (!day) throw new NotFoundException('День не найден');
    await this.ensureOwn(userId, day.programId);
    const count = await this.prisma.programExercise.count({ where: { dayId } });
    const exerciseId = await this.resolveExerciseId(dto);
    return this.prisma.programExercise.create({
      data: {
        dayId,
        exerciseId,
        exerciseName: dto.exerciseName,
        sets: dto.sets ?? 3,
        repsMin: dto.repsMin ?? 8,
        repsMax: dto.repsMax ?? 12,
        restSeconds: dto.restSeconds ?? 90,
        notes: dto.notes,
        order: dto.order ?? count,
      },
    });
  }

  /** Резолв exerciseId по id или slug; создаёт заглушку если slug неизвестен. */
  private async resolveExerciseId(dto: { exerciseId?: string; exerciseSlug?: string }): Promise<string> {
    if (dto.exerciseId) {
      const existing = await this.prisma.exercise.findUnique({ where: { id: dto.exerciseId } });
      if (existing) return existing.id;
      // Если по id не нашли — пробуем как slug
      const bySlug = await this.prisma.exercise.findUnique({ where: { slug: dto.exerciseId } });
      if (bySlug) return bySlug.id;
    }
    const slug = dto.exerciseSlug ?? dto.exerciseId;
    if (!slug) {
      throw new NotFoundException('Не указан exerciseId или exerciseSlug');
    }
    // Авто-создание заглушки
    const created = await this.prisma.exercise.create({
      data: {
        slug,
        name: slug.replace(/_/g, ' '),
        primary: 'OTHER',
        category: 'OTHER',
      },
      select: { id: true },
    });
    return created.id;
  }

  async updateExercise(userId: string, exerciseId: string, dto: UpdateProgramExerciseDto) {
    const ex = await this.prisma.programExercise.findUnique({
      where: { id: exerciseId },
      include: { day: { select: { programId: true } } },
    });
    if (!ex) throw new NotFoundException('Упражнение не найдено');
    await this.ensureOwn(userId, ex.day.programId);
    if (dto.repsMin !== undefined && dto.repsMax !== undefined && dto.repsMin > dto.repsMax) {
      throw new BadRequestException('repsMin не может быть больше repsMax');
    }
    return this.prisma.programExercise.update({
      where: { id: exerciseId },
      data: dto,
    });
  }

  async removeExercise(userId: string, exerciseId: string) {
    const ex = await this.prisma.programExercise.findUnique({
      where: { id: exerciseId },
      include: { day: { select: { programId: true } } },
    });
    if (!ex) throw new NotFoundException('Упражнение не найдено');
    await this.ensureOwn(userId, ex.day.programId);
    await this.prisma.programExercise.delete({ where: { id: exerciseId } });
    return { ok: true };
  }

  /**
   * Сделать программу текущей и сгенерировать серию ScheduledWorkout
   * по дням программы на N недель, начиная с startDate.
   * Если переданы weekdays[i] — это пользовательский выбор дня недели для i-го дня программы.
   * Иначе используется program.days[i].weekday или авто-раскладка по daysPerWeek.
   * Перед созданием: PLANNED тренировки старой текущей программы пользователя удаляются,
   * чтобы избежать накопления мусора в календаре.
   */
  async use(userId: string, programId: string, dto: UseProgramDto) {
    const program = await this.prisma.program.findUnique({
      where: { id: programId },
      include: FULL_PROGRAM_INCLUDE,
    });
    if (!program) throw new NotFoundException('Программа не найдена');
    if (program.ownerUserId && program.ownerUserId !== userId) {
      throw new ForbiddenException('Нет доступа к программе');
    }
    if (program.days.length === 0) {
      throw new BadRequestException('В программе нет дней');
    }

    // Валидация weekdays: длина соответствует количеству дней, без дублей
    if (dto.weekdays !== undefined) {
      if (dto.weekdays.length !== program.days.length) {
        throw new BadRequestException(
          `Передай ровно ${program.days.length} weekday (по одному на каждый день программы)`,
        );
      }
      if (new Set(dto.weekdays).size !== dto.weekdays.length) {
        throw new BadRequestException('Два дня программы не могут попадать на одну дату недели');
      }
    }

    const start = new Date(dto.startDate);
    start.setHours(0, 0, 0, 0);
    const startWeekday = (start.getDay() + 6) % 7; // 0=Пн
    const startMonday = new Date(start);
    startMonday.setDate(start.getDate() - startWeekday);

    const weeks = Math.min(dto.weeks ?? program.weeks ?? 4, 12);

    const dayWeekdays =
      dto.weekdays ?? this.resolveWeekdays(program.days, program.daysPerWeek);

    const planned: Array<{
      date: Date;
      title: string;
      programId: string;
      programDayId: string;
    }> = [];

    for (let w = 0; w < weeks; w++) {
      for (let i = 0; i < program.days.length; i++) {
        const wd = dayWeekdays[i];
        const d = new Date(startMonday);
        d.setDate(startMonday.getDate() + w * 7 + wd);
        if (d.getTime() < start.getTime()) continue;
        planned.push({
          date: d,
          title: program.days[i].title,
          programId: program.id,
          programDayId: program.days[i].id,
        });
      }
    }

    if (planned.length === 0) {
      throw new BadRequestException('Все запланированные дни в прошлом');
    }

    // Очищаем PLANNED старой/этой программы у юзера, чтобы не было мусора в календаре
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
      select: { currentProgramId: true },
    });
    const prevProgramId = user?.currentProgramId;
    const programsToClean = new Set<string>([program.id]);
    if (prevProgramId) programsToClean.add(prevProgramId);
    await this.prisma.scheduledWorkout.deleteMany({
      where: {
        userId,
        status: 'PLANNED',
        programId: { in: Array.from(programsToClean) },
      },
    });

    await this.prisma.scheduledWorkout.createMany({
      data: planned.map((p) => ({
        userId,
        date: p.date,
        title: p.title,
        programId: p.programId,
        programDayId: p.programDayId,
      })),
    });

    await this.prisma.user.update({
      where: { id: userId },
      data: { currentProgramId: program.id, programWeek: 1 },
    });

    return { created: planned.length, programId: program.id };
  }

  // ---------- helpers ----------

  private async ensureOwn(userId: string, programId: string) {
    const p = await this.prisma.program.findUnique({
      where: { id: programId },
      select: { ownerUserId: true },
    });
    if (!p) throw new NotFoundException('Программа не найдена');
    if (!p.ownerUserId) {
      throw new ForbiddenException('Нельзя редактировать системный шаблон. Сначала клонируй его.');
    }
    if (p.ownerUserId !== userId) {
      throw new ForbiddenException('Нет доступа к программе');
    }
  }

  /** Возвращает weekday-индекс для каждого дня программы (0=Пн..6=Вс). */
  private resolveWeekdays(
    days: Array<{ weekday: number | null; order: number }>,
    daysPerWeek: number,
  ): number[] {
    const defaultSlots: Record<number, number[]> = {
      1: [0],
      2: [0, 3],
      3: [0, 2, 4],
      4: [0, 1, 3, 4],
      5: [0, 1, 2, 3, 4],
      6: [0, 1, 2, 3, 4, 5],
      7: [0, 1, 2, 3, 4, 5, 6],
    };
    const fallback = defaultSlots[Math.min(Math.max(daysPerWeek, 1), 7)] ?? [0, 2, 4];
    return days.map((d, idx) => (d.weekday ?? fallback[idx % fallback.length]));
  }
}
