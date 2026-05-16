import { Body, Controller, Post } from '@nestjs/common';
import { SetHistoryDto } from './dto/set-history.dto';
import { AiService } from './ai.service';
import { AiRecommendation } from './types';

@Controller('ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  @Post('recommendation')
  recommend(@Body() body: SetHistoryDto): AiRecommendation {
    return this.ai.recommendFromHistory(body.sets);
  }
}

