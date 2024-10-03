import React, { useState, useEffect } from 'react';

import EntregaPopup from './EntregaPopup'; // Asegúrate de importar el componente EntregaPopup
import BuscandoPopup from './BuscandoPopup';
import Link from "next/link"
import { DetallePedido, MetodoPago, Pedido } from 'types/PaquetePedido';
import { Direccion } from 'types/PaqueteEnvio';
import { Usuario } from 'types/PaqueteUsuario';
import axios from "axios"

interface ResumenCompraProps {
  descuento: number;
  costoEnvio: number;
  noCostoEnvio: boolean;
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


  const calcularSubtotal = () => {
    return detalles.reduce((acc, detalle) => acc + detalle.producto.precioC * detalle.cantidad, 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal() - descuento + (noCostoEnvio ? 0 : costoEnvio);
  };

  const calcularVuelto = () => {
    return paymentAmount ? paymentAmount - calcularTotal() : 0;
  }

  useEffect(() => {
    calcularTotal();
    calcularVuelto();
  }, [detalles, descuento, costoEnvio, noCostoEnvio, paymentAmount]);

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

  const handleConfirmar = async () => {

    setShowPopup(false);
    setShowBuscandoPopup(true);
    /*
    const {detalles, ...pedidoSinDetalles} = pedido;
    const pedido2 = {...pedidoSinDetalles, detalles: []};
    console.log("Pedido a confirmar", pedido2);
    let pedidoBD = null;
    if (pedido && pedido.id) {
      const idBuscar = pedido.id;
      pedidoBD = await buscarPedido(idBuscar);
    } else {
      pedidoBD = await crearPedido();
    }
    pedidoBD.estado = "solicitado";
    const metodoPago : MetodoPago = {
      id: "mp_01J99CS1H128G2P7486ZB5YACH",
      nombre: '',
      pedidos: [],
      desactivadoEn: null,
      usuarioCreacion: '',
      usuarioActualizacion: '',
      estaActivo: false
    };
    // Ensure metodoPago is defined
    if (!pedidoBD.metodosPago) {
      pedidoBD.metodosPago = {metodoPago};
    }
    pedidoBD.montoEfectivoPagar = paymentAmount;
    pedidoBD.codigoSeguimiento = "123456";
    console.log("Pedido ha guardar", pedidoBD);
    const response = await axios.put(`${baseUrl}/admin/pedido/${pedidoBD.id}`, pedidoBD);
    if(response.data){
      //setShowBuscandoPopup(false);
      console.log("Pedido creado correctamente");
      console.log(response.data);
    }
      */
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
          <span>S/. {(detalle.producto.precioC * detalle.cantidad).toFixed(2)}</span>
        </div>
      ))}

      {/* Mostrar descuento y costo de envío */}
      {descuento > 0 && (
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
          //productos={productos}
          subtotal={calcularTotal()}
          metodoPago="Pago a Efectivo"
          onConfirm={handleConfirmar}
          onClose={() => setShowPopup(false)}
          selectedImageId={selectedImageId}
          paymentAmount={paymentAmount ?? null}
        />
      )}
      {showBuscandoPopup && (
        <BuscandoPopup
          onClose={handleCloseBuscandoPopup}
          customText="¡Buscando repartidor!"
        />
      )}
    </div>
  );
};

export default ResumenCompra;