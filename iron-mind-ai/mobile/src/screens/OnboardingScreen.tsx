import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  Text,
  TextInput,
  View,
} from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import Animated, { FadeIn, FadeInDown, FadeInUp, FadeOut } from 'react-native-reanimated';
import { colors, gradients, radii, spacing } from '../theme/tokens';
import { fontFamilies } from '../theme/typography';
import { GradientButton } from '../components/common/GradientButton';
import { CyberAthlete } from '../components/anatomy/CyberAthlete';
import { Particles } from '../components/anim/Particles';
import {
  type FitnessGoalKey,
  type FitnessLevel,
  type Gender,
  useUserStore,
} from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import { ApiError, api } from '../api/client';

type Step =
  | 'welcome'
  | 'name'
  | 'gender'
  | 'metrics'
  | 'goal'
  | 'level'
  | 'account'
  | 'finish';

const GOALS: Array<{ key: FitnessGoalKey; title: string; subtitle: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { key: 'mass', title: 'Набор массы', subtitle: 'Растим объём и силу', icon: 'barbell' },
  { key: 'cut', title: 'Рельеф', subtitle: 'Сжигаем жир, проявляем мышцы', icon: 'flame' },
  { key: 'strength', title: 'Сила', subtitle: 'Тяжёлые базовые движения', icon: 'flash' },
  { key: 'endurance', title: 'Выносливость', subtitle: 'Кардио и работа на объём', icon: 'pulse' },
  { key: 'abs', title: 'Пресс', subtitle: 'Кубики и крепкий кор', icon: 'fitness' },
];

const LEVELS: Array<{ key: FitnessLevel; title: string; subtitle: string }> = [
  { key: 'beginner', title: 'Новичок', subtitle: 'Опыт меньше 6 месяцев' },
  { key: 'intermediate', title: 'Средний', subtitle: 'Тренируюсь 1–2 года' },
  { key: 'advanced', title: 'Продвинутый', subtitle: 'Опыт более 2 лет' },
];

const GENDERS: Array<{ key: Gender; title: string; icon: keyof typeof Ionicons.glyphMap }> = [
  { key: 'male', title: 'Мужской', icon: 'male' },
  { key: 'female', title: 'Женский', icon: 'female' },
  { key: 'other', title: 'Другое', icon: 'person' },
];

const ORDER: Step[] = ['welcome', 'name', 'gender', 'metrics', 'goal', 'level', 'account', 'finish'];

export function OnboardingScreen() {
  const [step, setStep] = useState<Step>('welcome');
  const insets = useSafeAreaInsets();
  const u = useUserStore();

  const idx = ORDER.indexOf(step);
  const total = ORDER.length;

  const goNext = (next: Step) => setStep(next);

  return (
    <View style={{ flex: 1, backgroundColor: colors.bg }}>
      {/* Ambient gradient backdrop */}
      <LinearGradient
        colors={['rgba(138,92,255,0.35)', 'rgba(0,0,0,0)']}
        start={{ x: 0.5, y: 0 }}
        end={{ x: 0.5, y: 1 }}
        style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 360 }}
      />
      <Particles count={14} height={400} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={{ paddingTop: insets.top + 12, paddingHorizontal: spacing.lg }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
            <Ionicons name="sparkles" size={16} color={colors.text} />
            <Text
              style={{
                color: colors.text,
                fontFamily: fontFamilies.body700,
                letterSpacing: 1.4,
                fontSize: 12,
              }}
            >
              AI TRAINER
            </Text>
          </View>

          {step !== 'welcome' ? (
            <ProgressBar value={idx} total={total - 1} />
          ) : (
            <View style={{ height: 18 }} />
          )}
        </View>

        <ScrollView
          style={{ flex: 1 }}
          contentContainerStyle={{ paddingHorizontal: spacing.lg, paddingBottom: 40 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 'welcome' && <WelcomeStep onNext={() => goNext('name')} />}

          {step === 'name' && (
            <NameStep
              value={u.name}
              onChange={u.setName}
              onBack={() => goNext('welcome')}
              onNext={() => goNext('gender')}
            />
          )}

          {step === 'gender' && (
            <GenderStep
              value={u.gender}
              onChange={u.setGender}
              onBack={() => goNext('name')}
              onNext={() => goNext('metrics')}
            />
          )}

          {step === 'metrics' && (
            <MetricsStep
              age={u.age}
              heightCm={u.heightCm}
              weightKg={u.weightKg}
              setAge={u.setAge}
              setHeight={u.setHeight}
              setWeight={u.setWeight}
              onBack={() => goNext('gender')}
              onNext={() => goNext('goal')}
            />
          )}

          {step === 'goal' && (
            <GoalStep
              value={u.goalKey}
              onChange={(g) => u.setGoal(g.title, g.key)}
              onBack={() => goNext('metrics')}
              onNext={() => goNext('level')}
            />
          )}

          {step === 'level' && (
            <LevelStep
              value={u.level}
              onChange={u.setLevel}
              onBack={() => goNext('goal')}
              onNext={() => goNext('account')}
            />
          )}

          {step === 'account' && (
            <AccountStep
              onBack={() => goNext('level')}
              onNext={() => goNext('finish')}
            />
          )}

          {step === 'finish' && (
            <FinishStep
              onStart={() => {
                u.completeOnboarding();
              }}
            />
          )}
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

function ProgressBar({ value, total }: { value: number; total: number }) {
  const pct = Math.max(0, Math.min(1, value / total));
  return (
    <View style={{ marginTop: 18, height: 4, borderRadius: 999, backgroundColor: 'rgba(255,255,255,0.08)', overflow: 'hidden' }}>
      <Animated.View
        entering={FadeIn.duration(180)}
        style={{ width: `${pct * 100}%`, height: '100%' }}
      >
        <LinearGradient
          colors={gradients.PRIMARY as any}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={{ flex: 1, borderRadius: 999 }}
        />
      </Animated.View>
    </View>
  );
}

function StepShell({ children }: { children: React.ReactNode }) {
  if (Platform.OS === 'web') return <View>{children}</View>;
  return (
    <Animated.View entering={FadeInDown.duration(360)} exiting={FadeOut.duration(160)}>
      {children}
    </Animated.View>
  );
}

function HeadingSmall({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        color: colors.textMuted,
        fontFamily: fontFamilies.body500,
        fontSize: 12,
        letterSpacing: 1.2,
        marginTop: 28,
      }}
    >
      {children}
    </Text>
  );
}

