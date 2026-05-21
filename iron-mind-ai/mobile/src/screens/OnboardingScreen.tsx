import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Modal,
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
import Animated, {
  FadeIn,
  FadeInDown,
  FadeInUp,
  FadeOut,
} from 'react-native-reanimated';
import { colors, radii, spacing } from '../theme/tokens';
import { useTheme } from '../theme/useTheme';
import { fontFamilies } from '../theme/typography';
import { GradientButton } from '../components/common/GradientButton';
import { CyberAthlete } from '../components/anatomy/CyberAthlete';
import { Particles } from '../components/anim/Particles';
import {
  type ActivityLevel,
  type FitnessGoalKey,
  type FitnessLevel,
  type Gender,
  useUserStore,
} from '../store/userStore';
import { useAuthStore } from '../store/authStore';
import {
  ApiError,
  api,
  type OnboardingPlan,
  type OnboardingPayload,
} from '../api/client';
import { t, useLang, goalLabel } from '../i18n';

function goals() {
  return [
    {
      key: 'mass' as const,
      title: t('goal.mass'),
      subtitle: t('goal.mass.sub'),
      icon: 'barbell' as const,
    },
    {
      key: 'cut' as const,
      title: t('goal.cut'),
      subtitle: t('goal.cut.sub'),
      icon: 'flame' as const,
    },
    {
      key: 'strength' as const,
      title: t('goal.strength'),
      subtitle: t('goal.strength.sub'),
      icon: 'flash' as const,
    },
    {
      key: 'endurance' as const,
      title: t('goal.endurance'),
      subtitle: t('goal.endurance.sub'),
      icon: 'pulse' as const,
    },
    {
      key: 'abs' as const,
      title: t('goal.abs'),
      subtitle: t('goal.abs.sub'),
      icon: 'fitness' as const,
    },
  ];
}
function levels() {
  return [
    {
      key: 'beginner' as const,
      title: t('level.beginner'),
      subtitle: t('level.beginner.sub'),
    },
    {
      key: 'intermediate' as const,
      title: t('level.intermediate'),
      subtitle: t('level.intermediate.sub'),
    },
    {
      key: 'advanced' as const,
      title: t('level.advanced'),
      subtitle: t('level.advanced.sub'),
    },
  ];
}
function activities() {
  return [
    {
      key: 'sedentary' as const,
      title: t('activity.sedentary'),
      subtitle: t('activity.sedentary.sub'),
      icon: 'cafe' as const,
    },
    {
      key: 'light' as const,
      title: t('activity.light'),
      subtitle: t('activity.light.sub'),
      icon: 'walk' as const,
    },
    {
      key: 'moderate' as const,
      title: t('activity.moderate'),
      subtitle: t('activity.moderate.sub'),
      icon: 'bicycle' as const,
    },
    {
      key: 'active' as const,
      title: t('activity.active'),
      subtitle: t('activity.active.sub'),
      icon: 'flame' as const,
    },
    {
      key: 'very_active' as const,
      title: t('activity.very_active'),
      subtitle: t('activity.very_active.sub'),
      icon: 'flash' as const,
    },
  ];
}
function genders() {
  return [
    { key: 'male' as const, title: t('gender.male'), icon: 'male' as const },
    {
      key: 'female' as const,
      title: t('gender.female'),
      icon: 'female' as const,
    },
    {
      key: 'other' as const,
      title: t('gender.other'),
      icon: 'person' as const,
    },
  ];
}

type Step =
  | 'welcome'
  | 'name'
  | 'gender'
  | 'metrics'
  | 'activity'
  | 'goal'
  | 'level'
  | 'summary'
  | 'account'
  | 'finish';

// GOALS/LEVELS/ACTIVITIES/GENDERS теперь живут в функциях goals()/levels()/activities()/genders() выше

