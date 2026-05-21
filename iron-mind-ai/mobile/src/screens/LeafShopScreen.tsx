import React, { useEffect, useState } from 'react';
import { Alert, Modal, Pressable, ScrollView, Text, View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import Svg, {
  Defs,
  LinearGradient as SvgGrad,
  Stop,
  Path,
  Circle,
  Rect,
  G,
} from 'react-native-svg';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import {
  StreakDumbbell,
  AURAS,
  auraName,
} from '../components/common/StreakDumbbell';
import { AuraBadge, ShopItemVisual } from '../components/common/ShopVisual';
import {
  SHOP_ITEMS,
  LEAF_PACKS,
  useLeafEconomyStore,
  type ShopItem,
} from '../store/leafEconomyStore';
import { useAppStreakStore } from '../store/appStreakStore';
import {
  useCurrencyStore,
  CURRENCY_INFO,
  fmtPrice,
  type Currency,
} from '../store/currencyStore';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { t, useLang } from '../i18n';

export function LeafShopScreen() {
  useLang();
  const nav = useNavigation<any>();
  const leaves = useLeafEconomyStore((s) => s.leaves);
  const owned = useLeafEconomyStore((s) => s.owned);
  const equipped = useLeafEconomyStore((s) => s.equipped);
  const buy = useLeafEconomyStore((s) => s.buy);
  const equip = useLeafEconomyStore((s) => s.equip);
  const unequip = useLeafEconomyStore((s) => s.unequip);
  const buyPack = useLeafEconomyStore((s) => s.buyPack);
  const refresh = useLeafEconomyStore((s) => s.refresh);
  useEffect(() => {
    refresh();
  }, [refresh]);
  const streakDays = useAppStreakStore((s) => s.streakDays);
  const currency = useCurrencyStore((s) => s.currency);
  const setCurrency = useCurrencyStore((s) => s.setCurrency);

  const [previewItem, setPreviewItem] = useState<ShopItem | null>(null);
  const [packsOpen, setPacksOpen] = useState(false);
  const [currencyOpen, setCurrencyOpen] = useState(false);
  const [aurasOpen, setAurasOpen] = useState(false);

  const grouped: Record<ShopItem['category'], ShopItem[]> = {
    tree: SHOP_ITEMS.filter((i) => i.category === 'tree'),
    dumbbell: SHOP_ITEMS.filter((i) => i.category === 'dumbbell'),
    accent: SHOP_ITEMS.filter((i) => i.category === 'accent'),
  };

  const currentAura =
    AURAS.slice()
      .reverse()
      .find((a) => streakDays >= a.days) ?? AURAS[0];
  const nextAura = AURAS.find((a) => a.days > streakDays);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('shop.title')} onBack={() => nav.goBack()} />
      <ScrollView contentContainerStyle={{ paddingBottom: 80 }}>
        {/* Balance + Buy more + Currency */}
        <View style={{ paddingHorizontal: 16, marginTop: 8 }}>
          <Card
            variant="secondary"
            style={{
              padding: 14,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 10,
            }}
          >
            <Ionicons name="leaf" size={22} color={colors.green} />
            <Text
              style={{
                flex: 1,
                color: colors.text,
                fontFamily: fontFamilies.body700,
                fontSize: 18,
              }}
            >
              {leaves.toLocaleString()}
            </Text>
            <Pressable
              onPress={() => setCurrencyOpen(true)}
              style={{
                paddingHorizontal: 10,
                paddingVertical: 8,
                borderRadius: 10,
                borderWidth: 1,
                borderColor: colors.border,
              }}
            >
              <Text
                style={{
                  color: colors.textSecondary,
                  fontFamily: fontFamilies.body700,
                  fontSize: 11,
                }}
              >
                {CURRENCY_INFO[currency].flag} {currency}
              </Text>
            </Pressable>
            <Pressable
              onPress={() => setPacksOpen(true)}
              style={{
                paddingHorizontal: 12,
                paddingVertical: 8,
                borderRadius: 12,
                borderWidth: 1,
                borderColor: colors.amber,
                backgroundColor: 'rgba(255,181,71,0.18)',
              }}
            >
              <Text
                style={{
                  color: colors.amber,
                  fontFamily: fontFamilies.body700,
                  fontSize: 12,
                }}
              >
                <Ionicons name="diamond" size={12} color={colors.amber} />{' '}
                {t('shop.buyMore')}
              </Text>
            </Pressable>
          </Card>
        </View>

        {/* Current aura — featured card */}
        <View style={{ paddingHorizontal: 16, marginTop: 14 }}>
          <Pressable onPress={() => setAurasOpen(true)}>
            <Card
              variant="secondary"
              style={{
                padding: 16,
                borderColor: currentAura.primary + '88',
                borderWidth: 1,
                backgroundColor: currentAura.glow,
              }}
            >
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <AuraBadge aura={currentAura} size={88} />
                <View style={{ flex: 1, marginLeft: 14 }}>
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontFamily: fontFamilies.body500,
                      fontSize: 10,
                      letterSpacing: 1,
                    }}
                  >
                    {t('shop.currentAura')}
                  </Text>
                  <Text
                    style={{
                      marginTop: 2,
                      color: currentAura.primary,
                      fontFamily: fontFamilies.body700,
                      fontSize: 18,
                      textShadowColor: currentAura.glow,
                      textShadowRadius: 10,
                    }}
                  >
                    {auraName(currentAura)}
                  </Text>
                  <Text
                    style={{
                      marginTop: 4,
                      color: colors.text,
                      fontFamily: fontFamilies.body,
                      fontSize: 12,
                    }}
                  >
                    {streakDays} {t('common.days')} {t('common.streak')}
                  </Text>
                  {nextAura ? (
                    <Text
                      style={{
                        marginTop: 4,
                        color: colors.textSecondary,
                        fontFamily: fontFamilies.body,
                        fontSize: 11,
                      }}
                    >
                      {t('shop.toNext', {
                        days: nextAura.days - streakDays,
                        name: auraName(nextAura),
                      })}
                    </Text>
                  ) : (
                    <Text
                      style={{
                        marginTop: 4,
                        color: colors.amber,
                        fontFamily: fontFamilies.body700,
                        fontSize: 11,
                      }}
                    >
                      {t('shop.maxAura')}
                    </Text>
                  )}
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={20}
                  color={colors.textMuted}
                />
              </View>
            </Card>
          </Pressable>
        </View>

        {(['tree', 'dumbbell', 'accent'] as const).map((cat) => (
          <View key={cat} style={{ paddingHorizontal: 16, marginTop: 14 }}>
            <Text
              style={{
                color: colors.textSecondary,
                fontFamily: fontFamilies.body600,
                fontSize: 12,
                letterSpacing: 1,
                marginBottom: 6,
              }}
            >
              {cat === 'tree'
                ? t('shop.cat.tree')
                : cat === 'dumbbell'
                  ? t('shop.cat.dumbbell')
                  : t('shop.cat.accent')}
            </Text>
            <View style={{ gap: 8 }}>
              {grouped[cat].map((item) => {
                const isOwned = owned.includes(item.id);
                const isEquipped = equipped[item.category] === item.id;
                return (
                  <Pressable
                    key={item.id}
                    onPress={() => setPreviewItem(item)}
                    style={{
                      padding: 12,
                      borderRadius: 14,
                      borderWidth: 1,
                      borderColor: isEquipped
                        ? colors.green
                        : isOwned
                          ? colors.borderNeon
                          : colors.border,
                      backgroundColor: colors.bgSecondary,
                      flexDirection: 'row',
                      alignItems: 'center',
                    }}
                  >
                    <View
                      style={{
                        width: 64,
                        height: 64,
                        borderRadius: 14,
                        backgroundColor: 'rgba(13,16,32,0.55)',
                        borderWidth: 1,
                        borderColor: colors.border,
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: 12,
                      }}
                    >
                      <ShopItemVisual
                        category={item.category}
                        id={item.id}
                        size={48}
                      />
                    </View>
                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: colors.text,
                          fontFamily: fontFamilies.body700,
                          fontSize: 13,
                        }}
                      >
                        {item.title}
                      </Text>
                      <Text
                        style={{
                          color: colors.textMuted,
                          fontFamily: fontFamilies.body,
                          fontSize: 11,
                          marginTop: 2,
                        }}
                      >
                        {item.description}
                      </Text>
                    </View>
                    {!isOwned ? (
                      <Text
                        style={{
                          color: colors.green,
                          fontFamily: fontFamilies.body700,
                          fontSize: 12,
                        }}
                      >
                        <Ionicons name="leaf" size={12} color={colors.green} />{' '}
                        {item.price}
                      </Text>
                    ) : isEquipped ? (
                      <Text
                        style={{
                          color: colors.green,
                          fontFamily: fontFamilies.body700,
                          fontSize: 11,
                        }}
                      >
                        {t('shop.equipped')}
                      </Text>
                    ) : (
                      <Text
                        style={{
                          color: colors.purpleLight,
                          fontFamily: fontFamilies.body700,
                          fontSize: 11,
                        }}
                      >
                        {t('shop.preview')}
                      </Text>
                    )}
                  </Pressable>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      <ItemPreviewModal
        item={previewItem}
        owned={previewItem ? owned.includes(previewItem.id) : false}
        equipped={
          previewItem
            ? equipped[previewItem.category] === previewItem.id
            : false
        }
        leaves={leaves}
        onClose={() => setPreviewItem(null)}
        onBuy={() => {
          if (!previewItem) return;
          const res = buy(previewItem.id);
          if (!res.ok) Alert.alert(t('shop.failTitle'), res.reason ?? '');
          else setPreviewItem(null);
        }}
        onEquip={() => {
          if (!previewItem) return;
          equip(previewItem.id);
          setPreviewItem(null);
        }}
        onUnequip={() => {
          if (!previewItem) return;
          unequip(previewItem.category);
        }}
      />

      <PacksModal
        visible={packsOpen}
        currency={currency}
        onClose={() => setPacksOpen(false)}
        onBuy={(packId) => {
          const res = buyPack(packId);
          if (res.ok) {
            Alert.alert(
              t('shop.bought'),
              t('shop.boughtBody', { n: res.granted }),
            );
            setPacksOpen(false);
          }
        }}
      />

      <CurrencyModal
        visible={currencyOpen}
        current={currency}
        onClose={() => setCurrencyOpen(false)}
        onPick={(c) => {
          setCurrency(c);
          setCurrencyOpen(false);
        }}
      />

      <AurasGalleryModal
        visible={aurasOpen}
        streakDays={streakDays}
        onClose={() => setAurasOpen(false)}
      />
    </View>
  );
}

function ItemPreviewModal({
  item,
  owned,
  equipped,
  leaves,
  onClose,
  onBuy,
  onEquip,
  onUnequip,
}: {
  item: ShopItem | null;
  owned: boolean;
  equipped: boolean;
  leaves: number;
  onClose: () => void;
  onBuy: () => void;
  onEquip: () => void;
  onUnequip: () => void;
}) {
  if (!item) return null;
  const canAfford = leaves >= item.price;
  return (
    <Modal
      visible={!!item}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.85)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: colors.bg,
            borderTopLeftRadius: radii.xl,
            borderTopRightRadius: radii.xl,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 20,
            paddingBottom: 28,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <Text
              style={{
                flex: 1,
                color: colors.text,
                fontFamily: fontFamilies.heading,
                fontSize: 20,
              }}
            >
              {t('shop.preview')}
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          {/* Большой превью */}
          <View
            style={{
              minHeight: 220,
              borderRadius: radii.lg,
              borderWidth: 1,
              borderColor: colors.borderNeon,
              backgroundColor: 'rgba(13,16,32,0.65)',
              alignItems: 'center',
              justifyContent: 'center',
              padding: 24,
            }}
          >
            <ShopItemVisual category={item.category} id={item.id} size={140} />
          </View>

          <View style={{ marginTop: 14 }}>
            <Text
              style={{
                color: colors.text,
                fontFamily: fontFamilies.body700,
                fontSize: 16,
              }}
            >
              {item.title}
            </Text>
            <Text
              style={{
                marginTop: 4,
                color: colors.textSecondary,
                fontFamily: fontFamilies.body,
                fontSize: 13,
                lineHeight: 19,
              }}
            >
              {item.description}
            </Text>
          </View>

          <View style={{ marginTop: 16 }}>
            {!owned ? (
              <GradientButton
                title={`${t('shop.buyFor')} ${item.price}`}
                onPress={onBuy}
                disabled={!canAfford}
                rightIcon={
                  <Ionicons
                    name={canAfford ? 'cart' : 'lock-closed'}
                    size={18}
                    color="#fff"
                  />
                }
              />
            ) : equipped ? (
              <Pressable
                onPress={onUnequip}
                style={{
                  paddingVertical: 14,
                  borderRadius: 14,
                  borderWidth: 1,
                  borderColor: colors.border,
                  backgroundColor: colors.bgSecondary,
                  alignItems: 'center',
                }}
              >
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontFamily: fontFamilies.body700,
                    fontSize: 13,
                  }}
                >
                  {t('shop.unequip')}
                </Text>
              </Pressable>
            ) : (
              <GradientButton
                title={t('shop.equip')}
                onPress={onEquip}
                rightIcon={<Ionicons name="checkmark" size={18} color="#fff" />}
              />
            )}
            {!owned && !canAfford ? (
              <Text
                style={{
                  marginTop: 8,
                  color: colors.pink,
                  fontFamily: fontFamilies.body500,
                  fontSize: 11,
                  textAlign: 'center',
                }}
              >
                {t('shop.cantAfford')} ·{' '}
                {t('shop.need', { n: item.price - leaves })}
              </Text>
            ) : null}
          </View>
        </View>
      </View>
    </Modal>
  );
}

