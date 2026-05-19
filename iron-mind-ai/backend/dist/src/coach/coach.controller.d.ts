import { CoachService } from './coach.service';
declare class NoteDto {
    notes: string;
}
export declare class CoachController {
    private readonly coach;
    constructor(coach: CoachService);
    clients(user: {
        id: string;
    }): Promise<{
        assignmentNotes: string | null;
        assignedAt: Date;
        id: string;
        name: string;
        email: string;
        weightKg: number | null;
        goal: string | null;
        currentProgramId: string | null;
        programWeek: number;
        onboardingCompleted: boolean;
    }[]>;
    client(user: {
        id: string;
    }, id: string): Promise<{
        user: {
            id: string;
            name: string;
            email: string;
            age: number | null;
            heightCm: number | null;
            weightKg: number | null;
            goal: string | null;
            currentProgramId: string | null;
            programWeek: number;
            dailyCaloriesGoal: number | null;
            dailyProteinGoal: number | null;
        };
        stats: {
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
        };
        recentWorkouts: ({
            sets: ({
                exercise: {
                    name: string;
                };
            } & {
                id: string;
                createdAt: Date;
                updatedAt: Date;
                exerciseId: string;
                weight: number | null;
                reps: number | null;
                rpeLevel: number | null;
                workoutId: string;
                setNumber: number;
                completed: boolean;
            })[];
        } & {
            id: string;
            createdAt: Date;
            updatedAt: Date;
            name: string | null;
            programId: string | null;
            userId: string;
            date: Date;
            durationSeconds: number | null;
            calories: number | null;
            status: import(".prisma/client").$Enums.WorkoutStatus;
        })[];
        recentNutrition: {
            id: string;
            createdAt: Date;
            name: string;
            time: string | null;
            userId: string;
            date: Date;
            calories: number;
            mealType: import(".prisma/client").$Enums.MealType;
            protein: number | null;
            fats: number | null;
            carbs: number | null;
        }[];
    }>;
    notes(user: {
        id: string;
    }, id: string, dto: NoteDto): Promise<{
        id: string;
        createdAt: Date;
        notes: string | null;
        clientId: string;
        coachId: string;
    }>;
}
export {};
