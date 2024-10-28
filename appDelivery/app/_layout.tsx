import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";

import { useColorScheme } from "@/components/useColorScheme";

export {
  // Catch any errors thrown by the Layout component.
  ErrorBoundary,
} from "expo-router";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [loaded, error] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
    ...FontAwesome.font,
  });

  // Expo Router uses Error Boundaries to catch errors in the navigation tree.
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <Stack initialRouteName="login">
        <Stack.Screen name="login" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen
          name="entregar"
          options={{ presentation: "card", title: "Entregar", headerBackVisible: true }}
        />
        <Stack.Screen
          name="inventory"
          options={{ presentation: "card", title: "Actualizar Inventario", headerBackVisible: true }}
        />
        <Stack.Screen
          name="confirmada"
          options={{presentation: "card",title: "Entrega Confirmada",headerShown: false}}
        />
        <Stack.Screen
          name="cancelada"
          options={{presentation: "card",title: "Entrega Confirmada",headerShown: false,}}
        />
      </Stack>
    </ThemeProvider>
  );
}
