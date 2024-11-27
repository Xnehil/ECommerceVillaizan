"use client"
import Link from "next/link"
import PaginatedProducts from "./paginated-products"
import { Suspense, useEffect, useState } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { Pedido } from "types/PaquetePedido"
import { getCityCookie, setCityCookie } from "../actions"
import CiudadPopup from "@components/CiudadPopup"
import CiudadPopup2 from "@components/CiudadPopup2"
import SelectCity from "@components/SelectCity"
import ConfirmChangeCityPopup from "@components/ConfirmChangeCityPopup" // Importar el popup de confirmación
import { CityCookie } from "types/global"
import { deleteCart } from "@modules/cart/actions"
const urlLogin = process.env.NEXT_PUBLIC_APP_URL;
const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
  isAuthenticated 
}: {
  sortBy?: string
  page?: string
  countryCode: string
  isAuthenticated: boolean
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const [carritoState, setCarritoState] = useState<Pedido | null>(null)
  const [selectCityPopup, setSelectCityPopup] = useState(false)
  const [showConfirmPopup, setShowConfirmPopup] = useState(false) // Estado para el popup de confirmación
  const [city, setCity] = useState<CityCookie | null>(null)
  const currentUrl = typeof window !== "undefined" ? window.location.href : "";
  const loginUrl = `${urlLogin}/login?callbackUrl=${currentUrl}`;
  

  useEffect(() => {
    const cityCookie: CityCookie = getCityCookie()
    if (!cityCookie || cityCookie.id == "none") {
      setSelectCityPopup(true)
      return
    }
    setCity(cityCookie)
  }, [])

  useEffect(() => {
    if (city) {
      setCityCookie(city)
      setSelectCityPopup(false)
    }
  }, [city])

  // Nueva función para reiniciar el carrito
// Nueva función async para resetear el carrito
    const resetCarrito = async () => {
      const result = await deleteCart(); // Llamada a deleteCart para eliminar el carrito

      if (result?.success) {
        console.log(result.message);
        setCarritoState(null); // Actualiza el estado local si es necesario
      } else {
        console.error(result?.message);
      }
    };

  // Funciones para manejar la confirmación de cambio de ciudad
  const handleConfirmCityChange = () => {
    setSelectCityPopup(true) // Procede a cambiar la ciudad
    resetCarrito(); // Llama a resetCarrito para vaciar/eliminar el carrito
    setShowConfirmPopup(false) // Cierra el popup
  }

  const handleCancelCityChange = () => {
    setShowConfirmPopup(false) // Cierra el popup sin cambiar
  }

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      {selectCityPopup && <CiudadPopup2 setCity={setCity} resetCarrito={resetCarrito} />}
      
      {!selectCityPopup &&  (
        <div className="w-full">
          { !isAuthenticated && (
            <div className="mb-8 text-2xl-semi">
            <Link href={loginUrl} passHref>
              <h1
                data-testid="store-page-title"
                className="cursor-pointer text-white text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 p-4 text-center rounded-lg shadow-lg uppercase"
              >
                ¡Regístrate y accede a las promociones que tenemos para ti 🔥!
              </h1>
            </Link>
          </div>
          )

          }
          

          {city && (
            <SelectCity
              setSelectCityPopup={() => setShowConfirmPopup(true)} // Activa el popup de confirmación
              city={city}
            />
          )}

          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sortBy || "created_at"}
              page={pageNumber}
              countryCode={countryCode}
              carrito={carritoState}
              setCarrito={setCarritoState}
              city={city}
              isAuthenticated={isAuthenticated}
            />
          </Suspense>
        </div>
      )}

      {/* Popup de confirmación afuera de SelectCity */}
      {showConfirmPopup && (
        <ConfirmChangeCityPopup
          onConfirm={handleConfirmCityChange}
          onCancel={handleCancelCityChange}
        />
      )}
    </div>
  )
}

export default StoreTemplate
