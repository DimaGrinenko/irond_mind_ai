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
    dosage:
      '5 g per day (no loading) or 20 g × 5 days loading, then 3–5 g maintenance',
    cycle: 'Continuous, no side effects from long-term use documented',
    goodFor: [
      'Strength',
      'Muscle gain',
      'Anaerobic endurance',
      'Memory / brain',
    ],
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
    dosage: '2000–5000 IU/day (per blood test — target 50–80 ng/mL)',
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
    dosage: '2–3 g EPA+DHA per day (read the label — total weight ≠ EPA+DHA)',
    cycle: 'Continuous',
    goodFor: ['Recovery', 'Heart', 'Brain', 'Anti-inflammation', 'Fat burning'],
    cautions:
      'Thins blood — caution with anticoagulants. Pick a trusted brand (heavy metals).',
  },
  beta_alanine: {
    name: 'Beta-Alanine',
    whatIs: 'Amino acid that raises carnosine in muscles — lactic acid buffer.',
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
    whatIs: 'Trace mineral involved in 300+ enzymes. Actively lost via sweat.',
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

  // ===== OTHERS (MEDIUM-HIGH EVIDENCE) =====
  bcaa: {
    name: 'BCAA (leucine/isoleucine/valine)',
    whatIs:
      'Three essential amino acids. Already present in complete protein — rarely needed on their own.',
    effect:
      'Reduce muscle breakdown when training fasted or in a deficit. Aid recovery.',
    dosage: '5–10 g during training',
    cycle: 'As needed',
    goodFor: ['Fasted training', 'Cutting'],
    cautions:
      'If you eat enough protein from food they are almost pointless. 2.5–3 g of leucine matters more.',
  },
  eaa: {
    name: 'EAA (all essentials)',
    whatIs: 'Full set of 9 essential amino acids. Superior to BCAA.',
    effect:
      'Maximally drives protein synthesis, better than BCAA. Similar to fast protein but without the carbs.',
    dosage: '10–15 g during or after training',
    cycle: 'As needed',
    goodFor: ['Cutting', 'Fasted training', 'When no protein is available'],
    cautions: '—',
  },
  glutamine: {
    name: 'Glutamine',
    whatIs:
      'The most abundant amino acid in the body. Fuel for the gut and immune system.',
    effect:
      'Repairs the gut after stress and heavy loads. Supports immunity. Effect on muscle growth is weak.',
    dosage: '5–10 g per day',
    cycle: 'In courses during periods of stress',
    goodFor: ['Gut health', 'Immunity after endurance events'],
    cautions: 'Not needed for muscle growth',
  },
  gainer: {
    name: 'Mass Gainer',
    whatIs: 'Mix of protein and fast carbs. 500–1500 kcal per serving.',
    effect: 'Helps "hardgainers" (ectomorphs) hit a calorie surplus for mass.',
    dosage: '1 serving in addition to meals (not instead of them!)',
    cycle: 'Only if you cannot eat enough',
    goodFor: ['Mass gain for skinny lifters', 'After heavy work'],
    cautions: 'Lots of sugar — not for those prone to gaining fat',
  },
  multivitamin: {
    name: 'Multivitamin',
    whatIs: 'A complex of vitamins and minerals at daily-requirement doses.',
    effect: 'Covers deficiencies on an unbalanced diet. Does not replace food.',
    dosage: '1 tablet/capsule per day',
    cycle: 'Continuous',
    goodFor: ['Insurance against deficiencies', 'Seasonal colds'],
    cautions:
      'Not a cure-all. Targeted vitamins (D3, B12, Mg separately) work better',
  },
  collagen: {
    name: 'Collagen + Vitamin C',
    whatIs:
      'Connective-tissue protein. With vitamin C, synthesis improves several-fold.',
    effect:
      'Supports joints, ligaments, tendons and skin. Reduces knee pain in athletes.',
    dosage: '15–20 g collagen + 50 mg vitamin C, 30–60 min before training',
    cycle: 'Continuous',
    goodFor: ['Joint health', 'Skin/hair', 'Heavy strength work'],
    cautions: 'Plant-based collagen does not exist — only animal sources',
  },
  glucosamine: {
    name: 'Glucosamine + Chondroitin + MSM',
    whatIs: 'Components of cartilage tissue.',
    effect:
      'Reduce joint pain in people with wear (osteoarthritis). Cartilage protection under heavy loads.',
    dosage: 'Glucosamine 1500 mg + chondroitin 1200 mg + MSM 1000 mg per day',
    cycle: '3-month courses, then a break',
    goodFor: ['Knee/shoulder pain', 'Osteoarthritis', 'Post-injury'],
    cautions: 'Effect on young healthy athletes is doubtful',
  },
  ashwagandha: {
    name: 'Ashwagandha (KSM-66)',
    whatIs: 'Ayurvedic adaptogen. Plant root.',
    effect:
      'Lowers cortisol by 27%, raises testosterone 14–22%, improves sleep and strength by 1–3%.',
    dosage: '300–600 mg KSM-66 per day',
    cycle: '8–12-week courses',
    goodFor: ['Stress', 'Testosterone', 'Strength', 'Sleep'],
    cautions: 'Avoid with hyperthyroidism; not during pregnancy',
  },
  l_carnitine: {
    name: 'L-Carnitine',
    whatIs: 'Transports fatty acids into mitochondria to be burned.',
    effect:
      'Helps use fat as fuel. Fat-burning effect is moderate — works alongside a calorie deficit.',
    dosage:
      '2–3 g L-carnitine tartrate or 1–2 g ALCAR, 30 min before training/cardio',
    cycle: 'During a cut',
    goodFor: ['Cutting', 'Cardio energy'],
    cautions: 'On its own it does not "burn fat" — you still have to train',
  },
  ecdysterone: {
    name: 'Ecdysterone (Rhaponticum)',
    whatIs: 'Phytoecdysteroid. A natural anabolic.',
    effect:
      'One large study showed +1–2 kg lean mass over 10 weeks. Evidence is still accumulating.',
    dosage: '500–1000 mg per day',
    cycle: '8–12-week courses',
    goodFor: ['Natural mass gain', 'Strength'],
    cautions: 'Banned by WADA from 2026 — off-limits for competing athletes',
  },
  zma: {
    name: 'ZMA (Zn + Mg + B6)',
    whatIs: 'Zinc + magnesium + vitamin B6.',
    effect:
      'Improves sleep and recovery, supports testosterone when deficient.',
    dosage: '1 serving (usually 30 mg Zn + 450 mg Mg + 10 mg B6) before bed',
    cycle: 'Continuous',
    goodFor: ['Sleep', 'Recovery', 'Stress'],
    cautions: 'Take apart from dairy/calcium',
  },
  tribulus: {
    name: 'Tribulus',
    whatIs: 'A plant traditionally used as a "testosterone booster".',
    effect:
      'Modern research does NOT confirm a testosterone increase in healthy men. May help libido.',
    dosage: '500–1500 mg per day',
    cycle: '4–8 weeks',
    goodFor: ['Libido (possibly)'],
    cautions: 'Effect on strength is not proven',
  },
  pre_workout: {
    name: 'Pre-Workout Complex',
    whatIs: 'Mix: caffeine + citrulline + beta-alanine + creatine + vitamins.',
    effect:
      'All the component effects together. Strong energy boost, better pump, more endurance.',
    dosage: '1 serving (15–30 g) 30 min before training',
    cycle: '5 days on / 2 days off',
    goodFor: ['Tough workouts', 'When motivation is low'],
    cautions:
      'Cheap pre-workouts may contain banned substances or too much caffeine',
  },
  electrolytes: {
    name: 'Electrolytes (Na+ K+ Mg+)',
    whatIs: 'A mix of minerals lost through sweat.',
    effect:
      'Supports hydration and muscle contraction, prevents cramps. Especially important in heat / after cardio.',
    dosage: '1 sachet in 500 ml water during or after exercise',
    cycle: 'As needed',
    goodFor: ['Long workouts', 'Heat', 'Cardio'],
    cautions: '—',
  },
  b_complex: {
    name: 'B-Complex',
    whatIs: 'Vitamins B1, B2, B3, B5, B6, B7, B9, B12.',
    effect:
      'Energy metabolism, nervous system, blood formation. Athletes need higher doses.',
    dosage: '1 capsule/day (usually 100% RDA)',
    cycle: 'Continuous',
    goodFor: [
      'Energy',
      'Recovery',
      'Nervous system',
      'Vegans especially (B12)',
    ],
    cautions: 'Urine turns bright yellow — normal (riboflavin)',
  },

  // ===== CHEMISTRY / AAS / PED — harm-reduction =====
  aas_testosterone: {
    name: 'Testosterone (enanthate / cypionate)',
    whatIs:
      'Injectable synthetic testosterone in oil with a long ester. The base compound of nearly any AAS cycle.',
    effect:
      'Raises protein synthesis → fast lean mass and strength gains (4–8 kg over 10 weeks in most protocols). Suppresses your own production (HPTA suppression) within 1–2 weeks.',
    dosage:
      'Amateur protocols: 250–500 mg/week split into 2 injections (Mon/Thu). "250 mg/week" already delivers most of the effect with minimal side effects.',
    cycle:
      'TRT mode — lifelong by medical indication and under a doctor. A cycle is 10–16 weeks with mandatory PCT.',
    goodFor: [
      'Lean mass',
      'Strength',
      'Recovery',
      'TRT for confirmed hypogonadism',
    ],
    cautions:
      'Full shutdown of your own hormones. Never run a "solo cycle without testosterone" (other AAS are even worse on their own).',
    sideEffects:
      '• Estrogenic: gynecomastia, water retention, raised blood pressure — needs an AI (anastrozole 0.25–0.5 mg every other day if estradiol rises).\n' +
      '• Androgenic: acne, oily skin, accelerated MPB (male-pattern baldness) in predisposed users.\n' +
      '• Heart: rising hematocrit (thick blood, clot risk), higher LDL / lower HDL, LV hypertrophy.\n' +
      '• HPTA: testicular atrophy, infertility on cycle (reversible only with PCT, sometimes not).\n' +
      '• Psyche: raised aggression / libido early on, depression on the "crash" after the cycle.',
    legality:
      'Russia: prescription drug (Schedule II), trafficking without a prescription — Art. 234 of the Criminal Code (up to 8 years). Belarus: prescription-only, import without a prescription — administrative/criminal liability under Art. 328-1. Pharmacy-legal by prescription — Sustanon/Omnadren via an endocrinologist.',
    pct: 'Tamoxifen 40/40/20/20 mg + clomiphene 50/50/25/25 mg × 4 weeks, starting 2–3 weeks after the last injection (long ester). + hCG (human chorionic gonadotropin) 500–1000 IU 2×/week in the last 2 weeks of the cycle to raise the testes before PCT.',
    labs: 'Before the cycle: CBC, biochemistry (ALT/AST/bilirubin/creatinine), lipid panel, total/free testosterone, estradiol, LH/FSH, prolactin, PSA (age ≥30), ferritin, hematocrit, ECG. On cycle — the same every 4–6 weeks. After PCT — repeat + a semen analysis if you plan children.',
  },
  aas_trenbolone: {
    name: 'Trenbolone (acetate / enanthate)',
    whatIs:
      'A nandrolone derivative, originally a veterinary cattle-fattening drug. ~5× stronger than testosterone on the anabolic and androgenic index.',
    effect:
      'Hard, dry muscle, zero aromatization (does not convert to estrogen), and with the right diet — recomposition (muscle gain + fat loss).',
    dosage:
      'Acetate: 50–75 mg daily / every other day. Enanthate: 200–400 mg/week. NEVER for beginners.',
    cycle: '6–10 weeks max. Only on top of testosterone.',
    goodFor: ['Experienced users on a hard cut', 'Strength sports'],
    cautions:
      '⚛️ One of the harshest AAS. "Tren cough" (instant cough after injection — hitting a vessel). Not for first cycles.',
    sideEffects:
      '• "Tren psychosis": insomnia, night sweats, paranoia, aggression, depression — many simply cannot tolerate it.\n' +
      '• Severe drop in cardiovascular function: breathlessness when walking, resting tachycardia, risk of cardiac hypertrophy.\n' +
      '• Progestogenic activity → gynecomastia even without estrogens (needs cabergoline if prolactin rises).\n' +
      '• Kidney damage (dark urine — myoglobin), nephrotoxicity.\n' +
      '• Strong HPTA suppression, recovery can take years.\n' +
      '• Hepatotoxicity is low on its own but high when combined with others.',
    legality:
      'Russia/Belarus: banned from circulation. Purely veterinary. Possession/supply is a criminal offence. Does not exist in pharmacies.',
    pct: 'Tamoxifen 40/40/20/20 + clomiphene 50/50/25/25, + hCG in the last 2 weeks of the cycle. If cabergoline was used — a prolactin test is mandatory.',
    labs: 'Base panel + mandatory: prolactin, ECG before the cycle, creatinine/urea (kidneys), troponin if chest pain occurs.',
  },
  aas_nandrolone: {
    name: 'Nandrolone Decanoate ("deca")',
    whatIs:
      'A long ester of nandrolone, a classic from the 80s. Known as a "mass steroid".',
    effect:
      'Slow lean-mass gain, joint support (fluid accumulation in the synovium — genuinely eases shoulder/knee pain).',
    dosage: '200–400 mg/week.',
    cycle: '12–16 weeks.',
    goodFor: ['Mass gain', 'Joint pain under heavy training'],
    cautions:
      'Progestogenic activity — gynecomastia and erectile dysfunction ("deca dick").',
    sideEffects:
      '• "Deca dick": erectile dysfunction from high prolactin — needs cabergoline 0.25 mg 2×/week.\n' +
      '• Long detectability in urine (up to 18 months) — career-ending for athletes.\n' +
      '• Hypertension, rising hematocrit.\n' +
      '• Prolonged HPTA suppression — sometimes recovery never happens.\n' +
      '• Progestogenic gynecomastia (tamoxifen does not always help).',
    legality:
      'Russia/Belarus: prescription-only; trafficking without a prescription — Art. 234 of the Russian / Art. 328-1 of the Belarusian Criminal Code.',
    pct: 'Because of the long ester, start PCT 3–4 weeks after the last injection. Tamoxifen 40/40/20/20 + clomiphene 50/50/25/25 + cabergoline based on prolactin.',
    labs: 'Base panel + mandatory prolactin and estradiol every 4 weeks. Semen analysis before the cycle and 6 months after PCT.',
  },
  aas_methandienone: {
    name: 'Methandienone ("dbol", Dianabol)',
    whatIs:
      'An oral AAS, 17α-alkylated (resistant to liver breakdown, but therefore liver-toxic). The most popular "entry" drug among gym amateurs in the post-Soviet region.',
    effect:
      'Fast 3–6 kg weight gain over 4–6 weeks (much of it water and glycogen), strength gains.',
    dosage: '20–40 mg/day split into 2–3 doses.',
    cycle: '4–6 weeks max. Longer = liver damage.',
    goodFor: [
      'Fast start to a bulk (usually as a kickstart to an injectable cycle)',
    ],
    cautions:
      '17α-alkylated — liver-toxic. Do not combine with other oral AAS.',
    sideEffects:
      '• Hepatotoxicity: ALT/AST up 3–10×, risk of peliosis hepatis.\n' +
      '• Heavy water retention → "moon face", raised blood pressure.\n' +
      '• Gynecomastia (needs tamoxifen).\n' +
      '• 30–50% rebound after the cycle — water and glycogen leave.\n' +
      '• HPTA suppression (one cycle is enough to shut down your own hormones).',
    legality:
      'Russia: Art. 234. Belarus: Art. 328-1. Only by an endocrinologist’s prescription (rarely written).',
    pct: 'Start 3–5 days after the last tablet (short half-life). Tamoxifen 40/40/20/20.',
    labs: 'Base panel + ALT/AST/bilirubin EVERY 2 weeks. Liver support (TUDCA 250–500 mg/day) on cycle.',
  },
  aas_stanozolol: {
    name: 'Stanozolol (Winstrol)',
    whatIs:
      'An oral or injectable AAS. A "cutting" steroid — does not aromatize, gives hard muscle.',
    effect:
      'Hardens the physique, raises strength without much weight gain. Lowers SHBG → more free testosterone.',
    dosage: 'Oral 30–50 mg/day. Injectable 50 mg every other day.',
    cycle: '6–8 weeks.',
    goodFor: ['Final cut'],
    cautions: 'Very toxic to joints (dries out collagen) and to the liver.',
    sideEffects:
      '• Dries out joints → high risk of ligament tears under heavy weights.\n' +
      '• Hepatotoxicity (even the injectable — the solvent damages the liver).\n' +
      '• Severe hit to lipids: HDL down ~50%, LDL up. Long-term atherosclerosis risk.\n' +
      '• MPB (hair loss), acne.\n' +
      '• Thrombosis (a historical case — Christophe Brink).',
    legality: 'Banned from human use in Russia/Belarus. Veterinary only.',
    pct: 'Tamoxifen 40/40/20/20.',
    labs: 'Base panel + lipid panel EVERY 4 weeks. ALT/AST. ECG.',
  },
  aas_oxandrolone: {
    name: 'Oxandrolone (Anavar)',
    whatIs:
      'A "mild" oral AAS. Originally created for recovery after burns and AIDS. Popular among women.',
    effect:
      'Modest lean-mass and strength gains without water retention. Enhances fat burning.',
    dosage: 'Men: 40–80 mg/day. Women: 5–10 mg/day.',
    cycle: '6–8 weeks.',
    goodFor: ['Cutting', 'A women’s AAS (minimal virilization)'],
    cautions:
      'Expensive and often counterfeited. In women — virilization risk if dose is exceeded.',
    sideEffects:
      '• Hits lipids hard (HDL ↓, LDL ↑) even at low doses.\n' +
      '• 17α-alkylated → hepatotoxicity.\n' +
      '• In women: voice deepening, clitoral growth, facial hair — IRREVERSIBLE.\n' +
      '• Suppresses HPTA moderately, but PCT is still needed.',
    legality: 'Russia/Belarus: banned from human use.',
    pct: 'Tamoxifen 20/20/20/20 (short half-life → start 3–5 days after).',
    labs: 'Base panel + lipids every 4 weeks + ALT/AST.',
  },
  aas_turinabol: {
    name: 'Turinabol',
    whatIs:
      'An oral AAS developed in East Germany for doping. A hybrid of dbol and clomiphene.',
    effect:
      'Slow, quality lean-mass gain (2–4 kg over 8 weeks), strength and endurance gains. Does not aromatize.',
    dosage: '30–60 mg/day.',
    cycle: '6–8 weeks.',
    goodFor: ['A light first cycle', 'Strength without bloat'],
    cautions:
      'Hepatotoxic. Long detectability in urine — dangerous for athletes.',
    sideEffects:
      '• Hepatotoxicity (17α-alkylated).\n' +
      '• Strong HDL drop.\n' +
      '• HPTA suppression.\n' +
      '• MPB in predisposed users.\n' +
      '• A long doping-test trail (years — see the Russian Sochi athletes case).',
    legality: 'Russia/Belarus: banned from circulation.',
    pct: 'Tamoxifen 40/40/20/20.',
    labs: 'Base panel + ALT/AST + lipids every 4 weeks.',
  },
  aas_boldenone: {
    name: 'Boldenone (Equipoise)',
    whatIs:
      'A veterinary long-ester AAS for horses. A testosterone derivative with weak aromatization.',
    effect:
      'Slow dry gains, increased appetite and endurance (stimulates red-blood-cell production).',
    dosage: '400–600 mg/week.',
    cycle: '14–18 weeks (long ester, needs time).',
    goodFor: ['Quality mass gain', 'Cardio endurance'],
    cautions:
      'Can cause a strong rise in hematocrit → dangerous for the heart.',
    sideEffects:
      '• Sharp hematocrit rise (norm ≤ 50% → can shoot to 55–60%). Blood thickening, stroke risk.\n' +
      '• Anxiety and irritability in some users.\n' +
      '• MPB in predisposed users.\n' +
      '• A long trail in tests.',
    legality: 'Russia/Belarus: banned, veterinary.',
    pct: 'Because of the long ester — start PCT 3 weeks after the last injection. Tamoxifen 40/40/20/20 + clomiphene 50/50/25/25.',
    labs: 'Base panel + hematocrit/hemoglobin every 4 weeks. If hematocrit > 52% — therapeutic phlebotomy (donate 450 ml).',
  },
  aas_mesterolone: {
    name: 'Mesterolone (Proviron)',
    whatIs:
      'An oral DHT-derived AAS. Usually used not for mass but as a cycle "adjuvant".',
    effect:
      'Lowers SHBG → more free testosterone. Partially controls estrogens. Restores libido on cycle.',
    dosage: '50–100 mg/day.',
    cycle: 'The whole cycle + the first 2–3 weeks of PCT.',
    goodFor: ['Libido support', 'Estrogen control', 'Muscle hardening'],
    cautions: 'NOT 17α-alkylated → liver is spared. Strongly suppresses HPTA.',
    sideEffects:
      '• HPTA suppression (even solo).\n' +
      '• MPB (DHT derivative).\n' +
      '• Prostate: accelerates BPH in predisposed users.\n' +
      '• Acne.',
    legality:
      'Russia/Belarus: prescription-only, by an endocrinologist’s indication.',
    pct: 'Included in the PCT scheme as support — but does NOT replace tamoxifen/clomiphene.',
    labs: 'Base panel + PSA from age 30 every 6 months.',
  },
  aas_clenbuterol: {
    name: 'Clenbuterol',
    whatIs:
      'A β2-agonist (NOT an AAS). An asthma bronchodilator (veterinary in Russia). Used as a fat burner.',
    effect:
      'Raises thermogenesis → +0.5–1 kg fat loss/week alongside a deficit. Mild anti-catabolic.',
    dosage:
      'Start 20 mcg, +20 each day up to 80–120 mcg. 2/2 scheme (2 weeks on, 2 weeks off) or ED on/off.',
    cycle: '4–6 weeks max.',
    goodFor: ['Final cut'],
    cautions: 'NOT a steroid — does nothing for mass. A harsh stimulant.',
    sideEffects:
      '• Heart: tachycardia, arrhythmias; at doses > 120 mcg — atrial fibrillation, proven myocardial hypertrophy.\n' +
      '• Hand tremor, insomnia, nervousness.\n' +
      '• Muscle cramps (need potassium + magnesium + taurine).\n' +
      '• Long-term — myocardial hypertrophy even after stopping.\n' +
      '• Do not combine with caffeine and ephedrine — heart-attack risk.',
    legality:
      'Russia: veterinary, Art. 234 if trafficked for human use. Belarus: prescription.',
    pct: 'Not needed (not a steroid). After stopping — a couple of weeks of rest.',
    labs: 'ECG before and after the cycle. Cardiac echo for long cycles. Potassium/magnesium/electrolytes.',
  },
  ped_hgh: {
    name: 'HGH (Somatropin / growth hormone)',
    whatIs:
      'Recombinant human growth hormone. An injectable peptide. Originally for children with GH deficiency.',
    effect:
      'Fat loss (especially on the belly), better skin and sleep, slow mass gain. Anti-aging effect.',
    dosage:
      '2–4 IU/day for fat loss, 4–8 IU for mass. Subcutaneous in the belly, evening or morning.',
    cycle:
      'From 3 months (no effect before that). Long cycles — years in a TRT-style format.',
    goodFor: ['Visceral fat loss', 'Recovery', 'Anti-aging programs'],
    cautions: 'Very expensive (legitimate — $500–1000/month). Slow to act.',
    sideEffects:
      '• Carpal tunnel syndrome (ligament swelling).\n' +
      '• Hyperglycemia → insulin resistance → type-2 diabetes risk.\n' +
      '• Water retention, hypertension.\n' +
      '• Growth of INTERNAL organs (HGH gut — bloated belly with long use).\n' +
      '• Growth of existing tumors (checking cancer markers matters).\n' +
      '• Accelerated MPB.',
    legality:
      'Russia: Art. 234. Belarus: prescription only for confirmed deficiency. Street-sourced — almost always counterfeit/inactive.',
    pct: 'Not needed (a peptide; your own secretion is not suppressed the way testosterone suppresses it).',
    labs: 'Before the cycle: IGF-1, fasting glucose, HbA1c, insulin, TSH. On cycle — IGF-1 (target 250–350), glucose/HbA1c every 3 months. Abdominal ultrasound. Tumor markers — as indicated.',
  },
  ped_insulin: {
    name: 'Insulin (rapid-acting)',
    whatIs:
      'A pancreatic hormone. In healthy athletes — used to amplify post-workout anabolism.',
    effect:
      'Drives glucose and amino acids into cells → faster recovery and growth.',
    dosage:
      '4–10 IU right after training + 50–100 g carbs per IU (the rule). Rapid-acting only (Humalog/NovoRapid).',
    cycle:
      'Never used apart from a full AAS+HGH cycle. Experienced users only.',
    goodFor: ['Experienced bodybuilders on a bulk'],
    cautions:
      '☠️ THE MOST DANGEROUS OF ALL. An overdose = hypoglycemic coma and death within hours. Never use without carbs on hand and a partner nearby!',
    sideEffects:
      '• Acute hypoglycemia → seizures, loss of consciousness, death.\n' +
      '• Long-term: subcutaneous fat accumulation, insulin resistance.\n' +
      '• β-cell atrophy in the pancreas — long-lasting type-2 diabetes.',
    legality:
      'Russia/Belarus: prescription (for diabetes). No indication in a healthy person.',
    pct: 'Not needed.',
    labs: 'Glucose, HbA1c, C-peptide. A glucometer is mandatory on hand.',
  },
  sarm_ostarine: {
    name: 'Ostarine (MK-2866, SARM)',
    whatIs:
      'Selective Androgen Receptor Modulator. Selectively activates androgen receptors in muscle/bone without strong action on the prostate.',
    effect:
      'Slow lean-mass gain (1–3 kg over 8 weeks), muscle preservation on a cut. Weaker than AAS but simpler.',
    dosage: '15–25 mg/day.',
    cycle: '8 weeks.',
    goodFor: ['A light first "cycle" (still a cycle)', 'Cutting'],
    cautions:
      'NOT a safe alternative to steroids — HPTA suppression exists, hepatotoxicity exists.',
    sideEffects:
      '• HPTA suppression (within 4 weeks).\n' +
      '• Hepatotoxicity at doses > 25 mg.\n' +
      '• HDL drop.\n' +
      '• Vision: "yellow tint" (LGD-4033 and Ostarine are linked to this).\n' +
      '• No long-term cancer-safety studies.',
    legality:
      'Russia/Belarus: grey area. WADA — banned. You can buy it without a prescription, but quality is a lottery.',
    pct: 'Tamoxifen 20/20/10/10 × 4 weeks.',
    labs: 'Base panel + testosterone/LH/FSH at 4 weeks.',
  },
  sarm_ligandrol: {
    name: 'Ligandrol (LGD-4033, SARM)',
    whatIs:
      'The most potent SARM. Comparable in strength to low doses of testosterone.',
    effect:
      'Good lean gains (3–5 kg over 8 weeks), strength gains. Suppresses HPTA harder than Ostarine.',
    dosage: '5–10 mg/day.',
    cycle: '6–8 weeks.',
    goodFor: ['An intermediate "cycle" between natural and AAS'],
    cautions:
      'Suppresses hormones more than amateurs assume. PCT is mandatory.',
    sideEffects:
      '• Full HPTA suppression (shown in clinical data).\n' +
      '• Liver: ALT/AST rise.\n' +
      '• Lipids: HDL down 30–50%.\n' +
      '• Hypertension.\n' +
      '• Long-term — unstudied (never received FDA approval as a drug).',
    legality: 'Russia/Belarus: grey area. WADA — banned.',
    pct: 'Tamoxifen 40/20/20/10 × 4 weeks + clomiphene 50/25/25 × 3 weeks.',
    labs: 'Base panel + ALT/AST/lipids every 4 weeks.',
  },
  sarm_rad140: {
    name: 'RAD-140 (Testolone, SARM)',
    whatIs:
      'One of the strongest SARMs. Heavily used by amateurs as a "lite steroid".',
    effect:
      'Hard mass and strength gains. Approaches moderate testosterone doses in effect.',
    dosage: '10–20 mg/day.',
    cycle: '6–8 weeks.',
    goodFor: ['Experienced SARM users'],
    cautions: 'The "dirtiest" SARM in terms of side effects.',
    sideEffects:
      '• Strong HPTA suppression.\n' +
      '• Hepatotoxicity (documented DILI — drug-induced liver injury cases).\n' +
      '• Aggression / irritability.\n' +
      '• Insomnia, hypertension.\n' +
      '• HDL drop.\n' +
      '• 2023: the FDA issued an alert about liver injury from RAD-140.',
    legality: 'Russia/Belarus: grey area. WADA — banned.',
    pct: 'Tamoxifen 40/40/20/20.',
    labs: 'Base panel + ALT/AST EVERY 2 weeks, lipids every 4 weeks.',
  },
  chem_anastrozole: {
    name: 'Anastrozole (AI for cycle)',
    whatIs:
      'An aromatase inhibitor. Used in oncology (breast cancer); on cycle — for estradiol control.',
    effect:
      'Blocks the aromatase enzyme → less testosterone converts to estradiol. Relieves gynecomastia and bloating.',
    dosage:
      '0.25–0.5 mg daily / every other day when estradiol rises above 35–40 pg/mL.',
    cycle: 'Alongside aromatizing AAS cycles (testosterone, dbol, boldenone).',
    goodFor: ['Estrogen control on cycle'],
    cautions:
      'Overdose → estradiol to zero → joint pain, depression, impotence, poor lipids.',
    sideEffects:
      '• Men need estrogen — never crash it to zero.\n' +
      '• Joint pain at low E2.\n' +
      '• Reduced libido if E2 drops below 20 pg/mL.\n' +
      '• Worse lipids and bone density with long use.',
    legality: 'Russia/Belarus: prescription.',
    pct: 'Not for PCT. Stop after the cycle — let E2 recover.',
    labs: 'Estradiol every 2–3 weeks after starting the AI. Target E2: 20–30 pg/mL.',
  },
  chem_tamoxifen: {
    name: 'Tamoxifen (PCT)',
    whatIs:
      'A selective estrogen receptor modulator (SERM). Originally oncology (breast cancer).',
    effect:
      'Blocks estrogen in breast tissue (prevents and treats gynecomastia) but acts as an agonist in the pituitary → ↑ LH/FSH → restarts your own testosterone. The foundation of PCT.',
    dosage:
      'PCT: 40/40/20/20 mg × 4 weeks. Gynecomastia treatment: 20 mg/day for 4–8 weeks.',
    cycle: 'Only as PCT after a cycle.',
    goodFor: [
      'PCT',
      'Gynecomastia prevention',
      'The standard for HPTA recovery',
    ],
    cautions: 'Acts as an agonist in bone/liver → may raise thrombosis risk.',
    sideEffects:
      '• Deep-vein thrombosis (rare but documented).\n' +
      '• Hot flashes (like in menopause).\n' +
      '• Mild vision disturbances.\n' +
      '• Liver — a slight ALT/AST rise.',
    legality:
      'Russia/Belarus: prescription. Available in pharmacies on an oncologist’s/endocrinologist’s prescription.',
    pct: 'It is itself a PCT drug.',
    labs: 'Before and after PCT: testosterone, LH/FSH, estradiol, CBC (platelets).',
  },
  chem_clomiphene: {
    name: 'Clomiphene (PCT)',
    whatIs:
      'A SERM, originally for treating infertility in women. In men — restarts LH/FSH.',
    effect:
      'Blocks estrogen receptors in the pituitary → ↑ LH/FSH → restarts the testes. The PCT standard paired with tamoxifen.',
    dosage: 'PCT: 50/50/25/25 mg × 4 weeks.',
    cycle: 'PCT.',
    goodFor: ['PCT'],
    cautions:
      'In some men — vision disturbances (phosphenes, blurring) that may not go away.',
    sideEffects:
      '• Vision disturbances (like optic-nerve swelling) — stop if they appear.\n' +
      '• Depression, mood swings.\n' +
      '• Headaches.\n' +
      '• Rarely — stomach upset.',
    legality: 'Russia/Belarus: prescription. Known as Clostilbegit, Clomid.',
    pct: 'It is a PCT drug.',
    labs: 'Same as for tamoxifen + a vision check.',
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

export function localizedSupplement<T extends Supplement>(
  s: T,
  lang: 'ru' | 'en',
): T {
  if (lang === 'ru') return s;
  const over = SUPPLEMENTS_EN[s.id];
  if (!over) return s;
  return { ...s, ...over };
}
