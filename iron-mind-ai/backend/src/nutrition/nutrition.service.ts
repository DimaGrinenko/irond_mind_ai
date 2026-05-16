import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateNutritionEntryDto } from './dto/create-entry.dto';

@Injectable()
export class NutritionService {
  constructor(private readonly prisma: PrismaService) {}

  list(userId: string, dateIso?: string) {
    const where: any = { userId };
    if (dateIso) {
      const start = new Date(dateIso);
      start.setHours(0, 0, 0, 0);
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      where.date = { gte: start, lt: end };
    }
    return this.prisma.nutritionEntry.findMany({
      where,
      orderBy: [{ date: 'desc' }, { createdAt: 'asc' }],
    });
  }

  create(userId: string, dto: CreateNutritionEntryDto) {
    return this.prisma.nutritionEntry.create({
      data: {
        userId,
        date: dto.date ? new Date(dto.date) : new Date(),
        mealType: dto.mealType,
        name: dto.name,
        calories: dto.calories,
        protein: dto.protein,
        fats: dto.fats,
        carbs: dto.carbs,
        time: dto.time,
      },
    });
  }
}
