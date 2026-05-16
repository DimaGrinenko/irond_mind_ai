import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createJSONStorage } from 'zustand/middleware';
import { api } from '../api/client';
import { useAuthStore } from './authStore';

export type ChatRole = 'user' | 'assistant';
export type ChatMessage = { id: string; role: ChatRole; content: string; timestamp: string };

function nowIso() {
  return new Date().toISOString();
}

let msgSeq = 0;
function nextId(prefix: string) {
  msgSeq += 1;
  return `${prefix}-${Date.now()}-${msgSeq}`;
}

function replyFor(text: string) {
  const t = text.trim().toLowerCase();
  if (/масс|набор/.test(t)) {
    return 'Отлично! Для набора массы важны: прогрессия нагрузок, профицит калорий и восстановление. Хочешь — подберу план на неделю?';
  }
  if (/питан|калор|кбжу/.test(t)) {
    return 'По питанию: держи небольшой профицит и цель по белку 1.6–2.2 г/кг. Скажи вес — прикину КБЖУ.';
  }
  if (/программ/.test(t)) {
    return 'Могу предложить программу под цель и уровень. Ты хочешь масса/рельеф/сила/выносливость/пресс?';
  }
  if (/сон/.test(t)) {
    return 'Сон — это твой “анаболик”. Цель: 7.5–9 часов, стабильный режим и меньше экрана за 60 минут до сна.';
  }
  if (/мотив/.test(t)) {
    return 'Дисциплина важнее мотивации. Сделай сегодня минимум — и ты уже выигрываешь.';
  }
  return 'Расскажи подробнее, я помогу подобрать решение.';
}

export type ChatState = {
  messages: ChatMessage[];
  send: (content: string) => Promise<void>;
  reset: () => void;
  syncFromServer: () => Promise<void>;
};

export const useChatStore = create<ChatState>()(
  persist(
    (set, get) => ({
      messages: [
        {
          id: 'm1',
          role: 'assistant',
          content: 'Привет! Я твой AI тренер Iron Mind. Чем могу помочь сегодня?',
          timestamp: nowIso(),
        },
      ],
      send: async (content) => {
        const trimmed = content.trim();
        if (!trimmed) return;
        const userMsg: ChatMessage = { id: nextId('u'), role: 'user', content: trimmed, timestamp: nowIso() };
        set({ messages: [...get().messages, userMsg] });

        const online = useAuthStore.getState().online;
        if (online) {
          try {
            const res = await api.chat.send(trimmed);
            const aiMsg: ChatMessage = {
              id: res?.aiMsg?.id ?? nextId('a'),
              role: 'assistant',
              content: res?.aiMsg?.content ?? replyFor(trimmed),
              timestamp: res?.aiMsg?.createdAt ?? nowIso(),
            };
            set({ messages: [...get().messages, aiMsg] });
            return;
          } catch {
            /* fallback local */
          }
        }

        const aiMsg: ChatMessage = {
          id: nextId('a'),
          role: 'assistant',
          content: replyFor(trimmed),
          timestamp: nowIso(),
        };
        set({ messages: [...get().messages, userMsg, aiMsg] });
      },
      syncFromServer: async () => {
        if (!useAuthStore.getState().online) return;
        try {
          const rows = await api.chat.list();
          if (!rows?.length) return;
          set({
            messages: rows.map((r: any) => ({
              id: r.id,
              role: r.role === 'ASSISTANT' ? 'assistant' : 'user',
              content: r.content,
              timestamp: r.createdAt ?? nowIso(),
            })),
          });
        } catch {
          /* keep local */
        }
      },
      reset: () => set({ messages: [] }),
    }),
    {
      name: 'ai_trainer_chat',
      storage: createJSONStorage(() => AsyncStorage),
      version: 2,
    },
  ),
);
