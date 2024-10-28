import React, { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Switch,
} from "react-native";
import * as Progress from "react-native-progress";
import { Link, useRouter } from "expo-router";
import axios from "axios";
import { Usuario, Pedido, PedidosResponse } from "@/interfaces/interfaces";
import { getUserData } from "@/functions/storage";
import * as Location from "expo-location";
import Mapa from "./Mapa";
import StyledIcon from "../StyledIcon";
import { BASE_URL } from "@env"; 

export default function Entregas() {
  const [pedidosNuevos, setPedidosNuevos] = useState<Pedido[]>([]);
  const [pedidosAceptados, setPedidosAceptados] = useState<Pedido[]>([]);
  const [idCounter, setIdCounter] = useState(1);
  const [pedidoSeleccionado, setPedidoSeleccionado] = useState<Pedido | null>(
    null
  );
  const [location, setLocation] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [tiemposRestantes, setTiemposRestantes] = useState<{
    [key: string]: number;
  }>({});
  const [timeoutIds, setTimeoutIds] = useState<{
    [key: string]: NodeJS.Timeout;
  }>({});

  const [usuario, setUsuario] = useState<Usuario | null>(null);
  const [modoMultiple, setModoMultiple] = useState(false);

  const getDataMemory = async (): Promise<Usuario | null> => {
    try {
      const userData = await getUserData();
      setUsuario(userData);

      if (!userData) {
        throw new Error("No se pudo obtener los datos del usuario");
      }
      return userData;
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      return null;
    }
  };

  useEffect(() => {
    getDataMemory();
  }, []);

  // Función para obtener los pedidos del usuario repartidor desde el backend
  const fetchPedidos = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/usuario/${usuario?.id}/repartidorPedidos?enriquecido=true`
      );
      const pedidosResponse: PedidosResponse = response.data;
      const pedidosEnProceso = pedidosResponse.pedidos.filter(
        (pedido) => pedido.estado === "enProgreso"
      );
      console.log(pedidosEnProceso);
      setPedidosAceptados(pedidosEnProceso);
      setPedidoSeleccionado(pedidosEnProceso[0]);
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  };

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

    // Obtener la ubicación al cargar el componente
    getLocation();

    // Actualizar la ubicación cada 10 segundos
    const locationInterval = setInterval(getLocation, 10000);

    return () => {
      clearInterval(locationInterval);
    };
  }, []);

  // UseEffect para obtener los pedidos cuando la página cargue
  useEffect(() => {
    if (usuario) {
      fetchPedidos();
    }
  }, [usuario]);

  useEffect(() => {
    pedidosNuevos.forEach((pedido) => {
      if (!tiemposRestantes[pedido.id]) {
        setTiemposRestantes((prevTiempos) => ({
          ...prevTiempos,
          [pedido.id]: 5000,
        }));
      }
    });
  }, [pedidosNuevos]);

  const PedidoNotification: React.FC<{
    pedido: Pedido;
    onRechazar: (id: string) => void;
  }> = ({ pedido, onRechazar }) => {
    return (
      <View>
        <View style={styles.pedidoContainer}>
          <Text style={styles.address}>{pedido.direccion?.calle}</Text>
          <Text style={styles.distance}>
            Distancia {(parseInt(pedido.id) % 10) + 1} km.
          </Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.verMasButton}>
              <Text style={styles.verMasText}>Ver detalles</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rechazarButton}
              onPress={() => onRechazar(pedido.id)}
            >
              <Text style={styles.rechazarText}>Rechazar</Text>
            </TouchableOpacity>
          </View>
        </View>
        <Progress.Bar
          progress={1 - (tiemposRestantes[pedido.id] || 0) / 5000}
          width={null}
          color="#DB5800"
        />
      </View>
    );
  };
  const PedidoAceptado: React.FC<{ pedido: Pedido }> = ({ pedido }) => {
    return (
      <View
        style={[
          styles.pedidoAceptadoContainer,
          pedidoSeleccionado?.id === pedido.id ? styles.selectedPedido : {},
        ]}
      >
        <Text style={styles.address}>
          {pedido.direccion?.calle} {pedido.direccion?.numeroExterior}
        </Text>
        <Text style={styles.cliente}>
          Cliente: {pedido.usuario?.nombre || "Desconocido"}
        </Text>
        <View style={styles.buttonsContainer}>
          <Link
            href={{
              pathname: "/entregar",
              params: {
                pedido: encodeURIComponent(JSON.stringify(pedido)),
              },
            }}
            asChild
            id={String(pedido.id)}
          >
            <Pressable style={styles.verMasButton}>
              {({ pressed }) => (
                <Text style={styles.verMasText}>Ver detalles</Text>
              )}
            </Pressable>
          </Link>
          <TouchableOpacity
            style={styles.verMasButton2}
            onPress={() => setPedidoSeleccionado(pedido)}
          >
            <StyledIcon
              name="map-marker"
              color={"black"}
              IconComponent={FontAwesome}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={styles.toggleContainer}>
        <Text style={styles.toggleLabel}>
          {modoMultiple ? "Modo Múltiple" : "Modo Único"}
        </Text>
        <Switch
          value={modoMultiple}
          onValueChange={(value) => setModoMultiple(value)}
        />
      </View>
      <View style={styles.containerMitad}>
        <Mapa
          location={location}
          pedidoSeleccionado={pedidoSeleccionado}
          pedidos={pedidosAceptados}
          mode = {modoMultiple}
        />
      </View>
      <View>
        <Text style={styles.Titulo}>Tus Entregas</Text>
      </View>
      <View style={styles.containerMitad}>
        <ScrollView>
          {pedidosAceptados.length > 0 ? (
            pedidosAceptados.map((pedido) => (
              <PedidoAceptado key={pedido.id} pedido={pedido} />
            ))
          ) : (
            <Text style={styles.noEntregasText}>
              ¡No hay entregas pendientes!
            </Text>
          )}
        </ScrollView>
      </View>
    </View>
  );
}

/**<View style={styles.containerMitad}>
        <ScrollView>
          {Array.isArray(pedidosNuevos) && pedidosNuevos.length > 0 ? (
            pedidosNuevos.map((pedido) => (
              <PedidoNotification
                key={pedido.id}
                pedido={pedido}
                onRechazar={rechazarPedido}
              />
            ))
          ) : (
            <Text style={styles.noEntregasText}>¡No hay pedidos nuevos!</Text>
          )}
        </ScrollView>
        <TouchableOpacity style={styles.agregarButton} onPress={agregarPedido}>
          <Text style={styles.agregarButtonText}>+</Text>
        </TouchableOpacity>
      </View> */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7", // Fondo claro
    alignContent: "space-between",
  },
  verMasButton2: {
    backgroundColor: "#ededed",
    borderRadius: 10,
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  pedidoAceptadoContainer: {
    backgroundColor: "#6FAF98",
    padding: 20,
    marginVertical: 10,
    borderRadius: 10,
  },
  cardContent: {
    color: "#fff",
  },
  cliente: {
    fontSize: 16,
    color: "#fff",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#aa0000", // Color de fondo del encabezado
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusText: {
    color: "#ffffff", // Color del texto del estado
    fontSize: 18,
    fontWeight: "bold",
  },
  Titulo: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 10,
  },
  greeting: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  instructions: {
    marginBottom: 20,
    fontSize: 16,
    color: "#555",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#aa0000",
    padding: 15,
    borderRadius: 10,
    elevation: 3,
    marginBottom: 15,
  },
  cardText: {
    marginLeft: 10,
    flex: 1,
    color: "#000000",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  toggleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  toggleLabel: { fontSize: 16, fontWeight: "bold" },
  containerMitad: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 8,
    height: "45%",
    backgroundColor: "#e4e4e4",
    borderRadius: 15,
    marginVertical: 10,
  },
  noEntregasText: {
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    justifyContent: "center",
    marginTop: 20,
  },
  pedidoContainer: {
    backgroundColor: "#DB5800",
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
  },
  map: {
    width: "100%",
    height: "100%",
  },
  address: {
    fontSize: 18,
    color: "#fff",
    fontWeight: "bold",
  },
  distance: {
    fontSize: 16,
    color: "#fff",
    marginBottom: 10,
  },
  buttonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  verMasButton: {
    backgroundColor: "#B0B0B0",
    padding: 10,
    borderRadius: 5,
  },
  verMasText: {
    color: "#fff",
  },
  rechazarButton: {
    backgroundColor: "#FFD5C4",
    padding: 10,
    borderRadius: 5,
  },
  rechazarText: {
    color: "#D12525",
  },
  agregarButton: {
    marginTop: 5,
    backgroundColor: "#4CAF50",
    padding: 5,
    borderRadius: 10,
    alignItems: "center",
  },
  containerBotones: {
    alignItems: "flex-end",
  },
  agregarButtonText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "regular",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)", // Fondo semitransparente
  },
  modalContent: {
    width: "80%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    alignItems: "center",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 15,
  },
  cerrarButton: {
    backgroundColor: "#FF6F61",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
  },
  cerrarButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  selectedPedido: {
    backgroundColor: "#FFA07A", // Un color destacado, puedes cambiarlo
    padding: 15,
    marginVertical: 10,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "#FF4500", // Un color que lo diferencie del pedido regular
  },
});
