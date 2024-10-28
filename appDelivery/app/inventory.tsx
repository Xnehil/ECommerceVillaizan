import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Modal,
  TextInput,
  ScrollView,
} from "react-native";
import axios from "axios";
import { getUserData } from "@/functions/storage";
import { Motorizado, InventarioMotorizado } from "@/interfaces/interfaces";
import TabBarIcon from "@/components/StyledIcon";
import Ionicons from "@expo/vector-icons/Ionicons";

const baseUrl = process.env.BASE_URL;

export default function InventarioMotorizadoScreen() {
  const [inventario, setInventario] = useState<InventarioMotorizado[]>([]);
  const [loading, setLoading] = useState(true);
  const [motorizado, setMotorizado] = useState<Motorizado | null>(null);
  const [modificando, setModificando] = useState(false);
  const [registrandoMerma, setRegistrandoMerma] = useState(false);
  const [inventarioModificado, setInventarioModificado] = useState<
    Record<string, number>
  >({});
  const [mermas, setMermas] = useState<Record<string, number>>({});
  const [modalVisible, setModalVisible] = useState(false);
  const [mensajeModal, setMensajeModal] = useState<string | null>(null);

  const mostrarMensaje = (mensaje: string) => {
    setMensajeModal(mensaje);
    setTimeout(() => setMensajeModal(null), 3000);
  };

  const obtenerInventario = async () => {
    try {
      const userData = await getUserData();
      if (!userData?.id) throw new Error("No se pudo obtener el usuario.");

      const { data: motorizadoResponse } = await axios.post(
        `${baseUrl}/motorizado/usuario`,
        {
          id_usuario: userData.id,
        }
      );

      const motorizadoData = motorizadoResponse.motorizado;
      setMotorizado(motorizadoData);

      const { data: inventarioResponse } = await axios.post(
        `${baseUrl}/inventarioMotorizado/motorizado`,
        { id_motorizado: motorizadoData.id }
      );

      const inventarioValido = inventarioResponse.inventarios.filter(
        (item: InventarioMotorizado) => !item.esMerma
      );

      setInventario(inventarioValido);
    } catch (error) {
      console.error("Error al obtener el inventario:", error);
      Alert.alert("Error", "No se pudo obtener el inventario.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    obtenerInventario();
  }, []);

  const handleCantidadChange = (
    id: string,
    nuevaCantidad: number,
    tipo: "modificar" | "merma"
  ) => {
    const update = tipo === "modificar" ? inventarioModificado : mermas;
    const setter = tipo === "modificar" ? setInventarioModificado : setMermas;
    setter({ ...update, [id]: nuevaCantidad });
  };

  const abrirModalResumen = () => setModalVisible(true);
  const cerrarModalResumen = () => setModalVisible(false);

  const confirmarOperacion = async (tipo: "modificar" | "merma") => {
    const operacion = tipo === "modificar" ? inventarioModificado : mermas;
    cerrarModalResumen();
    try {
      for (const [id, cantidad] of Object.entries(operacion)) {
        console.log("Id: " + id);

        if (tipo === "modificar") {
          await axios.patch(`${baseUrl}/inventarioMotorizado/${id}/aumentar`, { cantidad });
        } else {
          const item = inventario.find((inv) => inv.id === id);
          if (item) {
            await axios.post(`${baseUrl}/inventarioMotorizado`, {
              producto: item.producto,
              motorizado: motorizado,
              stock: cantidad,
              esMerma: true,
              motivoMerma: "Producto dañado",
            });
  
            await axios.patch(`${baseUrl}/inventarioMotorizado/${id}/disminuir`, { cantidad });
          }
        }
      }
      mostrarMensaje(`${tipo === "modificar" ? "Inventario" : "Merma"} registrado exitosamente`);
      obtenerInventario();
    } catch (error) {
      console.error(`Error al registrar ${tipo}:`, error);
      mostrarMensaje(`Error al registrar la ${tipo}.`);
    }
  };
  

  const handleIncrement = (id: string, tipo: "modificar" | "merma") => {
    const update = tipo === "modificar" ? inventarioModificado : mermas;
    const currentValue =
      update[id] ||
      (tipo === "modificar"
        ? inventario.find((item) => item.id === id)?.stock || 0
        : 0);

    if (
      tipo === "merma" &&
      currentValue >= (inventario.find((item) => item.id === id)?.stock || 0)
    ) {
      Alert.alert(
        "Error",
        "No puedes registrar más merma que el stock disponible."
      );
      return;
    }

    handleCantidadChange(id, currentValue + 1, tipo);
  };

  const handleDecrement = (id: string, tipo: "modificar" | "merma") => {
    const update = tipo === "modificar" ? inventarioModificado : mermas;
    const currentValue =
      update[id] ||
      (tipo === "modificar"
        ? inventario.find((item) => item.id === id)?.stock || 0
        : 0);

    if (currentValue <= 0) {
      Alert.alert("Error", "No puedes tener una cantidad negativa.");
      return;
    }

    handleCantidadChange(id, currentValue - 1, tipo);
  };

  const renderItem = ({ item }: { item: InventarioMotorizado }) => (
    <View style={styles.productoContainer}>
      <Text style={styles.productoTexto}>{item.producto.nombre}</Text>
      {modificando || registrandoMerma ? (
        <View style={styles.inputContainer}>
          <TouchableOpacity
            onPress={() =>
              handleDecrement(item.id, modificando ? "modificar" : "merma")
            }
          >
            <TabBarIcon
              IconComponent={Ionicons}
              name="remove-circle-outline"
              color="#aa0000"
            />
          </TouchableOpacity>
          <TextInput
            style={styles.input}
            keyboardType="numeric"
            value={String(
              (modificando
                ? inventarioModificado[item.id] ?? item.stock
                : mermas[item.id]) || 0
            )}
            onChangeText={(text) =>
              handleCantidadChange(
                item.id,
                parseInt(text) || 0,
                modificando ? "modificar" : "merma"
              )
            }
          />
          <TouchableOpacity
            onPress={() =>
              handleIncrement(item.id, modificando ? "modificar" : "merma")
            }
          >
            <TabBarIcon
              IconComponent={Ionicons}
              name="add-circle-outline"
              color="#aa0000"
            />
          </TouchableOpacity>
        </View>
      ) : (
        <Text style={styles.cantidadTexto}>{item.stock} und.</Text>
      )}
    </View>
  );

  return (
    <View style={styles.container}>
      {loading ? (
        <Text>Cargando inventario...</Text>
      ) : inventario.length === 0 ? (
        <Text>¡No se te ha asignado inventario aún!</Text>
      ) : (
        <>
          <FlatList
            data={inventario}
            renderItem={renderItem}
            keyExtractor={(item) => item.id}
          />
          <View style={styles.botonesContainer}>
            {!modificando && !registrandoMerma ? (
              <>
                <TouchableOpacity
                  style={styles.boton}
                  onPress={() => {
                    setModificando(true);
                    setRegistrandoMerma(false);
                  }}
                >
                  <Text style={styles.botonTexto2}>Modificar Inventario</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.boton}
                  onPress={() => {
                    setRegistrandoMerma(true);
                    setModificando(false);
                  }}
                >
                  <Text style={styles.botonTexto2}>Registrar Merma</Text>
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.boton}
                  onPress={abrirModalResumen}
                >
                  <Text style={styles.botonTexto2}>Guardar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.boton}
                  onPress={() => {
                    setModificando(false);
                    setRegistrandoMerma(false);
                  }}
                >
                  <Text style={styles.botonTexto2}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>

          <Modal visible={modalVisible} animationType="slide" transparent>
            <View style={styles.modalContainer}>
              <Text style={styles.modalTitle}>Resumen</Text>
              <ScrollView>
                {Object.entries(
                  modificando ? inventarioModificado : mermas
                ).map(([id, cantidad]) => {
                  const producto = inventario.find(
                    (item) => item.id === id
                  )?.producto;
                  return (
                    <Text key={id} style={styles.modalText}>
                      {producto?.nombre}: {cantidad} und.
                    </Text>
                  );
                })}
              </ScrollView>
              <View style={styles.modalBotones}>
                <TouchableOpacity
                  style={styles.boton}
                  onPress={cerrarModalResumen}
                >
                  <Text style={styles.botonTexto2}>Cancelar</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.boton}
                  onPress={() =>
                    confirmarOperacion(modificando ? "modificar" : "merma")
                  }
                >
                  <Text style={styles.botonTexto2}>Confirmar</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Modal>
        </>
      )}
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
  productoContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
    padding: 10,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
  },
  productoTexto: {
    fontSize: 18,
    fontWeight: "bold",
    flex: 2,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  input: {
    width: 60,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 5,
    textAlign: "center",
    marginHorizontal: 10,
  },
  botonesContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  boton: {
    backgroundColor: "#aa0000",
    padding: 15,
    borderRadius: 10,
    flex: 1,
    marginHorizontal: 5,
  },
  botonTexto2: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    backgroundColor: "white",
    padding: 20,
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 10,
    color: "black",
  },
  modalText: {
    fontSize: 18,
    color: "black",
    marginBottom: 5,
  },
  cantidadTexto: {
    fontSize: 18,
    color: "black",
  },
  modalBotones: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
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
});
