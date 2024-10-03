import { LineItem } from "@medusajs/medusa"

import { enrichLineItems, getOrSetCart, retrieveCart } from "@modules/cart/actions"

import CartDropdown from "@modules/layout/components/cart-dropdown";
import { DetallePedido, Pedido } from "types/PaquetePedido"

const fetchCart = async (): Promise<Pedido> => {
  const cart: Pedido = await (await getOrSetCart()).cart;
  console.log(cart)
  if (cart && cart.detalles && cart.detalles.length > 0) {
    const enrichedItems = await enrichLineItems(cart.detalles);
    cart.detalles = enrichedItems as DetallePedido[];
  }

  return cart;
};

export default async function CartButton() {
  const cart = await fetchCart()
  // Make it taller
  return <div className="flex items-center justify-center bg-rojoVillaizan text-white  rounded-lg h-14">
    <CartDropdown cart={cart} />
    </div>
}
