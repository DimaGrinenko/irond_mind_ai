/**
 * База продуктов с КБЖУ на 100 г.
 * Источник: усреднённые значения USDA / Роспотребнадзор + ингредиентные таблицы белорусских и российских производителей.
 */
export type Food = {
  id: string;
  name: string;
  kcal: number; // на 100 г
  protein: number;
  fats: number;
  carbs: number;
  /** Категория для группировки в UI */
  category: 'meat' | 'fish' | 'dairy' | 'grain' | 'fruit' | 'veg' | 'nuts' | 'snack' | 'drink' | 'other';
  /** Эмодзи для быстрого выбора */
  emoji?: string;
  /** Регион (для табов): by — Беларусь, ru — Россия, generic — общий */
  region?: 'by' | 'ru' | 'generic';
  /** Бренд / производитель (если применимо) */
  brand?: string;
};

export const foods: Food[] = [
  // ===== МЯСО / ПТИЦА =====
  { id: 'chicken_breast', name: 'Куриная грудка (варёная)', kcal: 165, protein: 31, fats: 3.6, carbs: 0, category: 'meat', emoji: '🍗' },
  { id: 'chicken_thigh', name: 'Куриное бедро', kcal: 209, protein: 26, fats: 11, carbs: 0, category: 'meat', emoji: '🍗' },
  { id: 'beef_lean', name: 'Говядина постная', kcal: 250, protein: 26, fats: 15, carbs: 0, category: 'meat', emoji: '🥩' },
  { id: 'beef_ground', name: 'Фарш говяжий', kcal: 254, protein: 26, fats: 17, carbs: 0, category: 'meat', emoji: '🥩' },
  { id: 'pork_lean', name: 'Свинина постная', kcal: 242, protein: 27, fats: 14, carbs: 0, category: 'meat', emoji: '🥓' },
  { id: 'turkey_breast', name: 'Индейка (грудка)', kcal: 135, protein: 30, fats: 1, carbs: 0, category: 'meat', emoji: '🦃' },

  // ===== РЫБА / МОРЕПРОДУКТЫ =====
  { id: 'salmon', name: 'Лосось', kcal: 208, protein: 20, fats: 13, carbs: 0, category: 'fish', emoji: '🐟' },
  { id: 'tuna_can', name: 'Тунец консерв. (в собств. соку)', kcal: 116, protein: 26, fats: 1, carbs: 0, category: 'fish', emoji: '🐟' },
  { id: 'cod', name: 'Треска', kcal: 82, protein: 18, fats: 0.7, carbs: 0, category: 'fish', emoji: '🐟' },
  { id: 'tilapia', name: 'Тилапия', kcal: 96, protein: 20, fats: 1.7, carbs: 0, category: 'fish', emoji: '🐟' },
  { id: 'shrimp', name: 'Креветки', kcal: 99, protein: 24, fats: 0.3, carbs: 0.2, category: 'fish', emoji: '🦐' },

  // ===== ЯЙЦА / МОЛОЧКА =====
  { id: 'egg', name: 'Яйцо куриное', kcal: 155, protein: 13, fats: 11, carbs: 1.1, category: 'dairy', emoji: '🥚' },
  { id: 'egg_white', name: 'Белок яичный', kcal: 52, protein: 11, fats: 0.2, carbs: 0.7, category: 'dairy', emoji: '🥚' },
  { id: 'cottage_cheese_5', name: 'Творог 5%', kcal: 121, protein: 17, fats: 5, carbs: 1.8, category: 'dairy', emoji: '🧀' },
  { id: 'cottage_cheese_0', name: 'Творог обезжиренный', kcal: 71, protein: 17, fats: 0.6, carbs: 1.5, category: 'dairy', emoji: '🧀' },
  { id: 'greek_yogurt', name: 'Греческий йогурт 2%', kcal: 73, protein: 10, fats: 2, carbs: 4, category: 'dairy', emoji: '🥛' },
  { id: 'milk_2', name: 'Молоко 2.5%', kcal: 52, protein: 2.8, fats: 2.5, carbs: 4.7, category: 'dairy', emoji: '🥛' },
  { id: 'cheese_hard', name: 'Сыр твёрдый', kcal: 360, protein: 25, fats: 28, carbs: 0, category: 'dairy', emoji: '🧀' },
  { id: 'mozzarella', name: 'Моцарелла', kcal: 280, protein: 22, fats: 22, carbs: 2.2, category: 'dairy', emoji: '🧀' },

  // ===== КРУПЫ / МУЧНОЕ =====
  { id: 'oats', name: 'Овсянка (сухая)', kcal: 379, protein: 13, fats: 7, carbs: 67, category: 'grain', emoji: '🌾' },
  { id: 'oats_cooked', name: 'Овсянка на воде', kcal: 71, protein: 2.5, fats: 1.5, carbs: 12, category: 'grain', emoji: '🥣' },
  { id: 'rice_white_cooked', name: 'Рис белый варёный', kcal: 130, protein: 2.7, fats: 0.3, carbs: 28, category: 'grain', emoji: '🍚' },
  { id: 'rice_brown_cooked', name: 'Рис бурый варёный', kcal: 111, protein: 2.6, fats: 0.9, carbs: 23, category: 'grain', emoji: '🍚' },
  { id: 'buckwheat_cooked', name: 'Гречка варёная', kcal: 92, protein: 3.4, fats: 0.6, carbs: 20, category: 'grain', emoji: '🍚' },
  { id: 'pasta_cooked', name: 'Макароны варёные', kcal: 158, protein: 5.8, fats: 0.9, carbs: 31, category: 'grain', emoji: '🍝' },
  { id: 'bread_white', name: 'Хлеб белый', kcal: 265, protein: 9, fats: 3.2, carbs: 49, category: 'grain', emoji: '🍞' },
  { id: 'bread_whole', name: 'Хлеб цельнозерновой', kcal: 247, protein: 13, fats: 3.4, carbs: 41, category: 'grain', emoji: '🍞' },
  { id: 'potato_boiled', name: 'Картофель варёный', kcal: 87, protein: 1.9, fats: 0.1, carbs: 20, category: 'grain', emoji: '🥔' },
  { id: 'sweet_potato', name: 'Батат запечёный', kcal: 90, protein: 2, fats: 0.1, carbs: 21, category: 'grain', emoji: '🍠' },
  { id: 'quinoa_cooked', name: 'Киноа варёная', kcal: 120, protein: 4.4, fats: 1.9, carbs: 21, category: 'grain', emoji: '🌾' },

  // ===== ОВОЩИ =====
  { id: 'broccoli', name: 'Брокколи', kcal: 34, protein: 2.8, fats: 0.4, carbs: 7, category: 'veg', emoji: '🥦' },
  { id: 'cucumber', name: 'Огурец', kcal: 15, protein: 0.7, fats: 0.1, carbs: 3.6, category: 'veg', emoji: '🥒' },
  { id: 'tomato', name: 'Помидор', kcal: 18, protein: 0.9, fats: 0.2, carbs: 3.9, category: 'veg', emoji: '🍅' },
  { id: 'pepper_bell', name: 'Перец болгарский', kcal: 27, protein: 1.3, fats: 0.3, carbs: 6, category: 'veg', emoji: '🫑' },
  { id: 'carrot', name: 'Морковь', kcal: 41, protein: 0.9, fats: 0.2, carbs: 10, category: 'veg', emoji: '🥕' },
  { id: 'spinach', name: 'Шпинат', kcal: 23, protein: 2.9, fats: 0.4, carbs: 3.6, category: 'veg', emoji: '🥬' },
  { id: 'lettuce', name: 'Салат листовой', kcal: 15, protein: 1.4, fats: 0.2, carbs: 2.9, category: 'veg', emoji: '🥬' },
  { id: 'cabbage', name: 'Капуста', kcal: 25, protein: 1.3, fats: 0.1, carbs: 5.8, category: 'veg', emoji: '🥬' },
  { id: 'onion', name: 'Лук репчатый', kcal: 40, protein: 1.1, fats: 0.1, carbs: 9.3, category: 'veg', emoji: '🧅' },
  { id: 'avocado', name: 'Авокадо', kcal: 160, protein: 2, fats: 15, carbs: 9, category: 'veg', emoji: '🥑' },

  // ===== ФРУКТЫ =====
  { id: 'banana', name: 'Банан', kcal: 89, protein: 1.1, fats: 0.3, carbs: 23, category: 'fruit', emoji: '🍌' },
  { id: 'apple', name: 'Яблоко', kcal: 52, protein: 0.3, fats: 0.2, carbs: 14, category: 'fruit', emoji: '🍎' },
  { id: 'orange', name: 'Апельсин', kcal: 47, protein: 0.9, fats: 0.1, carbs: 12, category: 'fruit', emoji: '🍊' },
  { id: 'berries', name: 'Ягоды смесь', kcal: 57, protein: 0.7, fats: 0.3, carbs: 14, category: 'fruit', emoji: '🫐' },
  { id: 'grapes', name: 'Виноград', kcal: 67, protein: 0.6, fats: 0.2, carbs: 17, category: 'fruit', emoji: '🍇' },

  // ===== ОРЕХИ / СЕМЕНА =====
  { id: 'almonds', name: 'Миндаль', kcal: 579, protein: 21, fats: 50, carbs: 22, category: 'nuts', emoji: '🥜' },
  { id: 'peanuts', name: 'Арахис', kcal: 567, protein: 26, fats: 49, carbs: 16, category: 'nuts', emoji: '🥜' },
  { id: 'walnuts', name: 'Грецкий орех', kcal: 654, protein: 15, fats: 65, carbs: 14, category: 'nuts', emoji: '🌰' },
  { id: 'peanut_butter', name: 'Арахисовая паста', kcal: 588, protein: 25, fats: 50, carbs: 20, category: 'nuts', emoji: '🥜' },
  { id: 'chia_seeds', name: 'Семена чиа', kcal: 486, protein: 17, fats: 31, carbs: 42, category: 'nuts', emoji: '🌾' },

  // ===== СНЕКИ / ДОБАВКИ =====
  { id: 'protein_bar', name: 'Протеиновый батончик', kcal: 350, protein: 25, fats: 12, carbs: 35, category: 'snack', emoji: '🍫' },
  { id: 'whey_protein', name: 'Сывороточный протеин (1 порция)', kcal: 120, protein: 24, fats: 1.5, carbs: 3, category: 'snack', emoji: '🥤' },
  { id: 'dark_chocolate', name: 'Тёмный шоколад 70%', kcal: 598, protein: 8, fats: 43, carbs: 46, category: 'snack', emoji: '🍫' },
  { id: 'cookie', name: 'Печенье', kcal: 480, protein: 6, fats: 24, carbs: 60, category: 'snack', emoji: '🍪' },

  // ===== НАПИТКИ =====
  { id: 'coffee', name: 'Кофе чёрный', kcal: 2, protein: 0.1, fats: 0, carbs: 0, category: 'drink', emoji: '☕' },
  { id: 'tea', name: 'Чай', kcal: 1, protein: 0, fats: 0, carbs: 0.3, category: 'drink', emoji: '🍵' },
  { id: 'juice_orange', name: 'Сок апельсиновый', kcal: 45, protein: 0.7, fats: 0.2, carbs: 10, category: 'drink', emoji: '🧃' },
  { id: 'cola', name: 'Кола', kcal: 42, protein: 0, fats: 0, carbs: 11, category: 'drink', emoji: '🥤' },

  // ===== РАЗНОЕ =====
  { id: 'olive_oil', name: 'Оливковое масло', kcal: 884, protein: 0, fats: 100, carbs: 0, category: 'other', emoji: '🫒' },
  { id: 'butter', name: 'Масло сливочное', kcal: 717, protein: 0.9, fats: 81, carbs: 0.1, category: 'other', emoji: '🧈' },
  { id: 'honey', name: 'Мёд', kcal: 304, protein: 0.3, fats: 0, carbs: 82, category: 'other', emoji: '🍯' },
  { id: 'sugar', name: 'Сахар', kcal: 387, protein: 0, fats: 0, carbs: 100, category: 'other', emoji: '🍬' },

  // ===== БЕЛАРУСЬ 🇧🇾 (молочка) =====
  { id: 'by_savushkin_tvorog_5', name: 'Творог Савушкин 5%', kcal: 121, protein: 18, fats: 5, carbs: 1.8, category: 'dairy', emoji: '🧀', region: 'by', brand: 'Савушкин продукт' },
  { id: 'by_savushkin_tvorog_9', name: 'Творог Савушкин 9%', kcal: 159, protein: 17, fats: 9, carbs: 2, category: 'dairy', emoji: '🧀', region: 'by', brand: 'Савушкин продукт' },
  { id: 'by_savushkin_yogurt', name: 'Активиа йогурт Савушкин', kcal: 78, protein: 4.5, fats: 2.5, carbs: 9.5, category: 'dairy', emoji: '🥛', region: 'by', brand: 'Савушкин продукт' },
  { id: 'by_brest_litovsk_cheese', name: 'Сыр Брест-Литовск Классический 45%', kcal: 360, protein: 25, fats: 28, carbs: 0, category: 'dairy', emoji: '🧀', region: 'by', brand: 'Брест-Литовск' },
  { id: 'by_pruzhansky_smetana', name: 'Сметана Пружанский 20%', kcal: 204, protein: 2.5, fats: 20, carbs: 3.2, category: 'dairy', emoji: '🥣', region: 'by', brand: 'Пружанский МК' },
  { id: 'by_minsk_kefir', name: 'Кефир Минская марка 2.5%', kcal: 53, protein: 2.9, fats: 2.5, carbs: 4, category: 'dairy', emoji: '🥛', region: 'by', brand: 'Минская марка' },
  { id: 'by_molochnyi_mir_milk', name: 'Молоко Молочный Мир 3.2%', kcal: 60, protein: 2.9, fats: 3.2, carbs: 4.7, category: 'dairy', emoji: '🥛', region: 'by', brand: 'Молочный мир' },
  { id: 'by_babushkina_krynka_ryazhenka', name: 'Ряженка Бабушкина крынка 4%', kcal: 76, protein: 3, fats: 4, carbs: 4.2, category: 'dairy', emoji: '🥛', region: 'by', brand: 'Бабушкина крынка' },
  { id: 'by_belaktovo_kazein', name: 'Творожный сырок Беллакт 4.2%', kcal: 152, protein: 8, fats: 4.2, carbs: 19, category: 'dairy', emoji: '🍫', region: 'by', brand: 'Беллакт' },
  { id: 'by_milavica_butter', name: 'Масло Минская марка 72.5%', kcal: 661, protein: 1, fats: 72.5, carbs: 1.4, category: 'other', emoji: '🧈', region: 'by', brand: 'Минская марка' },

  // ===== БЕЛАРУСЬ — мясо/колбасы =====
  { id: 'by_volkovysk_chicken', name: 'Куриная грудка Серволюкс', kcal: 113, protein: 23, fats: 1.9, carbs: 0, category: 'meat', emoji: '🍗', region: 'by', brand: 'Серволюкс' },
  { id: 'by_grodno_kotleta', name: 'Котлета Гродненский МК', kcal: 245, protein: 12, fats: 17, carbs: 11, category: 'meat', emoji: '🍖', region: 'by', brand: 'Гродненский МК' },
  { id: 'by_minskyi_dokt_sausage', name: 'Колбаса Докторская Минский МК', kcal: 257, protein: 13, fats: 22, carbs: 1.5, category: 'meat', emoji: '🌭', region: 'by', brand: 'Минский МК' },
  { id: 'by_mogilev_pelmeni', name: 'Пельмени Кулинар (Могилёв)', kcal: 248, protein: 11, fats: 12, carbs: 24, category: 'meat', emoji: '🥟', region: 'by', brand: 'Кулинар' },
  { id: 'by_brest_drujba_sausage', name: 'Сардельки Дружба', kcal: 274, protein: 11, fats: 25, carbs: 2, category: 'meat', emoji: '🌭', region: 'by', brand: 'Брестский МК' },
  { id: 'by_borisov_kotleta_pp', name: 'Куриная котлета ПП (Борисовский МК)', kcal: 145, protein: 18, fats: 7, carbs: 3, category: 'meat', emoji: '🍗', region: 'by', brand: 'Борисовский МК' },

  // ===== БЕЛАРУСЬ — хлеб/выпечка =====
  { id: 'by_narochansky_bread', name: 'Хлеб Нарочанский', kcal: 230, protein: 7.6, fats: 1.2, carbs: 47, category: 'grain', emoji: '🍞', region: 'by', brand: 'Минский хлебозавод №3' },
  { id: 'by_borodinsky_bread', name: 'Хлеб Бородинский', kcal: 207, protein: 6.8, fats: 1.3, carbs: 40, category: 'grain', emoji: '🍞', region: 'by' },
  { id: 'by_radzima_bread', name: 'Хлеб Радзіма ржаной', kcal: 195, protein: 6.5, fats: 1.1, carbs: 38, category: 'grain', emoji: '🍞', region: 'by', brand: 'Минскхлебпром' },
  { id: 'by_baton_lukashinsky', name: 'Батон Лукашинский нарезной', kcal: 270, protein: 7.7, fats: 3, carbs: 53, category: 'grain', emoji: '🥖', region: 'by' },
  { id: 'by_drozhevoy_kalach', name: 'Калач Слуцкий', kcal: 280, protein: 7.5, fats: 4, carbs: 53, category: 'grain', emoji: '🥯', region: 'by' },

  // ===== БЕЛАРУСЬ — снеки/сладости =====
  { id: 'by_kommunarka_alenka', name: 'Шоколад Коммунарка Молочный', kcal: 547, protein: 7, fats: 32, carbs: 56, category: 'snack', emoji: '🍫', region: 'by', brand: 'Коммунарка' },
  { id: 'by_kommunarka_dark', name: 'Шоколад Коммунарка Горький 72%', kcal: 575, protein: 9, fats: 38, carbs: 47, category: 'snack', emoji: '🍫', region: 'by', brand: 'Коммунарка' },
  { id: 'by_spartak_marshmallow', name: 'Зефир Спартак', kcal: 308, protein: 0.8, fats: 0.1, carbs: 76, category: 'snack', emoji: '🍡', region: 'by', brand: 'Спартак' },
  { id: 'by_slodych_pechenie', name: 'Печенье Слодыч', kcal: 460, protein: 7.5, fats: 13, carbs: 75, category: 'snack', emoji: '🍪', region: 'by', brand: 'Слодыч' },
  { id: 'by_onega_curd_glaze', name: 'Сырок глазированный Онега', kcal: 401, protein: 8, fats: 22, carbs: 41, category: 'dairy', emoji: '🍫', region: 'by', brand: 'Онега' },
  { id: 'by_ivkon_konfety', name: 'Конфеты Идеал (Ивкон)', kcal: 480, protein: 5, fats: 24, carbs: 60, category: 'snack', emoji: '🍬', region: 'by', brand: 'Ивкон' },

  // ===== БЕЛАРУСЬ — напитки =====
  { id: 'by_lidsky_kvas', name: 'Квас Лидский', kcal: 32, protein: 0.2, fats: 0, carbs: 7.5, category: 'drink', emoji: '🍺', region: 'by', brand: 'Лидский пивзавод' },
  { id: 'by_darida_water', name: 'Вода Дарида', kcal: 0, protein: 0, fats: 0, carbs: 0, category: 'drink', emoji: '💧', region: 'by', brand: 'Дарида' },
  { id: 'by_aliva_juice', name: 'Сок Aliva яблоко', kcal: 46, protein: 0.3, fats: 0, carbs: 11, category: 'drink', emoji: '🧃', region: 'by', brand: 'Aliva' },
  { id: 'by_kriniza_pivo', name: 'Пиво Криница светлое', kcal: 43, protein: 0.5, fats: 0, carbs: 4.5, category: 'drink', emoji: '🍺', region: 'by', brand: 'Криница' },
  { id: 'by_alivaria_pivo', name: 'Пиво Алiварыя', kcal: 41, protein: 0.4, fats: 0, carbs: 4, category: 'drink', emoji: '🍺', region: 'by', brand: 'Аліварыя' },

  // ===== БЕЛАРУСЬ — национальные блюда =====
  { id: 'by_draniki', name: 'Драники картофельные', kcal: 178, protein: 3.4, fats: 9, carbs: 22, category: 'other', emoji: '🥔', region: 'by' },
  { id: 'by_machanka', name: 'Мачанка по-белорусски', kcal: 220, protein: 12, fats: 16, carbs: 6, category: 'meat', emoji: '🍲', region: 'by' },
  { id: 'by_holodnik', name: 'Холодник (литовский)', kcal: 65, protein: 3.2, fats: 4, carbs: 5, category: 'veg', emoji: '🥣', region: 'by' },
  { id: 'by_kolduny', name: 'Колдуны с мясом', kcal: 270, protein: 11, fats: 14, carbs: 25, category: 'meat', emoji: '🥟', region: 'by' },
  { id: 'by_zhuretka', name: 'Жур (овсяный суп)', kcal: 65, protein: 2.5, fats: 1.5, carbs: 11, category: 'grain', emoji: '🥣', region: 'by' },
  { id: 'by_vereshchaka', name: 'Верещака (свинина в соусе)', kcal: 285, protein: 16, fats: 22, carbs: 4, category: 'meat', emoji: '🍖', region: 'by' },
  { id: 'by_buckwheat_meat', name: 'Гречка с тушёнкой', kcal: 165, protein: 8, fats: 8, carbs: 14, category: 'grain', emoji: '🍚', region: 'by' },

  // ===== БЕЛАРУСЬ — рыба/консервы =====
  { id: 'by_santa_bremor_herring', name: 'Сельдь Санта Бремор филе', kcal: 234, protein: 17, fats: 18, carbs: 0, category: 'fish', emoji: '🐟', region: 'by', brand: 'Санта Бремор' },
  { id: 'by_santa_bremor_caviar', name: 'Икра Санта Бремор имитированная', kcal: 145, protein: 2, fats: 9, carbs: 14, category: 'fish', emoji: '🍣', region: 'by', brand: 'Санта Бремор' },
  { id: 'by_belryba_skumbria', name: 'Скумбрия х/к Белрыба', kcal: 221, protein: 18, fats: 16, carbs: 0, category: 'fish', emoji: '🐟', region: 'by', brand: 'Белрыба' },

  // ===== РОССИЯ 🇷🇺 (популярное) =====
  { id: 'ru_doshirak', name: 'Доширак говядина', kcal: 437, protein: 9, fats: 18, carbs: 60, category: 'grain', emoji: '🍜', region: 'ru', brand: 'Doshirak' },
  { id: 'ru_dymov_sausage', name: 'Колбаса Дымов Молочная', kcal: 247, protein: 11, fats: 22, carbs: 1.5, category: 'meat', emoji: '🌭', region: 'ru', brand: 'Дымов' },
  { id: 'ru_micoyan_kotleta', name: 'Котлета Микоян', kcal: 235, protein: 13, fats: 16, carbs: 9, category: 'meat', emoji: '🍖', region: 'ru', brand: 'Микоян' },
  { id: 'ru_alenka_choco', name: 'Шоколад Алёнка', kcal: 549, protein: 7.6, fats: 32, carbs: 60, category: 'snack', emoji: '🍫', region: 'ru', brand: 'Красный Октябрь' },
  { id: 'ru_korovka_milk', name: 'Молоко Простоквашино 3.2%', kcal: 59, protein: 2.9, fats: 3.2, carbs: 4.7, category: 'dairy', emoji: '🥛', region: 'ru', brand: 'Простоквашино' },
  { id: 'ru_chudo_yogurt', name: 'Йогурт Чудо клубника', kcal: 90, protein: 2.8, fats: 2.5, carbs: 13, category: 'dairy', emoji: '🥛', region: 'ru', brand: 'Чудо' },
  { id: 'ru_activia_tvorog', name: 'Творог Activia 0%', kcal: 56, protein: 11, fats: 0, carbs: 3.5, category: 'dairy', emoji: '🧀', region: 'ru', brand: 'Activia' },
  { id: 'ru_olivye', name: 'Салат Оливье', kcal: 192, protein: 6, fats: 14, carbs: 9, category: 'other', emoji: '🥗', region: 'ru' },
  { id: 'ru_seledka_pod_shuboy', name: 'Селёдка под шубой', kcal: 184, protein: 5.5, fats: 13, carbs: 10, category: 'other', emoji: '🐟', region: 'ru' },
  { id: 'ru_borsch', name: 'Борщ со сметаной', kcal: 70, protein: 3.5, fats: 4, carbs: 6, category: 'veg', emoji: '🥣', region: 'ru' },
  { id: 'ru_solyanka', name: 'Солянка мясная', kcal: 130, protein: 9, fats: 9, carbs: 4, category: 'meat', emoji: '🍲', region: 'ru' },
  { id: 'ru_blini', name: 'Блины классические', kcal: 233, protein: 6.1, fats: 7.6, carbs: 35, category: 'grain', emoji: '🥞', region: 'ru' },
  { id: 'ru_syrniki', name: 'Сырники', kcal: 220, protein: 14, fats: 11, carbs: 17, category: 'dairy', emoji: '🥞', region: 'ru' },
  { id: 'ru_pyshka', name: 'Пышка с сахаром', kcal: 312, protein: 5, fats: 9, carbs: 53, category: 'snack', emoji: '🍩', region: 'ru' },
  { id: 'ru_shashlyk', name: 'Шашлык из свинины', kcal: 280, protein: 19, fats: 22, carbs: 0, category: 'meat', emoji: '🍢', region: 'ru' },
  { id: 'ru_pelmeni_sib', name: 'Пельмени Сибирские', kcal: 248, protein: 11, fats: 13, carbs: 24, category: 'meat', emoji: '🥟', region: 'ru' },
  { id: 'ru_griby_marinov', name: 'Грибы маринованные', kcal: 28, protein: 2.5, fats: 0.4, carbs: 4, category: 'veg', emoji: '🍄', region: 'ru' },
  { id: 'ru_seledka_in_brine', name: 'Сельдь солёная', kcal: 217, protein: 17, fats: 17, carbs: 0, category: 'fish', emoji: '🐟', region: 'ru' },
  { id: 'ru_tushyonka', name: 'Тушёнка говяжья ГОСТ', kcal: 220, protein: 17, fats: 17, carbs: 0, category: 'meat', emoji: '🥫', region: 'ru' },
  { id: 'ru_baltika_pivo', name: 'Пиво Балтика 7', kcal: 43, protein: 0.5, fats: 0, carbs: 4.6, category: 'drink', emoji: '🍺', region: 'ru', brand: 'Балтика' },

  // ===== ДОПОЛНЕНИЯ (generic) =====
  { id: 'kefir_1', name: 'Кефир 1%', kcal: 40, protein: 3, fats: 1, carbs: 4, category: 'dairy', emoji: '🥛' },
  { id: 'ryazhenka_4', name: 'Ряженка 4%', kcal: 76, protein: 3, fats: 4, carbs: 4.2, category: 'dairy', emoji: '🥛' },
  { id: 'sour_cream_15', name: 'Сметана 15%', kcal: 162, protein: 2.6, fats: 15, carbs: 3.6, category: 'dairy', emoji: '🥣' },
  { id: 'sour_cream_20', name: 'Сметана 20%', kcal: 204, protein: 2.5, fats: 20, carbs: 3.2, category: 'dairy', emoji: '🥣' },
  { id: 'milk_3_5', name: 'Молоко 3.5%', kcal: 64, protein: 3, fats: 3.5, carbs: 4.7, category: 'dairy', emoji: '🥛' },
  { id: 'cottage_cheese_9', name: 'Творог 9%', kcal: 159, protein: 16.7, fats: 9, carbs: 2, category: 'dairy', emoji: '🧀' },
  { id: 'cottage_cheese_18', name: 'Творог 18%', kcal: 232, protein: 14, fats: 18, carbs: 2.8, category: 'dairy', emoji: '🧀' },
  { id: 'cream_10', name: 'Сливки 10%', kcal: 119, protein: 3, fats: 10, carbs: 4, category: 'dairy', emoji: '🥛' },
  { id: 'cream_20', name: 'Сливки 20%', kcal: 207, protein: 2.5, fats: 20, carbs: 3.7, category: 'dairy', emoji: '🥛' },
  { id: 'feta', name: 'Фета', kcal: 264, protein: 14, fats: 21, carbs: 4, category: 'dairy', emoji: '🧀' },
  { id: 'parmesan', name: 'Пармезан', kcal: 392, protein: 36, fats: 28, carbs: 3.2, category: 'dairy', emoji: '🧀' },
  { id: 'lamb', name: 'Баранина', kcal: 294, protein: 16.5, fats: 25, carbs: 0, category: 'meat', emoji: '🍖' },
  { id: 'liver_beef', name: 'Печень говяжья', kcal: 127, protein: 20, fats: 3.6, carbs: 5.3, category: 'meat', emoji: '🥩' },
  { id: 'liver_chicken', name: 'Печень куриная', kcal: 137, protein: 19, fats: 6.3, carbs: 0.7, category: 'meat', emoji: '🍗' },
  { id: 'tongue_beef', name: 'Язык говяжий', kcal: 173, protein: 16, fats: 12, carbs: 0, category: 'meat', emoji: '🥩' },
  { id: 'salami', name: 'Колбаса салями', kcal: 568, protein: 21, fats: 53, carbs: 1, category: 'meat', emoji: '🌭' },
  { id: 'ham', name: 'Ветчина', kcal: 270, protein: 23, fats: 20, carbs: 0, category: 'meat', emoji: '🥓' },
  { id: 'bacon', name: 'Бекон жареный', kcal: 541, protein: 37, fats: 42, carbs: 1.4, category: 'meat', emoji: '🥓' },
  { id: 'mackerel', name: 'Скумбрия', kcal: 191, protein: 18, fats: 13, carbs: 0, category: 'fish', emoji: '🐟' },
  { id: 'herring', name: 'Сельдь атлантическая', kcal: 217, protein: 17, fats: 17, carbs: 0, category: 'fish', emoji: '🐟' },
  { id: 'pollock', name: 'Минтай', kcal: 72, protein: 16, fats: 0.9, carbs: 0, category: 'fish', emoji: '🐟' },
  { id: 'mussels', name: 'Мидии', kcal: 86, protein: 12, fats: 2, carbs: 3.7, category: 'fish', emoji: '🦪' },
  { id: 'squid', name: 'Кальмар', kcal: 92, protein: 18, fats: 2.2, carbs: 2, category: 'fish', emoji: '🦑' },
  { id: 'crab_meat', name: 'Крабовое мясо', kcal: 87, protein: 17, fats: 1.8, carbs: 0, category: 'fish', emoji: '🦀' },
  { id: 'pumpkin_seeds', name: 'Семечки тыквы', kcal: 559, protein: 30, fats: 49, carbs: 11, category: 'nuts', emoji: '🎃' },
  { id: 'sunflower_seeds', name: 'Семечки подсолн.', kcal: 584, protein: 21, fats: 51, carbs: 20, category: 'nuts', emoji: '🌻' },
  { id: 'flax_seeds', name: 'Семя льна', kcal: 534, protein: 18, fats: 42, carbs: 29, category: 'nuts', emoji: '🌾' },
  { id: 'cashew', name: 'Кешью', kcal: 553, protein: 18, fats: 44, carbs: 30, category: 'nuts', emoji: '🥜' },
  { id: 'hazelnut', name: 'Фундук', kcal: 628, protein: 15, fats: 61, carbs: 17, category: 'nuts', emoji: '🌰' },
  { id: 'pistachio', name: 'Фисташки', kcal: 562, protein: 20, fats: 45, carbs: 28, category: 'nuts', emoji: '🥜' },
  { id: 'lentils_cooked', name: 'Чечевица варёная', kcal: 116, protein: 9, fats: 0.4, carbs: 20, category: 'grain', emoji: '🌾' },
  { id: 'chickpeas_cooked', name: 'Нут варёный', kcal: 164, protein: 9, fats: 2.6, carbs: 27, category: 'grain', emoji: '🌾' },
  { id: 'beans_cooked', name: 'Фасоль варёная', kcal: 127, protein: 8, fats: 0.5, carbs: 23, category: 'grain', emoji: '🌾' },
  { id: 'corn_can', name: 'Кукуруза консерв.', kcal: 81, protein: 2.7, fats: 1.1, carbs: 16, category: 'veg', emoji: '🌽' },
  { id: 'peas_can', name: 'Горошек консерв.', kcal: 53, protein: 3.6, fats: 0.4, carbs: 8.6, category: 'veg', emoji: '🌱' },
  { id: 'mushroom_champ', name: 'Шампиньоны', kcal: 22, protein: 3, fats: 0.3, carbs: 3.3, category: 'veg', emoji: '🍄' },
  { id: 'beetroot', name: 'Свёкла варёная', kcal: 44, protein: 1.7, fats: 0.2, carbs: 10, category: 'veg', emoji: '🍠' },
  { id: 'eggplant', name: 'Баклажан', kcal: 25, protein: 1, fats: 0.2, carbs: 6, category: 'veg', emoji: '🍆' },
  { id: 'zucchini', name: 'Кабачок', kcal: 17, protein: 1.2, fats: 0.3, carbs: 3.1, category: 'veg', emoji: '🥬' },
  { id: 'radish', name: 'Редис', kcal: 16, protein: 0.7, fats: 0.1, carbs: 3.4, category: 'veg', emoji: '🌶' },
  { id: 'pineapple', name: 'Ананас', kcal: 50, protein: 0.5, fats: 0.1, carbs: 13, category: 'fruit', emoji: '🍍' },
  { id: 'kiwi', name: 'Киви', kcal: 61, protein: 1.1, fats: 0.5, carbs: 15, category: 'fruit', emoji: '🥝' },
  { id: 'mango', name: 'Манго', kcal: 60, protein: 0.8, fats: 0.4, carbs: 15, category: 'fruit', emoji: '🥭' },
  { id: 'peach', name: 'Персик', kcal: 39, protein: 0.9, fats: 0.3, carbs: 9.5, category: 'fruit', emoji: '🍑' },
  { id: 'pear', name: 'Груша', kcal: 57, protein: 0.4, fats: 0.1, carbs: 15, category: 'fruit', emoji: '🍐' },
  { id: 'watermelon', name: 'Арбуз', kcal: 30, protein: 0.6, fats: 0.2, carbs: 7.5, category: 'fruit', emoji: '🍉' },
  { id: 'lemon', name: 'Лимон', kcal: 29, protein: 1.1, fats: 0.3, carbs: 9, category: 'fruit', emoji: '🍋' },
  { id: 'strawberry', name: 'Клубника', kcal: 32, protein: 0.7, fats: 0.3, carbs: 7.7, category: 'fruit', emoji: '🍓' },
  { id: 'blueberry', name: 'Черника', kcal: 57, protein: 0.7, fats: 0.3, carbs: 14, category: 'fruit', emoji: '🫐' },
  { id: 'raspberry', name: 'Малина', kcal: 52, protein: 1.2, fats: 0.7, carbs: 12, category: 'fruit', emoji: '🍓' },
  { id: 'dates', name: 'Финики сушёные', kcal: 277, protein: 1.8, fats: 0.2, carbs: 75, category: 'fruit', emoji: '🌴' },
  { id: 'raisins', name: 'Изюм', kcal: 299, protein: 3.1, fats: 0.5, carbs: 79, category: 'fruit', emoji: '🍇' },
  { id: 'apricot_dried', name: 'Курага', kcal: 241, protein: 3.4, fats: 0.5, carbs: 63, category: 'fruit', emoji: '🍑' },
  { id: 'prunes', name: 'Чернослив', kcal: 240, protein: 2.2, fats: 0.4, carbs: 64, category: 'fruit', emoji: '🍇' },
  { id: 'soy_sauce', name: 'Соевый соус', kcal: 53, protein: 8, fats: 0.6, carbs: 5, category: 'other', emoji: '🥫' },
  { id: 'ketchup', name: 'Кетчуп', kcal: 100, protein: 1.5, fats: 0.3, carbs: 26, category: 'other', emoji: '🍅' },
  { id: 'mayonnaise', name: 'Майонез провансаль 67%', kcal: 627, protein: 0.6, fats: 67, carbs: 3.7, category: 'other', emoji: '🥫' },
  { id: 'mustard', name: 'Горчица', kcal: 162, protein: 9.8, fats: 9.4, carbs: 5.3, category: 'other', emoji: '🌶' },
  { id: 'energy_redbull', name: 'Энергетик Red Bull', kcal: 45, protein: 0.4, fats: 0, carbs: 11, category: 'drink', emoji: '⚡', brand: 'Red Bull' },
  { id: 'beer_light', name: 'Пиво светлое 4.5%', kcal: 43, protein: 0.5, fats: 0, carbs: 4.6, category: 'drink', emoji: '🍺' },
  { id: 'wine_red', name: 'Вино сухое красное', kcal: 85, protein: 0.1, fats: 0, carbs: 2.6, category: 'drink', emoji: '🍷' },
  { id: 'vodka', name: 'Водка 40%', kcal: 235, protein: 0, fats: 0, carbs: 0.1, category: 'drink', emoji: '🍸' },
];

