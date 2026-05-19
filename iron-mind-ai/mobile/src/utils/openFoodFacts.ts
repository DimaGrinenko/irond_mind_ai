/**
 * OpenFoodFacts lookup — public API без авторизации.
 * Возвращает КБЖУ на 100 г если есть.
 */
export type OFFProduct = {
  name: string;
  brand?: string;
  kcal: number;
  protein: number;
  fats: number;
  carbs: number;
  barcode: string;
};

export async function lookupOFF(barcode: string): Promise<OFFProduct | null> {
  try {
    const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${encodeURIComponent(barcode)}.json`);
    if (!res.ok) return null;
    const data: any = await res.json();
    if (data.status !== 1 || !data.product) return null;
    const p = data.product;
    const nutr = p.nutriments ?? {};
    const kcal = Number(nutr['energy-kcal_100g'] ?? nutr.energy_100g ?? 0);
    const protein = Number(nutr.proteins_100g ?? 0);
    const fats = Number(nutr.fat_100g ?? 0);
    const carbs = Number(nutr.carbohydrates_100g ?? 0);
    if (!Number.isFinite(kcal) || kcal <= 0) return null;
    return {
      name: p.product_name || p.generic_name || 'Без названия',
      brand: p.brands || undefined,
      kcal: Math.round(kcal),
      protein: Math.round(protein * 10) / 10,
      fats: Math.round(fats * 10) / 10,
      carbs: Math.round(carbs * 10) / 10,
      barcode,
    };
  } catch {
    return null;
  }
}
