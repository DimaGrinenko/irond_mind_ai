import { PrismaService } from '../prisma/prisma.service';
type MuscleKey = 'chest' | 'back' | 'legs' | 'shoulders' | 'arms' | 'core' | 'other';
export declare class StatsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    userDashboard(userId: string, days?: number): Promise<{
        periodDays: number;
        workoutsCount: number;
        totalWorkoutsAllTime: number;
        totalVolumeKgAllTime: number;
        totalSets: number;
        completedSets: number;
        volumeKg: number;
        caloriesBurned: number;
        nutritionCalories: number;
        avgNutritionCalories: number;
        weightDelta: number | null;
        lastWeight: number | null;
        muscleLoad: Record<MuscleKey, number>;
        muscleVolume: Record<MuscleKey, number>;
        chart: {
            workouts: number;
            volume: number;
            calories: number;
            nutritionCalories: number;
            date: string;
        }[];
        program: {
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
    }>;
    platformOverview(): Promise<{
        users: number;
        coaches: number;
        workoutsCompleted: number;
        nutritionEntries: number;
    }>;
}
export {};
