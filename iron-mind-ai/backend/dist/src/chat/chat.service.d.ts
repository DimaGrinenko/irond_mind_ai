import { PrismaService } from '../prisma/prisma.service';
import { AiProvider } from '../ai/ai-provider';
import { CycleService } from '../cycle/cycle.service';
export declare class ChatService {
    private readonly prisma;
    private readonly ai;
    private readonly cycle;
    constructor(prisma: PrismaService, ai: AiProvider, cycle: CycleService);
    list(userId: string, limit?: number): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        role: import(".prisma/client").$Enums.ChatRole;
        userId: string;
        content: string;
    }[]>;
    send(userId: string, content: string): Promise<{
        userMsg: {
            id: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.ChatRole;
            userId: string;
            content: string;
        };
        aiMsg: {
            id: string;
            createdAt: Date;
            role: import(".prisma/client").$Enums.ChatRole;
            userId: string;
            content: string;
        };
    }>;
    private generateReply;
    private fallbackReply;
}
