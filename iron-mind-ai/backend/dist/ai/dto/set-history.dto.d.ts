export declare class SetHistoryItemDto {
    exerciseId: string;
    weight: number;
    reps: number;
    rpeLevel: number;
    performedAt?: string;
}
export declare class SetHistoryDto {
    sets: SetHistoryItemDto[];
}
