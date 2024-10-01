import { Metadata } from "next"
import { notFound } from "next/navigation"

import {
  getProductByHandle,
  getProductsList,
  getRegion,
  listRegions,
  retrievePricedProductById,
} from "@lib/data"
import { Region } from "@medusajs/medusa"
import ProductTemplate from "@modules/products/templates"
import axios from "axios"
import { Producto } from "types/PaqueteProducto"

type Props = {
  params: { countryCode: string; handle: string ; id: string}
}
const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
export async function generateStaticParams() {
//   const countryCodes = await listRegions().then((regions) =>
//     regions?.map((r) => r.countries.map((c) => c.iso_2)).flat()
//   )

//   if (!countryCodes) {
//     return null
//   }

  const productos = await axios.get(
    `${baseUrl}/producto`
  ).then(({ data }) => data);
  console.log("productos", productos)
  const staticParams = productos.map((producto: Producto) => ({
    params: {
      handle: producto.id,
      nombre: producto.nombre,
    },
  }))

  return staticParams
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = params

  const { product } = await axios.get(
    `${baseUrl}/producto/${handle}`
  ).then(({ data }) => data);


  if (!product) {
    notFound()
  }

  return {
    title: `${product.title} | Medusa Store`,
    description: `${product.title}`,
    // openGraph: {
    //   title: `${product.title} | Medusa Store`,
    //   description: `${product.title}`,
    //   images: product.thumbnail ? [product.thumbnail] : [],
    // },
  }
}

const getPricedProductByHandle = async (handle: string, region: Region) => {
  const producto = await axios.get(
    `${baseUrl}/producto/${handle}`
  ).then(({ data }) => data); 

  if (!producto || !producto.id) {
    return null
  }
  return producto
0}

export default async function ProductPage({ params }: Props) {

  try {
    const producto: Producto = await axios.get(
      `${baseUrl}/producto/${params.id}`
    ).then(({ data }) => data);

    if (!producto) {
      notFound();
    }

    return (
      <ProductTemplate
        product={producto}
        countryCode={params.countryCode}
      />
    );
  } catch (error) {
    console.error('Error fetching product:', error);
    notFound();
  }
}
