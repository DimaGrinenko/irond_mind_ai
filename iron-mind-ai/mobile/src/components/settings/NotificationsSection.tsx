import React, { useEffect, useState } from 'react';
import { Alert, Pressable, Switch, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  type NotificationPrefs,
  disableNotifications,
  enableNotifications,
  getPrefs,
  rescheduleAll,
  setPrefs,
} from '../../services/notifications';
import { colors } from '../../theme/tokens';
import { useTheme } from '../../theme/useTheme';
import { fontFamilies } from '../../theme/typography';
import { t, useLang } from '../../i18n';

const HOUR_OPTIONS = [6, 7, 8, 18, 19, 20, 21];

export function NotificationsSection() {
  useLang();
  const theme = useTheme();
  const [prefs, setLocal] = useState<NotificationPrefs | null>(null);

  useEffect(() => {
    getPrefs().then(setLocal);
  }, []);

  if (!prefs) return null;

  const update = async (next: NotificationPrefs) => {
    setLocal(next);
    await setPrefs(next);
    if (next.enabled) await rescheduleAll(next);
  };

  const toggleMain = async (v: boolean) => {
    if (v) {
      const updated = await enableNotifications();
      setLocal(updated);
      if (!updated.enabled) {
        Alert.alert(t('notif.permissionDenied'), t('notif.unsupported'));
      }
    } else {
      const updated = await disableNotifications();
      setLocal(updated);
    }
  };

  return (
    <View style={{ paddingHorizontal: 16, marginTop: 14, gap: 12 }}>
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: fontFamilies.body600,
          fontSize: 12,
        }}
      >
        {t('notif.title')}
      </Text>

      <View style={rowStyle}>
        <Ionicons
          name="notifications"
          size={20}
          color={prefs.enabled ? theme.accentLight : colors.textMuted}
          style={{ marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={{
              color: colors.text,
              fontFamily: fontFamilies.body700,
              fontSize: 13,
            }}
          >
            {t('notif.enable')}
          </Text>
          <Text
            style={{
              marginTop: 3,
              color: colors.textSecondary,
              fontFamily: fontFamilies.body,
              fontSize: 12,
            }}
          >
            {prefs.enabled ? t('notif.enabled') : t('notif.disabled')}
          </Text>
        </View>
        <Switch value={prefs.enabled} onValueChange={toggleMain} />
      </View>

      {prefs.enabled ? (
        <>
          <View style={rowStyle}>
            <Ionicons
              name="sunny"
              size={20}
              color={colors.amber}
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: fontFamilies.body700,
                  fontSize: 13,
                }}
              >
                {t('notif.morningPing')}
              </Text>
            </View>
            <Switch
              value={prefs.morningPing}
              onValueChange={(v) => update({ ...prefs, morningPing: v })}
            />
          </View>

          <View style={rowStyle}>
            <Ionicons
              name="alarm"
              size={20}
              color={theme.accentLight}
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: fontFamilies.body700,
                  fontSize: 13,
                }}
              >
                {t('notif.dailyReminder')}
              </Text>
              <Text
                style={{
                  marginTop: 3,
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body,
                  fontSize: 12,
                }}
              >
                {prefs.dailyReminderHour}:00
              </Text>
            </View>
            <Switch
              value={prefs.dailyReminder}
              onValueChange={(v) => update({ ...prefs, dailyReminder: v })}
            />
          </View>

          {prefs.dailyReminder ? (
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                gap: 8,
                paddingHorizontal: 4,
              }}
            >
              {HOUR_OPTIONS.map((h) => {
                const active = prefs.dailyReminderHour === h;
                return (
                  <Pressable
                    key={h}
                    onPress={() => update({ ...prefs, dailyReminderHour: h })}
                    style={{
                      paddingHorizontal: 12,
                      paddingVertical: 8,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: active
                        ? 'rgba(123,63,228,0.55)'
                        : colors.border,
                      backgroundColor: active
                        ? 'rgba(123,63,228,0.18)'
                        : colors.bgSecondary,
                    }}
                  >
                    <Text
                      style={{
                        color: active ? colors.text : colors.textSecondary,
                        fontFamily: fontFamilies.body700,
                        fontSize: 12,
                      }}
                    >
                      {h}:00
                    </Text>
                  </Pressable>
                );
              })}
            </View>
          ) : null}

          <View style={rowStyle}>
            <Ionicons
              name="flame"
              size={20}
              color={colors.amber}
              style={{ marginRight: 12 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  color: colors.text,
                  fontFamily: fontFamilies.body700,
                  fontSize: 13,
                }}
              >
                {t('notif.streakAlert')}
              </Text>
            </View>
            <Switch
              value={prefs.streakAlert}
              onValueChange={(v) => update({ ...prefs, streakAlert: v })}
            />
          </View>
        </>
      ) : null}
    </View>
  );
}

const rowStyle = {
  flexDirection: 'row' as const,
  alignItems: 'center' as const,
  borderRadius: 18,
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: colors.bgSecondary,
  paddingHorizontal: 14,
  paddingVertical: 14,
};
