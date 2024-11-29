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
  FlatList,
  ActivityIndicator,
  Button,
} from "react-native";
import { useRoute } from "@react-navigation/native";
import SwipeButton from "rn-swipe-button";
import axios from "axios";
import { AntDesign, FontAwesome, Ionicons } from "@expo/vector-icons";
import TabBarIcon from "@/components/StyledIcon";
import {
  DetallePedido,
  MetodoDePago,
  Pago,
  Pedido,
  PedidoXMetodoPago,
  Venta,
} from "@/interfaces/interfaces";
import { Link, router } from "expo-router";
import {
  getCurrentDelivery,
  getUserData,
  storeCurrentDelivery,
} from "@/functions/storage";
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
import { useRef } from "react";
import { Picker } from "@react-native-picker/picker";
import * as Linking from "expo-linking";
import { Platform } from "react-native";
import {
  Camera,
  CameraView,
  CameraType,
  useCameraPermissions,
} from "expo-camera";

const EntregarPedido = () => {
  const [facing, setFacing] = useState<CameraType>("back");
  const [permission, requestPermission] = useCameraPermissions();
  const [photo, setPhoto] = useState();

  const [isCameraActive, setIsCameraActive] = useState(false); // Para controlar la visibilidad de la cámara

  const route = useRoute();
  const { pedido } = (route.params as { pedido?: string }) || { pedido: null };
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [loadingMessage, setLoadingMessage] = useState<string | null>(
    "Cargando"
  );
  const parsedPedido = pedido ? JSON.parse(decodeURIComponent(pedido)) : {};

  const [pedidoCompleto, setPedidoCompleto] = useState<Pedido | null>(null);
  const [modalCancelVisible, setModalCancelVisible] = useState(false);
  const [motivoCancelacion, setMotivoCancelacion] = useState("");
  const [otroMotivo, setOtroMotivo] = useState("");
  const [fotoPedido, setFotoPedido] = useState<string | null>(null);
  const [fotosPago, setFotosPago] = useState<Record<string, string | null>>({});

  const [imageOptionsVisible, setImageOptionsVisible] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [mensajeModal, setMensajeModal] = useState<string | null>(null);
  const [tipoModal, setTipoModal] = useState<"auto" | "confirmacion" | "si/no">(
    "auto"
  );
  const [currentImageId, setCurrentImageId] = useState<string | null>(null);
  const [currentImageType, setCurrentImageType] = useState<
    "pedido" | "pago" | null
  >(null);
  const [imageView, setImageView] = useState<boolean>(false);
  const [editPagoModalVisible, setEditPagoModalVisible] = useState(false);
  const [metodosPagoEditados, setMetodosPagoEditados] = useState<
    PedidoXMetodoPago[]
  >(pedidoCompleto?.pedidosXMetodoPago || []);
  const [resolveCallback, setResolveCallback] = useState<null | Function>(null);
  const cameraRef = useRef(null);

  const takePhoto = async () => {
    if (cameraRef.current) {
      const photo = await cameraRef.current.takePictureAsync();
      if (currentImageType == "pedido"){
        setFotoPedido(photo);
        setCurrentImageId(pedidoCompleto?.id ?? null);
      }
      else if (currentImageType == "pago"){
        setFotosPago((prev) => ({ ...prev, [pedidoCompleto?.id ??
          ""]: photo }));
        }
      setIsCameraActive(false);
      
    } else {
      Alert.alert("Error", "No se pudo capturar la foto");
    }
  };
  const makeCall = async () => {
    console.log("Haciendo llamada");
    const usuario = await getUserData();
    const response = mostrarMensaje(
      "Seguro que desea llamar al usuario?",
      "si/no"
    );
    if (await response) {
      if (usuario == null) {
        console.log("Sin usuario");

        mostrarMensaje("Error al cargar su numero de telefono");
      } else {
        console.log("Usuario cargado");

        const phoneNumber = usuario.numeroTelefono;
        const url = `tel:${phoneNumber}`;

        if (Platform.OS === "web") {
          mostrarMensaje(
            "No compatible Realizar llamadas no está disponible en navegadores."
          );
          console.log("Llamada no está disponible");

          return;
        }

        Linking.canOpenURL(url)
          .then((supported) => {
            if (!supported) {
              Alert.alert(
                "Error",
                "Tu dispositivo no puede realizar llamadas."
              );
            } else {
              return Linking.openURL(url);
            }
          })
          .catch((err) =>
            console.error("Error al intentar realizar la llamada:", err)
          );
      }
    }
  };

  const metodoPagoVacio = {
    id: "",
    creadoEn: "",
    actualizadoEn: "",
    desactivadoEn: null,
    usuarioCreacion: "",
    usuarioActualizacion: null,
    estaActivo: true,
    monto: 0,
    metodoPago: {
      id: "",
      creadoEn: "",
      actualizadoEn: "",
      desactivadoEn: null,
      usuarioCreacion: "",
      usuarioActualizacion: null,
      estaActivo: true,
      nombre: "",
    },
    pedido: {} as Pedido,
    Pago: null,
  };
  const [nuevoMetodoPago, setNuevoMetodoPago] =
    useState<PedidoXMetodoPago>(metodoPagoVacio);

  // Función para abrir el modal de edición
  const handleEditarPago = () => {
    setMetodosPagoEditados(pedidoCompleto?.pedidosXMetodoPago || []);
    setEditPagoModalVisible(true);
  };

  // Función para agregar un método de pago
  const agregarMetodoPago = () => {
    if (
      !nuevoMetodoPago ||
      !nuevoMetodoPago.metodoPago ||
      nuevoMetodoPago.monto <= 0
    ) {
      mostrarMensaje(
        "Ingrese un método de pago y un monto válido",
        "confirmacion"
      );
      return;
    }

    const metodoDePago: PedidoXMetodoPago = {
      id: nuevoMetodoPago.id,
      estaActivo: true,
      monto: nuevoMetodoPago.monto,
      metodoPago: {
        id: nuevoMetodoPago.metodoPago.id,
        estaActivo: true,
        nombre: nuevoMetodoPago.metodoPago.nombre,
      },
      pedido: pedidoCompleto as Pedido,
      Pago: null,
    };
    console.log(metodoDePago);
    setMetodosPagoEditados((prev) => [...prev, metodoDePago]);
    setNuevoMetodoPago(metodoPagoVacio);
  };

  // Función para eliminar un método de pago
  const eliminarMetodoPago = (id: string) => {
    setMetodosPagoEditados((prev) => prev.filter((mp) => mp.id !== id));
  };
  const confirmarCambiosPago = async () => {
    try {
      if (metodosPagoEditados.length === 0) {
        mostrarMensaje("Debe haber al menos un método de pago", "confirmacion");
        return;
      }

      const sumaMontos = metodosPagoEditados.reduce((acc, metodo) => {
        if (typeof metodo.monto === "number") {
          return acc + metodo.monto;
        } else {
          return acc + Number(metodo.monto) || 0;
        }
      }, 0);

      console.log(
        "Suma de montos:",
        sumaMontos.toFixed(2),
        "Monto pedido:",
        pedidoCompleto?.total
      );

      if (sumaMontos.toFixed(2) !== String(pedidoCompleto?.total)) {
        mostrarMensaje(
          "La suma de los montos debe ser igual al total del pedido",
          "confirmacion"
        );
        return;
      }

      // Crear o actualizar métodos de pago
      const metodosPagoAProcesar = [...metodosPagoEditados];
      const promesas: Promise<void>[] = metodosPagoEditados.map(
        async (metodo) => {
          if (metodo.id) {
            // Actualizar si tiene ID
            await axios.put(`${BASE_URL}/pedidoXMetodoPago/${metodo.id}`, {
              monto: metodo.monto,
              metodoPago: metodo.metodoPago.id,
              pedido: { id: pedidoCompleto?.id },
            });
          } else {
            // Crear si no tiene ID
            const response = await axios.post(`${BASE_URL}/pedidoXMetodoPago`, {
              monto: metodo.monto,
              metodoPago: metodo.metodoPago.id,
              pedido: { id: pedidoCompleto?.id },
            });
            console.log(response.data);

            // Actualizar el ID en el array local
            const index = metodosPagoAProcesar.findIndex(
              (mp) => mp.metodoPago.id === metodo.metodoPago.id
            );
            if (index !== -1) {
              metodosPagoAProcesar[index] = {
                ...metodosPagoAProcesar[index],
                id: response.data.id,
              };
            }
          }
        }
      );

      // Eliminar métodos que ya no están en la lista editada
      const idsActuales = metodosPagoEditados.map((mp) => mp.id);
      const idsOriginales = pedidoCompleto?.pedidosXMetodoPago?.map(
        (mp) => mp.id
      );
      const idsParaEliminar = idsOriginales?.filter(
        (id) => !idsActuales.includes(id)
      );

      if (idsParaEliminar?.length) {
        idsParaEliminar.forEach((id) =>
          promesas.push(
            axios.delete(`${BASE_URL}/pedidoXMetodoPago/${id}`).then(() => {})
          )
        );
      }

      // Esperar a que todas las promesas se resuelvan
      await Promise.all(promesas);
      // Actualizar el pedido con los métodos procesados
      /*const response = await axios.put(
        `${BASE_URL}/pedido/${pedidoCompleto?.id}`,
        {
          pedidosXMetodoPago: metodosPagoAProcesar,
        }
      );
  
      console.log(response.data);*/

      mostrarMensaje("Métodos de pago actualizados exitosamente");
      setEditPagoModalVisible(false);

      // Actualizar estado local
      fetchData(true);
    } catch (error) {
      console.error("Error al actualizar métodos de pago:", error);
      mostrarMensaje("Error al actualizar los métodos de pago", "confirmacion");
    }
  };

  // Función para cancelar los cambios
  const cancelarEdicionPago = () => {
    setNuevoMetodoPago(metodoPagoVacio);
    setEditPagoModalVisible(false);
  };
  function toggleCameraFacing() {
    setFacing((current) => (current === "back" ? "front" : "back"));
  }

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
        setResolveCallback(() => resolve); // Guardamos el resolve para usar después
      });
    }

    return Promise.resolve(false);
  };

  const handleRespuestaModal = (respuesta: boolean) => {
    if (resolveCallback) resolveCallback(respuesta);
    setMensajeModal(null);
    setResolveCallback(null);
  };

  const renderImageOptionsModal = () => {
    // Función auxiliar para obtener la URI de la imagen a mostrar
    const getImageUri = (): string => {
      if (currentImageType === "pedido") {
        return fotoPedido ?? ""; // Devuelve la imagen de pedido
      } else if (currentImageType === "pago" && currentImageId) {
        return fotosPago[currentImageId] ?? ""; // Devuelve la imagen del método de pago
      }
      return ""; // Retorna una cadena vacía si no hay imagen
    };

    return (
      <Modal
        visible={imageOptionsVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={() => setImageOptionsVisible(false)}
      >
        <>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Seleccionar Imagen</Text>

            {isCameraActive ? (
              <CameraView
                style={styles.camera}
                facing={facing}
                ref={cameraRef}
              >
                <View style={styles.buttonContainer2}>
                  <TouchableOpacity
                    style={styles.camerabutton}
                    onPress={toggleCameraFacing}
                  >
                    <Text style={styles.text}>Voltear Camara</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={styles.camerabutton}
                    onPress={takePhoto}
                  >
                    <Text style={styles.text}>Tomar foto</Text>
                  </TouchableOpacity>
                </View>
              </CameraView>
            ) : (
              <>
                <TouchableOpacity
                  style={styles.optionButton}
                  onPress={() => {
                    requestPermission();
                    if (permission && permission.granted) {
                      setIsCameraActive(true);
                    }
                  }}
                >
                  <Text style={styles.optionButtonText}>Tomar Foto</Text>
                </TouchableOpacity>
                
              </>
            )}

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={() => {
                setIsCameraActive(false);
                setImageOptionsVisible(false);
              }}
            >
              <Text style={styles.cancelButtonText}>Cancelar</Text>
            </TouchableOpacity>
          </View>
        </>
      </Modal>
    );
  };

  const handleImageView = (id: string, tipo: "pedido" | "pago") => {
    console.log(`Viewing image for ${tipo} with id ${id}`);
    setImageView(true);
    setCurrentImageId(id);
    setCurrentImageType(tipo);
    setImageOptionsVisible(true);
  };

  const showImageOptions = (id: string, tipo: "pedido" | "pago") => {
    if (tipo === "pedido") {
      setCurrentImageId(id);
      setCurrentImageType(tipo);
      setImageOptionsVisible(true); // Abre la cámara para capturar foto
    } else if (tipo === "pago") {
      setCurrentImageId(id);
      setCurrentImageType(tipo);
      setImageOptionsVisible(true); // Abre la cámara para capturar foto
    }
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
            setFotoPedido(imageData); // Asigna la imagen al estado de pedido
          } else if (tipo === "pago") {
            setFotosPago((prev) => ({
              ...prev,
              [id]: imageData, // Asigna la imagen al método de pago correspondiente
            }));
          }
        };
        reader.readAsDataURL(file);
      }
    };

    input.click();
    setImageOptionsVisible(false); // Cierra el modal
  };

  const closeCamera = () => {
    setIsCameraActive(false);
  };

  const enviarImagen = async (id: string, tipo: "pedido" | "pago") => {
    try {
      if (tipo === "pedido") {
        // Manejar imagen de pedido
        if (!fotoPedido) throw new Error("No hay imagen de pedido disponible.");

        const fileUrl = await uploadImage(fotoPedido, `${tipo}-${id}`);
        mostrarMensaje("Imagen de pedido enviada con éxito");
        return { [id]: fileUrl }; // Retorna un objeto con la URL de la imagen del pedido
      } else if (tipo === "pago") {
        // Manejar imágenes de pago
        if (Object.keys(fotosPago).length === 0)
          throw new Error("No hay imágenes de métodos de pago disponibles.");

        const urls: Record<string, string> = {}; // Almacena las URLs de las imágenes

        for (const [idMetodoPago, imagenData] of Object.entries(fotosPago)) {
          if (imagenData) {
            const fileUrl = await uploadImage(
              imagenData,
              `${tipo}-${idMetodoPago}`
            );
            urls[idMetodoPago] = fileUrl; // Asigna la URL al método de pago correspondiente
          }
        }

        mostrarMensaje("Imágenes de métodos de pago enviadas con éxito");
        return urls; // Retorna un objeto con las URLs generadas para cada método de pago
      }
    } catch (error) {
      console.error(`Error al enviar la imagen de ${tipo}:`, error);
      mostrarMensaje(`Error al enviar la imagen de ${tipo}.`, "confirmacion");
      return null; // Retorna null en caso de error
    }
  };

  // Función auxiliar para subir una imagen a la API
  const uploadImage = async (imagenData: string, fileName: string) => {
    const byteString = atob(imagenData.split(",")[1]);
    const mimeString = imagenData.split(",")[0].split(":")[1].split(";")[0];
    const arrayBuffer = new ArrayBuffer(byteString.length);
    const intArray = new Uint8Array(arrayBuffer);

    for (let i = 0; i < byteString.length; i++) {
      intArray[i] = byteString.charCodeAt(i);
    }

    const blob = new Blob([intArray], { type: mimeString });
    const file = new File([blob], `${fileName}.png`, { type: mimeString });

    const formData = new FormData();
    formData.append("file", file);
    formData.append("fileName", `${fileName}.png`);

    if (fileName.startsWith("pago")) {
      formData.append("folderId", "1z4G9rU8EW9whmnrrVcaL76an-8vM-Ncv");
    } else if (fileName.startsWith("pedido")) {
      formData.append("folderId", "1JZLvX-20RWZdLdOKFMLA-5o25GSI4cNb");
    }

    const response = await axios.post(`${BASE_URL}/imagenes`, formData);
    return response.data.fileUrl; // Retorna la URL generada
  };

  const handleCancelEntrega = () => {
    setModalCancelVisible(true); // Mostrar el modal de cancelación
  };

  const confirmarCancelacion = async () => {
    try {
      const motivo =
        motivoCancelacion === "Otro" ? otroMotivo : motivoCancelacion;
      await axios.put(`${BASE_URL}/pedido/${parsedPedido.id}`, {
        estado: "solicitado",
        motorizado: null,
        motivoCancelacion: motivo,
      });
      mostrarMensaje("Entrega reasignada");
      router.replace({
        pathname: "/home/delivery/cancelada",
        params: {},
      });
    } catch (error) {
      console.error("Error al reasignar la entrega:", error);
      mostrarMensaje("Error al reasignar la entrega", "confirmacion");
    } finally {
      setModalCancelVisible(false);
    }
  };

  const confirmarEntrega = async () => {
    try {
      const fotosPagoNecesarias = pedidoCompleto?.pedidosXMetodoPago?.length;
      if (fotoPedido === null || fotoPedido === undefined) {
        mostrarMensaje("Falta foto de pedido");
        return;
      } else if (
        fotosPagoNecesarias === undefined ||
        Object.keys(fotosPago).length !== fotosPagoNecesarias
      ) {
        mostrarMensaje("Falta foto todos los metodos de pago");
        return;
      }
      setIsLoading(true);
      const urlPedido = await enviarImagen(parsedPedido.id, "pedido");
      const urlPago = await enviarImagen(parsedPedido.id, "pago");
      if (urlPago === undefined || urlPago === null) {
        return;
      }
      console.log(urlPedido, urlPago);
      //Crear Venta
      if (pedidoCompleto != null && pedidoCompleto.pedidosXMetodoPago != null) {
        const response_detalle = await axios.get(
          `${BASE_URL}/pedido/${pedidoCompleto.id}/conDetalle?pedido=true`
        );
        pedidoCompleto.detalles = response_detalle.data.pedido.detalles;
        const detalles = pedidoCompleto.detalles || [];
        let totalPaletas = 0;
        let totalMafaletas = 0;
        try {
          totalPaletas = detalles
            .filter(
              (detalle: DetallePedido) =>
                detalle.producto.tipoProducto?.nombre === "Paleta"
            )
            .reduce(
              (acc: number, detalle: DetallePedido) => acc + detalle.cantidad,
              0
            );
        } catch (error) {
          console.error("Error calculating totalPaletas:", error);
          setIsLoading(false);
        }

        try {
          totalMafaletas = detalles
            .filter(
              (detalle: DetallePedido) =>
                detalle.producto.tipoProducto?.nombre === "Mafaleta"
            )
            .reduce(
              (acc: number, detalle: DetallePedido) => acc + detalle.cantidad,
              0
            );
        } catch (error) {
          console.error("Error calculating totalMafaletas:", error);
          setIsLoading(false);
        }

        const venta: Venta = {
          id: "",
          tipoComprobante: "Boleta",
          fechaVenta: new Date(),
          numeroComprobante: "",
          montoTotal: pedidoCompleto.total,
          totalPaletas: totalPaletas,
          totalMafeletas: totalMafaletas,
          estado: "entregado",
          totalIgv: pedidoCompleto.total * 0.18,
          pedido: parsedPedido.id,
          ordenSerie: null,
        };

        const ventaData = await axios.post(`${BASE_URL}/venta`, venta);
        console.log(ventaData);
        // Crear un array para almacenar las promesas de axios
        const promesasPagos = [];

        // Iterar por cada método de pago
        for (const metodoPago of pedidoCompleto.pedidosXMetodoPago) {
          const pago: Pago = {
            esTransferencia: true,
            montoCobrado: metodoPago.monto,
            numeroOperacion: null,
            urlEvidencia: urlPago[metodoPago.id],
            codigoTransaccion: null,
            venta: ventaData.data.id,
            metodoPago: metodoPago.metodoPago,
            banco: null,
            pedido: pedidoCompleto,
            id: "",
            estaActivo: true,
          };

          console.log(pago);

          // Agregar la promesa de axios al array
          promesasPagos.push(axios.post(`${BASE_URL}/pago`, pago));
        }

        // Usar Promise.all para esperar a que todas las solicitudes se completen
        try {
          // Enviar pagos en paralelo
          const resultados = await Promise.all(promesasPagos);
          console.log("Todos los pagos se han procesado:", resultados);

          // Enlazar cada pago con su respectivo pedidosXMetodoPago
          for (let i = 0; i < resultados.length; i++) {
            const pagoActualizado = resultados[i]?.data;
            const metodoPago = pedidoCompleto.pedidosXMetodoPago[i];

            // Validar que los datos existan
            if (!pagoActualizado || !metodoPago) {
              console.warn(
                `No se pudo procesar el enlace para el índice ${i}. Datos faltantes.`
              );
              continue;
            }
            let error_pxm = null;
            try {
              // Enlazar el pago con pedidosXMetodoPago
              await axios.put(
                `${BASE_URL}/pedidoXMetodoPago/${metodoPago.id}`,
                {
                  pago: pagoActualizado.id,
                }
              );
              console.log(
                `Pago ${pagoActualizado.id} enlazado con pedidosXMetodoPago ${metodoPago.id}`
              );
            } catch (error) {
              error_pxm = error;
              console.error(
                `Error al enlazar el pago ${pagoActualizado.id} con pedidosXMetodoPago ${metodoPago.id}:`,
                error
              );
              setIsLoading(false);
            }
            if (error_pxm) {
              throw error_pxm;
            }
          }
        } catch (error) {
          console.error("Ocurrió un error al procesar los pagos:", error);
          setIsLoading(false);
        }

        await axios.put(`${BASE_URL}/pedido/${pedidoCompleto.id}`, {
          estado: "entregado",
          urlEvidencia: urlPedido,
          pagado: pedidoCompleto.pedidosXMetodoPago.length == 1 && pedidoCompleto.pedidosXMetodoPago[0].metodoPago.nombre == "Pago en Efectivo" ? true : false,
        });

        router.replace({
          pathname: "/home/delivery/confirmada",
          params: {},
        });
      }
    } catch (error) {
      console.error("Error updating pedido:", error);
      mostrarMensaje("Error al confirmar la entrega", "confirmacion");
      setIsLoading(false);
    }
    setIsLoading(false);
  };

  const handleConfirmarEntrega = async () => {
    const confirmacion = await mostrarMensaje(
      "¿Está seguro de que desea confirmar la entrega?",
      "si/no"
    );

    if (confirmacion) {
      console.log("Entrega confirmada");
      confirmarEntrega();
      // Lógica de confirmación de entrega
    } else {
      console.log("Entrega cancelada");
    }
  };

  const [devMetodos, setdevMetodos] = useState<MetodoDePago[]>([]);
  useEffect(() => {
    const metodos: MetodoDePago[] = [
      {
        id: "mp_01J99CS1H128G2P7486ZB5YACH",
        nombre: "Pago en Efectivo",
        estaActivo: false,
      },
      {
        id: "mp_01JBDQD78HBD6A0V1DVMEQAFKV",
        nombre: "Yape",

        estaActivo: false,
      },
      {
        id: "mp_01JBDQDH47XDE75XCGSS739E6G",
        nombre: "Plin",
        estaActivo: false,
      },
    ];
    setdevMetodos(metodos);
  }, []);

  const fetchPedidoCompleto = async (idPedido: string) => {
    try {
      //Obtener metodos de pago

      // Obtener los datos del pedido
      const pedidoResponseDetalle = await axios.get(
        `${BASE_URL}/pedido/${idPedido}/conDetalle?pedido=true`
      );
      const pedidoDataDetalle = pedidoResponseDetalle.data.pedido;
      if (pedidoDataDetalle.estado.toLowerCase() === "entregado") {
        router.replace("/home/delivery");
        return;
      }
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
      router.replace("/home/delivery/handDeliver");
      console.log("Actualizado completo");
    } catch (error) {
      console.error("Error fetching pedido completo:", error);
    }
  };
  const fetchData = async (reload: boolean = false) => {
    if (parsedPedido?.id || reload) {
      if (reload && pedidoCompleto?.id) {
        fetchPedidoCompleto(pedidoCompleto.id);
      } else {
        fetchPedidoCompleto(parsedPedido.id);
      }
    } else {
      const pedido = await getCurrentDelivery();
      setPedidoCompleto(pedido);
    }
    console.log("Actualizado");
  };
  useEffect(() => {
    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.container}>
        <View style={styles.clienteContainer}>
          <View style={styles.tituloContainer}>
            <Text style={styles.titulo}>Datos del cliente</Text>
          </View>

          <View style={styles.clienteRow}>
            <Text style={styles.cliente} numberOfLines={1} ellipsizeMode="tail">
              {pedidoCompleto?.usuario?.nombre || "Nombre no disponible"}
            </Text>
            <View style={styles.iconosCliente}>
              <TouchableOpacity onPress={makeCall}>
                <TabBarIcon
                  IconComponent={AntDesign}
                  name="phone"
                  color="black"
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
                <Text
                  style={styles.productosText}
                  numberOfLines={2}
                  ellipsizeMode="tail"
                >
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
              onPress={() =>
                pedidoCompleto?.id &&
                showImageOptions(pedidoCompleto.id, "pedido")
              }
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
                <Text style={styles.metodoPagoTitulo}>Método(s) de Pago</Text>
              </View>
              {pedidoCompleto?.pedidosXMetodoPago &&
              pedidoCompleto.pedidosXMetodoPago.length > 0 ? (
                <>
                  <FlatList
                    style={{ maxHeight: 100, width: "100%" }}
                    data={pedidoCompleto?.pedidosXMetodoPago || []}
                    keyExtractor={(item) => item.id}
                    renderItem={({ item }) => (
                      <View style={styles.metodoInfoContainer}>
                        <View style={styles.metodoInfo}>
                          <View style={styles.leftInfo}>
                            <View style={styles.iconContainer}>
                              {item.metodoPago?.nombre.toLowerCase() ===
                              "plin" ? (
                                <Image
                                  source={require("@assets/images/plin.jpg")}
                                  style={styles.iconoPago}
                                />
                              ) : item.metodoPago?.nombre.toLowerCase() ===
                                "yape" ? (
                                <Image
                                  source={require("@assets/images/yape.png")}
                                  style={styles.iconoPago}
                                />
                              ) : (
                                <FontAwesome
                                  name="money"
                                  size={30}
                                  color="black"
                                />
                              )}
                            </View>
                            <View>
                              <Text style={styles.metodoNombre2}>
                                {item.metodoPago?.nombre || "No especificado"}
                              </Text>
                              <Text style={styles.montoMetodo}>
                                S/ {item.monto}
                              </Text>
                            </View>
                          </View>
                          <View style={styles.rightInfo}>
                            <TouchableOpacity
                              onPress={() => showImageOptions(item.id, "pago")}
                            >
                              <TabBarIcon
                                IconComponent={FontAwesome}
                                name="camera"
                                color={
                                  fotosPago[item.id] ? "#3BD100" : "#C9CC00"
                                } // Verde si hay foto
                                size={30}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                      </View>
                    )}
                  />
                </>
              ) : (
                <>
                  <Text style={styles.productosText}>
                    No hay métodos de pago
                  </Text>
                </>
              )}
            </View>
          </View>
          <View style={styles.agregarParcialButton}>
            <TouchableOpacity onPress={handleEditarPago}>
              <Text style={styles.agregarParcial}>+ Editar pago</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={styles.rejectButton}
          onPress={handleCancelEntrega}
        >
          <Text style={styles.confirmButtonText}>Reasignar entrega</Text>
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
      <Modal
        visible={editPagoModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={cancelarEdicionPago}
      >
        <View style={styles.modalContainer}>
          <Text style={styles.modalTitle}>Editar Métodos de Pago</Text>
          <FlatList
            data={metodosPagoEditados}
            keyExtractor={(item) => item.id || item.metodoPago.id}
            renderItem={({ item }) => (
              <View style={styles.metodoInfoContainer}>
                <Picker
                  selectedValue={item.metodoPago.id || ""}
                  onValueChange={(itemValue) =>
                    setMetodosPagoEditados((prev) =>
                      prev.map((mp) =>
                        mp.id === item.id
                          ? {
                              ...mp,
                              metodoPago: {
                                id: itemValue,
                                nombre:
                                  devMetodos.find((m) => m.id === itemValue)
                                    ?.nombre || "",

                                estaActivo:
                                  devMetodos.find((m) => m.id === itemValue)
                                    ?.estaActivo || true,
                              },
                            }
                          : mp
                      )
                    )
                  }
                  style={styles.picker}
                >
                  <Picker.Item label="Seleccione un método" value="" />
                  <Picker.Item
                    key={"mp_01J99CS1H128G2P7486ZB5YACH"}
                    label={"Pago en Efectivo"}
                    value={"mp_01J99CS1H128G2P7486ZB5YACH"}
                  />
                  <Picker.Item
                    key={"mp_01JBDQD78HBD6A0V1DVMEQAFKV"}
                    label={"Yape"}
                    value={"mp_01JBDQD78HBD6A0V1DVMEQAFKV"}
                  />
                  <Picker.Item
                    key={"mp_01JBDQDH47XDE75XCGSS739E6G"}
                    label={"Plin"}
                    value={"mp_01JBDQDH47XDE75XCGSS739E6G"}
                  />
                </Picker>

                <TextInput
                  style={styles.input}
                  value={
                    typeof item?.monto === "string"
                      ? parseFloat(item.monto || "0").toFixed(2)
                      : item?.monto?.toFixed(2) || "0.00"
                  }
                  keyboardType="numeric"
                  onChangeText={(text) =>
                    setMetodosPagoEditados((prev) =>
                      prev.map((mp) =>
                        mp.id === item.id
                          ? { ...mp, monto: parseFloat(text) }
                          : mp
                      )
                    )
                  }
                  placeholder="Monto"
                />

                <TouchableOpacity onPress={() => eliminarMetodoPago(item.id)}>
                  <Text style={styles.botonEliminar}>Eliminar</Text>
                </TouchableOpacity>
              </View>
            )}
          />
          <View style={styles.nuevoMetodoPago}>
            <Picker
              selectedValue={nuevoMetodoPago?.metodoPago?.id || ""}
              onValueChange={(itemValue) =>
                setNuevoMetodoPago((prev) => {
                  if (!prev) return metodoPagoVacio;
                  const selectedMetodo = devMetodos.find(
                    (m) => m.id === itemValue
                  );
                  return {
                    ...prev,
                    metodoPago: {
                      id: selectedMetodo?.id || "-1",

                      estaActivo: selectedMetodo?.estaActivo || true,
                      nombre: selectedMetodo?.nombre || "",
                    },
                  };
                })
              }
              style={styles.picker}
            >
              <Picker.Item label="Seleccione un método" value="" />
              <Picker.Item
                key={"mp_01J99CS1H128G2P7486ZB5YACH"}
                label={"Pago en Efectivo"}
                value={"mp_01J99CS1H128G2P7486ZB5YACH"}
              />
              <Picker.Item
                key={"mp_01JBDQD78HBD6A0V1DVMEQAFKV"}
                label={"Yape"}
                value={"mp_01JBDQD78HBD6A0V1DVMEQAFKV"}
              />
              <Picker.Item
                key={"mp_01JBDQDH47XDE75XCGSS739E6G"}
                label={"Plin"}
                value={"mp_01JBDQDH47XDE75XCGSS739E6G"}
              />
            </Picker>

            <TextInput
              style={styles.input}
              keyboardType="numeric"
              onChangeText={(text) =>
                setNuevoMetodoPago((prev) => {
                  if (!prev) return metodoPagoVacio;
                  return {
                    ...prev,
                    monto: text ? parseFloat(text) : 0,
                  };
                })
              }
              placeholder="Monto"
            />
            <TouchableOpacity onPress={agregarMetodoPago}>
              <Text style={styles.botonAgregar}>Agregar</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.modalBotones}>
            <TouchableOpacity
              style={styles.boton}
              onPress={cancelarEdicionPago}
            >
              <Text style={styles.botonTexto2}>Cancelar</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.boton}
              onPress={confirmarCambiosPago}
            >
              <Text style={styles.botonTexto2}>Confirmar</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
      <Modal
        visible={isLoading}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsLoading(false)}
      >
        <View style={styles.loadingOverlay}>
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#fff" />
            <Text style={styles.loadingText}>{loadingMessage}</Text>
          </View>
        </View>
      </Modal>
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
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 15,
    marginVertical: 10,
    marginHorizontal: 10,
    flexWrap: "wrap",
    flexDirection: "column",
  },
  loadingOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)", // Oscurece el fondo
    justifyContent: "center",
    alignItems: "center",
  },
  loadingContainer: {
    backgroundColor: "#333",
    padding: 20,
    borderRadius: 10,
    alignItems: "center",
  },
  loadingText: {
    color: "#fff",
    marginTop: 10,
    fontSize: 16,
  },
  nuevoMetodoPago: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "90%",
    marginVertical: 10,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  botonAgregar: {
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: "#28a745",
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
    borderRadius: 8,
    textAlign: "center",
  },
  botonEliminar: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    backgroundColor: "#dc3545",
    color: "#fff",
    fontSize: 14,
    fontWeight: "bold",
    borderRadius: 8,
    textAlign: "center",
  },
  infoContainer: {},
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
  },
  clienteContainer: {
    paddingHorizontal: 10,
    marginRight: 25,
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
    fontSize: 22,
    fontWeight: "bold",
    marginVertical: 10,
  },
  detallesPago: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  cliente: {
    fontSize: 18,
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
    paddingHorizontal: 10,
    marginRight: 25,
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
  metodoNombre2: {
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
    fontSize: 18,
  },
  linkVerMas: {
    color: "blue",
    marginTop: 5,
  },
  pagoContainer: {
    paddingHorizontal: 10,
  },
  subtotalTitulo: {
    fontSize: 20,
    fontWeight: "bold",
  },
  subtotalValor: {
    fontSize: 25,
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
  agregarParcial: {
    color: "red",
    fontSize: 16,
  },
  confirmButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  rejectButton: {
    backgroundColor: "#F44336", // Red color for reject button
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
  },
  confirmButtonText: {
    fontSize: 14,
    color: "#FFF",
    fontWeight: "bold",
  },
  swipeButtonText: {
    fontSize: 18,
    color: "#000",
  },
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
  },
  swipeButtonContainer: {
    marginTop: 30,
  },
    modalContainer: {
      flex: 1,
      justifyContent: "center",
      backgroundColor: "white",
      alignContent: "center",
      alignItems: "center",
      padding: 10,
      marginHorizontal: 10,
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
  botonesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
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

  metodoInfoContainer: {
    backgroundColor: "#f9f9f9",
    borderRadius: 8,
    marginBottom: 5,
    padding: 10,
    elevation: 2, // Sombra para destacar cada método
  },

  leftInfo: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1, // Para que tome el espacio restante
  },
  iconContainer: {
    marginRight: 15,
    justifyContent: "center",
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
  },
  iconoPago: {
    width: 30,
    height: 30,
    resizeMode: "contain",
  },
  metodoNombre: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  montoMetodo: {
    fontSize: 14,
    color: "#555",
    marginTop: 5,
  },
  botonTexto: {
    color: "white",
    fontSize: 14,
  },
  rightInfo: {
    justifyContent: "center",
    alignItems: "center",
  },
  picker: {
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    marginBottom: 10,
    paddingHorizontal: 10,
    borderRadius: 4,
    backgroundColor: "#fff",
    alignContent: "center",
    justifyContent: "center",
  },

  camera: {
    height: "80%",
    width: "80%",
  },
  buttonContainer2: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "transparent",
    justifyContent: "flex-end",
    alignContent: "flex-end",
  },
  button: {
    flex: 1,
    alignSelf: "flex-end",
    alignItems: "center",
  },
  camerabutton: {
    alignItems: "center",
    padding: 10,
  },
  text: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
});

export default EntregarPedido;
