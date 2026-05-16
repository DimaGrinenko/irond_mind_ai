# AI Trainer — ТЗ для разработки

## Что нужно сделать

Мобильное приложение **AI Trainer** на **React Native + Expo + TypeScript**, идентичное скриншотам в папке `screens/`.

## Стек

```
- Expo SDK 50 (managed workflow)
- React Native, TypeScript (strict)
- React Navigation v6 (BottomTabs + NativeStack)
- AsyncStorage + expo-sqlite (локальная БД)
- react-native-svg
- expo-linear-gradient
- react-native-reanimated 3
- lucide-react-native (иконки)
- zustand (state)
- @expo-google-fonts/manrope, @expo-google-fonts/unbounded
```

## Что должно работать

✅ 14 экранов с навигацией (5 табов внизу + стек поверх)
✅ Локальная БД сохраняет: тренировки, замеры тела, питание, прогресс по программе
✅ Mock AI-чат (готовые ответы по триггерным словам)
✅ Графики прогресса (линейные + кольцевые)
✅ SVG-фигура человека с подсветкой мышц (для замеров и аналитики)
✅ Анимации появления, glow-эффекты на кнопках

## Чего НЕ нужно

❌ Реальный AI API (только моки)
❌ Платежи / In-App Purchases
❌ Видео упражнений (заглушка с play-кнопкой → alert)
❌ Регистрация (захардкожен пользователь "Александр")
❌ Push-уведомления
❌ Сетевой бэкенд

---

## 🎨 Дизайн-система

### Цвета

```ts
// Backgrounds
bg: '#000000'              // основной фон
bgSecondary: '#0F0F1A'     // карточки
bgCard: '#15151F'          // вложенные карточки
border: '#2A2A3E'

// Accents (фиолетовый неон)
purpleLight: '#B14EFF'
purple: '#7B3FE4'          // ОСНОВНОЙ акцент
purpleDeep: '#4F1FB8'
pink: '#FF3FCB'            // розовый (мышцы анатомии)
blue: '#3FA8FF'
green: '#3FFF8F'           // положительные показатели
red: '#FF3F5C'

// Text
text: '#FFFFFF'
textSecondary: '#9090A8'
textMuted: '#5A5A70'

// Gradients
PRIMARY: ['#7B3FE4', '#B14EFF']
HERO: ['#4F1FB8', '#7B3FE4', '#FF3FCB']
PREMIUM: ['#7B3FE4', '#B14EFF', '#FF3FCB']
```

### Шрифты (Google Fonts, бесплатные)

- **Unbounded 700** — крупные заголовки ("ТВОЙ ПУТЬ. ТВОИ ПРАВИЛА.")
- **Manrope 700/600/500/400** — всё остальное

❌ НЕ используй Inter, Roboto, Arial, San Francisco

### Glow-эффекты обязательны

Все CTA-кнопки и активные элементы должны светиться:
```ts
shadowColor: '#7B3FE4',
shadowOpacity: 0.6,
shadowRadius: 20,
shadowOffset: { width: 0, height: 0 },
elevation: 12,
```

### Spacing (8pt grid)

```
xs: 4, sm: 8, md: 12, lg: 16, xl: 20, xxl: 24, xxxl: 32
```

### Радиусы

```
sm: 8 (теги), md: 12 (кнопки), lg: 16 (карточки), xl: 20 (большие), full: 9999 (круги)
```

---

## 📱 Список экранов и где они в папке screens/

### Bottom Tabs (5 табов)
1. **HomeScreen** → `20_hero_main_phone.png`, `01_home_hero.png`, `10_home_dashboard.png`
2. **ProgramsScreen** → `02_programs.png`, `11_programs_my.png`
3. **AI Trainer (центральный таб)** → `04_ai_chat.png`, `16_ai_trainer_chat.png`
4. **AnalyticsScreen** → `06_analytics.png`, `14_muscle_analytics.png`
5. **ProfileScreen** → создать на основе общего стиля

### Stack-экраны
- **ProgramDetailScreen** (новый, на основе элементов программ)
- **ExerciseDetailScreen** → `03_exercise_detail.png`, `15_exercise_bench.png`
- **WorkoutScreen** (активная тренировка) → `05_workout_session.png`
- **NutritionScreen** → `07_nutrition.png`, `12_nutrition_diet.png`
- **BodyMeasurementsScreen** → `08_body_measurements.png`, `21_body_measurements_v2.png`
- **CalendarScreen** → `18_calendar.png`
- **AchievementsScreen** → `13_achievements.png`
- **CommunityScreen** → `17_community.png`
- **SubscriptionScreen** → `09_subscription.png`
- **MotivationScreen** → `19_motivation.png`

---

## 🧩 Ключевые компоненты

### `<BottomTabBar>` — кастомный таб-бар
**5 табов**, центральная кнопка — **круглая, выпуклая, с логотипом** и сильным glow. Стандартный bottom-tabs так не умеет — нужен custom tabBar через `tabBar={(props) => <CustomTabBar {...props} />}`.

### `<BodyFigure>` — SVG фигура человека
Ключевой компонент. Векторный силуэт человека (вид спереди), каждая группа мышц — отдельный `<Path>` с возможностью подсветки. Используется в:
- HomeScreen (Hero) — целиком с glow
- BodyMeasurementsScreen — с замерами по бокам
- AnalyticsScreen — с цветными группами мышц
- ExerciseDetailScreen — мини-версия с подсветкой задействованных мышц

### `<RingChart>` — кольцевой прогресс
Для калорий (2150 / 2800), общего прогресса (87%). На SVG с градиентной обводкой.

