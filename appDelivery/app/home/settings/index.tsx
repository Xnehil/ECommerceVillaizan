import React, { useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "@react-navigation/native";

export default function InventoryManagementScreen() {
  const [isConnected, setIsConnected] = useState(true); // Simulamos conexión activa

  return (
    <View style={styles.container}>

      <Text style={styles.greeting}>Opciones de configuracion</Text>
      <Text style={styles.instructions}>
        Asegúrate de configurar correctamente la app para asegurar su correcta labor.
      </Text>

      <Link
        to={"/home/settings/inventory"}
        style={[styles.card, !isConnected && styles.disabledCard]}
      >
        <Pressable
          style={styles.card_inside}
          disabled={!isConnected} // Desactivado si no está conectado
        >
          <MaterialIcons name="inventory" size={24} color="white" />
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, styles.cardContent]}>
              Gestionar Inventario
            </Text>
            <Text style={styles.cardContent}>
              Ingresa y actualiza los productos disponibles
            </Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7", // Fondo claro
  },
  header: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#aa0000", // Fondo rojo para el encabezado
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
  },
  statusText: {
    color: "#ffffff", // Texto blanco para el estado
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
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cardContent: {
    color: "#fff",
  },
  disabledCard: {
    backgroundColor: "gray", // Fondo gris si está desactivado
  },
});