/** Иконка-пакет: листики уровня tier. */
function PackVisual({
  tier,
  size = 56,
}: {
  tier: 'starter' | 'small' | 'medium' | 'large' | 'mega';
  size?: number;
}) {
  const colorMap = {
    starter: { primary: '#3FFF8F', secondary: '#1FC76C' },
    small: { primary: '#00E5FF', secondary: '#0099CC' },
    medium: { primary: '#9D6BFF', secondary: '#7B3FE4' },
    large: { primary: '#FFD27A', secondary: '#FFB547' },
    mega: { primary: '#FF4DD2', secondary: '#9D6BFF' },
  } as const;
  const c = colorMap[tier];
  const leafCount = { starter: 1, small: 2, medium: 3, large: 5, mega: 8 }[
    tier
  ];

  return (
    <Svg width={size} height={size} viewBox="0 0 100 100">
      <Defs>
        <SvgGrad id={`p-${tier}`} x1="0" y1="0" x2="1" y2="1">
          <Stop offset="0" stopColor={c.primary} />
          <Stop offset="1" stopColor={c.secondary} />
        </SvgGrad>
      </Defs>
      <Circle cx="50" cy="50" r="44" fill={`url(#p-${tier})`} opacity="0.25" />
      {Array.from({ length: leafCount }).map((_, i) => {
        const angle = (i / leafCount) * Math.PI * 2 - Math.PI / 2;
        const r = leafCount === 1 ? 0 : 22;
        const cx = 50 + Math.cos(angle) * r;
        const cy = 50 + Math.sin(angle) * r;
        return (
          <G key={i} transform={`translate(${cx - 12} ${cy - 12})`}>
            <Path
              d="M12 0 C 6 4 0 12 0 16 C 0 20 4 24 12 24 C 20 24 24 20 24 16 C 24 12 18 4 12 0 Z"
              fill={`url(#p-${tier})`}
            />
            <Path
              d="M12 4 L12 22"
              stroke={c.secondary}
              strokeWidth="1"
              opacity="0.5"
            />
          </G>
        );
      })}
    </Svg>
  );
}

