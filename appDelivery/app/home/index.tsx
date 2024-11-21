import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link } from "@react-navigation/native";
import axios from "axios";
import {
  Motorizado,
  MotorizadoResponse,
  Usuario,
  UsuarioResponse,
} from "@/interfaces/interfaces";
import { useRouter } from "expo-router";
import { getUserData, storeMotorizadoData } from "@/functions/storage";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL; 

function Icon(props: {
  name: React.ComponentProps<typeof Ionicons>["name"];
  color: string;
  imgSize: number;
  marginVertical: number;
  marginHorizontal: number;
}) {
  return (
    <Ionicons
      size={props.imgSize}
      style={{
        marginVertical: props.marginVertical,
        marginHorizontal: props.marginHorizontal,
      }}
      {...props}
    />
  );
}

export default function TabOneScreen() {
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  const [data_usuario, setDataUsuario] = useState<Usuario | null>(null);
  const [motorizado,setMotorizado] = useState<Motorizado | null>();

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

  // Obtener motorizado y su estado de actividad
  const obtenerMotorizado = async () => {
    try {
      const userData = await getData();
      if (userData?.id) {
        const response = await axios.post<MotorizadoResponse>(
          `${BASE_URL}/motorizado/usuario`,
          {
            id_usuario: userData?.id
          }
        );
        const motorizado = response.data.motorizado;
        console.log(motorizado);
        storeMotorizadoData(motorizado);
        setMotorizado(motorizado)
        const usuario = motorizado.usuario;
        setDataUsuario(usuario);
        setIsConnected(motorizado?.disponible ?? false);
        console.log("Usuario obtenido con éxito:", usuario);
      } else {
        console.error("No se encontró el ID de usuario");
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerMotorizado();
  }, []);

  // Función para actualizar el estado 'estaActivo' en la base de datos
  const actualizarEstadoMotorizado = async (nuevoEstado: boolean) => {
    console.log("Estado " + nuevoEstado);
    console.log("Data motorizado: " + motorizado);
    if (motorizado?.id) {
      try {
        const response = await axios.put(
          `${BASE_URL}/motorizado/${motorizado.id}`,
          { disponible: nuevoEstado }
        );
        console.log(response.data);
        console.log("Estado del motorizado actualizado con éxito.");
      } catch (error) {
        console.error("Error al actualizar el estado del motorizado:", error);
      }
    }
  };

  // Función para manejar el cambio del switch
  const toggleSwitch = async () => {
    const nuevoEstado = !isConnected;
    await actualizarEstadoMotorizado(nuevoEstado);
    setIsConnected(nuevoEstado);
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Icon
          name="menu"
          color={"white"}
          imgSize={24}
          marginVertical={0}
          marginHorizontal={0}
        />
        <Text style={styles.statusText}>
          Estás {isConnected ? "conectado" : "desconectado"}
        </Text>
        <Switch
          value={isConnected}
          onValueChange={toggleSwitch}
          thumbColor={isConnected ? "#E0AC00" : "#000"}
          trackColor={{ false: "#e4e4e4", true: "#E0AC00" }}
        />
      </View>
      <Text style={styles.greeting}>
        Hola {data_usuario?.nombre || "Repartidor"}!
      </Text>
      <Text style={styles.instructions}>
        Ten en cuenta estos datos, son muy importantes para la asignación de
        órdenes
      </Text>

      <Link
        to={"/home/delivery"}
        style={[styles.card, !isConnected && styles.disabledCard]}
      >
        <Pressable
          style={styles.card_inside}
          disabled={!isConnected} 
        >
          <MaterialIcons name="list-alt" size={24} color="white" />
          <View style={styles.cardText}>
        <Text style={[styles.cardTitle, styles.cardContent]}>
          Ver mis entregas
        </Text>
        <Text style={styles.cardContent}>
          Ver tus entregas activas y todos los disponibles
        </Text>
          </View>
        </Pressable>
      </Link>



      <Link to={"/home/settings/inventory"} style={styles.card}>
        <Pressable style={styles.card_inside}>
          <MaterialIcons name="inventory" size={24} color="white" />
          <View style={styles.cardText}>
        <Text style={[styles.cardTitle, styles.cardContent]}>
          Actualizar Inventario
        </Text>
        <Text style={styles.cardContent}>
          Ingresa la cantidad disponible de cada producto
        </Text>
          </View>
        </Pressable>
      </Link>
      <Link to={"/venta"} style={styles.card}>
        <Pressable style={styles.card_inside}>
          <MaterialIcons name="point-of-sale" size={24} color="white" />
          <View style={styles.cardText}>
        <Text style={[styles.cardTitle, styles.cardContent]}>
          Realizar venta
        </Text>
        <Text style={styles.cardContent}>
          Registra una venta externa
        </Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
}

      /*<Link to={"/home/vehicule"} style={styles.card}>
        <Pressable style={styles.card_inside}>
          <MaterialIcons name="directions-car" size={24} color="white" />
          <View style={styles.cardText}>
        <Text style={[styles.cardTitle, styles.cardContent]}>
          Definir vehículo
        </Text>
        <Text style={styles.cardContent}>
          Define el vehículo de la empresa con el que repartirás los pedidos
        </Text>
          </View>
        </Pressable>
      </Link>*/
      
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7", // Fondo claro
  },
  button: {
    backgroundColor: "#aa0000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  cardContent: {
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
  card_inside: {
    flexDirection: "row",
    flex: 1,
  },
  cardText: {
    marginHorizontal: 10,
    flex: 1,
    color: "#000000",
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  disabledCard: {
    backgroundColor: "gray",
  },
});
