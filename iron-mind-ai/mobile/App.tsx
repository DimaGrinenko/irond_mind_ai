import 'react-native-gesture-handler';
import React from 'react';
import { NavigationContainer, DarkTheme } from '@react-navigation/native';
import { ActivityIndicator, Platform, Text, View } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { colors } from './src/theme/tokens';
import { RootNavigator } from './src/navigation/RootNavigator';
import {
  PhoneFrame,
  WEB_SAFE_AREA_METRICS,
} from './src/components/web/PhoneFrame';
import {
  useFonts as useManrope,
  Manrope_400Regular,
  Manrope_500Medium,
  Manrope_600SemiBold,
  Manrope_700Bold,
} from '@expo-google-fonts/manrope';
import {
  useFonts as useUnbounded,
  Unbounded_700Bold,
} from '@expo-google-fonts/unbounded';
import { initDb } from './src/db/init';
import { useAuthStore } from './src/store/authStore';
import { useAppStreakStore } from './src/store/appStreakStore';
import { useUserStore } from './src/store/userStore';
import { useCycleStore } from './src/store/cycleStore';
import { useLeafEconomyStore } from './src/store/leafEconomyStore';

class ErrorBoundary extends React.Component<
  { children: React.ReactNode },
  { error: unknown }
> {
  state = { error: null as unknown };
  static getDerivedStateFromError(error: unknown) {
    return { error };
  }
  componentDidCatch(error: unknown) {
    // eslint-disable-next-line no-console
    console.error('App crashed:', error);
  }
  render() {
    if (this.state.error) {
      return (
        <View
          style={{
            flex: 1,
            backgroundColor: colors.bg,
            alignItems: 'center',
            justifyContent: 'center',
            padding: 16,
          }}
        >
          <Text style={{ color: colors.text, fontSize: 16, fontWeight: '600' }}>
            Ошибка приложения
          </Text>
          <Text style={{ marginTop: 12, color: 'rgba(255,255,255,0.75)' }}>
            {String(this.state.error)}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

const navTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: colors.bg,
    card: colors.bg,
    text: colors.text,
    border: colors.border,
    primary: colors.purple,
  },
};

export default function App() {
  const [manropeLoaded] = useManrope({
    Manrope_400Regular,
    Manrope_500Medium,
    Manrope_600SemiBold,
    Manrope_700Bold,
  });
  const [unboundedLoaded] = useUnbounded({ Unbounded_700Bold });

  const [dbReady, setDbReady] = React.useState(false);
  const [dbError, setDbError] = React.useState<unknown>(null);
  const hydrateAuth = useAuthStore((s) => s.hydrate);
  const registerOpen = useAppStreakStore((s) => s.registerOpen);

  React.useEffect(() => {
    hydrateAuth()
      .then(() => {
        // Pull server-canonical state once authed (economy drives theme; cycle drives phase banners).
        useLeafEconomyStore.getState().refresh();
        useCycleStore.getState().refresh();
      })
      .catch(() => null);
    // Регистрируем заход — серия дней захода в приложение
    registerOpen();
    // Авто-старт Pro-trial при первом запуске прошедшего онбординг юзера
    const userState = useUserStore.getState();
    if (
      userState.onboardingCompleted &&
      !userState.proTrialEndsAt &&
      userState.subscriptionTier === 'free'
    ) {
      userState.startProTrial(7);
    }
  }, [hydrateAuth, registerOpen]);

  React.useEffect(() => {
    let alive = true;
    if (Platform.OS === 'web') {
      // expo-sqlite is not guaranteed to work on web; do not block UI.
      setDbReady(true);
      return () => {
        alive = false;
      };
    }
    initDb()
      .then(() => {
        if (alive) setDbReady(true);
      })
      .catch((e) => {
        if (alive) setDbError(e);
      });
    return () => {
      alive = false;
    };
  }, []);

  const isWeb = Platform.OS === 'web';
  const initialMetrics = isWeb ? WEB_SAFE_AREA_METRICS : undefined;

  if (!manropeLoaded || !unboundedLoaded || !dbReady) {
    return (
      <SafeAreaProvider initialMetrics={initialMetrics}>
        <StatusBar style="light" />
        <PhoneFrame>
          <View
            style={{
              flex: 1,
              backgroundColor: colors.bg,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <ActivityIndicator color={colors.purple} />
            {dbError ? (
              <Text style={{ marginTop: 12, color: 'rgba(255,255,255,0.7)' }}>
                Ошибка инициализации БД: {String(dbError)}
              </Text>
            ) : null}
          </View>
        </PhoneFrame>
      </SafeAreaProvider>
    );
  }

  return (
    <SafeAreaProvider initialMetrics={initialMetrics}>
      <StatusBar style="light" />
      <PhoneFrame>
        <ErrorBoundary>
          <NavigationContainer theme={navTheme}>
            <RootNavigator />
          </NavigationContainer>
        </ErrorBoundary>
      </PhoneFrame>
    </SafeAreaProvider>
  );
}
