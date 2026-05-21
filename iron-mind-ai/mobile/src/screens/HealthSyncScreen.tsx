import React from 'react';
import { Alert, Pressable, ScrollView, Switch, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Platform } from 'react-native';
import { Card } from '../components/common/Card';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

export function HealthSyncScreen() {
  useLang();
  const theme = useTheme();
  const nav = useNavigation<any>();
  const [steps, setSteps] = React.useState(true);
  const [sleep, setSleep] = React.useState(true);
  const [hr, setHr] = React.useState(false);
  const [weight, setWeight] = React.useState(false);

  const platformName =
    Platform.OS === 'ios'
      ? t('health.platformIos')
      : Platform.OS === 'android'
        ? t('health.platformAndroid')
        : t('health.platformGeneric');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('health.title')} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Card variant="secondary">
            <View
              style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}
            >
              <View
                style={{
                  width: 52,
                  height: 52,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: theme.borderNeon,
                  backgroundColor: 'rgba(157,107,255,0.18)',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Ionicons name="heart-circle" size={28} color={colors.pink} />
              </View>
              <View style={{ flex: 1 }}>
                <Text
                  style={{
                    color: colors.text,
                    fontFamily: fontFamilies.body700,
                    fontSize: 15,
                  }}
                >
                  {platformName}
                </Text>
                <Text
                  style={{
                    marginTop: 2,
                    color: colors.textMuted,
                    fontFamily: fontFamilies.body,
                    fontSize: 11,
                  }}
                >
                  {t('health.intro')}
                </Text>
              </View>
            </View>
            <Pressable
              onPress={() =>
                Alert.alert(t('common.loading'), t('health.inProgress'))
              }
              style={{
                marginTop: 14,
                paddingVertical: 12,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: theme.borderNeon,
                backgroundColor: 'rgba(157,107,255,0.16)',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  color: theme.accentLight,
                  fontFamily: fontFamilies.body700,
                  fontSize: 13,
                }}
              >
                {t('health.connect', { platform: platformName })}
              </Text>
            </Pressable>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card variant="secondary">
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: fontFamilies.body500,
                fontSize: 10,
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              {t('health.what')}
            </Text>
            <Row
              label={t('health.steps')}
              icon="walk-outline"
              value={steps}
              onChange={setSteps}
            />
            <Row
              label={t('health.sleep')}
              icon="moon-outline"
              value={sleep}
              onChange={setSleep}
            />
            <Row
              label={t('health.hr')}
              icon="heart-outline"
              value={hr}
              onChange={setHr}
            />
            <Row
              label={t('health.weight')}
              icon="scale-outline"
              value={weight}
              onChange={setWeight}
            />
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card
            variant="secondary"
            style={{
              borderColor: colors.green,
              borderWidth: 1,
              backgroundColor: 'rgba(63,255,150,0.06)',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                gap: 8,
                marginBottom: 6,
              }}
            >
              <Ionicons
                name="checkmark-circle"
                size={18}
                color={colors.green}
              />
              <Text
                style={{
                  color: colors.green,
                  fontFamily: fontFamilies.body700,
                  fontSize: 13,
                }}
              >
                {t('health.devTitle')}
              </Text>
            </View>
            <Text
              style={{
                color: colors.text,
                fontFamily: fontFamilies.body,
                fontSize: 12,
                lineHeight: 17,
              }}
            >
              {t('health.devBody')}
            </Text>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card variant="secondary">
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: fontFamilies.body500,
                fontSize: 10,
                letterSpacing: 1,
                marginBottom: 8,
              }}
            >
              {t('health.guideTitle').toUpperCase()}
            </Text>
            <Text
              style={{
                color: colors.text,
                fontFamily: fontFamilies.body,
                fontSize: 11,
                lineHeight: 17,
                marginBottom: 12,
              }}
            >
              {t('health.guideIos')}
            </Text>
            <Text
              style={{
                color: colors.text,
                fontFamily: fontFamilies.body,
                fontSize: 11,
                lineHeight: 17,
                marginBottom: 12,
              }}
            >
              {t('health.guideAndroid')}
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: fontFamilies.body,
                fontSize: 11,
                lineHeight: 17,
              }}
            >
              {t('health.guideWeb')}
            </Text>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card variant="secondary">
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: fontFamilies.body,
                fontSize: 11,
                lineHeight: 16,
              }}
            >
              {t('health.note')}
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

function Row({
  label,
  icon,
  value,
  onChange,
}: {
  label: string;
  icon: keyof typeof Ionicons.glyphMap;
  value: boolean;
  onChange: (v: boolean) => void;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
      }}
    >
      <Ionicons name={icon} size={18} color={colors.textSecondary} />
      <Text
        style={{
          marginLeft: 10,
          flex: 1,
          color: colors.text,
          fontFamily: fontFamilies.body,
          fontSize: 13,
        }}
      >
        {label}
      </Text>
      <Switch value={value} onValueChange={onChange} />
    </View>
  );
}
