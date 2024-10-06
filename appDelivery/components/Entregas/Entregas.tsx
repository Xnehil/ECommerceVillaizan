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

const pedidos: Pedido[] = [
  {
    id: 1,
    address: "Av. José Larco 123, Miraflores",
    distance: 3,
    cliente: {
      nombre: "Ana García",
      telefono: "987654321",
    },
    metodosPago: [{ nombre: "Tarjeta de crédito" }],
    productos: [
      { nombre: "Helado de vainilla", cantidad: 2 },
      { nombre: "Galleta de chocolate", cantidad: 1 },
    ],
    subtotal: 15.0,
  },
  {
    id: 2,
    address: "Calle Puno 456, San Isidro",
    distance: 4,
    cliente: {
      nombre: "José Martínez",
      telefono: "963852741",
    },
    metodosPago: [{ nombre: "Yape" }],
    productos: [
      { nombre: "Helado de chocolate", cantidad: 1 },
      { nombre: "Helado de fresa", cantidad: 2 },
    ],
    subtotal: 18.0,
  },
  {
    id: 3,
    address: "Av. Arequipa 789, Lince",
    distance: 5,
    cliente: {
      nombre: "María Fernández",
      telefono: "912345678",
    },
    metodosPago: [{ nombre: "Efectivo" }],
    productos: [
      { nombre: "Helado de lúcuma", cantidad: 3 },
    ],
    subtotal: 12.0,
  },
  {
    id: 4,
    address: "Jirón de la Unión 321, Cercado de Lima",
    distance: 2,
    cliente: {
      nombre: "Carlos Pérez",
      telefono: "765432198",
    },
    metodosPago: [{ nombre: "Transferencia bancaria" }],
    productos: [
      { nombre: "Helado de maracuyá", cantidad: 2 },
      { nombre: "Helado de chocolate", cantidad: 1 },
    ],
    subtotal: 20.0,
  },
  {
    id: 5,
    address: "Av. Javier Prado 654, San Borja",
    distance: 6,
    cliente: {
      nombre: "Laura Torres",
      telefono: "654321987",
    },
    metodosPago: [{ nombre: "Yape" }],
    productos: [
      { nombre: "Helado de fresa", cantidad: 2 },
      { nombre: "Galleta de vainilla", cantidad: 1 },
    ],
    subtotal: 16.0,
  },
  {
    id: 6,
    address: "Calle San Martín 111, Miraflores",
    distance: 2,
    cliente: {
      nombre: "Sofía Ruiz",
      telefono: "741852963",
    },
    metodosPago: [{ nombre: "Tarjeta de débito" }],
    productos: [
      { nombre: "Helado de frutas mixtas", cantidad: 1 },
      { nombre: "Helado de chocolate", cantidad: 2 },
    ],
    subtotal: 17.0,
  },
  {
    id: 7,
    address: "Av. Tacna 888, Breña",
    distance: 3,
    cliente: {
      nombre: "Diego Jiménez",
      telefono: "852963741",
    },
    metodosPago: [{ nombre: "Efectivo" }],
    productos: [
      { nombre: "Helado de avellana", cantidad: 2 },
    ],
    subtotal: 10.0,
  },
  {
    id: 8,
    address: "Calle 28 de Julio 555, Surco",
    distance: 4,
    cliente: {
      nombre: "Natalia López",
      telefono: "951753486",
    },
    metodosPago: [{ nombre: "Transferencia bancaria" }],
    productos: [
      { nombre: "Helado de mora", cantidad: 1 },
      { nombre: "Helado de mango", cantidad: 1 },
    ],
    subtotal: 14.0,
  },
  {
    id: 9,
    address: "Calle Lima 444, Jesús María",
    distance: 5,
    cliente: {
      nombre: "Andrés Ramírez",
      telefono: "321654987",
    },
    metodosPago: [{ nombre: "Tarjeta de crédito" }],
    productos: [
      { nombre: "Helado de chocolate", cantidad: 1 },
      { nombre: "Helado de fresa", cantidad: 2 },
      { nombre: "Galleta de chocolate", cantidad: 2 },
    ],
    subtotal: 25.0,
  },
  {
    id: 10,
    address: "Av. La Marina 222, San Miguel",
    distance: 6,
    cliente: {
      nombre: "Gabriela Salazar",
      telefono: "159753486",
    },
    metodosPago: [{ nombre: "Yape" }],
    productos: [
      { nombre: "Helado de lúcuma", cantidad: 2 },
      { nombre: "Helado de café", cantidad: 1 },
    ],
    subtotal: 19.0,
  },
];


interface Producto {
  nombre: string;
  cantidad: number;
}

interface Pedido {
  address: string;
  distance: number;
  cliente: {
    nombre: string;
    telefono: string;
  };
  id: number;
  timeoutId?: NodeJS.Timeout;
  metodosPago: { nombre: "Yape" | "Efectivo" | "Plin" | "Transferencia bancaria" | "Tarjeta de crédito" | "Tarjeta de débito" }[];
  productos: Producto[];
  subtotal: GLfloat;
}

export default function Entregas() {
  const [pedidosNuevos, setPedidosNuevos] = useState<Pedido[]>([]);
  const [pedidosAceptados, setPedidosAceptados] = useState<Pedido[]>([]);
  const [idCounter, setIdCounter] = useState(1);
  const [tiemposRestantes, setTiemposRestantes] = useState<{
    [key: number]: number;
  }>({});

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
