import React, { useEffect, useRef, useState } from "react";
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
const BASE_URL = process.env.EXPO_PUBLIC_BASE_URL;
import { IGV, GENERIC_USER } from "@/constants/Constantes";
import {
  InventarioMotorizado,
  Producto,
  DetallePedido,
  MetodoDePago,
  Pedido,
  Usuario,
  Venta,
  Pago,
  PedidoXMetodoPago,
} from "@/interfaces/interfaces";
import { getMotorizadoData, getUserData } from "@/functions/storage";
import { FontAwesome } from "@expo/vector-icons";
import HistorialVentas from "@/components/venta/SaleHistory";
import TabBarIcon from "@/components/StyledIcon";

export default function SeleccionarProductos({ navigation }: any) {
  const [mostrarHistorial, setMostrarHistorial] = useState(false);

  const [inventario, setInventario] = useState<InventarioMotorizado[]>([]);
  const [productosSeleccionados, setProductosSeleccionados] = useState<
    { producto: Producto; cantidad: number }[]
  >([]);
  const [mensajeModal, setMensajeModal] = useState<string | null>(null);
  const [tipoModal, setTipoModal] = useState<"auto" | "confirmacion" | "si/no">(
    "auto"
  );

  const [metodosPago, setMetodosPago] = useState<MetodoDePago[]>([]);
  const [metodoPagoSelect, setMetodoPagoSelect] = useState<MetodoDePago | null>(
    null
  );
  const [fotoPedido, setFotoPedido] = useState<string | null>(null);
  const [fotosPago, setFotosPago] = useState<Record<string, string | null>>({});
  const [metodosPagoSeleccionados, setMetodosPagoSeleccionados] = useState<
    { metodo: MetodoDePago; monto: number; evidencia: string | null }[]
  >([]);
  const [imageView, setImageView] = useState<boolean>(false);
  const [videoStream, setVideoStream] = useState<MediaStream | null>(null);
  const [imageOptionsVisible, setImageOptionsVisible] = useState(false);
  const [currentImageId, setCurrentImageId] = useState<string | null>(null);
  const [currentImageType, setCurrentImageType] = useState<
    "pedido" | "pago" | null
  >(null);
  const [imagenPago, setImagenPago] = useState<string | null>(null);
  const [mostrarResumen, setMostrarResumen] = useState<boolean>(false);
  const [totalResumen, setTotalResumen] = useState<number>(0);
  const [resolveCallback, setResolveCallback] = useState<null | Function>(null);
  const videoRef = useRef<HTMLVideoElement>(null);

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

  const toggleMetodoPago = (metodo: MetodoDePago) => {
    setMetodosPagoSeleccionados((prev) => {
      const exists = prev.find((item) => item.metodo.id === metodo.id);
      if (exists) {
        return prev.filter((item) => item.metodo.id !== metodo.id);
      } else {
        return [...prev, { metodo, monto: 0, evidencia: null }];
      }
    });
  };

  const updateMontoMetodoPago = (id: string, monto: number) => {
    setMetodosPagoSeleccionados((prev) =>
      prev.map((item) => (item.metodo.id === id ? { ...item, monto } : item))
    );
  };

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
    if (metodosPagoSeleccionados.length === 0) {
      mostrarMensaje("Debes seleccionar al menos un método de pago.", "auto");
      return;
    }
    try {
      //Confirmar suma de montos
      const sumaMontos = metodosPagoSeleccionados.reduce(
        (acc, item) => acc + item.monto,
        0
      );
      if (sumaMontos !== totalResumen) {
        mostrarMensaje(
          "La suma de los montos de los métodos de pago no coincide con eltotal de la venta.",
          "auto"
        );
        return;
      }

      

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

      const pedidoCompleto: Pedido = {
        id: "",
        estado: "Entregado",
        prioridadEntrega: null,
        total: totalResumen,
        puntosOtorgados: 0,
        motivoCancelacion: null,
        montoEfectivoPagar: totalResumen,
        motorizado: motorizado,
        direccion: null,
        usuario: { id: GENERIC_USER } as Usuario,
        urlEvidencia: null,
        detalles,
        pagado: false,
        codigoSeguimiento: "Venta directa",
        pedidosXMetodoPago: null,
        estaActivo: true,
        pagos: null,
      };
      const pedidoResponse = await axios.post(
        `${BASE_URL}/pedido`,
        pedidoCompleto
      );
      const pedidoId = pedidoResponse.data.pedido.id;
      console.log(pedidoResponse);

      //Guardar pedidoXMetodoPago
      const pedidoXMetodoPagoPromises = metodosPagoSeleccionados.map(
        async (metodoPagoSeleccionado) => {
          const metodoPago = metodoPagoSeleccionado.metodo;
          const monto = metodoPagoSeleccionado.monto;

          const pedidoXMetodoPago: PedidoXMetodoPago = {
            id: "",
            monto,
            metodoPago: metodoPago,
            estaActivo: false,
            pedido: pedidoId,
            Pago: null,
          };
          const response = await axios.post(
            `${BASE_URL}/pedidoXMetodoPago`,
            pedidoXMetodoPago
          );
          return response.data.pedidoXMetodoPago;
        }
      );
      const pedidoXMetodoPago = await Promise.all(pedidoXMetodoPagoPromises);

      //Actualiar pedido
      const pedidoActualizado = await axios.put(
        `${BASE_URL}/pedido/${pedidoId}`,
        {
          ...pedidoCompleto,
          pedidosXMetodoPago: pedidoXMetodoPago,
        }
      );
      // Crear la Venta con el Pedido
      const venta: Venta = {
        id: "",
        tipoComprobante: "Boleta",
        fechaVenta: new Date(),
        numeroComprobante: "",
        montoTotal: pedidoCompleto.total,
        totalPaletas:
          detalles
            .filter((d) => d.producto.tipoProducto?.nombre === "Paleta")
            .reduce((acc, d) => acc + d.cantidad, 0) || 0,
        totalMafeletas:
          detalles
            .filter((d) => d.producto.tipoProducto?.nombre === "Mafeleta")
            .reduce((acc, d) => acc + d.cantidad, 0) || 0,
        estado: "entregado",
        totalIgv: pedidoCompleto.total * IGV,
        pedido: pedidoId,
        ordenSerie: null,
      };
      console.log(venta);
      const ventaResponse = await axios.post(`${BASE_URL}/venta`, venta);
      console.log(ventaResponse);
      const ventaId = ventaResponse.data.id;

      // Crear los Pagos por cada pedidoXMetodoPago
      const pagoPromises = pedidoXMetodoPago.map((pedidoXMetodoPago) => {
        const pago = {
          esTransferencia: true,
          montoCobrado: pedidoXMetodoPago.monto,
          numeroOperacion: null,
          urlEvidencia: null,
          codigoTransaccion: null,
          venta: ventaId,
          banco: null,
          pedido: pedidoId,
          id: "",
          creadoEn: "",
          actualizadoEn: "",
          desactivadoEn: null,
          usuarioCreacion: "",
          usuarioActualizacion: null,
          estaActivo: false,
        };
        return axios.post(`${BASE_URL}/pago`, pago);
      });

      const pagosResponse = await Promise.all(pagoPromises);
      console.log(pagosResponse);

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
    setImageOptionsVisible(false);
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
        {imageView ? (
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Vista previa de la imagen</Text>
            <Image
              source={{ uri: getImageUri() }}
              style={styles.previewImage}
            />
            <TouchableOpacity
              style={styles.optionButton}
              onPress={() => {
                setImageOptionsVisible(false);
                setImageView(false);
              }}
            >
              <Text style={styles.optionButtonText}>Aceptar</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.rejectButton}
              onPress={() => {
                setImageView(false); // Permite cambiar la imagen
              }}
            >
              <Text style={styles.optionButtonText}>Cambiar foto</Text>
            </TouchableOpacity>
          </View>
        ) : (
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
                  onPress={() =>
                    capturePhoto(currentImageId!, currentImageType!)
                  }
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
        )}
      </Modal>
    );
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

  const handleRespuestaModal = (respuesta: boolean) => {
    if (resolveCallback) resolveCallback(respuesta);
    setMensajeModal(null);
    setResolveCallback(null);
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
      if (fotoPedido) {
        // Si ya hay una imagen de pedido, mostrar vista previa
        handleImageView(id, tipo);
      } else {
        // Si no hay imagen de pedido, permitir selección o captura
        setCurrentImageId(id);
        setCurrentImageType(tipo);
        setImageOptionsVisible(true);
      }
    } else if (tipo === "pago") {
      if (fotosPago[id]) {
        // Si ya hay una imagen asociada a este método de pago, mostrar vista previa
        handleImageView(id, tipo);
      } else {
        // Si no hay imagen de pago, permitir selección o captura
        setCurrentImageId(id);
        setCurrentImageType(tipo);
        setImageOptionsVisible(true);
      }
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

  const handleCameraCapture = async (id: string, tipo: "pedido" | "pago") => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: "environment" },
      });
      setVideoStream(stream);
    } catch (error) {
      console.error("Error al acceder a la cámara:", error);
      mostrarMensaje("No se pudo acceder a la cámara.", "confirmacion");
    }
  };

  const capturePhoto = (id: string, tipo: "pedido" | "pago") => {
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

    if (tipo === "pedido") {
      setFotoPedido(imageData); // Asigna la imagen al estado de pedido
    } else if (tipo === "pago") {
      setFotosPago((prev) => ({
        ...prev,
        [id]: imageData, // Asigna la imagen al método de pago correspondiente
      }));
    }

    videoStream?.getTracks().forEach((track) => track.stop()); // Detener la cámara
    setVideoStream(null); // Limpiar el stream
    setImageOptionsVisible(false); // Cerrar el modal
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
        visible={mostrarResumen && !imageOptionsVisible}
        transparent
        animationType="slide"
      >
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
            <View style={{ width: "100%" }}>
              <FlatList
                data={metodosPago}
                renderItem={({ item }) => {
                  const isSelected = metodosPagoSeleccionados.some(
                    (metodo) => metodo.metodo.id === item.id
                  );
                  const selectedMetodo = metodosPagoSeleccionados.find(
                    (metodo) => metodo.metodo.id === item.id
                  );
                  return (
                    <View style={styles.metodoPagoContainer}>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <TouchableOpacity
                          onPress={() => toggleMetodoPago(item)}
                          style={{ padding: 10 }}
                        >
                          <FontAwesome
                            name={isSelected ? "check-square" : "square-o"}
                            size={24}
                            color={isSelected ? "green" : "gray"}
                          />
                        </TouchableOpacity>
                        <Text style={styles.metodoTexto}>{item.nombre}</Text>
                      </View>

                      {isSelected && (
                        <View style={styles.montoEvidenciaContainer}>
                          <TextInput
                            style={styles.inputMonto}
                            placeholder="Monto"
                            keyboardType="numeric"
                            onChangeText={(text) =>
                              updateMontoMetodoPago(
                                item.id,
                                parseFloat(text) || 0
                              )
                            }
                          />
                        </View>
                      )}
                    </View>
                  );
                }}
                keyExtractor={(item) => item.id}
              />
            </View>

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

      <TouchableOpacity
        style={styles.botonHistorial}
        onPress={() => setMostrarHistorial(true)}
      >
        <Text style={styles.botonTextoHistorial}>Ver Historial de Ventas</Text>
      </TouchableOpacity>
      <Modal
        visible={mostrarHistorial}
        transparent
        animationType="slide"
        onRequestClose={() => setMostrarHistorial(false)}
      >
        <HistorialVentas onClose={() => setMostrarHistorial(false)} />
      </Modal>
      {renderImageOptionsModal()}
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
    justifyContent: "space-between",
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
  botonHistorial: {
    backgroundColor: "#4285F4",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 10,
  },
  botonTextoHistorial: {
    color: "#fff",
    fontWeight: "bold",
  },
  inputMonto: {
    width: 80,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 5,
    marginHorizontal: 10,
    textAlign: "center",
  },
  montoEvidenciaContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
  },
  botonesContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    width: "100%",
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
  previewImage: {
    width: 200,
    height: 200,
    borderRadius: 10,
    marginBottom: 20,
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
  rejectButton: {
    backgroundColor: "#F44336", // Red color for reject button
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginVertical: 10,
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
});
