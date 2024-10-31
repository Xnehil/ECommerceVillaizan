const baseUrl = process.env.NEXT_PUBLIC_WS_BACKEND_URL;

interface ExtendedWebSocket extends WebSocket {
    intervalId?: NodeJS.Timeout;
}

export const connectWebSocket = (idRepartidor: string, idPedido: string, estado: string,
    onMessage: (data: any) => void, onClose: () => void): ExtendedWebSocket => {
    const ws: ExtendedWebSocket = new WebSocket(`${baseUrl}/ws?rol=cliente&id=${idPedido}`) as ExtendedWebSocket;

    ws.onopen = () => {
        console.log('Se conectó al websocket');
        // ws.send(JSON.stringify({ type: 'ubicacion', data: { "deliveryId": idRepartidor } }));
        // El primer mensaje envía el estado del pedido
        ws.send(JSON.stringify({ type: 'estado', data: { "estado": estado } }));
    
        const intervalId = setInterval(() => {
            const message = JSON.stringify({
                type: 'ubicacion',
                data: {
                    "deliveryId": idRepartidor
                }
            });
            ws.send(message);
        }, 3000);
    
        // Store the intervalId so it can be cleared later
        ws.intervalId = intervalId;
    };
    
    ws.onclose = () => {
        console.log('WebSocket connection closed');
        if (ws.intervalId) {
            console.log('Clearing interval with ID:', ws.intervalId);
            clearInterval(ws.intervalId);
            ws.intervalId = undefined; // Optionally reset it after clearing
        } else {
            console.log('No interval ID found on WebSocket instance');
        }
        if (typeof onClose === 'function') {
            onClose();
        }
    };
    
    
    ws.onerror = (error) => {
        console.error('WebSocket error:', error);
    };

    ws.onmessage = (event) => {
        const data = JSON.parse(event.data);    
        onMessage(data);
    };

    return ws;
}
