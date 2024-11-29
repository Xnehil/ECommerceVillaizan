import React, { useEffect, useRef, useState } from "react";
import MapView, { Marker, Polyline, Circle, LatLng, Region, PROVIDER_GOOGLE } from "react-native-maps";
import { Coordinate, Pedido, PedidoLoc } from "@/interfaces/interfaces";
import { Button } from "react-native-elements";
import { View,Text } from "react-native";
import axios from "axios";

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
      <View style={{ alignItems: "center", padding: 20 }}>
        <Text style={{ color: "red" }}>Ubicación no disponible.</Text>
      </View>
    );
  }

  const mapRef = useRef<MapView | null>(null);
  const [previousRoutes, setPreviousRoutes] = useState<{
    origin: Coordinate;
    destinations: { lat: number; lng: number }[];
    route: LatLng[];
  }>();
  const [error, setError] = useState<string | null>(null); // Estado para errores

  const mapContainerStyle = {
    height: "400px",
    width: "100%",
  };

  const [center, setCenter] = useState<{ latitude: number; longitude: number }>(location
    ? { latitude: location.latitude, longitude: location.longitude }
    : { latitude: 37.78825, longitude: -122.4324 }
  );

  useEffect(() => {
    if (location) {
      setCenter({ latitude: location.latitude, longitude: location.longitude });
    }
  },[location]);

  const [showRoutes, setShowRoutes] = useState(false);

  const [circleRadius, setCircleRadius] = useState(250);
  const [routePoints, setRoutePoints] = useState<LatLng[]>([]);
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
        const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
          params: {
            origin: `${origin.lat},${origin.lng}`,
            destination: `${destination.lat},${destination.lng}`,
            mode: 'driving',
            key: process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY,
          },
        });

        const result = response.data;
        console.log("Result", result);

        if (result && result.routes && result.routes.length > 0) {
          const route = result.routes[0].overview_polyline.points;
          const decodedRoute = decodePolyline(route);
          return decodedRoute;
        } else {
          throw new Error('No se encontraron rutas para el destino especificado.');
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
  
  const fetchRoute = async (
    origin: { lat: number; lng: number },
    destination: { lat: number; lng: number }
  ) => {
    const response = await axios.get('https://maps.googleapis.com/maps/api/directions/json', {
      params: {
        origin: `${origin.lat},${origin.lng}`,
        destination: `${destination.lat},${destination.lng}`,
        mode: 'driving',
        key: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY, 
      },
    });
  
    const result = response.data;
    console.log("Result", result);
  
    if (result && result.routes && result.routes.length > 0) {
      const route = result.routes[0].overview_polyline.points;
      const decodedRoute = decodePolyline(route);
      return decodedRoute;
    } else {
      throw new Error('No se encontraron rutas para el destino especificado.');
    }
  };
  
  const fetchMultipleRoutes = async (
    origin: { lat: number; lng: number },
    destinations: { lat: number; lng: number }[]
  ) => {
    let lastPoint = origin;
    const points: LatLng[] = [];
  
    for (const destination of destinations) {
      const route = await fetchRoute(lastPoint, destination);
      points.push(...route);
      lastPoint = { lat: destination.lat, lng: destination.lng };
    }
  
    return points;
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
  const calculateCircleRadius = (longitudeDelta: number) => {
    console.log("Calculating circle radius... with delta", longitudeDelta);
    const maxRadius = 500; // Maximum radius in meters
    const minRadius = 20;  // Minimum radius in meters
    const scaleFactor = 100;

    const calculatedRadius = scaleFactor * longitudeDelta;
    return Math.min(Math.max(calculatedRadius, minRadius), maxRadius);
  };
  
  const handleRegionChangeComplete = (region: Region) => {
    if (region && region.longitudeDelta) {
      const newRadius = calculateCircleRadius(region.longitudeDelta);
      setCircleRadius(newRadius);
    }
  };

  useEffect(() => {
    if (mapRef.current && location) {
      const coordinates = [
        { latitude: location.latitude, longitude: location.longitude },
      ];

      if (pedidoLocations) {
        pedidoLocations.forEach((loc) => {
          coordinates.push({ latitude: loc.lat, longitude: loc.lng });
        });
      }

      mapRef.current.fitToCoordinates(coordinates, {
        edgePadding: { top: 50, right: 50, bottom: 50, left: 50 },
        animated: true,
      });
    }
  }, [location, pedidoLocations]);

  return (
    <View style={{ flex: 1 }}>
      <MapView
        ref={mapRef}
        style={{ flex: 1 }}
        provider={PROVIDER_GOOGLE}
        initialRegion={{
          ...center,
          latitudeDelta: 0.1922,
          longitudeDelta: 0.1421,
        }}
        onRegionChangeComplete={handleRegionChangeComplete}
      >
        {location && (
          <Circle
            center={center}
            radius={circleRadius}
            fillColor="rgba(66, 133, 244, 0.8)"
            strokeColor="#4285F4"
            strokeWidth={1}
          />
        )}
        {showRoutes && routePoints.length > 0 && (
          <>
            {routePoints.map((point, index) => {
              if (index === 0) return null;
  
              const progress = index / routePoints.length;
  
              let segmentColor = '#4285F4';
              if (mode) {
                if (progress < 0.5) {
                  segmentColor = `rgba(${Math.round(255 * (progress * 2))}, 255, 0, 0.9)`;
                } else {
                  segmentColor = `rgba(255, ${Math.round(255 * (1 - (progress - 0.5) * 2))}, 0, 0.9)`;
                }
              }
              return (
                <Polyline
                  key={index}
                  coordinates={[routePoints[index - 1], point]}
                  strokeColor={segmentColor}
                  strokeWidth={5}
                />
              );
            })}
          </>
        )}
        {pedidoLocations
          ?.filter((loc) => {
            if (!mode) {
              return loc.id === pedidoSeleccionado?.id || loc === pedidoLocations[0];
            }
            return true;
          })
          .map((loc, index) => (
            <Marker
              key={loc.id}
              coordinate={{ latitude: loc.lat, longitude: loc.lng }}
              image={
          index === 0
            ? require('@/assets/images/blue-dot.png') // Azul para el primer pedido
            : pedidoSeleccionado?.id === loc.id
            ? require('@/assets/images/red-dot.png') // Rojo para el seleccionado
            : require('@/assets/images/green-dot.png') // Verde para otros
              }
            />
          ))}
      </MapView>
  
      {/* Move the error View outside the MapView */}
      {error && (
        <View
          style={{
            position: 'absolute',
            top: 10,
            left: '50%',
            transform: [{ translateX: -0.5 * 300 }], // Adjust based on expected width
            backgroundColor: 'rgba(255, 0, 0, 0.8)',
            padding: 8,
            paddingHorizontal: 16,
            borderRadius: 4,
            zIndex: 1000,
          }}
        >
          <Text style={{ color: 'white' }}>{error}</Text>
        </View>
      )}
    </View>
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

const decodePolyline = (encoded: string): LatLng[] => {
  let points: LatLng[] = [];
  let index = 0, len = encoded.length;
  let lat = 0, lng = 0;

  while (index < len) {
    let b, shift = 0, result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlat = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lat += dlat;

    shift = 0;
    result = 0;
    do {
      b = encoded.charCodeAt(index++) - 63;
      result |= (b & 0x1f) << shift;
      shift += 5;
    } while (b >= 0x20);
    let dlng = ((result & 1) ? ~(result >> 1) : (result >> 1));
    lng += dlng;

    points.push({
      latitude: lat / 1e5,
      longitude: lng / 1e5,
    });
  }

  return points;
};