function HeadingBig({ children }: { children: React.ReactNode }) {
  return (
    <Text
      style={{
        color: colors.text,
        fontFamily: fontFamilies.heading,
        fontSize: 30,
        lineHeight: 34,
        marginTop: 8,
      }}
    >
      {children}
    </Text>
  );
}

function NavRow({ onBack, onNext, nextLabel = 'Дальше', disabled }: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  disabled?: boolean;
}) {
  return (
    <View style={{ marginTop: 28, flexDirection: 'row', alignItems: 'center', gap: 12 }}>
      {onBack ? (
        <Pressable
          onPress={onBack}
          style={{
            width: 56,
            height: 56,
            borderRadius: radii.md,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: colors.bgSecondary,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Ionicons name="arrow-back" size={18} color={colors.text} />
        </Pressable>
      ) : null}
      <View style={{ flex: 1, opacity: disabled ? 0.5 : 1 }} pointerEvents={disabled ? 'none' : 'auto'}>
        {onNext ? (
          <GradientButton
            title={nextLabel}
            onPress={onNext}
            rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.text} />}
          />
        ) : null}
      </View>
    </View>
  );
}

function WelcomeStep({ onNext }: { onNext: () => void }) {
  return (
    <StepShell>
      <View style={{ alignItems: 'center', marginTop: 24 }}>
        <Animated.View entering={FadeIn.duration(700)}>
          <CyberAthlete width={280} height={340} />
        </Animated.View>
      </View>
      <Animated.Text
        entering={FadeInUp.delay(120).duration(420)}
        style={{
          color: colors.text,
          fontFamily: fontFamilies.heading,
          fontSize: 36,
          lineHeight: 40,
          textAlign: 'center',
          marginTop: 10,
        }}
      >
        ТВОЙ ПУТЬ.{'\n'}ТВОИ ПРАВИЛА.
      </Animated.Text>
      <Animated.Text
        entering={FadeInUp.delay(220).duration(420)}
        style={{
          marginTop: 14,
          textAlign: 'center',
          color: colors.textSecondary,
          fontFamily: fontFamilies.body500,
          fontSize: 14,
          paddingHorizontal: 16,
        }}
      >
        Искусственный интеллект.{'\n'}Максимальный результат.
      </Animated.Text>
      <View style={{ marginTop: 36 }}>
        <GradientButton
          title="Начать"
          onPress={onNext}
          rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.text} />}
        />
      </View>
      <Text
        style={{
          textAlign: 'center',
          marginTop: 14,
          color: colors.textMuted,
          fontFamily: fontFamilies.body,
          fontSize: 12,
        }}
      >
        Займёт меньше минуты
      </Text>
    </StepShell>
  );
}

