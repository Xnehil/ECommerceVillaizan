const baseUrl = process.env.NEXT_PUBLIC_WS_BACKEND_URL;

export const connectWebSocket = (idRepartidor: string, idPedido: string,
    onMessage: (data: any) => void, onClose: () => void) => {
    const ws = new WebSocket(`${baseUrl}/ws?rol=cliente&id=${idPedido}`);

    ws.onopen = () => {
        console.log('Se conecto al websocket');
        ws.send(JSON.stringify({ type: 'ubicacion', data: { "deliveryId": idRepartidor } }));

        const intervalId = setInterval(() => {
            const message = JSON.stringify({
              type: 'ubicacion',
                data: {
                    "deliveryId": idRepartidor
                }
            });
            ws.send(message);
          }, 3000); 
      
          ws.onclose = () => {
            console.log('WebSocket connection closed');
            clearInterval(intervalId); // Clear the interval when the connection is closed
            onClose();
          };
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);    
        onMessage(data);
    };

    ws.onclose = () => {
        console.log('WebSocket connection closed');
        onClose();
    };

    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    return ws;
};