"use client"; 
import { useEffect, useState } from "react";
import Promotions from "@modules/home/components/promotions";
import Banner from "@components/ui/Banner";
import axios from "axios";
import { Button } from "@components/Button";

function getCurrentDay(): string {
  const daysInSpanish = ['domingo', 'lunes', 'martes', 'miercoles', 'jueves', 'viernes', 'sabado'];
  const today = new Date().getDay();
  return daysInSpanish[today];
}

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
const frontUrl = process.env.NEXT_PUBLIC_BASE_URL;

export default function Home() {
  const [trackingCode, setTrackingCode] = useState("");
  const [minOrderAmount, setMinOrderAmount] = useState<number | undefined>(undefined);
  const [startTime, setStartTime] = useState<string | undefined>(undefined);
  const [endTime, setEndTime] = useState<string | undefined>(undefined);
  const [isLoadingResponse, setIsLoadingResponse] = useState(true);

  const currentDay = getCurrentDay();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoadingResponse(true);
  
        // Fetch the minimum order amount
        const minOrderResponse = await axios.get(`${baseUrl}/admin/ajuste/monto_minimo_pedido`);
        const ajuste = minOrderResponse.data.ajuste;
        if (ajuste && ajuste.valor) {
          setMinOrderAmount(ajuste.valor);
        }
  
        // Fetch the operating hours for the current day
        const hoursResponse = await axios.get(`${baseUrl}/admin/ajuste/horario_${currentDay}`);
        const ajusteHoras = hoursResponse.data.ajuste;
        const [start, end] = ajusteHoras.valor.split("-");
        setStartTime(start);
        setEndTime(end);
      } catch (error) {
        console.error("Error fetching monto_minimo_pedido and hoursResponse:", error);
        setMinOrderAmount(undefined);
        setStartTime(undefined);
        setEndTime(undefined);
      } finally {
        setIsLoadingResponse(false);
      }
    };
  
    fetchData();
  
    // Polling
    const intervalId = setInterval(fetchData, 1200000); // Re-fetch cada dos minutos
  
    // Limpiar intervalo cuando se desmonta un componente
    return () => clearInterval(intervalId);
  }, [currentDay]);
  

  const handleTrackOrder = () => {
    if (trackingCode) {
      window.location.href = `${frontUrl}/seguimiento?codigo=${trackingCode}`;
    } else {
      alert("Por favor, ingresa un código de seguimiento.");
    }
  };



  return (
    <div>
      {/*Banner*/}
      {isLoadingResponse ? (
        <div className="flex justify-center items-center h-full">
          <Button isLoading loaderClassname="w-6 h-6" variant="ghost" />
        </div>
      ) : (
        <Banner minOrderAmount={minOrderAmount} startTime={startTime} endTime={endTime} />
      )}
      {/* Imagen debajo del Hero */}
      <div className="relative w-full">
        <img
          src="/images/helados-promo.png"
          alt="Promoción Helados Villaizan"
          className="w-full object-cover"
        />
      </div>
      {/* Sección de Código de Seguimiento */}
      <div className="tracking-section py-12 bg-[#f3f4f6] flex flex-col items-center rounded-lg shadow-lg mx-6 my-12">
        <h2 className="text-3xl font-bold text-green-600 mb-4">Rastrea tu Pedido 🛵</h2>
        <p className="text-md text-gray-600 mb-6 max-w-md text-center">
          Ingresa tu código de seguimiento para obtener información sobre tu pedido.
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
      {/* Componente de Promociones */}
      <Promotions />

      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          {/* <FeaturedProducts collections={collections} region={region} /> */}
        </ul>
      </div>
    </div>
  );
}