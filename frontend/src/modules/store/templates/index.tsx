"use client"
import Link from "next/link"
import PaginatedProducts from "./paginated-products"
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
  const [carritoState, setCarritoState] = useState<Pedido | null>(null)
  const [selectCityPopup, setSelectCityPopup] = useState(false)
  const [city, setCity] = useState<CityCookie | null>(null)

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

  return (
    <div
      className="flex flex-col small:flex-row small:items-start py-6 content-container"
      data-testid="category-container"
    >
      {selectCityPopup && <CiudadPopup setCity={setCity} />}
      {!selectCityPopup && (
        <div className="w-full">
          <div className="mb-8 text-2xl-semi">
            <Link href="/account" passHref>
              <h1
                data-testid="store-page-title"
                className="cursor-pointer text-white text-3xl font-bold bg-gradient-to-r from-orange-400 to-red-500 p-4 text-center rounded-lg shadow-lg uppercase"
              >
                ¡Regístrate y accede a las promociones que tenemos para ti 🔥!
              </h1>
            </Link>
          </div>
          {city && (
            <SelectCity setSelectCityPopup={setSelectCityPopup} city={city} />
          )}     
          {/* Move the CartButton below the filters */}
          <Suspense fallback={<SkeletonProductGrid />}>
            <PaginatedProducts
              sortBy={sortBy || "created_at"}
              page={pageNumber}
              countryCode={countryCode}
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
