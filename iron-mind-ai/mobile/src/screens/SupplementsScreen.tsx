/**
 * Спортивные добавки — каталог + мои добавки + журнал приёмов + раздел «Химия» (harm-reduction).
 */
import React, { useMemo, useState } from 'react';
import {
  Alert,
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import {
  CATEGORIES,
  chemistry,
  supplements,
  topSupplements,
  searchSupplements,
  supplementsByCategory,
  type Supplement,
  type SupplementCategory,
} from '../data/supplements';
import { localizedSupplement } from '../data/supplements_en';
import { useSupplementsStore } from '../store/supplementsStore';
import { t, useLang } from '../i18n';

type Tab = 'my' | 'catalog' | 'top' | 'chem';

function evidenceLabel(ev: 'high' | 'medium' | 'low') {
  if (ev === 'high') return { label: t('supp.evidenceHigh'), color: '#3FFF96' };
  if (ev === 'medium') return { label: t('supp.evidenceMedium'), color: '#FFB547' };
  return { label: t('supp.evidenceLow'), color: '#FF4DD2' };
}

function categoryLabel(c: SupplementCategory) {
  return t(`supp.cat.${c}`);
}

export function SupplementsScreen() {
  const lang = useLang();
  const nav = useNavigation<any>();
  const insets = useSafeAreaInsets();
  const items = useSupplementsStore((s) => s.items);
  const log = useSupplementsStore((s) => s.log);
  const remove = useSupplementsStore((s) => s.remove);
  const toggleActive = useSupplementsStore((s) => s.toggleActive);
  const registerTake = useSupplementsStore((s) => s.registerTake);

  const [tab, setTab] = useState<Tab>(items.length > 0 ? 'my' : 'top');
  const [category, setCategory] = useState<SupplementCategory | 'all'>('all');
  const [q, setQ] = useState('');
  const [selected, setSelected] = useState<Supplement | null>(null);

  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const todayIso = today.toISOString().slice(0, 10);

  const top = useMemo(() => topSupplements(10), []);
  const filteredCatalog = useMemo(() => {
    // Каталог — без химии. Химия в отдельной вкладке.
    const nonChem = supplements.filter((s) => s.category !== 'chemistry');
    const term = q.trim().toLowerCase();
    const byCat = category === 'all' ? nonChem : nonChem.filter((s) => s.category === category);
    if (!term) return byCat;
    return byCat.filter(
      (s) =>
        s.name.toLowerCase().includes(term) ||
        s.whatIs.toLowerCase().includes(term) ||
        s.effect.toLowerCase().includes(term),
    );
  }, [q, category]);

  const filteredChem = useMemo(() => {
    const term = q.trim().toLowerCase();
    if (!term) return chemistry;
    return chemistry.filter(
      (s) => s.name.toLowerCase().includes(term) || s.whatIs.toLowerCase().includes(term),
    );
  }, [q]);

  const takesToday = log.filter((l) => l.date === todayIso);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader title={t('supp.title')} onBack={() => nav.goBack()} />

      <View style={{ paddingHorizontal: 16, marginTop: 8, flexDirection: 'row', gap: 6 }}>
        {(['my', 'top', 'catalog', 'chem'] as Tab[]).map((tk) => {
          const active = tk === tab;
          const label =
            tk === 'my'
              ? t('supp.tabMy', { n: items.length })
              : tk === 'top'
                ? t('supp.tabTop')
                : tk === 'catalog'
                  ? t('supp.tabCatalog')
                  : t('supp.tabChemistry');
          return (
            <Pressable
              key={tk}
              onPress={() => setTab(tk)}
              style={{
                flex: 1,
                paddingVertical: 10,
                alignItems: 'center',
                borderRadius: 12,
                borderWidth: 1,
                borderColor: active ? (tk === 'chem' ? '#FF4D6D' : colors.borderNeon) : colors.border,
                backgroundColor: active
                  ? tk === 'chem' ? 'rgba(255,77,109,0.18)' : 'rgba(157,107,255,0.18)'
                  : colors.bgSecondary,
              }}
            >
              <Text
                style={{
                  color: active ? (tk === 'chem' ? '#FF4D6D' : colors.purpleLight) : colors.textSecondary,
                  fontFamily: fontFamilies.body700,
                  fontSize: 11,
                }}
              >
                {label}
              </Text>
            </Pressable>
          );
        })}
      </View>

      <ScrollView contentContainerStyle={{ paddingBottom: 120 }} showsVerticalScrollIndicator={false}>
        {tab === 'my' && (
          <View style={{ paddingHorizontal: 16, marginTop: 12, gap: 12 }}>
            {items.length === 0 ? (
              <Card variant="secondary">
                <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body, textAlign: 'center' }}>
                  {t('supp.myEmpty')}
                </Text>
              </Card>
            ) : (
              items.map((item) => {
                const todayTake = takesToday.find((tk) => tk.userSupplementId === item.id);
                return (
                  <Card key={item.id} variant="secondary" style={{ padding: 14 }}>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>
                          {item.name}
                        </Text>
                        <Text style={{ marginTop: 2, color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11 }}>
                          {item.dose} · {item.timing}
                        </Text>
                      </View>
                      <Pressable
                        onPress={() => toggleActive(item.id)}
                        hitSlop={10}
                        style={{ paddingHorizontal: 6 }}
                      >
                        <Ionicons
                          name={item.active ? 'eye' : 'eye-off'}
                          size={18}
                          color={item.active ? colors.purpleLight : colors.textMuted}
                        />
                      </Pressable>
                      <Pressable
                        onPress={() =>
                          Alert.alert(item.name, t('supp.removeQ'), [
                            { text: t('common.cancel'), style: 'cancel' },
                            { text: t('common.delete'), style: 'destructive', onPress: () => remove(item.id) },
                          ])
                        }
                        hitSlop={10}
                        style={{ paddingHorizontal: 6 }}
                      >
                        <Ionicons name="trash-outline" size={16} color={colors.pink} />
                      </Pressable>
                    </View>
                    {item.notes ? (
                      <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body, fontSize: 12, marginBottom: 8 }}>
                        {item.notes}
                      </Text>
                    ) : null}
                    <Pressable
                      onPress={() => registerTake(item.id)}
                      style={{
                        marginTop: 4,
                        paddingVertical: 10,
                        alignItems: 'center',
                        borderRadius: 12,
                        borderWidth: 1,
                        borderColor: todayTake ? colors.green : colors.borderNeon,
                        backgroundColor: todayTake ? 'rgba(63,255,150,0.14)' : 'rgba(157,107,255,0.12)',
                        flexDirection: 'row',
                        justifyContent: 'center',
                        gap: 6,
                      }}
                    >
                      <Ionicons
                        name={todayTake ? 'checkmark-circle' : 'add-circle-outline'}
                        size={16}
                        color={todayTake ? colors.green : colors.purpleLight}
                      />
                      <Text style={{ color: todayTake ? colors.green : colors.purpleLight, fontFamily: fontFamilies.body700, fontSize: 12 }}>
                        {todayTake ? t('supp.tookAt', { time: todayTake.time }) : t('supp.markTake')}
                      </Text>
                    </Pressable>
                  </Card>
                );
              })
            )}
          </View>
        )}

        {tab === 'top' && (
          <View style={{ paddingHorizontal: 16, marginTop: 12, gap: 8 }}>
            <Card variant="secondary">
              <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>
                {t('supp.top10Title')}
              </Text>
              <Text style={{ marginTop: 6, color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 12 }}>
                {t('supp.top10Sub')}
              </Text>
            </Card>
            {top.map((s) => {
              const loc = localizedSupplement(s, lang);
              return (
                <SupplementRow key={s.id} supplement={loc} rank={s.topRank} onTap={() => setSelected(s)} />
              );
            })}
          </View>
        )}

        {tab === 'catalog' && (
          <View style={{ paddingHorizontal: 16, marginTop: 12, gap: 8 }}>
            <View
              style={{
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.bgSecondary,
                paddingHorizontal: 14,
              }}
            >
              <TextInput
                value={q}
                onChangeText={setQ}
                placeholder={t('supp.search')}
                placeholderTextColor={colors.textMuted}
                style={{ color: colors.text, fontFamily: fontFamilies.body600, fontSize: 15, height: 46 }}
              />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 6 }}>
              <Pressable
                onPress={() => setCategory('all')}
                style={[chipStyle, category === 'all' && chipActive]}
              >
                <Text style={{ color: category === 'all' ? colors.purpleLight : colors.textSecondary, fontFamily: fontFamilies.body700, fontSize: 11 }}>
                  {t('supp.catAll')}
                </Text>
              </Pressable>
              {CATEGORIES.map((c) => (
                <Pressable
                  key={c.key}
                  onPress={() => setCategory(c.key)}
                  style={[chipStyle, category === c.key && chipActive]}
                >
                  <Text style={{ color: category === c.key ? colors.purpleLight : colors.textSecondary, fontFamily: fontFamilies.body700, fontSize: 11 }}>
                    {c.emoji} {categoryLabel(c.key)}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
            {filteredCatalog.map((s) => (
              <SupplementRow key={s.id} supplement={localizedSupplement(s, lang)} onTap={() => setSelected(s)} />
            ))}
            {filteredCatalog.length === 0 ? (
              <Text style={{ color: colors.textMuted, textAlign: 'center', paddingVertical: 24 }}>—</Text>
            ) : null}
          </View>
        )}

        {tab === 'chem' && (
          <View style={{ paddingHorizontal: 16, marginTop: 12, gap: 10 }}>
            <Card
              variant="secondary"
              style={{
                padding: 14,
                borderColor: '#FF4D6D',
                borderWidth: 1,
                backgroundColor: 'rgba(255,77,109,0.10)',
              }}
            >
              <Text style={{ color: '#FF4D6D', fontFamily: fontFamilies.body700, fontSize: 13 }}>
                {t('supp.chemDisclaimerTitle')}
              </Text>
              <Text
                style={{
                  marginTop: 8,
                  color: colors.text,
                  fontFamily: fontFamilies.body,
                  fontSize: 12,
                  lineHeight: 18,
                }}
              >
                {t('supp.chemDisclaimerBody')}
              </Text>
            </Card>

            <View
              style={{
                borderRadius: radii.md,
                borderWidth: 1,
                borderColor: colors.border,
                backgroundColor: colors.bgSecondary,
                paddingHorizontal: 14,
              }}
            >
              <TextInput
                value={q}
                onChangeText={setQ}
                placeholder={t('supp.search')}
                placeholderTextColor={colors.textMuted}
                style={{ color: colors.text, fontFamily: fontFamilies.body600, fontSize: 15, height: 46 }}
              />
            </View>

            {filteredChem.map((s) => (
              <SupplementRow key={s.id} supplement={localizedSupplement(s, lang)} onTap={() => setSelected(s)} chem />
            ))}
          </View>
        )}
      </ScrollView>

      <SupplementModal supplement={selected ? localizedSupplement(selected, lang) : null} onClose={() => setSelected(null)} />
    </View>
  );
}

