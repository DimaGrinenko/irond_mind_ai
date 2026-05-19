import { PrismaService } from '../prisma/prisma.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
export declare class MeasurementsService {
    private readonly prisma;
    constructor(prisma: PrismaService);
    list(userId: string, limit?: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        userId: string;
        weight: number | null;
        date: Date;
        chest: number | null;
        waist: number | null;
        hips: number | null;
        biceps: number | null;
        thigh: number | null;
        calf: number | null;
        neck: number | null;
        shoulders: number | null;
        forearm: number | null;
    }[]>;
    create(userId: string, dto: CreateMeasurementDto): import(".prisma/client").Prisma.Prisma__MeasurementClient<{
        id: string;
        createdAt: Date;
        userId: string;
        weight: number | null;
        date: Date;
        chest: number | null;
        waist: number | null;
        hips: number | null;
        biceps: number | null;
        thigh: number | null;
        calf: number | null;
        neck: number | null;
        shoulders: number | null;
        forearm: number | null;
    }, never, import("@prisma/client/runtime/library").DefaultArgs, import(".prisma/client").Prisma.PrismaClientOptions>;
}
