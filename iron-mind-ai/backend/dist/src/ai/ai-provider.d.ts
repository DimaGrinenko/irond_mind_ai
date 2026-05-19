import { ConfigService } from '@nestjs/config';
export interface ChatMessage {
    role: 'user' | 'assistant';
    content: string;
}
export interface AiCompletionInput {
    systemPrompt: string;
    history: ChatMessage[];
    userMessage: string;
}
export declare class AiProvider {
    private readonly config;
    private readonly logger;
    private readonly client;
    private readonly model;
    private readonly enabled;
    constructor(config: ConfigService);
    isEnabled(): boolean;
    complete(input: AiCompletionInput): Promise<string | null>;
}
