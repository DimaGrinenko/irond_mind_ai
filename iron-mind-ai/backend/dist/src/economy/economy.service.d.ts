import { PrismaService } from '../prisma/prisma.service';
export type Wallet = {
    leaves: number;
    owned: Array<{
        itemId: string;
        equipped: string | null;
    }>;
    equipped: {
        tree: string | null;
        dumbbell: string | null;
        accent: string | null;
    };
    canSpinToday: boolean;
    wheelStreak: number;
};
export declare class EconomyService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private progress;
    getWallet(userId: string): Promise<Wallet>;
    spinWheel(userId: string): Promise<{
        value: number;
        multiplier: number;
        total: number;
        sectorIndex: number;
        leaves: number;
        wheelStreak: number;
    }>;
    buy(userId: string, itemId: string): Promise<Wallet>;
    equip(userId: string, itemId: string): Promise<Wallet>;
    unequip(userId: string, itemId: string): Promise<Wallet>;
    catalog(): import("./economy.constants").ShopItemDef[];
}
