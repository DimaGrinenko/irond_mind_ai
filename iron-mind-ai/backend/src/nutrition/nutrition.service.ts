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

  /**
   * Импорт рецепта: тянем HTML по URL, выдираем заголовок и текст рецепта,
   * прогоняем простой эвристический парсер ингредиентов и считаем приблизительные КБЖУ.
   * (Без внешнего AI provider — простая локальная эвристика.)
   */
  async recipeImport(url: string) {
    const res = await fetch(url, { headers: { 'User-Agent': 'IronMind/1.0' } });
    if (!res.ok) throw new Error(`Не удалось загрузить ${url} (${res.status})`);
    const html = await res.text();
    const stripped = html
      .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, ' ')
      .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, ' ')
      .replace(/<[^>]+>/g, ' ')
      .replace(/&nbsp;/gi, ' ')
      .replace(/\s+/g, ' ')
      .trim();

    const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : 'Рецепт';

    // Ищем строки вида «100 г куриного филе» или «2 ст. л. оливкового масла».
    const lineMatches = stripped.match(
      /(\d+[.,]?\d*)\s*(г|мл|кг|ст\.?\s*л\.?|ч\.?\s*л\.?|шт\.?|штук|стакан)\s+([а-яёa-z\- ]{3,40})/gi,
    );
    const ingredients =
      lineMatches?.slice(0, 25).map((line) => {
        const m = line.match(/(\d+[.,]?\d*)\s*(г|мл|кг|ст\.?\s*л\.?|ч\.?\s*л\.?|шт\.?|штук|стакан)\s+([а-яёa-z\- ]+)/i);
        if (!m) return null;
        const num = Number(m[1].replace(',', '.'));
        const unit = m[2].toLowerCase();
        const name = m[3].trim();
        const grams =
          unit.startsWith('кг') ? num * 1000
          : unit.startsWith('г') ? num
          : unit.includes('мл') ? num
          : unit.includes('стакан') ? num * 240
          : unit.includes('ст') ? num * 15
          : unit.includes('ч') ? num * 5
          : unit.includes('шт') ? num * 60
          : num;
        return { name, grams: Math.round(grams), raw: line };
      }).filter(Boolean) ?? [];

    return {
      url,
      title,
      ingredients,
      note:
        'Эвристический парсер: распознал только массы/объёмы. ' +
        'Точные КБЖУ нужно дополнить из каталога продуктов вручную.',
    };
  }
}
