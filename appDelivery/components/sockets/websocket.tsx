import { Link } from "expo-router";
import {
  useCallback,
  useImperativeHandle,
  forwardRef,
  useState,
  useRef,
  useEffect,
} from "react";
import { Animated, Text, Dimensions, View } from "react-native";
import useWebSocket, { ReadyState } from "react-use-websocket";
import { Audio } from 'expo-av';
const WS_URL = process.env.EXPO_PUBLIC_WS_URL
const notificationSound = require("@assets/sounds/notificacion.mp3");

interface WebSocketComponentProps {
  idMotorizado: string;
}

const { width, height } = Dimensions.get("window");


export interface WebSocketComponentRef {
  sendUbicacion: (lat: number, lng: number) => void;
  sendPedido: (pedidoId: string) => void;
}

// Usamos `forwardRef` para permitir que el componente exponga funciones a su padre
const WebSocketComponent = forwardRef<
  WebSocketComponentRef,
  WebSocketComponentProps
>(({ idMotorizado }, ref) => {
  const handleIncomingMessage = (event: MessageEvent) => {
    const data = JSON.parse(event.data);
    console.log("Mensaje recibido:", data, "Tipo:", data.type);
    if (data.type === "nuevoPedido") {
      // Aquí se hara la notificación
      setShowNotification(true); 
      console.log("Pedido recibido:", data.data.pedidoId);

      const playNotificationSound = async () => {
        const { sound } = await Audio.Sound.createAsync(
          notificationSound
        );
        await sound.playAsync();
      };

      playNotificationSound();
    }
  };
  // Establece la conexión WebSocket con el ID del motorizado en la URL
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `${WS_URL}?rol=delivery&id=${idMotorizado}`,
    {
      onOpen: () => console.log("Conexión WebSocket establecida"),
      onError: (event) =>
        console.error("Error en la conexión WebSocket", event),
      shouldReconnect: () => true,
      onMessage: handleIncomingMessage,
    }
  );

  // Función para enviar la ubicación
  const sendUbicacion = useCallback(
    (lat: number, lng: number) => {
      const ubicacionMessage = {
        type: "ubicacion",
        data: {
          lat: lat,
          lng: lng,
        },
      };
      sendMessage(JSON.stringify(ubicacionMessage));
      console.log("Ubicación enviada:", ubicacionMessage);
    },
    [sendMessage]
  );

  // Función para enviar el ID del pedido
  const sendPedido = useCallback(
    (pedidoId: string) => {
      const pedidoMessage = {
        type: "ubicacion",
        data: {
          pedidoId: pedidoId,
        },
      };
      sendMessage(JSON.stringify(pedidoMessage)); // Envía el mensaje del pedido
      console.log("Pedido enviado:", pedidoMessage);
    },
    [sendMessage]
  );

  // Exponemos las funciones al componente padre a través de `ref`
  useImperativeHandle(ref, () => ({
    sendUbicacion,
    sendPedido,
  }));
  const [showNotification, setShowNotification] = useState(false);
  const slideAnim = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    if (showNotification) {
      // Iniciar la animación de deslizamiento hacia abajo
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();

      // Ocultar la notificación después de 3 segundos
      setTimeout(() => {
        Animated.timing(slideAnim, {
          toValue: -100,
          duration: 300,
          useNativeDriver: true,
        }).start(() => setShowNotification(false));
      }, 3000);
    }
  }, [showNotification, slideAnim]);
/*
  useEffect(() => {
    console.log("Mostrando notifications");
    setShowNotification(true);
  }, []);
*/
  const connectionStatus = {
    [ReadyState.CONNECTING]: "Conectando...",
    [ReadyState.OPEN]: "Conexión abierta",
    [ReadyState.CLOSING]: "Cerrando conexión...",
    [ReadyState.CLOSED]: "Conexión cerrada",
    [ReadyState.UNINSTANTIATED]: "No inicializado",
  }[readyState];

  // console.log("Estado de la conexión:", connectionStatus);

  return (
    <>
      {showNotification && (
        <Animated.View
          style={{
            position: "absolute",
            top: width * 0.1,
            right: 20,
            width: width * 0.4,
            padding: 10,
            backgroundColor: "orange",
            transform: [{ translateY: slideAnim }],
            zIndex: 1,
            borderRadius: 10,
            height: height * 0.15,
            justifyContent: "center",
          }}
        >
            <Text
            style={{ color: "white", textAlign: "center", marginBottom: 10 }}
            >
            ¡Nuevo pedido recibido!
            </Text>
            <View style={{ backgroundColor: "darkred", padding: 5, borderRadius: 5 }}>
            <Link
              href="/home/delivery"
              style={{ color: "white", textAlign: "center" }}
            >
              Ver
            </Link>
            </View>
        </Animated.View>
      )}
    </>
  );
});

export default WebSocketComponent;
