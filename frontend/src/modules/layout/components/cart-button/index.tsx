"use client"

import { enrichLineItems, getOrSetCart, retrieveCart } from "@modules/cart/actions"

import CartDropdown from "@modules/layout/components/cart-dropdown";
import { GetServerSideProps } from "next";
import { DetallePedido, Pedido } from "types/PaquetePedido"
import cookie from 'cookie';
import { useEffect, useState } from "react";

const fetchCart = async (): Promise<{ cart: Pedido; cookieValue?: string }> => {
  const respuesta = await getOrSetCart();
  let cart = respuesta?.cart;
  let cookieValue = respuesta?.cookie;
  let aux = cart.detalles;
  if (cart && cart.detalles && cart.detalles.length > 0) {
    const enrichedItems = await enrichLineItems(cart.detalles);
    // cart = { ...cart, detalles: enrichedItems as DetallePedido[] };
  }

  return { cart, cookieValue };
};

export default function CartButton() {
  const [cart, setCart] = useState<Pedido | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Fetch the cart data when the component is mounted
    const getCart = async () => {
      const { cart } = await fetchCart();
      setCart(cart);
    };
    if(cart === null) getCart();
  }, []);

  useEffect(() => {
    if (cart) {
      setDone(true);
      console.log("Carrito cargado:", cart);
    }

  }
  , [cart]);


  // If the cart is still loading, show a loading state
  if (!done) {
    return (
      <div className="flex items-center justify-center bg-rojoVillaizan text-white rounded-lg h-14">
        <div className="flex flex-col items-center">
          <svg
            className="animate-spin h-5 w-5 text-white mb-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center bg-rojoVillaizan text-white rounded-lg h-14">
      <CartDropdown cart={cart} />
    </div>
  );
}
