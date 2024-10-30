import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Image,
  TouchableOpacity,
  Pressable,
  Modal,
  TextInput,
  Alert,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import SwipeButton from "rn-swipe-button";
import axios from "axios";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import TabBarIcon from "@/components/StyledIcon";
import { DetallePedido } from "@/interfaces/interfaces";
import { Link, router } from "expo-router";
import { getCurrentDelivery, storeCurrentDelivery } from "@/functions/storage";
import { BASE_URL } from "@env";
import { useRef } from "react";

const EntregarPedido = () => {
  const route = useRoute();
  const { pedido } = (route.params as { pedido?: string }) || { pedido: null };

  const parsedPedido = pedido ? JSON.parse(decodeURIComponent(pedido)) : {};

  const [pedidoCompleto, setPedidoCompleto] = useState<any>(null);
  const [modalCancelVisible, setModalCancelVisible] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [otroMotivo, setOtroMotivo] = useState("");
  const [fotoPedido, setFotoPedido] = useState<string | null>(null);
  const [fotoPago, setFotoPago] = useState<string | null>(null);

  const [imageOptionsVisible, setImageOptionsVisible] = useState(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mensajeModal, setMensajeModal] = useState<string | null>(null);
  const [tipoModal, setTipoModal] = useState<"auto" | "confirmacion">("auto");

  const mostrarMensaje = (
    mensaje: string,
    tipo: "auto" | "confirmacion" = "auto"
  ) => {
    setMensajeModal(mensaje);
    setTipoModal(tipo);

    if (tipo === "auto") {
      setTimeout(() => setMensajeModal(null), 3000); // Desvanece automáticamente después de 3 segundos
    }
  };

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
      <View style={styles.modalContainer}>
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
              onPress={() => capturePhoto(currentImageId!, currentImageType!)}
            >
              <Text style={styles.captureButtonText}>Tomar Foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
          <>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() =>
                handleCameraCapture(currentImageId!, currentImageType!)
              }
            >
              <Text style={styles.optionButtonText}>Tomar Foto</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() =>
                handleImageSelection(currentImageId!, currentImageType!)
              }
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

  const [currentImageId, setCurrentImageId] = useState<string | null>(null);
  const [currentImageType, setCurrentImageType] = useState<
    "pedido" | "pago" | null
  >(null);

  const showImageOptions = (id: string, tipo: "pedido" | "pago") => {
    setCurrentImageId(id);
    setCurrentImageType(tipo);
    setImageOptionsVisible(true);
  };


  const handleImageSelection = async (id: string, tipo: "pedido" | "pago") => {
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

          if (tipo === "pedido") {
            setFotoPedido(imageData);
          } else if (tipo === "pago") {
            setFotoPago(imageData);
          }
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
    setImageOptionsVisible(false);
    
  };

  const handleCameraCapture = async (id: string, tipo: "pedido" | "pago") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setVideoStream(stream);
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      mostrarMensaje("No se pudo acceder a la cámara.","confirmacion");
    }
  };

  const capturePhoto = (id: string, tipo: "pedido" | "pago") => {
    const video = videoRef.current;

    if (!video || !video.videoWidth || !video.videoHeight) {
      console.error("El video no está listo para capturar.");
      mostrarMensaje("Espere a que el video esté listo para capturar la foto.", "confirmacion");
      return;
    }

    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;

    context?.drawImage(video, 0, 0, canvas.width, canvas.height);

    const imageData = canvas.toDataURL("image/png");

    if (tipo === "pedido") {
      setFotoPedido(imageData);
    } else if (tipo === "pago") {
      setFotoPago(imageData);
    }

    videoStream?.getTracks().forEach((track) => track.stop()); // Detener la cámara
    setVideoStream(null); // Limpiar el stream
    setImageOptionsVisible(false); // Cerrar el modal
  };

  const enviarImagen = async (id: string, tipo: "pedido" | "pago") => {
    try {
      const imagenData = tipo === "pedido" ? fotoPedido : fotoPago;
      if (!imagenData) throw new Error("No hay imagen disponible.");

      // Convertimos el Data URL (Base64) a un archivo Blob
      const byteString = atob(imagenData.split(",")[1]);
      const mimeString = imagenData.split(",")[0].split(":")[1].split(";")[0];
      const arrayBuffer = new ArrayBuffer(byteString.length);
      const intArray = new Uint8Array(arrayBuffer);

      for (let i = 0; i < byteString.length; i++) {
        intArray[i] = byteString.charCodeAt(i);
      }

      const blob = new Blob([intArray], { type: mimeString });
      const file = new File([blob], `${tipo}-${id}.png`, { type: mimeString });

      const formData = new FormData();
      formData.append("file", file);
      formData.append("fileName", `${tipo}-${id}.png`);
      if (tipo === "pago") {
        formData.append("folderId", "1z4G9rU8EW9whmnrrVcaL76an-8vM-Ncv");
      } else if (tipo === "pedido") {
        formData.append("folderId", "1JZLvX-20RWZdLdOKFMLA-5o25GSI4cNb");
      }
      const response = await axios.post(`${BASE_URL}/imagenes`, formData);

      const { fileUrl } = response.data; 

      mostrarMensaje(`Imagen enviada con éxito: ${fileUrl}`);
      return fileUrl;
    } catch (error) {
      console.error(`Error al enviar la imagen de ${tipo}:`, error);
      mostrarMensaje(`Error al enviar la imagen de ${tipo}.`,"confirmacion");
    }
  };

  const handleCancelEntrega = () => {
    setModalCancelVisible(true); // Mostrar el modal de cancelación
  };

  const confirmarCancelacion = async () => {
    try {
      const motivo =
        motivoCancelacion === "Otro" ? otroMotivo : motivoCancelacion;
      await axios.put(`${BASE_URL}/pedido/${parsedPedido.id}`, {
        estado: "Cancelado",
        motivoCancelacion: motivo,
      });
      mostrarMensaje("Entrega reasignada");
      router.push({
        pathname: "/home/delivery/cancelada",
        params: {},
      });
        } catch (error) {
      console.error("Error al reasignar la entrega:", error);
      mostrarMensaje("Error al reasignar la entrega","confirmacion");
    } finally {
      setModalCancelVisible(false);
    }
  };

  const handleConfirmarEntrega = async () => {
    try {
      const confirm = window.confirm(
        "¿Está seguro de que desea confirmar la entrega?"
      );
      if (!confirm) return;

      await axios.put(`${BASE_URL}/pedido/${parsedPedido.id}`, {
        estado: "Entregado",
      });
      enviarImagen(parsedPedido.id, "pedido");
      enviarImagen(parsedPedido.id, "pago");
      mostrarMensaje("Entrega confirmada");
      router.push({
        pathname: "/home/delivery/confirmada",
        params: {},
      });
    } catch (error) {
      console.error("Error updating pedido:", error);
      mostrarMensaje("Error al confirmar la entrega","confirmacion");
    }
  };

  const fetchPedidoCompleto = async (idPedido: string) => {
    try {
      // Obtener los datos del pedido
      const pedidoResponseDetalle = await axios.get(
        `${BASE_URL}/pedido/${idPedido}/conDetalle?pedido=true`
      );
      const pedidoDataDetalle = pedidoResponseDetalle.data.pedido;

      const pedidoResponse = await axios.get(
        `${BASE_URL}/pedido/${idPedido}?enriquecido=true`
      );
      let pedidoData = pedidoResponse.data.pedido;
      pedidoData.detalles = pedidoDataDetalle.detalles;
      // Mapear los detalles del pedido para obtener los detalles completos
      const detallesPromises = pedidoData.detalles.map(async (detalle: any) => {
        try {
          const detalleResponse = await axios.get(
            `${BASE_URL}/detallePedido/${detalle.id}`
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
      console.log(pedidoData);
      router.replace("/home/delivery/detalles");
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
                pathname: "/home/delivery/detalles",
                params: { id: String(parsedPedido.id) },
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

          <TouchableOpacity
            onPress={() => showImageOptions(pedidoCompleto?.id, "pedido")}
          >
            <TabBarIcon
              IconComponent={FontAwesome}
              name="camera"
              color={fotoPedido ? "#3BD100" : "#C9CC00"}
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
                        {pedidoCompleto?.metodosPago?.[0]?.nombre === "plin" ? (
                          <Image
                            source={require("../../../assets/images/plin.jpg")}
                            style={styles.iconoPago}
                          />
                        ) : pedidoCompleto?.metodosPago?.[0]?.nombre === "yape" ? (
                          <Image
                            source={require("../../../assets/images/yape.png")}
                            style={styles.iconoPago}
                          />
                        ) : (
                          <FontAwesome name="money" size={30} color="black" />
                        )}
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
                  <TouchableOpacity
                    onPress={() => showImageOptions(pedidoCompleto?.id, "pago")}
                  >
                    <TabBarIcon
                      IconComponent={FontAwesome}
                      name="camera"
                      color={
                        fotoPago ? "#3BD100" : "#C9CC00"
                      } // Darker green color
                      size={30}
                    />
                  </TouchableOpacity>
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
      {renderImageOptionsModal()}
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
  videoContainer: {
    width: "100%",
    height: 300,
    marginVertical: 20,
    backgroundColor: "#000",
    borderRadius: 10,
    overflow: "hidden",
  },
  captureButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
  },
  captureButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
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
  cancelButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  motivoItemSelected: {
    backgroundColor: "#f0f0f0",
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

export default EntregarPedido;
