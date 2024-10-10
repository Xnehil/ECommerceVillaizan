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
import { View, Text } from "react-native";
import useWebSocket, { ReadyState } from 'react-use-websocket';
import WebSocketComponent, { WebSocketComponentRef } from "@/components/websocket";

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const wsRef = useRef<WebSocketComponentRef>(null); // Referencia al componente WebSocket
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  // Función para enviar la ubicación usando WebSocket
  const enviarUbicacion = () => {
    if (wsRef.current && location) {
      const { latitude, longitude } = location;
      wsRef.current.sendUbicacion(latitude, longitude); // Envía la ubicación por WebSocket
      console.log("Ubicación enviada:", latitude, longitude);
    } else {
      console.log("No se pudo enviar la ubicación: WebSocket no está listo o la ubicación es nula.");
    }
  };

  // Obtener y actualizar la ubicación cada 10 segundos
  useEffect(() => {
    let isMounted = true;

    const getLocation = async () => {
      try {
        const { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permiso de ubicación denegado");
          return;
        }

        const locationAsync = await Location.getCurrentPositionAsync({});
        if (isMounted) {
          setLocation({
            latitude: locationAsync.coords.latitude,
            longitude: locationAsync.coords.longitude,
          });
        }
      } catch (error) {
        console.error("Error al obtener la ubicación:", error);
      }
    };

    // Llamar la primera vez
    getLocation();
    // Actualizar ubicación cada 10 segundos
    const intervalId = setInterval(() => {
      getLocation();
    }, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId); // Limpiar el intervalo al desmontar el componente
    };
  }, []);

  // Efecto para enviar la ubicación cuando cambia
  useEffect(() => {
    if (location) {
      enviarUbicacion();
    }
  }, [location]);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: false,
        tabBarStyle: {
          height: 70,
          paddingBottom: 10, // Espaciado inferior
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
                  color={'black'}
                  IconComponent={FontAwesome}
                />
              </Link>
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

      {/* Incluye el WebSocketComponent, con su referencia wsRef */}
      <WebSocketComponent idMotorizado="mot_01J97FH8NJWHKNFX26KZ048KTX" ref={wsRef} />
    </Tabs>
  );
}
