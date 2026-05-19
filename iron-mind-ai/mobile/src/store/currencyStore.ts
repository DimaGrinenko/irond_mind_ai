import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Platform } from 'react-native';

export type Currency = 'USD' | 'EUR' | 'RUB' | 'BYN';

export const RATES_TO_USD: Record<Currency, number> = {
  USD: 1,
  EUR: 0.93,
  RUB: 92,
  BYN: 3.2,
};

export const CURRENCY_INFO: Record<Currency, { symbol: string; flag: string; label: string }> = {
  USD: { symbol: '$', flag: '🇺🇸', label: 'US Dollar' },
  EUR: { symbol: '€', flag: '🇪🇺', label: 'Euro' },
  RUB: { symbol: '₽', flag: '🇷🇺', label: 'Russian Ruble' },
  BYN: { symbol: 'Br', flag: '🇧🇾', label: 'Belarusian Ruble' },
};

/** Конвертация цены из USD в выбранную валюту (с округлением). */
export function fromUsd(amountUsd: number, currency: Currency): number {
  const raw = amountUsd * RATES_TO_USD[currency];
  if (currency === 'RUB') return Math.round(raw / 10) * 10; // округлим до 10 ₽
  if (currency === 'BYN') return Math.round(raw * 10) / 10;
  return Math.round(raw * 100) / 100;
}

/** Форматирование цены. */
export function fmtPrice(amountUsd: number, currency: Currency): string {
  const value = fromUsd(amountUsd, currency);
  const info = CURRENCY_INFO[currency];
  if (currency === 'USD' || currency === 'EUR') return `${info.symbol}${value.toFixed(2)}`;
  if (currency === 'BYN') return `${value.toFixed(1)} ${info.symbol}`;
  return `${Math.round(value)} ${info.symbol}`;
}

function detectFromLocale(): Currency {
  try {
    if (Platform.OS === 'web' && typeof navigator !== 'undefined') {
      const lang = navigator.language || 'en-US';
      const region = lang.split('-')[1]?.toUpperCase() || lang.split('_')[1]?.toUpperCase();
      if (region === 'RU') return 'RUB';
      if (region === 'BY') return 'BYN';
      if (
        region === 'DE' || region === 'FR' || region === 'ES' || region === 'IT' || region === 'NL' ||
        region === 'PT' || region === 'AT' || region === 'BE' || region === 'IE' || region === 'GR' ||
        region === 'FI' || region === 'EE' || region === 'LV' || region === 'LT'
      ) return 'EUR';
      return 'USD';
    }
  } catch {
    /* noop */
  }
  return 'USD';
}

type State = {
  currency: Currency;
  autoDetected: boolean;
  setCurrency: (c: Currency) => void;
};

export const useCurrencyStore = create<State>()(
  persist(
    (set) => ({
      currency: detectFromLocale(),
      autoDetected: true,
      setCurrency: (currency) => set({ currency, autoDetected: false }),
    }),
    {
      name: 'ai_trainer_currency',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
