import React, { createContext, useContext, useEffect, useState, useCallback, useRef } from "react";
import useWebSocket from "react-use-websocket";
import { Notificacion } from "@/interfaces/interfaces";
import { getUserData } from "@/functions/storage";
import axios from "axios";
import { Platform } from "react-native";

let BASE_URL = '';
let WS_URL = '';
if (Platform.OS === "web") {
  BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || '';
  WS_URL = process.env.EXPO_PUBLIC_WS_URL || '';
}
else if(Platform.OS === "android") {
  BASE_URL = process.env.EXPO_PUBLIC_BASE_URL_MOVIL || process.env.EXPO_PUBLIC_BASE_URL || '';
  WS_URL = process.env.EXPO_PUBLIC_WS_URL_MOVIL || process.env.EXPO_PUBLIC_WS_URL || '';
}
else {
  BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || '';
  WS_URL = process.env.EXPO_PUBLIC_WS_URL || '';
}

interface WebSocketContextType {
  sendUbicacion: (lat: number, lng: number) => void;
  sendPedido: (pedidoId: string) => void;
  onMessage: (callback: (data: any) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sendMessage, lastMessage, readyState } = useWebSocket(WS_URL ?? "", {
    shouldReconnect: () => true,
    onOpen: () => {
      console.log("WebSocket connection established");
    },
  });
  const callbacksRef = useRef<((data: any) => void)[]>([]);

  useEffect(() => {
    const checkWSURL = async () => {
      if (!WS_URL) {
        const notification = await createNotification("WebSocket URL is not defined.");
        if (notification) {
          const response = await axios.post(`${BASE_URL}/notificacion`, notification);
          console.log("Notification created", response);
        }
      }
    };
    checkWSURL();
  }, [WS_URL]);

  // Manejar mensajes entrantes
  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      // Llama a todos los callbacks registrados
      callbacksRef.current.forEach((callback) => callback(data));
    }
  }, [lastMessage]);

  const onMessage = useCallback((callback: (data: any) => void) => {
    // Agrega el callback a la referencia
    callbacksRef.current.push(callback);

    // Devuelve una función para eliminar el callback
    return () => {
      callbacksRef.current = callbacksRef.current.filter((cb) => cb !== callback);
    };
  }, []);

  const sendUbicacion = useCallback(
    (lat: number, lng: number) => {
      const ubicacionMessage = {
        type: "ubicacion",
        data: { lat, lng },
      };
      sendMessage(JSON.stringify(ubicacionMessage));
    },
    [sendMessage]
  );

  const sendPedido = useCallback(
    (pedidoId: string) => {
      const pedidoMessage = {
        type: "pedido",
        data: { pedidoId },
      };
      sendMessage(JSON.stringify(pedidoMessage));
    },
    [sendMessage]
  );

  return (
    <WebSocketContext.Provider value={{ sendUbicacion, sendPedido, onMessage }}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocketContext = () => {
  const context = useContext(WebSocketContext);
  if (!context) {
    throw new Error("useWebSocketContext debe usarse dentro de WebSocketProvider");
  }
  return context;
};

const createNotification = async (error: string): Promise<Notificacion | null> => {
  const user = await getUserData();
  if (user) {
    return {
      id: "",
      estaActivo: true,
      asunto: "WebSocket Connection Error",
      descripcion: error,
      tipoNotificacion: "error",
      leido: false,
      sistema: "WebSocketService",
      usuario: user,
    };
  } else {
    return null;
  }
};
