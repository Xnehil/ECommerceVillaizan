import React, { useEffect, useState } from "react";
import FontAwesome from "@expo/vector-icons/FontAwesome";
import AntDesign from "@expo/vector-icons/AntDesign";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, Tabs } from "expo-router";
import { useClientOnlyValue } from "@/components/useClientOnlyValue";
import StyledIcon from "@/components/StyledIcon";
import * as Location from "expo-location";
import { View } from "react-native";
import { Motorizado, Notificacion } from "@/interfaces/interfaces";
import { getMotorizadoData, getUserData } from "@/functions/storage";
import { Badge } from "react-native-elements";
import axios from "axios";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
import {
  useWebSocketContext,
  WebSocketProvider,
} from "@/components/sockets/WebSocketContext";
import {
  NotificationProvider,
  useNotificationContext,
} from "@/components/sockets/notificationContext";
import SendLocationComponent from "@/components/sockets/sendLocation";

export default function TabLayout() {
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [motorizado, setMotorizado] = useState<Motorizado | null>(null);


  // Obtener notificaciones del usuario
  const fetchNotificaciones = async () => {
    try {
      const userData = await getUserData();
      if (!userData) throw new Error("Usuario no encontrado");

      const response = await axios.get(
        `${BASE_URL}/notificacion?id_usuario=${userData.id}`
      );
      const notificacionesData = response.data.notificaciones;
      const unreadCount = notificacionesData.filter(
        (notificacion: Notificacion) => !notificacion.leido
      ).length;

      setNotificationCount(unreadCount);
    } catch (error) {
      console.error("Error al obtener las notificaciones:", error);
    }
  };

  // Manejar datos del motorizado
  useEffect(() => {
    const fetchMotorizadoData = async () => {
      try {
        const data = await getMotorizadoData();
        setMotorizado(data);
      } catch (error) {
        console.log("Error al obtener los datos del motorizado:", error);
      }
    };

    fetchMotorizadoData();
    fetchNotificaciones();

    // Consultar periódicamente
    const motorizadoInterval = setInterval(fetchMotorizadoData, 10000);
    const notificacionesInterval = setInterval(fetchNotificaciones, 1000);

    return () => {
      clearInterval(motorizadoInterval);
      clearInterval(notificacionesInterval);
    };
  }, []);



  return (
    <WebSocketProvider>
      <NotificationProvider>
        <SendLocationComponent />
        <Tabs
          screenOptions={{
            tabBarActiveTintColor: "darkred",
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
                </View>
              ),
              tabBarIcon: ({ color }) => (
                <StyledIcon
                  name="home"
                  color={color}
                  IconComponent={FontAwesome}
                />
              ),
              tabBarLabelPosition: "below-icon",
            }}
          />

          <Tabs.Screen
            name="delivery"
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
              headerShown: false,
            }}
          />
          <Tabs.Screen
            name="settings"
            options={{
              tabBarIcon: ({ color }) => (
                <StyledIcon
                  name="settings"
                  color={color}
                  IconComponent={Ionicons}
                />
              ),
              tabBarLabelPosition: "below-icon",
              headerShown: false,
            }}
          />

          <Tabs.Screen
            name="notifications"
            options={{
              title: "Notificaciones",
              tabBarIcon: ({ color }) => (
                <View>
                  <StyledIcon
                    name="notifications"
                    color={color}
                    IconComponent={Ionicons}
                  />
                  {notificationCount > 0 && (
                    <Badge
                      value={notificationCount}
                      status="error"
                      containerStyle={{
                        position: "absolute",
                        top: -4,
                        right: -4,
                      }}
                    />
                  )}
                </View>
              ),
              tabBarLabelPosition: "below-icon",
            }}
          />
        </Tabs>
      </NotificationProvider>
    </WebSocketProvider>
  );
}
