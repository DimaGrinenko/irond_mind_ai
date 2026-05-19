"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.NutritionService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let NutritionService = class NutritionService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(userId, dateIso) {
        const where = { userId };
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
    create(userId, dto) {
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
    async recipeImport(url) {
        const res = await fetch(url, { headers: { 'User-Agent': 'IronMind/1.0' } });
        if (!res.ok)
            throw new Error(`Не удалось загрузить ${url} (${res.status})`);
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
        const lineMatches = stripped.match(/(\d+[.,]?\d*)\s*(г|мл|кг|ст\.?\s*л\.?|ч\.?\s*л\.?|шт\.?|штук|стакан)\s+([а-яёa-z\- ]{3,40})/gi);
        const ingredients = lineMatches?.slice(0, 25).map((line) => {
            const m = line.match(/(\d+[.,]?\d*)\s*(г|мл|кг|ст\.?\s*л\.?|ч\.?\s*л\.?|шт\.?|штук|стакан)\s+([а-яёa-z\- ]+)/i);
            if (!m)
                return null;
            const num = Number(m[1].replace(',', '.'));
            const unit = m[2].toLowerCase();
            const name = m[3].trim();
            const grams = unit.startsWith('кг') ? num * 1000
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
            note: 'Эвристический парсер: распознал только массы/объёмы. ' +
                'Точные КБЖУ нужно дополнить из каталога продуктов вручную.',
        };
    }
};
exports.NutritionService = NutritionService;
exports.NutritionService = NutritionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], NutritionService);
//# sourceMappingURL=nutrition.service.js.map