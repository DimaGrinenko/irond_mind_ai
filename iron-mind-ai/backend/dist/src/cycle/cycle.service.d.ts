import { PrismaService } from '../prisma/prisma.service';
import { UpdateCycleDto } from './dto/update-cycle.dto';
export type CyclePhase = 'menstrual' | 'follicular' | 'ovulation' | 'luteal';
export type CycleState = {
    enabled: boolean;
    lastPeriodStart: string | null;
    cycleLength: number;
    dayOfCycle: number | null;
    phase: CyclePhase | null;
};
export declare function dayOfCycle(lastPeriodStart: string | null, cycleLength: number, now?: Date): number | null;
export declare function phaseForDay(day: number | null, cycleLength?: number): CyclePhase | null;
export declare class CycleService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    private progress;
    get(userId: string): Promise<CycleState>;
    update(userId: string, dto: UpdateCycleDto): Promise<CycleState>;
}
