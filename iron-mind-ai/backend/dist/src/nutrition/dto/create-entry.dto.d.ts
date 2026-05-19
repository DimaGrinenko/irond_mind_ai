export declare class CreateNutritionEntryDto {
    date?: string;
    mealType: 'BREAKFAST' | 'LUNCH' | 'DINNER' | 'SNACK';
    name: string;
    calories: number;
    protein?: number;
    fats?: number;
    carbs?: number;
    time?: string;
}
