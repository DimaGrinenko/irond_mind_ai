import React from 'react';
import { ScrollView, Text, View } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { ProgressBar } from '../components/common/ProgressBar';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { api, type UserDashboard } from '../api/client';
import { colors } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

export function DuelsScreen() {
  useLang();
  const nav = useNavigation<any>();
  const route = useRoute<any>();
  const friendName: string = route.params?.friendName ?? 'Friend';
  const theirVol: number = route.params?.theirVol ?? 0;
  const [my, setMy] = React.useState<UserDashboard | null>(null);

  React.useEffect(() => {
    api.stats.me(7).then(setMy).catch(() => setMy(null));
  }, []);

  const myVol = my?.volumeKg ?? 0;
  const total = Math.max(1, myVol + theirVol);
  const myRatio = myVol / total;
  const winning = myVol > theirVol;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('duels.title')} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Card variant="secondary" style={{ padding: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>{t('duels.you')}</Text>
                <Text
                  style={{
                    marginTop: 4,
                    color: winning ? colors.green : colors.text,
                    fontFamily: fontFamilies.heading,
                    fontSize: 28,
                  }}
                >
                  {myVol.toLocaleString('ru')}
                </Text>
                <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 10 }}>{t('common.kg')}</Text>
              </View>
              <View style={{ width: 56, alignItems: 'center', justifyContent: 'center' }}>
                <Text style={{ color: colors.pink, fontFamily: fontFamilies.heading, fontSize: 22 }}>VS</Text>
              </View>
              <View style={{ flex: 1, alignItems: 'center' }}>
                <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>
                  {friendName}
                </Text>
                <Text
                  style={{
                    marginTop: 4,
                    color: !winning ? colors.green : colors.text,
                    fontFamily: fontFamilies.heading,
                    fontSize: 28,
                  }}
                >
                  {theirVol.toLocaleString('ru')}
                </Text>
                <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 10 }}>{t('common.kg')}</Text>
              </View>
            </View>

            <View style={{ marginTop: 18 }}>
              <ProgressBar value={myRatio} color={winning ? colors.green : colors.pink} />
              <Text
                style={{
                  marginTop: 6,
                  color: winning ? colors.green : colors.pink,
                  fontFamily: fontFamilies.body700,
                  fontSize: 12,
                  textAlign: 'center',
                }}
              >
                {winning
                  ? t('duels.aheadBy', { kg: (myVol - theirVol).toLocaleString('ru') })
                  : t('duels.behindBy', { kg: (theirVol - myVol).toLocaleString('ru') })}
              </Text>
            </View>
          </Card>
        </View>

        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card variant="secondary">
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="information-circle-outline" size={18} color={colors.cyan} />
              <Text style={{ flex: 1, color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 12 }}>
                {t('duels.note')}
              </Text>
            </View>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}
