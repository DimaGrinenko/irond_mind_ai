import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import React, { useRef } from 'react';
import { PanResponder, View } from 'react-native';
import { CommonActions } from '@react-navigation/native';
import { colors } from '../theme/tokens';
import { HomeScreen } from '../screens/HomeScreen';
import { ProgramsScreen } from '../screens/ProgramsScreen';
import { AiTrainerScreen } from '../screens/AiTrainerScreen';
import { AnalyticsScreen } from '../screens/AnalyticsScreen';
import { ProfileScreen } from '../screens/ProfileScreen';
import { CustomTabBar } from '../components/layout/CustomTabBar';
import { useUserStore } from '../store/userStore';

type TabsParamList = {
  Home: undefined;
  Programs: undefined;
  AiTrainer: undefined;
  Analytics: undefined;
  Profile: undefined;
};

const ORDER: (keyof TabsParamList)[] = ['Home', 'Programs', 'AiTrainer', 'Analytics', 'Profile'];

const Tab = createBottomTabNavigator<TabsParamList>();

/**
 * Обёртка над одним экраном: PanResponder ловит горизонтальные свайпы и переключает таб.
 * Срабатывает только если жест явно горизонтальный (dx > 2x dy и > 50px), чтобы не мешать вертикальному скроллу.
 */
function withSwipe<T extends { navigation: any; route: any }>(Comp: React.ComponentType<any>) {
  return function Wrapped(props: T) {
    const { navigation, route } = props;
    const swipeRef = useRef(false);
    const responder = useRef(
      PanResponder.create({
        onMoveShouldSetPanResponder: (_, g) => {
          // Только горизонтальный жест и большой дистанции
          return Math.abs(g.dx) > 30 && Math.abs(g.dx) > Math.abs(g.dy) * 2.2;
        },
        onPanResponderGrant: () => { swipeRef.current = false; },
        onPanResponderRelease: (_, g) => {
          if (swipeRef.current) return;
          if (Math.abs(g.dx) < 60) return;
          const idx = ORDER.indexOf(route.name);
          if (idx < 0) return;
          let next = idx;
          if (g.dx < 0 && idx < ORDER.length - 1) next = idx + 1;
          if (g.dx > 0 && idx > 0) next = idx - 1;
          if (next !== idx) {
            swipeRef.current = true;
            navigation.dispatch(CommonActions.navigate({ name: ORDER[next] }));
          }
        },
      }),
    ).current;

    return (
      <View {...responder.panHandlers} style={{ flex: 1 }}>
        <Comp {...props} />
      </View>
    );
  };
}

const HomeWithSwipe = withSwipe(HomeScreen);
const ProgramsWithSwipe = withSwipe(ProgramsScreen);
const AiTrainerWithSwipe = withSwipe(AiTrainerScreen);
const AnalyticsWithSwipe = withSwipe(AnalyticsScreen);
const ProfileWithSwipe = withSwipe(ProfileScreen);

export function RootTabs() {
  const currentProgramId = useUserStore((s) => s.currentProgramId);
  // Если программа не выбрана — после онбординга открываем сразу Programs
  const initialRouteName = currentProgramId ? 'Home' : 'Programs';
  return (
    <Tab.Navigator
      initialRouteName={initialRouteName}
      screenOptions={{
        headerShown: false,
        sceneStyle: { backgroundColor: colors.bg },
      }}
      tabBar={(props) => <CustomTabBar {...props} />}
    >
      <Tab.Screen name="Home" component={HomeWithSwipe} options={{ title: 'Главная' }} />
      <Tab.Screen name="Programs" component={ProgramsWithSwipe} options={{ title: 'Программы' }} />
      <Tab.Screen name="AiTrainer" component={AiTrainerWithSwipe} options={{ title: 'AI' }} />
      <Tab.Screen name="Analytics" component={AnalyticsWithSwipe} options={{ title: 'Аналитика' }} />
      <Tab.Screen name="Profile" component={ProfileWithSwipe} options={{ title: 'Профиль' }} />
    </Tab.Navigator>
  );
}

