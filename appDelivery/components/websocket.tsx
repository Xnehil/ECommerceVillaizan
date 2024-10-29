import { useEffect, useCallback, useImperativeHandle, forwardRef } from 'react';
import useWebSocket from 'react-use-websocket';

interface WebSocketComponentProps {
  idMotorizado: string; // ID del motorizado para la URL del WebSocket
}

export interface WebSocketComponentRef {
  sendUbicacion: (lat: number, lng: number) => void;
  sendPedido: (pedidoId: string) => void;
}

// Usamos `forwardRef` para permitir que el componente exponga funciones a su padre
const WebSocketComponent = forwardRef<WebSocketComponentRef, WebSocketComponentProps>(({ idMotorizado }, ref) => {
  // Establece la conexión WebSocket con el ID del motorizado en la URL
  const { sendMessage } = useWebSocket(`ws://localhost:9001/ws?rol=delivery&id=${idMotorizado}`, {
    onOpen: () => console.log('Conexión WebSocket establecida'),
    onError: (event) => console.error('Error en la conexión WebSocket', event),
    shouldReconnect: () => true, // Reconexión automática
  });

  // Función para enviar la ubicación
  const sendUbicacion = useCallback((lat: number, lng: number) => {
    const ubicacionMessage = {
      type: "ubicacion",
      data: {
        lat: lat,
        lng: lng,
      },
    };
    sendMessage(JSON.stringify(ubicacionMessage)); // Envía el mensaje de ubicación
    console.log("Ubicación enviada:", ubicacionMessage);
  }, [sendMessage]);

  // Función para enviar el ID del pedido
  const sendPedido = useCallback((pedidoId: string) => {
    const pedidoMessage = {
      type: "ubicacion",
      data: {
        pedidoId: pedidoId,
      },
    };
    sendMessage(JSON.stringify(pedidoMessage)); // Envía el mensaje del pedido
    console.log("Pedido enviado:", pedidoMessage);
  }, [sendMessage]);

  // Exponemos las funciones al componente padre a través de `ref`
  useImperativeHandle(ref, () => ({
    sendUbicacion,
    sendPedido,
  }));

  // Este componente no renderiza nada visual
  return null;
});

export default WebSocketComponent;
