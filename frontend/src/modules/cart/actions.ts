"use server"

import { revalidateTag } from "next/cache"
import axios from "axios"
import { DetallePedido } from "types/PaquetePedido"
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

export async function deleteCart() {
  const cookieValues = cookies()
  const cartId = cookieValues.get("_medusa_cart_id")?.value

  if (!cartId) {
    console.error("No hay carrito para eliminar.")
    return null
  }

  try {
    // Realizar la solicitud DELETE para eliminar el carrito
    await axios.delete(`${baseUrl}/admin/pedido/${cartId}`)

    console.log(`Carrito con ID ${cartId} eliminado.`)

    // Eliminar la cookie del carrito
    cookies().set("_medusa_cart_id", "", {
      maxAge: -1, // Esto elimina la cookie
      sameSite: "strict",
      secure: process.env.NODE_ENV === "production",
    })

    return {
      success: true,
      message: `Carrito con ID ${cartId} eliminado.`,
    }
  } catch (e) {
    console.error("Error al eliminar el carrito:", e)
    return {
      success: false,
      message: "Error al eliminar el carrito.",
    }
  }
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

export async function retrievePedido(productos: boolean = false) {
  const cookieValues = cookies()
  const cartId = cookieValues.get("_medusa_cart_id")?.value


  if (!cartId) {
    return null
  }

  if (productos) {
    try {
      const response = await axios.get(`${baseUrl}/admin/pedido/${cartId}/conDetalle?pedido=true`)
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
    const response=await addItem({ idPedido: cart.id, idProducto: idProducto, cantidad: cantidad , precio: precio}) //Esto ya está modificado
    // revalidateTag("cart")
    console.log("Item ", idProducto, " added to cart")
    return response
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

export async function addItem({
  idPedido,
  idProducto,
  cantidad,
  precio
}: {
  idPedido: string
  idProducto: string
  cantidad: number
  precio: number
}) {

  try{
    console.log("Adding item to cart")
    const response = await axios.post(`${baseUrl}/admin/detallePedido`, {
      producto:{
        id: idProducto
      },
      cantidad: cantidad,
      pedido: {
        id: idPedido
      },
      subtotal: precio*cantidad
    })
    // console.log(response)
    console.log("Item added to cart")
    return response.data
  } catch (e) {
    console.log(e)
    return null
  }
}

export async function updateItem({
  cartId,
  lineId,
  quantity,
  precio
}: {
  cartId: string
  lineId: string
  quantity: number
  precio: number
}) {
  try{
    const response = axios.put(`${process.env.NEXT_PUBLIC_MEDUSA_API_URL}/admin/detallePedido/${lineId}`, {
      cantidad: quantity,
      subtotal: precio*quantity
    })

    return response
  } catch (e) {
    console.log(e)
    return null
  }
  
}

export async function removeItem({
  cartId,
  lineId,
}: {
  cartId: string
  lineId: string
}) {
  try {
    const response = axios.delete(`${process.env.NEXT_PUBLIC_MEDUSA_API_URL}/admin/detallePedido/${lineId}`)

    return response
  }
  catch (e) {
    console.log(e)
    return null
  }
}