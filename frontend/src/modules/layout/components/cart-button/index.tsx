import { LineItem } from "@medusajs/medusa"

import { enrichLineItems, retrieveCart } from "@modules/cart/actions"

import CartDropdown from "../cart-dropdown"
import { DetallePedido, Pedido } from "types/PaquetePedido"

const fetchCart = async () => {
  const cart :Pedido= await retrieveCart(true)

  if (cart?.detalles.length) {
    const enrichedItems = await enrichLineItems(cart?.detalles)
    cart.detalles = enrichedItems as DetallePedido[]
    // console.log(cart)
  }

  return cart
}

export default async function CartButton() {
  const cart = await fetchCart()
  // Make it taller
  return <div className="flex items-center justify-center bg-rojoVillaizan text-white  rounded-lg h-14">
    <CartDropdown cart={cart} />
    </div>
}
