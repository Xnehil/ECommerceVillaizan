import React, { createContext, useContext, useState } from "react";
import { Animated, Text, View, Dimensions } from "react-native";

const { width } = Dimensions.get("window");

interface NotificationContextType {
  showNotification: (message: string) => void;
}

const NotificationContext = createContext<NotificationContextType | null>(null);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [notification, setNotification] = useState<string | null>(null);
  const [slideAnim] = useState(new Animated.Value(-100));

  const showNotification = (message: string) => {
    setNotification(message);

    // Animación de entrada
    Animated.timing(slideAnim, {
      toValue: 0,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Ocultar después de 3 segundos
    setTimeout(() => {
      Animated.timing(slideAnim, {
        toValue: -100,
        duration: 300,
        useNativeDriver: true,
      }).start(() => setNotification(null));
    }, 3000);
  };

  return (
    <NotificationContext.Provider value={{ showNotification }}>
      {children}
      {notification && (
        <Animated.View
          style={{
            position: "absolute",
            top: 50,
            left: width * 0.1,
            right: width * 0.1,
            padding: 10,
            backgroundColor: "orange",
            transform: [{ translateY: slideAnim }],
            zIndex: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", textAlign: "center" }}>{notification}</Text>
        </Animated.View>
      )}
    </NotificationContext.Provider>
  );
};

export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotificationContext debe usarse dentro de NotificationProvider");
  }
  return context;
};
