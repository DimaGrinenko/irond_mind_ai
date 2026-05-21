import React, { useMemo, useState } from 'react';
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { colors, radii } from '../../theme/tokens';
import { fontFamilies } from '../../theme/typography';
import {
  exercises as catalog,
  type Exercise,
  type MuscleGroup,
} from '../../data/exercises';
import { localizedExercise } from '../../data/exercises_en';
import { t, useLang, muscleLabel } from '../../i18n';

type Props = {
  visible: boolean;
  /** Если задан — изначально фильтруем по той же группе */
  preferGroup?: MuscleGroup;
  /** Исключить эти id из списка (например, чтобы не показывать уже выбранное) */
  excludeIds?: string[];
  onClose: () => void;
  onPick: (ex: Exercise) => void;
};

const GROUPS: MuscleGroup[] = [
  'Грудь',
  'Спина',
  'Плечи',
  'Бицепс',
  'Трицепс',
  'Ноги',
  'Ягодицы',
  'Пресс',
  'Полное тело',
  'Кардио',
];

export function ExercisePickerModal({
  visible,
  preferGroup,
  excludeIds,
  onClose,
  onPick,
}: Props) {
  const lang = useLang();
  const [q, setQ] = useState('');
  const [group, setGroup] = useState<MuscleGroup | 'all'>(preferGroup ?? 'all');

  React.useEffect(() => {
    if (visible) {
      setQ('');
      setGroup(preferGroup ?? 'all');
    }
  }, [visible, preferGroup]);

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase();
    return catalog.filter((e) => {
      if (excludeIds?.includes(e.id)) return false;
      if (group !== 'all' && e.primary !== group) return false;
      if (!term) return true;
      return e.name.toLowerCase().includes(term);
    });
  }, [q, group, excludeIds]);

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
            borderColor: colors.border,
            padding: 20,
            paddingBottom: 24,
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
            <Text
              style={{
                flex: 1,
                color: colors.text,
                fontFamily: fontFamilies.heading,
                fontSize: 20,
              }}
            >
              {t('gym.replaceTitle')}
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>

          <View
            style={{
              borderRadius: radii.md,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.bgSecondary,
              paddingHorizontal: 14,
              marginBottom: 10,
            }}
          >
            <TextInput
              value={q}
              onChangeText={setQ}
              placeholder={t('gym.search')}
              placeholderTextColor={colors.textMuted}
              style={{
                color: colors.text,
                fontFamily: fontFamilies.body600,
                fontSize: 15,
                height: 46,
              }}
            />
          </View>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{ gap: 6, marginBottom: 10 }}
          >
            {(['all', ...GROUPS] as Array<MuscleGroup | 'all'>).map((g) => {
              const active = g === group;
              const label = g === 'all' ? t('foods.tabAll') : muscleLabel(g);
              return (
                <Pressable
                  key={g}
                  onPress={() => setGroup(g)}
                  style={{
                    paddingHorizontal: 12,
                    paddingVertical: 8,
                    borderRadius: 12,
                    borderWidth: 1,
                    borderColor: active ? colors.borderNeon : colors.border,
                    backgroundColor: active
                      ? 'rgba(157,107,255,0.18)'
                      : colors.bgSecondary,
                  }}
                >
                  <Text
                    style={{
                      color: active ? colors.purpleLight : colors.textSecondary,
                      fontFamily: fontFamilies.body700,
                      fontSize: 11,
                    }}
                  >
                    {label}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>

          <ScrollView
            showsVerticalScrollIndicator={false}
            style={{ maxHeight: 480 }}
          >
            {filtered.map((e) => (
              <Pressable
                key={e.id}
                onPress={() => {
                  onPick(e);
                  onClose();
                }}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  paddingVertical: 10,
                  paddingHorizontal: 8,
                  borderBottomWidth: 1,
                  borderBottomColor: colors.border,
                  gap: 10,
                }}
              >
                <View
                  style={{
                    width: 36,
                    height: 36,
                    borderRadius: 12,
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'rgba(157,107,255,0.18)',
                    borderWidth: 1,
                    borderColor: colors.borderNeon,
                  }}
                >
                  <Ionicons
                    name="barbell"
                    size={16}
                    color={colors.purpleLight}
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
                    {localizedExercise(e, lang).name}
                  </Text>
                  <Text
                    style={{
                      color: colors.textMuted,
                      fontFamily: fontFamilies.body,
                      fontSize: 11,
                      marginTop: 2,
                    }}
                  >
                    {muscleLabel(e.primary)} ·{' '}
                    {localizedExercise(e, lang).equipment}
                  </Text>
                </View>
                <Ionicons
                  name="chevron-forward"
                  size={16}
                  color={colors.textMuted}
                />
              </Pressable>
            ))}
            {filtered.length === 0 ? (
              <Text
                style={{
                  color: colors.textMuted,
                  textAlign: 'center',
                  paddingVertical: 24,
                }}
              >
                {t('gym.searchEmpty')}
              </Text>
            ) : null}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}
