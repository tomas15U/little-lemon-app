import { useFonts } from 'expo-font';
import { DarkTheme, DefaultTheme, Stack, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import { useUserSession, UserSessionProvider } from '@/context/user-session-context';

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  return (
    <UserSessionProvider>
      <RootNavigator />
    </UserSessionProvider>
  );
}

function RootNavigator() {
  const colorScheme = useColorScheme();
  const [fontsLoaded] = useFonts({
    'Karla-Regular': require('@/assets/fonts/Karla-Regular.ttf'),
    'MarkaziText-Regular': require('@/assets/fonts/MarkaziText-Regular.ttf'),
  });
  const { isLoading: isSessionLoading, isOnboardingCompleted } = useUserSession();

  if (!fontsLoaded || isSessionLoading) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <AnimatedSplashOverlay />
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Protected guard={!isOnboardingCompleted}>
          <Stack.Screen name="index" />
        </Stack.Protected>
        <Stack.Protected guard={isOnboardingCompleted}>
          <Stack.Screen name="home" />
          <Stack.Screen name="profile" />
        </Stack.Protected>
      </Stack>
    </ThemeProvider>
  );
}