function PacksModal({
  visible,
  currency,
  onClose,
  onBuy,
}: {
  visible: boolean;
  currency: Currency;
  onClose: () => void;
  onBuy: (packId: string) => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.85)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: colors.bg,
            borderTopLeftRadius: radii.xl,
            borderTopRightRadius: radii.xl,
            borderWidth: 1,
            borderColor: colors.amber,
            padding: 20,
            paddingBottom: 28,
            maxHeight: '92%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Ionicons
              name="diamond"
              size={20}
              color={colors.amber}
              style={{ marginRight: 8 }}
            />
            <Text
              style={{
                flex: 1,
                color: colors.amber,
                fontFamily: fontFamilies.heading,
                fontSize: 20,
              }}
            >
              {t('shop.packsTitle')}
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <Text
            style={{
              color: colors.textMuted,
              fontFamily: fontFamilies.body,
              fontSize: 12,
              marginBottom: 14,
            }}
          >
            {t('shop.packsHint')}
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 460 }}
          >
            {LEAF_PACKS.map((pack) => {
              const discount = pack.priceWasUsd
                ? Math.round(
                    ((pack.priceWasUsd - pack.priceUsd) / pack.priceWasUsd) *
                      100,
                  )
                : 0;
              const badgeColor =
                pack.badge === 'best_value'
                  ? colors.green
                  : pack.badge === 'popular'
                    ? colors.purpleLight
                    : pack.badge === 'limited'
                      ? colors.pink
                      : null;
              const badgeText =
                pack.badge === 'best_value'
                  ? t('shop.bestValue')
                  : pack.badge === 'popular'
                    ? t('shop.popular')
                    : pack.badge === 'limited'
                      ? t('shop.limited')
                      : null;
              return (
                <Pressable
                  key={pack.id}
                  onPress={() => onBuy(pack.id)}
                  style={{
                    padding: 14,
                    marginBottom: 8,
                    borderRadius: 14,
                    borderWidth: pack.badge ? 1.5 : 1,
                    borderColor:
                      badgeColor ??
                      (pack.bonus > 0 ? colors.amber : colors.border),
                    backgroundColor: pack.badge
                      ? badgeColor + '14'
                      : pack.bonus > 0
                        ? 'rgba(255,181,71,0.10)'
                        : colors.bgSecondary,
                  }}
                >
                  {badgeText ? (
                    <View
                      style={{
                        position: 'absolute',
                        top: -8,
                        right: 12,
                        paddingHorizontal: 8,
                        paddingVertical: 3,
                        borderRadius: 8,
                        backgroundColor: badgeColor!,
                      }}
                    >
                      <Text
                        style={{
                          color: '#0A0A14',
                          fontFamily: fontFamilies.body700,
                          fontSize: 9,
                          letterSpacing: 1,
                        }}
                      >
                        {badgeText}
                      </Text>
                    </View>
                  ) : null}
                  <View
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      gap: 12,
                    }}
                  >
                    <PackVisual tier={pack.tier} size={56} />
                    <View style={{ flex: 1 }}>
                      <View
                        style={{
                          flexDirection: 'row',
                          alignItems: 'baseline',
                          gap: 6,
                          flexWrap: 'wrap',
                        }}
                      >
                        <Text
                          style={{
                            color: colors.text,
                            fontFamily: fontFamilies.body700,
                            fontSize: 16,
                          }}
                        >
                          <Ionicons
                            name="leaf"
                            size={14}
                            color={colors.green}
                          />{' '}
                          {pack.leaves.toLocaleString()}
                        </Text>
                        {pack.bonus > 0 ? (
                          <Text
                            style={{
                              color: colors.amber,
                              fontFamily: fontFamilies.body700,
                              fontSize: 12,
                            }}
                          >
                            +{pack.bonus}
                          </Text>
                        ) : null}
                      </View>
                    </View>
                    <View style={{ alignItems: 'flex-end' }}>
                      {pack.priceWasUsd ? (
                        <Text
                          style={{
                            color: colors.textMuted,
                            fontFamily: fontFamilies.body,
                            fontSize: 11,
                            textDecorationLine: 'line-through',
                            marginBottom: 2,
                          }}
                        >
                          {fmtPrice(pack.priceWasUsd, currency)}
                        </Text>
                      ) : null}
                      <View
                        style={{
                          paddingHorizontal: 14,
                          paddingVertical: 8,
                          borderRadius: 12,
                          borderWidth: 1,
                          borderColor: colors.green,
                          backgroundColor: 'rgba(63,255,150,0.18)',
                        }}
                      >
                        <Text
                          style={{
                            color: colors.green,
                            fontFamily: fontFamilies.body700,
                            fontSize: 14,
                          }}
                        >
                          {fmtPrice(pack.priceUsd, currency)}
                        </Text>
                      </View>
                      {discount > 0 ? (
                        <Text
                          style={{
                            marginTop: 4,
                            color: colors.pink,
                            fontFamily: fontFamilies.body700,
                            fontSize: 10,
                          }}
                        >
                          −{discount}%
                        </Text>
                      ) : null}
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </ScrollView>

          <Text
            style={{
              marginTop: 10,
              color: colors.textMuted,
              fontFamily: fontFamilies.body,
              fontSize: 10,
              textAlign: 'center',
            }}
          >
            {t('shop.devNote')}
          </Text>
        </View>
      </View>
    </Modal>
  );
}

