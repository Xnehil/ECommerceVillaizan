"use client"

import axios from "axios";
import React, { useEffect, useRef, useState } from "react";
import { Suspense } from 'react';
import { useSearchParams } from "next/navigation";
import EnEsperaTracking from "@components/EnEsperaTracking";
import { LoadingSpinner } from "@components/LoadingSpinner";
import PedidoEntregado from "@components/PedidoEntregado";
import SeguimientoHeader from "@components/SeguimientoHeader";
import dynamic from "next/dynamic";
import { connectWebSocket } from "@lib/util/websocketUtils";
import { enrichLineItems, retrievePedido } from "@modules/cart/actions";
import { Pedido } from "types/PaquetePedido";
import PedidoCancelado from "@components/PedidoCancelado";
import ConfirmModal from "./confirmModal"; 

const MapaTracking = dynamic(() => import("@components/MapaTracking"), {
  ssr: false,
})

interface ExtendedWebSocket extends WebSocket {
  intervalId?: NodeJS.Timeout
}

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

// Función para crear y descargar el archivo XML en el cliente
const downloadXMLFile = async (pedido: Pedido) => {
  // Construir el contenido XML a partir del objeto `pedido` siguiendo el estándar UBL
  // Hay que reunirnos si o si porque hay datos que tienen que estar estandarizados si o si
  const xmlContent = `
<Invoice xmlns="urn:oasis:names:specification:ubl:schema:xsd:Invoice-2" xmlns:cac="urn:oasis:names:specification:ubl:schema:xsd:CommonAggregateComponents-2" xmlns:cbc="urn:oasis:names:specification:ubl:schema:xsd:CommonBasicComponents-2">
  <cbc:UBLVersionID>2.1</cbc:UBLVersionID>
  <cbc:CustomizationID>2.0</cbc:CustomizationID>
  <cbc:ID>BO65-00005157</cbc:ID>
  <cbc:IssueDate>${new Date().toISOString().split("T")[0]}</cbc:IssueDate>
  <cbc:IssueTime>${new Date().toISOString().split("T")[1].split(".")[0]}</cbc:IssueTime>
  <cbc:InvoiceTypeCode listID="0101">01</cbc:InvoiceTypeCode>
  <cbc:DocumentCurrencyCode>PEN</cbc:DocumentCurrencyCode>
  <cac:AccountingSupplierParty>
    <cac:Party>
      <cac:PartyIdentification>
        <cbc:ID schemeID="6">20608493604</cbc:ID>
      </cac:PartyIdentification>
      <cac:PartyName>
        <cbc:Name><![CDATA[VILLAIZAN EIRL]]></cbc:Name>
      </cac:PartyName>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName><![CDATA[VILLAIZAN E.I.R.L.]]></cbc:RegistrationName>
        <cac:RegistrationAddress>
          <cbc:ID>220901</cbc:ID>
          <cbc:AddressTypeCode>0000</cbc:AddressTypeCode>
          <cbc:CityName>SAN MARTIN</cbc:CityName>
          <cbc:CountrySubentity>SAN MARTIN</cbc:CountrySubentity>
          <cbc:District>TARAPOTO</cbc:District>
          <cac:AddressLine>
            <cbc:Line><![CDATA[JR. ALFONSO UGARTE NRO. 2211 DPTO. 8B URB. HUAYCO]]></cbc:Line>
          </cac:AddressLine>
          <cac:Country>
            <cbc:IdentificationCode>PE</cbc:IdentificationCode>
          </cac:Country>
        </cac:RegistrationAddress>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingSupplierParty>
  <cac:AccountingCustomerParty>
    <cac:Party>
      <cac:PartyIdentification>
        <cbc:ID schemeID="6">${pedido.usuario?.persona?.numeroDocumento || "Sin Documento"}</cbc:ID>
      </cac:PartyIdentification>
      <cac:PartyLegalEntity>
        <cbc:RegistrationName><![CDATA[${pedido.usuario?.nombre || "Cliente"}]]></cbc:RegistrationName>
        <cac:RegistrationAddress>
          <cac:AddressLine>
            <cbc:Line><![CDATA[${pedido.direccion?.calle || "Sin Dirección"}]]></cbc:Line>
          </cac:AddressLine>
          <cac:Country>
            <cbc:IdentificationCode>PE</cbc:IdentificationCode>
          </cac:Country>
        </cac:RegistrationAddress>
      </cac:PartyLegalEntity>
    </cac:Party>
  </cac:AccountingCustomerParty>
  <cac:PaymentTerms>
    <cbc:ID>FormaPago</cbc:ID>
    <cbc:PaymentMeansID>${pedido.pedidosXMetodoPago.map(mp => mp.metodoPago.nombre).join(", ")}</cbc:PaymentMeansID>
    <cbc:Amount currencyID="PEN">${pedido.total}</cbc:Amount>
  </cac:PaymentTerms>
  ${pedido.detalles.map((detalle, index) => `
    <cac:InvoiceLine>
      <cbc:ID>${index + 1}</cbc:ID>
      <cbc:InvoicedQuantity unitCode="NIU">${detalle.cantidad}</cbc:InvoicedQuantity>
      <cbc:LineExtensionAmount currencyID="PEN">${detalle.subtotal}</cbc:LineExtensionAmount>
      <cac:Item>
        <cbc:Description><![CDATA[${detalle.producto.nombre}]]></cbc:Description>
      </cac:Item>
      <cac:Price>
        <cbc:PriceAmount currencyID="PEN">${detalle.producto.precioEcommerce}</cbc:PriceAmount>
      </cac:Price>
    </cac:InvoiceLine>
  `).join("")}
  <cac:TaxTotal>
    <cbc:TaxAmount currencyID="PEN">0.00</cbc:TaxAmount>
  </cac:TaxTotal>
  <cac:LegalMonetaryTotal>
    <cbc:LineExtensionAmount currencyID="PEN">${pedido.total}</cbc:LineExtensionAmount>
    <cbc:PayableAmount currencyID="PEN">${pedido.total}</cbc:PayableAmount>
  </cac:LegalMonetaryTotal>
</Invoice>
`;
  // Crear un Blob a partir del contenido XML
  const blob = new Blob([xmlContent], { type: 'application/xml' });
  
  // Crear FormData y adjuntar el archivo XML
  const formData = new FormData();
  formData.append("file", blob);
  formData.append("fileName", `pedido_${pedido.id}.xml`);
  formData.append("folderId", "xml");

  try {
    // Enviar el archivo XML al servicio mediante una solicitud POST
    const responseImagen = await axios.post(
      `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/imagenes`,
      formData
    );
    
    console.log("Archivo XML guardado en el servicio:", responseImagen.data);
  } catch (error) {
    console.error("Error al subir el archivo XML:", error);
  }
};

