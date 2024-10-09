import { LineItem } from "@medusajs/medusa"
import { Metadata } from "next"
import { cookies } from "next/headers"

import CartTemplate from "@modules/cart/templates"

import { enrichLineItems, getOrSetCart } from "@modules/cart/actions"
import { getCheckoutStep } from "@lib/util/get-checkout-step"
import { CartWithCheckoutStep } from "types/global"
import { getCart, getCustomer } from "@lib/data"
import { Pedido } from "types/PaquetePedido"

export const metadata: Metadata = {
  title: "Carrito",
  description: "Revisa los productos que has añadido a tu carrito.",
}


const fetchCart = async () => {
  const respuesta = await getOrSetCart();
  let cart:Pedido= respuesta?.cart;
  let cookieValue = respuesta?.cookie;
  let aux = cart.detalles;

  const enrichedItems = await enrichLineItems(cart.detalles);
  // console.log("Detalles enriquecidos:", enrichedItems);
  cart.detalles = enrichedItems;


  let state ="carrito"
  if (cart.direccion === null){
    state = "direccion"
  }
  return cart
}

export default async function Cart() {
  const cart = await fetchCart()
  // const customer = await getCustomer()

  return <CartTemplate cart={cart}/>
}