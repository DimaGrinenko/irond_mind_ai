import { LinearGradient } from 'expo-linear-gradient';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Switch,
  Text,
  TextInput,
  View,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Card } from '../components/common/Card';
import { GradientButton } from '../components/common/GradientButton';
import { NeonScene3D } from '../components/3d/NeonScene3D';
import { ScreenHeader } from '../components/layout/ScreenHeader';
import { api, type ScheduledStatus, type ScheduledWorkout } from '../api/client';
import { useUserStore } from '../store/userStore';
import { colors, radii } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';

const WEEK_LABELS = ['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'];

function startOfWeek(d: Date) {
  const x = new Date(d);
  const day = (x.getDay() + 6) % 7;
  x.setDate(x.getDate() - day);
  x.setHours(0, 0, 0, 0);
  return x;
}

function isoDay(d: Date) {
  return d.toISOString().slice(0, 10);
}

function sameDay(iso: string, date: string) {
  return iso.slice(0, 10) === date.slice(0, 10);
}

export function CalendarScreen({ navigation }: any) {
  const currentProgramId = useUserStore((s) => s.currentProgramId);
  const [items, setItems] = useState<ScheduledWorkout[]>([]);
  const [loading, setLoading] = useState(false);
  const [anchor] = useState(() => new Date());
  const [selectedIso, setSelectedIso] = useState(() => isoDay(new Date()));
  const [showAdd, setShowAdd] = useState(false);
  const [onlyProgram, setOnlyProgram] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const start = startOfWeek(new Date());
      const from = isoDay(start);
      const end = new Date(start);
      end.setDate(end.getDate() + 60);
      const list = await api.schedule.list(from, isoDay(end));
      setItems(list);
    } catch {
      // backend недоступен — оставляем список пустым
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const weekDays = useMemo(() => {
    const start = startOfWeek(anchor);
    return Array.from({ length: 14 }).map((_, i) => {
      const d = new Date(start);
      d.setDate(start.getDate() + i);
      return { label: WEEK_LABELS[i % 7], date: d.getDate(), iso: isoDay(d) };
    });
  }, [anchor]);

  const filteredItems = useMemo(
    () =>
      onlyProgram && currentProgramId
        ? items.filter((w) => w.programId === currentProgramId)
        : items,
    [items, onlyProgram, currentProgramId],
  );
  const dayItems = useMemo(
    () => filteredItems.filter((w) => sameDay(w.date, selectedIso)),
    [filteredItems, selectedIso],
  );

  const onItemPress = (item: ScheduledWorkout) => {
    const isDone = item.status === 'DONE';
    const isSkipped = item.status === 'SKIPPED';
    const options = [
      ...(item.status === 'PLANNED'
        ? ['Отметить выполненной', 'Пропустить']
        : isDone
          ? []
          : ['Отметить выполненной']),
      'Удалить',
      'Отмена',
    ];

    const run = async (label: string) => {
      try {
        if (label === 'Отметить выполненной') {
          const updated = await api.schedule.complete(item.id);
          setItems((s) => s.map((x) => (x.id === item.id ? updated : x)));
        } else if (label === 'Пропустить') {
          const updated = await api.schedule.skip(item.id);
          setItems((s) => s.map((x) => (x.id === item.id ? updated : x)));
        } else if (label === 'Удалить') {
          await api.schedule.remove(item.id);
          setItems((s) => s.filter((x) => x.id !== item.id));
        }
      } catch (e) {
        Alert.alert('Ошибка', (e as Error).message);
      }
    };

    if (Platform.OS === 'ios') {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options,
          cancelButtonIndex: options.length - 1,
          destructiveButtonIndex: options.indexOf('Удалить'),
          title: item.title,
        },
        (idx) => {
          if (idx >= 0 && idx < options.length - 1) run(options[idx]);
        },
      );
    } else {
      const buttons: Array<{ text: string; style?: 'default' | 'cancel' | 'destructive'; onPress?: () => void }> =
        options.slice(0, -1).map((label) => ({
          text: label,
          style: label === 'Удалить' ? 'destructive' : 'default',
          onPress: () => {
            void run(label);
          },
        }));
      buttons.push({ text: 'Отмена', style: 'cancel' });
      Alert.alert(
        item.title,
        isDone ? 'Тренировка отмечена выполненной' : isSkipped ? 'Тренировка пропущена' : undefined,
        buttons,
      );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      <ScreenHeader
        title="Календарь"
        onBack={() => navigation.goBack()}
        right={
          <Pressable
            onPress={() => setSelectedIso(isoDay(new Date()))}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 14,
              borderWidth: 1,
              borderColor: colors.borderNeon,
              backgroundColor: colors.bgSecondary,
            }}
          >
            <Text style={{ color: colors.cyan, fontFamily: fontFamilies.body600, fontSize: 12 }}>Сегодня</Text>
          </Pressable>
        }
      />
      <NeonScene3D height={72} />

      {currentProgramId ? (
        <View style={{ paddingHorizontal: 16, marginTop: 6, flexDirection: 'row', gap: 8 }}>
          <Pressable
            onPress={() => setOnlyProgram(false)}
            style={{
              flex: 1,
              paddingVertical: 8,
              alignItems: 'center',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: !onlyProgram ? colors.borderNeon : colors.border,
              backgroundColor: !onlyProgram ? 'rgba(157,107,255,0.18)' : colors.bgSecondary,
            }}
          >
            <Text style={{ color: !onlyProgram ? colors.purpleLight : colors.textSecondary, fontFamily: fontFamilies.body700, fontSize: 12 }}>
              Все
            </Text>
          </Pressable>
          <Pressable
            onPress={() => setOnlyProgram(true)}
            style={{
              flex: 1,
              paddingVertical: 8,
              alignItems: 'center',
              borderRadius: 12,
              borderWidth: 1,
              borderColor: onlyProgram ? colors.borderNeon : colors.border,
              backgroundColor: onlyProgram ? 'rgba(157,107,255,0.18)' : colors.bgSecondary,
            }}
          >
            <Text style={{ color: onlyProgram ? colors.purpleLight : colors.textSecondary, fontFamily: fontFamilies.body700, fontSize: 12 }}>
              Только из программы
            </Text>
          </Pressable>
        </View>
      ) : null}

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingVertical: 6 }}
      >
        <View style={{ flexDirection: 'row', gap: 8 }}>
          {weekDays.map((d) => {
            const active = d.iso === selectedIso;
            const hasItems = filteredItems.some((w) => sameDay(w.date, d.iso));
            return (
              <Pressable
                key={d.iso}
                onPress={() => setSelectedIso(d.iso)}
                style={{ alignItems: 'center', width: 46 }}
              >
                <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body600, fontSize: 11 }}>
                  {d.label}
                </Text>
                <View
                  style={{
                    marginTop: 6,
                    width: 36,
                    height: 36,
                    borderRadius: 18,
                    borderWidth: 1,
                    borderColor: active ? colors.borderNeon : colors.border,
                    backgroundColor: active ? 'rgba(157,107,255,0.25)' : colors.bgSecondary,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      color: active ? colors.text : colors.textSecondary,
                      fontFamily: fontFamilies.body700,
                      fontSize: 13,
                    }}
                  >
                    {d.date}
                  </Text>
                </View>
                <View
                  style={{
                    marginTop: 4,
                    width: 6,
                    height: 6,
                    borderRadius: 3,
                    backgroundColor: hasItems ? colors.cyan : 'transparent',
                  }}
                />
              </Pressable>
            );
          })}
        </View>
      </ScrollView>

      <ScrollView contentContainerStyle={{ paddingBottom: 140 }} showsVerticalScrollIndicator={false}>
        {loading ? (
          <View style={{ paddingVertical: 24, alignItems: 'center' }}>
            <ActivityIndicator color={colors.purpleLight} />
          </View>
        ) : null}

        <View style={{ paddingHorizontal: 16, marginTop: 8, gap: 12 }}>
          {dayItems.length === 0 ? (
            <Card>
              <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body, textAlign: 'center' }}>
                На этот день ничего не запланировано.
              </Text>
            </Card>
          ) : (
            dayItems.map((w) => (
              <Pressable key={w.id} onPress={() => onItemPress(w)}>
                <Card style={{ padding: 0, overflow: 'hidden' }}>
                  <LinearGradient
                    colors={
                      w.status === 'DONE'
                        ? ['rgba(63,255,150,0.2)', 'rgba(0,0,0,0.95)']
                        : w.status === 'SKIPPED'
                          ? ['rgba(255,77,210,0.18)', 'rgba(0,0,0,0.95)']
                          : ['rgba(157,107,255,0.22)', 'rgba(0,0,0,0.95)']
                    }
                    style={{ padding: 14 }}
                  >
                    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
                      <StatusBadge status={w.status} />
                      <View style={{ flex: 1 }}>
                        <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 14 }}>
                          {w.title}
                        </Text>
                        <Text
                          style={{
                            marginTop: 4,
                            color: colors.textMuted,
                            fontFamily: fontFamilies.body600,
                            fontSize: 12,
                          }}
                        >
                          {w.time ? `${w.time} · ` : ''}
                          {labelForStatus(w.status)}
                          {w.notes ? ` · ${w.notes}` : ''}
                        </Text>
                      </View>
                      <Ionicons name="chevron-forward" size={18} color={colors.textMuted} />
                    </View>
                  </LinearGradient>
                </Card>
              </Pressable>
            ))
          )}
        </View>
      </ScrollView>

      <View
        style={{
          position: 'absolute',
          left: 16,
          right: 16,
          bottom: 22,
        }}
      >
        <GradientButton
          title="Добавить план"
          onPress={() => setShowAdd(true)}
          rightIcon={<Ionicons name="add" size={18} color={colors.text} />}
        />
      </View>

      <AddPlanModal
        visible={showAdd}
        date={selectedIso}
        onClose={() => setShowAdd(false)}
        onCreated={async () => {
          setShowAdd(false);
          await load();
        }}
      />
    </View>
  );
}

