"use client";

import { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import StoreTemplate from "@modules/store/templates";
import axios from "axios";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";
import { Button } from "@components/Button"
import Banner from "@components/ui/Banner"

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

type Params = {
  searchParams: {
    sortBy?: SortOptions;
    page?: string;
  };
  params: {
    countryCode: string;
  };
};

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

export default function StorePage({ searchParams, params }: Params) {
  const { sortBy, page } = searchParams;
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasRunOnceAuth = useRef(false);
  const currentDay = getCurrentDay()
  const [isLoadingResponse, setIsLoadingResponse] = useState(true)
  const hasRunOnce = useRef(false)
  const [minOrderAmount, setMinOrderAmount] = useState<number | undefined>(
    undefined
  )
  const [startTime, setStartTime] = useState<string | undefined>(undefined)
  const [endTime, setEndTime] = useState<string | undefined>(undefined)


  useEffect(() => {
    if(status !== "loading" && !hasRunOnceAuth.current) {
      hasRunOnceAuth.current = true;
      if (session?.user?.id) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, [session, status]);

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
        }
      } catch (error) {
        console.error(
          "Error fetching monto_minimo_pedido and hoursResponse:",
          error
        )
        setMinOrderAmount(undefined)
        setStartTime(undefined)
        setEndTime(undefined)
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

  return (
    <>
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
      {/* Banner debajo del header */}
      <img
        src="/images/bannerFlujoCompra.png"
        alt="Promociones en Villaizan"
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
      {/* Contenido de la tienda */}
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}
