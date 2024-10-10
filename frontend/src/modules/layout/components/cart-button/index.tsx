"use client"

import { enrichLineItems, getOrSetCart, retrieveCart } from "@modules/cart/actions"

import CartDropdown from "@modules/layout/components/cart-dropdown";
import { GetServerSideProps } from "next";
import { DetallePedido, Pedido } from "types/PaquetePedido"
import { useEffect, useState } from "react";
import Spinner from "@modules/common/icons/spinner";

const fetchCart = async (): Promise<{ cart: Pedido; cookieValue?: string }> => {
  const respuesta = await getOrSetCart();
  let cart = respuesta?.cart;
  let cookieValue = respuesta?.cookie;
  let aux = cart.detalles;
  return { cart, cookieValue };
};

interface CartButtonProps {
  carrito: Pedido | null;
  setCarrito: React.Dispatch<React.SetStateAction<Pedido | null>>;
}

const CartButton: React.FC<CartButtonProps> = ({ carrito, setCarrito }) => {
  const [cart, setCart] = useState<Pedido | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    // Fetch the cart data when the component is mounted
    const getCart = async () => {
      // console.log("Fetching cart...");
      const { cart } = await fetchCart();
      const enrichedItems = await enrichLineItems(cart.detalles);
      // console.log("Detalles enriquecidos:", enrichedItems);
      cart.detalles = enrichedItems;
      setCarrito(cart);
    };
    if(carrito == null) getCart();
  }, []);

  useEffect(() => {
    if (carrito && !done) {
      setDone(true);
      console.log("Carrito cargado:", carrito);
    }
  }
  , [carrito]);


  if (!done) {
    return (
      <div className="flex items-center justify-center bg-rojoVillaizan text-white rounded-lg h-14">
        <div className="flex flex-col items-center">
          <Spinner className="animate-spin" />
        </div>
      </div>
    );
  } else {
    return (
      <div className="flex items-center justify-center bg-rojoVillaizan text-white rounded-lg h-14">
        <CartDropdown cart={carrito} setCart={setCarrito} />
      </div>
    );
  }
  
}
export default CartButton;