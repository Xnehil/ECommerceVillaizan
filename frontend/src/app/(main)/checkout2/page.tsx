import { Metadata } from "next"
import 'styles/globals.css'

import { enrichLineItems, getOrSetCart } from "@modules/cart/actions"
import MetodoPagoClient from "./MetodoPagoClient"
import { DetallePedido, Pedido } from "types/PaquetePedido"
import { Usuario } from "types/PaqueteUsuario"
import { Direccion } from "types/PaqueteEnvio"
import Checkout from "./Checkout"
import { notFound } from "next/navigation"

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
  // const customer = await getCustomer() Para cuando se implemente el login
  /*
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
  */


  return <Checkout pedido={cart}/* usuario={usuario} direccion={direccion}*/ />
}