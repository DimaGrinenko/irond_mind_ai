"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProgramsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const FULL_PROGRAM_INCLUDE = {
    days: {
        orderBy: { order: 'asc' },
        include: {
            exercises: { orderBy: { order: 'asc' } },
        },
    },
};
let ProgramsService = class ProgramsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(userId) {
        return this.prisma.program.findMany({
            where: userId
                ? { OR: [{ ownerUserId: null }, { ownerUserId: userId }] }
                : { ownerUserId: null },
            orderBy: [{ ownerUserId: 'asc' }, { id: 'asc' }],
        });
    }
    async byId(id, userId) {
        const p = await this.prisma.program.findUnique({
            where: { id },
            include: FULL_PROGRAM_INCLUDE,
        });
        if (!p)
            throw new common_1.NotFoundException('Программа не найдена');
        if (p.ownerUserId && p.ownerUserId !== userId) {
            throw new common_1.ForbiddenException('Нет доступа к программе');
        }
        return p;
    }
    async create(userId, dto) {
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
    async clone(userId, baseProgramId) {
        const base = await this.prisma.program.findUnique({
            where: { id: baseProgramId },
            include: FULL_PROGRAM_INCLUDE,
        });
        if (!base)
            throw new common_1.NotFoundException('Программа-источник не найдена');
        if (base.ownerUserId && base.ownerUserId !== userId) {
            throw new common_1.ForbiddenException('Нет доступа к программе');
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
    async update(userId, id, dto) {
        await this.ensureOwn(userId, id);
        return this.prisma.program.update({
            where: { id },
            data: dto,
            include: FULL_PROGRAM_INCLUDE,
        });
    }
    async remove(userId, id) {
        await this.ensureOwn(userId, id);
        await this.prisma.program.delete({ where: { id } });
        return { ok: true };
    }
    async addDay(userId, programId, dto) {
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
    async updateDay(userId, dayId, dto) {
        const day = await this.prisma.programDay.findUnique({
            where: { id: dayId },
            select: { programId: true },
        });
        if (!day)
            throw new common_1.NotFoundException('День не найден');
        await this.ensureOwn(userId, day.programId);
        return this.prisma.programDay.update({
            where: { id: dayId },
            data: dto,
            include: { exercises: { orderBy: { order: 'asc' } } },
        });
    }
    async removeDay(userId, dayId) {
        const day = await this.prisma.programDay.findUnique({
            where: { id: dayId },
            select: { programId: true },
        });
        if (!day)
            throw new common_1.NotFoundException('День не найден');
        await this.ensureOwn(userId, day.programId);
        await this.prisma.programDay.delete({ where: { id: dayId } });
        return { ok: true };
    }
    async addExercise(userId, dayId, dto) {
        const day = await this.prisma.programDay.findUnique({
            where: { id: dayId },
            select: { programId: true },
        });
        if (!day)
            throw new common_1.NotFoundException('День не найден');
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
    async resolveExerciseId(dto) {
        if (dto.exerciseId) {
            const existing = await this.prisma.exercise.findUnique({ where: { id: dto.exerciseId } });
            if (existing)
                return existing.id;
            const bySlug = await this.prisma.exercise.findUnique({ where: { slug: dto.exerciseId } });
            if (bySlug)
                return bySlug.id;
        }
        const slug = dto.exerciseSlug ?? dto.exerciseId;
        if (!slug) {
            throw new common_1.NotFoundException('Не указан exerciseId или exerciseSlug');
        }
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
    async updateExercise(userId, exerciseId, dto) {
        const ex = await this.prisma.programExercise.findUnique({
            where: { id: exerciseId },
            include: { day: { select: { programId: true } } },
        });
        if (!ex)
            throw new common_1.NotFoundException('Упражнение не найдено');
        await this.ensureOwn(userId, ex.day.programId);
        if (dto.repsMin !== undefined && dto.repsMax !== undefined && dto.repsMin > dto.repsMax) {
            throw new common_1.BadRequestException('repsMin не может быть больше repsMax');
        }
        return this.prisma.programExercise.update({
            where: { id: exerciseId },
            data: dto,
        });
    }
    async removeExercise(userId, exerciseId) {
        const ex = await this.prisma.programExercise.findUnique({
            where: { id: exerciseId },
            include: { day: { select: { programId: true } } },
        });
        if (!ex)
            throw new common_1.NotFoundException('Упражнение не найдено');
        await this.ensureOwn(userId, ex.day.programId);
        await this.prisma.programExercise.delete({ where: { id: exerciseId } });
        return { ok: true };
    }
    async use(userId, programId, dto) {
        const program = await this.prisma.program.findUnique({
            where: { id: programId },
            include: FULL_PROGRAM_INCLUDE,
        });
        if (!program)
            throw new common_1.NotFoundException('Программа не найдена');
        if (program.ownerUserId && program.ownerUserId !== userId) {
            throw new common_1.ForbiddenException('Нет доступа к программе');
        }
        if (program.days.length === 0) {
            throw new common_1.BadRequestException('В программе нет дней');
        }
        if (dto.weekdays !== undefined) {
            if (dto.weekdays.length !== program.days.length) {
                throw new common_1.BadRequestException(`Передай ровно ${program.days.length} weekday (по одному на каждый день программы)`);
            }
            if (new Set(dto.weekdays).size !== dto.weekdays.length) {
                throw new common_1.BadRequestException('Два дня программы не могут попадать на одну дату недели');
            }
        }
        const start = new Date(dto.startDate);
        start.setHours(0, 0, 0, 0);
        const startWeekday = (start.getDay() + 6) % 7;
        const startMonday = new Date(start);
        startMonday.setDate(start.getDate() - startWeekday);
        const weeks = Math.min(dto.weeks ?? program.weeks ?? 4, 12);
        const dayWeekdays = dto.weekdays ?? this.resolveWeekdays(program.days, program.daysPerWeek);
        const planned = [];
        for (let w = 0; w < weeks; w++) {
            for (let i = 0; i < program.days.length; i++) {
                const wd = dayWeekdays[i];
                const d = new Date(startMonday);
                d.setDate(startMonday.getDate() + w * 7 + wd);
                if (d.getTime() < start.getTime())
                    continue;
                planned.push({
                    date: d,
                    title: program.days[i].title,
                    programId: program.id,
                    programDayId: program.days[i].id,
                });
            }
        }
        if (planned.length === 0) {
            throw new common_1.BadRequestException('Все запланированные дни в прошлом');
        }
        const user = await this.prisma.user.findUnique({
            where: { id: userId },
            select: { currentProgramId: true },
        });
        const prevProgramId = user?.currentProgramId;
        const programsToClean = new Set([program.id]);
        if (prevProgramId)
            programsToClean.add(prevProgramId);
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
    async ensureOwn(userId, programId) {
        const p = await this.prisma.program.findUnique({
            where: { id: programId },
            select: { ownerUserId: true },
        });
        if (!p)
            throw new common_1.NotFoundException('Программа не найдена');
        if (!p.ownerUserId) {
            throw new common_1.ForbiddenException('Нельзя редактировать системный шаблон. Сначала клонируй его.');
        }
        if (p.ownerUserId !== userId) {
            throw new common_1.ForbiddenException('Нет доступа к программе');
        }
    }
    resolveWeekdays(days, daysPerWeek) {
        const defaultSlots = {
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
};
exports.ProgramsService = ProgramsService;
exports.ProgramsService = ProgramsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], ProgramsService);
//# sourceMappingURL=programs.service.js.map