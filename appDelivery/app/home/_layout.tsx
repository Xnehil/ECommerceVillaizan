import React, { useEffect, useRef, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, Tabs } from "expo-router";
import Colors from "@/constants/Colors";
import { useColorScheme } from "@/components/useColorScheme";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import StyledIcon from "@/components/StyledIcon";
import * as Location from "expo-location";
import { View } from "react-native";
import WebSocketComponent, {
  WebSocketComponentRef,
} from "@/components/websocket";

export default function TabLayout() {
  const colorScheme = useColorScheme();
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
      console.log("No se pudo enviar la ubicación o el WebSocket no está listo");
    }
  };

  useEffect(() => {
    const getLocation = async () => {
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

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
        tabBarStyle: {
          height: 70,
          paddingBottom: 10, 
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          headerRight: () => (
            <View style={{ padding: 10 }}>
              <Link href="/">
                <StyledIcon
                  name="sign-out"
                  color={"black"}
                  IconComponent={FontAwesome}
                />
              </Link>
              <WebSocketComponent
                idMotorizado="mot_01J97FH8NJWHKNFX26KZ048KTX"
                ref={wsRef}
              />
            </View>
          ),
          tabBarIcon: ({ color }) => (
            <StyledIcon name="home" color={color} IconComponent={FontAwesome} />
          ),
          tabBarLabelPosition: "below-icon",
        }}
      />

      <Tabs.Screen
        name="deliverys"
        options={{
          title: "Entregas",
          tabBarIcon: ({ color }) => (
            <StyledIcon
              name="solution1"
              color={color}
              IconComponent={AntDesign}
            />
          ),
          tabBarLabelPosition: "below-icon",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color }) => (
            <StyledIcon
              name="settings"
              color={color}
              IconComponent={Ionicons}
            />
          ),
          tabBarLabelPosition: "below-icon",
        }}
      />

      <Tabs.Screen
        name="notifications"
        options={{
          title: "Notificaciones",
          tabBarIcon: ({ color }) => (
            <StyledIcon
              name="notifications"
              color={color}
              IconComponent={Ionicons}
            />
          ),
          tabBarLabelPosition: "below-icon",
        }}
      />
    </Tabs>
  );
}
