import {
  PrismaClient,
  FitnessLevel,
  FitnessGoalKey,
  UserRole,
  MuscleGroup,
  ExerciseCategory,
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
  { slug: 'squat', name: 'Присед со штангой', primary: MuscleGroup.LEGS, secondary: [MuscleGroup.GLUTES, MuscleGroup.CORE], category: ExerciseCategory.COMPOUND, tips: ['Колени по носкам.'] },
  { slug: 'deadlift', name: 'Становая тяга', primary: MuscleGroup.BACK, secondary: [MuscleGroup.LEGS, MuscleGroup.GLUTES], category: ExerciseCategory.COMPOUND, tips: ['Нейтральная спина.'] },
  { slug: 'ohp', name: 'Жим стоя', primary: MuscleGroup.SHOULDERS, secondary: [MuscleGroup.TRICEPS, MuscleGroup.CORE], category: ExerciseCategory.COMPOUND, tips: ['Корпус стабилен.'] },
  { slug: 'lat_pulldown', name: 'Тяга верхнего блока', primary: MuscleGroup.BACK, secondary: [MuscleGroup.BICEPS], category: ExerciseCategory.COMPOUND, tips: ['Лопатки вниз.'] },
  { slug: 'leg_press', name: 'Жим ногами', primary: MuscleGroup.LEGS, secondary: [MuscleGroup.GLUTES], category: ExerciseCategory.COMPOUND, tips: ['Полная амплитуда.'] },
  { slug: 'cable_fly', name: 'Сведение в кроссовере', primary: MuscleGroup.CHEST, secondary: [], category: ExerciseCategory.ISOLATION, tips: ['Контроль негатива.'] },
  { slug: 'plank', name: 'Планка', primary: MuscleGroup.CORE, secondary: [], category: ExerciseCategory.MOBILITY, tips: ['Ровная линия тела.'] },
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

  const passwordHash = await bcrypt.hash('IronMind2026!', 10);

  const admin = await prisma.user.upsert({
    where: { email: 'admin@ironmind.ai' },
    update: { role: UserRole.ADMIN, name: 'Админ Iron Mind' },
    create: {
      email: 'admin@ironmind.ai',
      passwordHash,
      name: 'Админ Iron Mind',
      role: UserRole.ADMIN,
      onboardingCompleted: true,
      dailyCaloriesGoal: 2500,
      dailyProteinGoal: 160,
    },
  });

  const coach = await prisma.user.upsert({
    where: { email: 'coach@ironmind.ai' },
    update: { role: UserRole.COACH, name: 'Тренер Iron Mind' },
    create: {
      email: 'coach@ironmind.ai',
      passwordHash,
      name: 'Тренер Iron Mind',
      role: UserRole.COACH,
      onboardingCompleted: true,
      goal: 'Сила и масса',
      dailyCaloriesGoal: 3200,
      dailyProteinGoal: 180,
    },
  });

  const demo = await prisma.user.upsert({
    where: { email: 'athlete@ironmind.ai' },
    update: { name: 'Атлет Demo' },
    create: {
      email: 'athlete@ironmind.ai',
      passwordHash,
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

  console.log(`Seeded programs, exercises, admin=${admin.email}, coach=${coach.email}, demo=${demo.email}`);
  console.log('Password for all demo accounts: IronMind2026!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
