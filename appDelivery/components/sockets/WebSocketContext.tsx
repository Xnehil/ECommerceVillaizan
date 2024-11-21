import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import useWebSocket from "react-use-websocket";
import { Notificacion} from "@/interfaces/interfaces";
import { getUserData } from "@/functions/storage";
import axios from "axios";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
const WS_URL = process.env.EXPO_PUBLIC_WS_URL;

interface WebSocketContextType {
  sendUbicacion: (lat: number, lng: number) => void;
  sendPedido: (pedidoId: string) => void;
  onMessage: (callback: (data: any) => void) => void;
}

const WebSocketContext = createContext<WebSocketContextType | null>(null);

export const WebSocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { sendMessage, lastMessage } = useWebSocket(WS_URL ?? "", { shouldReconnect: () => true });
  const [callbacks, setCallbacks] = useState<((data: any) => void)[]>([]);
  
  // Manejar mensajes entrantes
  useEffect(() => {
    if (lastMessage !== null) {
      const data = JSON.parse(lastMessage.data);
      callbacks.forEach((callback) => callback(data));
    }
  }, [lastMessage, callbacks]);

  const onMessage = useCallback((callback: (data: any) => void) => {
    setCallbacks((prev) => [...prev, callback]);
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
    creadoEn: new Date().toISOString(),
    actualizadoEn: new Date().toISOString(),
    desactivadoEn: null,
    usuarioCreacion: "", 
    usuarioActualizacion: null,
    estaActivo: true,
    asunto: "WebSocket Connection Error",
    descripcion: error,
    tipoNotificacion: "error",
    leido: false,
    sistema: "WebSocketService",
    usuario: user ,
  };
  }
  else {
    return null
  }
};

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