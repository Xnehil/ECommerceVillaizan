import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  FlatList,
  TextInput,
} from "react-native";
import { useRouter } from "expo-router";
import axios from "axios";
import { Motorizado, InventarioMotorizado } from "@/interfaces/interfaces";
import { getUserData } from "@/functions/storage";
import { Platform } from "react-native";

let BASE_URL = '';
if (Platform.OS === "web") {
  BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || '';
}
else if(Platform.OS === "android") {
  BASE_URL = process.env.EXPO_PUBLIC_BASE_URL_MOVIL || process.env.EXPO_PUBLIC_BASE_URL || '';
}
else {
  BASE_URL = process.env.EXPO_PUBLIC_BASE_URL || '';
}

export default function FlujoInicialScreen() {
  const [motorizado, setMotorizado] = useState<Motorizado | null>(null);
  const [inventario, setInventario] = useState<InventarioMotorizado[]>([]);
  const [vehiculoConfirmado, setVehiculoConfirmado] = useState(false);
  const [inventarioConfirmado, setInventarioConfirmado] = useState(false);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  // Función para obtener datos iniciales
  const obtenerDatosIniciales = async () => {
    try {
      setLoading(true);

      // Obtener el vehículo del repartidor
      const usuario = await getUserData();
      if (usuario === null) {
        Alert.alert("Error", "No se pudo obtener los datos del usuario");
        return;
      }
      const { data: motorizadoResponse } = await axios.post(
        `${BASE_URL}/motorizado/usuario`,
        { id_usuario: usuario?.id } 
      );
      setMotorizado(motorizadoResponse.motorizado);

      // Obtener el inventario del vehículo
      const { data: inventarioResponse } = await axios.post(
        `${BASE_URL}/inventarioMotorizado/motorizado`,
        { id_motorizado: motorizadoResponse.motorizado.id }
      );
      setInventario(inventarioResponse.inventarios);
    } catch (error) {
      console.error("Error al obtener datos iniciales:", error);
      Alert.alert("Error", "No se pudieron cargar los datos iniciales.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerDatosIniciales();
  }, []);

  // Confirmar vehículo
  const confirmarVehiculo = () => {
    if (!motorizado) {
      Alert.alert("Error", "No se encontró un vehículo asignado.");
      return;
    }
    setVehiculoConfirmado((prev) => !prev);
  };

  // Modificar inventario
  const handleInventarioChange = (id: string, nuevaCantidad: number) => {
    setInventario((prevInventario) =>
      prevInventario.map((item) =>
        item.id === id ? { ...item, stock: nuevaCantidad } : item
      )
    );
  };

  // Confirmar inventario
  const confirmarInventario = () => {
    if (inventario.length === 0) {
      Alert.alert("Error", "No tienes inventario asignado para confirmar.");
      return;
    }
    setInventarioConfirmado((prev) => !prev);
    Alert.alert("Inventario confirmado", "El inventario ha sido confirmado.");
  };

  // Finalizar flujo inicial
  const finalizarFlujoInicial = () => {
    if (!vehiculoConfirmado || !inventarioConfirmado) {
      Alert.alert(
        "Confirmación requerida",
        "Debes confirmar el vehículo e inventario antes de continuar."
      );
      return;
    }
    router.push({
      pathname: "/home",
    });  };

  // Renderizar inventario
  const renderInventarioItem = ({ item }: { item: InventarioMotorizado }) => (
    <View style={styles.inventarioItem}>
      <Text style={styles.productoNombre}>{item.producto.nombre}</Text>
      <TextInput
        style={styles.input}
        keyboardType="numeric"
        value={String(item.stock)}
        onChangeText={(text) => handleInventarioChange(item.id, parseInt(text) || 0)}
      />
    </View>
  );

  if (loading) {
    return (
      <View style={styles.container}>
        <Text>Cargando datos iniciales...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Configuracion Inicial</Text>

      {/* Sección de vehículo */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Vehículo</Text>
        {motorizado ? (
          <>
            <Text>Placa: {motorizado.placa}</Text>
            <Text>Ciudad: {"No asignado"}</Text>
            <TouchableOpacity
              style={vehiculoConfirmado ? styles.button : styles.prevButton}
              onPress={confirmarVehiculo}
            >
              <Text style={styles.buttonText}>
                {vehiculoConfirmado ? "Vehículo confirmado" : "Confirmar Vehículo"}
              </Text>
            </TouchableOpacity>
          </>
        ) : (
          <Text>No se encontró un vehículo asignado.</Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Inventario</Text>
        {inventario.length > 0 ? (
            <>
            <FlatList
              data={inventario}
              renderItem={renderInventarioItem}
              keyExtractor={(item) => item.id}
              style={{ maxHeight: 200 }} // Limitar el tamaño de la FlatList
            />
            <TouchableOpacity
              style={inventarioConfirmado ? styles.button : styles.prevButton}
              onPress={confirmarInventario}
            >
              <Text style={styles.buttonText}>
              {inventarioConfirmado ? "Inventario confirmado" : "Confirmar Inventario"}
              </Text>
            </TouchableOpacity>
            </>
        ) : (
          <Text>No tienes inventario asignado.</Text>
        )}
      </View>

      {/* Botón para finalizar */}
      <TouchableOpacity style={styles.finalButton} onPress={finalizarFlujoInicial}>
        <Text style={styles.finalButtonText}>Finalizar y continuar</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  prevButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#4CAF50",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  finalButton: {
    backgroundColor: "#2196F3",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  finalButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
  inventarioItem: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  productoNombre: {
    fontSize: 16,
  },
  input: {
    width: 60,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    textAlign: "center",
  },
});
