import React, { useEffect, useRef, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Switch,
  Pressable,
  Modal,
  ScrollView,
  TextInput,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import Ionicons from "@expo/vector-icons/Ionicons";
import { Link, useNavigation } from "@react-navigation/native";

import axios from "axios";
import {
  Motorizado,
  MotorizadoResponse,
  Pedido,
  PedidosResponse,
  Usuario,
  UsuarioResponse,
} from "@/interfaces/interfaces";
import { useRouter } from "expo-router";
import { getUserData, storeMotorizadoData } from "@/functions/storage";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;

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
  const [loading, setLoading] = useState(true);
  const [modalCancelVisible, setModalCancelVisible] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [otroMotivo, setOtroMotivo] = useState("");

  const [data_usuario, setDataUsuario] = useState<Usuario | null>(null);
  const [motorizado, setMotorizado] = useState<Motorizado | null>();
  const [mensajeModal, setMensajeModal] = useState<string | null>(null);
  const [pedidos, setPedidos] = useState<Pedido[]>([]);
  const [tipoModal, setTipoModal] = useState<"auto" | "confirmacion" | "si/no">(
    "auto"
  );
  const [resolveCallback, setResolveCallback] = useState<null | Function>(null);

  const mostrarMensaje = (
    mensaje: string,
    tipo: "auto" | "si/no" | "confirmacion" = "auto"
  ): Promise<boolean> => {
    setMensajeModal(mensaje);
    setTipoModal(tipo);

    if (tipo === "auto") {
      setTimeout(() => setMensajeModal(null), 3000);
      return Promise.resolve(false); // No necesita confirmación
    }

    if (tipo === "si/no") {
      return new Promise((resolve) => {
        setResolveCallback(() => resolve);
      });
    }

    return Promise.resolve(false);
  };

  // Obtén los datos del usuario
  const getData = async (): Promise<Usuario | null> => {
    try {
      const userData = await getUserData();
      if (!userData) {
        throw new Error("No se pudo obtener los datos del usuario");
      }
      return userData;
    } catch (error) {
      console.error("Error al obtener los datos del usuario:", error);
      return null;
    }
  };

  // Obtener motorizado y su estado de actividad
  const obtenerMotorizado = async () => {
    try {
      const userData = await getData();
      if (userData?.id) {
        const response = await axios.post<MotorizadoResponse>(
          `${BASE_URL}/motorizado/usuario`,
          {
            id_usuario: userData?.id,
          }
        );
        const motorizado = response.data.motorizado;
        console.log(motorizado);
        storeMotorizadoData(motorizado);
        setMotorizado(motorizado);
        const usuario = motorizado.usuario;
        setDataUsuario(usuario);
        setIsConnected(motorizado?.disponible ?? false);
        console.log("Usuario obtenido con éxito:", usuario);
      } else {
        console.error("No se encontró el ID de usuario");
      }
    } catch (error) {
      console.error("Error al obtener usuario:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerMotorizado();

  }, []);

  // Función para actualizar el estado 'estaActivo' en la base de datos
  const actualizarEstadoMotorizado = async (nuevoEstado: boolean) => {
    if (motorizado?.id && nuevoEstado == true) {
      try {
        const response = await axios.put(
          `${BASE_URL}/motorizado/${motorizado.id}`,
          { disponible: true }
        );
        console.log(response.data);
        console.log("Estado del motorizado actualizado con éxito.");
        setIsConnected(true);
      } catch (error) {
        console.error("Error al actualizar el estado del motorizado:", error);
      }
    } else if (motorizado?.id && nuevoEstado == false) {
      const pedidosEnProceso = await fetchPedidos();
      setPedidos(pedidosEnProceso ?? []);
      if (pedidosEnProceso && pedidosEnProceso.length > 0) {
        setModalCancelVisible(true);
      } else {
        setIsConnected(false);
      }
    }
  };

  async function fetchPedidos() {
    if (!data_usuario?.id) {
      console.log("Usuario no encontrado");
      return;
    }
    try {
      const response = await axios.get(
        `${BASE_URL}/usuario/${data_usuario?.id}/repartidorPedidos`
      );
      console.log(data_usuario?.id);
      const pedidosResponse: PedidosResponse = response.data;
      const pedidosEnProceso = pedidosResponse.pedidos.filter(
        (pedido) =>
          //pedido.estado === "solicitado" ||
          pedido.estado === "verificado" || pedido.estado === "enProgreso"
      );
      return pedidosEnProceso;
    } catch (error) {
      console.error("Error al obtener los pedidos:", error);
    }
  }

  // Función para manejar el cambio del switch
  const toggleSwitch = async () => {
    const nuevoEstado = !isConnected;
    await actualizarEstadoMotorizado(nuevoEstado);
  };

  const confirmarCancelacion = async () => {
    if ((motivoCancelacion === "Otro" && otroMotivo === "") || otroMotivo) {
      mostrarMensaje("Por favor, especifica el motivo de la cancelación");
      return;
    }
    const confirmacion = await mostrarMensaje(
      "Se reasignarán todos los pedidos que se le han asignado",
      "si/no"
    );

    if (confirmacion == true && motorizado?.id) {
      try {
        const response = await axios.put(
          `${BASE_URL}/motorizado/${motorizado.id}`,
          { disponible: false }
        );
        console.log(response.data);
        console.log("Estado del motorizado actualizado con éxito.");
        setIsConnected(false);
      } catch (error) {
        console.error("Error al actualizar el estado del motorizado:", error);
      }
      //Reasignar los pedidos, estado = reasignar
      try {
        for (const pedido of pedidos) {
          const response = await axios.put(`${BASE_URL}/pedido/${pedido.id}`, {
            estado: "manual",
            motivoCancelacion:
              motivoCancelacion === "Otro" ? otroMotivo : motivoCancelacion,
          });
          console.log(response.data);
        }
      } catch (error) {
        console.error("Error al reasignar los pedidos:", error);
        mostrarMensaje(
          "Error al reasignar los pedidos, favor intentar de nuevo",
          "auto"
        );
      }
      try {
        const promises = pedidos.map((pedido) =>
          axios.put(`${BASE_URL}/pedido/${pedido.id}`, {
            estado: "reasignar",
            motivoCancelacion:
              motivoCancelacion === "Otro" ? otroMotivo : motivoCancelacion,
          })
        );
        const responses = await Promise.all(promises);
        responses.forEach((response) => console.log(response.data));
      } catch (error) {
        console.error("Error al reasignar los pedidos:", error);
        mostrarMensaje(
          "Error al reasignar los pedidos, favor intentar de nuevo",
          "auto"
        );
      }
      setModalCancelVisible(false);
      setIsConnected(false);
      motivoCancelacion;
    }
  };

  const handleRespuestaModal = (respuesta: boolean) => {
    if (resolveCallback) resolveCallback(respuesta);
    setMensajeModal(null);
    setResolveCallback(null);
  };
  const navigation = useNavigation();

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
      <Text style={styles.greeting}>
        Hola {data_usuario?.nombre || "Repartidor"}!
      </Text>
      <Text style={styles.instructions}>
        Ten en cuenta estos datos, son muy importantes para la asignación de
        órdenes
      </Text>

      <View
        style={[styles.card, !isConnected && styles.disabledCard]}
      >
        <Pressable style={styles.card_inside} disabled={!isConnected} onPress={() => {
          if (isConnected) navigation.navigate("delivery"); 
        }}>
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
      </View>

      <Link to={"/home/settings/inventory"} style={styles.card}>
        <Pressable style={styles.card_inside}>
          <MaterialIcons name="inventory" size={24} color="white" />
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, styles.cardContent]}>
              Actualizar Inventario
            </Text>
            <Text style={styles.cardContent}>
              Ingresa la cantidad disponible de cada producto
            </Text>
          </View>
        </Pressable>
      </Link>
      <Link to={"/venta"} style={styles.card}>
        <Pressable style={styles.card_inside}>
          <MaterialIcons name="point-of-sale" size={24} color="white" />
          <View style={styles.cardText}>
            <Text style={[styles.cardTitle, styles.cardContent]}>
              Realizar venta
            </Text>
            <Text style={styles.cardContent}>Registra una venta externa</Text>
          </View>
        </Pressable>
      </Link>
      <Modal
        visible={modalCancelVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setModalCancelVisible(false)}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Cancelar Entrega</Text>
          <Text style={styles.modalSubtitle}>Selecciona el motivo:</Text>
          <ScrollView>
            {[
              "Pedido excede stock",
              "Problemas mecánicos",
              "Condiciones climáticas adversas",
              "Pedido en hora no disponible",
              "Ubicación insegura",
              "Problemas de salud",
              "Falta de medios de pago",
              "Otro",
            ].map((motivo) => (
              <TouchableOpacity
                key={motivo}
                onPress={() => setMotivoCancelacion(motivo)}
                style={[
                  styles.motivoItem,
                  motivoCancelacion === motivo && styles.motivoItemSelected,
                ]}
              >
                <Text
                  style={[
                    styles.motivoText,
                    motivoCancelacion === motivo && styles.motivoTextSelected,
                  ]}
                >
                  {motivo}
                </Text>
              </TouchableOpacity>
            ))}
            {motivoCancelacion === "Otro" && (
              <TextInput
                style={styles.input}
                placeholder="Especifica el motivo"
                value={otroMotivo}
                onChangeText={setOtroMotivo}
              />
            )}
          </ScrollView>
          <View style={styles.modalBotones}>
            <TouchableOpacity
              style={styles.boton}
              onPress={() => setModalCancelVisible(false)}
            >
              <Text style={styles.botonTexto2}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.boton}
              onPress={confirmarCancelacion}
            >
              <Text style={styles.botonTexto2}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
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
              {tipoModal === "si/no" && (
                <View style={styles.botonesContainer}>
                  <TouchableOpacity
                    style={styles.boton}
                    onPress={() => handleRespuestaModal(false)}
                  >
                    <Text style={styles.botonTexto}>Cancelar</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.boton}
                    onPress={() => handleRespuestaModal(true)}
                  >
                    <Text style={styles.botonTexto}>Confirmar</Text>
                  </TouchableOpacity>
                </View>
              )}
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
    </View>
  );
}

