import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons"; // Asegúrate de tener esta librería instalada
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useNavigation } from "@react-navigation/native";
import axios from "axios";

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
  const [motorizado, setMotorizado] = useState({});
  const [loading, setLoading] = useState(true); 

  const obtenerMotorizado = async () => {
    try {
      const response = await axios.get('http://localhost:9000/admin/motorizado/');
      // Extrae el primer motorizado
      const repartidor = response.data.motorizadoes[0];
      setMotorizado(repartidor); 
    } catch (error) {
      console.error('Error al obtener motorizado:', error);
    } finally {
      setLoading(false);
    }
  };

  const toggleSwitch = () => setIsConnected((previousState) => !previousState);

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

      <Text style={styles.greeting}>Hola Santiago Castro!</Text>
      <Text style={styles.instructions}>
        Ten en cuenta estos datos, son muy importantes para la asignación de
        órdenes
      </Text>

      <Link to={"/deliverys"} style={styles.card}>
        <Pressable style={styles.card_inside}>
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
      <TouchableOpacity style={styles.card}>
        <MaterialIcons name="directions-car" size={24} color="white" />
        <View style={styles.cardText}>
          <Text style={[styles.cardTitle, styles.cardContent]}>
            Definir vehículo
          </Text>
          <Text style={styles.cardContent}>
            Define el vehículo de la empresa con el que repartirás los pedidos
          </Text>
        </View>
      </TouchableOpacity>

      <TouchableOpacity style={styles.card}>
        <MaterialIcons name="inventory" size={24} color="white" />
        <View style={styles.cardText}>
          <Text style={[styles.cardTitle, styles.cardContent]}>
            Actualizar Inventario
          </Text>
          <Text style={styles.cardContent}>
            Ingresa la cantidad disponible de cada producto
          </Text>
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7", // Fondo claro
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
});
