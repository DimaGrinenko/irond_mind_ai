import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateMeasurementDto } from './dto/create-measurement.dto';

@Injectable()
export class MeasurementsService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string, limit = 90) {
    return this.prisma.measurement.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
      take: Math.min(limit, 365),
    });
  }

  create(userId: string, dto: CreateMeasurementDto) {
    return this.prisma.measurement.create({
      data: {
        userId,
        date: dto.date ? new Date(dto.date) : new Date(),
        weight: dto.weight,
        chest: dto.chest,
        waist: dto.waist,
        hips: dto.hips,
        biceps: dto.biceps,
        thigh: dto.thigh,
        calf: dto.calf,
        neck: dto.neck,
        shoulders: dto.shoulders,
        forearm: dto.forearm,
      },
    });
  }
}
