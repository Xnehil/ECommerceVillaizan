import { Product } from "@medusajs/medusa"
import { Metadata } from "next"

import { getCollectionsList, getProductsList, getRegion } from "@lib/data"
import FeaturedProducts from "@modules/home/components/featured-products"
import Hero from "@modules/home/components/hero"
import Promotions from "@modules/home/components/promotions";
import { ProductCollectionWithPreviews } from "types/global"
import { cache } from "react"
import CartButton from "@modules/layout/components/cart-button"

export const metadata: Metadata = {
  title: "Helados Villaizan",
  description:
    "Tienda de helados Villaizan, el papá de las paletas. Encuentra los mejores helados y paletas en Villaizan.",
}

const getCollectionsWithProducts = cache(
  async (
    countryCode: string
  ): Promise<ProductCollectionWithPreviews[] | null> => {
    const { collections } = await getCollectionsList(0, 3)

    if (!collections) {
      return null
    }

    const collectionIds = collections.map((collection) => collection.id)

    await Promise.all(
      collectionIds.map((id) =>
        getProductsList({
          queryParams: { collection_id: [id] },
          countryCode,
        })
      )
    ).then((responses) =>
      responses.forEach(({ response, queryParams }) => {
        let collection

        if (collections) {
          collection = collections.find(
            (collection) => collection.id === queryParams?.collection_id?.[0]
          )
        }

        if (!collection) {
          return
        }

        collection.products = response.products as unknown as Product[]
      })
    )

    return collections as unknown as ProductCollectionWithPreviews[]
  }
)

export default async function Home({
}) {

  return (
    <div>

      {/* Imagen debajo del Hero */}
      <div className="relative w-full">
        <img
          src="/images/helados-promo.png"
          alt="Promoción Helados Villaizan"
          className="w-full object-cover"
        />
      </div>

      {/* Componente de Promociones */}
      <Promotions />

      <div className="py-12">
        <ul className="flex flex-col gap-x-6">
          {/* <FeaturedProducts collections={collections} region={region} /> */}
        </ul>
      </div>
    </div>
  );
}
