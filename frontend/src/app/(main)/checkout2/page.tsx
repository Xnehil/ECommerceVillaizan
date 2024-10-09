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

export const metadata: Metadata = {
  title: "Metodo de Pago",
  description: "Revisa tu metodo de pago",
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

export default async function MetodoPago() {
  const cart = await fetchCart()
  

  return <Checkout pedido={cart}/* usuario={usuario} direccion={direccion}*/ />
  
}