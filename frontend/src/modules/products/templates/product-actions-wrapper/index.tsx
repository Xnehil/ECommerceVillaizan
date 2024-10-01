import { retrievePricedProductById } from "@lib/data"
import { Region } from "@medusajs/medusa"
import ProductActions from "@modules/products/components/product-actions"
import axios from "axios"
import { Producto } from "types/PaqueteProducto"
const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
/**
 * Fetches real time pricing for a product and renders the product actions component.
 */
export default async function ProductActionsWrapper({
  id,
  region,
}: {
  id: string
  region?: Region
}) {
  const producto: Producto = await axios.get(
    `${baseUrl}/producto/${id}`
  ).then(({ data }) => data);

  if (!producto) {
    return null
  }

  return <ProductActions product={producto} region={region} />
}
