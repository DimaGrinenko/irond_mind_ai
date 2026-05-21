/**
 * Друзья: приглашения по @handle или user id, поиск по своим, удаление, дуэли.
 */
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Pressable,
  ScrollView,
  Share,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { useFriendsStore } from '../store/friendsStore';
import { useUserStore } from '../store/userStore';
import { useReferralStore } from '../store/referralStore';
import { useLeafEconomyStore } from '../store/leafEconomyStore';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

export function FriendsScreen() {
  useLang();
  const nav = useNavigation<any>();
  const friends = useFriendsStore((s) => s.friends);
  const invite = useFriendsStore((s) => s.invite);
  const remove = useFriendsStore((s) => s.remove);

  const myHandle = useUserStore((s) => s.handle);
  const myName = useUserStore((s) => s.name);
  const myId = useUserStore((s) => s.id);
  const setHandle = useUserStore((s) => s.setHandle);

  const [target, setTarget] = useState('');
  const [search, setSearch] = useState('');
  const [editingHandle, setEditingHandle] = useState(false);
  const [handleDraft, setHandleDraft] = useState(myHandle ?? '');

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase().replace(/^@/, '');
    if (!term) return friends;
    return friends.filter(
      (f) =>
        f.handle.includes(term) ||
        f.name.toLowerCase().includes(term) ||
        f.id.includes(term),
    );
  }, [friends, search]);

  const myCard = myHandle ?? t('fr.noHandle');

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('friends.title')} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 60 }}>
        {/* Мой профиль */}
        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Card variant="secondary" style={{ padding: 14 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: 22,
                  backgroundColor: 'rgba(157,107,255,0.22)',
                  borderWidth: 1,
                  borderColor: colors.borderNeon,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: colors.purpleLight,
                    fontFamily: fontFamilies.body700,
                    fontSize: 16,
                  }}
                >
                  {(myName || myCard)[0]?.toUpperCase() ?? '?'}
                </Text>
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text
                  style={{
                    color: colors.text,
                    fontFamily: fontFamilies.body700,
                    fontSize: 14,
                  }}
                >
                  {myName || t('friends.you')}
                </Text>
                <Text
                  style={{
                    color: colors.purpleLight,
                    fontFamily: fontFamilies.body600,
                    fontSize: 12,
                    marginTop: 2,
                  }}
                >
                  @{myCard}
                </Text>
                {myId ? (
                  <Text
                    selectable
                    style={{
                      color: colors.textMuted,
                      fontFamily: fontFamilies.body,
                      fontSize: 10,
                      marginTop: 2,
                    }}
                  >
                    id: {myId.slice(0, 20)}…
                  </Text>
                ) : null}
              </View>
              <Pressable
                onPress={() =>
                  Share.share({ message: t('fr.shareMsg', { handle: myCard }) })
                }
                hitSlop={10}
                style={{
                  paddingHorizontal: 10,
                  paddingVertical: 8,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: colors.borderNeon,
                  backgroundColor: 'rgba(157,107,255,0.18)',
                }}
              >
                <Ionicons
                  name="share-social"
                  size={16}
                  color={colors.purpleLight}
                />
              </Pressable>
            </View>

            {/* Редактирование @handle */}
            {editingHandle ? (
              <View style={{ marginTop: 12, flexDirection: 'row', gap: 8 }}>
                <View
                  style={{
                    flex: 1,
                    flexDirection: 'row',
                    alignItems: 'center',
                    height: 42,
                    borderRadius: radii.md,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.bgSecondary,
                    paddingHorizontal: 12,
                  }}
                >
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontFamily: fontFamilies.body700,
                      fontSize: 14,
                      marginRight: 4,
                    }}
                  >
                    @
                  </Text>
                  <TextInput
                    value={handleDraft}
                    onChangeText={(v) =>
                      setHandleDraft(
                        v
                          .replace(/^@/, '')
                          .replace(/\s+/g, '_')
                          .replace(/[^a-zA-Z0-9_Ѐ-ӿ]/g, '')
                          .toLowerCase()
                          .slice(0, 20),
                      )
                    }
                    placeholder="ironbro"
                    placeholderTextColor={colors.textMuted}
                    autoFocus
                    autoCorrect={false}
                    autoCapitalize="none"
                    style={
                      {
                        flex: 1,
                        color: colors.text,
                        fontFamily: fontFamilies.body600,
                        fontSize: 14,
                        outlineWidth: 0,
                      } as any
                    }
                  />
                </View>
                <Pressable
                  onPress={() => {
                    if (handleDraft.length < 3) {
                      Alert.alert(
                        t('friends.handleShortTitle'),
                        t('friends.handleShort'),
                      );
                      return;
                    }
                    setHandle(handleDraft);
                    setEditingHandle(false);
                  }}
                  style={{
                    paddingHorizontal: 16,
                    borderRadius: radii.md,
                    borderWidth: 1,
                    borderColor: colors.green,
                    backgroundColor: 'rgba(63,255,150,0.18)',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: colors.green,
                      fontFamily: fontFamilies.body700,
                      fontSize: 12,
                    }}
                  >
                    {t('common.save')}
                  </Text>
                </Pressable>
              </View>
            ) : (
              <Pressable
                onPress={() => {
                  setHandleDraft(myHandle ?? '');
                  setEditingHandle(true);
                }}
                style={{
                  marginTop: 10,
                  paddingVertical: 8,
                  borderRadius: 10,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: 'rgba(255,255,255,0.03)',
                  alignItems: 'center',
                  flexDirection: 'row',
                  justifyContent: 'center',
                  gap: 6,
                }}
              >
                <Ionicons
                  name="create-outline"
                  size={14}
                  color={colors.textSecondary}
                />
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontFamily: fontFamilies.body700,
                    fontSize: 12,
                  }}
                >
                  {myHandle
                    ? t('friends.changeHandle')
                    : t('friends.setHandle')}
                </Text>
              </Pressable>
            )}
          </Card>
        </View>

        {/* Пригласить */}
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card variant="secondary">
            <Text
              style={{
                color: colors.text,
                fontFamily: fontFamilies.body700,
                fontSize: 14,
              }}
            >
              {t('friends.inviteTitle')}
            </Text>
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: fontFamilies.body,
                fontSize: 11,
                marginTop: 4,
              }}
            >
              {t('friends.inviteHint')}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 10 }}>
              <TextInput
                value={target}
                onChangeText={setTarget}
                placeholder="@nickname"
                placeholderTextColor={colors.textMuted}
                autoCapitalize="none"
                style={{
                  flex: 1,
                  color: colors.text,
                  fontFamily: fontFamilies.body600,
                  fontSize: 14,
                  height: 42,
                  borderRadius: radii.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.bgSecondary,
                  paddingHorizontal: 12,
                }}
              />
              <Pressable
                onPress={() => {
                  const created = invite(target);
                  if (!created) {
                    Alert.alert(t('common.error'), t('friends.inviteEmpty'));
                    return;
                  }
                  setTarget('');
                }}
                style={{
                  paddingHorizontal: 14,
                  borderRadius: radii.md,
                  borderWidth: 1,
                  borderColor: colors.borderNeon,
                  backgroundColor: 'rgba(157,107,255,0.18)',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: colors.purpleLight,
                    fontFamily: fontFamilies.body700,
                    fontSize: 12,
                  }}
                >
                  {t('friends.invite')}
                </Text>
              </Pressable>
            </View>
          </Card>
        </View>

        {/* Список + поиск */}
        <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
          <Card variant="secondary">
            <View
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                marginBottom: 10,
              }}
            >
              <Text
                style={{
                  flex: 1,
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body600,
                  fontSize: 12,
                  letterSpacing: 1,
                }}
              >
                {t('friends.listHeader', { n: friends.length })}
              </Text>
            </View>
            {friends.length > 0 ? (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  height: 42,
                  borderRadius: radii.md,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  paddingHorizontal: 12,
                  marginBottom: 10,
                  gap: 8,
                }}
              >
                <Ionicons name="search" size={14} color={colors.textMuted} />
                <TextInput
                  value={search}
                  onChangeText={setSearch}
                  placeholder={t('friends.searchPh')}
                  placeholderTextColor={colors.textMuted}
                  autoCapitalize="none"
                  style={{
                    flex: 1,
                    color: colors.text,
                    fontFamily: fontFamilies.body,
                    fontSize: 13,
                  }}
                />
              </View>
            ) : null}

            {filtered.length === 0 ? (
              <Text
                style={{
                  color: colors.textMuted,
                  fontFamily: fontFamilies.body,
                  fontSize: 12,
                  textAlign: 'center',
                  paddingVertical: 16,
                }}
              >
                {friends.length === 0
                  ? t('friends.empty')
                  : t('friends.noMatch')}
              </Text>
            ) : (
              filtered.map((f) => (
                <View
                  key={f.id}
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    paddingVertical: 10,
                    borderTopWidth: 1,
                    borderTopColor: colors.border,
                  }}
                >
                  <View
                    style={{
                      width: 36,
                      height: 36,
                      borderRadius: 18,
                      backgroundColor: 'rgba(157,107,255,0.22)',
                      borderWidth: 1,
                      borderColor: colors.borderNeon,
                      alignItems: 'center',
                      justifyContent: 'center',
                    }}
                  >
                    <Text
                      style={{
                        color: colors.purpleLight,
                        fontFamily: fontFamilies.body700,
                        fontSize: 14,
                      }}
                    >
                      {f.name[0]?.toUpperCase() ?? '?'}
                    </Text>
                  </View>
                  <View style={{ flex: 1, marginLeft: 10 }}>
                    <Text
                      style={{
                        color: colors.text,
                        fontFamily: fontFamilies.body700,
                        fontSize: 13,
                      }}
                    >
                      {f.name}
                    </Text>
                    <Text
                      style={{
                        color: colors.purpleLight,
                        fontFamily: fontFamilies.body,
                        fontSize: 11,
                        marginTop: 2,
                      }}
                    >
                      @{f.handle}
                    </Text>
                  </View>
                  {f.status === 'pending' ? (
                    <Text
                      style={{
                        color: colors.amber,
                        fontFamily: fontFamilies.body700,
                        fontSize: 10,
                        marginRight: 8,
                      }}
                    >
                      {t('friends.pending')}
                    </Text>
                  ) : (
                    <Pressable
                      onPress={() =>
                        nav.navigate('Duels', {
                          friendId: f.id,
                          friendName: f.name,
                          theirVol: 0,
                        })
                      }
                      hitSlop={6}
                      style={{
                        paddingHorizontal: 10,
                        paddingVertical: 6,
                        borderRadius: 10,
                        borderWidth: 1,
                        borderColor: colors.pink,
                        backgroundColor: 'rgba(255,77,210,0.16)',
                        marginRight: 8,
                      }}
                    >
                      <Text
                        style={{
                          color: colors.pink,
                          fontFamily: fontFamilies.body700,
                          fontSize: 11,
                        }}
                      >
                        {t('friends.duel')}
                      </Text>
                    </Pressable>
                  )}
                  <Pressable onPress={() => remove(f.id)} hitSlop={10}>
                    <Ionicons
                      name="close-circle-outline"
                      size={20}
                      color={colors.textMuted}
                    />
                  </Pressable>
                </View>
              ))
            )}
          </Card>
        </View>

        {/* Реферальный блок */}
        <ReferralCard />

        <View style={{ paddingHorizontal: 16, marginTop: 10 }}>
          <Card variant="secondary">
            <Text
              style={{
                color: colors.textMuted,
                fontFamily: fontFamilies.body,
                fontSize: 11,
                lineHeight: 16,
              }}
            >
              {t('friends.note')}
            </Text>
          </Card>
        </View>
      </ScrollView>
    </View>
  );
}

