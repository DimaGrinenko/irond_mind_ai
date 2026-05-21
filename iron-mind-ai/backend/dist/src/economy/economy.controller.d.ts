import { CurrentUserPayload } from '../auth/current-user.decorator';
import { EconomyService } from './economy.service';
import { ShopItemDto } from './dto/shop-item.dto';
export declare class EconomyController {
    private readonly svc;
    constructor(svc: EconomyService);
    wallet(user: CurrentUserPayload): Promise<import("./economy.service").Wallet>;
    shop(): import("./economy.constants").ShopItemDef[];
    spin(user: CurrentUserPayload): Promise<{
        value: number;
        multiplier: number;
        total: number;
        sectorIndex: number;
        leaves: number;
        wheelStreak: number;
    }>;
    buy(user: CurrentUserPayload, dto: ShopItemDto): Promise<import("./economy.service").Wallet>;
    equip(user: CurrentUserPayload, dto: ShopItemDto): Promise<import("./economy.service").Wallet>;
    unequip(user: CurrentUserPayload, dto: ShopItemDto): Promise<import("./economy.service").Wallet>;
}
