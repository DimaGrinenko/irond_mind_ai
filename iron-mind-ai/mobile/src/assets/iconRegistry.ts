/**
 * IconRegistry — централизованный реестр PNG-иконок неонового стиля.
 *
 * Использование:
 *   import { AppIcon } from '../assets/iconRegistry';
 *   <Image source={AppIcon.eq_dumbbell} style={{ width: 56, height: 56 }} />
 *
 * Маппинг на контекст приложения см. в `IconForContext` в конце файла.
 */

// UI controls
const ui_play = require('../../assets/icons/ui_play.png');
const ui_pause = require('../../assets/icons/ui_pause.png');
const ui_stop = require('../../assets/icons/ui_stop.png');
const ui_next = require('../../assets/icons/ui_next.png');
const ui_record = require('../../assets/icons/ui_record.png');
const ui_timer = require('../../assets/icons/ui_timer.png');
const ui_stopwatch = require('../../assets/icons/ui_stopwatch.png');
const ui_settings = require('../../assets/icons/ui_settings.png');
const ui_menu = require('../../assets/icons/ui_menu.png');
const ui_clipboard = require('../../assets/icons/ui_clipboard.png');
const ui_profile = require('../../assets/icons/ui_profile.png');

// Equipment
const eq_kettlebell = require('../../assets/icons/eq_kettlebell.png');
const eq_kettlebell_alt = require('../../assets/icons/eq_kettlebell_alt.png');
const eq_dumbbell = require('../../assets/icons/eq_dumbbell.png');
const eq_jump_rope = require('../../assets/icons/eq_jump_rope.png');
const eq_exercise_bike = require('../../assets/icons/eq_exercise_bike.png');
const eq_treadmill = require('../../assets/icons/eq_treadmill.png');
const eq_pullup_bar = require('../../assets/icons/eq_pullup_bar.png');
const eq_lat_machine = require('../../assets/icons/eq_lat_machine.png');
const eq_leg_press = require('../../assets/icons/eq_leg_press.png');
const eq_leg_press_alt = require('../../assets/icons/eq_leg_press_alt.png');
const eq_seated_press = require('../../assets/icons/eq_seated_press.png');
const eq_cable_pull = require('../../assets/icons/eq_cable_pull.png');

// Exercise figures
const ex_running = require('../../assets/icons/ex_running.png');
const ex_deadlift = require('../../assets/icons/ex_deadlift.png');
const ex_deadlift_alt = require('../../assets/icons/ex_deadlift_alt.png');
const ex_pushup = require('../../assets/icons/ex_pushup.png');
const ex_lunge = require('../../assets/icons/ex_lunge.png');
const ex_squat_press = require('../../assets/icons/ex_squat_press.png');
const ex_lunge_curl = require('../../assets/icons/ex_lunge_curl.png');
const ex_overhead_squat = require('../../assets/icons/ex_overhead_squat.png');
const ex_overhead_press = require('../../assets/icons/ex_overhead_press.png');
const ex_pullups = require('../../assets/icons/ex_pullups.png');
const ex_stand = require('../../assets/icons/ex_stand.png');
const ex_meditation = require('../../assets/icons/ex_meditation.png');

// Nutrition
const nu_apple = require('../../assets/icons/nu_apple.png');
const nu_bottle = require('../../assets/icons/nu_bottle.png');
const nu_fork_knife = require('../../assets/icons/nu_fork_knife.png');
const nu_supplement = require('../../assets/icons/nu_supplement.png');
const nu_capsule = require('../../assets/icons/nu_capsule.png');
const nu_leaf = require('../../assets/icons/nu_leaf.png');

// Body / measurements
const body_scale = require('../../assets/icons/body_scale.png');
const body_tape = require('../../assets/icons/body_tape.png');
const body_silhouette = require('../../assets/icons/body_silhouette.png');
const body_waist = require('../../assets/icons/body_waist.png');

// Health / science
const h_dna = require('../../assets/icons/h_dna.png');
const h_molecule = require('../../assets/icons/h_molecule.png');
const h_atom = require('../../assets/icons/h_atom.png');
const h_heart = require('../../assets/icons/h_heart.png');
const h_sleep = require('../../assets/icons/h_sleep.png');
const h_battery = require('../../assets/icons/h_battery.png');
const h_dropper = require('../../assets/icons/h_dropper.png');
const ai_brain = require('../../assets/icons/ai_brain.jpg');

// Achievements
const ach_trophy = require('../../assets/icons/ach_trophy.png');
const ach_star = require('../../assets/icons/ach_star.png');
const ach_target = require('../../assets/icons/ach_target.png');

