import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ScrollView, Button, Image } from "react-native";
import { useRoute } from "@react-navigation/native";
import { Link, router } from "expo-router";

import { DetallePedido, Pedido } from "@/interfaces/interfaces";
import { getCurrentDelivery } from "@/functions/storage";
import axios from "axios";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

const DetallesPedido = () => {
  const route = useRoute();
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchPedido = async () => {
    try {
      setError(null); 
      const ped = await getCurrentDelivery();
      if (ped && ped.id) {
        let pedidoCompleto = ped
        const response = await axios.get(`${BASE_URL}/pedido/${ped.id}?enriquecido=true`);
        pedidoCompleto = response.data.pedido;
        
        const response2 = await axios.get(`${BASE_URL}/pedido/${ped.id}/conDetalle?pedido=true`);
        pedidoCompleto.detalles = response2.data.pedido.detalles;

        if (response.data) {
          console.log(pedidoCompleto);
          setPedido(pedidoCompleto);
        } else {
          setError("El pedido ya no existe.");
          router.back();
        }
      } else {
        setError("No se pudo obtener el ID del pedido.");
      }
    } catch (err) {
      setError("Error al cargar los detalles del pedido. Por favor, intente nuevamente.");
    }
  };

  useEffect(() => {
    fetchPedido();
  }, []);

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Detalles del Pedido</Text>
      {error ? (
        <View style={styles.errorContainer}>
          <Text style={styles.errorText}>{error}</Text>
          <Button title="Reintentar" onPress={fetchPedido} />
        </View>
      ) : pedido && pedido.detalles && pedido.detalles.length > 0 ? (
        pedido.detalles.map((detalle: DetallePedido) => (
          <View key={detalle.id} style={styles.detalleContainer}>
            {detalle.producto.urlImagen ? (
              <Image
                source={{ uri: detalle.producto.urlImagen }}
                style={styles.productoImagen}
              />
            ) : (
              <View style={styles.imagenPlaceholder}>
                <Text style={styles.placeholderText}>Sin imagen</Text>
              </View>
            )}
            <View style={styles.detalleInfo}>
              <Text style={styles.productoNombre}>{detalle.producto.nombre}</Text>
              <Text style={styles.cantidad}>Cantidad: {detalle.cantidad}</Text>
            </View>
          </View>
        ))
      ) : (
        <Text style={styles.noDetalles}>No hay detalles del pedido</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  imagenPlaceholder: {
    width: 80,
    height: 80,
    backgroundColor: "#ccc",
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  placeholderText: {
    color: "#777",
    fontSize: 12,
  },
  detalleInfo: {
    flex: 1,
  },
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
    flexDirection: "row", 
  },
  productoNombre: {
    fontSize: 18,
    fontWeight: "bold",
  },
  cantidad: {
    fontSize: 16,
    marginTop: 5,
  },
  productoImagen: {
    width: 80,
    height: 80,
    borderRadius: 10,
    marginRight: 10,
  },
  noDetalles: {
    fontSize: 16,
    color: "#999",
  },
  errorContainer: {
    alignItems: "center",
    justifyContent: "center",
  },
  errorText: {
    fontSize: 16,
    color: "red",
    marginBottom: 10,
  },
});

export default DetallesPedido;