const sendMessageConfirmation = async () => {
  try {
    await axios.post("http://localhost:9000/admin/whatsApp", {
      mensaje: `🍦 *Helados Villaizan* 🍦\n\n¡Felicidades!\nTu pedido ha sido entregado con éxito. 🎉 Por favor llena esta encuesta de satisfacción para mejorar en tu siguiente entrega: bit.ly/4fLaj5h`,
      numero: "959183082",
    });
    console.log("Mensaje de confirmación enviado a WhatsApp.");
  } catch (error) {
    console.error("Error al enviar mensaje de WhatsApp:", error);
  }
};

const fetchCart = async (
  setDriverPosition: (position: [number, number]) => void,
  setEnRuta: (enRuta: string) => void,
  enRuta: string,
  setMensajeEspera: (mensaje: string) => void,
  ws: React.MutableRefObject<ExtendedWebSocket | null>,
  codigoSeguimiento?: string | null
): Promise<Pedido> => {
  // console.log("Fetching cart with code:", codigoSeguimiento);
  const respuesta = await retrievePedido(true, codigoSeguimiento);
  console.log("Respuesta:", respuesta);
  let cart: Pedido = respuesta
  downloadXMLFile(cart); // paraPruebas
  if (!cart) {
    console.error("Cart is null or undefined")
    window.location.href = "/"
  }

  if(cart.estado === "cancelado") {
    setEnRuta("cancelado")
    return cart
  } else if(cart.estado === "entregado") {
    setEnRuta("entregado")
    return cart
  }
  
  let aux = cart.detalles
  const enrichedItems = await enrichLineItems(cart.detalles)
  // console.log("Detalles enriquecidos:", enrichedItems);
  cart.detalles = enrichedItems
  const response = await axios.get(baseUrl + "/admin/motorizado/"+cart.motorizado?.id+"?enriquecido=true")
  cart.motorizado = response.data.motorizado
//   console.log("Cart enriquecido:", cart);
  // console.log("Motorizado enriquecido y ws:", cart.motorizado, ws.current);
  //Conectar a websocket para recibir actualizaciones en tiempo real
  if (cart.motorizado && ws.current === null) {
    // Conectar a websocket para recibir actualizaciones en tiempo real
    ws.current = connectWebSocket(
      cart.motorizado.id, // idRepartidor
      cart.id, // idPedido
      cart.estado, // estado
      (data) => {
        console.log(data);
        if (enRuta === "entregado") {
          return
        }
        if (data.type === "locationResponse") {
          // Si es 0, 0, entonces el motorizado está teniendo problemas de conexión. Sugerir esperar un momento o recargar la página
          if (data.data.lat === 0 && data.data.lng === 0) {
            setMensajeEspera("El repartidor está teniendo problemas de conexión. Por favor, espera un momento o recarga la página.")
            setEnRuta("espera")
          }else{
            // Actualizar la posición del motorizado
            setEnRuta("ruta")
            setDriverPosition([data.data.lat, data.data.lng])
          }
        } else if (data.type === "canceladoResponse") {
          // El pedido ha sido cancelado
          console.log("Pedido cancelado")
          setEnRuta("cancelado")
          if (ws) {
            ws.current?.close();
          }
        }else if (data.type === "confirmarResponse") {
          // El pedido está en proceso de confirmación por parte del administrador
          setEnRuta("espera")
          
          setMensajeEspera("Estamos verificando tu pedido. Por favor, espera un momento.")
        } else if (data.type === "notYetResponse") {
          // El motorizado está atendiendo otros pedidos
          setEnRuta("espera")
          setMensajeEspera("Tu pedido ha sido verificado. El repartidor está atendiendo otros pedidos.\n Por favor, espera un momento.")
        } else if (data.type === "entregadoResponse") {
          // El pedido ha sido entregado
          //downloadXMLFile(cart); // paraPRD
          setEnRuta("entregado")
          // De momento lo enviamos a la página de inicio
          
          window.location.href = "/"
        }
      },
      () => {
        // Handle WebSocket connection close
        console.log("WebSocket connection closed");
      }
    )
  } else {
    console.error("Motorizado is undefined")
  }

  return cart
}

