import { CurrentUserPayload } from '../auth/current-user.decorator';
import { NutritionService } from './nutrition.service';
import { CreateNutritionEntryDto } from './dto/create-entry.dto';
export declare class NutritionController {
    private readonly nutrition;
    constructor(nutrition: NutritionService);
    list(user: CurrentUserPayload, date?: string): import(".prisma/client").Prisma.PrismaPromise<{
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
    }[]>;
    create(user: CurrentUserPayload, dto: CreateNutritionEntryDto): import(".prisma/client").Prisma.Prisma__NutritionEntryClient<{
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
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
    recipeImport(body: {
        url?: string;
    }): Promise<{
        url: string;
        title: string;
        ingredients: ({
            name: string;
            grams: number;
            raw: string;
        } | null)[];
        note: string;
    }>;
}
