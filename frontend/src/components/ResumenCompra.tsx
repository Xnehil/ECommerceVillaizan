import React, { useState, useEffect } from 'react';

import EntregaPopup from './EntregaPopup'; // Asegúrate de importar el componente EntregaPopup
import BuscandoPopup from './BuscandoPopup';
import Link from "next/link"
import { DetallePedido, MetodoPago, Pedido } from 'types/PaquetePedido';
import { Direccion } from 'types/PaqueteEnvio';
import { Usuario } from 'types/PaqueteUsuario';
import axios, { AxiosError } from "axios"
import { ErrorMessage } from '@hookform/error-message';

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
  const [tooltip, setTooltip] = useState<string | null>(null); // State for tooltip content
  const [showError, setShowError] = useState(false);
  const [errorText, setErrorText] = useState("");
    
  const handleMouseOver = (e: React.MouseEvent<HTMLButtonElement>) => {
    if (!isButtonDisabled) {
      (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'black';
      (e.currentTarget as HTMLButtonElement).style.color = 'white';
    } else {
      if (!seleccionado && selectedImageId) {
        setTooltip('Debes aceptar los términos y condiciones');
      } else if (!selectedImageId && seleccionado) {
        setTooltip('Debes seleccionar un método de pago');
      } else {
        setTooltip('Debes seleccionar un método de pago y aceptar los términos y condiciones');
      }
    }
  };

  const handleMouseOut = (e: React.MouseEvent<HTMLButtonElement>) => {
    (e.currentTarget as HTMLButtonElement).style.backgroundColor = isButtonDisabled ? 'lightgrey' : 'transparent';
    (e.currentTarget as HTMLButtonElement).style.color = isButtonDisabled ? 'darkgrey' : 'black';
    setTooltip(null);
  };



  const toggleSeleccion = () => {
    setSeleccionado(!seleccionado);
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

  const handleConfirmar = async () => {
    setShowPopup(false);
    setShowBuscandoPopup(true);
    try{
      if(selectedImageId === "pagoEfec"){
        const responseMetodoPago = await axios.post(`${baseUrl}/admin/metodoPago/nombre`, {
          nombre: "Pago en Efectivo"
        });
        if(responseMetodoPago.data){
          console.log("Metodo de pago encontrado");
          console.log(responseMetodoPago.data);
          if (!pedido.metodosPago) {
            pedido.metodosPago = [];
          }
          pedido.metodosPago.push(responseMetodoPago.data.metodoPago);
        }
      }
    }
    catch(error){
      
      const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 404) {
            console.log("Pedido no encontrado");
        } else if (axiosError.response?.status === 503) {
            console.log("Error al guardar el metodo de pago");
            setErrorText("Error al guardar el metodo de pago. Inténtalo de nuevo en unos minutos");
            setShowPopup(false);
            setShowBuscandoPopup(true);
            setShowError(true);
        }
    }
    pedido.estado = "solicitado";
    pedido.montoEfectivoPagar = paymentAmount ?? 0;
    try{
      const response = await axios.put(`${baseUrl}/admin/pedido/${pedido.id}?asignarRepartidor=true`, pedido); // Harvy agregó esto, un parámetro extra que el back leería para saber que se debe asignar un repartidor
      if(response.data){
        console.log("Pedido modificado correctamente");
        console.log(response.data);
      }
      const pedidoActualizado = response.data.pedido;
      let codigoSeguimiento = "123456";
      window.location.href = `/seguimiento?codigo=${pedidoActualizado.codigoSeguimiento??codigoSeguimiento}`;
    } catch (error) {
      const axiosError = error as AxiosError;
        if (axiosError.response && axiosError.response.status === 404) {
            console.log("Pedido no encontrado");
        } else if (axiosError.response?.status === 503) {
            console.log("No hay motorizados disponibles");
            setErrorText("No hay repartidores disponibles. Inténtalo de nuevo en unos minutos");
            setShowPopup(false);
            setShowBuscandoPopup(true);
            setShowError(true);
        } else if (axiosError.response?.status === 504) {
            console.log("Algunos productos en tu carrito tienen stock insuficiente.");
            setErrorText("Algunos productos en tu carrito tienen stock insuficiente.");
            setShowPopup(false);
            setShowBuscandoPopup(true);
            setShowError(true);
        }
    }
    
  };

  const handleCloseBuscandoPopup = () => {
    setShowBuscandoPopup(false);
    if(errorText === "Algunos productos en tu carrito tienen stock insuficiente."){
      window.history.back();
    }
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
      {hayDescuento && descuento > 0 && (
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
          backgroundColor: isButtonDisabled ? 'lightgrey' : 'transparent',
          color: isButtonDisabled ? 'darkgrey' : 'black',
          fontWeight: 'bold',
          transition: 'background-color 0.3s, color 0.3s',
          marginTop: '10px',
          position: 'relative' // Needed for tooltip positioning
        }}
        onMouseOver={handleMouseOver}
        onMouseOut={handleMouseOut}
        disabled={isButtonDisabled}
        onClick={() => {
          if (!isButtonDisabled) {
            setShowPopup(true);
          }
        }}
      >
        Comprar
        {/* Tooltip */}
        {tooltip && (
          <div
            style={{
              position: 'absolute',
              bottom: '110%',
              left: '50%',
              transform: 'translateX(-50%)',
              backgroundColor: 'black',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '4px',
              whiteSpace: 'nowrap',
              zIndex: 1
            }}
          >
            {tooltip}
          </div>
        )}
      </button>

      

      {/* Popup de Entrega */}
      {showPopup && (
        <EntregaPopup
        direccion={`${direccion.calle ?? ''}${direccion.calle ? ' ' : ''}${direccion.numeroExterior ?? ''}${direccion.numeroInterior ? `, ${direccion.numeroInterior}` : ''}${direccion.distrito ? `, ${direccion.distrito}` : ''}${direccion.ciudad?.nombre ? `, ${direccion.ciudad.nombre}` : ''}`.trim().replace(/,\s*$/, '')}
          nombre= {`${usuario.nombre}` }
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
          customText={showError ? errorText : "Buscando repartidor disponible"}
          error = {showError}
        />
      )}
    </div>
  );
};

export default ResumenCompra;