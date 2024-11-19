import { useState, useEffect } from "react";
import axios from "axios";
import Link from "next/link";
import { Promocion } from "types/PaquetePromocion";
import Thumbnail from "@modules/products/components/thumbnail";

const Promotions = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(`${baseUrl}/admin/promocion/validas`);
        setPromociones(response.data.promociones);
      } catch (error) {
        console.error("Error fetching promotions:", error);
      }
    };

    fetchPromotions();
  }, [baseUrl]);

  const handleNext = () => {
    if (currentIndex < promociones.length - 3) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  return (
    <div className="py-12 text-center bg-white">

      {promociones.length > 0 && (
        <>
        <h2 className="text-3xl font-bold mb-8">Disfruta de nuestras promociones</h2>
        <div className="relative max-w-4xl mx-auto">
          {/* Carousel */}
          <div className="flex overflow-hidden gap-4">
            {promociones.slice(currentIndex, currentIndex + 3).map((promocion, index) => (
              <div key={index} className="flex flex-col items-center mx-auto">
                <div className="w-64 h-64">
                  {promocion.urlImagen ? (
                    <Thumbnail
                      thumbnail={promocion.urlImagen}
                      size="square"
                      className="border-2 border-gray-300 rounded-lg shadow-md w-full h-full"
                      isFeatured={true}
                      data-testid={`promocion-${index}`}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-100 border-2 border-gray-300 rounded-lg shadow-md flex items-center justify-center">
                      <span className="text-gray-500 text-sm">Sin Imagen</span>
                    </div>
                  )}
                </div>
                <h3 className="text-lg font-semibold mt-4 text-center">{promocion.titulo}</h3>
              </div>
            ))}
          </div>

          {/* Navigation Arrows */}
          {promociones.length > 3 && (
            <>
              <button
                onClick={handlePrev}
                className={`absolute left-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 ${currentIndex === 0 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                ◀
              </button>
              <button
                onClick={handleNext}
                className={`absolute right-0 top-1/2 transform -translate-y-1/2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-full p-2 ${currentIndex >= promociones.length - 3 ? "opacity-50 cursor-not-allowed" : ""}`}
              >
                ▶
              </button>
            </>
          )}
        </div>
        </>
      )}

      {/* Button for Ice Cream Catalog */}
      <div className="mt-8">
        <Link href="/comprar" passHref>
          <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold">
            Catálogo de Helados
          </button>
        </Link>
      </div>
    </div>
  );
};

export default Promotions;