const ORDER: Step[] = [
  'welcome',
  'name',
  'gender',
  'metrics',
  'activity',
  'goal',
  'level',
  'summary',
  'account',
  'finish',
];

export function OnboardingScreen() {
  const [step, setStep] = useState<Step>('welcome');
  const [loginVisible, setLoginVisible] = useState(false);
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
        <View
          style={{ paddingTop: insets.top + 12, paddingHorizontal: spacing.lg }}
        >
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
          contentContainerStyle={{
            paddingHorizontal: spacing.lg,
            paddingBottom: 40,
          }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {step === 'welcome' && (
            <WelcomeStep
              onNext={() => goNext('name')}
              onLogin={() => setLoginVisible(true)}
            />
          )}

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
              onNext={() => goNext('activity')}
            />
          )}

          {step === 'activity' && (
            <ActivityStep
              value={u.activityLevel}
              onChange={u.setActivityLevel}
              onBack={() => goNext('metrics')}
              onNext={() => goNext('goal')}
            />
          )}

          {step === 'goal' && (
            <GoalStep
              value={u.goalKey}
              onChange={(g) => u.setGoal(g.title, g.key)}
              onBack={() => goNext('activity')}
              onNext={() => goNext('level')}
            />
          )}

          {step === 'level' && (
            <LevelStep
              value={u.level}
              onChange={u.setLevel}
              onBack={() => goNext('goal')}
              onNext={() => goNext('summary')}
            />
          )}

          {step === 'summary' && (
            <SummaryStep
              onBack={() => goNext('level')}
              onNext={() => goNext('account')}
            />
          )}

          {step === 'account' && (
            <AccountStep
              onBack={() => goNext('summary')}
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

      <LoginModal
        visible={loginVisible}
        onClose={() => setLoginVisible(false)}
        onSuccess={() => setLoginVisible(false)}
      />
    </View>
  );
}

function LoginModal({
  visible,
  onClose,
  onSuccess,
}: {
  visible: boolean;
  onClose: () => void;
  onSuccess: () => void;
}) {
  const auth = useAuthStore();
  const u = useUserStore();
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (visible) {
      setEmail('');
      setPassword('');
      setError(null);
    }
  }, [visible]);

  const onSubmit = async () => {
    if (!/\S+@\S+\.\S+/.test(email) || password.length < 6) {
      setError(t('onb.errEmailPw'));
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      const user = await auth.login(email.trim(), password);
      // Подтягиваем профиль в userStore
      u.setId(user.id);
      if (user.name) u.setName(user.name);
      if (user.gender) u.setGender(user.gender.toLowerCase() as Gender);
      if (user.age) u.setAge(user.age);
      if (user.heightCm) u.setHeight(user.heightCm);
      if (user.weightKg) u.setWeight(user.weightKg);
      if (user.level) u.setLevel(user.level.toLowerCase() as FitnessLevel);
      if (user.activityLevel)
        u.setActivityLevel(user.activityLevel.toLowerCase() as ActivityLevel);
      if (user.goal)
        u.setGoal(
          user.goal,
          user.goalKey ? (user.goalKey.toLowerCase() as FitnessGoalKey) : null,
        );
      u.setProgram(user.currentProgramId ?? null, user.programWeek ?? 1);
      if (user.dailyCaloriesGoal) {
        u.setNutritionGoals({
          dailyCaloriesGoal: user.dailyCaloriesGoal,
          dailyProteinGoal: user.dailyProteinGoal,
          dailyFatsGoal: user.dailyFatsGoal,
          dailyCarbsGoal: user.dailyCarbsGoal,
        });
      }
      // Если у юзера уже завершён онбординг — пропускаем сразу в RootTabs
      if (user.onboardingCompleted) {
        u.completeOnboarding();
      }
      onSuccess();
    } catch (e) {
      setError(e instanceof ApiError ? e.message : t('onb.errLoginFailed'));
    } finally {
      setSubmitting(false);
    }
  };

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
          backgroundColor: 'rgba(0,0,0,0.78)',
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
            paddingBottom: 32,
            gap: 14,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text
              style={{
                flex: 1,
                color: colors.text,
                fontFamily: fontFamilies.heading,
                fontSize: 22,
              }}
            >
              {t('onboarding.login')}
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
            }}
          >
            {t('onboarding.loginHint')}
          </Text>

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
              value={email}
              onChangeText={setEmail}
              placeholder={t('onboarding.loginEmail')}
              placeholderTextColor={colors.textMuted}
              autoCapitalize="none"
              keyboardType="email-address"
              style={{
                color: colors.text,
                fontFamily: fontFamilies.body600,
                fontSize: 15,
                height: 50,
              }}
            />
          </View>
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
              value={password}
              onChangeText={setPassword}
              placeholder={t('onboarding.loginPassword')}
              placeholderTextColor={colors.textMuted}
              secureTextEntry
              style={{
                color: colors.text,
                fontFamily: fontFamilies.body600,
                fontSize: 15,
                height: 50,
              }}
            />
          </View>

          {error ? (
            <Text
              style={{
                color: colors.red,
                fontFamily: fontFamilies.body600,
                fontSize: 12,
              }}
            >
              {error}
            </Text>
          ) : null}

          <GradientButton
            title={
              submitting
                ? t('onboarding.loginSubmitting')
                : t('onboarding.loginSubmit')
            }
            disabled={submitting}
            onPress={onSubmit}
            rightIcon={
              submitting ? (
                <ActivityIndicator color={colors.text} />
              ) : (
                <Ionicons name="log-in" size={18} color={colors.text} />
              )
            }
          />
        </View>
      </View>
    </Modal>
  );
}

