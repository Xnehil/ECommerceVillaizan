import React, { useState, useEffect, useRef } from "react";
import { GoogleMap, LoadScript, Marker, Circle } from "@react-google-maps/api";
import { Pedido } from "@/interfaces/interfaces";

interface MapProps {
  location: { latitude: number; longitude: number } | null;
  pedidoSeleccionado: Pedido | null;
}

const MapComponent: React.FC<MapProps> = ({ location, pedidoSeleccionado }) => {
  const mapRef = useRef<google.maps.Map | null>(null); // Referencia del mapa

  const mapContainerStyle = {
    height: "400px",
    width: "100%",
  };

  const [center, setCenter] = useState<{ lat: number; lng: number }>({
    lat: -12.0464,
    lng: -77.0428,
  });
  const [circleRadius, setCircleRadius] = useState(250); 

  useEffect(()=>{
    handleZoomChanged();
  },[])

    // Función para calcular el radio basado en el zoom
    const calculateCircleRadius = (zoom: number) => {
      const baseRadius = 50; // Radio base

      const zoomFactor = Math.pow(2, 15 - zoom); // Ajusta la escala en función del zoom
      return baseRadius * zoomFactor;
    };
  
    const handleZoomChanged = () => {
      if (mapRef.current) {

        const newZoom = mapRef.current.getZoom(); // Obtiene el nuevo nivel de zoom

        if (newZoom !== undefined) {
          setCircleRadius(calculateCircleRadius(newZoom)); // Actualiza el radio en función del zoom
        }
      }
    };

  useEffect(() => {
    if (location) {
      setCenter({ lat: location.latitude, lng: location.longitude });
    } else {
      setCenter({ lat: -12.0464, lng: -77.0428 }); // Centro predeterminado (Lima)
    }
  }, [location]);

  const pedidoPosition = pedidoSeleccionado?.direccion?.ubicacion
    ? {
        lat: parseFloat(pedidoSeleccionado.direccion.ubicacion.latitud),
        lng: parseFloat(pedidoSeleccionado.direccion.ubicacion.longitud),
      }
    : null;

  useEffect(() => {
    if (location && pedidoPosition && mapRef.current) {
      const bounds = new google.maps.LatLngBounds();
      const userLocation = new google.maps.LatLng(
        location.latitude,
        location.longitude
      );
      const pedidoLocation = new google.maps.LatLng(
        pedidoPosition.lat,
        pedidoPosition.lng
      );

      bounds.extend(userLocation); // Agrega la ubicación del usuario
      bounds.extend(pedidoLocation); // Agrega la ubicación del pedido

      // Ajusta el zoom y los límites del mapa
      mapRef.current.fitBounds(bounds);
    }
  }, [location, pedidoPosition]);

  return (
    <LoadScript googleMapsApiKey="AIzaSyACjvZaldYb4PtGZSrERAAq4YYJM4tYmVI">
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
          <>
            <Circle
              center={center}
              radius={circleRadius} // Radio más amplio
              options={{
                fillColor: "#4285F4",
                fillOpacity: 0.8,
                strokeColor: "#4285F4",
                strokeOpacity: 0.8,
                strokeWeight: 2,
              }}
            />
            
          </>
        )}
        {pedidoPosition && <Marker position={pedidoPosition} label="Pedido" />}
      </GoogleMap>
    </LoadScript>
  );
};

export default MapComponent;
