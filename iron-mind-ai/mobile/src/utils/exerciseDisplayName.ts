import { exercises as catalog } from '../data/exercises';

/** Имя упражнения: из API, локальный каталог по slug, иначе читаемый fallback. */
export function exerciseDisplayName(
  exerciseId: string,
  apiName?: string | null,
  slug?: string | null,
): string {
  if (apiName?.trim()) return apiName.trim();
  const slugKey = slug?.trim() || (exerciseId.includes('_') ? exerciseId : null);
  const bySlug = catalog.find(
    (e) => e.id === exerciseId || (slugKey != null && e.id === slugKey),
  );
  if (bySlug) return bySlug.name;
  if (slugKey) return slugKey.replace(/_/g, ' ');
  if (exerciseId.length > 20) return '';
  return exerciseId.replace(/_/g, ' ');
}
