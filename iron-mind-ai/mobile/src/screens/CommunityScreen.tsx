import React, { useState } from 'react';
import { Alert, Pressable, ScrollView, Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { Card } from '../components/common/Card';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { communityPosts } from '../data/community';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

type TabKey = 'Лента' | 'Друзья' | 'Группы';

function Avatar({ name }: { name: string }) {
  const initials = name.slice(0, 1).toUpperCase();
  return (
    <LinearGradient
      colors={['#7B3FE4', '#B14EFF'] as any}
      style={{
        width: 36,
        height: 36,
        borderRadius: 18,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Text style={{ color: colors.text, fontFamily: fontFamilies.body700 }}>
        {initials}
      </Text>
    </LinearGradient>
  );
}

export function CommunityScreen({ navigation }: any) {
  const lang = useLang();
  const [tab, setTab] = useState<TabKey>('Лента');
  const posts = communityPosts(lang);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title={t('community.feedTitle')}
        onBack={() => navigation.goBack()}
        right={
          <Pressable
            onPress={() =>
              Alert.alert(t('community.feedTitle'), t('community.feedSoon'))
            }
          >
            <Text
              style={{
                color: colors.textSecondary,
                fontFamily: fontFamilies.body600,
                fontSize: 12,
              }}
            >
              {t('comm.viewAll')}
            </Text>
          </Pressable>
        }
      />

      <View
        style={{
          paddingHorizontal: 16,
          marginTop: 8,
          flexDirection: 'row',
          gap: 10,
        }}
      >
        {(['Лента', 'Друзья', 'Группы'] as TabKey[]).map((tk) => {
          const active = tk === tab;
          const label =
            tk === 'Лента'
              ? t('comm.tabFeed')
              : tk === 'Друзья'
                ? t('comm.tabFriends')
                : t('comm.tabGroups');
          return (
            <Pressable
              key={tk}
              onPress={() => setTab(tk)}
              style={{
                paddingHorizontal: 14,
                paddingVertical: 10,
                borderRadius: 16,
                borderWidth: 1,
                borderColor: active ? 'rgba(123,63,228,0.55)' : colors.border,
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
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={{ paddingHorizontal: 16, marginTop: 12, gap: 12 }}>
          {posts.map((p) => (
            <Card key={p.id} style={{ padding: 0, overflow: 'hidden' }}>
              <LinearGradient
                colors={['rgba(21,21,31,0.85)', 'rgba(0,0,0,0.95)']}
                style={{ padding: 14 }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: 10,
                  }}
                >
                  <Avatar name={p.name} />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontFamily: fontFamilies.body700,
                        fontSize: 13,
                      }}
                    >
                      {p.name}
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        color: colors.textMuted,
                        fontFamily: fontFamilies.body600,
                        fontSize: 11,
                      }}
                    >
                      {p.timeAgo}
                    </Text>
                  </View>
                  <Pressable style={{ padding: 6 }}>
                    <Ionicons
                      name="ellipsis-horizontal"
                      size={18}
                      color={colors.textSecondary}
                    />
                  </Pressable>
                </View>

                <View style={{ marginTop: 10 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: fontFamilies.body700,
                      fontSize: 14,
                    }}
                  >
                    {p.title}
                  </Text>
                  <Text
                    style={{
                      marginTop: 4,
                      color: colors.textSecondary,
                      fontFamily: fontFamilies.body600,
                      fontSize: 12,
                    }}
                  >
                    {p.subtitle}
                  </Text>
                </View>

                <View
                  style={{
                    marginTop: 12,
                    borderRadius: 18,
                    overflow: 'hidden',
                    borderWidth: 1,
                    borderColor: 'rgba(42,42,62,0.9)',
                  }}
                >
                  <View style={{ height: 110, flexDirection: 'row' }}>
                    {[0, 1, 2].map((i) => (
                      <View
                        key={i}
                        style={{
                          flex: 1,
                          backgroundColor:
                            i === 1
                              ? 'rgba(123,63,228,0.12)'
                              : 'rgba(255,255,255,0.04)',
                          borderRightWidth: i === 2 ? 0 : 1,
                          borderRightColor: 'rgba(42,42,62,0.6)',
                        }}
                      />
                    ))}
                  </View>
                </View>
              </LinearGradient>
            </Card>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
