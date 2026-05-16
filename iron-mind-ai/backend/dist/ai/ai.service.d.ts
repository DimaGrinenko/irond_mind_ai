import { SetHistoryItemDto } from './dto/set-history.dto';
import { AiRecommendation } from './types';
export declare class AiService {
    recommendFromHistory(sets: SetHistoryItemDto[]): AiRecommendation;
}
