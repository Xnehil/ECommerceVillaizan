import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import axios from "axios";
import { Venta } from "@/interfaces/interfaces";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

interface HistorialVentasProps {
  onClose: () => void;
}

const HistorialVentas: React.FC<HistorialVentasProps> = ({ onClose }) => {
  const [ventas, setVentas] = useState<Venta[]>([]);

  useEffect(() => {
    fetchHistorialVentas();
  }, []);

  const fetchHistorialVentas = async () => {
    try {
      const response = await axios.get(
        `${BASE_URL}/venta/?buscarPor=cliente&id=per_01JBDSEB0CF7M1SWX7G53N1HWQ`
      );
      setVentas(response.data.ventas);
    } catch (error) {
      console.error("Error al obtener historial de ventas:", error);
    }
  };

  const renderVentaItem = ({ item }: { item: Venta }) => (
    <View style={styles.ventaCard}>
      <Text style={styles.texto}>
        <Text style={styles.negrita}>Comprobante:</Text> {item.tipoComprobante} {" "}
        {item.numeroComprobante}
      </Text>
      <Text style={styles.texto}>
        <Text style={styles.negrita}>Fecha:</Text> {new Date(item.fechaVenta).toLocaleDateString()}
      </Text>
      <Text style={styles.texto}>
        <Text style={styles.negrita}>Total:</Text> S/.{item.montoTotal}
      </Text>
      <Text style={styles.texto}>
        <Text style={styles.negrita}>Estado:</Text> {item.estado}
      </Text>
    </View>
  );

  return (
    <View style={styles.modalContainer}>
      <View style={styles.modalContent}>
        <Text style={styles.titulo}>Historial de Ventas</Text>
        <FlatList
          data={ventas}
          renderItem={renderVentaItem}
          keyExtractor={(item) => item.id}
          ListEmptyComponent={<Text>No hay ventas registradas</Text>}
        />
        <TouchableOpacity style={styles.botonCerrar} onPress={onClose}>
          <Text style={styles.botonTexto}>Cerrar</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default HistorialVentas;
const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    width: "90%",
    maxHeight: "80%", // Limita la altura del contenido del modal
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  titulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 15,
  },
  ventaCard: {
    backgroundColor: "#f9f9f9",
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    borderColor: "#ddd",
    borderWidth: 1,
  },
  texto: {
    fontSize: 16,
    marginBottom: 5,
  },
  negrita: {
    fontWeight: "bold",
  },
  botonCerrar: {
    backgroundColor: "#FF5722",
    padding: 10,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 15,
  },
  botonTexto: {
    color: "#fff",
    fontWeight: "bold",
  },
});

