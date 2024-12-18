import { Metadata } from "next";
import { cookies } from "next/headers";

import CartTemplate from "@modules/cart/templates";
import { enrichLineItems, getOrSetCart } from "@modules/cart/actions";
import { getCheckoutStep } from "@lib/util/get-checkout-step";
import { CartWithCheckoutStep } from "types/global";
import { getCart, getCustomer } from "@lib/data";
import { Pedido } from "types/PaquetePedido";

export const metadata: Metadata = {
  title: "Carrito",
  description: "Revisa los productos que has añadido a tu carrito.",
};

const fetchCart = async () => {
  const respuesta = await getOrSetCart();
  if (!respuesta) {
    return null
  }
  const cart: Pedido = respuesta.cart;

  /*
  if (cart.estado !== "carrito") {
    return null; // Retorna null si el carrito no está en estado "carrito"
  }*/

  if(cart.detalles){
    const enrichedItems = await enrichLineItems(cart.detalles);
    cart.detalles = enrichedItems.filter(item => item.estaActivo); // Filtra los items inactivos
  }

  return cart;
};


export default async function Cart() {
  const cart = await fetchCart();

  // Si el carrito es null o no tiene productos, muestra el mensaje de que no hay productos.
  if (!cart) {
    return (
      <div className="content-container mx-auto py-8 text-center">
        <h1 className="text-2xl font-bold mb-4">No has agregado productos aún :(</h1>
        <p className="text-gray-600">
          Navega por nuestra tienda y encuentra los productos que te gusten.
        </p>
      </div>
    );
  }

  // Si el carrito tiene productos, renderiza el `CartTemplate`
  return <CartTemplate cart={cart} />;
}