function NameStep({ value, onChange, onBack, onNext }: {
  value: string;
  onChange: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const ok = value.trim().length >= 2;
  return (
    <StepShell>
      <HeadingSmall>ШАГ 1 ИЗ 6</HeadingSmall>
      <HeadingBig>Как тебя зовут?</HeadingBig>
      <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body, marginTop: 8 }}>
        Будем обращаться по имени.
      </Text>

      <View
        style={{
          marginTop: 28,
          borderRadius: radii.md,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.bgSecondary,
          paddingHorizontal: 14,
        }}
      >
        <TextInput
          value={value}
          onChangeText={onChange}
          placeholder="Например, Александр"
          placeholderTextColor={colors.textMuted}
          autoFocus
          style={{
            color: colors.text,
            fontFamily: fontFamilies.body600,
            fontSize: 16,
            height: 56,
          }}
          maxLength={32}
        />
      </View>

      <NavRow onBack={onBack} onNext={onNext} disabled={!ok} />
    </StepShell>
  );
}

function GenderStep({ value, onChange, onBack, onNext }: {
  value: Gender | null;
  onChange: (v: Gender) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <StepShell>
      <HeadingSmall>ШАГ 2 ИЗ 6</HeadingSmall>
      <HeadingBig>Твой пол</HeadingBig>
      <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body, marginTop: 8 }}>
        Подберём программы и нормы под тебя.
      </Text>

      <View style={{ marginTop: 24, gap: 12 }}>
        {GENDERS.map((g) => {
          const active = value === g.key;
          return (
            <Pressable key={g.key} onPress={() => onChange(g.key)}>
              <LinearGradient
                colors={
                  active
                    ? (['rgba(123,63,228,0.35)', 'rgba(177,78,255,0.18)'] as any)
                    : (['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.02)'] as any)
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: radii.lg,
                  borderWidth: 1,
                  borderColor: active ? colors.purpleLight : colors.border,
                  paddingVertical: 18,
                  paddingHorizontal: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radii.md,
                    backgroundColor: 'rgba(21,21,31,0.85)',
                    borderWidth: 1,
                    borderColor: active ? colors.purpleLight : colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons name={g.icon} size={20} color={active ? colors.purpleLight : colors.text} />
                </View>
                <Text style={{ flex: 1, color: colors.text, fontFamily: fontFamilies.body700, fontSize: 16 }}>
                  {g.title}
                </Text>
                {active ? (
                  <Ionicons name="checkmark-circle" size={22} color={colors.purpleLight} />
                ) : null}
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>

      <NavRow onBack={onBack} onNext={onNext} disabled={!value} />
    </StepShell>
  );
}

function MetricsStep({
  age,
  heightCm,
  weightKg,
  setAge,
  setHeight,
  setWeight,
  onBack,
  onNext,
}: {
  age: number | null;
  heightCm: number | null;
  weightKg: number | null;
  setAge: (n: number) => void;
  setHeight: (n: number) => void;
  setWeight: (n: number) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const ok = age && age > 0 && heightCm && heightCm > 0 && weightKg && weightKg > 0;
  return (
    <StepShell>
      <HeadingSmall>ШАГ 3 ИЗ 6</HeadingSmall>
      <HeadingBig>Параметры тела</HeadingBig>
      <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body, marginTop: 8 }}>
        Используем только локально, нужны для расчётов.
      </Text>

      <View style={{ marginTop: 24, gap: 12 }}>
        <NumericRow
          label="Возраст"
          unit="лет"
          value={age}
          onChange={setAge}
          placeholder="25"
          maxLength={3}
        />
        <NumericRow
          label="Рост"
          unit="см"
          value={heightCm}
          onChange={setHeight}
          placeholder="180"
          maxLength={3}
        />
        <NumericRow
          label="Вес"
          unit="кг"
          value={weightKg}
          onChange={setWeight}
          placeholder="78"
          maxLength={3}
        />
      </View>

      <NavRow onBack={onBack} onNext={onNext} disabled={!ok} />
    </StepShell>
  );
}

function NumericRow({
  label,
  unit,
  value,
  onChange,
  placeholder,
  maxLength,
}: {
  label: string;
  unit: string;
  value: number | null;
  onChange: (n: number) => void;
  placeholder: string;
  maxLength: number;
}) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: radii.md,
        borderWidth: 1,
        borderColor: colors.border,
        backgroundColor: colors.bgSecondary,
        paddingHorizontal: 14,
      }}
    >
      <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body500, width: 80 }}>{label}</Text>
      <TextInput
        value={value ? String(value) : ''}
        onChangeText={(t) => {
          const n = Number(t.replace(/[^0-9]/g, ''));
          onChange(Number.isFinite(n) ? n : 0);
        }}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        keyboardType="number-pad"
        maxLength={maxLength}
        style={{
          flex: 1,
          color: colors.text,
          fontFamily: fontFamilies.body700,
          fontSize: 18,
          height: 56,
          textAlign: 'right',
        }}
      />
      <Text style={{ marginLeft: 8, color: colors.textMuted, fontFamily: fontFamilies.body500 }}>{unit}</Text>
    </View>
  );
}

