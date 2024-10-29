"use server";

import { LineItem } from "@medusajs/medusa";
import { enrichLineItems, getOrSetCart, retrieveCart } from "@modules/cart/actions";
import CartDropdown from "@modules/layout/components/cart-dropdown";
import { DetallePedido, Pedido } from "types/PaquetePedido";
import { useState, useEffect } from "react";

const fetchCart = async (): Promise<Pedido | null> => {
  const result = await getOrSetCart();

  if (!result || !result.cart) {
    return null;
  }

  const cart: Pedido = result.cart;

  if (cart.detalles && cart.detalles.length > 0) {
    const enrichedItems = await enrichLineItems(cart.detalles);
    cart.detalles = enrichedItems as DetallePedido[];
  }

  return cart;
};

export default function CartButton() {
  const [cart, setCart] = useState<Pedido | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      const fetchedCart = await fetchCart();
      setCart(fetchedCart);
    };
    fetchData();
  }, []);

  if (!cart) {
    return <div className="flex items-center justify-center bg-rojoVillaizan text-white rounded-lg h-14">Cart is empty</div>;
  }

  return (
    <div className="flex items-center justify-center bg-rojoVillaizan text-white rounded-lg h-14">
      <CartDropdown cart={cart} setCart={setCart} />
    </div>
  );
}