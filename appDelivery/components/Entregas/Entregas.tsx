import React, { useState, useEffect } from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Pressable,
} from "react-native";
import * as Progress from "react-native-progress";
import { Link } from "expo-router";
import axios from "axios";
import { Usuario, Pedido } from "@/interfaces/interfaces";
import { getUserData } from "@/functions/storage";



export default function Entregas() {
  const [pedidosNuevos, setPedidosNuevos] = useState<Pedido[]>([]);
  const pedidos: Pedido[] = []; // Define the pedidos array
  const [pedidosAceptados, setPedidosAceptados] = useState<Pedido[]>([]);
  const [idCounter, setIdCounter] = useState(1);
  const [tiemposRestantes, setTiemposRestantes] = useState<{
    [key: number]: number;
  }>({});

  // Obtén los datos del usuario
  const getData = async (): Promise<Usuario | null> => {
    try {
      const userData = await getUserData();
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
    setPedidosAceptados(pedidos.slice(0, 2));
    setIdCounter(3);
  }, []);

  useEffect(() => {
    const intervalId = setInterval(() => {
      setTiemposRestantes((prevTiempos) => {
        const nuevosTiempos: { [key: number]: number } = {};
        for (const id in prevTiempos) {
          if (prevTiempos[id] > 0) {
            nuevosTiempos[id] = prevTiempos[id] - 10;
          }
        }
        return nuevosTiempos;
      });
    }, 10);

    return () => clearInterval(intervalId);
  }, []);

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
    onRechazar: (id: number) => void;
  }> = ({ pedido, onRechazar }) => {
    return (
      <View>
        <View style={styles.pedidoContainer}>
          <Text style={styles.address}>{pedido.address}</Text>
          <Text style={styles.distance}>Distancia {pedido.distance} km.</Text>
          <View style={styles.buttonsContainer}>
            <TouchableOpacity style={styles.verMasButton}>
              <Text style={styles.verMasText}>Ver más</Text>
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
      <View style={styles.pedidoAceptadoContainer}>
        <Text style={styles.address}>{pedido.address}</Text>
        <Text style={styles.cliente}>Cliente: {pedido.cliente.nombre}</Text>
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
              {({ pressed }) => <Text style={styles.verMasText}>Ver más</Text>}
            </Pressable>
          </Link>
        </View>
      </View>
    );
  };

  const agregarPedido = () => {
    const nuevoPedido: Pedido = pedidos[idCounter % pedidos.length];
    setIdCounter(idCounter + 1);
    setPedidosNuevos([...pedidosNuevos, nuevoPedido]);

    // Crear un identificador de timeout
    const timeoutId = setTimeout(() => {
      setPedidosNuevos((prevPedidosNuevos) =>
        prevPedidosNuevos.filter((pedido) => pedido.id !== nuevoPedido.id)
      );
      setPedidosAceptados((prevPedidosAceptados) => [
        ...prevPedidosAceptados,
        nuevoPedido,
      ]);
    }, 5000);

    // Guardar el identificador de timeout en el pedido
    nuevoPedido.timeoutId = timeoutId;
  };

  const rechazarPedido = (id: number) => {
    setPedidosNuevos((prevPedidosNuevos) => {
      const pedidoRechazado = prevPedidosNuevos.find(
        (pedido) => pedido.id === id
      );
      if (pedidoRechazado && pedidoRechazado.timeoutId) {
        clearTimeout(pedidoRechazado.timeoutId);
      }
      return prevPedidosNuevos.filter((pedido) => pedido.id !== id);
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.containerMitad}>
        <ScrollView>
          {pedidosNuevos.map((pedido) => (
            <PedidoNotification
              key={pedido.id}
              pedido={pedido}
              onRechazar={rechazarPedido}
            />
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.agregarButton} onPress={agregarPedido}>
          <Text style={styles.agregarButtonText}>+</Text>
        </TouchableOpacity>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7", // Fondo claro
    alignContent: "space-between",
  },
  verMasButton2: {
    backgroundColor: "#fff",
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
});
