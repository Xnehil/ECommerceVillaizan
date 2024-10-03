"use server"

import { revalidateTag } from "next/cache"

import {
  addItem,
  createCart,
  getCart,
  getProductsById,
  getRegion,
  removeItem,
  updateCart,
  updateItem,
} from "@lib/data"
import axios from "axios"
import { DetallePedido } from "types/PaquetePedido"
import cookie from "cookie"
import { cookies } from "next/headers"

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
/**
 * Retrieves the cart based on the cartId cookie
 *
 * @returns {Promise<Cart>} The cart
 * @example
 * const cart = await getOrSetCart()
 */
export async function getOrSetCart() {
  const cookieValues = cookies()
  const cartId = cookieValues.get("_medusa_cart_id")?.value
  console.log("Cart ID sacado de la cookie: ", cartId)
  let cart;
  let cookieValue ="alreadysaved"

  if (cartId) {
    try {
      const response = await axios.get(`${baseUrl}/admin/pedido/${cartId}/conDetalle`)
      cart = response.data.pedido
      // console.log("Cart sacado de la cookie: ", cart)
    } catch (e) {
      cart = null
    }
  }

  if (!cart) {
    const response = await axios.post(`${baseUrl}/admin/pedido`, {
      "estado": "carrito",
    })
    cart = response.data.pedido
    if (cart) {
      console.log('Setting cookie with cart ID:', cart.id, " and cookie")
      cookies().set("_medusa_cart_id", cart.id, {
        maxAge: 60 * 60 * 24 * 7, // 1 week
        sameSite: 'strict',
        secure: process.env.NODE_ENV === 'production',
      })
        return {
          cart,
          cookie: cart.id,
      };


    } else {
      console.error('Cart is null or undefined'); // Log error if cart is null or undefined
    }
  }
  return {
    cart,
    cookie: cookieValue,
  }
  revalidateTag("cart")
}

export async function retrieveCart(productos: boolean = false) {
  const cookieValues = cookies()
  const cartId = cookieValues.get("_medusa_cart_id")?.value


  if (!cartId) {
    return null
  }

  if (productos) {
    try {
      const response = await axios.get(`${baseUrl}/admin/pedido/${cartId}/conDetalle`)
      return response.data.pedido
    } catch (e) {
      console.log(e)
      return null
    }
  } else{
      try {
        const response = await axios.get(`${baseUrl}/admin/pedido/${cartId}`)
        return response.data.pedido
      } catch (e) {
        console.log(e)
        return null
      }
  }
}

export async function addToCart({
  idProducto,
  cantidad,
  precio,
}: {
  idProducto: string
  cantidad: number
  precio: number
}) {
  const cart = (await getOrSetCart())?.cart

  if (!cart) {
    return "Missing cart ID"
  }

  if (!idProducto) {
    return "Missing product variant ID"
  }

  try {
    await addItem({ idPedido: cart.id, idProducto: idProducto, cantidad: cantidad , precio: precio}) //Esto ya está modificado
    revalidateTag("cart")
    console.log("Item ", idProducto, " added to cart")
  } catch (e) {
    return "Error adding item to cart"
  }
}

export async function updateLineItem({
  lineId,
  quantity,
}: {
  lineId: string
  quantity: number
}) {
  const cookieValues = cookies()
  const cartId = cookieValues.get("_medusa_cart_id")?.value
  

  if (!cartId) {
    return "Missing cart ID"
  }

  if (!lineId) {
    return "Missing lineItem ID"
  }

  if (!cartId) {
    return "Missing cart ID"
  }

  try {
    // await updateItem({ cartId, lineId, quantity }) modificar esto
    revalidateTag("cart")
  } catch (e: any) {
    return e.toString()
  }
}

export async function deleteLineItem(lineId: string) {
  const cookieValues = cookies()
  const cartId = cookieValues.get("_medusa_cart_id")?.value
  
  if (!cartId) {
    return "Missing cart ID"
  }

  if (!lineId) {
    return "Missing lineItem ID"
  }

  if (!cartId) {
    return "Missing cart ID"
  }

  try {
    await removeItem({ cartId, lineId })
    revalidateTag("cart")
  } catch (e) {
    return "Error deleting line item"
  }
}

export async function enrichLineItems(
  detalles: DetallePedido[],
): Promise<
  | Omit<DetallePedido, "beforeInsert" | "beforeUpdate" | "afterUpdateOrLoad">[]
  | undefined
> {
  // Prepare query parameters
  const queryParams = {
    ids: detalles.map((lineItem) => lineItem.id),
  }

  // Fetch products by their IDs
  const response = queryParams.ids.map((id) => axios.get(`${baseUrl}/admin/detallePedido/${id}`))
  const products = await Promise.all(response)

  // If there are no line items or products, return an empty array
  if (!products?.length || !products) {
    return []
  }

  // Enrich line items with product and variant information

  // const enrichedItems = lineItems.map((item) => {
  //   const product = products.find((p) => p.id === item.variant.product_id)
  //   const variant = product?.variants.find((v) => v.id === item.variant_id)

  //   // If product or variant is not found, return the original item
  //   if (!product || !variant) {
  //     return item
  //   }

  //   // If product and variant are found, enrich the item
  //   return {
  //     ...item,
  //     variant: {
  //       ...variant,
  //       product: omit(product, "variants"),
  //     },
  //   }
  // }) as LineItem[]

  return []
}
