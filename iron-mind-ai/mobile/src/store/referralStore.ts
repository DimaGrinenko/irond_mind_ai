import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

function genCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  return 'IRON-' + Array.from({ length: 4 }, () => chars[Math.floor(Math.random() * chars.length)]).join('');
}

type State = {
  /** Мой реф-код (показывается друзьям) */
  myCode: string;
  /** Применённый чужой код (один раз за пользователя) */
  appliedCode: string | null;
  /** Список юзеров, использовавших мой код (для отображения «приглашено N друзей») */
  invitedUsers: string[];
  applyCode: (code: string) => { ok: boolean; reason?: string };
  registerInvited: (handle: string) => void;
};

export const useReferralStore = create<State>()(
  persist(
    (set, get) => ({
      myCode: genCode(),
      appliedCode: null,
      invitedUsers: [],
      applyCode: (code) => {
        const normalized = code.trim().toUpperCase();
        if (!normalized) return { ok: false, reason: 'empty' };
        if (get().appliedCode) return { ok: false, reason: 'already_used' };
        if (normalized === get().myCode) return { ok: false, reason: 'self' };
        // В демо принимаем любой валидно-выглядящий код
        if (!/^IRON-[A-Z0-9]{4}$/.test(normalized)) return { ok: false, reason: 'invalid' };
        set({ appliedCode: normalized });
        return { ok: true };
      },
      registerInvited: (handle) => set({ invitedUsers: [...get().invitedUsers, handle] }),
    }),
    {
      name: 'ai_trainer_referral',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
