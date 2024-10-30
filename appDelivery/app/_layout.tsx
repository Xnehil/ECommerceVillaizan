import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import "react-native-reanimated";
import * as Location from "expo-location";
import WebSocketComponent, {
  WebSocketComponentRef,
} from "@/components/websocket";
import { useRef, useState, useEffect } from "react";
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
  const wsRef = useRef<WebSocketComponentRef>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const enviarUbicacion = () => {
    const lat = location?.latitude;
    const lng = location?.longitude;

    if (lat !== undefined && lng !== undefined && wsRef.current) {
      wsRef.current.sendUbicacion(lat, lng);
    } else {
      console.log(
        "No se pudo enviar la ubicación o el WebSocket no está listo"
      );
    }
  };

  useEffect(() => {
    const getLocation = async () => {
      console.log("Obteniendo ubicación...");
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permiso de ubicación denegado");
          return;
        }

        let location_async = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location_async.coords.latitude,
          longitude: location_async.coords.longitude,
        });
      } catch (error) {
        console.log("Error al obtener la ubicación:", error);
      }
    };

    // Obtener la ubicación al cargar el componente
    getLocation();
    // Actualizar la ubicación cada 10 segundos
    const locationInterval = setInterval(getLocation, 10000);

    return () => {
      clearInterval(locationInterval);
    };
  }, []);

  useEffect(() => {
    // Enviar la ubicación cada 10 segundos si está disponible
    const sendInterval = setInterval(enviarUbicacion, 10000);

    return () => {
      clearInterval(sendInterval);
    };
  }, [location]);
  const colorScheme = useColorScheme();

  return (
    <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
      <WebSocketComponent
          idMotorizado="mot_01J97FH8NJWHKNFX26KZ048KTX"
          ref={wsRef}
        />
      <Stack initialRouteName="index">
        
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="home" options={{ headerShown: false }} />
        <Stack.Screen
          name="entregar"
          options={{
            presentation: "card",
            title: "Entregar",
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="inventory"
          options={{
            presentation: "card",
            title: "Actualizar Inventario",
            headerBackVisible: true,
          }}
        />
        <Stack.Screen
          name="confirmada"
          options={{
            presentation: "card",
            title: "Entrega Confirmada",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="cancelada"
          options={{
            presentation: "card",
            title: "Entrega Confirmada",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name="venta"
          options={{
            presentation: "card",
            title: "Venta externa",
            headerShown: true,
          }}
        />
      </Stack>
    </ThemeProvider>
  );
}
