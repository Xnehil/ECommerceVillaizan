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
export async function getOrSetCart(only_get=false) {
  const cookieValues = cookies()
  const cartId = cookieValues.get("_medusa_cart_id")?.value
  // console.log("Cart ID sacado de la cookie: ", cartId)
  let cart;
  let cookieValue ="alreadysaved"

  if (only_get && !cartId) {
    return null
  }

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
  detallePedidoId,
  cantidad,
  subtotal,
}: {
  detallePedidoId: string
  cantidad: number
  subtotal: number
}) {
  const cookieValues = cookies()
  const cartId = cookieValues.get("_medusa_cart_id")?.value
  

  if (!cartId) {
    return "Missing cart ID"
  }

  if (!detallePedidoId) {
    return "Missing lineItem ID"
  }

  if (!cartId) {
    return "Missing cart ID"
  }

  try {
    const response = await axios.put(`${baseUrl}/admin/detallePedido/${detallePedidoId}`, {
      cantidad: cantidad,
      subtotal: subtotal
    })
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
): Promise<DetallePedido[]
> {
  if (!detalles?.length) {
    return []
  }
  const queryParams = {
    ids: detalles.map((lineItem) => lineItem.id),
  }

  // Fetch products by their IDs
  const response = queryParams.ids.map((id) => axios.get(`${baseUrl}/admin/detallePedido/${id}`))
  const products = await Promise.all(response)

  const productData = products.map((product) => product.data);

  // console.log("Products Data:", productData)

  // If there are no line items or products, return an empty array
  if (!productData?.length || !productData) {
    return []
  }

  return productData.map((product) => {
    product.detallePedido.producto.precioEcommerce = Number(product.detallePedido.producto.precioEcommerce)
    product.detallePedido.cantidad = Number(product.detallePedido.cantidad)
    return product.detallePedido
  }) as DetallePedido[]
}
