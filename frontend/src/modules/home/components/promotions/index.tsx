import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { Promocion } from 'types/PaquetePromocion';
import Thumbnail from '@modules/products/components/thumbnail';

const Promotions = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
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

  return (
    <div className="py-12 text-center bg-white">
      {promociones.length > 0 && (
        <>
          <h2 className="text-3xl font-bold mb-8">Disfruta de nuestras promociones</h2>
          <div className="relative max-w-4xl mx-auto">
            <Swiper
              spaceBetween={1}
              slidesPerView={3}
              loop={true}
              modules={[Navigation, Autoplay]} // Enable navigation and autoplay
              autoplay={{
                delay: 5000, // Auto-slide every 5 seconds
                disableOnInteraction: false, // Keep sliding even after user interaction
              }}
              navigation={true} // Enable Swiper's built-in navigation
              className="overflow-hidden"
            >
              {promociones.map((promocion, index) => (
                <SwiperSlide key={index} className="flex flex-col items-center">
                  <div className="flex flex-col items-center space-y-1">
                    <div className="w-48 h-48">
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
                    <h3 className="text-lg font-semibold text-center">{promocion.titulo}</h3>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Custom style to override the default Swiper arrow styles */}
            <style global jsx>{`
              /* Override Swiper's default arrow styles to make them black and more separated */
              .swiper-button-prev,
              .swiper-button-next {
                color: black !important;  /* Set arrows to black */
                font-size: 2rem !important;  /* Increase arrow size */
              }

              .swiper-button-prev:hover,
              .swiper-button-next:hover {
                color: black !important; /* Keep hover color black */
              }

              /* Increase distance from center for better separation */
              .swiper-button-prev {
                left: 30px !important; /* Move left arrow further from center */
              }

              .swiper-button-next {
                right: 30px !important; /* Move right arrow further from center */
              }

              /* Optionally add some shadow for better visibility */
              .swiper-button-prev, .swiper-button-next {
                box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);  /* Adds subtle shadow */
              }
            `}</style>
          </div>

          {/* Button for Ice Cream Catalog */}
          <div className="mt-8">
            <Link href="/comprar" passHref>
              <button className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold">
                Catálogo de Helados
              </button>
            </Link>
          </div>
        </>
      )}
    </div>
  );
};

export default Promotions;
