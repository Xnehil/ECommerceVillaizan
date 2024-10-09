import React, { useState, useEffect } from 'react';

import EntregaPopup from './EntregaPopup'; // Asegúrate de importar el componente EntregaPopup
import BuscandoPopup from './BuscandoPopup';
import Link from "next/link"
import { DetallePedido, MetodoPago, Pedido } from 'types/PaquetePedido';
import { Direccion } from 'types/PaqueteEnvio';
import { Usuario } from 'types/PaqueteUsuario';
import axios, { AxiosError } from "axios"

interface ResumenCompraProps {
  descuento: number;
  costoEnvio: number;
  noCostoEnvio: boolean;
  hayDescuento: boolean;
  paymentAmount: number | null;
  selectedImageId: string | null;
  total: number;  
  vuelto: number;
  direccion: Direccion;
  usuario: Usuario;
  pedido: Pedido;
}

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

if (!baseUrl) {
  console.error("NEXT_PUBLIC_MEDUSA_BACKEND_URL is not defined");
}

const ResumenCompra: React.FC<ResumenCompraProps> = ({
  descuento,
  costoEnvio,
  noCostoEnvio,
  hayDescuento,
  paymentAmount,
  selectedImageId,
  total,
  vuelto,
  direccion,
  usuario,
  pedido
}) => {
  const [seleccionado, setSeleccionado] = useState(false); // Estado para manejar si está seleccionado
  const [showPopup, setShowPopup] = useState(false); // Estado para mostrar el popup de entrega
  const [showBuscandoPopup, setShowBuscandoPopup] = useState(false);
  const isButtonDisabled = !selectedImageId || !seleccionado; // Deshabilitar el botón si no hay una imagen seleccionada
  const detalles: DetallePedido[] = pedido ? pedido.detalles : [];
  const [showError, setShowError] = useState(false);



  const toggleSeleccion = () => {
    setSeleccionado(!seleccionado); // Cambia el estado entre true y false
  };

  const buscarPedido = async (id: string) => {
    const response = await axios.get(`${baseUrl}/admin/pedido/${id}`);
    const pedido = response.data.pedido;
    if(pedido){
      console.log("Pedido encontrado");
      console.log(pedido);
      return pedido;
    }
    console.log("Pedido no encontrado");
    return null
  }

  const crearPedido = async () => {
    const response = await axios.post(`${baseUrl}/admin/pedido`, pedido);
    const pedidoRespuesta = response.data.pedido;
    console.log("Pedido creado correctamente");
    console.log(pedidoRespuesta);
    return pedidoRespuesta;
  }

  //log the pedido id
  //console.log("Pedido id:", pedido.id)

  const handleConfirmar = async () => {
    setShowPopup(false);
    setShowBuscandoPopup(true);
    //Guarda el metodo de pago
    if(selectedImageId === "pagoEfec"){
      const responseMetodoPago = await axios.post(`${baseUrl}/admin/metodoPago/nombre`, {
        nombre: "Pago en Efectivo"
      });
      if(responseMetodoPago.data){
        console.log("Metodo de pago encontrado");
        console.log(responseMetodoPago.data);
        // Initialize metodosPago if undefined
        if (!pedido.metodosPago) {
          pedido.metodosPago = [];
        }
        //Guarda el metodo de pago en el pedido
        pedido.metodosPago.push(responseMetodoPago.data.metodoPago);
      }
    }
    //Cambiar el estado del pedido a solicitado
    pedido.estado = "solicitado";
    //Guarda el montoEfectivoPagar en el pedido
    pedido.montoEfectivoPagar = paymentAmount ?? 0;
    try{
      const response = await axios.put(`${baseUrl}/admin/pedido/${pedido.id}?asignarRepartidor=true`, pedido); // Harvy agregó esto, un parámetro extra que el back leería para saber que se debe asignar un repartidor
      if(response.data){
        //setShowBuscandoPopup(false);
        console.log("Pedido modificado correctamente");
        console.log(response.data);
      }
      // setShowBuscandoPopup(false);
      //Redirigir a la página de seguimiento
      let codigoSeguimiento = "123456";
      window.location.href = `/seguimiento?codigo=${pedido.codigoSeguimiento??codigoSeguimiento}`;
    } catch (error) {
      const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 404) {
            console.log("Pedido no encontrado");
        } else if (axiosError.response?.status === 503) {
            console.log("No hay motorizados disponibles");
            setShowPopup(false);
            setShowBuscandoPopup(true);
            setShowError(true);
        }
    }
    
  };

  const handleCloseBuscandoPopup = () => {
    setShowBuscandoPopup(false);
  };

  const handleRedirect = () => {
    //history.push('/terminos/page');
    return (
      <Link href="/terminos">
      </Link>
    );
  };

  return (
    <div style={{ padding: '20px', borderRadius: '8px', width: '500px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '10px' }}>
        <span>Producto</span>
        <span>Subtotal</span>
      </div>
      {detalles.map((detalle, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ color: 'grey' }}>
            {detalle.producto.nombre} <strong style={{ color: 'black' }}>x</strong> {detalle.cantidad}
          </span>
          <span>S/. {(detalle.producto.precioEcommerce * detalle.cantidad).toFixed(2)}</span>
        </div>
      ))}

      {/* Mostrar descuento y costo de envío */}
      {hayDescuento && (
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '10px' }}>
          <span>Descuento</span>
          <span>- S/. {descuento.toFixed(2)}</span>
        </div>
      )}
      <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
        <span>Costo de envío</span>
        <span style={{ color: noCostoEnvio ? 'grey' : 'black' }}>
          {noCostoEnvio ? <s>S/. {costoEnvio.toFixed(2)}</s> : `S/. ${costoEnvio.toFixed(2)}`}
        </span>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginTop: '5px' }}>
        <span style={{ color: 'black' }}>Total</span>
        <span style={{ color: '#B88E2F' }}>S/. {total.toFixed(2)}</span>
      </div>
      <hr style={{ margin: '10px 0' }} />
      {/* Mostrar paymentAmount si está presente */}
      {paymentAmount && (
        <>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
            <span>Monto a pagar</span>
            <span>S/. {paymentAmount.toFixed(2)}</span>
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '5px' }}>
            <span>Vuelto</span>
            <span>S/. {vuelto.toFixed(2)}</span>
          </div>
          <hr style={{ margin: '10px 0' }} />
        </>
      )}

      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }} >
        <div
          style={{
            width: '20px',
            height: '20px',
            border: '2px solid black',
            borderRadius: '50%',
            marginRight: '10px',
            backgroundColor: seleccionado ? 'black' : 'transparent',
            cursor: 'pointer',
          }}
          onClick={toggleSeleccion}
        />
        <span>He leído y acepto los&nbsp;</span>
        <Link href="/terminos" passHref>
          <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>términos y condiciones</span>
        </Link>
      </div>
      <div style ={{marginTop: "20px",marginBottom: "20px"}}>
        <span>Tu data personal será usada para mejorar tu experiencia en esta página, para otros propósitos revisar la </span>
        <Link href="/terminos" passHref>
          <span style={{ cursor: 'pointer', textDecoration: 'underline' }}>Política de Privacidad</span>
        </Link>
      </div>

      <button
        style={{
          width: '100%',
          padding: '10px',
          border: isButtonDisabled ? '2px lightgrey' : '2px solid black',
          borderRadius: '5px',
          backgroundColor: isButtonDisabled ? 'lightgrey' : 'transparent', // Cambia el color de fondo si está deshabilitado
          color: isButtonDisabled ? 'darkgrey' : 'black', // Cambia el color del texto si está deshabilitado
          fontWeight: 'bold',
          cursor: isButtonDisabled ? 'not-allowed' : 'pointer', // Cambia el cursor si está deshabilitado
          transition: 'background-color 0.3s, color 0.3s',
          marginTop: "10px"
        }}
        onMouseOver={(e) => {
          if (!isButtonDisabled) {
            (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'black';
            (e.currentTarget as HTMLButtonElement).style.color = 'white';
          }
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = isButtonDisabled ? 'lightgrey' : 'transparent';
          (e.currentTarget as HTMLButtonElement).style.color = isButtonDisabled ? 'darkgrey' : 'black';
        }}
        onClick={() => {
          if (!isButtonDisabled) {
            setShowPopup(true); // Abre el popup al hacer clic solo si no está deshabilitado
          }
        }}
      >
        Comprar
      </button>

      {/* Popup de Entrega */}
      {showPopup && (
        <EntregaPopup
          direccion={`${direccion.calle ?? ''} ${direccion.numeroExterior ?? ''}${direccion.numeroInterior ? `, ${direccion.numeroInterior}` : ''}, ${direccion.distrito ?? ''}, ${direccion.ciudad?.nombre ?? ''}`.trim().replace(/,\s*$/, '')}
          nombre= {`${usuario.nombre} ${usuario.apellido}` }
          detalles = {detalles}
          subtotal={total}
          metodoPago="Pago en Efectivo"
          onConfirm={handleConfirmar}
          onClose={() => setShowPopup(false)}
          selectedImageId={selectedImageId}
          paymentAmount={paymentAmount ?? null}
        />
      )}
      {showBuscandoPopup && (
        <BuscandoPopup
          onClose={handleCloseBuscandoPopup}
          customText={showError ? "No hay repartidores disponibles. Inténtalo de nuevo en unos minutos " : "Buscando repartidor disponible"}
          error = {showError}
        />
      )}
    </div>
  );
};

export default ResumenCompra;