const TrackingPage: React.FC = () => {
  const [pedido, setPedido] = useState<Pedido | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [driverPosition, setDriverPosition] = useState<[number, number]>([
    -6.476, -76.361,
  ]);
  const [enRuta, setEnRuta] = useState<string>("espera");
  const [mensajeEspera, setMensajeEspera] = useState<string>(
    "Estamos verificando tu pedido. Por favor, espera un momento."
  );
  const [error, setError] = useState<string | null>(null);
  const mensajeEnviadoRef = useRef<boolean>(false); // Ref para controlar el envío
  const [mensajeEnviado, setMensajeEnviado] = useState<boolean>(false); // Control de envío único
  const [errorCancelacion, setErrorCancelacion] = useState<string | null>(null);
  const [showConfirmModal, setShowConfirmModal] = useState<boolean>(false);
  const mapRef = useRef<HTMLDivElement>(null);
  const search = useSearchParams();
  const [codigo, setCodigo] = useState<string | null>(
    search.get("codigo")
  );
  const wsRef = useRef<ExtendedWebSocket | null>(null);
   // Función para abrir el modal de confirmación
   const handleCancelClick = () => {
    setShowConfirmModal(true);
  };
    // Función para cancelar el pedido
  // Función para cancelar el pedido al confirmar en el modal
  const cancelarPedido = async () => {
    if (!pedido?.id) return;

    try {
      await axios.put(`http://localhost:9000/admin/pedido/${pedido.id}`, {
        estado: "cancelado",
      });
      setEnRuta("cancelado");
      setShowConfirmModal(false); // Cierra el modal
      alert("Tu pedido ha sido cancelado exitosamente.");
      //window.location.href = "/";
    } catch (error) {
      console.error("Error al intentar cancelar el pedido:", error);
      setShowConfirmModal(false); // Cierra el modal
      alert("Ocurrió un error al cancelar el pedido. Por favor, intenta nuevamente.");
    }
  };
  useEffect(() => {
    // const sendMessage = async (codigoSeguimiento: string) => {
    //   if (mensajeEnviadoRef.current) return; // Verifica si ya se envió el mensaje
    //   try {
    //     await axios.post("http://localhost:9000/admin/whatsApp", {
    //       mensaje: `🍦 *Helados Villaizan* 🍦\n\n¡Hola!\nTu pedido ha sido confirmado y está en camino. 🎉\n\n📦 *Código de seguimiento:* ${codigoSeguimiento}\n\nPara conocer el estado de tu pedido en tiempo real, ingresa al siguiente enlace: http://localhost:8000/seguimiento?codigo=${codigoSeguimiento} o visita nuestro sitio web y usa tu código en la sección 'Rastrea tu pedido'.\n\nSi tienes alguna consulta, ¡estamos aquí para ayudarte! 😊`,
    //       numero: "959183082"
    //     });

    //     console.log("Mensaje enviado a WhatsApp.");
    //     mensajeEnviadoRef.current = true; 
    //     setError(null); // Limpiar el error si el mensaje se envía correctamente
    //   } catch (error) {
    //     console.error("Error al enviar mensaje de WhatsApp:", error);
    //     setError("No se pudo enviar el mensaje de WhatsApp. Haz clic en el botón para intentar nuevamente."); // Mostrar mensaje de error
    //   }
    // };

    fetchCart(setDriverPosition, setEnRuta, enRuta, setMensajeEspera, wsRef, codigo).then((cart) => {
      setPedido(cart);
      setLoading(false);
      // if (cart?.codigoSeguimiento && !mensajeEnviadoRef.current) { // Evita envío duplicado usando `ref`
      //   sendMessage(cart.codigoSeguimiento);
      // }
    });
  }, []); // Ejecutar solo al montar el componente


  useEffect(() => {
    if (enRuta === "entregado") {
      sendMessageConfirmation(); // Envía el mensaje de confirmación
    }
  }, [enRuta]);

  useEffect(() => {
    if (pedido) {
      setLoading(false);
      mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
      window.scrollBy(0, -30);
    }
  }, [pedido]);

  const retrySendMessage = () => {
    const sendMessage = async (codigoSeguimiento: string) => {
      try {
        await axios.post("http://localhost:9000/admin/whatsApp", {
          mensaje: `🍦 *Helados Villaizan* 🍦\n\n¡Hola!\nTu pedido ha sido confirmado y está en camino. 🎉\n\n📦 *Código de seguimiento:* ${codigoSeguimiento}\n\nPara conocer el estado de tu pedido en tiempo real, ingresa al siguiente enlace: http://localhost:8000/seguimiento?codigo=${codigoSeguimiento} o visita nuestro sitio web y usa tu código en la sección 'Rastrea tu pedido'.\n\nSi tienes alguna consulta, ¡estamos aquí para ayudarte! 😊`,
          numero: "959183082"
        });
        console.log("Mensaje enviado a WhatsApp.");
        setMensajeEnviado(true); // Marcar como enviado para evitar duplicados
        setError(null); // Limpiar el error si el mensaje se envía correctamente
      } catch (error) {
        console.error("Error al enviar mensaje de WhatsApp:", error);
        setError("No se pudo enviar el mensaje de WhatsApp. Haz clic en el botón para intentar nuevamente."); // Mostrar mensaje de error
      }
    };
    if (pedido?.codigoSeguimiento) {
      sendMessage(pedido.codigoSeguimiento);
    }
  };
  
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const inputCodigo = (event.target as HTMLFormElement).elements.namedItem(
      "codigo"
    ) as HTMLInputElement;
    const codigoValue = inputCodigo.value;
    if (codigoValue) {
      window.location.href = `?codigo=${codigoValue}`;
    }
  };

  return (
    <div>
      <img
        src="/images/bannerFlujoCompra.png"
        alt="Promociones en Villaizan"
        style={{
          width: "100%",
          height: "20vh",
          objectFit: "cover", // Ensures the image covers the specified dimensions
          objectPosition: "center", // Centers the image within the specified dimensions
        }}
      />

      <div style={{ padding: "20px" }}>
        {!codigo ? (
          <>
            <div className="flex flex-col items-center mt-8">
              <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                Ingresa el código de seguimiento de tu pedido
              </h1>
              <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                <div className="flex items-center border-b border-b-2 border-rojoVillaizan py-2">
                  <input
                    type="text"
                    name="codigo"
                    placeholder="Código de seguimiento"
                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                  />
                  <button
                    type="submit"
                    className="flex-shrink-0 bg-rojoVillaizan hover:bg-rojoVillaizan-700 border-gray-200 hover:border-gray-400 text-sm border-4 text-white py-1 px-2 rounded"
                  >
                    Rastrear
                  </button>
                </div>
              </form>
            </div>
          </>
        ) : (
          <>
            {loading ? (
              <div
                className="flex justify-center items-center"
                style={{ height: "500px" }}
              >
                <LoadingSpinner />
              </div>
            ) : (
              <>
                <div
                  style={{
                    marginTop: "20px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                  ref={mapRef}
                >
                  <SeguimientoHeader pedido={pedido} enRuta={enRuta} />
                </div>

                <div
                  style={{
                    marginTop: "40px",
                    height: "64vh",
                    border: "1px solid #ccc",
                  }}
                >
                  {enRuta === "ruta" ? (
                    <MapaTracking
                      pedido={pedido}
                      driverPosition={driverPosition ?? [-6.476, -76.361]}
                    />
                  ) : enRuta === "espera" ? (
                    <EnEsperaTracking
                      codigoSeguimiento={pedido?.codigoSeguimiento ?? "ADA123"}
                      mensaje={mensajeEspera}
                    />
                  ) : enRuta === "entregado" ? (
                    <PedidoEntregado pedidoId={pedido?.id ?? "Hola"} />
                  ) : enRuta === "cancelado" ? (
                    <PedidoCancelado />
                  ) : null}
                </div>
                {/* Botón para cancelar el pedido */}
                {enRuta === "espera" && (
                  <div style={{ textAlign: "center", marginTop: "20px" }}>
                    <button
                      onClick={handleCancelClick}
                      style={{
                        backgroundColor: "#ff5a5f",
                        color: "#fff",
                        padding: "12px 25px",
                        borderRadius: "8px",
                        cursor: "pointer",
                        fontSize: "16px",
                        fontWeight: "bold",
                        border: "2px solid #ff5a5f",
                        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.backgroundColor = "#ff4a4f";
                        e.currentTarget.style.borderColor = "#ff4a4f";
                        e.currentTarget.style.boxShadow = "0 6px 12px rgba(0, 0, 0, 0.15)";
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.backgroundColor = "#ff5a5f";
                        e.currentTarget.style.borderColor = "#ff5a5f";
                        e.currentTarget.style.boxShadow = "0 4px 8px rgba(0, 0, 0, 0.1)";
                      }}
                    >
                      Cancelar Pedido
                    </button>
                  </div>
                )}
                {/* Modal de Confirmación */}
                <ConfirmModal
                  isOpen={showConfirmModal}
                  onConfirm={cancelarPedido}
                  onClose={() => setShowConfirmModal(false)}
                  message="¿Estás seguro de que deseas cancelar el pedido?"
                />
              </>
            )}
          </>
        )}
        {error && (
          <div className="error-message" style={{ color: "red", marginTop: "20px", textAlign: "center" }}>
            <p>{error}</p>
            <button onClick={retrySendMessage} style={{ backgroundColor: "#ff5a5f", color: "#fff", padding: "10px", borderRadius: "5px", cursor: "pointer" }}>
              Reenviar código de seguimiento
            </button>
          </div>
        )}
      </div>
    </div>
  )
}



const SeguimientoPageWrapper = () => (
  <Suspense fallback={<div>Loading...</div>}>
    <TrackingPage />
  </Suspense>
);

export default SeguimientoPageWrapper
