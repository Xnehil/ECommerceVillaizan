import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import SwipeButton from "rn-swipe-button";
import axios from "axios";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import TabBarIcon from "@/components/StyledIcon";
import { DetallePedido } from "@/interfaces/interfaces";
import { Link, router } from "expo-router";
import { getCurrentDelivery, storeCurrentDelivery } from "@/functions/storage";

const EntregarPedido = () => {
  const route = useRoute();
  const { pedido } = route.params as { pedido?: string } || { pedido: null };

  const parsedPedido = pedido ? JSON.parse(decodeURIComponent(pedido)) : {};

  const [pedidoCompleto, setPedidoCompleto] = useState<any>(null);


  const handleCancelEntrega = async () => {
    try {
      const confirm = window.confirm(
        "¿Está seguro de que desea reasginar la entrega?"
      );
      if (!confirm) return;

      const baseUrl = "http://localhost:9000/admin";
      await axios.put(`${baseUrl}/pedido/${parsedPedido.id}`, {
        estado: "Cancelado",
      });
      alert("Entrega reasginada");
      router.push({
        pathname: "/cancelada",
      });
    } catch (error) {
      console.error("Error updating pedido:", error);
      alert("Error al reasginar la entrega");
    }
  };

  const handleConfirmarEntrega = async () => {
    try {
      const confirm = window.confirm(
        "¿Está seguro de que desea confirmar la entrega?"
      );
      if (!confirm) return;

      const baseUrl = "http://localhost:9000/admin";
      await axios.put(`${baseUrl}/pedido/${parsedPedido.id}`, {
        estado: "Entregado",
      });
      alert("Entrega confirmada");
      router.push({
        pathname: "/confirmada",
      });
    } catch (error) {
      console.error("Error updating pedido:", error);
      alert("Error al confirmar la entrega");
    }
  };

  const fetchPedidoCompleto = async (idPedido: string) => {
    try {
      const baseUrl = "http://localhost:9000/admin";

      // Obtener los datos del pedido
      const pedidoResponseDetalle = await axios.get(
        `${baseUrl}/pedido/${idPedido}/conDetalle`
      );
      const pedidoDataDetalle = pedidoResponseDetalle.data.pedido;

      const pedidoResponse = await axios.get(
        `${baseUrl}/pedido/${idPedido}?enriquecido=true`
      );
      let pedidoData = pedidoResponse.data.pedido;
      pedidoData.detalles = pedidoDataDetalle.detalles;
      // Mapear los detalles del pedido para obtener los detalles completos
      const detallesPromises = pedidoData.detalles.map(async (detalle: any) => {
        try {
          const detalleResponse = await axios.get(
            `${baseUrl}/detallePedido/${detalle.id}`
          );
          return detalleResponse.data.detallePedido;
        } catch (error) {
          console.error(`Error fetching detalle for ID ${detalle.id}:`, error);
          return null; // Si ocurre un error, manejarlo retornando null o un valor por defecto
        }
      });

      // Esperar a que todas las promesas se resuelvan
      const detallesCompletos = await Promise.all(detallesPromises);

      // Filtrar los detalles no válidos (si alguna promesa falló y retornó null)
      pedidoData.detalles = detallesCompletos.filter(
        (detalle) => detalle !== null
      );
      // Establecer el estado una vez que todos los detalles estén listos
      storeCurrentDelivery(pedidoData);
      setPedidoCompleto(pedidoData);
      router.replace('/entregar')
    } catch (error) {
      console.error("Error fetching pedido completo:", error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (parsedPedido?.id) {
        fetchPedidoCompleto(parsedPedido.id);
      } else {
        const pedido = await getCurrentDelivery();
        setPedidoCompleto(pedido);
      }
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.clienteContainer}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Datos del cliente</Text>
        </View>

        <View style={styles.clienteRow}>
          <Text style={styles.cliente}>
            {pedidoCompleto?.usuario?.nombre || "Nombre no disponible"}
          </Text>
          <View style={styles.iconosCliente}>
            <TouchableOpacity>
              <TabBarIcon
                IconComponent={AntDesign}
                name="phone"
                color="black"
                size={30}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
            <TouchableOpacity>
              <TabBarIcon
                IconComponent={FontAwesome}
                name="whatsapp"
                color="green"
                size={30}
                style={{ marginRight: 10 }}
              />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.pedidoContainer}>
        <Text style={styles.titulo}>Datos del pedido</Text>
        <View style={styles.pedidoRow}>
          <View style={styles.pedidoInfo}>
            {Array.isArray(pedidoCompleto?.detalles) &&
            pedidoCompleto.detalles.length > 0 ? (
              <Text style={styles.productosText}>
                {pedidoCompleto.detalles
                  .map(
                    (detalle: DetallePedido) =>
                      `(${detalle?.cantidad || 0}) ${
                        detalle?.producto?.nombre || "Nombre no disponible"
                      }`
                  )
                  .join(", ")}
              </Text>
            ) : (
              <Text style={styles.productosText}>
                No hay detalles del pedido
              </Text>
            )}
            <Link
              href={{
                pathname: "/Detalles",
              }}
              asChild
              id={String(parsedPedido.id)}
            >
              <Pressable>
                {({ pressed }) => (
                  <Text style={styles.linkVerMas}>Ver detalles</Text>
                )}
              </Pressable>
            </Link>
          </View>
          <TouchableOpacity>
            <TabBarIcon
              IconComponent={FontAwesome}
              name="camera"
              color="#C9CC00"
              size={30}
            />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.pagoContainer}>
        <Text style={styles.titulo}>Datos del pago</Text>
        <View style={styles.detallesPago}>
          <View style={styles.subtotalColumn}>
            <View style={styles.columnTitle}>
              <Text style={styles.subtotalTitulo}>Total:</Text>
            </View>
            <View>
              <Text style={styles.subtotalValor}>
                S/. {pedidoCompleto?.total || "Subtotal no disponible"}
              </Text>
            </View>
          </View>
          <View style={styles.metodoPagoColumn}>
            <View style={styles.columnTitle}>
              <Text style={styles.metodoPagoTitulo}>Metodo(s) de pago</Text>
            </View>
            <View style={styles.metodosListado}>
              <View style={styles.metodoInfo}>
                <View style={styles.leftInfo}>
                  {pedidoCompleto?.metodosPago?.[0]?.nombre ? (
                    <>
                      <View style={{ justifyContent: "center" }}>
                        <Image
                          source={require("../assets/images/yape.png")}
                          style={styles.iconoPago}
                        />
                      </View>
                      <Text style={styles.metodoNombre}>
                        {pedidoCompleto.metodosPago[0].nombre}
                      </Text>
                    </>
                  ) : (
                    <Text style={styles.metodoNombre}>
                      Método de pago no especificado
                    </Text>
                  )}
                </View>
                <View style={styles.rightInfo}>
                  <View style={{ justifyContent: "center" }}>
                    <TabBarIcon
                      IconComponent={FontAwesome}
                      name="camera"
                      color="#C9CC00"
                      size={30}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>
        </View>
        <View style={styles.agregarParcialButton}>
          <TouchableOpacity>
            <Text style={styles.agregarParcial}>+ Agregar parcial</Text>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={handleCancelEntrega}
        >
          <Text style={styles.confirmButtonText}>Reasginar entrega</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.confirmButton}
          onPress={handleConfirmarEntrega}
        >
          <Text style={styles.confirmButtonText}>Confirmar entrega</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/*
<View style={styles.swipeButtonContainer}>
        <SwipeButton
          thumbIconBackgroundColor="#FFFFFF"
          thumbIconBorderColor="#E0E0E0"
          railBackgroundColor="#E0E0E0"
          railBorderColor="#E0E0E0"
          title="Confirmar entrega"
          titleStyle={styles.swipeButtonText}
          onSwipeSuccess={() => {
            // Acción después de confirmar
            alert("Entrega confirmada");
          }}
        />
      </View>
*/
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginVertical: 20,
    marginHorizontal: 20,
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "space-between",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  clienteContainer: {
    marginBottom: 10,
  },
  tituloContainer: {
    justifyContent: "center",
  },
  clienteRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  subtotalColumn: {
    flexDirection: "column",
    justifyContent: "flex-start",
    width: "40%",
  },
  titulo: {
    fontSize: 25,
    fontWeight: "bold",
    marginVertical: 10,
  },
  detallesPago: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cliente: {
    fontSize: 20,
  },
  iconosCliente: {
    flexDirection: "row",
  },
  iconoAccion: {
    width: 24,
    height: 24,
    marginLeft: 10,
  },
  pedidoContainer: {
    marginBottom: 10,
  },
  metodosListado: {
    flex: 1,
    width: "100%",
  },
  metodoInfo: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },
  leftInfo: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  rightInfo: {
    justifyContent: "center",
  },
  metodoNombre: {
    paddingHorizontal: 10,
    fontSize: 16,
  },
  agregarParcialButton: {
    alignSelf: "flex-end",
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  columnTitle: {
    marginVertical: 10,
    width: "100%",
  },
  pedidoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  imagenPedido: {
    width: 60,
    height: 60,
    borderRadius: 8,
  },
  pedidoInfo: {
    flex: 1,
    marginLeft: 10,
  },
  productosText: {
    fontSize: 20,
  },
  linkVerMas: {
    color: "blue",
    marginTop: 5,
  },
  pagoContainer: {
    marginBottom: 20,
  },
  subtotalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtotalValor: {
    fontSize: 30,
    fontWeight: "900",
  },
  metodoPagoColumn: {
    alignItems: "center",
    marginBottom: 10,
    width: "60%",
  },
  metodoPagoTitulo: {
    fontSize: 20,
    flex: 1,
    fontWeight: "bold",
  },
  iconoPago: {
    width: 40,
    height: 40,
  },
  agregarParcial: {
    color: "red",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  rejectButton: {
    backgroundColor: "#F44336", // Red color for reject button
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 20,
  },
  confirmButtonText: {
    fontSize: 18,
    color: "#FFF",
    fontWeight: "bold",
  },
  swipeButtonText: {
    fontSize: 18,
    color: "#000",
  },
  swipeButtonContainer: {
    marginTop: 30,
  },
});

export default EntregarPedido;
