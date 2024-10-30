"use client"; 
import { useState } from "react";
import Promotions from "@modules/home/components/promotions";


export default function Home() {
  const [trackingCode, setTrackingCode] = useState("");

  const handleTrackOrder = () => {
    if (trackingCode) {
      window.location.href = `http://localhost:8000/seguimiento?codigo=${trackingCode}`;
    } else {
      alert("Por favor, ingresa un código de seguimiento.");
    }
  };
  return (
    <div>
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