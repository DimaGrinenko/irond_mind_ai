import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Anthropic from '@anthropic-ai/sdk';

export interface ChatMessage {
  role: 'user' | 'assistant';
  content: string;
}

export interface AiCompletionInput {
  systemPrompt: string;
  history: ChatMessage[];
  userMessage: string;
}

/**
 * AiProvider — единая точка генерации ответов.
 *
 * Если в .env задан ANTHROPIC_API_KEY — используется Claude через Anthropic SDK
 * с включённым prompt caching. Если ключа нет — возвращается null, и сервис
 * (chat/coach/ai) должен использовать свой rule-based fallback.
 */
@Injectable()
export class AiProvider {
  private readonly logger = new Logger(AiProvider.name);
  private readonly client: Anthropic | null;
  private readonly model: string;
  private readonly enabled: boolean;

  constructor(private readonly config: ConfigService) {
    const apiKey = this.config.get<string>('ANTHROPIC_API_KEY');
    this.model = this.config.get<string>('ANTHROPIC_MODEL') ?? 'claude-haiku-4-5-20251001';
    if (apiKey && apiKey.length > 10) {
      this.client = new Anthropic({ apiKey });
      this.enabled = true;
      this.logger.log(`Anthropic provider enabled (model: ${this.model})`);
    } else {
      this.client = null;
      this.enabled = false;
      this.logger.log('Anthropic provider disabled — set ANTHROPIC_API_KEY to enable Claude');
    }
  }

  isEnabled(): boolean {
    return this.enabled;
  }

  async complete(input: AiCompletionInput): Promise<string | null> {
    if (!this.client) return null;

    try {
      const response = await this.client.messages.create({
        model: this.model,
        max_tokens: 1024,
        system: [
          {
            type: 'text',
            text: input.systemPrompt,
            cache_control: { type: 'ephemeral' },
          },
        ],
        messages: [
          ...input.history.map((m) => ({
            role: m.role,
            content: m.content,
          })),
          {
            role: 'user' as const,
            content: input.userMessage,
          },
        ],
      });

      const textBlock = response.content.find((b) => b.type === 'text');
      if (!textBlock || textBlock.type !== 'text') return null;
      return textBlock.text;
    } catch (err) {
      this.logger.warn(`Anthropic call failed: ${(err as Error).message}`);
      return null;
    }
  }
}
