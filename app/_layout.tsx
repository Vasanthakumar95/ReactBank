import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { useColorScheme } from '@/hooks/use-color-scheme';

const HEADER_BG = '#1a3c6e';

export default function RootLayout() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack
        initialRouteName="login"
        screenOptions={{
          headerStyle: { backgroundColor: HEADER_BG },
          headerTintColor: '#FFFFFF',
          headerTitleStyle: { fontWeight: '700', fontSize: 18 },
        }}
      >
        <Stack.Screen
          name="login"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="index"
          options={{
            title: 'ReactBank',
            headerBackVisible: false,
          }}
        />
        <Stack.Screen
          name="transaction/[id]"
          options={{ title: 'Transaction Detail' }}
        />
      </Stack>
      <StatusBar style="light" />
    </ThemeProvider>
  );
}
