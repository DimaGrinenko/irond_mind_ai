import { CurrentUserPayload } from '../auth/current-user.decorator';
import { CycleService } from './cycle.service';
import { UpdateCycleDto } from './dto/update-cycle.dto';
export declare class CycleController {
    private readonly svc;
    constructor(svc: CycleService);
    get(user: CurrentUserPayload): Promise<import("./cycle.service").CycleState>;
    update(user: CurrentUserPayload, dto: UpdateCycleDto): Promise<import("./cycle.service").CycleState>;
}
