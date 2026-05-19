"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppModule = void 0;
const common_1 = require("@nestjs/common");
const config_1 = require("@nestjs/config");
const throttler_1 = require("@nestjs/throttler");
const core_1 = require("@nestjs/core");
const app_controller_1 = require("./app.controller");
const app_service_1 = require("./app.service");
const prisma_module_1 = require("./prisma/prisma.module");
const ai_module_1 = require("./ai/ai.module");
const auth_module_1 = require("./auth/auth.module");
const users_module_1 = require("./users/users.module");
const programs_module_1 = require("./programs/programs.module");
const workouts_module_1 = require("./workouts/workouts.module");
const measurements_module_1 = require("./measurements/measurements.module");
const nutrition_module_1 = require("./nutrition/nutrition.module");
const chat_module_1 = require("./chat/chat.module");
const stats_module_1 = require("./stats/stats.module");
const admin_module_1 = require("./admin/admin.module");
const coach_module_1 = require("./coach/coach.module");
const onboarding_module_1 = require("./onboarding/onboarding.module");
const achievements_module_1 = require("./achievements/achievements.module");
const schedule_module_1 = require("./schedule/schedule.module");
let AppModule = class AppModule {
};
exports.AppModule = AppModule;
exports.AppModule = AppModule = __decorate([
    (0, common_1.Module)({
        imports: [
            config_1.ConfigModule.forRoot({ isGlobal: true }),
            throttler_1.ThrottlerModule.forRoot([
                { name: 'default', ttl: 60_000, limit: 5000 },
                { name: 'auth', ttl: 60_000, limit: 30 },
            ]),
            prisma_module_1.PrismaModule,
            auth_module_1.AuthModule,
            users_module_1.UsersModule,
            programs_module_1.ProgramsModule,
            workouts_module_1.WorkoutsModule,
            measurements_module_1.MeasurementsModule,
            nutrition_module_1.NutritionModule,
            chat_module_1.ChatModule,
            ai_module_1.AiModule,
            stats_module_1.StatsModule,
            admin_module_1.AdminModule,
            coach_module_1.CoachModule,
            onboarding_module_1.OnboardingModule,
            achievements_module_1.AchievementsModule,
            schedule_module_1.ScheduleModule,
        ],
        controllers: [app_controller_1.AppController],
        providers: [
            app_service_1.AppService,
            { provide: core_1.APP_GUARD, useClass: throttler_1.ThrottlerGuard },
        ],
    })
], AppModule);
//# sourceMappingURL=app.module.js.map