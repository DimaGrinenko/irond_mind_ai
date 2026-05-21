import type { Exercise } from './exercises';

/**
 * EN overlay for the RU exercise DB (exercises.ts is the canonical source).
 * Only free-text fields are translated here; primary/secondary muscle groups
 * and difficulty are localized via muscleLabel()/difficultyLabel() in i18n.
 */
type ExerciseEn = Partial<Pick<Exercise, 'name' | 'equipment' | 'steps' | 'tips'>>;

export const EXERCISES_EN: Record<string, ExerciseEn> = {
  // ===== CHEST =====
  bench_press: {
    name: 'Barbell Bench Press',
    equipment: 'Barbell, bench',
    steps: ['Scapula retracted', 'Lower to the chest', 'Press up'],
    tips: ['Keep your scapula retracted', "Don't lift your hips"],
  },
  incline_bench_press: {
    name: 'Incline Barbell Press',
    equipment: 'Barbell, bench',
    steps: ['30° incline', 'Lower to the upper chest', 'Press up'],
    tips: ['Elbows under the bar', 'Control the negative'],
  },
  incline_db_press: {
    name: 'Incline Dumbbell Press',
    equipment: 'Dumbbells, bench',
    steps: ['20–35° incline', 'Lower to the upper chest', 'Press and squeeze'],
    tips: ["Don't bounce the weight", "Don't let elbows collapse"],
  },
  db_press: {
    name: 'Flat Dumbbell Press',
    equipment: 'Dumbbells, bench',
    steps: ['Dumbbells at chest level', 'Press up', 'Lower under control'],
    tips: ['Full range of motion'],
  },
  db_fly: {
    name: 'Dumbbell Fly',
    equipment: 'Dumbbells, bench',
    steps: ['Slight elbow bend', 'Open until you feel a stretch', 'Bring together under control'],
    tips: ["Don't turn it into a press"],
  },
  cable_fly: {
    name: 'Cable Crossover Fly',
    equipment: 'Cable crossover',
    steps: ['Soft elbows', 'Bring hands together in front', 'Control the negative'],
    tips: ['Feel the chest working'],
  },
  dips: {
    name: 'Parallel Bar Dips',
    equipment: 'Parallel bars',
    steps: ['Lower to a comfortable depth', 'Press back up'],
    tips: ['Lean forward for more chest'],
  },
  pushup: {
    name: 'Push-ups',
    equipment: 'No equipment',
    steps: ['Body in a straight line', 'Lower your chest to the floor', 'Press up'],
    tips: ['Elbows at ~45°'],
  },
  pushup_diamond: {
    name: 'Diamond Push-ups',
    equipment: 'No equipment',
    steps: ['Hands under the chest in a diamond', 'Lower down', 'Press up'],
    tips: ['Keep elbows close to the body'],
  },

  // ===== BACK =====
  deadlift: {
    name: 'Deadlift',
    equipment: 'Barbell',
    steps: ['Bar at your shins', 'Drive with legs and hips', 'Lock out'],
    tips: ['Neutral spine', 'Brace your core'],
  },
  romanian_dl: {
    name: 'Romanian Deadlift',
    equipment: 'Barbell',
    steps: ['Hips back', 'Lower to mid-shin', 'Drive your hips forward'],
    tips: ['Knees slightly bent'],
  },
  sumo_dl: {
    name: 'Sumo Deadlift',
    equipment: 'Barbell',
    steps: ['Wide stance', 'Drive with your legs', 'Lock out'],
    tips: ['Keep the torso more upright'],
  },
  pullup: {
    name: 'Pull-ups',
    equipment: 'Pull-up bar',
    steps: ['From a dead hang', 'Pull your chest to the bar', 'Control on the way down'],
    tips: ['No kipping'],
  },
  chin_up: {
    name: 'Chin-ups',
    equipment: 'Pull-up bar',
    steps: ['Shoulder-width grip', 'Pull your chin over the bar', 'Control'],
    tips: ['Engage the biceps'],
  },
  bb_row: {
    name: 'Bent-over Barbell Row',
    equipment: 'Barbell',
    steps: ['30–45° lean', 'Pull to your waist', 'Lower under control'],
    tips: ['Keep the torso stable'],
  },
  db_row: {
    name: 'One-arm Dumbbell Row',
    equipment: 'Dumbbells',
    steps: ['Support on a knee', 'Pull the elbow back', 'Control the negative'],
    tips: ['Pull the shoulder blade down'],
  },
  t_bar_row: {
    name: 'T-bar Row',
    equipment: 'T-bar',
    steps: ['Lean over', 'Pull to your lower chest', 'Control'],
    tips: ['Keep your chest open'],
  },
  lat_pulldown: {
    name: 'Lat Pulldown',
    equipment: 'Cable',
    steps: ['Lean back slightly', 'Pull to your upper chest', 'Control'],
    tips: ['Shoulder blades down'],
  },
  seated_row: {
    name: 'Seated Cable Row',
    equipment: 'Cable',
    steps: ['Pull to your belly', 'Control the negative'],
    tips: ["Don't swing"],
  },
  face_pull: {
    name: 'Face Pull',
    equipment: 'Cable, rope',
    steps: ['Pull the rope to your face', 'Rotate your wrists'],
    tips: ['Shoulder blades together'],
  },
  shrugs: {
    name: 'Barbell Shrugs',
    equipment: 'Barbell',
    steps: ['Raise your shoulders up', 'Control the negative'],
    tips: ['No rolling'],
  },

  // ===== SHOULDERS =====
  ohp: {
    name: 'Standing Overhead Press',
    equipment: 'Barbell',
    steps: ['Bar at your collarbones', 'Press overhead', 'Control'],
    tips: ["Don't arch your lower back"],
  },
  db_press_shoulder: {
    name: 'Seated Dumbbell Press',
    equipment: 'Dumbbells, bench',
    steps: ['Dumbbells at your shoulders', 'Press up', 'Lower'],
    tips: ['Keep your back supported'],
  },
  arnold_press: {
    name: 'Arnold Press',
    equipment: 'Dumbbells',
    steps: ['Start with palms facing you', 'Rotate and press', 'Control'],
    tips: ['Smooth rotation'],
  },
  lat_raise: {
    name: 'Dumbbell Lateral Raise',
    equipment: 'Dumbbells',
    steps: ['Soft elbows', 'Raise to shoulder level', 'Control'],
    tips: ['Lead with the elbows'],
  },
  front_raise: {
    name: 'Dumbbell Front Raise',
    equipment: 'Dumbbells',
    steps: ['Straight arms', 'Raise to shoulder level', 'Control'],
    tips: ['No swinging'],
  },
  rear_delt_fly: {
    name: 'Bent-over Rear Delt Fly',
    equipment: 'Dumbbells',
    steps: ['Lean your torso forward', 'Open your arms', 'Control'],
    tips: ['Squeeze the shoulder blades'],
  },
  upright_row: {
    name: 'Upright Row',
    equipment: 'Barbell',
    steps: ['Narrow grip', 'Pull with elbows up', 'Control'],
    tips: ['Not above shoulder height'],
  },

  // ===== BICEPS =====
  barbell_curl: {
    name: 'Barbell Curl',
    equipment: 'Barbell/EZ',
    steps: ['Elbows pinned', 'Curl without swinging', 'Control'],
    tips: ["Don't let your elbows drift"],
  },
  db_curl: {
    name: 'Dumbbell Curl',
    equipment: 'Dumbbells',
    steps: ['Supinate as you lift', 'Control the negative'],
    tips: ['Full range of motion'],
  },
  hammer_curl: {
    name: 'Hammer Curl',
    equipment: 'Dumbbells',
    steps: ['Neutral grip', 'Curl up', 'Control'],
    tips: ['Keep elbows fixed'],
  },
  preacher_curl: {
    name: 'Preacher Curl',
    equipment: 'Preacher bench, EZ',
    steps: ['Elbows on the bench', 'Curl up', 'Control'],
    tips: ['Full range of motion'],
  },
  concentration_curl: {
    name: 'Concentration Curl',
    equipment: 'Dumbbell',
    steps: ['Elbow braced on the knee', 'Curl up', 'Control'],
    tips: ['Isolation'],
  },

  // ===== TRICEPS =====
  skull_crushers: {
    name: 'Lying Triceps Extension',
    equipment: 'Barbell/EZ',
    steps: ['Elbows fixed', 'Lower to your forehead', 'Extend'],
    tips: ["Don't flare your elbows"],
  },
  cable_pushdown: {
    name: 'Cable Pushdown',
    equipment: 'Cable',
    steps: ['Elbows pinned', 'Extend downward', 'Control'],
    tips: ['Pause at the bottom'],
  },
  pushdown: {
    name: 'Rope Pushdown',
    equipment: 'Cable, rope',
    steps: ['Elbows pinned', 'Spread your hands at the bottom'],
    tips: ['Squeeze the triceps'],
  },
  overhead_ext: {
    name: 'Seated Overhead Extension',
    equipment: 'Dumbbell/EZ',
    steps: ['Weight behind your head', 'Extend your elbows', 'Control'],
    tips: ['Elbows stay still'],
  },
  bench_dips: {
    name: 'Bench Dips',
    equipment: 'Bench',
    steps: ['Hands on the bench', 'Lower your hips', 'Press up'],
    tips: ['Keep elbows back'],
  },

  // ===== LEGS =====
  squat: {
    name: 'Barbell Squat',
    equipment: 'Barbell',
    steps: ['Stable stance', 'Sit back and down', 'Stand up'],
    tips: ['Knees track over your toes'],
  },
  front_squat: {
    name: 'Front Squat',
    equipment: 'Barbell',
    steps: ['Bar on your front delts', 'Elbows forward', 'Squat and stand'],
    tips: ['Keep the torso upright'],
  },
  goblet_squat: {
    name: 'Goblet Squat',
    equipment: 'Dumbbell',
    steps: ['Dumbbell at your chest', 'Squat down', 'Stand up'],
    tips: ['Knees track over your toes'],
  },
  bulgarian_split: {
    name: 'Bulgarian Split Squat',
    equipment: 'Dumbbells, bench',
    steps: ['Rear foot on the bench', 'Lower down', 'Stand up'],
    tips: ['Front knee tracks forward'],
  },
  walking_lunge: {
    name: 'Walking Lunges',
    equipment: 'Dumbbells',
    steps: ['Step forward', 'Lower down', 'Stand and step with the other leg'],
    tips: ['Keep your torso level'],
  },
  leg_press: {
    name: 'Leg Press',
    equipment: 'Machine',
    steps: ['Feet shoulder-width', 'Lower toward your chest', 'Press'],
    tips: ["Don't lock your knees"],
  },
  leg_extension: {
    name: 'Leg Extension',
    equipment: 'Machine',
    steps: ['Raise the weight with your legs', 'Control the negative'],
    tips: ['Pause at the top'],
  },
  leg_curl: {
    name: 'Lying Leg Curl',
    equipment: 'Machine',
    steps: ['Curl your legs', 'Control the negative'],
    tips: ['No jerking'],
  },
  calf_raise_standing: {
    name: 'Standing Calf Raise',
    equipment: 'Machine / dumbbells',
    steps: ['Rise onto your toes', 'Lower below level'],
    tips: ['Full range of motion'],
  },
  calf_raise_seated: {
    name: 'Seated Calf Raise',
    equipment: 'Machine',
    steps: ['Knees under the pad', 'Rise onto your toes'],
    tips: ['Stretch at the bottom'],
  },

  // ===== GLUTES =====
  hip_thrust: {
    name: 'Barbell Hip Thrust',
    equipment: 'Barbell, bench',
    steps: ['Shoulder blades on the bench', 'Raise your hips', 'Squeeze your glutes'],
    tips: ['Chin to chest'],
  },
  glute_bridge: {
    name: 'Glute Bridge',
    equipment: 'No equipment',
    steps: ['Feet on the floor', 'Raise your hips', 'Squeeze your glutes'],
    tips: ['No lower-back arch'],
  },
  cable_kickback: {
    name: 'Cable Kickback',
    equipment: 'Cable',
    steps: ['Cuff on your ankle', 'Kick back', 'Control'],
    tips: ['Isolation'],
  },

  // ===== ABS =====
  plank: {
    name: 'Plank',
    equipment: 'Mat',
    steps: ['Body in a line', 'Elbows under your shoulders', 'Hold'],
    tips: ['Squeeze your glutes'],
  },
  side_plank: {
    name: 'Side Plank',
    equipment: 'Mat',
    steps: ['Support on your elbow', 'Body straight', 'Hold'],
    tips: ["Hips don't sag"],
  },
  crunch: {
    name: 'Crunches',
    equipment: 'Mat',
    steps: ['Lying down', 'Crunch the upper torso', 'Control'],
    tips: ['No jerking'],
  },
  leg_raise: {
    name: 'Hanging Leg Raise',
    equipment: 'Pull-up bar',
    steps: ['From a hang', 'Raise your legs', 'Control'],
    tips: ['No swinging'],
  },
  hanging_knee_raise: {
    name: 'Hanging Knee Raise',
    equipment: 'Pull-up bar',
    steps: ['From a hang', 'Raise your knees to your chest', 'Control'],
    tips: ['Keep elbows fixed'],
  },
  ab_wheel: {
    name: 'Ab Wheel Rollout',
    equipment: 'Ab wheel',
    steps: ['Roll forward', 'Pull yourself back'],
    tips: ["Don't arch your back"],
  },
  mountain_climber: {
    name: 'Mountain Climbers',
    equipment: 'No equipment',
    steps: ['Plank position', 'Drive your knees in alternately'],
    tips: ['Fast pace'],
  },
  russian_twist: {
    name: 'Russian Twists',
    equipment: 'No equipment',
    steps: ['Seated, torso at 45°', 'Twist side to side'],
    tips: ['Harder with a plate'],
  },

  // ===== CARDIO =====
  run: {
    name: 'Running',
    equipment: 'Treadmill/outdoor',
    steps: ['5–10 min warm-up', 'Working pace', 'Cool-down'],
    tips: ['Keep your heart rate in zone'],
  },
  cycling: {
    name: 'Stationary Bike',
    equipment: 'Stationary bike',
    steps: ['Warm-up', 'Intervals', 'Cool-down'],
    tips: ['Set the seat height correctly'],
  },
  rowing: {
    name: 'Rowing',
    equipment: 'Rowing machine',
    steps: ['Legs, torso, arms', 'Return: arms, torso, legs'],
    tips: ['Stroke rate 22–26'],
  },
  jump_rope: {
    name: 'Jump Rope',
    equipment: 'Jump rope',
    steps: ['Light hops', 'Steady pace'],
    tips: ['Use your wrists, not your shoulders'],
  },

  // ===== FULL BODY =====
  burpee: {
    name: 'Burpees',
    equipment: 'No equipment',
    steps: ['Squat', 'Plank', 'Push-up', 'Jump up'],
    tips: ['Steady pace'],
  },
};

/** Localized copy of an exercise (free-text fields). RU = canonical source. */
export function localizedExercise<T extends Exercise>(ex: T, lang: 'ru' | 'en'): T {
  if (lang === 'ru') return ex;
  const over = EXERCISES_EN[ex.id];
  if (!over) return ex;
  return { ...ex, ...over };
}
