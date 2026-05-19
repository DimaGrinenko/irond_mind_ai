import { CurrentUserPayload } from '../auth/current-user.decorator';
import { MeasurementsService } from './measurements.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';
export declare class MeasurementsController {
    private readonly measurements;
    constructor(measurements: MeasurementsService);
    list(user: CurrentUserPayload, limit?: string): import(".prisma/client").Prisma.PrismaPromise<{
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
    create(user: CurrentUserPayload, dto: CreateMeasurementDto): import(".prisma/client").Prisma.Prisma__MeasurementClient<{
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
