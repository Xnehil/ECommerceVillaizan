import { Pedido } from "types/PaquetePedido";
import MapaTracking from "./MapaTracking";

interface MapaTrackingWrapperProps {
  pedido: Pedido | null;
  driverPosition?: [number, number];
}

const MapaTrackingWrapper: React.FC<MapaTrackingWrapperProps> = ({ pedido, driverPosition }) => {
  const defaultPosition: [number, number] = [-6.484, -76.364]; // Default coordinates

  // Debug logs for pedido
  if (!pedido) {
    console.log("Debug: 'pedido' is null or undefined");
  } else {
    console.log("Debug: 'pedido' is available", pedido);
  }

  // Extract ubicacion with logging
  const ubicacion = pedido?.direccion?.ubicacion;
  if (!ubicacion) {
    console.log("Debug: 'ubicacion' is null or undefined in 'pedido.direccion'");
  } else {
    console.log("Debug: 'ubicacion' is available", ubicacion);
  }

  // Extract latitud and longitud with logging
  const latitud = ubicacion?.latitud;
  const longitud = ubicacion?.longitud;

  if (latitud === undefined || longitud === undefined) {
    console.log("Debug: Missing 'latitud' or 'longitud'", { latitud, longitud });
  } else {
    console.log("Debug: Coordinates found", { latitud, longitud });
  }

  // Fallback logic for missing coordinates
  const destinationPosition: [number, number] =
    latitud !== undefined && longitud !== undefined
      ? [latitud, longitud]
      : defaultPosition;

  return (
    <MapaTracking
      pedido={pedido}
      driverPosition={driverPosition ?? defaultPosition}
      destinationPosition={destinationPosition}
    />
  );
};

export default MapaTrackingWrapper;