import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WebSocketComponent: React.FC = () => {
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');
  const [pedidoId, setPedidoId] = useState<string>(''); // Campo para ID del pedido
  const [latitud, setLatitud] = useState<string>(''); // Campo para latitud
  const [longitud, setLongitud] = useState<string>(''); // Campo para longitud

  // Establece la conexión WebSocket al servidor
  const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:9001/ws?rol=delivery&id=mot_01J97FH8NJWHKNFX26KZ048KTX ', {
    onOpen: () => console.log('Conexión establecida con el servidor WebSocket'),
    onMessage: (event: WebSocketEventMap['message']) => {
      setMessageHistory((prev) => [...prev, event.data]); // Agrega el nuevo mensaje al historial de mensajes
    },
    onError: (event: WebSocketEventMap['error']) => console.error('Error de WebSocket', event),
  });

  // Función para enviar el mensaje al servidor WebSocket
  const handleSendMessage = useCallback(() => {
    if ( latitud && longitud) {
      const message = {
        type: "ubicacion",
        data: {
          lat: parseFloat(latitud), 
          lng: parseFloat(longitud)
        }
      };
      sendMessage(JSON.stringify(message)); // Envía el mensaje al servidor WebSocket
      setInputMessage(''); // Limpia el campo de entrada
      setPedidoId(''); // Limpia el campo de ID del pedido
      setLatitud(''); // Limpia el campo de latitud
      setLongitud(''); // Limpia el campo de longitud
    }
  }, [pedidoId, latitud, longitud, sendMessage]);

  // Efecto para manejar la llegada de un nuevo mensaje
  useEffect(() => {
    if (lastMessage !== null) {
      setMessageHistory((prev) => [...prev, lastMessage.data]);
    }
  }, [lastMessage]);

  // Mostrar el estado de la conexión
  const connectionStatus: string = {
    [ReadyState.CONNECTING]: 'Conectando',
    [ReadyState.OPEN]: 'Conectado',
    [ReadyState.CLOSING]: 'Cerrando',
    [ReadyState.CLOSED]: 'Desconectado',
    [ReadyState.UNINSTANTIATED]: 'No instanciado',
  }[readyState];

  return (
    <View style={{ padding: 20 }}>
      <Text>Estado de la conexión: {connectionStatus}</Text>

      <TextInput
        placeholder="ID del Pedido"
        value={pedidoId}
        onChangeText={setPedidoId}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Latitud"
        value={latitud}
        onChangeText={setLatitud}
        keyboardType="numeric" // Solo permite números
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <TextInput
        placeholder="Longitud"
        value={longitud}
        onChangeText={setLongitud}
        keyboardType="numeric" // Solo permite números
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <Button title="Enviar ubicación" onPress={handleSendMessage} disabled={readyState !== ReadyState.OPEN} />

      <Text style={{ marginTop: 20 }}>Historial de mensajes:</Text>
      {messageHistory.map((message, index) => (
        <Text key={index}>{message}</Text>
      ))}
    </View>
  );
};

export default WebSocketComponent;
