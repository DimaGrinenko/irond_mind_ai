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

export type AiSource = 'llm' | 'rules';

export interface AiProviderInfo {
  enabled: boolean;
  label: string | null;
  model: string | null;
  /** Есть запасной бесплатный Groq, если DeepSeek упадёт */
  hasFreeFallback?: boolean;
}

type Backend = 'anthropic' | 'openai';

type ResolvedProvider = {
  backend: Backend;
  apiKey: string;
  model: string;
  label: string;
  baseUrl?: string;
};

/** Пресеты OpenAI-compatible API (DeepSeek, Groq, OpenRouter, …). */
const PRESETS: Record<
  string,
  { baseUrl: string; defaultModel: string; label: string }
> = {
  deepseek: {
    baseUrl: 'https://api.deepseek.com',
    defaultModel: 'deepseek-chat',
    label: 'DeepSeek',
  },
  groq: {
    baseUrl: 'https://api.groq.com/openai/v1',
    defaultModel: 'llama-3.3-70b-versatile',
    label: 'Groq',
  },
  openrouter: {
    baseUrl: 'https://openrouter.ai/api/v1',
    defaultModel: 'deepseek/deepseek-chat',
    label: 'OpenRouter',
  },
  openai: {
    baseUrl: 'https://api.openai.com/v1',
    defaultModel: 'gpt-4o-mini',
    label: 'OpenAI',
  },
};

function normalizeBaseUrl(url: string): string {
  return url.replace(/\/+$/, '');
}

function chatCompletionsUrl(baseUrl: string): string {
  const base = normalizeBaseUrl(baseUrl);
  if (base.endsWith('/v1')) return `${base}/chat/completions`;
  return `${base}/v1/chat/completions`;
}

/**
 * AiProvider — единая точка генерации ответов.
 *
 * AI_PROVIDER=off — только rule-based fallback.
 * AI_PROVIDER=groq — только Groq (бесплатный tier).
 *
 * Без AI_PROVIDER: цепочка DeepSeek → Groq (если оба ключа есть).
 */
@Injectable()
export class AiProvider {
  private readonly logger = new Logger(AiProvider.name);
  private readonly chain: ResolvedProvider[];
  private readonly anthropic: Anthropic | null;
  private readonly forcedOff: boolean;
  private lastError: string | null = null;

  constructor(private readonly env: ConfigService) {
    this.forcedOff = env.get<string>('AI_PROVIDER')?.toLowerCase() === 'off';
    this.chain = this.forcedOff ? [] : this.resolveChain();
    const primary = this.chain[0] ?? null;
    if (primary?.backend === 'anthropic') {
      this.anthropic = new Anthropic({ apiKey: primary.apiKey });
      this.logger.log(`AI enabled: ${primary.label} (${primary.model})`);
    } else {
      this.anthropic = null;
      if (this.chain.length > 0) {
        const names = this.chain.map((c) => c.label).join(' → ');
        this.logger.log(`AI chain: ${names}`);
      } else {
        this.logger.log(
          'AI disabled — set GROQ_API_KEY (free) or DEEPSEEK_API_KEY',
        );
      }
    }
  }

  getInfo(): AiProviderInfo {
    const primary = this.chain[0];
    if (!primary) {
      return { enabled: false, label: null, model: null };
    }
    const hasGroqFallback = this.chain.some(
      (c, i) => i > 0 && c.label === 'Groq',
    );
    return {
      enabled: true,
      label:
        hasGroqFallback && primary.label === 'DeepSeek'
          ? `${primary.label} (+ Groq)`
          : primary.label,
      model: primary.model,
      hasFreeFallback: hasGroqFallback,
    };
  }

  isEnabled(): boolean {
    return this.chain.length > 0;
  }

  getLastError(): string | null {
    return this.lastError;
  }

  async complete(input: AiCompletionInput): Promise<string | null> {
    this.lastError = null;
    if (this.chain.length === 0) return null;

    for (let i = 0; i < this.chain.length; i++) {
      const cfg = this.chain[i];
      const text =
        cfg.backend === 'anthropic'
          ? await this.completeAnthropic(cfg, input)
          : await this.completeOpenAiCompatible(cfg, input);
      if (text) {
        if (i > 0) {
          this.logger.log(`AI fallback succeeded: ${cfg.label}`);
        }
        return text;
      }
    }
    return null;
  }

  private resolveChain(): ResolvedProvider[] {
    const explicit = this.env.get<string>('AI_PROVIDER')?.toLowerCase()?.trim();
    if (explicit && explicit !== 'off') {
      const one = this.resolvePreset(explicit);
      return one ? [one] : [];
    }

    const out: ResolvedProvider[] = [];
    const deepseek = this.resolvePreset('deepseek');
    const groq = this.resolvePreset('groq');
    const openrouter = this.resolvePreset('openrouter');
    const openai = this.resolvePreset('openai');
    const anthropic = this.resolveAnthropic();

    if (deepseek) out.push(deepseek);
    if (groq && !out.some((c) => c.label === groq.label)) out.push(groq);
    if (openrouter && out.length === 0) out.push(openrouter);
    if (openai && out.length === 0) out.push(openai);
    if (anthropic && out.length === 0) out.push(anthropic);

    const custom = this.resolveCustom();
    if (custom && out.length === 0) out.push(custom);

    return out;
  }