function SupplementRow({
  supplement, rank, onTap, chem,
}: { supplement: Supplement; rank?: number; onTap: () => void; chem?: boolean }) {
  const ev = evidenceLabel(supplement.evidence);
  const accent = chem ? '#FF4D6D' : colors.border;
  return (
    <Pressable
      onPress={onTap}
      style={{
        padding: 12,
        borderRadius: 14,
        borderWidth: 1,
        borderColor: accent,
        backgroundColor: chem ? 'rgba(255,77,109,0.05)' : colors.bgSecondary,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 10,
      }}
    >
      {rank ? (
        <View
          style={{
            width: 28,
            height: 28,
            borderRadius: 8,
            backgroundColor: 'rgba(255,181,71,0.18)',
            borderWidth: 1,
            borderColor: colors.amber,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.amber, fontFamily: fontFamilies.body700, fontSize: 12 }}>{rank}</Text>
        </View>
      ) : (
        <Text style={{ fontSize: 22 }}>{supplement.emoji}</Text>
      )}
      <View style={{ flex: 1 }}>
        <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 13 }}>
          {supplement.name}
        </Text>
        <Text
          style={{ marginTop: 2, color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11 }}
          numberOfLines={2}
        >
          {supplement.whatIs}
        </Text>
      </View>
      <View
        style={{
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 8,
          borderWidth: 1,
          borderColor: ev.color + '88',
          backgroundColor: ev.color + '22',
        }}
      >
        <Text style={{ color: ev.color, fontFamily: fontFamilies.body700, fontSize: 9 }}>{ev.label}</Text>
      </View>
      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
    </Pressable>
  );
}

