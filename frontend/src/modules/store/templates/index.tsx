"use client"
import Link from "next/link"
import PaginatedProducts from "./paginated-products"
import CartButton from "@modules/layout/components/cart-button"
import { Suspense, useEffect, useState } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import { Pedido } from "types/PaquetePedido"
import { getCityCookie, setCityCookie } from "../actions"
import CiudadPopup from "@components/CiudadPopup"
import SelectCity from "@components/SelectCity"
import { CityCookie } from "types/global"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: string
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1

  // Estado para la búsqueda de texto
  const [searchText, setSearchText] = useState("")
  const [carritoState, setCarritoState] = useState<Pedido | null>(null)
  const [selectCityPopup, setSelectCityPopup] = useState(false)
  const [city, setCity] = useState<CityCookie | null>(null)

  useEffect(() => {
    // Check for city ID cookie
    const cityCookie: CityCookie = getCityCookie()
    if (!cityCookie || cityCookie.id == "none") {
      setSelectCityPopup(true)
      console.log("City not set")
      return
    }
    console.log("City ID:", cityCookie)
    setCity(cityCookie)
    // console.log("City set:", city)
  }, [])

  useEffect(() => {
    if (city) {
      setCityCookie(city)
      console.log("City set:", city)
      setSelectCityPopup(false)
    }
  }, [city])

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value.toLowerCase())
  }

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      {selectCityPopup && <CiudadPopup setCity={setCity} />}
      {!selectCityPopup && (
        <div className="w-full">
          <div className="mb-8 text-2xl-semi">
            {/* Envolver en un Link para que sea clicable */}
            <Link href="/account" passHref>
              <h1
                data-testid="store-page-title"
                className="cursor-pointer text-white text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 p-4 text-center rounded-lg shadow-lg uppercase"
              >
                ¡Regístrate y accede a las promociones que tenemos para ti 🔥!
              </h1>
            </Link>
          </div>

          <div className="flex justify-between items-center mb-4">
            <input
              type="text"
              placeholder="Busca tu helado"
              value={searchText}
              onChange={handleSearchChange}
              className="h-12 border border-gray-300 bg-white rounded-md px-4"
            />
          </div>

          <CartButton carrito={carritoState} setCarrito={setCarritoState} />

          {city && (
            <SelectCity setSelectCityPopup={setSelectCityPopup} city={city} />
          )}

          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sortBy || "created_at"}
              page={pageNumber}
              countryCode={countryCode}
              searchText={searchText}
              carrito={carritoState}
              setCarrito={setCarritoState}
              city={city}
            />
          </Suspense>
        </div>
      )}
    </div>
  )
}

export default StoreTemplate
