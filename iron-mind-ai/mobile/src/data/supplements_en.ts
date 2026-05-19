import type { Supplement } from './supplements';

type SupplementEn = Partial<
  Pick<
    Supplement,
    | 'name'
    | 'whatIs'
    | 'effect'
    | 'dosage'
    | 'cycle'
    | 'goodFor'
    | 'cautions'
    | 'sideEffects'
    | 'legality'
    | 'pct'
    | 'labs'
  >
>;

export const SUPPLEMENTS_EN: Record<string, SupplementEn> = {
  whey_protein: {
    name: 'Whey Protein',
    whatIs:
      'Fast-digesting milk-derived protein. Complete amino profile with high BCAA and leucine content.',
    effect:
      'Activates mTOR — the main muscle growth pathway. Covers the post-workout "anabolic window". Helps hit daily protein target (1.6–2.2 g/kg for lifters).',
    dosage: '20–40 g per serving, 1–2 servings per day',
    cycle: 'Continuous, no cycling needed',
    goodFor: ['Muscle gain', 'Preserving muscle on a cut', 'Recovery'],
    cautions: 'Lactose intolerance — pick isolate or plant-based protein',
  },
  creatine_monohydrate: {
    name: 'Creatine Monohydrate',
    whatIs:
      'The most studied sports supplement. Natural compound, accumulates in muscle as phosphocreatine.',
    effect:
      'Regenerates ATP during intense effort → +5–10% strength and +1–2 reps per set. Increases cell volume (slight water retention). Improves cognitive function.',
    dosage: '5 g per day (no loading) or 20 g × 5 days loading, then 3–5 g maintenance',
    cycle: 'Continuous, no side effects from long-term use documented',
    goodFor: ['Strength', 'Muscle gain', 'Anaerobic endurance', 'Memory / brain'],
    cautions:
      'May retain ~1–2 kg water in first weeks. Safe for healthy kidneys.',
  },
  caffeine: {
    name: 'Caffeine',
    whatIs: 'Central nervous system stimulant. The most studied ergogenic aid.',
    effect:
      'Reduces perceived exertion, boosts strength 2–7%, improves endurance, mobilizes fatty acids as fuel.',
    dosage: '3–6 mg/kg (200–400 mg for most) 30–60 min before training',
    cycle: '5 days on / 2 days off — to avoid tolerance',
    goodFor: ['Training energy', 'Strength work', 'Fat burning', 'Focus'],
    cautions:
      'Not after 5 PM — disrupts sleep. May cause tachycardia in sensitive users.',
  },
  vitamin_d3: {
    name: 'Vitamin D3',
    whatIs:
      'Fat-soluble vitamin, synthesized in skin from sunlight. 80% of people in northern countries are deficient.',
    effect:
      'Regulates calcium → strong bones and teeth. Supports testosterone. Reduces inflammation. Improves immunity and mood.',
    dosage:
      '2000–5000 IU/day (per blood test — target 50–80 ng/mL)',
    cycle: 'Continuous in fall/winter, less in summer',
    goodFor: ['Bones', 'Immunity', 'Testosterone', 'Mood', 'Recovery'],
    cautions: 'Do not exceed 10,000 IU without lab monitoring',
  },
  omega_3: {
    name: 'Omega-3 (Fish Oil)',
    whatIs:
      'Essential fatty acids EPA and DHA. Deficient in those who eat little fatty fish.',
    effect:
      'Reduces inflammation and post-workout soreness. Protects heart and blood vessels. Supports brain and vision. Helps fat burning.',
    dosage:
      '2–3 g EPA+DHA per day (read the label — total weight ≠ EPA+DHA)',
    cycle: 'Continuous',
    goodFor: ['Recovery', 'Heart', 'Brain', 'Anti-inflammation', 'Fat burning'],
    cautions:
      'Thins blood — caution with anticoagulants. Pick a trusted brand (heavy metals).',
  },
  beta_alanine: {
    name: 'Beta-Alanine',
    whatIs:
      'Amino acid that raises carnosine in muscles — lactic acid buffer.',
    effect:
      'Delays "burn" and muscle failure on 1–4-min sets (8–15 reps). +1–2 reps per set on high-volume work.',
    dosage: '3–5 g per day, split into 2–3 doses',
    cycle: 'Continuous, cumulative effect (4+ weeks)',
    goodFor: ['High-volume training', 'Anaerobic endurance', 'Bodybuilding'],
    cautions: 'Paresthesia (skin tingling) at high doses — normal, harmless',
  },
  citrulline_malate: {
    name: 'Citrulline Malate',
    whatIs:
      'Amino acid that converts to arginine and nitric oxide in the body.',
    effect:
      'Dilates blood vessels → more blood to muscles (pump). Cuts muscle soreness by 40%. Increases rep count 15–20%.',
    dosage: '6–8 g 30–60 min before training',
    cycle: 'Continuous',
    goodFor: ['Pump', 'Endurance per set', 'Recovery'],
    cautions: 'Safe. Malate adds a bit of energy support.',
  },
  magnesium: {
    name: 'Magnesium (glycinate / citrate)',
    whatIs: 'Mineral involved in 300+ reactions. Deficient in 50%+ of people.',
    effect:
      'Lowers cortisol, improves sleep, relaxes muscles (cuts cramps), supports energy metabolism and nervous system. Boosts testosterone when deficient.',
    dosage: '300–400 mg per day (elemental magnesium)',
    cycle: 'Continuous',
    goodFor: ['Sleep', 'Recovery', 'Cramp relief', 'Stress'],
    cautions:
      'Magnesium oxide absorbs poorly — pick glycinate, citrate or malate',
  },
  zinc: {
    name: 'Zinc',
    whatIs:
      'Trace mineral involved in 300+ enzymes. Actively lost via sweat.',
    effect:
      'Supports testosterone, immunity, wound healing, protein synthesis. Deficiency → loss of strength and libido.',
    dosage: '15–30 mg per day',
    cycle: 'Cycles of 1–2 months, then break (displaces copper)',
    goodFor: ['Testosterone', 'Immunity', 'Skin recovery'],
    cautions:
      'No more than 40 mg/day long-term. Picolinate or bisglycinate is best.',
  },
  casein: {
    name: 'Casein',
    whatIs: 'Slow milk protein. Digests over 6–8 hours.',
    effect:
      'Anti-catabolic effect overnight — feeds muscle during sleep. Keeps you full longer.',
    dosage: '30–40 g before bed',
    cycle: 'Continuous',
    goodFor: ['Muscle gain', 'Preserving muscle on a cut', 'Nighttime satiety'],
    cautions: 'Not for those sensitive to casein/lactose',
  },
};

const TIMING_EN: Record<string, string> = {
  morning: 'Morning',
  preworkout: 'Pre-workout',
  duringworkout: 'During workout',
  postworkout: 'Post-workout',
  beforesleep: 'Before sleep',
  withmeal: 'With meal',
  anytime: 'Anytime',
};

export function timingLabel(t: string, lang: 'ru' | 'en'): string {
  if (lang === 'ru') {
    const ru: Record<string, string> = {
      morning: 'Утром',
      preworkout: 'Перед тренировкой',
      duringworkout: 'Во время',
      postworkout: 'После',
      beforesleep: 'Перед сном',
      withmeal: 'С едой',
      anytime: 'В любое время',
    };
    return ru[t] ?? t;
  }
  return TIMING_EN[t] ?? t;
}

export function localizedSupplement<T extends Supplement>(s: T, lang: 'ru' | 'en'): T {
  if (lang === 'ru') return s;
  const over = SUPPLEMENTS_EN[s.id];
  if (!over) return s;
  return { ...s, ...over };
}
