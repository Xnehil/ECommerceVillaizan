import React, { useEffect, useRef, useState } from "react";
import { GoogleMap, Circle, Marker, Polyline } from "@react-google-maps/api";
import { Coordinate, Pedido, PedidoLoc } from "@/interfaces/interfaces";
import { Button } from "react-native-elements";
import { View,Text } from "react-native";

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
  /*if (!pedidos || pedidos.length === 0) {
    return (
      <View style={{ alignItems: "center", padding: 20, backgroundColor: "red" }}>
        <Text>
          No hay pedidos disponibles para mostrar.
          </Text>
      </View>
    );
  }*/

  if (!location) {
    return (
      <div style={{ textAlign: "center", padding: "20px", color: "red" }}>
        Ubicación no disponible.
      </div>
    );
  }

  const mapRef = useRef<google.maps.Map | null>(null);
  const [previousRoutes, setPreviousRoutes] = useState<{
    origin: Coordinate;
    destinations: { lat: number; lng: number }[];
    route: google.maps.LatLng[];
  }>();
  const [error, setError] = useState<string | null>(null); // Estado para errores

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
    const MAX_RETRIES = 3; // Número máximo de reintentos
    let retries = 0;
  
    while (retries < MAX_RETRIES) {
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
          throw new Error("No se encontraron rutas para el destino especificado.");
        }
      } catch (error: any) {
        retries++;
        if (error.status === "OVER_QUERY_LIMIT") {
          console.warn(
            `Se alcanzó el límite de consultas. Reintento (${retries}/${MAX_RETRIES})...`
          );
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Espera antes de reintentar
        } else {
          console.error("Error al calcular la ruta:", error);
          setError("Error al calcular la ruta. Inténtalo más tarde."); // Actualiza el estado de error
          break;
        }
      }
    }
  
    return []; // Devuelve una ruta vacía si falla
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
      console.error("Error al calcular las rutas múltiples:", error);
      setError("Error al calcular las rutas para los pedidos."); // Actualiza el estado de error
      return [];
    }
  };
  
  useEffect(() => {
    const getRoute = async () => {
      if (location && pedidoLocations) {
        if (mode) {
          // Calcular rutas en modo múltiple
          const route = await fetchMultipleRoutes(
            { lat: location.latitude, lng: location.longitude },
            pedidoLocations
          );

          if (route) {
            setRoutePoints(route);
            setPreviousRoutes({
              origin: { lat: location.latitude, lng: location.longitude },
              destinations: pedidoLocations,
              route,
            });
          }
        } else {
          // En modo único
          const targetPedido = pedidoSeleccionado
            ? {
                id: pedidoSeleccionado.id,
                nombre: pedidoSeleccionado.usuario?.nombre || "Desconocido",
                activo: pedidoSeleccionado.estado === "enProgreso",
                lat: parseFloat(
                  pedidoSeleccionado.direccion?.ubicacion?.latitud || "0"
                ),
                lng: parseFloat(
                  pedidoSeleccionado.direccion?.ubicacion?.longitud || "0"
                ),
              }
            : pedidoLocations[0];
          if (targetPedido) {
            const route = await fetchSingleRoute(
              { lat: location.latitude, lng: location.longitude },
              { lat: targetPedido.lat, lng: targetPedido.lng }
            );
            if (route) {
              setRoutePoints(route);
            }
          } else {
            console.warn(
              "No hay pedidos disponibles o seleccionados en modo único."
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
        style={styles.button}
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
        <>
          {routePoints.map((point, index) => {
            if (index === 0) return null; // Saltar el primer punto

            // Progreso normalizado (0 para inicio, 1 para fin)
            const progress = index / routePoints.length;

            // Gradiente tipo mapa de calor: verde -> amarillo -> rojo
            let segmentColor = "#4285F4"; // Default color for single mode
            if (mode) {
              if (progress < 0.5) {
                // De verde a amarillo
                segmentColor = `rgb(${Math.round(
                  255 * (progress * 2)
                )}, 255, 0)`;
              } else {
                // De amarillo a rojo
                segmentColor = `rgb(255, ${Math.round(
                  255 * (1 - (progress - 0.5) * 2)
                )}, 0)`;
              }
            }
            const arrowIcon = {
              path: google.maps.SymbolPath.FORWARD_CLOSED_ARROW,
              scale: 3,
              strokeColor: "#000",
            };
            return (
              <Polyline
                key={index}
                path={[routePoints[index - 1], point]} // Segmento entre dos puntos
                options={{
                  strokeColor: segmentColor, // Color dinámico según progreso
                  strokeOpacity: 0.9,
                  strokeWeight: 5, // Grosor de línea
                  icons: mode
                    ? [
                        {
                          icon: arrowIcon,
                          offset: "40px",
                        },
                      ]
                    : [],
                }}
              />
            );
          })}
        </>
      )}

      {pedidoLocations
        ?.filter((loc) => {
          if (!mode) {
            // En modo único, mostrar solo el seleccionado o el primero
            return (
              loc.id === pedidoSeleccionado?.id || loc === pedidoLocations[0]
            );
          }
          // En modo múltiple, mostrar todos
          return true;
        })
        .map((loc) => (
          <Marker
            key={loc.id}
            position={{ lat: loc.lat, lng: loc.lng }}
            icon={{
              url:
                mode && pedidoSeleccionado?.id === loc.id
                  ? "http://maps.google.com/mapfiles/ms/icons/blue-dot.png" // Azul para el seleccionado
                  : "http://maps.google.com/mapfiles/ms/icons/red-dot.png", // Rojo para otros en modo múltiple
            }}
          />
        ))}
   View style {error && (
  <View
    style={{
      position: "absolute",
      top: 10,
      left: "50%",
      transform: [{ translateX: -50 }],
      backgroundColor: "rgba(255, 0, 0, 0.8)",
      padding: 8,
      paddingHorizontal: 16,
      borderRadius: 4,
      zIndex: 1000,
    }}
  >
    <Text style={{ color: "white" }}>{error}</Text>
  </View>
)}
    </GoogleMap>
  );
};

import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  button: {
    position: "absolute",
    top: 10,
    left: 10,
    zIndex: 1000,
    paddingVertical: 8,
    paddingHorizontal: 16,
    backgroundColor: "#4285F4",
    color: "white",
    borderWidth: 0,
    borderRadius: 4,
    cursor: "pointer",
  },
});

export default MapComponent;
