"use server"

import { LineItem } from "@medusajs/medusa"
import { omit } from "lodash"
import { revalidateTag } from "next/cache"
import { cookies } from "next/headers"

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

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL
/**
 * Retrieves the cart based on the cartId cookie
 *
 * @returns {Promise<Cart>} The cart
 * @example
 * const cart = await getOrSetCart()
 */
export async function getOrSetCart() {
  const cartId = cookies().get("_medusa_cart_id")?.value
  let cart

  if (cartId) {
    cart = await axios.get(`${baseUrl}/admin/pedido/${cartId}`).then((res) => res.data)
  }

  // const region = await getRegion(countryCode)

  // if (!region) {
  //   return null
  // }

  // const region_id = region.id

  if (!cart) {
    cart = await axios.post(`${baseUrl}/admin/pedido`, {
      "estado": "carrito",
    }).then((res) => res.data)
    cart &&
      cookies().set("_medusa_cart_id", cart.id, {
        maxAge: 60 * 60 * 24 * 7,
        httpOnly: true,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      })
    revalidateTag("cart")
  }

  // Esto es para temas de cambio de region. De momento no se usa
  // if (cart && cart?.region_id !== region_id) {
  //   await updateCart(cart.id, { region_id })
  //   revalidateTag("cart")
  // }

  return cart
}

export async function retrieveCart() {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) {
    return null
  }

  try {
    const cart = await axios.get(`${baseUrl}/admin/pedido/${cartId}`).then((res) => res.data)
    return cart
  } catch (e) {
    console.log(e)
    return null
  }
}

export async function addToCart({
  idProducto,
  cantidad,
}: {
  idProducto: string
  cantidad: number
}) {
  const cart = await getOrSetCart()

  if (!cart) {
    return "Missing cart ID"
  }

  if (!idProducto) {
    return "Missing product variant ID"
  }

  try {
    // await addItem({ cartId: cart.id, idProducto, cantidad }) modificar esto
    revalidateTag("cart")
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
  const cartId = cookies().get("_medusa_cart_id")?.value

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
  const cartId = cookies().get("_medusa_cart_id")?.value

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
  lineItems: LineItem[],
  regionId: string
): Promise<
  | Omit<LineItem, "beforeInsert" | "beforeUpdate" | "afterUpdateOrLoad">[]
  | undefined
> {
  // Prepare query parameters
  const queryParams = {
    ids: lineItems.map((lineItem) => lineItem.variant.product_id),
    regionId: regionId,
  }

  // Fetch products by their IDs
  const products = await getProductsById(queryParams)

  // If there are no line items or products, return an empty array
  if (!lineItems?.length || !products) {
    return []
  }

  // Enrich line items with product and variant information

  const enrichedItems = lineItems.map((item) => {
    const product = products.find((p) => p.id === item.variant.product_id)
    const variant = product?.variants.find((v) => v.id === item.variant_id)

    // If product or variant is not found, return the original item
    if (!product || !variant) {
      return item
    }

    // If product and variant are found, enrich the item
    return {
      ...item,
      variant: {
        ...variant,
        product: omit(product, "variants"),
      },
    }
  }) as LineItem[]

  return enrichedItems
}