function SupplementModal({ supplement, onClose }: { supplement: Supplement | null; onClose: () => void }) {
  const add = useSupplementsStore((s) => s.add);
  const items = useSupplementsStore((s) => s.items);
  const [dose, setDose] = useState('');
  const [timing, setTiming] = useState('');
  const [notes, setNotes] = useState('');

  React.useEffect(() => {
    if (supplement) {
      setDose(supplement.dosage);
      setTiming(supplement.timing.join(', '));
      setNotes('');
    }
  }, [supplement]);

  if (!supplement) return null;
  const alreadyAdded = items.some((i) => i.supplementId === supplement.id);
  const ev = evidenceLabel(supplement.evidence);
  const isChem = supplement.category === 'chemistry';

  return (
    <Modal visible={!!supplement} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.85)', justifyContent: 'flex-end' }}>
        <View
          style={{
            backgroundColor: colors.bg,
            borderTopLeftRadius: radii.xl,
            borderTopRightRadius: radii.xl,
            borderWidth: 1,
            borderColor: isChem ? '#FF4D6D' : colors.border,
            padding: 20,
            paddingBottom: 24,
            maxHeight: '92%',
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
            <Text style={{ fontSize: 28, marginRight: 10 }}>{supplement.emoji}</Text>
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontFamily: fontFamilies.heading, fontSize: 20 }}>
                {supplement.name}
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center', gap: 6, marginTop: 4 }}>
                <View
                  style={{
                    paddingHorizontal: 8,
                    paddingVertical: 3,
                    borderRadius: 8,
                    borderWidth: 1,
                    borderColor: ev.color + '88',
                    backgroundColor: ev.color + '22',
                  }}
                >
                  <Text style={{ color: ev.color, fontFamily: fontFamilies.body700, fontSize: 9 }}>{ev.label}</Text>
                </View>
                {supplement.topRank > 0 ? (
                  <Text style={{ color: colors.amber, fontFamily: fontFamilies.body700, fontSize: 10 }}>
                    {t('supp.rank', { n: supplement.topRank })}
                  </Text>
                ) : null}
              </View>
            </View>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} style={{ maxHeight: 480 }}>
            <Section title={t('supp.sectionWhatIs')}>
              <Text style={txtBody}>{supplement.whatIs}</Text>
            </Section>
            <Section title={t('supp.sectionEffect')}>
              <Text style={txtBody}>{supplement.effect}</Text>
            </Section>
            <Section title={t('supp.sectionDosage')}>
              <Text style={txtBody}>{supplement.dosage}</Text>
            </Section>
            <Section title={t('supp.sectionTiming')}>
              <Text style={txtBody}>{supplement.timing.map(timingLabel).join(' · ')}</Text>
            </Section>
            <Section title={t('supp.sectionCycle')}>
              <Text style={txtBody}>{supplement.cycle}</Text>
            </Section>
            <Section title={t('supp.sectionGoodFor')}>
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 6 }}>
                {supplement.goodFor.map((g) => (
                  <View
                    key={g}
                    style={{
                      paddingHorizontal: 10,
                      paddingVertical: 6,
                      borderRadius: 10,
                      borderWidth: 1,
                      borderColor: colors.borderNeon,
                      backgroundColor: 'rgba(157,107,255,0.12)',
                    }}
                  >
                    <Text style={{ color: colors.purpleLight, fontFamily: fontFamilies.body600, fontSize: 11 }}>
                      {g}
                    </Text>
                  </View>
                ))}
              </View>
            </Section>
            <Section title={t('supp.sectionCautions')}>
              <Text style={[txtBody, { color: colors.amber }]}>{supplement.cautions}</Text>
            </Section>

            {isChem ? (
              <>
                {supplement.sideEffects ? (
                  <Section title={t('supp.sectionSideEffects')}>
                    <Text style={[txtBody, { color: '#FF4D6D' }]}>{supplement.sideEffects}</Text>
                  </Section>
                ) : null}
                {supplement.legality ? (
                  <Section title={t('supp.sectionLegality')}>
                    <Text style={txtBody}>{supplement.legality}</Text>
                  </Section>
                ) : null}
                {supplement.pct ? (
                  <Section title={t('supp.sectionPCT')}>
                    <Text style={txtBody}>{supplement.pct}</Text>
                  </Section>
                ) : null}
                {supplement.labs ? (
                  <Section title={t('supp.sectionLabs')}>
                    <Text style={txtBody}>{supplement.labs}</Text>
                  </Section>
                ) : null}
              </>
            ) : null}

            {!alreadyAdded && !isChem ? (
              <>
                <View style={{ height: 1, backgroundColor: colors.border, marginVertical: 14 }} />
                <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14, marginBottom: 10 }}>
                  {t('supp.addToStack')}
                </Text>
                <Field label={t('supp.fieldDose')}>
                  <TextInput
                    value={dose}
                    onChangeText={setDose}
                    style={inputStyle}
                    placeholderTextColor={colors.textMuted}
                  />
                </Field>
                <Field label={t('supp.fieldTiming')}>
                  <TextInput
                    value={timing}
                    onChangeText={setTiming}
                    style={inputStyle}
                    placeholderTextColor={colors.textMuted}
                  />
                </Field>
                <Field label={t('supp.fieldNotes')}>
                  <TextInput
                    value={notes}
                    onChangeText={setNotes}
                    style={[inputStyle, { height: 64, paddingTop: 12, textAlignVertical: 'top' }]}
                    multiline
                    maxLength={200}
                    placeholderTextColor={colors.textMuted}
                  />
                </Field>
              </>
            ) : alreadyAdded ? (
              <View style={{ paddingVertical: 14 }}>
                <Text style={{ color: colors.green, fontFamily: fontFamilies.body700, fontSize: 13, textAlign: 'center' }}>
                  {t('supp.alreadyInStack')}
                </Text>
              </View>
            ) : null}
          </ScrollView>

          {!alreadyAdded && !isChem ? (
            <GradientButton
              title={t('supp.addToStack')}
              onPress={() => {
                add({
                  supplementId: supplement.id,
                  name: supplement.name,
                  dose,
                  timing,
                  notes: notes || undefined,
                });
                onClose();
              }}
              rightIcon={<Ionicons name="add" size={18} color={colors.text} />}
            />
          ) : null}
        </View>
      </View>
    </Modal>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 14 }}>
      <Text
        style={{
          color: colors.textMuted,
          fontFamily: fontFamilies.body500,
          fontSize: 10,
          letterSpacing: 1.5,
          marginBottom: 6,
        }}
      >
        {title}
      </Text>
      {children}
    </View>
  );
}
function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View style={{ marginBottom: 10 }}>
      <Text
        style={{
          color: colors.textMuted,
          fontFamily: fontFamilies.body500,
          fontSize: 10,
          letterSpacing: 1,
          marginBottom: 4,
        }}
      >
        {label.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

function timingLabel(t_: string): string {
  return t(`supp.timing.${t_}`);
}

const txtBody = {
  color: colors.text,
  fontFamily: fontFamilies.body,
  fontSize: 13,
  lineHeight: 19,
} as const;

const inputStyle = {
  color: colors.text,
  fontFamily: fontFamilies.body600,
  fontSize: 14,
  height: 44,
  borderRadius: radii.md,
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: colors.bgSecondary,
  paddingHorizontal: 14,
} as const;

const chipStyle = {
  paddingHorizontal: 12,
  paddingVertical: 8,
  borderRadius: 12,
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: colors.bgSecondary,
} as const;

const chipActive = {
  borderColor: colors.borderNeon,
  backgroundColor: 'rgba(157,107,255,0.18)',
} as const;
