"use server"

import { revalidateTag } from "next/cache"
import axios from "axios"
import { DetallePedido } from "types/PaquetePedido"
import { cookies } from "next/headers"
import { Promocion } from "types/PaquetePromocion"

interface RequestBody {
  producto: {
    id: string;
  };
  cantidad: number;
  pedido: {
    id: string;
  };
  subtotal: number;
  precio: number;
  promocion?: {
    id: string;
  };
}

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
      const response = await axios.get(`${baseUrl}/admin/pedido/${cartId}`)
      cart = response.data.pedido
      revalidateTag("cart")
      //console.log("Cart sacado de la cookie: ", cart)
    } catch (e) {
      cart = null
    }
  }
  try{
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
  } catch (e) {
    console.error('Error getting or setting cart:', e)
    return null
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

export async function retrievePedido(productos: boolean = false, codigoSeguimiento: string | null = null, isAuthenticated: boolean = false, userId : string | null = null) {
  const cookieValues = cookies()
  let cartId = cookieValues.get("_medusa_pedido_id")?.value
  // console.log("En retrievePedido")
  
  if (!cartId && !codigoSeguimiento) {
    console.log("No hay ID de pedido ni código de seguimiento")
    return null
  }

  if (codigoSeguimiento) {
    try {
      // console.log("Haciendno post a" , `${baseUrl}/admin/pedido/codigoSeguimiento`, " con body ", {codigoSeguimiento: codigoSeguimiento})
      const response = await axios.post(`${baseUrl}/admin/pedido/codigoSeguimiento`,
        {
          codigoSeguimiento: codigoSeguimiento
        })
      const pedido = response.data.pedido
      if(isAuthenticated && userId){
        if(pedido.usuario.id != userId){
          return null
        }
      }
      cartId = response.data.pedido.id
      // console.log("Pedido encontrado con id ", cartId)
    } catch (e) {
      console.log(e)
      return null
    }
  }
  console.log("Pedido ID: ", cartId)
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
    const response=await addItem({ idPedido: cart.id, idProducto: idProducto, cantidad: cantidad , precio: precio})
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
    

    await axios.put(`${baseUrl}/admin/detallePedido/${detallePedidoId}`, {
      cantidad: cantidad,
      subtotal: subtotal,
      estaActivo: cantidad > 0
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
  let products;
  try{
    const response = queryParams.ids.map((id) => axios.get(`${baseUrl}/admin/detallePedido/${id}`))
    products = await Promise.all(response)
  } catch (e) {
    console.log(e)
    return []
  }

  const productData = products.map((product) => product.data);

  // console.log("Products Data:", productData)

  // If there are no line items or products, return an empty array
  if (!productData?.length || !productData) {
    return []
  }

  return productData.map((product) => {
    product.detallePedido.producto.precioEcommerce = Number(product.detallePedido.producto.precioEcommerce)
    product.detallePedido.cantidad = Number(product.detallePedido.cantidad)
    product.detallePedido.precio = Number(product.detallePedido.precio)
    return product.detallePedido
  }) as DetallePedido[]
}

export async function addItem({
  idPedido,
  idProducto,
  cantidad,
  precio,
  promocion
}: {
  idPedido: string
  idProducto: string
  cantidad: number
  precio: number
  promocion?: Promocion | null
}) {
  try {
    console.log("Adding item to cart");

    const requestBody: RequestBody = {
      producto: {
        id: idProducto
      },
      cantidad: cantidad,
      pedido: {
        id: idPedido
      },
      subtotal: precio * cantidad,
      precio: precio
    };

    // Only add idPromocion if it's a non-empty string
    if (promocion && promocion?.id && promocion?.id.trim() !== "") {
      requestBody.promocion = promocion;
    }

    const response = await axios.post(`${baseUrl}/admin/detallePedido`, requestBody);
    return response.data;
  } catch (e) {
    console.error("Error adding item:", e);
    return null;
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
    //console.log("Item updated", response)
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