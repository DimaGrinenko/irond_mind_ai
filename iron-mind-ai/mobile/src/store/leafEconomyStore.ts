import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';

export type ShopItemId =
  | 'tree_skin_aurora'
  | 'tree_skin_gold'
  | 'tree_skin_neon_red'
  | 'dumbbell_chrome'
  | 'dumbbell_gold'
  | 'accent_cyan'
  | 'accent_pink'
  | 'accent_amber';

export type ShopItem = {
  id: ShopItemId;
  title: string;
  description: string;
  emoji: string;
  category: 'tree' | 'dumbbell' | 'accent';
  price: number;
};

export const SHOP_ITEMS: ShopItem[] = [
  { id: 'tree_skin_aurora', title: 'Аурора-дерево', description: 'Переливающаяся радужная крона', emoji: '🌈', category: 'tree', price: 300 },
  { id: 'tree_skin_gold',   title: 'Золотое дерево', description: 'Крона из чистого золота', emoji: '✨', category: 'tree', price: 500 },
  { id: 'tree_skin_neon_red', title: 'Кибер-красное', description: 'Дерево из неона багровых тонов', emoji: '🌹', category: 'tree', price: 400 },
  { id: 'dumbbell_chrome',  title: 'Хром-гантеля', description: 'Зеркальный металл для streak-иконки', emoji: '🪞', category: 'dumbbell', price: 200 },
  { id: 'dumbbell_gold',    title: 'Золотая гантеля', description: 'Для тех у кого стрик 60+', emoji: '🏆', category: 'dumbbell', price: 450 },
  { id: 'accent_cyan',      title: 'Циан-акцент', description: 'Кнопки и подсветки в циан', emoji: '🟦', category: 'accent', price: 100 },
  { id: 'accent_pink',      title: 'Пинк-акцент', description: 'Кнопки и подсветки в пинк', emoji: '🟪', category: 'accent', price: 100 },
  { id: 'accent_amber',     title: 'Амбер-акцент', description: 'Кнопки и подсветки в янтарь', emoji: '🟧', category: 'accent', price: 100 },
];

export type LeafPack = {
  id: string;
  leaves: number;
  /** Цена в USD — конвертируется в локальную валюту через currencyStore. */
  priceUsd: number;
  /** Анкер: «была такая цена» — зачёркивается, показывает % скидки. */
  priceWasUsd?: number;
  bonus: number;
  /** Категория для визуального превью пакета */
  tier: 'starter' | 'small' | 'medium' | 'large' | 'mega';
  /** Бейдж: best value / popular / starter / etc */
  badge?: 'popular' | 'best_value' | 'limited';
};

/**
 * Decoy-структура: Medium намеренно дороже за лист чем Large (39 коп/лист vs 31).
 * Это толкает к Large, который выглядит «выгодным».
 * Anchor: priceWasUsd показывает зачёркнутую «обычную» цену.
 */
export const LEAF_PACKS: LeafPack[] = [
  { id: 'pack_starter', leaves: 200,   priceUsd: 0.99,                       bonus: 0,    tier: 'starter' },
  { id: 'pack_small',   leaves: 600,   priceUsd: 2.49,  priceWasUsd: 3.49,   bonus: 50,   tier: 'small' },
  { id: 'pack_medium',  leaves: 1500,  priceUsd: 5.99,  priceWasUsd: 7.99,   bonus: 200,  tier: 'medium', badge: 'popular' },
  { id: 'pack_large',   leaves: 3500,  priceUsd: 9.99,  priceWasUsd: 14.99,  bonus: 700,  tier: 'large',  badge: 'best_value' },
  { id: 'pack_mega',    leaves: 10000, priceUsd: 24.99, priceWasUsd: 39.99,  bonus: 3000, tier: 'mega',   badge: 'limited' },
];

type State = {
  leaves: number;
  owned: ShopItemId[];
  equipped: { tree?: ShopItemId; dumbbell?: ShopItemId; accent?: ShopItemId };
  earn: (amount: number, reason?: string) => void;
  spend: (amount: number) => boolean;
  buy: (id: ShopItemId) => { ok: boolean; reason?: string };
  equip: (id: ShopItemId) => void;
  unequip: (cat: 'tree' | 'dumbbell' | 'accent') => void;
  /** Купить пакет листиков за рубли (mock — без реальной интеграции платежей). */
  buyPack: (packId: string) => { ok: boolean; granted: number };
};

export const useLeafEconomyStore = create<State>()(
  persist(
    (set, get) => ({
      leaves: 0,
      owned: [],
      equipped: {},
      earn: (amount) => set({ leaves: get().leaves + amount }),
      spend: (amount) => {
        if (get().leaves < amount) return false;
        set({ leaves: get().leaves - amount });
        return true;
      },
      buy: (id) => {
        if (get().owned.includes(id)) return { ok: false, reason: 'Уже куплено' };
        const item = SHOP_ITEMS.find((s) => s.id === id);
        if (!item) return { ok: false, reason: 'Нет такого' };
        if (get().leaves < item.price) return { ok: false, reason: 'Не хватает листиков' };
        set({ leaves: get().leaves - item.price, owned: [...get().owned, id] });
        // авто-надеваем при первой покупке
        const eq = { ...get().equipped };
        eq[item.category] = id;
        set({ equipped: eq });
        return { ok: true };
      },
      equip: (id) => {
        const item = SHOP_ITEMS.find((s) => s.id === id);
        if (!item || !get().owned.includes(id)) return;
        set({ equipped: { ...get().equipped, [item.category]: id } });
      },
      unequip: (cat) => {
        const eq = { ...get().equipped };
        delete eq[cat];
        set({ equipped: eq });
      },
      buyPack: (packId) => {
        const pack = LEAF_PACKS.find((p) => p.id === packId);
        if (!pack) return { ok: false, granted: 0 };
        const granted = pack.leaves + pack.bonus;
        set({ leaves: get().leaves + granted });
        return { ok: true, granted };
      },
    }),
    {
      name: 'ai_trainer_leaves',
      storage: createJSONStorage(() => AsyncStorage),
      version: 1,
    },
  ),
);
