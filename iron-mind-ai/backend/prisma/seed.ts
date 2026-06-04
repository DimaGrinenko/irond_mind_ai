import {
  PrismaClient,
  FitnessLevel,
  FitnessGoalKey,
  UserRole,
  MuscleGroup,
  ExerciseCategory,
  AchievementCategory,
  ProgramKind,
} from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const programs = [
  {
    id: 'mass',
    title: 'МАССА',
    subtitle: 'Набор мышечной массы',
    weeks: 12,
    level: FitnessLevel.ADVANCED,
    goalKey: FitnessGoalKey.MASS,
    accent: 'purple',
    iconName: 'barbell-outline',
    description: 'Базовая программа на гипертрофию.',
  },
  {
    id: 'relief',
    title: 'РЕЛЬЕФ',
    subtitle: 'Сжигаем жир, проявляем мышцы',
    weeks: 12,
    level: FitnessLevel.INTERMEDIATE,
    goalKey: FitnessGoalKey.CUT,
    accent: 'pink',
    iconName: 'flame-outline',
    description: 'Силовая + кардио для жиросжигания.',
  },
  {
    id: 'strength',
    title: 'СИЛА',
    subtitle: 'Тяжёлые базовые движения',
    weeks: 10,
    level: FitnessLevel.ADVANCED,
    goalKey: FitnessGoalKey.STRENGTH,
    accent: 'blue',
    iconName: 'flash-outline',
    description: 'Сила-цикл: присед, жим, тяга.',
  },
  {
    id: 'endurance',
    title: 'ВЫНОСЛИВОСТЬ',
    subtitle: 'Кардио и объём',
    weeks: 8,
    level: FitnessLevel.INTERMEDIATE,
    goalKey: FitnessGoalKey.ENDURANCE,
    accent: 'green',
    iconName: 'pulse-outline',
    description: 'Сила + аэробная работа.',
  },
  {
    id: 'abs',
    title: 'ПРЕСС',
    subtitle: 'Идеальный пресс',
    weeks: 4,
    level: FitnessLevel.BEGINNER,
    goalKey: FitnessGoalKey.ABS,
    accent: 'purple',
    iconName: 'fitness-outline',
    description: 'Укрепление кора.',
  },
] as const;

