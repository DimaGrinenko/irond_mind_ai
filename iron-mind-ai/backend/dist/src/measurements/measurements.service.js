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
exports.MeasurementsService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let MeasurementsService = class MeasurementsService {
    prisma;
    constructor(prisma) {
        this.prisma = prisma;
    }
    list(userId, limit = 90) {
        return this.prisma.measurement.findMany({
            where: { userId },
            orderBy: { date: 'desc' },
            take: Math.min(limit, 365),
        });
    }
    create(userId, dto) {
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
};
exports.MeasurementsService = MeasurementsService;
exports.MeasurementsService = MeasurementsService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], MeasurementsService);
//# sourceMappingURL=measurements.service.js.map