function ProgressBar({ value, total }: { value: number; total: number }) {
  const theme = useTheme();
  const pct = Math.max(0, Math.min(1, value / total));
  return (
    <View
      style={{
        marginTop: 18,
        height: 4,
        borderRadius: 999,
        backgroundColor: 'rgba(255,255,255,0.08)',
        overflow: 'hidden',
      }}
    >
      <Animated.View
        entering={FadeIn.duration(180)}
        style={{ width: `${pct * 100}%`, height: '100%' }}
      >
        <LinearGradient
          colors={theme.gradientPrimary as any}
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
    <Animated.View
      entering={FadeInDown.duration(360)}
      exiting={FadeOut.duration(160)}
    >
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

function NavRow({
  onBack,
  onNext,
  nextLabel = t('common.next'),
  disabled,
}: {
  onBack?: () => void;
  onNext?: () => void;
  nextLabel?: string;
  disabled?: boolean;
}) {
  return (
    <View
      style={{
        marginTop: 28,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
      }}
    >
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
      <View
        style={{ flex: 1, opacity: disabled ? 0.5 : 1 }}
        pointerEvents={disabled ? 'none' : 'auto'}
      >
        {onNext ? (
          <GradientButton
            title={nextLabel}
            onPress={onNext}
            rightIcon={
              <Ionicons name="arrow-forward" size={18} color={colors.text} />
            }
          />
        ) : null}
      </View>
    </View>
  );
}

function WelcomeStep({
  onNext,
  onLogin,
}: {
  onNext: () => void;
  onLogin: () => void;
}) {
  useLang(); // re-render on lang change
  const theme = useTheme();
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
        {t('onboarding.welcomeTitle')}
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
        {t('onboarding.welcomeSub')}
      </Animated.Text>
      <View style={{ marginTop: 36 }}>
        <GradientButton
          title={t('onboarding.welcomeStart')}
          onPress={onNext}
          rightIcon={
            <Ionicons name="arrow-forward" size={18} color={colors.text} />
          }
        />
      </View>
      <View style={{ marginTop: 14, alignItems: 'center', gap: 6 }}>
        <Text
          style={{
            color: colors.textMuted,
            fontFamily: fontFamilies.body,
            fontSize: 12,
          }}
        >
          {t('onboarding.welcomeTime')}
        </Text>
        <Pressable onPress={onLogin} hitSlop={10} style={{ marginTop: 8 }}>
          <Text
            style={{
              color: theme.accentLight,
              fontFamily: fontFamilies.body700,
              fontSize: 13,
            }}
          >
            {t('onboarding.haveAccount')}
          </Text>
        </Pressable>
      </View>
    </StepShell>
  );
}

function NameStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: string;
  onChange: (v: string) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const ok = value.trim().length >= 2;
  return (
    <StepShell>
      <HeadingSmall>{t('onb.step1of7')}</HeadingSmall>
      <HeadingBig>{t('onb.nameQ')}</HeadingBig>
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: fontFamilies.body,
          marginTop: 8,
        }}
      >
        {t('onb.nameHint')}
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
          placeholder={t('onb.namePh')}
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

function GenderStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: Gender | null;
  onChange: (v: Gender) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const theme = useTheme();
  return (
    <StepShell>
      <HeadingSmall>{t('onb.step2of7')}</HeadingSmall>
      <HeadingBig>{t('onb.genderQ')}</HeadingBig>
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: fontFamilies.body,
          marginTop: 8,
        }}
      >
        {t('onb.genderHint')}
      </Text>

      <View style={{ marginTop: 24, gap: 12 }}>
        {genders().map((g) => {
          const active = value === g.key;
          return (
            <Pressable key={g.key} onPress={() => onChange(g.key)}>
              <LinearGradient
                colors={
                  active
                    ? ([
                        'rgba(123,63,228,0.35)',
                        'rgba(177,78,255,0.18)',
                      ] as any)
                    : ([
                        'rgba(255,255,255,0.02)',
                        'rgba(255,255,255,0.02)',
                      ] as any)
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: radii.lg,
                  borderWidth: 1,
                  borderColor: active ? theme.accentLight : colors.border,
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
                    borderColor: active ? theme.accentLight : colors.border,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Ionicons
                    name={g.icon}
                    size={20}
                    color={active ? theme.accentLight : colors.text}
                  />
                </View>
                <Text
                  style={{
                    flex: 1,
                    color: colors.text,
                    fontFamily: fontFamilies.body700,
                    fontSize: 16,
                  }}
                >
                  {g.title}
                </Text>
                {active ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={theme.accentLight}
                  />
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
  const ok =
    age && age > 0 && heightCm && heightCm > 0 && weightKg && weightKg > 0;
  return (
    <StepShell>
      <HeadingSmall>{t('onb.step3of7')}</HeadingSmall>
      <HeadingBig>{t('onb.metricsQ')}</HeadingBig>
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: fontFamilies.body,
          marginTop: 8,
        }}
      >
        {t('onb.metricsLocalHint')}
      </Text>

      <View style={{ marginTop: 24, gap: 12 }}>
        <NumericRow
          label={t('onb.age')}
          unit={t('common.years')}
          value={age}
          onChange={setAge}
          placeholder="25"
          maxLength={3}
        />
        <NumericRow
          label={t('onb.heightShort')}
          unit={t('common.cm')}
          value={heightCm}
          onChange={setHeight}
          placeholder="180"
          maxLength={3}
        />
        <NumericRow
          label={t('onb.weightShort')}
          unit={t('common.kg')}
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
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: fontFamilies.body500,
          width: 80,
        }}
      >
        {label}
      </Text>
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
      <Text
        style={{
          marginLeft: 8,
          color: colors.textMuted,
          fontFamily: fontFamilies.body500,
        }}
      >
        {unit}
      </Text>
    </View>
  );
}

function GoalStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: FitnessGoalKey | null;
  onChange: (g: { key: FitnessGoalKey; title: string }) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const theme = useTheme();
  return (
    <StepShell>
      <HeadingSmall>{t('onb.step5of7')}</HeadingSmall>
      <HeadingBig>{t('onb.goalQ')}</HeadingBig>
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: fontFamilies.body,
          marginTop: 8,
        }}
      >
        {t('onb.goalLocalHint')}
      </Text>

      <View style={{ marginTop: 24, gap: 10 }}>
        {goals().map((g) => {
          const active = value === g.key;
          return (
            <Pressable
              key={g.key}
              onPress={() => onChange({ key: g.key, title: g.title })}
            >
              <LinearGradient
                colors={
                  active
                    ? ([
                        'rgba(123,63,228,0.35)',
                        'rgba(255,63,203,0.18)',
                      ] as any)
                    : ([
                        'rgba(255,255,255,0.02)',
                        'rgba(255,255,255,0.02)',
                      ] as any)
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: radii.lg,
                  borderWidth: 1,
                  borderColor: active ? theme.accentLight : colors.border,
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
                    borderColor: active ? theme.accentLight : colors.border,
                  }}
                >
                  <Ionicons
                    name={g.icon}
                    size={20}
                    color={active ? theme.accentLight : colors.text}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: fontFamilies.body700,
                      fontSize: 15,
                    }}
                  >
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
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={theme.accentLight}
                  />
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

function LevelStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: FitnessLevel | null;
  onChange: (v: FitnessLevel) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const theme = useTheme();
  return (
    <StepShell>
      <HeadingSmall>{t('onb.step6of7')}</HeadingSmall>
      <HeadingBig>{t('onb.levelQ')}</HeadingBig>
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: fontFamilies.body,
          marginTop: 8,
        }}
      >
        {t('onb.levelLocalHint')}
      </Text>

      <View style={{ marginTop: 24, gap: 12 }}>
        {levels().map((l) => {
          const active = value === l.key;
          return (
            <Pressable key={l.key} onPress={() => onChange(l.key)}>
              <LinearGradient
                colors={
                  active
                    ? ([
                        'rgba(123,63,228,0.35)',
                        'rgba(177,78,255,0.18)',
                      ] as any)
                    : ([
                        'rgba(255,255,255,0.02)',
                        'rgba(255,255,255,0.02)',
                      ] as any)
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: radii.lg,
                  borderWidth: 1,
                  borderColor: active ? theme.accentLight : colors.border,
                  padding: 16,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: fontFamilies.body700,
                      fontSize: 16,
                    }}
                  >
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
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={theme.accentLight}
                  />
                ) : null}
              </LinearGradient>
            </Pressable>
          );
        })}
      </View>

      <NavRow
        onBack={onBack}
        onNext={onNext}
        nextLabel={t('onb.finish')}
        disabled={!value}
      />
    </StepShell>
  );
}

