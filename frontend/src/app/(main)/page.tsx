"use client"
import { useEffect, useRef, useState } from "react"
import { useSession } from "next-auth/react"
import Promotions from "@modules/home/components/promotions"
import Banner from "@components/ui/Banner"
import axios from "axios"
import { Button } from "@components/Button"
import Hero from "@modules/home/components/hero"

function getCurrentDay(): string {
  const daysInSpanish = [
    "domingo",
    "lunes",
    "martes",
    "miercoles",
    "jueves",
    "viernes",
    "sabado",
  ]
  const today = new Date().getDay()
  return daysInSpanish[today]
}

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
const frontUrl = process.env.NEXT_PUBLIC_BASE_URL

export default function Home() {
  const { data: session, status } = useSession()
  const [trackingCode, setTrackingCode] = useState("")
  const [minOrderAmount, setMinOrderAmount] = useState<number | undefined>(
    undefined
  )
  const [startTime, setStartTime] = useState<string | undefined>(undefined)
  const [endTime, setEndTime] = useState<string | undefined>(undefined)
  const [isLoadingResponse, setIsLoadingResponse] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [hasActiveOrder, setHasActiveOrder] = useState(false)
  const [orderTrackingCode, setOrderTrackingCode] = useState<string | null>(
    null
  )

  const currentDay = getCurrentDay()
  const hasRunOnce = useRef(false)
  //const hasRunOnceAuth = useRef(false)

  useEffect(() => {
    if (status !== "loading" /*&& !hasRunOnceAuth.current*/) {
      //hasRunOnceAuth.current = true
      if (session?.user?.id) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    }
  }, [session, status])

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!hasRunOnce.current) {
          hasRunOnce.current = true
          setIsLoadingResponse(true)

          // Fetch the minimum order amount
          const minOrderResponse = await axios.get(
            `${baseUrl}/admin/ajuste/monto_minimo_pedido`
          )
          const ajuste = minOrderResponse.data.ajuste
          if (ajuste && ajuste.valor) {
            setMinOrderAmount(ajuste.valor)
          }

          // Fetch the operating hours for the current day
          const hoursResponse = await axios.get(
            `${baseUrl}/admin/ajuste/horario_${currentDay}`
          )
          const ajusteHoras = hoursResponse.data.ajuste
          const [start, end] = ajusteHoras.valor.split("-")
          setStartTime(start)
          setEndTime(end)

          try {
            const orderUrl = `${baseUrl}/admin/pedido/usuario?id=${session?.user?.id}&estado=solicitado&estado=verificado&estado=enProgreso`
            console.log("Order URL:", orderUrl)
            const orderResponse = await axios.get(orderUrl)

            if (orderResponse.data.error) {
              console.error(orderResponse.data.message)
            } else if (
              orderResponse.data.pedidos &&
              orderResponse.data.pedidos.length > 0
            ) {
              setHasActiveOrder(true)
              setOrderTrackingCode(
                orderResponse.data.pedidos[0].codigoSeguimiento
              )
            }
          } catch (error) {
            if (axios.isAxiosError(error) && error.response?.status === 404) {
              console.log("No pedido found")
              // Perform any fallback logic if needed
            } else {
              // Re-throw unexpected errors to be caught in the outer catch
              throw error
            }
          }
        }
      } catch (error) {
        console.error(
          "Error fetching monto_minimo_pedido and hoursResponse:",
          error
        )
        setMinOrderAmount(undefined)
        setStartTime(undefined)
        setEndTime(undefined)
        setHasActiveOrder(false)
      } finally {
        setIsLoadingResponse(false)
      }
    }

    fetchData()

    // Polling
    const intervalId = setInterval(fetchData, 1200000) // Re-fetch cada dos minutos

    // Limpiar intervalo cuando se desmonta un componente
    return () => clearInterval(intervalId)
  }, [currentDay, session])

  const handleTrackOrder = () => {
    if (trackingCode) {
      window.location.href = `${frontUrl}/seguimiento?codigo=${trackingCode}`
    } else {
      alert("Por favor, ingresa un código de seguimiento.")
    }
  }

  const handleViewActiveOrder = () => {
    if (orderTrackingCode) {
      window.location.href = `${frontUrl}/seguimiento?codigo=${orderTrackingCode}`
    }
  }

  return (
    <div>
      {/*Banner*/}
      {isLoadingResponse ? (
        <div className="flex justify-center items-center h-full">
          <Button isLoading loaderClassname="w-6 h-6" variant="ghost" />
        </div>
      ) : (
        <Banner
          minOrderAmount={minOrderAmount}
          startTime={startTime}
          endTime={endTime}
        />
      )}
      {/* Banner for Active Orders */}
      {hasActiveOrder && (
        <div style={activeOrderBannerStyle}>
          <p style={activeOrderTextStyle}>Tienes un pedido en progreso 🛒</p>
          <button
            onClick={handleViewActiveOrder}
            style={activeOrderButtonStyle}
          >
            Visualizar
          </button>
        </div>
      )}
      {/* Imagen debajo del Hero */}
      <Hero />
      {/* Sección de Código de Seguimiento */}
      {isAuthenticated ? null : (
        <div className="tracking-section py-12 bg-[#f3f4f6] flex flex-col items-center rounded-lg shadow-lg mx-6 my-12">
          <h2 className="text-3xl font-bold text-green-600 mb-4">
            Rastrea tu Pedido 🛵
          </h2>
          <p className="text-md text-gray-600 mb-6 max-w-md text-center">
            Ingresa tu código de seguimiento para obtener información sobre tu
            pedido.
          </p>

          <div className="flex flex-col md:flex-row gap-4 items-center w-full max-w-md">
            <input
              type="text"
              placeholder="Código de seguimiento"
              value={trackingCode}
              onChange={(e) => setTrackingCode(e.target.value)}
              className="tracking-input w-full md:flex-1 p-3 border border-green-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-600 shadow-sm"
            />

            <button
              onClick={handleTrackOrder}
              className="bg-green-600 text-white py-3 px-6 rounded-lg hover:bg-green-700 transition-all shadow-md w-full md:w-auto"
            >
              Rastrea tu pedido
            </button>
          </div>
        </div>
      )}
      {/* Componente de Promociones */}
      <Promotions />

      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          {/* <FeaturedProducts collections={collections} region={region} /> */}
        </ul>
      </div>
    </div>
  )
}

const activeOrderBannerStyle: React.CSSProperties = {
  background: "rgba(240, 248, 245, 0.8)", // soft green with slight transparency
  padding: "15px 20px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center", // center the text
  gap: "20px", // space between text and button
  boxShadow: "0px 6px 12px rgba(0, 0, 0, 0.1)", // softer shadow for depth
  borderRadius: "16px", // slightly rounder corners
  margin: "10px 0 20px 0",
  position: "relative", // necessary for absolute positioning of the button
}

const activeOrderTextStyle: React.CSSProperties = {
  color: "#3e4e42", // darker green for contrast
  fontSize: "18px",
  fontWeight: "500",
  margin: "0",
  lineHeight: "1.5",
  flexGrow: 1, // allows the text to center
  textAlign: "center", // centers the text itself
}
const activeOrderButtonStyle: React.CSSProperties = {
  padding: "8px 20px",
  backgroundColor: "#6bbf59", // a subtle and pleasant green
  color: "#ffffff",
  borderRadius: "20px", // rounded for a pill shape
  fontWeight: "bold",
  boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)", // adds a subtle depth effect
  cursor: "pointer",
  transition: "background-color 0.3s, transform 0.3s", // smooth hover transition
}
