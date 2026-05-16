import { Module } from '@nestjs/common';
import { StatsModule } from '../stats/stats.module';
import { CoachController } from './coach.controller';
import { CoachService } from './coach.service';

@Module({
  imports: [StatsModule],
  controllers: [CoachController],
  providers: [CoachService],
})
export class CoachModule {}