// ===== РАСШИРЕНИЕ КАТАЛОГА (140+ позиций) =====
foods.push(
  // Мясо/птица — расширение
  { id: 'duck_breast', name: 'Утиная грудка', kcal: 132, protein: 18, fats: 6, carbs: 0, category: 'meat', emoji: '🦆' },
  { id: 'rabbit', name: 'Кролик тушёный', kcal: 156, protein: 21, fats: 8, carbs: 0, category: 'meat', emoji: '🐰' },
  { id: 'goose', name: 'Гусь жареный', kcal: 305, protein: 25, fats: 22, carbs: 0, category: 'meat', emoji: '🦆' },
  { id: 'venison', name: 'Оленина', kcal: 158, protein: 30, fats: 3.2, carbs: 0, category: 'meat', emoji: '🦌' },
  { id: 'beef_steak', name: 'Стейк рибай', kcal: 271, protein: 24, fats: 19, carbs: 0, category: 'meat', emoji: '🥩' },
  { id: 'beef_tenderloin', name: 'Вырезка говяжья', kcal: 211, protein: 23, fats: 13, carbs: 0, category: 'meat', emoji: '🥩' },
  { id: 'chicken_wings', name: 'Куриные крылья', kcal: 203, protein: 18, fats: 14, carbs: 0, category: 'meat', emoji: '🍗' },
  { id: 'chicken_drumstick', name: 'Куриные голени', kcal: 172, protein: 18, fats: 11, carbs: 0, category: 'meat', emoji: '🍗' },
  { id: 'chicken_fillet_raw', name: 'Куриное филе сырое', kcal: 110, protein: 23, fats: 1.2, carbs: 0, category: 'meat', emoji: '🍗' },
  { id: 'pork_chop', name: 'Свиная отбивная', kcal: 231, protein: 26, fats: 14, carbs: 0, category: 'meat', emoji: '🥩' },
  { id: 'pork_ribs', name: 'Свиные рёбра запечённые', kcal: 277, protein: 20, fats: 22, carbs: 0, category: 'meat', emoji: '🍖' },
  { id: 'liver_pork', name: 'Печень свиная', kcal: 109, protein: 19, fats: 3.6, carbs: 2.5, category: 'meat', emoji: '🥩' },
  { id: 'heart_beef', name: 'Сердце говяжье', kcal: 96, protein: 16, fats: 3.5, carbs: 0, category: 'meat', emoji: '🫀' },

  // Рыба/морепродукты — расширение
  { id: 'sardine', name: 'Сардины в масле', kcal: 208, protein: 25, fats: 11, carbs: 0, category: 'fish', emoji: '🐟' },
  { id: 'trout', name: 'Форель', kcal: 148, protein: 21, fats: 7, carbs: 0, category: 'fish', emoji: '🐟' },
  { id: 'salmon_smoked', name: 'Лосось копчёный', kcal: 117, protein: 18, fats: 4.3, carbs: 0, category: 'fish', emoji: '🐟' },
  { id: 'caviar_red', name: 'Икра красная', kcal: 252, protein: 24, fats: 18, carbs: 4, category: 'fish', emoji: '🍣' },
  { id: 'caviar_black', name: 'Икра чёрная', kcal: 264, protein: 27, fats: 18, carbs: 0, category: 'fish', emoji: '🍣' },
  { id: 'oysters', name: 'Устрицы', kcal: 81, protein: 9, fats: 2, carbs: 4.9, category: 'fish', emoji: '🦪' },
  { id: 'crab', name: 'Краб', kcal: 96, protein: 19, fats: 1.5, carbs: 0, category: 'fish', emoji: '🦀' },
  { id: 'lobster', name: 'Лобстер варёный', kcal: 89, protein: 19, fats: 0.9, carbs: 0, category: 'fish', emoji: '🦞' },
  { id: 'tuna_steak', name: 'Тунец стейк', kcal: 144, protein: 30, fats: 1, carbs: 0, category: 'fish', emoji: '🐟' },
  { id: 'sea_bass', name: 'Сибас', kcal: 124, protein: 18, fats: 6, carbs: 0, category: 'fish', emoji: '🐟' },
  { id: 'haddock', name: 'Пикша', kcal: 74, protein: 16, fats: 0.5, carbs: 0, category: 'fish', emoji: '🐟' },
  { id: 'plaice', name: 'Камбала', kcal: 86, protein: 16, fats: 1.8, carbs: 0, category: 'fish', emoji: '🐟' },
  { id: 'sushi_salmon', name: 'Суши с лососем', kcal: 200, protein: 9, fats: 6, carbs: 28, category: 'fish', emoji: '🍣' },
  { id: 'sushi_eel', name: 'Суши с угрём', kcal: 230, protein: 11, fats: 8, carbs: 30, category: 'fish', emoji: '🍣' },

  // Молочка — расширение
  { id: 'milk_skim', name: 'Молоко обезжиренное', kcal: 35, protein: 3.4, fats: 0.1, carbs: 5, category: 'dairy', emoji: '🥛' },
  { id: 'milk_almond', name: 'Молоко миндальное', kcal: 24, protein: 0.6, fats: 1.4, carbs: 3, category: 'dairy', emoji: '🥛' },
  { id: 'milk_oat', name: 'Молоко овсяное', kcal: 60, protein: 1, fats: 2.5, carbs: 7, category: 'dairy', emoji: '🥛' },
  { id: 'milk_soy', name: 'Молоко соевое', kcal: 54, protein: 3.3, fats: 1.8, carbs: 6, category: 'dairy', emoji: '🥛' },
  { id: 'milk_coconut', name: 'Молоко кокосовое', kcal: 230, protein: 2.3, fats: 24, carbs: 6, category: 'dairy', emoji: '🥥' },
  { id: 'kefir_3_2', name: 'Кефир 3.2%', kcal: 56, protein: 3, fats: 3.2, carbs: 4, category: 'dairy', emoji: '🥛' },
  { id: 'cottage_cheese_2', name: 'Творог 2%', kcal: 86, protein: 18, fats: 2, carbs: 1.8, category: 'dairy', emoji: '🧀' },
  { id: 'mascarpone', name: 'Маскарпоне', kcal: 412, protein: 4.8, fats: 41, carbs: 4.8, category: 'dairy', emoji: '🧀' },
  { id: 'ricotta', name: 'Рикотта', kcal: 174, protein: 11, fats: 13, carbs: 3, category: 'dairy', emoji: '🧀' },
  { id: 'cheese_cream', name: 'Сливочный сыр (типа Philadelphia)', kcal: 342, protein: 6, fats: 34, carbs: 4, category: 'dairy', emoji: '🧀' },
  { id: 'cheese_blue', name: 'Сыр с плесенью', kcal: 353, protein: 21, fats: 29, carbs: 2.3, category: 'dairy', emoji: '🧀' },
  { id: 'cheese_camembert', name: 'Камамбер', kcal: 300, protein: 20, fats: 24, carbs: 0.5, category: 'dairy', emoji: '🧀' },
  { id: 'cheese_brie', name: 'Бри', kcal: 334, protein: 21, fats: 28, carbs: 0.5, category: 'dairy', emoji: '🧀' },
  { id: 'cheese_cheddar', name: 'Чеддер', kcal: 403, protein: 25, fats: 33, carbs: 1.3, category: 'dairy', emoji: '🧀' },
  { id: 'cheese_emmental', name: 'Эмменталь', kcal: 380, protein: 28, fats: 30, carbs: 1, category: 'dairy', emoji: '🧀' },
  { id: 'cheese_suluguni', name: 'Сулугуни', kcal: 290, protein: 19, fats: 23, carbs: 0, category: 'dairy', emoji: '🧀' },
  { id: 'cheese_adyghe', name: 'Адыгейский сыр', kcal: 264, protein: 19, fats: 19, carbs: 1.5, category: 'dairy', emoji: '🧀' },
  { id: 'yogurt_natural', name: 'Йогурт натуральный 3.2%', kcal: 66, protein: 5, fats: 3.2, carbs: 3.5, category: 'dairy', emoji: '🥛' },
  { id: 'whey_drink', name: 'Сывороточный напиток', kcal: 27, protein: 0.8, fats: 0.2, carbs: 5.2, category: 'dairy', emoji: '🥛' },

  // Крупы/мучное — расширение
  { id: 'rice_basmati', name: 'Рис басмати варёный', kcal: 121, protein: 3, fats: 0.3, carbs: 25, category: 'grain', emoji: '🍚' },
  { id: 'rice_wild', name: 'Рис дикий варёный', kcal: 101, protein: 4, fats: 0.3, carbs: 21, category: 'grain', emoji: '🍚' },
  { id: 'millet_cooked', name: 'Пшённая каша на воде', kcal: 90, protein: 3, fats: 0.7, carbs: 17, category: 'grain', emoji: '🍚' },
  { id: 'pearl_barley_cooked', name: 'Перловка варёная', kcal: 109, protein: 3.1, fats: 0.4, carbs: 23, category: 'grain', emoji: '🌾' },
  { id: 'bulgur_cooked', name: 'Булгур варёный', kcal: 83, protein: 3.1, fats: 0.2, carbs: 19, category: 'grain', emoji: '🌾' },
  { id: 'couscous_cooked', name: 'Кускус варёный', kcal: 112, protein: 3.8, fats: 0.2, carbs: 23, category: 'grain', emoji: '🌾' },
  { id: 'noodles_egg', name: 'Лапша яичная варёная', kcal: 138, protein: 4.5, fats: 2, carbs: 25, category: 'grain', emoji: '🍝' },
  { id: 'pasta_durum', name: 'Паста из твёрдой пшеницы', kcal: 165, protein: 6, fats: 1.1, carbs: 32, category: 'grain', emoji: '🍝' },
  { id: 'rice_for_sushi', name: 'Рис для суши готовый', kcal: 130, protein: 2.5, fats: 0.3, carbs: 28, category: 'grain', emoji: '🍣' },
  { id: 'pita', name: 'Лаваш тонкий', kcal: 277, protein: 9, fats: 1, carbs: 56, category: 'grain', emoji: '🥖' },
  { id: 'bagel', name: 'Бейгл', kcal: 250, protein: 10, fats: 1.5, carbs: 49, category: 'grain', emoji: '🥯' },
  { id: 'croissant', name: 'Круассан', kcal: 406, protein: 8, fats: 21, carbs: 46, category: 'grain', emoji: '🥐' },
  { id: 'pancake', name: 'Панкейк', kcal: 227, protein: 6, fats: 9, carbs: 30, category: 'grain', emoji: '🥞' },
  { id: 'waffle', name: 'Вафля', kcal: 291, protein: 8, fats: 14, carbs: 33, category: 'grain', emoji: '🧇' },
  { id: 'crackers', name: 'Крекеры', kcal: 502, protein: 9, fats: 25, carbs: 60, category: 'grain', emoji: '🍪' },
  { id: 'tortilla', name: 'Тортилья кукурузная', kcal: 218, protein: 5.7, fats: 2.9, carbs: 45, category: 'grain', emoji: '🌮' },

  // Овощи — расширение
  { id: 'arugula', name: 'Руккола', kcal: 25, protein: 2.6, fats: 0.7, carbs: 3.7, category: 'veg', emoji: '🥬' },
  { id: 'kale', name: 'Кейл', kcal: 35, protein: 2.9, fats: 1.5, carbs: 4.4, category: 'veg', emoji: '🥬' },
  { id: 'romaine', name: 'Ромейн салат', kcal: 17, protein: 1.2, fats: 0.3, carbs: 3.3, category: 'veg', emoji: '🥬' },
  { id: 'asparagus', name: 'Спаржа', kcal: 20, protein: 2.2, fats: 0.1, carbs: 3.9, category: 'veg', emoji: '🌱' },
  { id: 'brussels_sprouts', name: 'Брюссельская капуста', kcal: 43, protein: 3.4, fats: 0.3, carbs: 9, category: 'veg', emoji: '🥬' },
  { id: 'cauliflower', name: 'Цветная капуста', kcal: 25, protein: 1.9, fats: 0.3, carbs: 5, category: 'veg', emoji: '🥬' },
  { id: 'pumpkin', name: 'Тыква', kcal: 26, protein: 1, fats: 0.1, carbs: 6.5, category: 'veg', emoji: '🎃' },
  { id: 'garlic', name: 'Чеснок', kcal: 149, protein: 6.4, fats: 0.5, carbs: 33, category: 'veg', emoji: '🧄' },
  { id: 'green_beans', name: 'Стручковая фасоль', kcal: 31, protein: 1.8, fats: 0.1, carbs: 7, category: 'veg', emoji: '🌱' },
  { id: 'olives_green', name: 'Оливки зелёные', kcal: 145, protein: 1, fats: 15, carbs: 4, category: 'veg', emoji: '🫒' },
  { id: 'olives_black', name: 'Маслины', kcal: 116, protein: 0.8, fats: 11, carbs: 6, category: 'veg', emoji: '🫒' },
  { id: 'pickle_cucumber', name: 'Огурец маринованный', kcal: 16, protein: 0.7, fats: 0.2, carbs: 2.3, category: 'veg', emoji: '🥒' },
  { id: 'sauerkraut', name: 'Квашеная капуста', kcal: 27, protein: 1.6, fats: 0.1, carbs: 5.2, category: 'veg', emoji: '🥬' },
  { id: 'corn_boiled', name: 'Кукуруза варёная', kcal: 96, protein: 3.4, fats: 1.5, carbs: 20, category: 'veg', emoji: '🌽' },
  { id: 'sweetcorn', name: 'Кукуруза сладкая', kcal: 86, protein: 3.3, fats: 1.2, carbs: 19, category: 'veg', emoji: '🌽' },
  { id: 'edamame', name: 'Эдамаме', kcal: 121, protein: 11, fats: 5, carbs: 9, category: 'veg', emoji: '🌱' },
  { id: 'tofu', name: 'Тофу', kcal: 76, protein: 8, fats: 4.8, carbs: 1.9, category: 'veg', emoji: '🍱' },
  { id: 'tempeh', name: 'Темпе', kcal: 192, protein: 20, fats: 11, carbs: 8, category: 'veg', emoji: '🌱' },

  // Фрукты — расширение
  { id: 'avocado_half', name: 'Авокадо целое', kcal: 160, protein: 2, fats: 15, carbs: 9, category: 'fruit', emoji: '🥑' },
  { id: 'pomegranate', name: 'Гранат', kcal: 83, protein: 1.7, fats: 1.2, carbs: 19, category: 'fruit', emoji: '🍎' },
  { id: 'grapefruit', name: 'Грейпфрут', kcal: 42, protein: 0.8, fats: 0.1, carbs: 11, category: 'fruit', emoji: '🍊' },
  { id: 'mandarin', name: 'Мандарин', kcal: 53, protein: 0.8, fats: 0.3, carbs: 13, category: 'fruit', emoji: '🍊' },
  { id: 'plum', name: 'Слива', kcal: 46, protein: 0.7, fats: 0.3, carbs: 11, category: 'fruit', emoji: '🍑' },
  { id: 'cherry', name: 'Черешня', kcal: 50, protein: 1.1, fats: 0.2, carbs: 12, category: 'fruit', emoji: '🍒' },
  { id: 'apricot', name: 'Абрикос', kcal: 48, protein: 1.4, fats: 0.4, carbs: 11, category: 'fruit', emoji: '🍑' },
  { id: 'melon', name: 'Дыня', kcal: 34, protein: 0.8, fats: 0.2, carbs: 8, category: 'fruit', emoji: '🍈' },
  { id: 'papaya', name: 'Папайя', kcal: 43, protein: 0.5, fats: 0.3, carbs: 11, category: 'fruit', emoji: '🥭' },
  { id: 'passion_fruit', name: 'Маракуйя', kcal: 97, protein: 2.2, fats: 0.7, carbs: 23, category: 'fruit', emoji: '🍑' },
  { id: 'dragon_fruit', name: 'Питахайя', kcal: 60, protein: 1.2, fats: 0, carbs: 13, category: 'fruit', emoji: '🐉' },
  { id: 'fig', name: 'Инжир свежий', kcal: 74, protein: 0.8, fats: 0.3, carbs: 19, category: 'fruit', emoji: '🍇' },
  { id: 'fig_dried', name: 'Инжир сушёный', kcal: 249, protein: 3.3, fats: 0.9, carbs: 64, category: 'fruit', emoji: '🍇' },
  { id: 'persimmon', name: 'Хурма', kcal: 70, protein: 0.6, fats: 0.2, carbs: 18, category: 'fruit', emoji: '🟠' },
  { id: 'guava', name: 'Гуава', kcal: 68, protein: 2.6, fats: 1, carbs: 14, category: 'fruit', emoji: '🥭' },
  { id: 'lychee', name: 'Личи', kcal: 66, protein: 0.8, fats: 0.4, carbs: 17, category: 'fruit', emoji: '🍑' },
  { id: 'banana_chips', name: 'Банановые чипсы', kcal: 519, protein: 2.3, fats: 34, carbs: 58, category: 'fruit', emoji: '🍌' },
  { id: 'goji', name: 'Годжи ягоды сушёные', kcal: 349, protein: 14, fats: 0.4, carbs: 77, category: 'fruit', emoji: '🍒' },

  // Орехи/семена — расширение
  { id: 'macadamia', name: 'Макадамия', kcal: 718, protein: 8, fats: 76, carbs: 14, category: 'nuts', emoji: '🥜' },
  { id: 'brazil_nut', name: 'Бразильский орех', kcal: 656, protein: 14, fats: 66, carbs: 12, category: 'nuts', emoji: '🌰' },
  { id: 'pecan', name: 'Пекан', kcal: 691, protein: 9, fats: 72, carbs: 14, category: 'nuts', emoji: '🌰' },
  { id: 'pine_nuts', name: 'Кедровые орехи', kcal: 673, protein: 14, fats: 68, carbs: 13, category: 'nuts', emoji: '🌰' },
  { id: 'sesame', name: 'Кунжут', kcal: 573, protein: 18, fats: 50, carbs: 23, category: 'nuts', emoji: '🌾' },
  { id: 'tahini', name: 'Тахини', kcal: 595, protein: 17, fats: 53, carbs: 21, category: 'nuts', emoji: '🥜' },
  { id: 'almond_butter', name: 'Миндальная паста', kcal: 614, protein: 21, fats: 56, carbs: 19, category: 'nuts', emoji: '🥜' },

  // Снеки/протеин/добавки — расширение
  { id: 'protein_bar_quest', name: 'Протеиновый батончик Quest', kcal: 200, protein: 21, fats: 9, carbs: 22, category: 'snack', emoji: '🍫', brand: 'Quest' },
  { id: 'protein_cookie', name: 'Протеиновое печенье', kcal: 420, protein: 25, fats: 18, carbs: 40, category: 'snack', emoji: '🍪' },
  { id: 'isolate_whey', name: 'Изолят сывороточный (порция)', kcal: 110, protein: 25, fats: 0.5, carbs: 1, category: 'snack', emoji: '🥤' },
  { id: 'casein_powder', name: 'Казеин (порция)', kcal: 120, protein: 24, fats: 1, carbs: 4, category: 'snack', emoji: '🥤' },
  { id: 'mass_gainer', name: 'Гейнер (порция)', kcal: 650, protein: 40, fats: 8, carbs: 110, category: 'snack', emoji: '🥤' },
  { id: 'energy_gel', name: 'Энергетический гель', kcal: 100, protein: 0, fats: 0, carbs: 25, category: 'snack', emoji: '⚡' },
  { id: 'ice_cream_vanilla', name: 'Мороженое ваниль', kcal: 207, protein: 3.5, fats: 11, carbs: 24, category: 'snack', emoji: '🍦' },
  { id: 'cake_chocolate', name: 'Торт шоколадный', kcal: 371, protein: 4, fats: 17, carbs: 51, category: 'snack', emoji: '🍰' },
  { id: 'donut', name: 'Пончик в глазури', kcal: 452, protein: 4.9, fats: 25, carbs: 51, category: 'snack', emoji: '🍩' },
  { id: 'muffin', name: 'Маффин шоколадный', kcal: 377, protein: 5, fats: 16, carbs: 53, category: 'snack', emoji: '🧁' },
  { id: 'cheesecake', name: 'Чизкейк', kcal: 321, protein: 5.5, fats: 22, carbs: 26, category: 'snack', emoji: '🍰' },
  { id: 'tiramisu', name: 'Тирамису', kcal: 240, protein: 4.5, fats: 12, carbs: 28, category: 'snack', emoji: '🍰' },
  { id: 'milk_chocolate', name: 'Шоколад молочный', kcal: 535, protein: 7.7, fats: 30, carbs: 59, category: 'snack', emoji: '🍫' },
  { id: 'gummy_bears', name: 'Жевательные мишки', kcal: 318, protein: 7, fats: 0, carbs: 78, category: 'snack', emoji: '🐻' },
  { id: 'chips_potato', name: 'Чипсы картофельные', kcal: 536, protein: 7, fats: 35, carbs: 53, category: 'snack', emoji: '🍟' },
  { id: 'popcorn', name: 'Попкорн', kcal: 387, protein: 12, fats: 4.5, carbs: 78, category: 'snack', emoji: '🍿' },
  { id: 'nachos', name: 'Начос с сыром', kcal: 346, protein: 6, fats: 17, carbs: 41, category: 'snack', emoji: '🥨' },
  { id: 'pretzel', name: 'Крендель солёный', kcal: 380, protein: 10, fats: 3.5, carbs: 80, category: 'snack', emoji: '🥨' },
  { id: 'biscotti', name: 'Бискотти', kcal: 388, protein: 7, fats: 12, carbs: 64, category: 'snack', emoji: '🍪' },
  { id: 'protein_chips', name: 'Протеиновые чипсы', kcal: 380, protein: 22, fats: 14, carbs: 38, category: 'snack', emoji: '🍟' },

  // Напитки — расширение
  { id: 'green_tea', name: 'Зелёный чай', kcal: 1, protein: 0, fats: 0, carbs: 0, category: 'drink', emoji: '🍵' },
  { id: 'matcha', name: 'Матча латте', kcal: 95, protein: 4, fats: 4, carbs: 11, category: 'drink', emoji: '🍵' },
  { id: 'latte', name: 'Латте классический', kcal: 50, protein: 3, fats: 2.5, carbs: 4, category: 'drink', emoji: '☕' },
  { id: 'cappuccino', name: 'Капучино', kcal: 33, protein: 2, fats: 1.7, carbs: 2.7, category: 'drink', emoji: '☕' },
  { id: 'americano', name: 'Американо', kcal: 4, protein: 0.2, fats: 0, carbs: 0, category: 'drink', emoji: '☕' },
  { id: 'espresso', name: 'Эспрессо', kcal: 9, protein: 0.1, fats: 0.2, carbs: 1.7, category: 'drink', emoji: '☕' },
  { id: 'kvass', name: 'Квас обычный', kcal: 27, protein: 0.2, fats: 0, carbs: 6.5, category: 'drink', emoji: '🍺' },
  { id: 'compote', name: 'Компот из сухофруктов', kcal: 60, protein: 0.3, fats: 0, carbs: 14, category: 'drink', emoji: '🥤' },
  { id: 'juice_apple', name: 'Сок яблочный', kcal: 46, protein: 0.1, fats: 0.1, carbs: 11, category: 'drink', emoji: '🧃' },
  { id: 'juice_tomato', name: 'Сок томатный', kcal: 17, protein: 0.8, fats: 0.2, carbs: 3.5, category: 'drink', emoji: '🧃' },
  { id: 'smoothie_berry', name: 'Смузи ягодный', kcal: 90, protein: 1.5, fats: 0.5, carbs: 20, category: 'drink', emoji: '🥤' },
  { id: 'kombucha', name: 'Комбуча', kcal: 30, protein: 0, fats: 0, carbs: 8, category: 'drink', emoji: '🍶' },
  { id: 'pre_workout_drink', name: 'Предтрен (порция)', kcal: 15, protein: 0, fats: 0, carbs: 3, category: 'drink', emoji: '⚡' },
  { id: 'whisky', name: 'Виски 40%', kcal: 250, protein: 0, fats: 0, carbs: 0, category: 'drink', emoji: '🥃' },
  { id: 'cognac', name: 'Коньяк', kcal: 239, protein: 0, fats: 0, carbs: 0.1, category: 'drink', emoji: '🥃' },
  { id: 'cocktail_mojito', name: 'Мохито', kcal: 130, protein: 0.1, fats: 0, carbs: 16, category: 'drink', emoji: '🍹' },
  { id: 'pina_colada', name: 'Пина колада', kcal: 245, protein: 0.4, fats: 6, carbs: 32, category: 'drink', emoji: '🍹' },
  { id: 'champagne', name: 'Шампанское брют', kcal: 90, protein: 0.4, fats: 0, carbs: 1.8, category: 'drink', emoji: '🍾' },

  // Готовые блюда / fast-food
  { id: 'pizza_pepperoni', name: 'Пицца пепперони', kcal: 285, protein: 12, fats: 12, carbs: 33, category: 'other', emoji: '🍕' },
  { id: 'pizza_margherita', name: 'Пицца маргарита', kcal: 266, protein: 11, fats: 10, carbs: 33, category: 'other', emoji: '🍕' },
  { id: 'burger_classic', name: 'Бургер с котлетой и сыром', kcal: 295, protein: 17, fats: 14, carbs: 25, category: 'other', emoji: '🍔' },
  { id: 'cheeseburger', name: 'Чизбургер Макдональдс', kcal: 264, protein: 13, fats: 12, carbs: 28, category: 'other', emoji: '🍔' },
  { id: 'big_mac', name: 'Биг Мак', kcal: 257, protein: 12, fats: 14, carbs: 20, category: 'other', emoji: '🍔' },
  { id: 'fries', name: 'Картофель фри', kcal: 312, protein: 3.4, fats: 15, carbs: 41, category: 'other', emoji: '🍟' },
  { id: 'nuggets', name: 'Куриные наггетсы', kcal: 297, protein: 15, fats: 19, carbs: 14, category: 'other', emoji: '🍗' },
  { id: 'kebab', name: 'Шаурма / донер', kcal: 215, protein: 11, fats: 11, carbs: 19, category: 'other', emoji: '🌯' },
  { id: 'falafel', name: 'Фалафель', kcal: 333, protein: 13, fats: 18, carbs: 32, category: 'other', emoji: '🌯' },
  { id: 'pasta_carbonara', name: 'Паста карбонара', kcal: 287, protein: 13, fats: 14, carbs: 27, category: 'other', emoji: '🍝' },
  { id: 'pasta_bolognese', name: 'Паста болоньезе', kcal: 156, protein: 9, fats: 6, carbs: 17, category: 'other', emoji: '🍝' },
  { id: 'lasagna', name: 'Лазанья', kcal: 200, protein: 12, fats: 10, carbs: 15, category: 'other', emoji: '🍝' },
  { id: 'sushi_roll_california', name: 'Ролл Калифорния', kcal: 176, protein: 5, fats: 4, carbs: 30, category: 'other', emoji: '🍣' },
  { id: 'sushi_roll_philadelphia', name: 'Ролл Филадельфия', kcal: 187, protein: 8, fats: 7, carbs: 23, category: 'other', emoji: '🍣' },
  { id: 'pad_thai', name: 'Пад-тай', kcal: 195, protein: 8, fats: 7, carbs: 25, category: 'other', emoji: '🍜' },
  { id: 'pho', name: 'Фо-бо', kcal: 89, protein: 6, fats: 2, carbs: 12, category: 'other', emoji: '🍜' },
  { id: 'ramen', name: 'Рамен', kcal: 145, protein: 7, fats: 5, carbs: 18, category: 'other', emoji: '🍜' },
  { id: 'curry_chicken', name: 'Карри с курицей', kcal: 174, protein: 13, fats: 9, carbs: 9, category: 'other', emoji: '🍛' },
  { id: 'omelette', name: 'Омлет 2 яйца', kcal: 154, protein: 11, fats: 12, carbs: 1, category: 'other', emoji: '🍳' },
  { id: 'scrambled_eggs', name: 'Яичница-болтунья', kcal: 148, protein: 10, fats: 11, carbs: 1.6, category: 'other', emoji: '🍳' },
  { id: 'caesar_salad', name: 'Цезарь с курицей', kcal: 184, protein: 14, fats: 12, carbs: 6, category: 'other', emoji: '🥗' },
  { id: 'greek_salad', name: 'Греческий салат', kcal: 130, protein: 4, fats: 11, carbs: 5, category: 'other', emoji: '🥗' },
  { id: 'sausage_grill', name: 'Колбаски гриль', kcal: 320, protein: 14, fats: 28, carbs: 2, category: 'other', emoji: '🌭' },
  { id: 'soup_chicken', name: 'Куриный суп', kcal: 36, protein: 2.8, fats: 1.5, carbs: 3, category: 'other', emoji: '🥣' },
  { id: 'soup_mushroom', name: 'Грибной суп-крем', kcal: 65, protein: 2.3, fats: 4, carbs: 5, category: 'other', emoji: '🥣' },

  // Прочее
  { id: 'tahini_salad', name: 'Хумус', kcal: 166, protein: 8, fats: 10, carbs: 14, category: 'other', emoji: '🌯' },
  { id: 'guacamole', name: 'Гуакамоле', kcal: 150, protein: 2, fats: 14, carbs: 8, category: 'other', emoji: '🥑' },
  { id: 'salsa', name: 'Сальса томатная', kcal: 36, protein: 1.5, fats: 0.2, carbs: 7, category: 'other', emoji: '🍅' },
  { id: 'ranch_sauce', name: 'Соус ранч', kcal: 484, protein: 1, fats: 51, carbs: 5, category: 'other', emoji: '🥫' },
  { id: 'bbq_sauce', name: 'Соус барбекю', kcal: 172, protein: 0.8, fats: 0.6, carbs: 41, category: 'other', emoji: '🥫' },
  { id: 'tartar_sauce', name: 'Тар-тар соус', kcal: 396, protein: 0.7, fats: 42, carbs: 4, category: 'other', emoji: '🥫' },
  { id: 'sriracha', name: 'Шрирача', kcal: 93, protein: 1.9, fats: 0.9, carbs: 19, category: 'other', emoji: '🌶' },
  { id: 'wasabi', name: 'Васаби', kcal: 109, protein: 4.8, fats: 0.6, carbs: 24, category: 'other', emoji: '🌿' },
  { id: 'pickled_ginger', name: 'Имбирь маринованный', kcal: 51, protein: 0.7, fats: 0.6, carbs: 12, category: 'other', emoji: '🌿' },
  { id: 'coconut_oil', name: 'Масло кокосовое', kcal: 892, protein: 0, fats: 100, carbs: 0, category: 'other', emoji: '🥥' },
  { id: 'avocado_oil', name: 'Масло авокадо', kcal: 884, protein: 0, fats: 100, carbs: 0, category: 'other', emoji: '🥑' },
  { id: 'mct_oil', name: 'MCT масло', kcal: 800, protein: 0, fats: 100, carbs: 0, category: 'other', emoji: '🥥' },
  { id: 'maple_syrup', name: 'Сироп клёна', kcal: 260, protein: 0, fats: 0.1, carbs: 67, category: 'other', emoji: '🍁' },
  { id: 'jam_strawberry', name: 'Джем клубничный', kcal: 278, protein: 0.4, fats: 0, carbs: 69, category: 'other', emoji: '🍓' },
  { id: 'nutella', name: 'Нутелла', kcal: 539, protein: 6, fats: 31, carbs: 58, category: 'other', emoji: '🍫' },
);

/** Сохранённые пользователем кастомные продукты — переданы из стора. */
let _customRegistry: Food[] = [];
export function registerCustomFoods(list: Food[]) {
  _customRegistry = list;
}

export function searchFoods(q: string, region?: 'by' | 'ru' | 'my' | 'all'): Food[] {
  const all = region === 'my' ? _customRegistry : [..._customRegistry, ...foods];
  const filteredByRegion =
    !region || region === 'all' || region === 'my'
      ? all
      : all.filter((f) => f.region === region);
  const term = q.trim().toLowerCase();
  if (!term) return filteredByRegion;
  return filteredByRegion.filter(
    (f) =>
      f.name.toLowerCase().includes(term) ||
      (f.brand?.toLowerCase().includes(term) ?? false),
  );
}

/** Подсчитать ккал/БЖУ для X граммов продукта */
export function macrosFor(food: Food, grams: number) {
  const k = grams / 100;
  return {
    calories: Math.round(food.kcal * k),
    protein: +(food.protein * k).toFixed(1),
    fats: +(food.fats * k).toFixed(1),
    carbs: +(food.carbs * k).toFixed(1),
  };
}
