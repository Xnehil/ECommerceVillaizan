import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  FlatList,
  Alert,
  Modal,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "@env";
import { DetallePedido, MetodoDePago, Pedido, Producto } from "@/interfaces/interfaces";

export default function ResumenVenta({ route, navigation }: any) {
  const { productosSeleccionados }: { productosSeleccionados: DetallePedido[] } = route.params;
  const [metodosPago, setMetodosPago] = useState<MetodoDePago[]>([]);
  const [metodoPago, setMetodoPago] = useState<string | null>(null);
  const [imagenPago, setImagenPago] = useState<string | null>(null);

  useEffect(() => {
    obtenerMetodosPago();
  }, []);

  const obtenerMetodosPago = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/metodoPago`);
      setMetodosPago(response.data.metodoPagos);
    } catch (error) {
      console.error("Error al obtener métodos de pago:", error);
    }
  };

  const confirmarVenta = async () => {
    try {
      const venta = {
        productos: productosSeleccionados.map((p: any) => ({
          id: p.producto.id,
          cantidad: p.cantidad,
        })),
        metodoPago,
        imagenPago,
      };

      await axios.post(`${BASE_URL}/ventas`, venta);
      Alert.alert("Éxito", "Venta registrada exitosamente.");
      navigation.goBack();
    } catch (error) {
      console.error("Error al confirmar venta:", error);
      Alert.alert("Error", "No se pudo registrar la venta.");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>Resumen de Venta</Text>
      <FlatList
        data={productosSeleccionados}
        renderItem={({ item }) => (
          <Text style={styles.productoTexto}>
            {item.producto.nombre} - {item.cantidad} unidades
          </Text>
        )}
        keyExtractor={(item) => item.id}
      />
      <Text style={styles.subtitulo}>Seleccionar Método de Pago:</Text>
      <FlatList
        data={metodosPago}
        renderItem={({ item }) => (
          <TouchableOpacity onPress={() => setMetodoPago(item.nombre)}>
            <Text style={styles.metodoTexto}>{item.nombre}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id}
      />
      {metodoPago && ["Yape", "Plin"].includes(metodoPago) && (
        <TouchableOpacity
          onPress={() => {
            /* Lógica de captura de imagen */
          }}
        >
          <Text style={styles.subtitulo}>Capturar Imagen de Pago</Text>
        </TouchableOpacity>
      )}
      <TouchableOpacity style={styles.boton} onPress={confirmarVenta}>
        <Text style={styles.botonTexto}>Confirmar Venta</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  titulo: { fontSize: 24, fontWeight: "bold" },
  subtitulo: { fontSize: 18, marginVertical: 10 },
  productoTexto: { fontSize: 16 },
  metodoTexto: { fontSize: 18, padding: 10 },
  boton: { backgroundColor: "#4CAF50", padding: 15, borderRadius: 8 },
  botonTexto: { color: "#fff", fontWeight: "bold", textAlign: "center" },
});
