import { Metadata } from "next"
import 'styles/globals.css'

import { enrichLineItems, getOrSetCart } from "@modules/cart/actions"
import MetodoPagoClient from "./MetodoPagoClient"
import { DetallePedido, Pedido } from "types/PaquetePedido"
import { Usuario } from "types/PaqueteUsuario"
import { Direccion } from "types/PaqueteEnvio"
import Checkout from "./Checkout"
import { notFound } from "next/navigation"
import Toaster from "@components/Toaster"
import ErrorPopup from "../../../components/ErrorPopup"

export const metadata: Metadata = {
  title: "Metodo de Pago",
  description: "Revisa tu metodo de pago",
}

const fetchCart = async () => {
  const respuesta = await getOrSetCart();
  /*
  if (!respuesta) {
    return null
  }*/

  //const cart: Pedido = respuesta.cart;
  const cart: Pedido = respuesta?.cart;
  let cookieValue = respuesta?.cookie;

  /*
  if (cart.estado !== "carrito") {
    return null; // Retorna null si el carrito no está en estado "carrito"
  }*/

  if(cart?.detalles){
    const enrichedItems = await enrichLineItems(cart.detalles);
    cart.detalles = enrichedItems.filter(item => item.estaActivo); // Filtra los items inactivos
  }

  let state ="carrito"
  if (cart.direccion === null){
    state = "direccion"
  }

  return cart;
}

export default async function MetodoPago() {
  const cart = await fetchCart();
  /*
  if (!cart) {
    notFound(); // Trigger a 404 page if the cart isn't found
    return null;
  }*/
  return <Checkout pedido={cart} />;
}