const exercises: Array<{
  slug: string;
  name: string;
  primary: MuscleGroup;
  secondary: MuscleGroup[];
  category: ExerciseCategory;
  tips: string[];
}> = [
  { slug: 'bench_press', name: 'Жим штанги лёжа', primary: MuscleGroup.CHEST, secondary: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS], category: ExerciseCategory.COMPOUND, tips: ['Сведите лопатки.'] },
  { slug: 'incline_db_press', name: 'Жим гантелей на наклонной', primary: MuscleGroup.CHEST, secondary: [MuscleGroup.SHOULDERS, MuscleGroup.TRICEPS], category: ExerciseCategory.COMPOUND, tips: ['Наклон 20-35°.'] },
  { slug: 'squat', name: 'Присед со штангой', primary: MuscleGroup.LEGS, secondary: [MuscleGroup.GLUTES, MuscleGroup.CORE], category: ExerciseCategory.COMPOUND, tips: ['Колени по носкам.'] },
  { slug: 'front_squat', name: 'Фронтальный присед', primary: MuscleGroup.LEGS, secondary: [MuscleGroup.CORE], category: ExerciseCategory.COMPOUND, tips: ['Локти вперёд.'] },
  { slug: 'deadlift', name: 'Становая тяга', primary: MuscleGroup.BACK, secondary: [MuscleGroup.LEGS, MuscleGroup.GLUTES], category: ExerciseCategory.COMPOUND, tips: ['Нейтральная спина.'] },
  { slug: 'romanian_dl', name: 'Румынская тяга', primary: MuscleGroup.BACK, secondary: [MuscleGroup.LEGS, MuscleGroup.GLUTES], category: ExerciseCategory.COMPOUND, tips: ['Таз назад.'] },
  { slug: 'ohp', name: 'Жим стоя', primary: MuscleGroup.SHOULDERS, secondary: [MuscleGroup.TRICEPS, MuscleGroup.CORE], category: ExerciseCategory.COMPOUND, tips: ['Корпус стабилен.'] },
  { slug: 'lat_pulldown', name: 'Тяга верхнего блока', primary: MuscleGroup.BACK, secondary: [MuscleGroup.BICEPS], category: ExerciseCategory.COMPOUND, tips: ['Лопатки вниз.'] },
  { slug: 'pullup', name: 'Подтягивания', primary: MuscleGroup.BACK, secondary: [MuscleGroup.BICEPS], category: ExerciseCategory.COMPOUND, tips: ['Полная амплитуда.'] },
  { slug: 'bb_row', name: 'Тяга штанги в наклоне', primary: MuscleGroup.BACK, secondary: [MuscleGroup.BICEPS], category: ExerciseCategory.COMPOUND, tips: ['Корпус стабилен.'] },
  { slug: 'db_row', name: 'Тяга гантели в наклоне', primary: MuscleGroup.BACK, secondary: [MuscleGroup.BICEPS], category: ExerciseCategory.COMPOUND, tips: ['Опора на колено.'] },
  { slug: 'leg_press', name: 'Жим ногами', primary: MuscleGroup.LEGS, secondary: [MuscleGroup.GLUTES], category: ExerciseCategory.COMPOUND, tips: ['Полная амплитуда.'] },
  { slug: 'leg_curl', name: 'Сгибание ног лёжа', primary: MuscleGroup.LEGS, secondary: [], category: ExerciseCategory.ISOLATION, tips: ['Без рывков.'] },
  { slug: 'leg_extension', name: 'Разгибание ног', primary: MuscleGroup.LEGS, secondary: [], category: ExerciseCategory.ISOLATION, tips: ['Контроль негатива.'] },
  { slug: 'cable_fly', name: 'Сведение в кроссовере', primary: MuscleGroup.CHEST, secondary: [], category: ExerciseCategory.ISOLATION, tips: ['Контроль негатива.'] },
  { slug: 'lat_raise', name: 'Махи гантелями в стороны', primary: MuscleGroup.SHOULDERS, secondary: [], category: ExerciseCategory.ISOLATION, tips: ['Локти мягкие.'] },
  { slug: 'curl', name: 'Подъём штанги на бицепс', primary: MuscleGroup.BICEPS, secondary: [], category: ExerciseCategory.ISOLATION, tips: ['Локти прижаты.'] },
  { slug: 'pushdown', name: 'Разгибание на блоке', primary: MuscleGroup.TRICEPS, secondary: [], category: ExerciseCategory.ISOLATION, tips: ['Локти прижаты.'] },
  { slug: 'dips', name: 'Отжимания на брусьях', primary: MuscleGroup.CHEST, secondary: [MuscleGroup.TRICEPS, MuscleGroup.SHOULDERS], category: ExerciseCategory.COMPOUND, tips: ['Корпус наклонён.'] },
  { slug: 'plank', name: 'Планка', primary: MuscleGroup.CORE, secondary: [], category: ExerciseCategory.MOBILITY, tips: ['Ровная линия тела.'] },
  { slug: 'crunch', name: 'Скручивания', primary: MuscleGroup.CORE, secondary: [], category: ExerciseCategory.ISOLATION, tips: ['Без рывков.'] },
  { slug: 'leg_raise', name: 'Подъём ног в висе', primary: MuscleGroup.CORE, secondary: [], category: ExerciseCategory.ISOLATION, tips: ['Контроль.'] },
  { slug: 'run', name: 'Бег', primary: MuscleGroup.FULL_BODY, secondary: [], category: ExerciseCategory.CARDIO, tips: ['Разминка обязательна.'] },
];

type TemplateExercise = {
  exerciseId: string;
  exerciseName: string;
  sets: number;
  repsMin: number;
  repsMax: number;
  restSeconds: number;
};

type TemplateDay = {
  title: string;
  weekday?: number;
  exercises: TemplateExercise[];
};

type TemplateProgram = {
  id: string;
  title: string;
  subtitle: string;
  weeks: number;
  level: FitnessLevel;
  goalKey: FitnessGoalKey;
  kind: ProgramKind;
  daysPerWeek: number;
  accent: string;
  iconName: string;
  description: string;
  days: TemplateDay[];
};

