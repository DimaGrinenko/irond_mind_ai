import { Platform } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Constants from 'expo-constants';

const STORAGE_KEY = 'ai_trainer_notifications_v1';

export type NotificationPrefs = {
  enabled: boolean;
  dailyReminder: boolean;
  dailyReminderHour: number; // 0-23
  streakAlert: boolean;
  morningPing: boolean;
};

const DEFAULTS: NotificationPrefs = {
  enabled: false,
  dailyReminder: true,
  dailyReminderHour: 18,
  streakAlert: true,
  morningPing: true,
};

/** В Expo Go (SDK 53+) часть функционала expo-notifications выпилена. */
const IS_EXPO_GO = Constants.appOwnership === 'expo';

/**
 * Ленивая загрузка `expo-notifications` — чтобы не падал require на платформах
 * без модуля и чтобы убрать варнинг в Expo Go при импорте на старте.
 */
async function loadNotifications() {
  if (IS_EXPO_GO || Platform.OS === 'web') return null;
  return await import('expo-notifications');
}

export async function getPrefs(): Promise<NotificationPrefs> {
  try {
    const raw = await AsyncStorage.getItem(STORAGE_KEY);
    if (!raw) return DEFAULTS;
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return DEFAULTS;
  }
}

export async function setPrefs(prefs: NotificationPrefs): Promise<void> {
  await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(prefs));
}

export async function requestPermissions(): Promise<boolean> {
  const Notifications = await loadNotifications();
  if (!Notifications) return false;
  const Device = await import('expo-device');
  if (!Device.isDevice) return false;

  const { status: existing } = await Notifications.getPermissionsAsync();
  let final = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    final = status;
  }

  if (Platform.OS === 'android') {
    await Notifications.setNotificationChannelAsync('default', {
      name: 'Iron Mind',
      importance: Notifications.AndroidImportance.HIGH,
      vibrationPattern: [0, 220, 100, 220],
      lightColor: '#7B3FE4',
    });
  }

  return final === 'granted';
}

export async function rescheduleAll(prefs: NotificationPrefs): Promise<void> {
  const Notifications = await loadNotifications();
  if (!Notifications) return;
  await Notifications.cancelAllScheduledNotificationsAsync();
  if (!prefs.enabled) return;

  if (prefs.morningPing) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Доброе утро, атлет',
        body: 'Сегодня — ещё один кубик на твоём дереве. План на день — внутри.',
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: 8,
        minute: 0,
      },
    });
  }

  if (prefs.dailyReminder) {
    await Notifications.scheduleNotificationAsync({
      content: {
        title: 'Время тренировки',
        body: 'Не дай серии оборваться. Открой приложение и сделай минимум.',
        sound: 'default',
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: prefs.dailyReminderHour,
        minute: 0,
      },
    });
  }
}

export async function scheduleStreakAtRisk(streakDays: number): Promise<void> {
  const Notifications = await loadNotifications();
  if (!Notifications) return;
  await Notifications.scheduleNotificationAsync({
    content: {
      title: `Серия ${streakDays} дней под угрозой`,
      body: 'До конца дня осталось мало времени. Заверши хотя бы одну тренировку.',
      sound: 'default',
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.TIME_INTERVAL,
      seconds: 60,
    },
  });
}

export async function enableNotifications(): Promise<NotificationPrefs> {
  const granted = await requestPermissions();
  const prefs = await getPrefs();
  const next: NotificationPrefs = { ...prefs, enabled: granted };
  await setPrefs(next);
  await rescheduleAll(next);
  return next;
}

export async function disableNotifications(): Promise<NotificationPrefs> {
  const Notifications = await loadNotifications();
  if (Notifications) await Notifications.cancelAllScheduledNotificationsAsync();
  const prefs = await getPrefs();
  const next: NotificationPrefs = { ...prefs, enabled: false };
  await setPrefs(next);
  return next;
}

/** Поддерживаются ли уведомления на текущей платформе (false в Expo Go). */
export function isNotificationsSupported(): boolean {
  return !IS_EXPO_GO && Platform.OS !== 'web';
}
