"use client"; // Esta directiva le dice a Next.js que este es un componente de cliente

import { useEffect, useState } from "react"
import ProductPreview from "@modules/products/components/product-preview"
import { Pagination } from "@modules/store/components/pagination"
import axios from "axios"
import { Producto } from "types/PaqueteProducto"

const PRODUCT_LIMIT = 12
const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

export default function PaginatedProducts({
  sortBy,
  page,
  collectionId,
  categoryId,
  productsIds,
  countryCode,
}: {
  sortBy?: string
  page: number
  collectionId?: string
  categoryId?: string
  productsIds?: string[]
  countryCode: string
}) {
  const [products, setProducts] = useState<Producto[]>([])
  const [totalPages, setTotalPages] = useState(1)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    // Función async dentro del useEffect
    const fetchProducts = async () => {
      setLoading(true)
      try {
        const response = await axios.get(`${baseUrl}/admin/producto`)
        console.log("API response:", response)  // Verifica la respuesta de la API

        if (!response || !response.data || !response.data.productos) {
          throw new Error("Invalid response structure")
        }

        const products = response.data.productos
        console.log("Products:", products) // Verifica que los productos estén aquí
        setProducts(products)

        const count = products.length
        setTotalPages(Math.ceil(count / PRODUCT_LIMIT))
      } catch (error: unknown) {
        if (axios.isAxiosError(error)) {
          console.error("Error fetching products:", error.response ? error.response.data : error.message)
        } else {
          console.error("Error fetching products:", error)
        }
        setError("Error fetching products")
      } finally {
        setLoading(false)
      }
    }

    // Llama a la función async
    fetchProducts()
  }, [page, sortBy]) // El efecto se ejecuta cuando cambian `page` o `sortBy`

  if (loading) {
    return <div>Loading...</div>
  }

  if (error) {
    return <div>{error}</div>
  }

  return (
    <>
      <ul className="grid grid-cols-2 w-full small:grid-cols-3 medium:grid-cols-4 gap-x-6 gap-y-8" data-testid="products-list">
        {products.map((p: Producto) => (
          <li key={p.id}>
            <ProductPreview productPreview={p} />
          </li>
        ))}
      </ul>
      {totalPages > 1 && <Pagination data-testid="product-pagination" page={page} totalPages={totalPages} />}
    </>
  )
}
