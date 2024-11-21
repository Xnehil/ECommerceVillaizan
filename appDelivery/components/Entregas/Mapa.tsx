import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Circle, Marker, Polyline } from "@react-google-maps/api";
import { Pedido } from "@/interfaces/interfaces";
import { calculateOptimalRoute, Coordinate, PedidoLoc } from "@/functions/tspAlg";

interface MapProps {
  location: { latitude: number; longitude: number } | null;
  pedidos: Pedido[] | null;
  pedidoSeleccionado: Pedido | null; // Pedido seleccionado
  mode: boolean; // Alternar entre modo único y múltiple
}

// Coordenadas por defecto
const defaultCoordinates = {
  lat: -6.487316,
  lng: -76.359598,
};

const MapComponent: React.FC<MapProps> = ({
  location,
  pedidos,
  pedidoSeleccionado,
  mode,
}) => {
  const mapRef = useRef<google.maps.Map | null>(null);
  const [previousRoutes, setPreviousRoutes] = useState<{
    origin: Coordinate;
    destinations: { lat: number; lng: number }[];
    route: google.maps.LatLng[];
  }>();

  const mapContainerStyle = {
    height: "400px",
    width: "100%",
  };

  const [center, setCenter] = useState<{ lat: number; lng: number }>(
    defaultCoordinates
  );
  const [showRoutes, setShowRoutes] = useState(false); 


  const [circleRadius, setCircleRadius] = useState(250);
  const [routePoints, setRoutePoints] = useState<google.maps.LatLng[]>([]);
  const [pedidoLocations, setPedidoLocations] = useState<PedidoLoc[]>([]);
  useEffect(() => {
    const pedidolocations = pedidos?.map((pedido) => {
      const ubicacion = pedido.direccion?.ubicacion || {
        latitud: defaultCoordinates.lat.toString(),
        longitud: defaultCoordinates.lng.toString(),
      };
      return {
        id: pedido.id,
        nombre: pedido.usuario?.nombre || "Desconocido",
        activo: pedido.estado === "enProgreso",
        lat: parseFloat(ubicacion.latitud),
        lng: parseFloat(ubicacion.longitud),
      };
    });

    setPedidoLocations(pedidolocations || []);
  }, [pedidos]);

  const fetchSingleRoute = async (
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ) => {
    try {
      const directionsService = new google.maps.DirectionsService();
      const result = await directionsService.route({
        origin,
        destination,
        travelMode: google.maps.TravelMode.DRIVING,
      });

      if (result && result.routes && result.routes.length > 0) {
        return result.routes[0].overview_path;
      } else {
        return [];
      }
    } catch (error) {
      console.error("Error fetching single route:", error);
      return [];
    }
  };
  // Fetch route for multiple destinations
  const fetchMultipleRoutes = async (
    origin: { lat: number; lng: number },
    destinations: { lat: number; lng: number; id: string }[]
  ) => {
    try {
      const directionsService = new google.maps.DirectionsService();
      const points: google.maps.LatLng[] = [];
      let lastPoint = origin;

      for (const destination of destinations) {
        const result = await directionsService.route({
          origin: lastPoint,
          destination: { lat: destination.lat, lng: destination.lng },
          travelMode: google.maps.TravelMode.DRIVING,
        });

        if (result && result.routes && result.routes.length > 0) {
          points.push(...result.routes[0].overview_path);
          lastPoint = { lat: destination.lat, lng: destination.lng };
        }
      }

      return points;
    } catch (error) {
      console.error("Error fetching multiple routes:", error);
      return [];
    }
  };

  useEffect(() => {
    const getRoute = async () => {
      if (location && pedidoLocations) {
        if (mode) {
          // Calcular rutas en modo múltiple

          const orderedLocations = calculateOptimalRoute(
            { lat: location.latitude, lng: location.longitude },
            pedidoLocations
          );
          
          const route = await fetchMultipleRoutes(
            { lat: location.latitude, lng: location.longitude },
            orderedLocations.orderedPedidos
          );

          if (route) {
            setRoutePoints(route);
            setPreviousRoutes({
              origin: { lat: location.latitude, lng: location.longitude },
              destinations: orderedLocations.orderedPedidos,
              route,
            });
          }
        } else {
          // Modo único: calcular la ruta para el pedido seleccionado
          const activePedido = pedidoLocations.find((loc) => loc.activo);
          if (activePedido) {
            const route = await fetchSingleRoute(
              { lat: location.latitude, lng: location.longitude },
              { lat: activePedido.lat, lng: activePedido.lng }
            );
            if (route) setRoutePoints(route);
          } else {
            console.warn(
              "No hay pedido activo para calcular la ruta en modo único."
            );
          }
        }
      }
    };

    getRoute();
  }, [location, pedidoLocations, mode]);

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

  useEffect(() => {
    if (mapRef.current && location) {
      const bounds = new google.maps.LatLngBounds();
      bounds.extend(
        new google.maps.LatLng(location.latitude, location.longitude)
      );

      if (pedidoLocations) {
        pedidoLocations.forEach((loc) => {
          bounds.extend(new google.maps.LatLng(loc.lat, loc.lng));
        });
      }

      mapRef.current.fitBounds(bounds);
    }
  }, [location, pedidoLocations, mode]);

  return (
    <GoogleMap
      mapContainerStyle={mapContainerStyle}
      center={center}
      zoom={13} // Default zoom level
      onLoad={(map) => {
        mapRef.current = map;
      }}
      onZoomChanged={handleZoomChanged}
    >
            <button
        style={{
          position: "absolute",
          top: "10px",
          left: "10px",
          zIndex: 1000,
          padding: "8px 16px",
          background: "#4285F4",
          color: "white",
          border: "none",
          borderRadius: "4px",
          cursor: "pointer",
        }}
        onClick={() => setShowRoutes((prev) => !prev)}
      >
        {showRoutes ? "Ocultar Rutas" : "Mostrar Rutas"}
      </button>
      {location && (
        <Circle
          center={center}
          radius={circleRadius}
          options={{
            fillColor: "#4285F4",
            fillOpacity: 0.8,
            strokeColor: "#4285F4",
            strokeOpacity: 0.8,
            strokeWeight: 1,
          }}
        />
      )}
      {showRoutes && routePoints.length > 0 && (
        <Polyline
          path={routePoints}
          options={{
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 3,
          }}
        />
      )}
      {pedidoLocations?.map((loc) => (
        <Marker
          key={loc.id}
          position={{ lat: loc.lat, lng: loc.lng }}
          label={loc.nombre}
          icon={
            pedidoSeleccionado?.id === loc.id
              ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
              : undefined
          }
        />
      ))}
    </GoogleMap>
  );
};

export default MapComponent;
