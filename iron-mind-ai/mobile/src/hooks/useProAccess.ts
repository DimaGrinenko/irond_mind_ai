import { useUserStore } from '../store/userStore';

export type ProAccessState = {
  /** Доступны ли сейчас Pro-фичи (платная подписка ИЛИ активный trial) */
  hasPro: boolean;
  /** Pro куплен реально */
  isPaid: boolean;
  /** Trial идёт */
  isTrialing: boolean;
  /** Сколько дней осталось у trial. null = нет триала. */
  trialDaysLeft: number | null;
  /** Дата окончания trial (если есть) */
  trialEndsAt: string | null;
};

export function useProAccess(): ProAccessState {
  const tier = useUserStore((s) => s.subscriptionTier);
  const trialEndsAt = useUserStore((s) => s.proTrialEndsAt);
  const isPaid = tier === 'pro' || tier === 'elite';

  let trialDaysLeft: number | null = null;
  let isTrialing = false;
  if (trialEndsAt) {
    const end = new Date(trialEndsAt).getTime();
    const now = Date.now();
    if (end > now) {
      isTrialing = true;
      trialDaysLeft = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
    }
  }

  return {
    hasPro: isPaid || isTrialing,
    isPaid,
    isTrialing,
    trialDaysLeft,
    trialEndsAt,
  };
}
