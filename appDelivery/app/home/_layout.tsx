import React, { useEffect, useState } from "react";
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

export default function TabLayout() {
  const colorScheme = useColorScheme();
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  
  useEffect(() => {
    let isMounted = true;

    const getLocation = async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        console.log("Permiso de ubicación denegado");
        return;
      }

      let location_async = await Location.getCurrentPositionAsync({});
      if (isMounted) {
        setLocation({
          latitude: location_async.coords.latitude,
          longitude: location_async.coords.longitude,
        });
      }
    };

    getLocation();
    const intervalId = setInterval(getLocation, 10000);

    return () => {
      isMounted = false;
      clearInterval(intervalId);
    };
  }, []);

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors[colorScheme ?? "light"].tint,
        headerShown: useClientOnlyValue(false, true),
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
            <View style={{padding:10}}>
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
    </Tabs>
  );
}