function buildOnboardingPayload(
  u: ReturnType<typeof useUserStore.getState>,
): OnboardingPayload | null {
  if (
    !u.gender ||
    !u.age ||
    !u.heightCm ||
    !u.weightKg ||
    !u.activityLevel ||
    !u.goalKey
  )
    return null;
  return {
    gender: u.gender.toUpperCase() as OnboardingPayload['gender'],
    age: u.age,
    heightCm: u.heightCm,
    weightKg: u.weightKg,
    activityLevel:
      u.activityLevel.toUpperCase() as OnboardingPayload['activityLevel'],
    goalKey: u.goalKey.toUpperCase() as OnboardingPayload['goalKey'],
    level: u.level
      ? (u.level.toUpperCase() as OnboardingPayload['level'])
      : undefined,
    name: u.name || undefined,
  };
}

function AccountStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
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
      const payload = buildOnboardingPayload(u);
      if (payload) {
        try {
          const { user, plan } = await api.onboarding.complete(payload);
          u.setId(user.id);
          // Программу НЕ назначаем — пользователь выберет сам после онбординга
          u.setProgram(null, 1);
          u.setNutritionGoals({
            dailyCaloriesGoal: plan.dailyCalories,
            dailyProteinGoal: plan.proteinG,
            dailyFatsGoal: plan.fatsG,
            dailyCarbsGoal: plan.carbsG,
          });
        } catch {
          // best-effort: профиль локально уже сохранён
        }
      }
      onNext();
    } catch (e) {
      // ApiError = сервер ответил ошибкой; иначе fetch бросил TypeError — сеть/сервер недоступны.
      const msg = e instanceof ApiError ? e.message : t('onb.errServerDown');
      Alert.alert(t('onb.errTitle'), msg, [
        { text: t('onb.retry'), style: 'cancel' },
        { text: t('onb.continueLocally'), onPress: onNext },
      ]);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <StepShell>
      <HeadingSmall>{t('onb.step7of7')}</HeadingSmall>
      <HeadingBig>{t('onb.accountQ')}</HeadingBig>
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: fontFamilies.body,
          marginTop: 8,
        }}
      >
        {t('onb.accountHint')}
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
          placeholder={t('onb.email')}
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
          placeholder={t('onb.password')}
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
        <View
          style={{ opacity: !valid || submitting ? 0.5 : 1 }}
          pointerEvents={!valid || submitting ? 'none' : 'auto'}
        >
          <GradientButton
            title={submitting ? t('onb.creating') : t('onb.createAccount')}
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
          <Text
            style={{
              color: colors.textSecondary,
              fontFamily: fontFamilies.body600,
            }}
          >
            {t('onb.continueNoAcc')}
          </Text>
        </Pressable>

        <Pressable
          onPress={onBack}
          style={{ alignItems: 'center', paddingVertical: 8 }}
        >
          <Text
            style={{ color: colors.textMuted, fontFamily: fontFamilies.body }}
          >
            {t('onb.back')}
          </Text>
        </Pressable>
      </View>
    </StepShell>
  );
}