export const AppIcon = {
  // UI
  ui_play,
  ui_pause,
  ui_stop,
  ui_next,
  ui_record,
  ui_timer,
  ui_stopwatch,
  ui_settings,
  ui_menu,
  ui_clipboard,
  ui_profile,

  // Equipment
  eq_kettlebell,
  eq_kettlebell_alt,
  eq_dumbbell,
  eq_jump_rope,
  eq_exercise_bike,
  eq_treadmill,
  eq_pullup_bar,
  eq_lat_machine,
  eq_leg_press,
  eq_leg_press_alt,
  eq_seated_press,
  eq_cable_pull,

  // Exercises
  ex_running,
  ex_deadlift,
  ex_deadlift_alt,
  ex_pushup,
  ex_lunge,
  ex_squat_press,
  ex_lunge_curl,
  ex_overhead_squat,
  ex_overhead_press,
  ex_pullups,
  ex_stand,
  ex_meditation,

  // Nutrition
  nu_apple,
  nu_bottle,
  nu_fork_knife,
  nu_supplement,
  nu_capsule,
  nu_leaf,

  // Body
  body_scale,
  body_tape,
  body_silhouette,
  body_waist,

  // Health
  h_dna,
  h_molecule,
  h_atom,
  h_heart,
  h_sleep,
  h_battery,
  h_dropper,
  ai_brain,

  // Achievements
  ach_trophy,
  ach_star,
  ach_target,
} as const;

export type AppIconKey = keyof typeof AppIcon;

/**
 * Семантические маппинги: какие иконки использовать для разных контекстов.
 * Каждый ключ описывает экран/категорию приложения.
 */
export const IconForContext = {
  // Programs (5 целей онбординга)
  program_mass: AppIcon.eq_dumbbell,
  program_cut: AppIcon.body_silhouette,
  program_strength: AppIcon.ex_deadlift,
  program_endurance: AppIcon.ex_running,
  program_abs: AppIcon.body_waist,

  // Tabs / nav
  tab_home: AppIcon.h_heart,
  tab_workouts: AppIcon.eq_dumbbell,
  tab_nutrition: AppIcon.nu_fork_knife,
  tab_stats: AppIcon.h_battery,
  tab_profile: AppIcon.ui_profile,
  tab_tree: AppIcon.nu_leaf,

  // Workout controls
  workout_start: AppIcon.ui_play,
  workout_pause: AppIcon.ui_pause,
  workout_stop: AppIcon.ui_stop,
  workout_next: AppIcon.ui_next,
  workout_timer: AppIcon.ui_timer,
  workout_rest: AppIcon.ui_stopwatch,

  // Measurements
  measure_weight: AppIcon.body_scale,
  measure_tape: AppIcon.body_tape,
  measure_silhouette: AppIcon.body_silhouette,

  // Nutrition categories
  nutrition_food: AppIcon.nu_apple,
  nutrition_water: AppIcon.nu_bottle,
  nutrition_protein: AppIcon.nu_supplement,
  nutrition_vitamins: AppIcon.nu_capsule,
  nutrition_clean: AppIcon.nu_leaf,

  // AI / coach
  ai_coach: AppIcon.ai_brain,
  ai_dna: AppIcon.h_dna,

  // Stats / health
  stat_heart: AppIcon.h_heart,
  stat_sleep: AppIcon.h_sleep,
  stat_energy: AppIcon.h_battery,

  // Achievements
  achievement_trophy: AppIcon.ach_trophy,
  achievement_star: AppIcon.ach_star,
  achievement_target: AppIcon.ach_target,

  // Equipment groups
  equip_kettlebell: AppIcon.eq_kettlebell,
  equip_dumbbell: AppIcon.eq_dumbbell,
  equip_treadmill: AppIcon.eq_treadmill,
  equip_bike: AppIcon.eq_exercise_bike,
  equip_pullup: AppIcon.eq_pullup_bar,
  equip_leg_press: AppIcon.eq_leg_press,

  // Exercise demos
  ex_running: AppIcon.ex_running,
  ex_deadlift: AppIcon.ex_deadlift,
  ex_pushup: AppIcon.ex_pushup,
  ex_lunge: AppIcon.ex_lunge,
  ex_squat_press: AppIcon.ex_squat_press,
  ex_overhead_press: AppIcon.ex_overhead_press,
  ex_pullups: AppIcon.ex_pullups,
  ex_meditation: AppIcon.ex_meditation,
} as const;

export type IconContext = keyof typeof IconForContext;