  private resolvePreset(name: string): ResolvedProvider | null {
    const preset = PRESETS[name];
    if (!preset) return null;
    const key =
      this.env.get<string>(`${name.toUpperCase()}_API_KEY`) ??
      (name === 'openrouter' ? this.env.get<string>('AI_API_KEY') : undefined);
    if (!key || key.length < 8) return null;
    const modelEnv = this.env.get<string>('AI_MODEL');
    const modelForProvider =
      name === 'groq' && this.env.get<string>('GROQ_MODEL')
        ? this.env.get<string>('GROQ_MODEL')!
        : name === 'deepseek' && this.env.get<string>('DEEPSEEK_MODEL')
          ? this.env.get<string>('DEEPSEEK_MODEL')!
          : modelEnv && this.env.get<string>('AI_PROVIDER') === name
            ? modelEnv
            : preset.defaultModel;
    return {
      backend: 'openai',
      apiKey: key,
      baseUrl: normalizeBaseUrl(
        this.env.get<string>(`${name.toUpperCase()}_BASE_URL`) ??
          (name === 'openrouter' ? this.env.get<string>('AI_BASE_URL') : undefined) ??
          preset.baseUrl,
      ),
      model: modelForProvider,
      label: preset.label,
    };
  }

  private resolveCustom(): ResolvedProvider | null {
    const aiKey = this.env.get<string>('AI_API_KEY');
    const aiBase = this.env.get<string>('AI_BASE_URL');
    if (!aiKey || aiKey.length < 8 || !aiBase) return null;
    return {
      backend: 'openai',
      apiKey: aiKey,
      baseUrl: normalizeBaseUrl(aiBase),
      model: this.env.get<string>('AI_MODEL') ?? 'gpt-4o-mini',
      label: 'Custom',
    };
  }

  private resolveAnthropic(): ResolvedProvider | null {
    const apiKey = this.env.get<string>('ANTHROPIC_API_KEY');
    if (!apiKey || apiKey.length < 10) return null;
    return {
      backend: 'anthropic',
      apiKey,
      model:
        this.env.get<string>('ANTHROPIC_MODEL') ?? 'claude-haiku-4-5-20251001',
      label: 'Anthropic',
    };
  }

  private async completeAnthropic(
    cfg: ResolvedProvider,
    input: AiCompletionInput,
  ): Promise<string | null> {
    if (!this.anthropic) return null;
    try {
      const response = await this.anthropic.messages.create({
        model: cfg.model,
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
          { role: 'user' as const, content: input.userMessage },
        ],
      });
      const textBlock = response.content.find((b) => b.type === 'text');
      if (!textBlock || textBlock.type !== 'text') return null;
      return textBlock.text.trim();
    } catch (err) {
      this.lastError = (err as Error).message;
      this.logger.warn(`Anthropic failed: ${this.lastError}`);
      return null;
    }
  }

  private async completeOpenAiCompatible(
    cfg: ResolvedProvider,
    input: AiCompletionInput,
  ): Promise<string | null> {
    if (!cfg.baseUrl) return null;
    const url = chatCompletionsUrl(cfg.baseUrl);
    const messages = [
      { role: 'system' as const, content: input.systemPrompt },
      ...input.history.map((m) => ({
        role: m.role as 'user' | 'assistant',
        content: m.content,
      })),
      { role: 'user' as const, content: input.userMessage },
    ];

    try {
      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${cfg.apiKey}`,
      };
      if (cfg.label === 'OpenRouter') {
        headers['HTTP-Referer'] =
          this.env.get<string>('OPENROUTER_REFERER') ??
          'http://localhost:4001';
        headers['X-OpenRouter-Title'] =
          this.env.get<string>('OPENROUTER_APP_TITLE') ?? 'Iron Mind AI';
      }

      const res = await fetch(url, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          model: cfg.model,
          messages,
          max_tokens: 1024,
          temperature: 0.7,
        }),
        signal: AbortSignal.timeout(90_000),
      });

      const raw = await res.text();
      let data: {
        choices?: Array<{ message?: { content?: string } }>;
        error?: { message?: string };
      };
      try {
        data = JSON.parse(raw) as typeof data;
      } catch {
        this.lastError = `${cfg.label}: invalid JSON (${res.status})`;
        this.logger.warn(`${this.lastError}: ${raw.slice(0, 200)}`);
        return null;
      }

      if (!res.ok) {
        const msg = data.error?.message ?? raw.slice(0, 200);
        this.lastError = `${cfg.label} HTTP ${res.status}: ${msg}`;
        this.logger.warn(this.lastError);
        return null;
      }

      const text = data.choices?.[0]?.message?.content?.trim();
      if (!text) {
        this.lastError = `${cfg.label}: empty response`;
        return null;
      }
      return text;
    } catch (err) {
      this.lastError = `${cfg.label}: ${(err as Error).message}`;
      this.logger.warn(this.lastError);
      return null;
    }
  }
}
