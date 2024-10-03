import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import SwipeButton from "rn-swipe-button";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import TabBarIcon from "@/components/StyledIcon";

type Producto = {
  nombre: string;
  cantidad: number;
};

const EntregarPedido = () => {
  const route = useRoute();
  const { pedido } = route.params as { pedido: string };

  const parsedPedido = JSON.parse(decodeURIComponent(pedido));

  return (
    <View style={styles.container}>
      {/* Sección Datos del cliente */}
      <View style={styles.clienteContainer}>
        <View style={styles.tituloContainer}>
          <Text style={styles.titulo}>Datos del cliente</Text>
        </View>

        <View style={styles.clienteRow}>
          <Text style={styles.cliente}>{parsedPedido.cliente.nombre}</Text>
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
              />{" "}
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Sección Datos del pedido */}
      <View style={styles.pedidoContainer}>
        <Text style={styles.titulo}>Datos del pedido</Text>
        <View style={styles.pedidoRow}>
          <View style={styles.pedidoInfo}>
            <Text style={styles.productosText}>
              {parsedPedido.productos
                .map(
                  (producto: Producto) =>
                    `(${producto.cantidad}) ${producto.nombre} `
                )
                .join(", ")}
            </Text>
            <Text style={styles.linkVerMas}>Ver más</Text>
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

      {/* Sección Datos del pago */}
      <View style={styles.pagoContainer}>
        <Text style={styles.titulo}>Datos del pago</Text>
        <View style={styles.detallesPago}>
          <View style={styles.subtotalColumn}>
            <View style={styles.columnTitle}>
              <Text style={styles.subtotalTitulo}>Subtotal:</Text>
            </View>
            <View>
              <Text style={styles.subtotalValor}>
                S/. {parsedPedido.subtotal}
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
                  {/*source={{ uri: parsedPedido.metodosPago[0]?.icono || 'default_icon_uri' }}*/}
                  <View style={{ justifyContent: "center" }}>
                    <Image
                      source={require("../assets/images/yape.png")}
                      style={styles.iconoPago}
                    />
                  </View>

                  <Text style={styles.metodoNombre}>
                    {parsedPedido.metodosPago[0]?.nombre ||
                      "Método de pago no especificado"}
                  </Text>
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

      {/* Swipe Button para confirmar entrega */}
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
    </View>
  );
};

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
  productosText:{
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
  swipeButtonText: {
    fontSize: 18,
    color: "#000",
  },
  swipeButtonContainer: {
    marginTop: 30,
  },
});

export default EntregarPedido;
