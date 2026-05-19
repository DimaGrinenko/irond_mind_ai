# iOS Lock Screen Widget — план реализации

## TL;DR
Виджет на экран блокировки **невозможно сделать в Expo Go**. Нужен:
1. **Apple Developer Account** ($99/год)
2. **EAS Build** (для custom dev client)
3. **Native Swift extension** через WidgetKit
4. **App Group** для shared storage с RN-приложением

Время реализации: **6-10 часов** + время на тест/билд.

## Архитектура

```
┌─────────────────────────────────────────────────┐
│  iOS Widget Extension (Swift, WidgetKit)        │
│  - Lock screen виджет с упражнением             │
│  - Кнопка «next» через AppIntent (iOS 16+)      │
│  - Обновление каждые 15 минут или по событию    │
└──────────────────┬──────────────────────────────┘
                   │ App Group shared storage
                   │ (UserDefaults в group container)
                   ↓
┌─────────────────────────────────────────────────┐
│  React Native App (Expo)                        │
│  - При старте GymMode пишет в App Group:        │
│    - текущее упражнение                         │
│    - подходы текущие/всего                      │
│    - название тренировки                        │
│  - На «next exercise» обновляет App Group      │
└─────────────────────────────────────────────────┘
```

## Шаги реализации

### 1. Перейти с Expo Go на dev build
```bash
cd mobile
npx expo install expo-dev-client
eas init  # требует Apple Developer
eas build:configure
```

### 2. Установить плагин для native targets
```bash
npm install --save-dev @bacons/apple-targets
```
В `app.json`:
```json
{
  "expo": {
    "plugins": ["@bacons/apple-targets"]
  }
}
```

### 3. Создать Widget extension
Создать папку `targets/widget/`:
```
targets/widget/
  ├── expo-target.config.js     # конфиг таргета
  ├── Widget.swift              # WidgetKit код
  ├── Intent.swift              # AppIntent для кнопок
  ├── Assets.xcassets/          # иконки виджета
  └── Info.plist
```

`Widget.swift` основа:
```swift
import WidgetKit
import SwiftUI

struct WorkoutEntry: TimelineEntry {
    let date: Date
    let exerciseName: String
    let setProgress: String  // "2/4"
    let workoutTitle: String
}

struct WorkoutWidget: Widget {
    let kind: String = "WorkoutWidget"

    var body: some WidgetConfiguration {
        StaticConfiguration(kind: kind, provider: Provider()) { entry in
            WorkoutWidgetView(entry: entry)
        }
        .configurationDisplayName("Iron Mind: Тренировка")
        .description("Текущее упражнение и сеты на экране блокировки.")
        .supportedFamilies([.accessoryCircular, .accessoryRectangular, .accessoryInline])
    }
}
```

### 4. App Group для shared storage
В Xcode добавить capability "App Groups" в основное приложение И в widget extension. Использовать тот же group ID, например `group.com.ironmind.shared`.

В RN коде через `react-native-shared-group-preferences` или нативный модуль писать:
```typescript
import SharedPreferences from 'react-native-shared-group-preferences';
const APP_GROUP = 'group.com.ironmind.shared';

await SharedPreferences.setItem('current_workout', JSON.stringify({
  exerciseName: 'Жим штанги лёжа',
  setProgress: '2/4',
  workoutTitle: 'Грудь A',
}), APP_GROUP);
```

В Swift виджете читать:
```swift
let defaults = UserDefaults(suiteName: "group.com.ironmind.shared")
let json = defaults?.string(forKey: "current_workout")
```

### 5. AppIntent для интерактивных кнопок (iOS 16+)
```swift
import AppIntents

struct NextExerciseIntent: AppIntent {
    static var title: LocalizedStringResource = "Следующее упражнение"

    func perform() async throws -> some IntentResult {
        // открыть приложение в GymMode на следующем упражнении
        // через deep link iron-mind://gym-mode/next
        return .result()
    }
}
```

### 6. Deep links для возврата из виджета
В `app.json`:
```json
{
  "expo": {
    "scheme": "iron-mind"
  }
}
```
В `RootNavigator` обрабатывать `iron-mind://gym-mode/next` → navigation.navigate('GymMode') + active workout next.

## Альтернативы

### Live Activity (iOS 16.1+) — проще
Это не виджет на lock screen, но **активность с Dynamic Island** во время тренировки.
- Не требует App Group (использует push tokens)
- Можно через `expo-modules-core` или `react-native-live-activity`
- 4-8 часов реализации

### Push Notification на lock screen — самый простой
- Существующая `expo-notifications` инфраструктура
- При начале тренировки сразу push с текстом упражнения
- На «next» обновлять push (но это hack, не виджет)
- ~1 час работы

## Рекомендация
Для MVP — **Live Activity с Dynamic Island**. Виджет на lock screen — для версии 2.0 после первых платных пользователей.

## Текущий статус
- ⏸ Отложено: требует EAS + Apple Developer
- ✅ В Pro tier зарезервирована как «Уведомления о тренировках»
- ✅ Документация подготовлена для будущей реализации
