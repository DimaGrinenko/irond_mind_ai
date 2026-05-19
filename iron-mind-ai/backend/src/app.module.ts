import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PrismaModule } from './prisma/prisma.module';
import { AiModule } from './ai/ai.module';
import { AuthModule } from './auth/auth.module';
import { UsersModule } from './users/users.module';
import { ProgramsModule } from './programs/programs.module';
import { WorkoutsModule } from './workouts/workouts.module';
import { MeasurementsModule } from './measurements/measurements.module';
import { NutritionModule } from './nutrition/nutrition.module';
import { ChatModule } from './chat/chat.module';
import { StatsModule } from './stats/stats.module';
import { AdminModule } from './admin/admin.module';
import { CoachModule } from './coach/coach.module';
import { OnboardingModule } from './onboarding/onboarding.module';
import { AchievementsModule } from './achievements/achievements.module';
import { ScheduleModule } from './schedule/schedule.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ThrottlerModule.forRoot([
      { name: 'default', ttl: 60_000, limit: 5000 },
      { name: 'auth', ttl: 60_000, limit: 30 },
    ]),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProgramsModule,
    WorkoutsModule,
    MeasurementsModule,
    NutritionModule,
    ChatModule,
    AiModule,
    StatsModule,
    AdminModule,
    CoachModule,
    OnboardingModule,
    AchievementsModule,
    ScheduleModule,
  ],
  controllers: [AppController],
  providers: [
    AppService,
    { provide: APP_GUARD, useClass: ThrottlerGuard },
  ],
})
export class AppModule {}
