/**
 * Server-owned economy catalog. The mobile app has display metadata
 * (titles/emoji/colors); the server is the source of truth for prices,
 * categories and wheel odds (anti-cheat).
 */

export type ShopCategory = 'tree' | 'dumbbell' | 'accent';

export type ShopItemDef = {
  id: string;
  category: ShopCategory;
  price: number;
};

export const SHOP_ITEMS: ShopItemDef[] = [
  { id: 'tree_skin_aurora', category: 'tree', price: 300 },
  { id: 'tree_skin_gold', category: 'tree', price: 500 },
  { id: 'tree_skin_neon_red', category: 'tree', price: 400 },
  { id: 'dumbbell_chrome', category: 'dumbbell', price: 200 },
  { id: 'dumbbell_gold', category: 'dumbbell', price: 450 },
  { id: 'accent_cyan', category: 'accent', price: 100 },
  { id: 'accent_pink', category: 'accent', price: 100 },
  { id: 'accent_amber', category: 'accent', price: 100 },
];

export function shopItem(id: string): ShopItemDef | undefined {
  return SHOP_ITEMS.find((i) => i.id === id);
}

/** Daily wheel sectors (value = leaves, weight = relative probability). */
export const WHEEL_SECTORS: Array<{ value: number; weight: number }> = [
  { value: 10, weight: 28 },
  { value: 25, weight: 22 },
  { value: 50, weight: 18 },
  { value: 75, weight: 14 },
  { value: 100, weight: 10 },
  { value: 200, weight: 5 },
  { value: 500, weight: 2 },
  { value: 1000, weight: 1 },
];

/** Streak multiplier for consecutive daily spins. */
export function wheelMultiplier(streakDays: number): number {
  if (streakDays >= 7) return 2;
  if (streakDays >= 5) return 1.5;
  if (streakDays >= 3) return 1.25;
  return 1;
}

/** Pick a sector index by weight (server-side RNG). */
export function rollWheel(): number {
  const total = WHEEL_SECTORS.reduce((s, x) => s + x.weight, 0);
  let r = Math.random() * total;
  for (let i = 0; i < WHEEL_SECTORS.length; i++) {
    r -= WHEEL_SECTORS[i].weight;
    if (r <= 0) return i;
  }
  return 0;
}

/** Leaves awarded for completing a workout. */
export const LEAVES_PER_WORKOUT = 25;

/** "YYYY-MM-DD" for a date (UTC-based, stable on the server). */
export function isoDay(d = new Date()): string {
  return d.toISOString().slice(0, 10);
}

export function yesterdayIso(): string {
  const d = new Date();
  d.setUTCDate(d.getUTCDate() - 1);
  return d.toISOString().slice(0, 10);
}