/*<Link to={"/home/vehicule"} style={styles.card}>
        <Pressable style={styles.card_inside}>
          <MaterialIcons name="directions-car" size={24} color="white" />
          <View style={styles.cardText}>
        <Text style={[styles.cardTitle, styles.cardContent]}>
          Definir vehículo
        </Text>
        <Text style={styles.cardContent}>
          Define el vehículo de la empresa con el que repartirás los pedidos
        </Text>
          </View>
        </Pressable>
      </Link>*/

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f7f7f7", // Fondo claro
  },
  button: {
    backgroundColor: "#aa0000",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 15,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
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
  disabledCard: {
    backgroundColor: "gray",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    padding: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
  },
  modalSubtitle: {
    fontSize: 18,
    marginBottom: 10,
  },
  motivoItem: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ddd",
  },
  motivoText: {
    fontSize: 16,
  },

  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginTop: 10,
  },
  motivoTextSelected: {
    fontWeight: "bold",
    color: "#aa0000",
  },
  optionButton: {
    backgroundColor: "#4CAF50", // Verde para las opciones de cámara y galería
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 5,
  },
  optionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  cancelButton: {
    backgroundColor: "#F44336", // Rojo para el botón de cancelar
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  modalBotones: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  boton: {
    backgroundColor: "#aa0000", // Rojo oscuro
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
    marginHorizontal: 5,
    flex: 1,
  },
  botonTexto2: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  motivoItemSelected: {
    backgroundColor: "#f0f0f0",
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

  metodoInfoContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 5,
    padding: 10,
    elevation: 2, // Sombra para destacar cada método
  },
  botonesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
  },
  botonTexto: {
    color: "white",
    fontSize: 14,
  },
});