function CurrencyModal({
  visible,
  current,
  onClose,
  onPick,
}: {
  visible: boolean;
  current: Currency;
  onClose: () => void;
  onPick: (c: Currency) => void;
}) {
  const currencies: Currency[] = ['USD', 'EUR', 'RUB', 'BYN'];
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.85)',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 24,
        }}
      >
        <View
          style={{
            backgroundColor: colors.bg,
            borderRadius: radii.lg,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 18,
            width: '100%',
            maxWidth: 360,
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 12,
            }}
          >
            <Text
              style={{
                flex: 1,
                color: colors.text,
                fontFamily: fontFamilies.body700,
                fontSize: 16,
              }}
            >
              {t('shop.currency')}
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={20} color={colors.textSecondary} />
            </Pressable>
          </View>
          {currencies.map((c) => {
            const info = CURRENCY_INFO[c];
            const active = c === current;
            return (
              <Pressable
                key={c}
                onPress={() => onPick(c)}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  padding: 12,
                  borderRadius: 12,
                  borderWidth: 1,
                  borderColor: active ? colors.borderNeon : colors.border,
                  backgroundColor: active
                    ? 'rgba(157,107,255,0.14)'
                    : 'transparent',
                  marginBottom: 6,
                  gap: 10,
                }}
              >
                <Text style={{ fontSize: 22 }}>{info.flag}</Text>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: fontFamilies.body700,
                      fontSize: 14,
                    }}
                  >
                    {c} · {info.symbol}
                  </Text>
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontFamily: fontFamilies.body,
                      fontSize: 11,
                    }}
                  >
                    {info.label}
                  </Text>
                </View>
                {active ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={20}
                    color={colors.green}
                  />
                ) : null}
              </Pressable>
            );
          })}
        </View>
      </View>
    </Modal>
  );
}

