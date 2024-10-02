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
  try {
    const response = await axios.get(`${baseUrl}/admin/producto`);
    const productos = response.data.productos;

    if (!productos || !Array.isArray(productos)) {
      return [];
    }
    // console.log("productos", productos)
    const staticParams = productos.map((producto: Producto) => ({
      handle: producto.id,
      // nombre: producto.nombre,
    }));

    // console.log("staticParams", staticParams)
    return staticParams;
  } catch (error) {
    if (error instanceof Error) {
      console.error('Error fetching productos in generateStaticParams:', error.message);
    } else {
      console.error('Unknown error fetching productos');
    }
    return [];
  }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  // console.log("params", params)
  const { handle } = params
  // console.log("handle", handle)
  const response = await axios.get(
    `${baseUrl}/admin/producto/${handle}`
  );
  const producto :Producto= response.data.producto;
  // console.log("producto", producto)

  if (!producto) {
    console.log("not found during metadata")
    notFound()
  }

  return {
    title: `${producto.nombre} | Medusa Store`,
    description: `${producto.descripcion} | Paletas Villaizan`,
    // openGraph: {
    //   title: `${product.title} | Medusa Store`,
    //   description: `${product.title}`,
    //   images: product.thumbnail ? [product.thumbnail] : [],
    // },
  }
}

// const getPricedProductByHandle = async (handle: string, region: Region) => {
//   const producto = await axios.get(
//     `${baseUrl}/producto/${handle}`
//   ).then(({ data }) => data); 

//   if (!producto || !producto.id) {
//     return null
//   }
//   return producto
// 0}

export default async function ProductPage({ params }: Props) {

  try {
    // console.log("params", params)
    const response = await axios.get(
      `${baseUrl}/admin/producto/${params.handle}`
    );
    const producto :Producto= response.data.producto
    // console.log("producto", producto)
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
    if (error instanceof Error) {
      console.error('Error fetching product in ProductPage:', error.message);
    } else {
      console.error('Unknown error fetching product');
    }
  }
}
