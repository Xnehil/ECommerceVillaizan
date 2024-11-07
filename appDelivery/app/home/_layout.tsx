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
import { Motorizado, Notificacion } from "@/interfaces/interfaces";
import { getMotorizadoData, getUserData } from "@/functions/storage";
import { Badge } from "react-native-elements";
import axios from "axios";
import { BASE_URL } from "@env";
import { Audio } from 'expo-av';

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const notificationSound = require("@assets/sounds/notificacion.mp3");

  const wsRef = useRef<WebSocketComponentRef>(null);
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [notificationCount, setNotificationCount] = useState<number>(0);
  const [prevNotificationCount, setPrevNotificationCount] = useState<number>(0);
  const playNotificationSound = async () => {
    const { sound } = await Audio.Sound.createAsync(notificationSound);
    await sound.playAsync();
  };
  // Función para obtener las notificaciones del usuario
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
     
      //console.log("Notificaciones actual:", unreadCount, "Anterior:", prevNotificationCount);
      //if (unreadCount > prevNotificationCount) {
      //  playNotificationSound();
      //}
      setNotificationCount(unreadCount);
      //console.log("Notificaciones actualizadas:", unreadCount);
      //setPrevNotificationCount(unreadCount);
    } catch (error) {
      console.error("Error al obtener las notificaciones:", error);
    }
  };
  const [motorizado, setMotorizado] = useState<Motorizado | null>(null);

  useEffect(() => {
    const fetchMotorizadoData = async () => {
      try {
        const data = await getMotorizadoData();
        // console.log("Datos del motorizado:", data);

        setMotorizado(data);
      } catch (error) {
        console.log("Error al obtener los datos del motorizado:", error);
      }
    };

    // Consultar el motorizado al cargar el componente
    fetchMotorizadoData();
    fetchNotificaciones();
    // Consultar el motorizado cada 10 segundos
    const motorizadoInterval = setInterval(fetchMotorizadoData, 10000);
    const notificacionesInterval = setInterval(fetchNotificaciones, 1000);
    return () => {
      clearInterval(motorizadoInterval);
      clearInterval(notificacionesInterval);
    };
  }, []);

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
    <>
      {motorizado && (
        <WebSocketComponent idMotorizado={motorizado.id} ref={wsRef} />
      )}
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
    </>
  );
}
