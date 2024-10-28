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

const MapaTracking = dynamic(() => import("@components/MapaTracking"), {
  ssr: false,
})

interface ExtendedWebSocket extends WebSocket {
  intervalId?: NodeJS.Timeout
}

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL 

const fetchCart = async (
  setDriverPosition: (position: [number, number]) => void,
  setEnRuta: (enRuta: string) => void,
  enRuta: string,
  setMensajeEspera: (mensaje: string) => void
): Promise<Pedido> => {
  const respuesta = await retrievePedido(true)
  let cart: Pedido = respuesta
  let aux = cart.detalles
  const enrichedItems = await enrichLineItems(cart.detalles)
  // console.log("Detalles enriquecidos:", enrichedItems);
  cart.detalles = enrichedItems
  const response = await axios.get(baseUrl + "/admin/motorizado/"+cart.motorizado?.id+"?enriquecido=true")
  cart.motorizado = response.data.motorizado
//   console.log("Cart enriquecido:", cart);

  let ws: ExtendedWebSocket | null = null
  //Conectar a websocket para recibir actualizaciones en tiempo real
  if (cart.motorizado) {
    // Conectar a websocket para recibir actualizaciones en tiempo real
    ws = connectWebSocket(
      cart.motorizado.id, // idRepartidor
      cart.id, // idPedido
      (data) => {
        // console.log(data);
        if (enRuta === "entregado") {
          return
        }
        if (data.type === "locationResponse") {
          // Actualizar la posición del motorizado
          setEnRuta("ruta")
          setDriverPosition([data.data.lat, data.data.lng])
        } else if (data.type === "confirmarResponse") {
          // El pedido está en proceso de confirmación por parte del administrador
          setEnRuta("espera")
          setMensajeEspera("Estamos confirmando tu pedido. Por favor, espera un momento.")
        } else if (data.type === "notYetResponse") {
          // El motorizado está atendiendo otros pedidos
          setEnRuta("espera")
          setMensajeEspera("El repartidor está atendiendo otros pedidos.\n Por favor, espera un momento.")
        } else if (data.type === "entregadoResponse") {
          // El pedido ha sido entregado
          setEnRuta("entregado")
          // De momento lo enviamos a la página de inicio
          window.location.href = "/"
        }
      },
      () => {
        // Handle WebSocket connection close
        console.log("WebSocket connection closed")
        if (ws && ws.intervalId) {
          console.log("Clearing interval with ID:", ws.intervalId)
          clearInterval(ws.intervalId) // Clear the interval when the connection is closed
        } else {
          console.log("No interval ID found on WebSocket instance")
        }
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
    "Tu pedido está siendo preparado. Por favor, espera un momento."
  );
  const [error, setError] = useState<string | null>(null);
  const mensajeEnviadoRef = useRef<boolean>(false); // Ref para controlar el envío
  const [mensajeEnviado, setMensajeEnviado] = useState<boolean>(false); // Control de envío único
  const mapRef = useRef<HTMLDivElement>(null);
  const search = useSearchParams();
  const [codigo, setCodigo] = useState<string | null>(
    search.get("codigo")
  );

  

  useEffect(() => {
    const sendMessage = async (codigoSeguimiento: string) => {
      if (mensajeEnviadoRef.current) return; // Verifica si ya se envió el mensaje
      try {
        await axios.post("http://localhost:9000/admin/whatsApp", {
          mensaje: `🍦 *Helados Villaizan* 🍦\n\n¡Hola!\nTu pedido ha sido confirmado y está en camino. 🎉\n\n📦 *Código de seguimiento:* ${codigoSeguimiento}\n\nPara conocer el estado de tu pedido en tiempo real, ingresa al siguiente enlace: http://localhost:8000/seguimiento?codigo=${codigoSeguimiento} o visita nuestro sitio web y usa tu código en la sección 'Rastrea tu pedido'.\n\nSi tienes alguna consulta, ¡estamos aquí para ayudarte! 😊`,
          numero: "959183082"
        });
        console.log("Mensaje enviado a WhatsApp.");
        mensajeEnviadoRef.current = true; // Marca como enviado
        setError(null); // Limpiar el error si el mensaje se envía correctamente
      } catch (error) {
        console.error("Error al enviar mensaje de WhatsApp:", error);
        setError("No se pudo enviar el mensaje de WhatsApp. Haz clic en el botón para intentar nuevamente."); // Mostrar mensaje de error
      }
    };

    fetchCart(setDriverPosition, setEnRuta, enRuta, setMensajeEspera).then((cart) => {
      setPedido(cart);
      setLoading(false);
      if (cart?.codigoSeguimiento && !mensajeEnviadoRef.current) { // Evita envío duplicado usando `ref`
        sendMessage(cart.codigoSeguimiento);
      }
    });
  }, []); // Ejecutar solo al montar el componente

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
                  ) : null}
                </div>
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