const ex = (exerciseId: string, exerciseName: string, sets: number, rMin: number, rMax: number, rest = 90): TemplateExercise => ({
  exerciseId, exerciseName, sets, repsMin: rMin, repsMax: rMax, restSeconds: rest,
});

const templates: TemplateProgram[] = [
  {
    id: 'full_body_3',
    title: 'ФУЛБАДИ 3×',
    subtitle: 'Всё тело 3 раза в неделю',
    weeks: 8,
    level: FitnessLevel.BEGINNER,
    goalKey: FitnessGoalKey.MASS,
    kind: ProgramKind.FULL_BODY,
    daysPerWeek: 3,
    accent: 'purple',
    iconName: 'barbell-outline',
    description: 'Классическая программа для новичков: одно занятие — всё тело. Пн / Ср / Пт.',
    days: [
      {
        title: 'Фулбади A', weekday: 0,
        exercises: [
          ex('squat', 'Присед со штангой', 3, 6, 10, 120),
          ex('bench_press', 'Жим штанги лёжа', 3, 6, 10, 120),
          ex('bb_row', 'Тяга штанги в наклоне', 3, 8, 12, 90),
          ex('ohp', 'Жим стоя', 3, 8, 12, 90),
          ex('plank', 'Планка', 3, 30, 60, 60),
        ],
      },
      {
        title: 'Фулбади B', weekday: 2,
        exercises: [
          ex('deadlift', 'Становая тяга', 3, 5, 8, 150),
          ex('incline_db_press', 'Жим гантелей на наклонной', 3, 8, 12, 90),
          ex('pullup', 'Подтягивания', 3, 6, 10, 120),
          ex('leg_press', 'Жим ногами', 3, 10, 15, 90),
          ex('crunch', 'Скручивания', 3, 12, 20, 60),
        ],
      },
      {
        title: 'Фулбади C', weekday: 4,
        exercises: [
          ex('front_squat', 'Фронтальный присед', 3, 6, 10, 120),
          ex('dips', 'Отжимания на брусьях', 3, 8, 12, 90),
          ex('lat_pulldown', 'Тяга верхнего блока', 3, 8, 12, 90),
          ex('lat_raise', 'Махи гантелями', 3, 12, 15, 60),
          ex('leg_raise', 'Подъём ног в висе', 3, 8, 15, 60),
        ],
      },
    ],
  },
  {
    id: 'upper_lower_4',
    title: 'ВЕРХ / НИЗ',
    subtitle: 'Сплит на 4 дня',
    weeks: 10,
    level: FitnessLevel.INTERMEDIATE,
    goalKey: FitnessGoalKey.MASS,
    kind: ProgramKind.UPPER_LOWER,
    daysPerWeek: 4,
    accent: 'blue',
    iconName: 'fitness-outline',
    description: 'Классика для среднего уровня. Верх / Низ × 2. Хороший баланс объёма и восстановления.',
    days: [
      {
        title: 'Верх A', weekday: 0,
        exercises: [
          ex('bench_press', 'Жим штанги лёжа', 4, 6, 8, 150),
          ex('bb_row', 'Тяга штанги в наклоне', 4, 6, 10, 120),
          ex('ohp', 'Жим стоя', 3, 8, 10, 90),
          ex('pullup', 'Подтягивания', 3, 6, 10, 120),
          ex('curl', 'Подъём на бицепс', 3, 10, 12, 60),
          ex('pushdown', 'Разгибание на блоке', 3, 10, 12, 60),
        ],
      },
      {
        title: 'Низ A', weekday: 1,
        exercises: [
          ex('squat', 'Присед со штангой', 4, 5, 8, 180),
          ex('romanian_dl', 'Румынская тяга', 4, 6, 10, 120),
          ex('leg_press', 'Жим ногами', 3, 10, 12, 90),
          ex('leg_curl', 'Сгибание ног лёжа', 3, 12, 15, 60),
          ex('plank', 'Планка', 3, 30, 60, 45),
        ],
      },
      {
        title: 'Верх B', weekday: 3,
        exercises: [
          ex('incline_db_press', 'Жим гантелей на наклонной', 4, 8, 10, 120),
          ex('db_row', 'Тяга гантели в наклоне', 4, 8, 12, 90),
          ex('lat_pulldown', 'Тяга верхнего блока', 3, 8, 12, 90),
          ex('dips', 'Отжимания на брусьях', 3, 6, 10, 90),
          ex('lat_raise', 'Махи гантелями', 3, 12, 15, 60),
          ex('cable_fly', 'Сведение в кроссовере', 3, 12, 15, 60),
        ],
      },
      {
        title: 'Низ B', weekday: 4,
        exercises: [
          ex('deadlift', 'Становая тяга', 4, 4, 6, 180),
          ex('front_squat', 'Фронтальный присед', 3, 6, 10, 120),
          ex('leg_extension', 'Разгибание ног', 3, 12, 15, 60),
          ex('leg_curl', 'Сгибание ног лёжа', 3, 12, 15, 60),
          ex('leg_raise', 'Подъём ног в висе', 3, 10, 15, 60),
        ],
      },
    ],
  },
  {
    id: 'ppl_6',
    title: 'PUSH-PULL-LEGS',
    subtitle: 'Жим / Тяга / Ноги × 2',
    weeks: 10,
    level: FitnessLevel.ADVANCED,
    goalKey: FitnessGoalKey.MASS,
    kind: ProgramKind.PUSH_PULL_LEGS,
    daysPerWeek: 6,
    accent: 'pink',
    iconName: 'flame-outline',
    description: 'Высокообъёмный сплит для продвинутых: 6 тренировок в неделю.',
    days: [
      {
        title: 'Push (Грудь/Плечи/Трицепс)', weekday: 0,
        exercises: [
          ex('bench_press', 'Жим штанги лёжа', 4, 6, 8, 150),
          ex('ohp', 'Жим стоя', 4, 6, 10, 120),
          ex('incline_db_press', 'Жим гантелей на наклонной', 3, 8, 12, 90),
          ex('lat_raise', 'Махи гантелями', 4, 12, 15, 60),
          ex('pushdown', 'Разгибание на блоке', 4, 10, 12, 60),
        ],
      },
      {
        title: 'Pull (Спина/Бицепс)', weekday: 1,
        exercises: [
          ex('deadlift', 'Становая тяга', 4, 4, 6, 180),
          ex('pullup', 'Подтягивания', 4, 6, 10, 120),
          ex('bb_row', 'Тяга штанги в наклоне', 4, 8, 10, 90),
          ex('lat_pulldown', 'Тяга верхнего блока', 3, 8, 12, 90),
          ex('curl', 'Подъём на бицепс', 4, 10, 12, 60),
        ],
      },
      {
        title: 'Legs (Ноги/Кор)', weekday: 2,
        exercises: [
          ex('squat', 'Присед со штангой', 4, 5, 8, 180),
          ex('romanian_dl', 'Румынская тяга', 4, 6, 10, 120),
          ex('leg_press', 'Жим ногами', 3, 10, 12, 90),
          ex('leg_curl', 'Сгибание ног лёжа', 3, 12, 15, 60),
          ex('plank', 'Планка', 3, 30, 60, 45),
        ],
      },
      {
        title: 'Push 2', weekday: 3,
        exercises: [
          ex('incline_db_press', 'Жим гантелей на наклонной', 4, 8, 10, 120),
          ex('dips', 'Отжимания на брусьях', 4, 6, 10, 90),
          ex('cable_fly', 'Сведение в кроссовере', 3, 12, 15, 60),
          ex('lat_raise', 'Махи гантелями', 4, 12, 15, 60),
          ex('pushdown', 'Разгибание на блоке', 3, 12, 15, 60),
        ],
      },
      {
        title: 'Pull 2', weekday: 4,
        exercises: [
          ex('bb_row', 'Тяга штанги в наклоне', 4, 6, 10, 120),
          ex('db_row', 'Тяга гантели в наклоне', 4, 8, 12, 90),
          ex('lat_pulldown', 'Тяга верхнего блока', 3, 10, 12, 90),
          ex('curl', 'Подъём на бицепс', 4, 10, 12, 60),
        ],
      },
      {
        title: 'Legs 2', weekday: 5,
        exercises: [
          ex('front_squat', 'Фронтальный присед', 4, 6, 10, 120),
          ex('leg_press', 'Жим ногами', 4, 10, 15, 90),
          ex('leg_extension', 'Разгибание ног', 3, 12, 15, 60),
          ex('leg_curl', 'Сгибание ног лёжа', 3, 12, 15, 60),
          ex('leg_raise', 'Подъём ног в висе', 3, 10, 15, 60),
        ],
      },
    ],
  },
  {
    id: 'split_5',
    title: 'СПЛИТ 5 ДНЕЙ',
    subtitle: 'По группам мышц',
    weeks: 8,
    level: FitnessLevel.INTERMEDIATE,
    goalKey: FitnessGoalKey.MASS,
    kind: ProgramKind.SPLIT,
    daysPerWeek: 5,
    accent: 'green',
    iconName: 'pulse-outline',
    description: 'Каждый день — отдельная группа мышц. Подходит при достаточном восстановлении.',
    days: [
      {
        title: 'Грудь',
        exercises: [
          ex('bench_press', 'Жим штанги лёжа', 4, 6, 10, 120),
          ex('incline_db_press', 'Жим гантелей на наклонной', 4, 8, 12, 90),
          ex('dips', 'Отжимания на брусьях', 3, 8, 12, 90),
          ex('cable_fly', 'Сведение в кроссовере', 3, 12, 15, 60),
        ],
      },
      {
        title: 'Спина',
        exercises: [
          ex('deadlift', 'Становая тяга', 4, 5, 8, 180),
          ex('pullup', 'Подтягивания', 4, 6, 10, 120),
          ex('bb_row', 'Тяга штанги в наклоне', 4, 8, 10, 90),
          ex('lat_pulldown', 'Тяга верхнего блока', 3, 10, 12, 90),
        ],
      },
      {
        title: 'Ноги',
        exercises: [
          ex('squat', 'Присед со штангой', 4, 6, 10, 180),
          ex('romanian_dl', 'Румынская тяга', 4, 6, 10, 120),
          ex('leg_press', 'Жим ногами', 3, 10, 15, 90),
          ex('leg_curl', 'Сгибание ног лёжа', 3, 12, 15, 60),
          ex('leg_extension', 'Разгибание ног', 3, 12, 15, 60),
        ],
      },
      {
        title: 'Плечи',
        exercises: [
          ex('ohp', 'Жим стоя', 4, 6, 10, 120),
          ex('lat_raise', 'Махи гантелями в стороны', 4, 12, 15, 60),
          ex('incline_db_press', 'Жим гантелей на наклонной', 3, 8, 12, 90),
          ex('plank', 'Планка', 3, 30, 60, 45),
        ],
      },
      {
        title: 'Руки + Кор',
        exercises: [
          ex('curl', 'Подъём штанги на бицепс', 4, 8, 12, 60),
          ex('pushdown', 'Разгибание на блоке', 4, 10, 12, 60),
          ex('dips', 'Отжимания на брусьях', 3, 8, 12, 90),
          ex('crunch', 'Скручивания', 3, 12, 20, 45),
          ex('leg_raise', 'Подъём ног в висе', 3, 10, 15, 60),
        ],
      },
    ],
  },
];

