import { Module } from '@nestjs/common';
import { ChatController } from './chat.controller';
import { ChatService } from './chat.service';
import { AiModule } from '../ai/ai.module';
import { CycleModule } from '../cycle/cycle.module';

@Module({
  imports: [AiModule, CycleModule],
  controllers: [ChatController],
  providers: [ChatService],
})
export class ChatModule {}
