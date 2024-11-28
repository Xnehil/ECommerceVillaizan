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
  try{
    const respuesta = await getOrSetCart();
    if (!respuesta){
      return null
    }
    let cart:Pedido= respuesta?.cart;
    let cookieValue = respuesta?.cookie;
    let aux = cart.detalles;

    const enrichedItems = await enrichLineItems(cart.detalles);
    // console.log("Detalles enriquecidos:", enrichedItems);
    cart.detalles = enrichedItems;
    cart.detalles = cart.detalles.filter((item) => item.estaActivo); // Filtra los items inactivos


    let state ="carrito"
    if (cart.direccion === null){
      state = "direccion"
    }
    return cart
  }
  catch(e){
    console.log("Error al cargar el carrito", e)
    return null
  }
  
}

export default async function MetodoPago() {
  const cart = await fetchCart();
  // console.log("Carrito:", cart);

  return (
    <>
      {/* Error Popup */}
      {!cart && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <p className="text-black-600 mb-4">No se detectó el pedido. Intente nuevamente.</p>
            <button
              style={styles.confirmButton}
              onClick={() => {
                window.location.href = "/";
              }}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      )}

      {/* Main Checkout Component */}
      {cart && <Checkout pedido={cart} /* usuario={usuario} direccion={direccion} */ />}
    </>
  );
}

const styles = {
  confirmButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'black',
    color: 'white',
  },
  cancelButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: 'red',
  },
};