async function main() {
  for (const p of programs) {
    await prisma.program.upsert({ where: { id: p.id }, update: p, create: p });
  }

  for (const e of exercises) {
    await prisma.exercise.upsert({
      where: { slug: e.slug },
      update: { name: e.name, primary: e.primary, secondary: e.secondary, category: e.category, tips: e.tips },
      create: { ...e, steps: [] },
    });
  }

  for (const tpl of templates) {
    const { days, ...meta } = tpl;
    await prisma.program.upsert({
      where: { id: tpl.id },
      update: meta,
      create: meta,
    });
    // полностью пересоздаём дни/упражнения шаблона (источник правды — seed)
    await prisma.programDay.deleteMany({ where: { programId: tpl.id } });
    for (let i = 0; i < days.length; i++) {
      const d = days[i];
      const dayRow = await prisma.programDay.create({
        data: {
          programId: tpl.id,
          order: i,
          title: d.title,
          weekday: d.weekday ?? null,
        },
      });
      for (let j = 0; j < d.exercises.length; j++) {
        const e = d.exercises[j];
        await prisma.programExercise.create({
          data: {
            dayId: dayRow.id,
            order: j,
            exerciseId: e.exerciseId,
            exerciseName: e.exerciseName,
            sets: e.sets,
            repsMin: e.repsMin,
            repsMax: e.repsMax,
            restSeconds: e.restSeconds,
          },
        });
      }
    }
  }

  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? 'admin@ironmind.local';
  const adminPassword = process.env.SEED_ADMIN_PASSWORD ?? 'admin12345';
  const coachEmail = process.env.SEED_COACH_EMAIL ?? 'coach@ironmind.local';
  const coachPassword = process.env.SEED_COACH_PASSWORD ?? 'coach12345';
  const userEmail = process.env.SEED_USER_EMAIL ?? 'user@ironmind.local';
  const userPassword = process.env.SEED_USER_PASSWORD ?? 'user12345';

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const coachHash = await bcrypt.hash(coachPassword, 10);
  const userHash = await bcrypt.hash(userPassword, 10);

  const admin = await prisma.user.upsert({
    where: { email: adminEmail },
    update: { role: UserRole.ADMIN, name: 'Админ Iron Mind' },
    create: {
      email: adminEmail,
      passwordHash: adminHash,
      name: 'Админ Iron Mind',
      role: UserRole.ADMIN,
      onboardingCompleted: true,
      dailyCaloriesGoal: 2500,
      dailyProteinGoal: 160,
    },
  });

  const coach = await prisma.user.upsert({
    where: { email: coachEmail },
    update: { role: UserRole.COACH, name: 'Тренер Iron Mind' },
    create: {
      email: coachEmail,
      passwordHash: coachHash,
      name: 'Тренер Iron Mind',
      role: UserRole.COACH,
      onboardingCompleted: true,
      goal: 'Сила и масса',
      dailyCaloriesGoal: 3200,
      dailyProteinGoal: 180,
    },
  });

  const demo = await prisma.user.upsert({
    where: { email: userEmail },
    update: { name: 'Атлет Demo' },
    create: {
      email: userEmail,
      passwordHash: userHash,
      name: 'Атлет Demo',
      role: UserRole.USER,
      onboardingCompleted: true,
      goal: 'Набор массы',
      goalKey: FitnessGoalKey.MASS,
      currentProgramId: 'mass',
      programWeek: 2,
      weightKg: 82,
      heightCm: 180,
      age: 26,
      dailyCaloriesGoal: 2800,
      dailyProteinGoal: 150,
      dailyFatsGoal: 70,
      dailyCarbsGoal: 200,
    },
  });

  await prisma.coachAssignment.upsert({
    where: { clientId: demo.id },
    update: { coachId: coach.id },
    create: { coachId: coach.id, clientId: demo.id, notes: 'Демо-клиент для панели тренера' },
  });

  // Achievements — узлы дерева "Моё Дерево"
  const achievements: Array<{
    id: string;
    title: string;
    description: string;
    category: AchievementCategory;
    iconName: string;
    positionX: number;
    positionY: number;
    xpReward: number;
    leavesReward: number;
    targetValue?: number;
    targetUnit?: string;
    sortOrder: number;
  }> = [
    { id: 'strength_5pct',     title: '+5% к силе',          description: 'Увеличь общий рабочий вес на 5%',     category: AchievementCategory.STRENGTH,  iconName: 'barbell',         positionX: 0.50, positionY: 0.18, xpReward: 50,  leavesReward: 25,  targetValue: 5,    targetUnit: '%',     sortOrder: 1 },
    { id: 'squat_10kg',        title: '+10 кг присед',       description: 'Добавь 10 кг к рабочему весу в приседе', category: AchievementCategory.STRENGTH, iconName: 'barbell',         positionX: 0.27, positionY: 0.30, xpReward: 80,  leavesReward: 40,  targetValue: 10,   targetUnit: 'кг',    sortOrder: 2 },
    { id: 'pullups_plus2',     title: '+2 подтягивания',     description: 'Добавь 2 повтора к личному рекорду',   category: AchievementCategory.STRENGTH,  iconName: 'fitness',         positionX: 0.72, positionY: 0.30, xpReward: 60,  leavesReward: 30,  targetValue: 2,    targetUnit: 'повторов', sortOrder: 3 },
    { id: 'pushups_plus2',     title: '+2 отжимания',        description: 'Добавь 2 повтора к личному рекорду',   category: AchievementCategory.STRENGTH,  iconName: 'fitness',         positionX: 0.50, positionY: 0.42, xpReward: 50,  leavesReward: 25,  targetValue: 2,    targetUnit: 'повторов', sortOrder: 4 },
    { id: 'endurance_7pct',    title: '+7% выносливость',    description: 'Прогресс в кардио-тестах на 7%',        category: AchievementCategory.ENDURANCE, iconName: 'pulse',           positionX: 0.18, positionY: 0.46, xpReward: 70,  leavesReward: 35,  targetValue: 7,    targetUnit: '%',     sortOrder: 5 },
    { id: 'cardio_6pct',       title: '+6% кардио',          description: 'Снизь средний пульс на 6% при той же нагрузке', category: AchievementCategory.CARDIO, iconName: 'heart',     positionX: 0.40, positionY: 0.56, xpReward: 60,  leavesReward: 30,  targetValue: 6,    targetUnit: '%',     sortOrder: 6 },
    { id: 'workout_15min',     title: '+15 мин тренировка',  description: 'Увеличь длительность тренировки на 15 мин', category: AchievementCategory.MILESTONE, iconName: 'time',     positionX: 0.60, positionY: 0.60, xpReward: 40,  leavesReward: 20,  targetValue: 15,   targetUnit: 'мин',   sortOrder: 7 },
    { id: 'lose_2kg',          title: '-2 кг',               description: 'Снизь вес тела на 2 кг',                category: AchievementCategory.BODY,      iconName: 'trophy',          positionX: 0.78, positionY: 0.45, xpReward: 80,  leavesReward: 40,  targetValue: 2,    targetUnit: 'кг',    sortOrder: 8 },
    { id: 'pr_record',         title: '1 рекорд',            description: 'Поставь первый личный рекорд в любом упражнении', category: AchievementCategory.STRENGTH, iconName: 'trophy', positionX: 0.30, positionY: 0.68, xpReward: 100, leavesReward: 50,  targetValue: 1,    targetUnit: 'PR',    sortOrder: 9 },
    { id: 'energy_12pct',      title: '+12% энергия',        description: 'Поддерживай серию посещений 14 дней',   category: AchievementCategory.STREAK,    iconName: 'flash',           positionX: 0.66, positionY: 0.72, xpReward: 90,  leavesReward: 45,  targetValue: 12,   targetUnit: '%',     sortOrder: 10 },
    { id: 'first_workout',     title: 'Первая тренировка',   description: 'Заверши первую тренировку в приложении', category: AchievementCategory.MILESTONE, iconName: 'sparkles',        positionX: 0.50, positionY: 0.84, xpReward: 30,  leavesReward: 50,  targetValue: 1,    targetUnit: 'тренировка', sortOrder: 11 },
    { id: 'workouts_5',        title: '5 тренировок',         description: 'Заверши 5 тренировок',                   category: AchievementCategory.MILESTONE, iconName: 'fitness',         positionX: 0.30, positionY: 0.80, xpReward: 40,  leavesReward: 20,  targetValue: 5,    targetUnit: 'тренировок', sortOrder: 13 },
    { id: 'workouts_10',       title: '10 тренировок',        description: 'Заверши 10 тренировок',                  category: AchievementCategory.MILESTONE, iconName: 'fitness',         positionX: 0.40, positionY: 0.75, xpReward: 60,  leavesReward: 30,  targetValue: 10,   targetUnit: 'тренировок', sortOrder: 14 },
    { id: 'workouts_25',       title: '25 тренировок',        description: 'Заверши 25 тренировок',                  category: AchievementCategory.MILESTONE, iconName: 'medal',           positionX: 0.55, positionY: 0.72, xpReward: 100, leavesReward: 60,  targetValue: 25,   targetUnit: 'тренировок', sortOrder: 15 },
    { id: 'workouts_50',       title: '50 тренировок',        description: 'Заверши 50 тренировок',                  category: AchievementCategory.MILESTONE, iconName: 'medal',           positionX: 0.70, positionY: 0.68, xpReward: 200, leavesReward: 120, targetValue: 50,   targetUnit: 'тренировок', sortOrder: 16 },
    { id: 'workouts_100',      title: '100 тренировок',       description: 'Заверши 100 тренировок',                 category: AchievementCategory.MILESTONE, iconName: 'trophy',          positionX: 0.85, positionY: 0.64, xpReward: 500, leavesReward: 300, targetValue: 100,  targetUnit: 'тренировок', sortOrder: 17 },
    { id: 'streak_3',          title: 'Серия 3 дня',          description: 'Тренируйся 3 дня подряд',                category: AchievementCategory.STREAK,    iconName: 'flame',           positionX: 0.15, positionY: 0.88, xpReward: 25,  leavesReward: 15,  targetValue: 3,    targetUnit: 'дней',  sortOrder: 18 },
    { id: 'streak_7',          title: 'Серия 7 дней',         description: 'Тренируйся 7 дней подряд',               category: AchievementCategory.STREAK,    iconName: 'flame',           positionX: 0.20, positionY: 0.82, xpReward: 60,  leavesReward: 30,  targetValue: 7,    targetUnit: 'дней',  sortOrder: 19 },
    { id: 'streak_14',         title: 'Серия 14 дней',        description: 'Тренируйся 14 дней подряд',              category: AchievementCategory.STREAK,    iconName: 'flame',           positionX: 0.25, positionY: 0.76, xpReward: 120, leavesReward: 60,  targetValue: 14,   targetUnit: 'дней',  sortOrder: 20 },
    { id: 'streak_30',         title: 'Серия 30 дней',        description: 'Тренируйся 30 дней подряд',              category: AchievementCategory.STREAK,    iconName: 'flame',           positionX: 0.30, positionY: 0.70, xpReward: 300, leavesReward: 180, targetValue: 30,   targetUnit: 'дней',  sortOrder: 21 },
    { id: 'volume_1k',         title: '1 тонна объёма',       description: 'Подними суммарно 1000 кг',               category: AchievementCategory.STRENGTH,  iconName: 'barbell',         positionX: 0.45, positionY: 0.62, xpReward: 40,  leavesReward: 20,  targetValue: 1000, targetUnit: 'кг',    sortOrder: 22 },
    { id: 'volume_5k',         title: '5 тонн объёма',        description: 'Подними суммарно 5000 кг',               category: AchievementCategory.STRENGTH,  iconName: 'barbell',         positionX: 0.55, positionY: 0.55, xpReward: 80,  leavesReward: 40,  targetValue: 5000, targetUnit: 'кг',    sortOrder: 23 },
    { id: 'volume_25k',        title: '25 тонн объёма',       description: 'Подними суммарно 25 000 кг',             category: AchievementCategory.STRENGTH,  iconName: 'barbell',         positionX: 0.65, positionY: 0.48, xpReward: 150, leavesReward: 80,  targetValue: 25000, targetUnit: 'кг',   sortOrder: 24 },
    { id: 'volume_100k',       title: '100 тонн объёма',      description: 'Подними суммарно 100 000 кг',            category: AchievementCategory.STRENGTH,  iconName: 'barbell',         positionX: 0.78, positionY: 0.40, xpReward: 400, leavesReward: 200, targetValue: 100000, targetUnit: 'кг',  sortOrder: 25 },
  ];

  for (const a of achievements) {
    await prisma.achievement.upsert({
      where: { id: a.id },
      update: a,
      create: a,
    });
  }

  // UserProgress для демо-юзера
  await prisma.userProgress.upsert({
    where: { userId: demo.id },
    update: {},
    create: {
      userId: demo.id,
      treeLevel: 1,
      currentXp: 0,
      totalXp: 0,
      leaves: 0,
      streakDays: 0,
      monthlyGoal: 20,
    },
  });

  console.log(`Seeded programs, exercises, achievements (${achievements.length}), admin=${admin.email}, coach=${coach.email}, demo=${demo.email}`);
  console.log('Demo credentials use env vars SEED_*_PASSWORD (see .env)');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
