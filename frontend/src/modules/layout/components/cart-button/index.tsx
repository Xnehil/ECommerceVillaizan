import { LineItem } from "@medusajs/medusa"

import { enrichLineItems, retrieveCart } from "@modules/cart/actions"

import CartDropdown from "../cart-dropdown"

const fetchCart = async () => {
  const cart = await retrieveCart()

  if (cart?.items.length) {
    const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id)
    cart.items = enrichedItems as LineItem[]
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
