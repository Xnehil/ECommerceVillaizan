import { useCallback, useImperativeHandle, forwardRef } from "react";
import useWebSocket, { ReadyState } from 'react-use-websocket';

interface WebSocketComponentProps {
  idMotorizado: string;
}

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
  };
  // Establece la conexión WebSocket con el ID del motorizado en la URL
  const { sendMessage, lastMessage, readyState } = useWebSocket(
    `ws://localhost:9001/ws?rol=delivery&id=${idMotorizado}`,
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


  const connectionStatus = {
    [ReadyState.CONNECTING]: 'Conectando...',
    [ReadyState.OPEN]: 'Conexión abierta',
    [ReadyState.CLOSING]: 'Cerrando conexión...',
    [ReadyState.CLOSED]: 'Conexión cerrada',
    [ReadyState.UNINSTANTIATED]: 'No inicializado',
  }[readyState];

  console.log('Estado de la conexión:', connectionStatus);
  
  // Este componente no renderiza nada visual
  return null;
});

export default WebSocketComponent;
