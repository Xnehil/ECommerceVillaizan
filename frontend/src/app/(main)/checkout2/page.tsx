import { LineItem } from "@medusajs/medusa"
import { Metadata } from "next"
import { cookies } from "next/headers"

import CartTemplate from "@modules/cart/templates"
import 'styles/globals.css'

import { enrichLineItems } from "@modules/cart/actions"
import { getCheckoutStep } from "@lib/util/get-checkout-step"
import { CartWithCheckoutStep } from "types/global"
import { getCart, getCustomer } from "@lib/data"
import CustomRectangle from "components/CustomRectangle"
import MetodoPagoClient from "./MetodoPagoClient"
import { DetallePedido, Pedido } from "types/PaquetePedido"
import { Usuario } from "types/PaqueteUsuario"
import { Direccion } from "types/PaqueteEnvio"

export const metadata: Metadata = {
  title: "Cart",
  description: "View your cart",
}

const fetchCart = async () => {
  const cartId = cookies().get("_medusa_cart_id")?.value

  if (!cartId) {
    return null
  }

  const cart = await getCart(cartId).then(
    (cart) => cart as CartWithCheckoutStep
  )

  if (!cart) {
    return null
  }

  /*if (cart?.items.length) {
    const enrichedItems = await enrichLineItems(cart?.items, cart?.region_id)
    cart.items = enrichedItems as LineItem[]
  }*/

  cart.checkout_step = cart && getCheckoutStep(cart)

  return cart
}

export default async function Cart() {
  const cart = await fetchCart()
  const customer = await getCustomer()
  const detallesPedido: DetallePedido[] = [
    {
      cantidad: 20,
      subtotal: 100,
      producto: {
        id: "1",
        nombre: "Paleta de Fresa",
        precioC: 2.5,
        codigo: "SKU-1",
        descripcion: "Descripción del producto 1",
        tipoProducto: undefined,
        subcategorias: [],
        frutas: [],
        inventarios: [],
        precioA: 0,
        precioB: 0,
        precioEcommerce: 0,
        urlImagen: "",
        cantMinPed: 0,
        cantMaxPed: 0,
        seVendeEcommerce: false,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
        desactivadoEn: null,
        usuarioCreacion: "",
        usuarioActualizacion: "",
        estaActivo: false
      },
      pedido: undefined,
      id: "",
      creadoEn: undefined,
      actualizadoEn: undefined,
      desactivadoEn: null,
      usuarioCreacion: "",
      usuarioActualizacion: "",
      estaActivo: false
    },
    {
      cantidad: 10,
      subtotal: 100,
      producto: {
        id: "1",
        nombre: "Paleta de Banana",
        precioC: 2.5,
        codigo: "SKU-2",
        descripcion: "Descripción del producto 2",
        tipoProducto: undefined,
        subcategorias: [],
        frutas: [],
        inventarios: [],
        precioA: 0,
        precioB: 0,
        precioEcommerce: 0,
        urlImagen: "",
        cantMinPed: 0,
        cantMaxPed: 0,
        seVendeEcommerce: false,
        creadoEn: new Date(),
        actualizadoEn: new Date(),
        desactivadoEn: null,
        usuarioCreacion: "",
        usuarioActualizacion: "",
        estaActivo: false
      },
      pedido: undefined,
      id: "",
      creadoEn: undefined,
      actualizadoEn: undefined,
      desactivadoEn: null,
      usuarioCreacion: "",
      usuarioActualizacion: "",
      estaActivo: false
    },
  ];
  const pedido : Pedido = {
    estado: "En proceso",
    total: 100,
    puntosOtorgados: 10,
    metodosPago: [],
    detalles: detallesPedido,
    id: "",
    desactivadoEn: null,
    usuarioCreacion: "",
    usuarioActualizacion: "",
    estaActivo: false
  }

  const usuario : Usuario = {
    nombre: "Juan",
    apellido: "Perez",
    conCuenta: true,
    correo: "",
    contrasena: "",
    persona: undefined,
    id: "",
    desactivadoEn: null,
    usuarioCreacion: "",
    usuarioActualizacion: "",
    estaActivo: false
  }

  const direccion: Direccion = {
    id: "",
    calle: "Av. Siempre Viva",
    numeroExterior: "742",
    distrito: "Springfield",
    codigoPostal: "12345",
    ciudad: undefined,
    ubicacion: undefined,
    envios: [],
    desactivadoEn: null,
    usuarioCreacion: "",
    usuarioActualizacion: "",
    estaActivo: false
  };



  return <MetodoPagoClient pedido={pedido} usuario={usuario} direccion={direccion}/>
}