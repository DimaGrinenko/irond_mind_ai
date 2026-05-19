import { SetHistoryDto } from './dto/set-history.dto';
import { AiService } from './ai.service';
import { AiRecommendation } from './types';
export declare class AiController {
    private readonly ai;
    constructor(ai: AiService);
    recommend(body: SetHistoryDto): AiRecommendation;
}
