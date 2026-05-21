export type ShopCategory = 'tree' | 'dumbbell' | 'accent';
export type ShopItemDef = {
    id: string;
    category: ShopCategory;
    price: number;
};
export declare const SHOP_ITEMS: ShopItemDef[];
export declare function shopItem(id: string): ShopItemDef | undefined;
export declare const WHEEL_SECTORS: Array<{
    value: number;
    weight: number;
}>;
export declare function wheelMultiplier(streakDays: number): number;
export declare function rollWheel(): number;
export declare const LEAVES_PER_WORKOUT = 25;
export declare function isoDay(d?: Date): string;
export declare function yesterdayIso(): string;
