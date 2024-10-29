import React, { useEffect, useRef, useState } from "react";
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

  const [imageOptionsVisible, setImageOptionsVisible] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [motivoMerma, setMotivoMerma] = useState<string>("");
  const [fotoMerma, setFotoMerma] = useState<{
    [key: string]: string | null;
  }>({});
  const [errorMotivoMerma, setErrorMotivoMerma] = useState<string | null>(null);
  const [errorFotoMerma, setErrorFotoMerma] = useState<string | null>(null);
  const [currentImageId, setCurrentImageId] = useState<string | null>(null);

  useEffect(() => {
    if (videoStream && videoRef.current) {
      videoRef.current.srcObject = videoStream; // Asigna el stream al video
    }
  }, [videoStream]);

  const renderImageOptionsModal = () => (
    <Modal
      visible={imageOptionsVisible}
      animationType="slide"
      transparent={true}
      onRequestClose={() => setImageOptionsVisible(false)}
    >
      <View style={[styles.modalContainer, styles.mainModal]}>
        <Text style={styles.modalTitle}>Seleccionar Imagen</Text>

        {videoStream ? (
          <View style={styles.videoWrapper}>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              onLoadedMetadata={() => {
                console.log("Video cargado y listo para capturar.");
              }}
              style={styles.video}
            />
            <TouchableOpacity
              style={styles.captureButtonOverlay}
              onPress={() => capturePhoto(currentImageId!)}
            >
              <Text style={styles.captureButtonText}>Tomar Foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleCameraCapture(currentImageId!)}
            >
              <Text style={styles.optionButtonText}>Tomar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => handleImageSelection(currentImageId!)}
            >
              <Text style={styles.optionButtonText}>
                Seleccionar de la Galería
              </Text>
            </TouchableOpacity>
          </>
        )}

        <TouchableOpacity
          style={styles.cancelButton}
          onPress={() => {
            videoStream?.getTracks().forEach((track) => track.stop());
            setVideoStream(null);
            setImageOptionsVisible(false);
          }}
        >
          <Text style={styles.cancelButtonText}>Cancelar</Text>
        </TouchableOpacity>
      </View>
    </Modal>
  );

  const showImageOptions = (id: string) => {
    setCurrentImageId(id);

    setImageOptionsVisible(true);
  };

  const handleImageSelection = async (id: string) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/*";
    input.capture = "environment";

    input.onchange = async (event: any) => {
      const file = event.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onloadend = () => {
          const imageData = reader.result as string;

          setFotoMerma((prevFotos) => ({
            ...prevFotos,
            [id]: imageData,
          }));
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
    setImageOptionsVisible(false);
  };

  const handleCameraCapture = async (id: string) => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setVideoStream(stream); // Guardamos el stream para usarlo en el modal
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      mostrarMensaje("No se pudo acceder a la cámara.", "confirmacion");
    }
  };

  const capturePhoto = (id: string) => {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      console.error("El video no está listo para capturar.");
      mostrarMensaje(
        "Espere a que el video esté listo para capturar la foto.",
        "confirmacion"
      );
      return;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");

    setFotoMerma((prevFotos) => ({
      ...prevFotos,
      [id]: imageData,
    }));

    videoStream?.getTracks().forEach((track) => track.stop());
    setVideoStream(null);
    setImageOptionsVisible(false);
  };
  const mostrarMensaje = (mensaje: string, tipo: string = "") => {
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

  const cancelarOperacion = () => {
    console.log("Cancelado");
    cerrarModalResumen();
    cerrarModalResumen;
    setModificando(false);
    setRegistrandoMerma(false);
    setInventarioModificado({});
    setMermas({});
  };

  const confirmarOperacion = async (tipo: "modificar" | "merma") => {
    if (tipo === "merma") {
      if (!motivoMerma) {
        setErrorMotivoMerma("Debes ingresar un motivo para la merma.");
        return;
      }
      if (!fotoMerma[currentImageId!]) {
        setErrorFotoMerma("Debes seleccionar una foto para la merma.");
        return;
      }
    }
  
    setErrorMotivoMerma(null);
    setErrorFotoMerma(null);
  
    const operacion = tipo === "modificar" ? inventarioModificado : mermas;
    cerrarModalResumen();
  
    try {
      for (const [id, cantidadModificada] of Object.entries(operacion)) {
        const item = inventario.find((inv) => inv.id === id);
        if (!item) continue;
  
        const diferencia = cantidadModificada - item.stock;
  
        if (tipo === "modificar") {
          if (diferencia > 0) {
            await axios.post(`${baseUrl}/inventarioMotorizado/aumentar/${id}`, {
              cantidad: diferencia,
            });
          } else if (diferencia < 0) {
            await axios.post(`${baseUrl}/inventarioMotorizado/disminuir/${id}`, {
              cantidad: Math.abs(diferencia),
            });
          }
        } else {
          await axios.post(`${baseUrl}/inventarioMotorizado`, {
            producto: { id: item.producto.id },
            motorizado: { id: item.motorizado.id },
            stock: cantidadModificada,
            esMerma: true,
            motivoMerma,
            urlImagenMerma: fotoMerma[id] || "",
            stockMinimo: 0,
          });
  
          await axios.post(`${baseUrl}/inventarioMotorizado/disminuir/${id}`, {
            cantidad: cantidadModificada,
          });
        }
      }
  
      mostrarMensaje(
        `${tipo === "modificar" ? "Inventario" : "Merma"} registrado exitosamente`
      );
  
      obtenerInventario();
    } catch (error) {
      console.error(`Error al registrar ${tipo}:`, error);
      mostrarMensaje(`Error al registrar la ${tipo}.`);
    }
  
    setModificando(false);
    setRegistrandoMerma(false);
    setInventarioModificado({});
    setMermas({});
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
                    cancelarOperacion();
                  }}
                >
                  <Text style={styles.botonTexto2}>Cancelar</Text>
                </TouchableOpacity>
              </>
            )}
          </View>
          {renderImageOptionsModal()}
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

                {registrandoMerma && (
                  <>
                    <Text style={styles.modalText}>Motivo de la Merma:</Text>
                    <TextInput
                      style={styles.input2}
                      value={motivoMerma}
                      onChangeText={setMotivoMerma}
                      placeholder="Escribe el motivo de la merma"
                    />
                    {errorMotivoMerma && (
                      <Text style={styles.errorText}>{errorMotivoMerma}</Text>
                    )}

                    <TouchableOpacity
                      style={styles.optionButton}
                      onPress={() => {
                        showImageOptions(currentImageId!);
                      }}
                    >
                      <Text style={styles.optionButtonText}>
                        Seleccionar Foto
                      </Text>
                    </TouchableOpacity>
                    {errorFotoMerma && (
                      <Text style={styles.errorText}>{errorFotoMerma}</Text>
                    )}
                  </>
                )}
              </ScrollView>
              <View style={styles.modalBotones}>
                <TouchableOpacity
                  style={styles.boton}
                  onPress={cancelarOperacion}
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
  videoWrapper: {
    position: "relative",
    width: "100%",
    height: 400, // Ajusta según tu necesidad
    marginBottom: 20,
  },
  video: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  captureButtonOverlay: {
    position: "absolute",
    bottom: 20,
    alignSelf: "center",
    backgroundColor: "#FF6347",
    padding: 15,
    borderRadius: 50,
    zIndex: 1,
  },
  captureButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
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
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  motivoItemSelected: {
    backgroundColor: "#f0f0f0",
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 5,
  },
  input2: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginVertical: 10,
  },
  mainModal:{
    zIndex: 1000,
  }
});
