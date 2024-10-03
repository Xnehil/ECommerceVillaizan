import React, { useState, useEffect } from 'react';

import EntregaPopup from './EntregaPopup'; // Asegúrate de importar el componente EntregaPopup
import BuscandoPopup from './BuscandoPopup';
import Link from "next/link"
import { DetallePedido } from 'types/PaquetePedido';
import { Direccion } from 'types/PaqueteEnvio';
import { Usuario } from 'types/PaqueteUsuario';


interface ResumenCompraProps {
  descuento: number;
  costoEnvio: number;
  noCostoEnvio: boolean;
  paymentAmount: number | null;
  selectedImageId: string | null;
  onTotalChange: React.Dispatch<React.SetStateAction<number>>;
  onVueltoChange: React.Dispatch<React.SetStateAction<number>>;
  // Add detallePedidos here
  detalles: DetallePedido[];
  direccion: Direccion;
  usuario: Usuario;
}

const ResumenCompra: React.FC<ResumenCompraProps> = ({
  descuento,
  costoEnvio,
  noCostoEnvio,
  paymentAmount,
  selectedImageId,
  onTotalChange,
  onVueltoChange,
  detalles,
  direccion,
  usuario
}) => {
  const [seleccionado, setSeleccionado] = useState(false); // Estado para manejar si está seleccionado
  const [showPopup, setShowPopup] = useState(false); // Estado para mostrar el popup de entrega
  const [showBuscandoPopup, setShowBuscandoPopup] = useState(false);
  const isButtonDisabled = !selectedImageId || !seleccionado; // Deshabilitar el botón si no hay una imagen seleccionada


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

  const handleConfirmar = () => {
    // Lógica adicional al confirmar, si es necesario
    setShowPopup(false);
    setShowBuscandoPopup(true);
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
        <span style={{ color: '#B88E2F' }}>S/. {calcularTotal().toFixed(2)}</span>
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
            <span>S/. {calcularVuelto().toFixed(2)}</span>
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