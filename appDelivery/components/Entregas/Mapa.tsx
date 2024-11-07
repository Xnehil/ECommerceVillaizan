import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";
import { Pedido } from "@/interfaces/interfaces";

const GOOGLE_MAPS_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;
interface MapProps {
  location: { latitude: number; longitude: number } | null;
  pedidoSeleccionado: Pedido | null;
  pedidos: Pedido[] | null;
  mode: boolean; // Nuevo estado para alternar entre modo único y múltiple
}

const MapComponent: React.FC<MapProps> = ({
  location,
  pedidoSeleccionado,
  pedidos,
  mode,
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);

  const mapContainerStyle = {
    height: "400px",
    width: "100%",
  };

  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: -12.0464,
    lng: -77.0428,
  });

  const [circleRadius, setCircleRadius] = useState(250);

  // Actualiza el centro del mapa basado en la ubicación del usuario
  useEffect(() => {
    if (location) {
      setCenter({ lat: location.latitude, lng: location.longitude });
    } else {
      setCenter({ lat: -12.0464, lng: -77.0428 }); // Centro predeterminado (Lima)
    }
  }, [location]);

  // Calcula el radio del círculo según el nivel de zoom
  const calculateCircleRadius = (zoom: number) => {
    const baseRadius = 50;
    const zoomFactor = Math.pow(2, 15 - zoom);
    return baseRadius * zoomFactor;
  };

  const handleZoomChanged = () => {
    if (mapRef.current) {
      const newZoom = mapRef.current.getZoom();
      if (newZoom !== undefined) {
        setCircleRadius(calculateCircleRadius(newZoom));
      }
    }
  };

  const pedidoPosition = pedidoSeleccionado?.direccion?.ubicacion
    ? {
        lat: parseFloat(pedidoSeleccionado.direccion.ubicacion.latitud),
        lng: parseFloat(pedidoSeleccionado.direccion.ubicacion.longitud),
      }
    : null;

  // Obtiene las ubicaciones de todos los pedidos
  const pedidoLocations = pedidos?.map((pedido) => {
    const ubicacion = pedido.direccion?.ubicacion || {
      latitud: "-12.0464",
      longitud: "-77.0428",
    };
    return {
      id: pedido.id,
      lat: parseFloat(ubicacion.latitud),
      lng: parseFloat(ubicacion.longitud),
    };
  });

  // Ajusta el zoom y los límites según el modo
  useEffect(() => {
    if (mapRef.current && location) {
      const bounds = new google.maps.LatLngBounds();
      const userLocation = new google.maps.LatLng(
        location.latitude,
        location.longitude
      );

      bounds.extend(userLocation);

      if (mode && pedidoLocations) {
        // Modo múltiple: ajusta los límites con todas las ubicaciones de los pedidos
        pedidoLocations.forEach((loc) => {
          bounds.extend(new google.maps.LatLng(loc.lat, loc.lng));
        });
      } else if (pedidoPosition) {
        // Modo único: ajusta los límites con el pedido seleccionado
        const pedidoLocation = new google.maps.LatLng(
          pedidoPosition.lat,
          pedidoPosition.lng
        );
        bounds.extend(pedidoLocation);
      }

      mapRef.current.fitBounds(bounds);
    }
  }, [location, pedidoPosition, pedidoLocations, mode]);

  return (
    <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY || ""}>
      <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={center}
        zoom={13}
        onLoad={(map) => {
          mapRef.current = map; // Asigna la referencia del mapa
        }}
        onZoomChanged={handleZoomChanged} // Evento que escucha el cambio de zoom
      >
        {location && (
          <Circle
            center={center}
            radius={circleRadius}
            options={{
              fillColor: "#4285F4",
              fillOpacity: 0.8,
              strokeColor: "#4285F4",
              strokeOpacity: 0.8,
              strokeWeight: 2,
            }}
          />
        )}
        {mode &&
          pedidoLocations?.map((loc) => (
            <Marker
              key={loc.id}
              position={{ lat: loc.lat, lng: loc.lng }}
              label={pedidoSeleccionado?.id === loc.id ? pedidoSeleccionado.usuario?.nombre : ""}
              icon={
                pedidoSeleccionado?.id === loc.id
                  ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
                  : undefined
              }
            />
          ))}
        {!mode && pedidoPosition && (
          <Marker position={pedidoPosition} label={pedidoSeleccionado?.usuario?.nombre} />
        )}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