function GoalStep({ value, onChange, onBack, onNext }: {
  value: FitnessGoalKey | null;
  onChange: (g: { key: FitnessGoalKey; title: string }) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <StepShell>
      <HeadingSmall>ШАГ 4 ИЗ 6</HeadingSmall>
      <HeadingBig>Какая твоя цель?</HeadingBig>
      <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body, marginTop: 8 }}>
        Под цель подберём программу и питание.
      </Text>

      <View style={{ marginTop: 24, gap: 10 }}>
        {GOALS.map((g) => {
          const active = value === g.key;
          return (
            <Pressable key={g.key} onPress={() => onChange({ key: g.key, title: g.title })}>
              <LinearGradient
                colors={
                  active
                    ? (['rgba(123,63,228,0.35)', 'rgba(255,63,203,0.18)'] as any)
                    : (['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.02)'] as any)
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: radii.lg,
                  borderWidth: 1,
                  borderColor: active ? colors.purpleLight : colors.border,
                  padding: 14,
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <View
                  style={{
                    width: 44,
                    height: 44,
                    borderRadius: radii.md,
                    backgroundColor: 'rgba(21,21,31,0.85)',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderWidth: 1,
                    borderColor: active ? colors.purpleLight : colors.border,
                  }}
                >
                  <Ionicons name={g.icon} size={20} color={active ? colors.purpleLight : colors.text} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 15 }}>
                    {g.title}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontFamily: fontFamilies.body,
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {g.subtitle}
                  </Text>
                </View>
                {active ? (
                  <Ionicons name="checkmark-circle" size={22} color={colors.purpleLight} />
                ) : null}
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>

      <NavRow onBack={onBack} onNext={onNext} disabled={!value} />
    </StepShell>
  );
}

function LevelStep({ value, onChange, onBack, onNext }: {
  value: FitnessLevel | null;
  onChange: (v: FitnessLevel) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  return (
    <StepShell>
      <HeadingSmall>ШАГ 5 ИЗ 6</HeadingSmall>
      <HeadingBig>Твой уровень</HeadingBig>
      <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body, marginTop: 8 }}>
        Подберём интенсивность.
      </Text>

      <View style={{ marginTop: 24, gap: 12 }}>
        {LEVELS.map((l) => {
          const active = value === l.key;
          return (
            <Pressable key={l.key} onPress={() => onChange(l.key)}>
              <LinearGradient
                colors={
                  active
                    ? (['rgba(123,63,228,0.35)', 'rgba(177,78,255,0.18)'] as any)
                    : (['rgba(255,255,255,0.02)', 'rgba(255,255,255,0.02)'] as any)
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: radii.lg,
                  borderWidth: 1,
                  borderColor: active ? colors.purpleLight : colors.border,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ color: colors.text, fontFamily: fontFamilies.body700, fontSize: 16 }}>
                    {l.title}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontFamily: fontFamilies.body,
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {l.subtitle}
                  </Text>
                </View>
                {active ? (
                  <Ionicons name="checkmark-circle" size={22} color={colors.purpleLight} />
                ) : null}
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>

      <NavRow onBack={onBack} onNext={onNext} nextLabel="Завершить" disabled={!value} />
    </StepShell>
  );
}

function AccountStep({ onBack, onNext }: { onBack: () => void; onNext: () => void }) {
  const u = useUserStore();
  const auth = useAuthStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const valid = /\S+@\S+\.\S+/.test(email) && password.length >= 8;

  const submit = async () => {
    setSubmitting(true);
    try {
      await auth.register(email.trim(), password, u.name || 'User', u.goal);
      try {
        await api.users.update({
          gender: u.gender ? u.gender.toUpperCase() : undefined,
          age: u.age ?? undefined,
          heightCm: u.heightCm ?? undefined,
          weightKg: u.weightKg ?? undefined,
          level: u.level ? u.level.toUpperCase() : undefined,
          goalKey: u.goalKey ? u.goalKey.toUpperCase() : undefined,
          goal: u.goal,
          onboardingCompleted: true,
        });
      } catch {
        // best-effort: профиль локально уже сохранён
      }
      onNext();
    } catch (e) {
      // ApiError = сервер ответил ошибкой; иначе fetch бросил TypeError — сеть/сервер недоступны.
      const msg =
        e instanceof ApiError
          ? e.message
          : 'Сервер недоступен. Можно продолжить локально.';
      Alert.alert('Ошибка', msg, [
        { text: 'Повторить', style: 'cancel' },
        { text: 'Продолжить локально', onPress: onNext },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StepShell>
      <HeadingSmall>ПОСЛЕДНИЙ ШАГ</HeadingSmall>
      <HeadingBig>Создай аккаунт</HeadingBig>
      <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body, marginTop: 8 }}>
        Чтобы синхронизировать прогресс между устройствами. Не обязательно — можно продолжить без аккаунта.
      </Text>

      <View
        style={{
          marginTop: 24,
          borderRadius: radii.md,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.bgSecondary,
          paddingHorizontal: 14,
        }}
      >
        <TextInput
          value={email}
          onChangeText={setEmail}
          placeholder="Email"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          keyboardType="email-address"
          style={{
            color: colors.text,
            fontFamily: fontFamilies.body600,
            fontSize: 15,
            height: 56,
          }}
        />
      </View>

      <View
        style={{
          marginTop: 12,
          borderRadius: radii.md,
          borderWidth: 1,
          borderColor: colors.border,
          backgroundColor: colors.bgSecondary,
          paddingHorizontal: 14,
        }}
      >
        <TextInput
          value={password}
          onChangeText={setPassword}
          placeholder="Пароль (мин. 8 символов)"
          placeholderTextColor={colors.textMuted}
          autoCapitalize="none"
          autoCorrect={false}
          secureTextEntry
          style={{
            color: colors.text,
            fontFamily: fontFamilies.body600,
            fontSize: 15,
            height: 56,
          }}
        />
      </View>

      <View style={{ marginTop: 28, gap: 10 }}>
        <View style={{ opacity: !valid || submitting ? 0.5 : 1 }} pointerEvents={!valid || submitting ? 'none' : 'auto'}>
          <GradientButton
            title={submitting ? 'Создаём…' : 'Создать аккаунт'}
            onPress={submit}
            rightIcon={
              submitting ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <Ionicons name="arrow-forward" size={18} color={colors.text} />
              )
            }
          />
        </View>

        <Pressable
          onPress={onNext}
          style={{
            height: 50,
            borderRadius: radii.md,
            borderWidth: 1,
            borderColor: colors.border,
            backgroundColor: 'transparent',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ color: colors.textSecondary, fontFamily: fontFamilies.body600 }}>
            Продолжить без аккаунта
          </Text>
        </Pressable>

        <Pressable onPress={onBack} style={{ alignItems: 'center', paddingVertical: 8 }}>
          <Text style={{ color: colors.textMuted, fontFamily: fontFamilies.body }}>Назад</Text>
        </Pressable>
      </View>
    </StepShell>
  );
}

function FinishStep({ onStart }: { onStart: () => void }) {
  return (
    <StepShell>
      <View style={{ alignItems: 'center', marginTop: 12 }}>
        <Animated.View entering={FadeIn.duration(600)}>
          <LinearGradient
            colors={['rgba(177,78,255,0.35)', 'rgba(255,63,203,0.15)', 'rgba(0,0,0,0)']}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{ width: 220, height: 220, borderRadius: 999, alignItems: 'center', justifyContent: 'center' }}
          >
            <Ionicons name="sparkles" size={64} color={colors.purpleLight} />
          </LinearGradient>
        </Animated.View>
      </View>
      <HeadingBig>Профиль готов!</HeadingBig>
      <Text style={{ marginTop: 8, color: colors.textSecondary, fontFamily: fontFamilies.body }}>
        Подобрали программу и план питания под твою цель и уровень.
      </Text>
      <View style={{ marginTop: 28 }}>
        <GradientButton
          title="К приложению"
          onPress={onStart}
          rightIcon={<Ionicons name="arrow-forward" size={18} color={colors.text} />}
        />
      </View>
    </StepShell>
  );
}
