import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Autoplay } from 'swiper/modules';
import 'swiper/swiper-bundle.css';
import { Promocion } from 'types/PaquetePromocion';
import Thumbnail from '@modules/products/components/thumbnail';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@components/tooltip";
import ButtonWhatsApp from '@components/ButtonWhatsApp';

const Promotions = () => {
  const [promociones, setPromociones] = useState<Promocion[]>([]);
  const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    const fetchPromotions = async () => {
      try {
        const response = await axios.get(`${baseUrl}/admin/promocion/validas`);
        setPromociones(response.data.promociones);
      } catch (error) {
        console.error("Error fetching promotions:", error);
        setErrorMessage('Error al cargar las promociones. Intente de nuevo más tarde.');
        setIsErrorPopupVisible(true);
      }
    };

    fetchPromotions();
  }, [baseUrl]);

  return (
    <>
    {/* Error Popup */}
    {isErrorPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <p className="text-black-600 mb-4">{errorMessage}</p>
            <button
              style={styles.confirmButton}
              onClick={() => {
                setIsErrorPopupVisible(false); // Hide popup
                window.location.href = "/";
              }}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      )}
    <div className="py-12 text-center bg-white">
      {promociones.length > 0 && (
        <>
          <h2 className="text-3xl font-bold mb-8">Disfruta de nuestras promociones</h2>
          <p className="text-lg mb-6 text-gray-600">Recuerda que las promociones solo son válidas para usuarios que han iniciado sesión.</p>
          <div className="relative max-w-4xl mx-auto">
          <Swiper
            spaceBetween={1}
            slidesPerView={promociones.length < 3 ? promociones.length : 3}
            loop={promociones.length >= 3}
            centeredSlides={promociones.length < 3}
            modules={[Navigation, Autoplay]} // Enable navigation and autoplay
            autoplay={{
              delay: 8000, // Auto-slide every 8 seconds
              disableOnInteraction: false, // Keep sliding even after user interaction
            }}
            navigation={true} // Enable Swiper's built-in navigation
            className="overflow-hidden"
          >
              {promociones.map((promocion, index) => {
                const descuento = promocion.porcentajeDescuento;
  
                // Ensure descuento is a valid number and display only the integer part
                const formattedDescuento = descuento
                  ? Math.floor(descuento) // Remove decimals
                  : 0; // Default to 0 if no descuento
  
                return (
                  <SwiperSlide key={index} className="flex flex-col items-center">
                    <div className="relative flex flex-col items-center space-y-1 group">
                      {/* Image Thumbnail with Tooltip on Hover */}
                      <div className="w-48 h-48 relative">
                        {/* Discount Percentage Badge */}
                        {descuento > 0 && (
                          <div className="absolute top-2 right-2 bg-red-600 text-white text-xs font-bold px-2 py-1 rounded-lg z-10">
                          -{Math.floor(Math.abs(descuento))}%
                        </div>
                        )}
  
                        <TooltipProvider>
                          <Tooltip>
                            <TooltipTrigger className="w-full h-full absolute top-0 left-0 cursor-pointer">
                              {/* Tooltip Trigger is now on the image */}
                              <div className="w-full h-full">
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
                            </TooltipTrigger>
                            <TooltipContent>
                              <p className="w-full break-words font-bold">
                                {promocion.textoInfo || "No hay detalles de la promoción en estos momentos, por favor, intente nuevamente más tarde."}
                              </p>
                            </TooltipContent>
                          </Tooltip>
                        </TooltipProvider>
                      </div>
  
                      {/* Title */}
                      <h3 className="text-lg font-semibold text-center mt-4">{promocion.titulo}</h3>
                    </div>
                  </SwiperSlide>
                );
              })}
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
    </>
  );  
  
};

const styles = {
  confirmButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'black',
    color: 'white',
  },
  cancelButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: 'red',
  },
};



export default Promotions;
