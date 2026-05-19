import { StatsService } from './stats.service';
export declare class StatsController {
    private readonly stats;
    constructor(stats: StatsService);
    me(user: {
        id: string;
    }, days?: string): Promise<{
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
        muscleLoad: Record<"chest" | "shoulders" | "back" | "legs" | "arms" | "core" | "other", number>;
        muscleVolume: Record<"chest" | "shoulders" | "back" | "legs" | "arms" | "core" | "other", number>;
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
    platform(): Promise<{
        users: number;
        coaches: number;
        workoutsCompleted: number;
        nutritionEntries: number;
    }>;
}
