import { useEffect, useState } from "react";
import * as Location from 'expo-location';
import { useWebSocketContext } from "./WebSocketContext";
import { useNotificationContext } from "./notificationContext";

const SendLocationComponent: React.FC = () => {
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);

  const { sendUbicacion, onMessage } = useWebSocketContext();
  const { showNotification } = useNotificationContext();

  useEffect(() => {
    const getLocation = async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") {
          console.log("Permiso de ubicación denegado");
          return;
        }

        let location_async = await Location.getCurrentPositionAsync({});
        setLocation({
          latitude: location_async.coords.latitude,
          longitude: location_async.coords.longitude,
        });
      } catch (error) {
        console.log("Error al obtener la ubicación:", error);
      }
    };

    getLocation();
    const locationInterval = setInterval(getLocation, 10000);

    return () => {
      clearInterval(locationInterval);
    };
  }, []);

  useEffect(() => {
    if (location) {
      const sendInterval = setInterval(() => {
        sendUbicacion(location.latitude, location.longitude);
      }, 10000);

      return () => clearInterval(sendInterval);
    }
  }, [location, sendUbicacion]);

  useEffect(() => {
    onMessage((data) => {
      if (data.type === "nuevoPedido") {
        showNotification("¡Nuevo pedido recibido!");
        console.log("Pedido recibido:", data);
      }
    });
  }, [onMessage, showNotification]);

  return null;
};

export default SendLocationComponent;