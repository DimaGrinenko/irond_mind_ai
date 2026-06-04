import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  Text,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useFocusEffect, useNavigation } from '@react-navigation/native';
import { Card } from '../components/common/Card';
import { colors, gradients, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { useTheme } from '../theme/useTheme';
import { photos } from '../theme/photos';
import { AnimatedPhoto } from '../components/anim/AnimatedPhoto';
import { api, type ProgramSummary } from '../api/client';
import { useUserStore } from '../store/userStore';
import {
  t,
  useLang,
  programLabel,
  programSubtitle,
  goalLabel,
  levelLabel,
} from '../i18n';
import { programIconName } from '../utils/programIcon';

function programPhoto(id: string) {
  const key = `program_${id}` as keyof typeof photos;
  return photos[key] ?? null;
}

type TabKey = 'Мои' | 'Шаблоны' | 'Популярные' | 'Новые';

function accentGrad(accent: string): readonly string[] {
  if (accent === 'pink') return ['#7B3FE4', '#FF3FCB'];
  if (accent === 'blue') return ['#3FA8FF', '#7B3FE4'];
  if (accent === 'green') return ['#3FFF8F', '#7B3FE4'];
  return gradients.PRIMARY;
}

function accentGradStop(accent: string) {
  if (accent === 'pink') return 'rgba(123,63,228,0.85)';
  if (accent === 'blue') return 'rgba(63,168,255,0.78)';
  if (accent === 'green') return 'rgba(63,255,143,0.55)';
  return 'rgba(123,63,228,0.85)';
}

export function ProgramsScreen() {
  useLang();
  const theme = useTheme();
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const userId = useUserStore((s) => s.id);
  const [tab, setTab] = useState<TabKey>('Шаблоны');
  const [items, setItems] = useState<ProgramSummary[]>([]);
  const [loading, setLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setLoadError(null);
    try {
      const list = await api.programs.list();
      setItems(list);
    } catch (e) {
      const msg = (e as Error).message || 'Network error';
      setLoadError(msg);
      console.warn('[programs] load failed:', msg);
    } finally {
      setLoading(false);
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load]),
  );

  useEffect(() => {
    load();
  }, [load]);

  const goalKey = useUserStore((s) => s.goalKey);
  const goalKeyUpper = goalKey ? goalKey.toUpperCase() : null;

  const own = useMemo(
    () => items.filter((p) => p.ownerUserId === userId),
    [items, userId],
  );
  // Шаблоны со структурой (kind != CUSTOM, т.е. реальные программы с днями)
  const structuredTemplates = useMemo(
    () => items.filter((p) => !p.ownerUserId && p.kind !== 'CUSTOM'),
    [items],
  );
  const legacyTemplates = useMemo(
    () => items.filter((p) => !p.ownerUserId && p.kind === 'CUSTOM'),
    [items],
  );
  // Программы под цель юзера — выводим в самом верху
  const byGoalFirst = useMemo(() => {
    if (!goalKeyUpper) return structuredTemplates;
    const match = structuredTemplates.filter((p) => p.goalKey === goalKeyUpper);
    const rest = structuredTemplates.filter((p) => p.goalKey !== goalKeyUpper);
    return [...match, ...rest];
  }, [structuredTemplates, goalKeyUpper]);

  const visible = useMemo(() => {
    if (tab === 'Мои') return own;
    if (tab === 'Шаблоны') return byGoalFirst;
    if (tab === 'Новые')
      return [...structuredTemplates].sort((a, b) =>
        b.createdAt.localeCompare(a.createdAt),
      );
    return byGoalFirst;
  }, [tab, own, byGoalFirst, structuredTemplates]);

  const featured = visible[0];
  const rest = visible.slice(1);
  const showLegacySection =
    tab === 'Шаблоны' && legacyTemplates.length > 0;

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScrollView
        contentContainerStyle={{ paddingBottom: 112 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            paddingTop: insets.top + 8,
            paddingHorizontal: 16,
            flexDirection: 'row',
            alignItems: 'center',
          }}
        >
          <Pressable
            onPress={() => nav.navigate('RootTabs', { screen: 'Home' })}
            accessibilityRole="button"
            accessibilityLabel={t('common.back')}
            hitSlop={12}
            style={{ paddingVertical: 8, paddingRight: 10 }}
          >
            <Ionicons name="chevron-back" size={20} color={colors.text} />
          </Pressable>
          <View style={{ flex: 1, alignItems: 'center' }}>
            <Text
              style={{
                color: colors.text,
                fontFamily: fontFamilies.body700,
                fontSize: 18,
              }}
            >
              {t('programs.title')}
            </Text>
          </View>
          <Pressable
            onPress={() => nav.navigate('Calendar')}
            style={{ paddingVertical: 8, paddingLeft: 10 }}
          >
            <Ionicons
              name="calendar-outline"
              size={20}
              color={colors.textSecondary}
            />
          </Pressable>
        </View>

        <View
          style={{
            paddingHorizontal: 16,
            marginTop: 12,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}
        >
          {(['Мои', 'Шаблоны', 'Популярные', 'Новые'] as TabKey[]).map((tk) => {
            const active = tk === tab;
            const label =
              tk === 'Мои'
                ? t('programs.tabsMy')
                : tk === 'Шаблоны'
                  ? t('programs.tabsTemplates')
                  : tk === 'Популярные'
                    ? t('programs.tabsPopular')
                    : t('programs.tabsNew');
            return (
              <Pressable
                key={tk}
                onPress={() => setTab(tk)}
                style={{ paddingVertical: 10 }}
              >
                <Text
                  style={{
                    color: active ? colors.text : colors.textSecondary,
                    fontFamily: fontFamilies.body600,
                    fontSize: 12,
                  }}
                >
                  {label}
                </Text>
                <View
                  style={{
                    marginTop: 8,
                    height: 2,
                    borderRadius: 2,
                    backgroundColor: active ? theme.accentLight : 'transparent',
                  }}
                />
              </Pressable>
            );
          })}
        </View>

        {loading && items.length === 0 ? (
          <View style={{ paddingVertical: 60, alignItems: 'center' }}>
            <ActivityIndicator color={theme.accentLight} />
          </View>
        ) : null}

        {!loading && visible.length === 0 ? (
          <View style={{ paddingHorizontal: 16, marginTop: 24 }}>
            <Card>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body,
                  textAlign: 'center',
                }}
              >
                {loadError
                  ? `${t('common.error')}: ${loadError}`
                  : tab === 'Мои'
                    ? t('programs.emptyMy')
                    : t('programs.empty')}
              </Text>
              {loadError ? (
                <Pressable
                  onPress={load}
                  style={{
                    marginTop: 12,
                    paddingVertical: 10,
                    alignItems: 'center',
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: theme.borderNeon,
                    backgroundColor: 'rgba(157,107,255,0.12)',
                  }}
                >
                  <Text
                    style={{
                      color: theme.accentLight,
                      fontFamily: fontFamilies.body700,
                      fontSize: 12,
                    }}
                  >
                    {t('analytics.retry')}
                  </Text>
                </Pressable>
              ) : null}
            </Card>
          </View>
        ) : null}

        {featured ? (
          <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
            <Card style={{ padding: 0, overflow: 'hidden', borderRadius: 22 }}>
              <LinearGradient
                colors={accentGrad(featured.accent) as any}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <View style={{ padding: 16, minHeight: 210 }}>
                  {programPhoto(featured.id) ? (
                    <View
                      style={{
                        position: 'absolute',
                        right: 0,
                        top: 0,
                        bottom: 0,
                        width: 200,
                        borderTopRightRadius: 22,
                        borderBottomRightRadius: 22,
                        overflow: 'hidden',
                      }}
                    >
                      <AnimatedPhoto
                        source={programPhoto(featured.id) as any}
                        duration={9000}
                      />
                      <LinearGradient
                        colors={
                          [
                            'rgba(0,0,0,0)',
                            'rgba(0,0,0,0.05)',
                            accentGradStop(featured.accent),
                          ] as any
                        }
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={{
                          position: 'absolute',
                          left: 0,
                          right: 0,
                          top: 0,
                          bottom: 0,
                        }}
                      />
                    </View>
                  ) : (
                    <View
                      style={{
                        position: 'absolute',
                        right: -10,
                        top: 10,
                        width: 160,
                        height: 190,
                        borderRadius: 28,
                        backgroundColor: 'rgba(0,0,0,0.25)',
                        borderWidth: 1,
                        borderColor: 'rgba(255,255,255,0.12)',
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons
                        name={programIconName(featured.iconName)}
                        size={72}
                        color="rgba(255,255,255,0.22)"
                      />
                    </View>
                  )}

                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: fontFamilies.body700,
                      fontSize: 28,
                    }}
                  >
                    {programLabel(featured.id, featured.title)}
                  </Text>
                  <Text
                    style={{
                      marginTop: 6,
                      color: colors.text,
                      fontFamily: fontFamilies.body600,
                    }}
                  >
                    {featured.weeks} {t('common.weekShort')} ·{' '}
                    {featured.daysPerWeek}
                    {t('common.perWeek')}
                  </Text>
                  <Text
                    style={{
                      marginTop: 6,
                      color: 'rgba(255,255,255,0.85)',
                      fontFamily: fontFamilies.body,
                      maxWidth: 190,
                    }}
                  >
                    {programSubtitle(featured.id, featured.subtitle)}
                  </Text>
                  <Text
                    style={{
                      marginTop: 8,
                      color: 'rgba(255,255,255,0.7)',
                      fontFamily: fontFamilies.body500,
                      fontSize: 11,
                    }}
                  >
                    {goalLabel(featured.goalKey)} · {levelLabel(featured.level)}
                  </Text>

                  <Pressable
                    onPress={() =>
                      nav.navigate('ProgramDetail', { programId: featured.id })
                    }
                    style={{
                      marginTop: 16,
                      borderRadius: radii.md,
                      overflow: 'hidden',
                    }}
                  >
                    <LinearGradient
                      colors={['rgba(0,0,0,0.25)', 'rgba(0,0,0,0.25)']}
                    >
                      <View
                        style={{
                          height: 46,
                          borderRadius: radii.md,
                          alignItems: 'center',
                          justifyContent: 'center',
                          borderWidth: 1,
                          borderColor: 'rgba(255,255,255,0.18)',
                        }}
                      >
                        <Text
                          style={{
                            color: colors.text,
                            fontFamily: fontFamilies.body700,
                          }}
                        >
                          {t('programs.openProgram')}
                        </Text>
                      </View>
                    </LinearGradient>
                  </Pressable>
                </View>
              </LinearGradient>
            </Card>
          </View>
        ) : null}

        {rest.length > 0 ? (
          <>
            <View style={{ paddingHorizontal: 16, marginTop: 16 }}>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body600,
                  fontSize: 12,
                }}
              >
                {tab === 'Мои' ? t('programs.allMy') : t('programs.others')}
              </Text>
            </View>

            <View style={{ paddingHorizontal: 16, marginTop: 10, gap: 12 }}>
              {rest.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() =>
                    nav.navigate('ProgramDetail', { programId: p.id })
                  }
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.bgSecondary,
                    overflow: 'hidden',
                  }}
                >
                  {programPhoto(p.id) ? (
                    <View style={{ width: 90, height: 86, overflow: 'hidden' }}>
                      <AnimatedPhoto
                        source={programPhoto(p.id) as any}
                        duration={11000}
                      />
                      <LinearGradient
                        colors={
                          [accentGradStop(p.accent), 'rgba(0,0,0,0)'] as any
                        }
                        start={{ x: 0, y: 0.5 }}
                        end={{ x: 1, y: 0.5 }}
                        style={{
                          position: 'absolute',
                          left: 0,
                          top: 0,
                          bottom: 0,
                          width: 36,
                        }}
                      />
                    </View>
                  ) : (
                    <LinearGradient
                      colors={accentGrad(p.accent) as any}
                      style={{
                        width: 90,
                        height: 86,
                        alignItems: 'center',
                        justifyContent: 'center',
                      }}
                    >
                      <Ionicons
                        name={programIconName(p.iconName)}
                        size={32}
                        color="rgba(255,255,255,0.85)"
                      />
                    </LinearGradient>
                  )}
                  <View style={{ flex: 1, paddingHorizontal: 14 }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontFamily: fontFamilies.body700,
                        fontSize: 15,
                      }}
                    >
                      {programLabel(p.id, p.title)}
                    </Text>
                    <Text
                      style={{
                        marginTop: 4,
                        color: colors.textSecondary,
                        fontFamily: fontFamilies.body,
                        fontSize: 12,
                      }}
                    >
                      {p.weeks} {t('common.weekShort')} · {p.daysPerWeek}
                      {t('common.perWeek')} · {goalLabel(p.goalKey)}
                    </Text>
                    <Text
                      style={{
                        marginTop: 2,
                        color: colors.textMuted,
                        fontFamily: fontFamilies.body,
                        fontSize: 11,
                      }}
                    >
                      {programSubtitle(p.id, p.subtitle)}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color={colors.textMuted}
                    style={{ marginRight: 12 }}
                  />
                </Pressable>
              ))}
            </View>
          </>
        ) : null}

        {showLegacySection ? (
          <>
            <View style={{ paddingHorizontal: 16, marginTop: 20 }}>
              <Text
                style={{
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body600,
                  fontSize: 12,
                }}
              >
                {t('programs.legacySection')}
              </Text>
              <Text
                style={{
                  marginTop: 6,
                  color: colors.textMuted,
                  fontFamily: fontFamilies.body,
                  fontSize: 11,
                  lineHeight: 16,
                }}
              >
                {t('programs.legacyHint')}
              </Text>
            </View>
            <View style={{ paddingHorizontal: 16, marginTop: 10, gap: 12 }}>
              {legacyTemplates.map((p) => (
                <Pressable
                  key={p.id}
                  onPress={() =>
                    nav.navigate('ProgramDetail', { programId: p.id })
                  }
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.bgSecondary,
                    padding: 14,
                  }}
                >
                  <Ionicons
                    name={programIconName(p.iconName)}
                    size={28}
                    color={theme.accentLight}
                    style={{ marginRight: 12 }}
                  />
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontFamily: fontFamilies.body700,
                        fontSize: 15,
                      }}
                    >
                      {programLabel(p.id, p.title)}
                    </Text>
                    <Text
                      style={{
                        marginTop: 4,
                        color: colors.textSecondary,
                        fontFamily: fontFamilies.body,
                        fontSize: 12,
                      }}
                    >
                      {programSubtitle(p.id, p.subtitle)}
                    </Text>
                  </View>
                  <Ionicons
                    name="chevron-forward"
                    size={22}
                    color={colors.textMuted}
                  />
                </Pressable>
              ))}
            </View>
          </>
        ) : null}
      </ScrollView>
    </View>
  );
}
