import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  Alert,
  Modal,
  Image,
} from "react-native";
import axios from "axios";
import { BASE_URL } from "@env";
import { IGV, GENERIC_USER } from "@/constants/Constantes";
import {
  InventarioMotorizado,
  Producto,
  DetallePedido,
  MetodoDePago,
  Pedido,
  Usuario,
  Venta,
} from "@/interfaces/interfaces";
import { getMotorizadoData, getUserData } from "@/functions/storage";
import { FontAwesome } from "@expo/vector-icons";

export default function SeleccionarProductos({ navigation }: any) {
  const [inventario, setInventario] = useState<InventarioMotorizado[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<
    { producto: Producto; cantidad: number }[]
  >([]);
  const [mensajeModal, setMensajeModal] = useState<string | null>(null);
  const [tipoModal, setTipoModal] = useState<"auto" | "confirmacion">("auto");

  const [metodosPago, setMetodosPago] = useState<MetodoDePago[]>([]);
  const [metodoPagoSelect, setMetodoPagoSelect] = useState<MetodoDePago | null>(
    null
  );
  const [imagenPago, setImagenPago] = useState<string | null>(null);
  const [mostrarResumen, setMostrarResumen] = useState<boolean>(false);
  const [totalResumen, setTotalResumen] = useState<number>(0);

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
    if (metodoPagoSelect === null || metodoPagoSelect.nombre === null) {
      mostrarMensaje("Seleccione un método de pago");
      return;
    }
    try {
      // Crear los DetallePedido y obtener sus IDs
      const detallePedidosPromises = productosSeleccionados.map(
        async (productoSeleccionado) => {
          const detallePedido = {
            id: "",
            creadoEn: new Date().toISOString(),
            actualizadoEn: new Date().toISOString(),
            desactivadoEn: null,
            usuarioCreacion: "per_01JBDSEB0CF7M1SWX7G53N1HWQ",
            usuarioActualizacion: null,
            estaActivo: true,
            cantidad: productoSeleccionado.cantidad,
            subtotal: (
              parseFloat(productoSeleccionado.producto.precioA) *
              productoSeleccionado.cantidad
            ).toString(),
            producto: productoSeleccionado.producto,
          };
          const response = await axios.post(
            `${BASE_URL}/detallePedido`,
            detallePedido
          );
          return response.data.detallePedido;
          //return detallePedido;
        }
      );

      const detalles = await Promise.all(detallePedidosPromises);

      const motorizado = await getMotorizadoData();

      const pedidoCompleto = {
        id: "",
        estado: "Pendiente",
        prioridadEntrega: null,
        total: totalResumen.toString(),
        puntosOtorgados: 0,
        motivoCancelacion: null,
        montoEfectivoPagar: totalResumen.toString(),
        motorizado: motorizado,
        direccion: null,
        usuario: { id: GENERIC_USER } as Usuario,
        urlEvidencia: null,
        detalles,
        metodosPago:
          metodoPagoSelect && metodoPagoSelect.nombre
            ? metodosPago.filter((mp) => mp.nombre === metodoPagoSelect.nombre)
            : [],
      };
      const pedidoResponse = await axios.post(
        `${BASE_URL}/pedido`,
        pedidoCompleto
      );
      const pedidoId = pedidoResponse.data.pedido.id;
      console.log(pedidoResponse);

      // Crear la Venta con el Pedido
      const venta: Venta = {
        tipoComprobante: "Boleta",
        fechaVenta: new Date(),
        numeroComprobante: "001-000001",
        montoTotal: parseFloat(pedidoCompleto.total),
        totalPaletas:
          detalles
            .filter((d) => d.producto.tipoProducto?.nombre === "Paleta")
            .reduce((acc, d) => acc + d.cantidad, 0) || 0,
        totalMafeletas:
          detalles
            .filter((d) => d.producto.tipoProducto?.nombre === "Mafaleta")
            .reduce((acc, d) => acc + d.cantidad, 0) || 0,
        estado: "Entregado",
        totalIgv: parseFloat(pedidoCompleto.total) * IGV,
        pedido: pedidoId,
        ordenSerie: null,
      };
      console.log(venta);
      const ventaResponse = await axios.post(`${BASE_URL}/venta`, venta);
      console.log(ventaResponse);
      const ventaId = ventaResponse.data.id;

      // Crear el Pago con el Venta y Pedido generados
      const pago = {
        esTransferencia: true,
        montoCobrado: parseFloat(pedidoCompleto.total),
        numeroOperacion: null,
        urlEvidencia: null,
        codigoTransaccion: null,
        venta: ventaId,
        metodoPago: pedidoCompleto.metodosPago[0].id,
        banco: null,
        pedido: pedidoId,
      };
      const pagoResponse = await axios.post(`${BASE_URL}/pago`, pago);
      console.log(pagoResponse);

      // Actualizar inventario de cada producto en base a la cantidad seleccionada
      const inventarioUpdates = productosSeleccionados.map(
        async (productoSeleccionado) => {
          const inventarioProducto = inventario.find(
            (item) => item.producto.id === productoSeleccionado.producto.id
          );
          if (inventarioProducto) {
              return axios.post(
                `${BASE_URL}/inventarioMotorizado/disminuir/${inventarioProducto.id}`,
                {
                  cantidad: Math.abs(productoSeleccionado.cantidad),
                }
              );
            
          }
        }
      );

      await Promise.all(inventarioUpdates);
      obtenerInventario();
      mostrarMensaje("Éxito, venta registrada exitosamente.");
      restablecerVenta();
      setMostrarResumen(false);
    } catch (error) {
      console.error("Error al confirmar venta:", error);
      mostrarMensaje("Error, no se pudo registrar la venta.");
    }
  };

  const mostrarMensaje = (
    mensaje: string,
    tipo: "auto" | "confirmacion" = "auto"
  ) => {
    setMensajeModal(mensaje);
    setTipoModal(tipo);

    if (tipo === "auto") {
      setTimeout(() => setMensajeModal(null), 3000);
    }
  };
  useEffect(() => {
    obtenerInventario();
  }, []);

  const obtenerInventario = async () => {
    try {
      const userData = await getUserData();
      if (!userData?.id) throw new Error("No se pudo obtener el usuario.");

      const { data: motorizadoResponse } = await axios.post(
        `${BASE_URL}/motorizado/usuario`,
        { id_usuario: userData.id }
      );

      const motorizadoData = motorizadoResponse.motorizado;

      const { data: inventarioResponse } = await axios.post(
        `${BASE_URL}/inventarioMotorizado/motorizado`,
        { id_motorizado: motorizadoData.id }
      );

      const inventarioValido = inventarioResponse.inventarios.filter(
        (item: InventarioMotorizado) => !item.esMerma
      );

      setInventario(inventarioValido);
    } catch (error) {
      console.error("Error al obtener el inventario:", error);
      mostrarMensaje("Error, no se pudo obtener el inventario.", "auto");
    }
  };

  const alterarCantidad = (producto: Producto, nuevaCantidad: string) => {
    const cantidad = parseInt(nuevaCantidad) || 0;

    // Verifica que la cantidad no sea negativa
    if (cantidad < 0) {
      mostrarMensaje("La cantidad no puede ser negativa.", "confirmacion");
      return;
    }

    const inventarioProducto = inventario.find(
      (item) => item.producto.id === producto.id
    );

    const productoEnVenta = productosSeleccionados.find(
      (p) => p.producto.id === producto.id
    );

    const stockDisponible = inventarioProducto ? inventarioProducto.stock : 0;
    const cantidadActual = productoEnVenta ? productoEnVenta.cantidad : 0;

    // Verifica que la cantidad no supere el stock disponible
    if (cantidad - cantidadActual > stockDisponible) {
      mostrarMensaje(
        "Stock insuficiente. No puedes seleccionar más unidades de las disponibles.",
        "confirmacion"
      );
      return;
    }

    // Actualiza la lista de productos seleccionados
    setProductosSeleccionados((prev) => {
      if (productoEnVenta) {
        return prev.map((p) =>
          p.producto.id === producto.id ? { ...p, cantidad: cantidad } : p
        );
      } else {
        return [...prev, { producto, cantidad }];
      }
    });

    // Ajusta el inventario según la d  iferencia de la cantidad
    const diferencia = cantidad - cantidadActual;

    actualizarInventario(producto.id, -diferencia);
  };

  const agregarProducto = (producto: Producto) => {
    const inventarioProducto = inventario.find(
      (item) => item.producto.id === producto.id
    );

    const productoEnVenta = productosSeleccionados.find(
      (p) => p.producto.id === producto.id
    );
    // Verifica si el inventario tiene stock suficiente
    if (inventarioProducto && inventarioProducto.stock > 0) {
      setProductosSeleccionados((prev) => {
        if (productoEnVenta) {
          // Aumenta la cantidad en productos seleccionados
          return prev.map((p) =>
            p.producto.id === producto.id
              ? { ...p, cantidad: p.cantidad + 1 }
              : p
          );
        } else {
          // Agrega el producto si no estaba previamente seleccionado
          return [...prev, { producto, cantidad: 1 }];
        }
      });

      // Reduce el stock en el inventario
      actualizarInventario(producto.id, -1);
    } else {
      mostrarMensaje(
        "Stock insuficiente, no puedes seleccionar más unidades de las disponibles.",
        "confirmacion"
      );
    }
  };

  const quitarProducto = (producto: Producto) => {
    const productoEnVenta = productosSeleccionados.find(
      (p) => p.producto.id === producto.id
    );

    if (productoEnVenta && productoEnVenta.cantidad > 0) {
      setProductosSeleccionados(
        (prev) =>
          prev
            .map((p) =>
              p.producto.id === producto.id
                ? { ...p, cantidad: p.cantidad - 1 }
                : p
            )
            .filter((p) => p.cantidad > 0) // Elimina productos con cantidad 0
      );

      // Aumentar stock en inventario solo si la cantidad seleccionada era mayor a 0
      actualizarInventario(producto.id, 1);
    } else {
      mostrarMensaje(
        "Error, no puedes disminuir más, la cantidad es 0.",
        "confirmacion"
      );
    }
  };

  const actualizarInventario = (productoId: string, cantidad: number) => {
    setInventario((prev) =>
      prev.map((item) =>
        item.producto.id === productoId
          ? { ...item, stock: item.stock + cantidad }
          : item
      )
    );
  };

  const restablecerVenta = () => {
    setProductosSeleccionados([]); 
    setTotalResumen(0);
    setMetodoPagoSelect(null);
    obtenerInventario();
  };

  const abrirResumenVenta = () => {
    if (productosSeleccionados.length === 0) {
      mostrarMensaje("No has seleccionado ningún producto.", "confirmacion");
      return;
    }
    const total = productosSeleccionados.reduce((acc, item) => {
      const precio = parseFloat(item.producto.precioA);
      return acc + (isNaN(precio) ? 0 : precio) * item.cantidad;
    }, 0);
    setTotalResumen(total);

    setMostrarResumen(true);
  };

  const renderItem = ({ item }: { item: InventarioMotorizado }) => {
    const productoEnVenta = productosSeleccionados.find(
      (p) => p.producto.id === item.producto.id
    );

    return (
      <View style={styles.card}>
        <View style={styles.cardContent}>
          <Text style={styles.productoNombre}>{item.producto.nombre}</Text>
          <Text style={styles.stock}>Disponible: {item.stock} unidades</Text>
          <Text style={styles.stock}>Precio: S/. {item.producto.precioA}</Text>
        </View>
        <View style={styles.cantidadContainer}>
          <TouchableOpacity onPress={() => quitarProducto(item.producto)}>
            <Text style={styles.botonTexto}>-</Text>
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            value={productoEnVenta?.cantidad.toString() || "0"}
            keyboardType="numeric"
            onChangeText={(text) => alterarCantidad(item.producto, text)}
          />
          <TouchableOpacity onPress={() => agregarProducto(item.producto)}>
            <Text style={styles.botonTexto}>+</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const handleCancelar = () => {
    setMostrarResumen(false);
    restablecerVenta();
  };
  return (
    <View style={styles.container}>
      <FlatList
        data={inventario}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
      />
      <TouchableOpacity style={styles.boton} onPress={abrirResumenVenta}>
        <Text style={styles.botonTexto2}>Ir a Resumen de Venta</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.botonRestablecer}
        onPress={restablecerVenta}
      >
        <Text style={styles.botonTexto2}>Restablecer Venta</Text>
      </TouchableOpacity>
      {mensajeModal && (
        <Modal
          visible={true}
          transparent
          animationType="fade"
          onRequestClose={() => setMensajeModal(null)}
        >
          <View style={styles.mensajeModalContainer}>
            <View style={styles.mensajeModalContent}>
              <Text style={styles.mensajeModalTexto}>{mensajeModal}</Text>
              {tipoModal === "confirmacion" && (
                <TouchableOpacity
                  style={styles.boton}
                  onPress={() => setMensajeModal(null)}
                >
                  <Text style={styles.botonTexto2}>Aceptar</Text>
                </TouchableOpacity>
              )}
            </View>
          </View>
        </Modal>
      )}
      {mostrarResumen && (
        <Modal visible={true} transparent animationType="slide">
          <View style={styles.resumenModalContainer}>
            <View style={styles.resumenModalContent}>
              <Text style={styles.titulo}>Resumen de Venta</Text>
              <FlatList
                data={productosSeleccionados}
                style={styles.containerResumen}
                renderItem={({ item }) => (
                  <Text style={styles.productoTexto}>
                    {item.producto.nombre} - {item.cantidad} unidades
                  </Text>
                )}
                keyExtractor={(item) => item.producto.id}
              />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  width: "100%",
                }}
              >
                <Text style={styles.subtitulo}>Total a Pagar: </Text>
                <Text style={styles.subtitulo}>S/. {totalResumen}</Text>
              </View>

              <Text style={styles.subtitulo}>Seleccionar Método de Pago:</Text>
              <FlatList
                data={metodosPago}
                renderItem={({ item }) => {
                  const isSelected = metodoPagoSelect?.id === item.id;
                  return (
                    <TouchableOpacity onPress={() => setMetodoPagoSelect(item)}>
                      <View
                        style={[
                          styles.metodoPagoContainer,
                          isSelected && styles.metodoPagoContainerSelected,
                        ]}
                      >
                        {item.nombre === "plin" ? (
                          <Image
                            source={require("../assets/images/plin.jpg")}
                            style={styles.iconoPago}
                          />
                        ) : item.nombre === "yape" ? (
                          <Image
                            source={require("../assets/images/yape.png")}
                            style={styles.iconoPago}
                          />
                        ) : (
                          <View style={{ padding: 5, paddingRight: 10 }}>
                            <FontAwesome name="money" size={30} color="black" />
                          </View>
                        )}
                        <Text style={styles.metodoTexto}>{item.nombre}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                keyExtractor={(item) => item.id}
              />

              <TouchableOpacity style={styles.boton3} onPress={confirmarVenta}>
                <Text style={styles.botonTexto2}>Confirmar Venta</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.botonCancelar}
                onPress={handleCancelar}
              >
                <Text style={styles.botonTexto3}>Cancelar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#fff",
  },
  card: {
    backgroundColor: "#f9f9f9",
    borderRadius: 10,
    padding: 15,
    marginVertical: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    elevation: 2,
  },
  cardContent: {
    flex: 1,
  },
  productoNombre: {
    fontSize: 18,
    fontWeight: "bold",
  },
  stock: {
    fontSize: 14,
    color: "#888",
    marginTop: 5,
  },
  cantidadContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: 40,
    textAlign: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    marginHorizontal: 10,
  },
  botonTexto: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#4CAF50",
  },
  boton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 20,
  },
  botonRestablecer: {
    backgroundColor: "#FF5722",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  botonTexto2: {
    color: "#fff",
    fontWeight: "bold",
  },
  mensajeModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  mensajeModalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "white",
    borderRadius: 10,
    alignItems: "center",
  },
  mensajeModalTexto: {
    fontSize: 18,
    textAlign: "center",
  },
  container_resumen: {
    flex: 1,
    padding: 20,
    backgroundColor: "#e4e4e4",
    borderRadius: 10,
  },
  resumenModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  resumenModalContent: {
    width: "90%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 15,
    alignItems: "flex-start",
    elevation: 5,
  },
  titulo: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 15,
  },
  containerResumen: {
    width: "100%",
    marginBottom: 20,
  },
  productoTexto: {
    fontSize: 18,
    marginVertical: 5,
  },
  subtitulo: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 10,
  },
  metodoPagoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
  },
  metodoPagoContainerSelected: {
    flexDirection: "row",
    alignItems: "center",
    marginVertical: 10,
    backgroundColor: "#d3f8d3",
    borderColor: "#4CAF50",
    borderWidth: 2,
    borderRadius: 8,
  },
  iconoPago: {
    width: 40,
    height: 40,
    marginRight: 10,
  },
  metodoTexto: {
    fontSize: 18,
  },
  boton3: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  botonCancelar: {
    backgroundColor: "#FF5722",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    width: "100%",
    marginTop: 10,
  },
  botonTexto3: {
    color: "#fff",
    fontWeight: "bold",
  },
});
