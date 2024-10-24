"use client"

import EnEsperaTracking from "@components/EnEsperaTracking"
import { LoadingSpinner } from "@components/LoadingSpinner"
import PedidoEntregado from "@components/PedidoEntregado"
// import MapaTracking from '@components/MapaTracking';
import SeguimientoHeader from "@components/SeguimientoHeader"
import { connectWebSocket } from "@lib/util/websocketUtils"
import {
  enrichLineItems,
  retrieveCart,
  retrievePedido,
} from "@modules/cart/actions"
import axios from "axios"
import dynamic from "next/dynamic"
import { useSearchParams } from "next/navigation"
import React, { useEffect, useRef } from "react"
import { Pedido } from "types/PaquetePedido"

import { Suspense } from 'react';


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
  const [pedido, setPedido] = React.useState<Pedido | null>(null)
  //Extract ?codigo= from URL
  const search = useSearchParams()
  const [codigo, setCodigo] = React.useState<string | null>(
    search.get("codigo")
  )
  const [loading, setLoading] = React.useState<boolean>(true)
  const [driverPosition, setDriverPosition] = React.useState<[number, number]>([
    -6.476, -76.361,
  ])
  const [enRuta, setEnRuta] = React.useState<string>("espera")
  const mapRef = useRef<HTMLDivElement>(null)
  const [mensajeEspera, setMensajeEspera] = React.useState<string>(
    "Tu pedido está siendo preparado. Por favor, espera un momento."
  )

  useEffect(() => {
    fetchCart(setDriverPosition, setEnRuta, enRuta, setMensajeEspera).then((cart) => {
      // console.log(cart);
      setPedido(cart)
      setLoading(false)
    })
  }, [])

  useEffect(() => {
    if (pedido) {
      setLoading(false)
      mapRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })
      window.scrollBy(0, -30) // Adjust the value (-50) to scroll a bit higher
    }
  }, [pedido])

  // useEffect(() => {
  //     if (driverPosition) {
  //         console.log(driverPosition);
  //     }
  // } , [driverPosition]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    const inputCodigo = (event.target as HTMLFormElement).elements.namedItem(
      "codigo"
    ) as HTMLInputElement
    const codigoValue = inputCodigo.value
    if (codigoValue) {
      window.location.href = `?codigo=${codigoValue}`
    }
  }

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
