import React, { useState, useCallback, useEffect } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import useWebSocket, { ReadyState } from 'react-use-websocket';

const WebSocketComponent: React.FC = () => {
  const [messageHistory, setMessageHistory] = useState<string[]>([]);
  const [inputMessage, setInputMessage] = useState<string>('');

  // Establece la conexión WebSocket al servidor que creaste
  const { sendMessage, lastMessage, readyState } = useWebSocket('ws://localhost:9001/ws', {
    onOpen: () => console.log('Conexión establecida con el servidor WebSocket'),
    onMessage: (event: WebSocketEventMap['message']) => {
      setMessageHistory((prev) => [...prev, event.data]); // Agrega el nuevo mensaje al historial de mensajes
    },
    onError: (event: WebSocketEventMap['error']) => console.error('Error de WebSocket', event),
  });

  // Función para enviar el mensaje al servidor WebSocket
  const handleSendMessage = useCallback(() => {
    if (inputMessage) {
      sendMessage(inputMessage); // Envía el mensaje al servidor WebSocket
      setInputMessage(''); // Limpia el campo de entrada
    }
  }, [inputMessage, sendMessage]);

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
        placeholder="Escribe un mensaje"
        value={inputMessage}
        onChangeText={setInputMessage}
        style={{ borderWidth: 1, marginBottom: 10, padding: 10 }}
      />

      <Button title="Enviar mensaje" onPress={handleSendMessage} disabled={readyState !== ReadyState.OPEN} />

      <Text style={{ marginTop: 20 }}>Historial de mensajes:</Text>
      {messageHistory.map((message, index) => (
        <Text key={index}>{message}</Text>
      ))}
    </View>
  );
};

export default WebSocketComponent;
