"use client"

import { Suspense, useState } from "react"

import SkeletonProductGrid from "@modules/skeletons/templates/skeleton-product-grid"
import RefinementList from "@modules/store/components/refinement-list"
import { SortOptions } from "@modules/store/components/refinement-list/sort-products"

import PaginatedProducts from "./paginated-products"
import CartButton from "@modules/layout/components/cart-button"
import { Pedido } from "types/PaquetePedido"

const StoreTemplate = ({
  sortBy,
  page,
  countryCode,
}: {
  sortBy?: SortOptions
  page?: string
  countryCode: string
}) => {
  const pageNumber = page ? parseInt(page) : 1
  const [carritoState, setCarritoState] = useState<Pedido | null>(null)
  
  // {console.log("Rendering PaginatedProducts component")}
  return (
    <div className="flex flex-col small:flex-row small:items-start py-6 content-container" data-testid="category-container">
      <div className="w-full">
        <div className="mb-8 text-2xl-semi">
          <h1 data-testid="store-page-title">Catálogo Villaizan</h1>
          
        </div>
        <div>
          <CartButton carrito={carritoState} setCarrito={setCarritoState} />
        </div>
        <Suspense fallback={<SkeletonProductGrid />}>
          <PaginatedProducts
            sortBy={sortBy || "created_at"}
            page={pageNumber}
            countryCode={countryCode}
            carrito={carritoState}
            setCarrito={setCarritoState}
          />
        </Suspense>
      </div>
    </div>
  )
}

export default StoreTemplate
