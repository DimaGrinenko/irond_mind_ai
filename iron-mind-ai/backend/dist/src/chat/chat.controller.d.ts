import { CurrentUserPayload } from '../auth/current-user.decorator';
import { ChatService } from './chat.service';
import { SendChatDto } from './dto/send.dto';
export declare class ChatController {
    private readonly chat;
    constructor(chat: ChatService);
    list(user: CurrentUserPayload, limit?: string): import(".prisma/client").Prisma.PrismaPromise<{
        id: string;
        createdAt: Date;
        role: import(".prisma/client").$Enums.ChatRole;
        userId: string;
        content: string;
    }[]>;
    send(user: CurrentUserPayload, dto: SendChatDto): Promise<{
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
}
