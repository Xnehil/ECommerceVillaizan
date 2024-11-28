"use client"

import { enrichLineItems, getOrSetCart, retrieveCart } from "@modules/cart/actions"

import CartDropdown from "@modules/layout/components/cart-dropdown";
import { GetServerSideProps } from "next";
import { DetallePedido, Pedido } from "types/PaquetePedido"
import { useEffect, useState } from "react";
import Spinner from "@modules/common/icons/spinner";

const fetchCart = async (): Promise<{ cart: Pedido; cookieValue?: string }> => {
  try{
    const respuesta = await getOrSetCart();
    let cart = respuesta?.cart;
    if(cart.estado !== "carrito"){
      throw new Error("El carrito no está en estado 'carrito'");
    }
    let cookieValue = respuesta?.cookie;
    let aux = cart.detalles;
    return { cart, cookieValue };
  }
  catch(e){
    console.log("Error al cargar el carrito", e);
    throw e;
  }
  
};

interface CartButtonProps {
  carrito: Pedido | null;
  setCarrito: React.Dispatch<React.SetStateAction<Pedido | null>>;
}

const CartButton: React.FC<CartButtonProps> = ({ carrito, setCarrito }) => {
  const [cart, setCart] = useState<Pedido | null>(null);
  const [done, setDone] = useState(false);

  useEffect(() => {
    let isMounted = true;
    const getCart = async () => {
        try {
            const { cart } = await fetchCart();
            if (isMounted) {
                const enrichedItems = await enrichLineItems(cart.detalles);
                cart.detalles = enrichedItems.filter(item => item.estaActivo);
                setCarrito(cart);
            }
        } catch (e) {
            console.error("Error al cargar el carrito:", e);
            if (isMounted) window.location.href = "/";
        }
    };
    if (!carrito) getCart();
    return () => { isMounted = false; };
}, [carrito, setCarrito]);

  useEffect(() => {
    if (carrito && !done) {
      carrito.detalles = carrito.detalles.filter(item => item.estaActivo);
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