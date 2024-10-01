import { Text } from "@medusajs/ui"

import { ProductPreviewType } from "types/global"

import { retrievePricedProductById } from "@lib/data"
import { getProductPrice } from "@lib/util/get-product-price"
import { Region } from "@medusajs/medusa"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"
import Link from "next/link"
import { Producto } from "types/PaqueteProducto"
import axios from "axios"

export default async function ProductPreview({
  productPreview,
  isFeatured,
  region,
}: {
  productPreview: Producto
  isFeatured?: boolean
  region: Region
}) {
  const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

  const pricedProduct = await axios.get(`${baseUrl}/admin/producto/${productPreview.id}`).then((response) => response.data)


  //  await retrievePricedProductById({
  //   id: productPreview.id,
  //   regionId: region.id,
  // }).then((product) => product)

  if (!pricedProduct) {
    return null
  }

  // const { cheapestPrice } = getProductPrice({
  //   product: pricedProduct,
  //   region,
  // })

  const cheapestPrice = pricedProduct.precio

  return (
    <Link
      href={`/products/${productPreview.nombre}`}
      className="group"
    >
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={productPreview.urlImagen}
          size="full"
          isFeatured={isFeatured}
        />
        <div className="flex txt-compact-medium mt-4 justify-between">
          <Text className="text-ui-fg-subtle" data-testid="product-title">{productPreview.nombre}</Text>
          <div className="flex items-center gap-x-2">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </Link>
  )
}