function ActivityStep({
  value,
  onChange,
  onBack,
  onNext,
}: {
  value: ActivityLevel | null;
  onChange: (v: ActivityLevel) => void;
  onBack: () => void;
  onNext: () => void;
}) {
  const theme = useTheme();
  return (
    <StepShell>
      <HeadingSmall>{t('onb.step4of7')}</HeadingSmall>
      <HeadingBig>{t('onb.activityQ')}</HeadingBig>
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: fontFamilies.body,
          marginTop: 8,
        }}
      >
        {t('onb.activityHint')}
      </Text>

      <View style={{ marginTop: 24, gap: 10 }}>
        {activities().map((a) => {
          const active = value === a.key;
          return (
            <Pressable key={a.key} onPress={() => onChange(a.key)}>
              <LinearGradient
                colors={
                  active
                    ? ([
                        'rgba(123,63,228,0.35)',
                        'rgba(255,63,203,0.18)',
                      ] as any)
                    : ([
                        'rgba(255,255,255,0.02)',
                        'rgba(255,255,255,0.02)',
                      ] as any)
                }
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={{
                  borderRadius: radii.lg,
                  borderWidth: 1,
                  borderColor: active ? theme.accentLight : colors.border,
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
                    borderColor: active ? theme.accentLight : colors.border,
                  }}
                >
                  <Ionicons
                    name={a.icon}
                    size={20}
                    color={active ? theme.accentLight : colors.text}
                  />
                </View>
                <View style={{ flex: 1 }}>
                  <Text
                    style={{
                      color: colors.text,
                      fontFamily: fontFamilies.body700,
                      fontSize: 15,
                    }}
                  >
                    {a.title}
                  </Text>
                  <Text
                    style={{
                      color: colors.textSecondary,
                      fontFamily: fontFamilies.body,
                      fontSize: 12,
                      marginTop: 2,
                    }}
                  >
                    {a.subtitle}
                  </Text>
                </View>
                {active ? (
                  <Ionicons
                    name="checkmark-circle"
                    size={22}
                    color={theme.accentLight}
                  />
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

function SummaryStep({
  onBack,
  onNext,
}: {
  onBack: () => void;
  onNext: () => void;
}) {
  const theme = useTheme();
  const u = useUserStore();
  const [plan, setPlan] = useState<OnboardingPlan | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  React.useEffect(() => {
    const payload = buildOnboardingPayload(u);
    if (!payload) {
      setError(t('onb.errNoData'));
      setLoading(false);
      return;
    }
    // Локальный расчёт чтобы экран работал и без сети.
    const local = calculatePlanLocally(payload);
    setPlan(local);
    setLoading(false);

    // Параллельно пробуем точный расчёт с бэкенда.
    api.onboarding
      .preview(payload)
      .then((p) => setPlan(p))
      .catch(() => {
        // оставляем локальный расчёт
      });
  }, []);

  return (
    <StepShell>
      <HeadingSmall>{t('onb.summaryQ').toUpperCase()}</HeadingSmall>
      <HeadingBig>{t('onb.summaryHint')}</HeadingBig>
      <Text
        style={{
          color: colors.textSecondary,
          fontFamily: fontFamilies.body,
          marginTop: 8,
        }}
      >
        {t('onb.summaryLocalHint')}
      </Text>

      {loading ? (
        <View style={{ marginTop: 40, alignItems: 'center' }}>
          <ActivityIndicator color={theme.accentLight} />
        </View>
      ) : error ? (
        <View style={{ marginTop: 40 }}>
          <Text style={{ color: colors.textSecondary }}>{error}</Text>
        </View>
      ) : plan ? (
        <View style={{ marginTop: 24, gap: 12 }}>
          <SummaryCard
            title={t('onb.dailyCalories')}
            value={`${plan.dailyCalories} ${t('common.kcal')}`}
            subtitle={`BMR ${plan.bmr} → TDEE ${plan.tdee}${
              plan.surplusOrDeficit !== 0
                ? ` ${plan.surplusOrDeficit > 0 ? '+' : ''}${plan.surplusOrDeficit}`
                : ''
            }`}
            icon="flame"
          />
          <View style={{ flexDirection: 'row', gap: 10 }}>
            <SummaryCard
              small
              title={t('onb.protein')}
              value={`${plan.proteinG} ${t('common.gram')}`}
              icon="barbell"
            />
            <SummaryCard
              small
              title={t('onb.fats')}
              value={`${plan.fatsG} ${t('common.gram')}`}
              icon="water"
            />
            <SummaryCard
              small
              title={t('onb.carbs')}
              value={`${plan.carbsG} ${t('common.gram')}`}
              icon="leaf"
            />
          </View>
          <SummaryCard
            title={t('onb.program')}
            value={plan.goalLabel}
            subtitle={`ID: ${plan.programId}`}
            icon="fitness"
          />
        </View>
      ) : null}

      <NavRow
        onBack={onBack}
        onNext={onNext}
        nextLabel={t('common.continue')}
      />
    </StepShell>
  );
}

function SummaryCard({
  title,
  value,
  subtitle,
  icon,
  small,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: keyof typeof Ionicons.glyphMap;
  small?: boolean;
}) {
  const theme = useTheme();
  return (
    <LinearGradient
      colors={['rgba(123,63,228,0.18)', 'rgba(255,63,203,0.08)']}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={{
        flex: small ? 1 : undefined,
        borderRadius: radii.lg,
        borderWidth: 1,
        borderColor: colors.border,
        padding: small ? 12 : 16,
      }}
    >
      <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10 }}>
        <Ionicons
          name={icon}
          size={small ? 16 : 20}
          color={theme.accentLight}
        />
        <Text
          style={{
            color: colors.textSecondary,
            fontFamily: fontFamilies.body500,
            fontSize: small ? 11 : 12,
            letterSpacing: 0.8,
            textTransform: 'uppercase',
          }}
        >
          {title}
        </Text>
      </View>
      <Text
        style={{
          marginTop: small ? 6 : 8,
          color: colors.text,
          fontFamily: fontFamilies.heading,
          fontSize: small ? 18 : 26,
        }}
      >
        {value}
      </Text>
      {subtitle ? (
        <Text
          style={{
            marginTop: 4,
            color: colors.textMuted,
            fontFamily: fontFamilies.body,
            fontSize: 11,
          }}
        >
          {subtitle}
        </Text>
      ) : null}
    </LinearGradient>
  );
}

function calculatePlanLocally(p: OnboardingPayload): OnboardingPlan {
  const base = 10 * p.weightKg + 6.25 * p.heightCm - 5 * p.age;
  const bmr = Math.round(
    p.gender === 'MALE'
      ? base + 5
      : p.gender === 'FEMALE'
        ? base - 161
        : base - 78,
  );
  const mult: Record<OnboardingPayload['activityLevel'], number> = {
    SEDENTARY: 1.2,
    LIGHT: 1.375,
    MODERATE: 1.55,
    ACTIVE: 1.725,
    VERY_ACTIVE: 1.9,
  };
  const tdee = Math.round(bmr * mult[p.activityLevel]);
  const goalAdj: Record<OnboardingPayload['goalKey'], number> = {
    MASS: 0.1,
    CUT: -0.2,
    STRENGTH: 0.05,
    ENDURANCE: 0,
    ABS: -0.1,
  };
  const surplusOrDeficit = Math.round(tdee * goalAdj[p.goalKey]);
  const dailyCalories = tdee + surplusOrDeficit;
  const proteinPerKg = p.goalKey === 'CUT' || p.goalKey === 'ABS' ? 2.2 : 1.8;
  const proteinG = Math.round(p.weightKg * proteinPerKg);
  const fatsG = Math.round(p.weightKg * 0.9);
  const carbsG = Math.max(
    0,
    Math.round((dailyCalories - proteinG * 4 - fatsG * 9) / 4),
  );
  const programMap: Record<OnboardingPayload['goalKey'], string> = {
    MASS: 'mass',
    CUT: 'relief',
    STRENGTH: 'strength',
    ENDURANCE: 'endurance',
    ABS: 'abs',
  };
  return {
    bmr,
    tdee,
    dailyCalories,
    proteinG,
    fatsG,
    carbsG,
    surplusOrDeficit,
    programId: programMap[p.goalKey],
    goalLabel: goalLabel(p.goalKey),
  };
}

function FinishStep({ onStart }: { onStart: () => void }) {
  const theme = useTheme();
  return (
    <StepShell>
      <View style={{ alignItems: 'center', marginTop: 12 }}>
        <Animated.View entering={FadeIn.duration(600)}>
          <LinearGradient
            colors={[
              'rgba(177,78,255,0.35)',
              'rgba(255,63,203,0.15)',
              'rgba(0,0,0,0)',
            ]}
            start={{ x: 0.5, y: 0 }}
            end={{ x: 0.5, y: 1 }}
            style={{
              width: 220,
              height: 220,
              borderRadius: 999,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Ionicons name="sparkles" size={64} color={theme.accentLight} />
          </LinearGradient>
        </Animated.View>
      </View>
      <HeadingBig>{t('onb.finishQ')}</HeadingBig>
      <Text
        style={{
          marginTop: 8,
          color: colors.textSecondary,
          fontFamily: fontFamilies.body,
        }}
      >
        {t('onb.finishHint')}
      </Text>
      <View style={{ marginTop: 28 }}>
        <GradientButton
          title={t('onb.toApp')}
          onPress={onStart}
          rightIcon={
            <Ionicons name="arrow-forward" size={18} color={colors.text} />
          }
        />
      </View>
    </StepShell>
  );
}
