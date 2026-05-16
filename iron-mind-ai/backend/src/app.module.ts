import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
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
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
