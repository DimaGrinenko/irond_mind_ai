import React from 'react';
import { Text, View } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Ionicons } from '@expo/vector-icons';
import { fontFamilies } from '../../theme/typography';
import { t, useLang } from '../../i18n';

type Props = {
  treeLevel: number;
  totalXp: number;
  leaves: number;
  streakDays: number;
  unlocked: number;
  total: number;
  userName: string;
};

/**
 * Карточка для шеринга — фиксированный размер 1080×1920 (TG/IG story aspect).
 * Рендерится за пределами видимого экрана, потом захватывается react-native-view-shot.
 */
export function ShareCard({
  treeLevel,
  totalXp,
  leaves,
  streakDays,
  unlocked,
  total,
  userName,
}: Props) {
  useLang();
  return (
    <View
      style={{
        width: 1080,
        height: 1920,
        backgroundColor: '#04060B',
        padding: 80,
      }}
    >
      <LinearGradient
        colors={[
          'rgba(63,255,177,0.35)',
          'rgba(15,174,101,0.05)',
          'rgba(0,0,0,0)',
        ]}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 900 }}
      />

      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
        <Ionicons name="leaf" size={64} color="#3FFFB1" />
        <View>
          <Text
            style={{
              color: '#fff',
              fontFamily: fontFamilies.heading,
              fontSize: 56,
              letterSpacing: 2,
            }}
          >
            IRON MIND
          </Text>
          <Text
            style={{
              color: 'rgba(255,255,255,0.7)',
              fontFamily: fontFamilies.body500,
              fontSize: 28,
              marginTop: 8,
            }}
          >
            {t('sc.tagline')}
          </Text>
        </View>
      </View>

      <View style={{ marginTop: 80 }}>
        <Text
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontFamily: fontFamilies.body500,
            fontSize: 32,
            letterSpacing: 4,
          }}
        >
          {userName.toUpperCase()}
        </Text>
        <Text
          style={{
            color: '#fff',
            fontFamily: fontFamilies.heading,
            fontSize: 110,
            lineHeight: 120,
            marginTop: 16,
          }}
        >
          {t('sc.level')}
          {'\n'}
          <Text style={{ color: '#3FFFB1' }}>{treeLevel}</Text>
        </Text>
      </View>

      <View style={{ marginTop: 100, gap: 36 }}>
        <Row
          icon="flame"
          label={t('sc.streakLabel')}
          value={t('sc.streakValue', { n: streakDays })}
          tint="#FFB347"
        />
        <Row
          icon="trophy"
          label={t('sc.achievements')}
          value={t('sc.achievementsValue', { u: unlocked, t: total })}
          tint="#3FFFB1"
        />
        <Row
          icon="leaf"
          label={t('sc.leaves')}
          value={leaves.toLocaleString('ru-RU')}
          tint="#3FFFB1"
        />
        <Row
          icon="flash"
          label={t('sc.totalXp')}
          value={`${totalXp.toLocaleString('ru-RU')} XP`}
          tint="#B14EFF"
        />
      </View>

      <View
        style={{
          position: 'absolute',
          left: 80,
          right: 80,
          bottom: 80,
          alignItems: 'center',
        }}
      >
        <Text
          style={{
            color: 'rgba(255,255,255,0.6)',
            fontFamily: fontFamilies.body500,
            fontSize: 28,
            textAlign: 'center',
            lineHeight: 36,
          }}
        >
          {t('sc.footer')}
        </Text>
        <Text
          style={{
            marginTop: 28,
            color: '#3FFFB1',
            fontFamily: fontFamilies.body700,
            fontSize: 26,
            letterSpacing: 2,
          }}
        >
          ironmind.ai
        </Text>
      </View>
    </View>
  );
}

function Row({
  icon,
  label,
  value,
  tint,
}: {
  icon: keyof typeof Ionicons.glyphMap;
  label: string;
  value: string;
  tint: string;
}) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 24 }}>
      <View
        style={{
          width: 80,
          height: 80,
          borderRadius: 24,
          alignItems: 'center',
          justifyContent: 'center',
          borderWidth: 2,
          borderColor: `${tint}66`,
          backgroundColor: `${tint}22`,
        }}
      >
        <Ionicons name={icon} size={40} color={tint} />
      </View>
      <View>
        <Text
          style={{
            color: 'rgba(255,255,255,0.55)',
            fontFamily: fontFamilies.body500,
            fontSize: 26,
            letterSpacing: 2,
          }}
        >
          {label.toUpperCase()}
        </Text>
        <Text
          style={{
            color: '#fff',
            fontFamily: fontFamilies.heading,
            fontSize: 44,
            marginTop: 4,
          }}
        >
          {value}
        </Text>
      </View>
    </View>
  );
}