function AurasGalleryModal({
  visible,
  streakDays,
  onClose,
}: {
  visible: boolean;
  streakDays: number;
  onClose: () => void;
}) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}
    >
      <View
        style={{
          flex: 1,
          backgroundColor: 'rgba(0,0,0,0.92)',
          justifyContent: 'flex-end',
        }}
      >
        <View
          style={{
            backgroundColor: colors.bg,
            borderTopLeftRadius: radii.xl,
            borderTopRightRadius: radii.xl,
            borderWidth: 1,
            borderColor: colors.borderNeon,
            padding: 20,
            paddingBottom: 28,
            maxHeight: '92%',
          }}
        >
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              marginBottom: 14,
            }}
          >
            <Text
              style={{
                flex: 1,
                color: colors.text,
                fontFamily: fontFamilies.heading,
                fontSize: 20,
              }}
            >
              {t('shop.aurasTitle')}
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>
          <Text
            style={{
              color: colors.textMuted,
              fontFamily: fontFamilies.body,
              fontSize: 12,
              marginBottom: 14,
            }}
          >
            {t('shop.aurasHint', { days: streakDays })}
          </Text>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 540 }}
          >
            <View
              style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                rowGap: 18,
              }}
            >
              {AURAS.map((a) => {
                const unlocked = streakDays >= a.days;
                return (
                  <View
                    key={a.id}
                    style={{
                      width: '23%',
                      alignItems: 'center',
                      marginBottom: 6,
                    }}
                  >
                    <AuraBadge aura={a} size={68} locked={!unlocked} />
                    <Text
                      style={{
                        marginTop: 4,
                        color: unlocked ? a.primary : colors.textMuted,
                        fontFamily: fontFamilies.body700,
                        fontSize: 10,
                        textAlign: 'center',
                      }}
                      numberOfLines={1}
                    >
                      {auraName(a)}
                    </Text>
                    <Text
                      style={{
                        color: colors.textMuted,
                        fontFamily: fontFamilies.body,
                        fontSize: 9,
                      }}
                    >
                      {a.days}+ {t('common.days')}
                    </Text>
                  </View>
                );
              })}
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
