import { PrismaService } from '../prisma/prisma.service';
import { CreateNutritionEntryDto } from './dto/create-entry.dto';
export declare class NutritionService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string, dateIso?: string): import(".prisma/client").Prisma.PrismaPromise<{
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
    create(userId: string, dto: CreateNutritionEntryDto): import(".prisma/client").Prisma.Prisma__NutritionEntryClient<{
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
    recipeImport(url: string): Promise<{
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
