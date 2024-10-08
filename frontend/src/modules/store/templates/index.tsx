"use client";
import Link from "next/link"
import PaginatedProducts from "./paginated-products"
import CartButton from "@modules/layout/components/cart-button"
import { Suspense, useState } from "react"
import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"

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

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value.toLowerCase())
  }

  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container" data-testid="category-container">
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

        <CartButton />

        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sortBy || "created_at"}
            page={pageNumber}
            countryCode={countryCode}
            searchText={searchText}  
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