### `<GradientButton>` — основная CTA
Высота 56, радиус 12, градиент primary, неоновая тень фиолетовая.

### `<Card>` — карточка
Тёмный фон #0F0F1A, бордер #2A2A3E 1px, радиус 16, паддинг 16.

---

## 📂 Структура проекта

```
ai-trainer/
├── App.tsx
├── package.json
├── app.json
├── tsconfig.json
├── babel.config.js
├── src/
│   ├── theme/         # colors, typography, spacing, shadows
│   ├── components/
│   │   ├── common/    # Card, GradientButton, ProgressBar, Tag, Header...
│   │   ├── charts/    # LineChart, RingChart, MuscleGroupBars
│   │   ├── anatomy/   # BodyFigure (SVG)
│   │   └── layout/    # BottomTabBar, ScreenHeader
│   ├── screens/       # все экраны
│   ├── navigation/    # RootNavigator, BottomTabs, types
│   ├── store/         # zustand: user, workout, nutrition, measurements
│   ├── db/            # SQLite: schema, migrations, queries
│   ├── data/          # моки: programs, exercises, aiChatResponses, achievements
│   └── utils/         # formatters, calculations
└── assets/
    └── screens-reference/   # сюда положи все 21 PNG из этой папки
```

---

## 📊 Моковые данные (сделай файлы)

### Программы (5 штук)
МАССА (12 нед, Продвинутый), РЕЛЬЕФ (12 нед, Средний), СИЛА (10 нед, Продвинутый), ВЫНОСЛИВОСТЬ (8 нед, Средний), ПРЕСС (4 нед, Базовый).

### Упражнения (минимум 15)
Жим штанги лёжа, Жим гантелей на наклонной, Разведение гантелей, Отжимания на брусьях, Французский жим лёжа, Разгибание на блоке, Приседания со штангой, Становая тяга, Подтягивания, Тяга штанги в наклоне, и т.д.

Для каждого: название, мышечные группы, оборудование, инструкция (4-6 шагов), советы (3-5 пунктов), сложность.

### AI ответы (по триггерам)
- "масс*", "набор" → советы по набору массы
- "питан*", "калор*" → про КБЖУ
- "программ*" → предложить выбрать программу
- "сон" → про восстановление
- "мотив*" → мотивирующая фраза
- default → "Расскажи подробнее, я помогу подобрать решение."

### Достижения
- "Первая тренировка", "7 дней подряд", "30 дней подряд", "100 тренировок", "Прокачал грудь", "Силач" и т.д.

### Цитаты для MotivationScreen (10+ штук)
"Дисциплина важнее мотивации", "Боль временна — гордость навсегда" и т.д.

---

## 🗄 Схема БД (SQLite)

```sql
CREATE TABLE user (
  id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  goal TEXT,
  current_program_id TEXT,
  program_week INTEGER DEFAULT 1
);

CREATE TABLE workouts (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  program_id TEXT,
  name TEXT,
  duration_seconds INTEGER,
  calories INTEGER,
  completed INTEGER DEFAULT 0
);

CREATE TABLE workout_exercises (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_id INTEGER,
  exercise_id TEXT,
  completed INTEGER DEFAULT 0,
  FOREIGN KEY (workout_id) REFERENCES workouts(id)
);

CREATE TABLE exercise_sets (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  workout_exercise_id INTEGER,
  set_number INTEGER,
  weight REAL,
  reps INTEGER,
  completed INTEGER DEFAULT 0,
  FOREIGN KEY (workout_exercise_id) REFERENCES workout_exercises(id)
);

CREATE TABLE measurements (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  weight REAL,
  chest REAL, waist REAL, hips REAL,
  biceps REAL, thigh REAL, calf REAL,
  neck REAL, shoulders REAL, forearm REAL
);

CREATE TABLE nutrition_entries (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  date TEXT NOT NULL,
  meal_type TEXT, -- 'breakfast' | 'lunch' | 'dinner' | 'snack'
  name TEXT,
  calories INTEGER,
  protein REAL, fats REAL, carbs REAL,
  time TEXT
);

CREATE TABLE chat_messages (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  role TEXT, -- 'user' | 'assistant'
  content TEXT,
  timestamp TEXT
);
```

---

## ⚠️ Правила разработки

1. **СВЕРЯЙСЯ С PNG** — каждый экран открывай и копируй визуально точно
2. **Никаких Inter/Roboto** — только Manrope + Unbounded
3. **Glow обязателен** на всех CTA и активных элементах
4. **Не упрощай** градиенты до плоских цветов
5. **Всё работает** — кнопки кликаются, данные сохраняются, навигация переходит
6. **Картинки людей не нужны** — заменяй на:
   - SVG-фигуру (BodyFigure) для главного героя
   - Градиентные блоки с большими иконками для программ (Dumbbell, Flame, Zap)
   - SVG-силуэт головы или иконку Sparkles для AI-тренера
   - Круги с инициалами на градиенте для аватарок

---

## 🚀 Команды

```bash
# Создание
npx create-expo-app ai-trainer --template expo-template-blank-typescript
cd ai-trainer

# Зависимости
npx expo install react-native-screens react-native-safe-area-context react-native-gesture-handler react-native-reanimated react-native-svg expo-linear-gradient expo-blur expo-sqlite expo-font @react-native-async-storage/async-storage
npm install @react-navigation/native @react-navigation/bottom-tabs @react-navigation/native-stack zustand date-fns lucide-react-native @expo-google-fonts/manrope @expo-google-fonts/unbounded

# Запуск
npx expo start
```

Скачай Expo Go на телефон → отсканируй QR из терминала → приложение запустится.
