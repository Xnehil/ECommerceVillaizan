import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useRoute } from "@react-navigation/native";
import { DetallePedido, Pedido } from "@/interfaces/interfaces";
import { getCurrentDelivery } from "@/functions/storage";

const DetallesPedido = () => {
  const route = useRoute();



  const [pedido, setPedido] = useState<Pedido | null>(null);

  useEffect(() => {
    const fetchPedido = async () => {
      const ped = await getCurrentDelivery();
      setPedido(ped);
    };

    fetchPedido();
  }, [])

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalles del Pedido</Text>
      {pedido && pedido.detalles && pedido.detalles.length > 0 ? (
        pedido.detalles.map((detalle: DetallePedido) => (
          <View key={detalle.id} style={styles.detalleContainer}>
            <Text style={styles.productoNombre}>
              {detalle.producto.nombre}
            </Text>
            <Text style={styles.cantidad}>
              Cantidad: {detalle.cantidad}
            </Text>
          </View>
        ))
      ) : (
        <Text style={styles.noDetalles}>No hay detalles del pedido</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  detalleContainer: {
    marginBottom: 15,
    padding: 15,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 10,
  },
  productoNombre: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cantidad: {
    fontSize: 16,
    marginTop: 5,
  },
  noDetalles: {
    fontSize: 16,
    color: "#999",
  },
});

export default DetallesPedido;