function StatusBadge({ status }: { status: ScheduledStatus }) {
  const icon = status === 'DONE' ? 'checkmark-circle' : status === 'SKIPPED' ? 'remove-circle' : 'barbell';
  const tint = status === 'DONE' ? '#3FFF8F' : status === 'SKIPPED' ? '#FF4DD2' : colors.purpleLight;
  return (
    <View
      style={{
        width: 44,
        height: 44,
        borderRadius: 16,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.bgSecondary,
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Ionicons name={icon as any} size={20} color={tint} />
    </View>
  );
}

function labelForStatus(s: ScheduledStatus) {
  if (s === 'DONE') return 'Выполнена';
  if (s === 'SKIPPED') return 'Пропущена';
  return 'Запланирована';
}

function AddPlanModal({
  visible,
  date,
  onClose,
  onCreated,
}: {
  visible: boolean;
  date: string;
  onClose: () => void;
  onCreated: () => void;
}) {
  const [title, setTitle] = useState('Тренировка');
  const [time, setTime] = useState('');
  const [repeat, setRepeat] = useState(false);
  const [weekdays, setWeekdays] = useState<number[]>([]);
  const [weeks, setWeeks] = useState(4);
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!title.trim()) {
      Alert.alert('Укажи название');
      return;
    }
    setSubmitting(true);
    try {
      await api.schedule.create({
        date,
        title: title.trim(),
        time: time && /^([01]\d|2[0-3]):[0-5]\d$/.test(time) ? time : undefined,
        repeatWeekdays: repeat && weekdays.length ? weekdays : undefined,
        repeatWeeks: repeat ? weeks : undefined,
      });
      setTitle('Тренировка');
      setTime('');
      setRepeat(false);
      setWeekdays([]);
      onCreated();
    } catch (e) {
      Alert.alert('Не получилось создать', (e as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={{ flex: 1, backgroundColor: 'rgba(0,0,0,0.7)', justifyContent: 'flex-end' }}>
        <View
          style={{
            backgroundColor: colors.bg,
            borderTopLeftRadius: radii.xl,
            borderTopRightRadius: radii.xl,
            borderWidth: 1,
            borderColor: colors.border,
            padding: 20,
            paddingBottom: 32,
            gap: 14,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ flex: 1, color: colors.text, fontFamily: fontFamilies.heading, fontSize: 20 }}>
              Новый план
            </Text>
            <Pressable onPress={onClose} hitSlop={12}>
              <Ionicons name="close" size={22} color={colors.textSecondary} />
            </Pressable>
          </View>
          <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 12 }}>
            На {date}
          </Text>

          <Field label="Название">
            <TextInput
              value={title}
              onChangeText={setTitle}
              placeholder="Например: Грудь+трицепс"
              placeholderTextColor={colors.textMuted}
              style={inputStyle}
              maxLength={80}
            />
          </Field>

          <Field label="Время (опционально)">
            <TextInput
              value={time}
              onChangeText={setTime}
              placeholder="HH:mm — например 18:30"
              placeholderTextColor={colors.textMuted}
              style={inputStyle}
              maxLength={5}
              keyboardType="numbers-and-punctuation"
            />
          </Field>

          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              borderRadius: radii.md,
              borderWidth: 1,
              borderColor: colors.border,
              backgroundColor: colors.bgSecondary,
              paddingHorizontal: 14,
              paddingVertical: 10,
            }}
          >
            <View style={{ flex: 1 }}>
              <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 13 }}>
                Повторять по дням
              </Text>
              <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body, fontSize: 11, marginTop: 2 }}>
                Создаст серию планов на N недель
              </Text>
            </View>
            <Switch value={repeat} onValueChange={setRepeat} />
          </View>

          {repeat ? (
            <>
              <View style={{ flexDirection: 'row', gap: 6, flexWrap: 'wrap' }}>
                {WEEK_LABELS.map((label, i) => {
                  const active = weekdays.includes(i);
                  return (
                    <Pressable
                      key={label}
                      onPress={() =>
                        setWeekdays((s) => (active ? s.filter((x) => x !== i) : [...s, i].sort()))
                      }
                      style={{
                        paddingHorizontal: 14,
                        paddingVertical: 10,
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: active ? 'rgba(123,63,228,0.55)' : colors.border,
                        backgroundColor: active ? 'rgba(123,63,228,0.18)' : colors.bgSecondary,
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
              <View style={{ flexDirection: 'row', gap: 8 }}>
                {[2, 4, 8, 12].map((w) => {
                  const active = weeks === w;
                  return (
                    <Pressable
                      key={w}
                      onPress={() => setWeeks(w)}
                      style={{
                        flex: 1,
                        paddingVertical: 10,
                        alignItems: 'center',
                        borderRadius: 14,
                        borderWidth: 1,
                        borderColor: active ? 'rgba(123,63,228,0.55)' : colors.border,
                        backgroundColor: active ? 'rgba(123,63,228,0.18)' : colors.bgSecondary,
                      }}
                    >
                      <Text
                        style={{
                          color: active ? colors.text : colors.textSecondary,
                          fontFamily: fontFamilies.body700,
                          fontSize: 12,
                        }}
                      >
                        {w} нед.
                      </Text>
                    </Pressable>
                  );
                })}
              </View>
            </>
          ) : null}

          <GradientButton
            title={submitting ? 'Создаём…' : 'Создать'}
            onPress={submit}
            rightIcon={
              submitting ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <Ionicons name="checkmark" size={18} color={colors.text} />
              )
            }
          />
        </View>
      </View>
    </Modal>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <View>
      <Text
        style={{
          color: colors.textMuted,
          fontFamily: fontFamilies.body500,
          fontSize: 11,
          letterSpacing: 1,
          marginBottom: 6,
        }}
      >
        {label.toUpperCase()}
      </Text>
      {children}
    </View>
  );
}

const inputStyle = {
  color: colors.text,
  fontFamily: fontFamilies.body600,
  fontSize: 15,
  height: 50,
  borderRadius: radii.md,
  borderWidth: 1,
  borderColor: colors.border,
  backgroundColor: colors.bgSecondary,
  paddingHorizontal: 14,
};