function ReferralCard() {
  const myCode = useReferralStore((s) => s.myCode);
  const applied = useReferralStore((s) => s.appliedCode);
  const applyCode = useReferralStore((s) => s.applyCode);
  const earn = useLeafEconomyStore((s) => s.earn);
  const [input, setInput] = useState('');

  return (
    <View style={{ paddingHorizontal: 16, marginTop: 12 }}>
      <Card
        variant="secondary"
        style={{
          borderColor: colors.amber,
          borderWidth: 1,
          backgroundColor: 'rgba(255,181,71,0.08)',
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
          <Ionicons name="gift" size={18} color={colors.amber} />
          <Text
            style={{
              flex: 1,
              color: colors.amber,
              fontFamily: fontFamilies.body700,
              fontSize: 13,
            }}
          >
            {t('ref.title')}
          </Text>
        </View>
        <Text
          style={{
            color: colors.textSecondary,
            fontFamily: fontFamilies.body,
            fontSize: 12,
            marginBottom: 10,
          }}
        >
          {t('ref.body')}
        </Text>

        <Text
          style={{
            color: colors.textMuted,
            fontFamily: fontFamilies.body500,
            fontSize: 10,
            letterSpacing: 1,
          }}
        >
          {t('ref.myCode')}
        </Text>
        <View
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            gap: 8,
            marginTop: 6,
          }}
        >
          <View
            style={{
              flex: 1,
              paddingHorizontal: 14,
              paddingVertical: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.amber,
              backgroundColor: 'rgba(255,181,71,0.16)',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: colors.amber,
                fontFamily: fontFamilies.heading,
                fontSize: 18,
                letterSpacing: 3,
              }}
            >
              {myCode}
            </Text>
          </View>
          <Pressable
            onPress={() =>
              Share.share({ message: t('fr.shareCodeMsg', { code: myCode }) })
            }
            style={{
              paddingHorizontal: 12,
              paddingVertical: 10,
              borderRadius: 12,
              borderWidth: 1,
              borderColor: colors.borderNeon,
              backgroundColor: 'rgba(157,107,255,0.18)',
            }}
          >
            <Ionicons
              name="share-social"
              size={16}
              color={colors.purpleLight}
            />
          </Pressable>
        </View>

        {!applied ? (
          <>
            <Text
              style={{
                marginTop: 12,
                color: colors.textMuted,
                fontFamily: fontFamilies.body500,
                fontSize: 10,
                letterSpacing: 1,
              }}
            >
              {t('ref.enter')}
            </Text>
            <View style={{ flexDirection: 'row', gap: 8, marginTop: 6 }}>
              <TextInput
                value={input}
                onChangeText={(v) => setInput(v.toUpperCase().slice(0, 9))}
                placeholder={t('ref.enterPh')}
                placeholderTextColor={colors.textMuted}
                autoCapitalize="characters"
                style={
                  {
                    flex: 1,
                    height: 42,
                    borderRadius: radii.md,
                    borderWidth: 1,
                    borderColor: colors.border,
                    backgroundColor: colors.bgSecondary,
                    paddingHorizontal: 12,
                    color: colors.text,
                    fontFamily: fontFamilies.body700,
                    fontSize: 14,
                    letterSpacing: 2,
                    outlineWidth: 0,
                  } as any
                }
              />
              <Pressable
                onPress={() => {
                  const res = applyCode(input);
                  if (!res.ok) {
                    Alert.alert(
                      t('common.error'),
                      res.reason === 'already_used'
                        ? t('ref.alreadyUsed')
                        : t('ref.invalid'),
                    );
                    return;
                  }
                  earn(200, 'referral');
                  Alert.alert('✓', t('ref.applied'));
                  setInput('');
                }}
                style={{
                  paddingHorizontal: 16,
                  borderRadius: radii.md,
                  borderWidth: 1,
                  borderColor: colors.green,
                  backgroundColor: 'rgba(63,255,150,0.18)',
                  justifyContent: 'center',
                }}
              >
                <Text
                  style={{
                    color: colors.green,
                    fontFamily: fontFamilies.body700,
                    fontSize: 12,
                  }}
                >
                  {t('ref.applyBtn')}
                </Text>
              </Pressable>
            </View>
          </>
        ) : (
          <Text
            style={{
              marginTop: 10,
              color: colors.green,
              fontFamily: fontFamilies.body700,
              fontSize: 12,
            }}
          >
            ✓ {applied}
          </Text>
        )}
      </Card>
    </View>
  );
}
