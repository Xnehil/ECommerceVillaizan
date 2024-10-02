import React, { useState } from 'react';
import EntregaPopup from './EntregaPopup'; // Asegúrate de importar el componente EntregaPopup

interface Producto {
  nombre: string;
  cantidad: number;
  precio: number;
}

interface ResumenCompraProps {
  productos: Producto[];
  descuento: number;
  costoEnvio: number;
  textoCustomizado: string;
  noCostoEnvio: boolean;  // Nuevo argumento
  paymentAmount?: number | null;  // Nueva prop para el monto de pago
  selectedImageId: string | null;  // Nueva prop para el ID de la imagen seleccionada
}


const ResumenCompra: React.FC<ResumenCompraProps> = ({ productos, descuento, costoEnvio, textoCustomizado, noCostoEnvio, paymentAmount,selectedImageId  }) => {
  const [seleccionado, setSeleccionado] = useState(false); // Estado para manejar si está seleccionado
  const [showPopup, setShowPopup] = useState(false); // Estado para mostrar el popup de entrega
  const isButtonDisabled = !selectedImageId || !seleccionado; // Deshabilitar el botón si no hay una imagen seleccionada


  const calcularSubtotal = () => {
    return productos.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal() - descuento + (noCostoEnvio ? 0 : costoEnvio);
  };

  const calcularVuelto = () => {
    return paymentAmount ? paymentAmount - calcularTotal() : 0;
  }
  

  const toggleSeleccion = () => {
    setSeleccionado(!seleccionado); // Cambia el estado entre true y false
  };

  const handleConfirmar = () => {
    // Lógica adicional al confirmar, si es necesario
    setShowPopup(false);
  };

  return (
    <div style={{ padding: '20px', borderRadius: '8px', width: '500px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '10px' }}>
        <span>Producto</span>
        <span>Subtotal</span>
      </div>
      {productos.map((producto, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span style={{ color: 'grey' }}>
            {producto.nombre} <strong style={{ color: 'black' }}>x</strong> {producto.cantidad}
          </span>
          <span>S/. {(producto.precio * producto.cantidad).toFixed(2)}</span>
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
      
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }} onClick={toggleSeleccion}>
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
        />
        <span style={{ cursor: 'pointer' }}>He leído y acepto los términos y condiciones</span>
      </div>
      <div>
        <small>{textoCustomizado}</small>
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
          direccion="Calle Ejemplo 123"
          nombre="Juan Pérez"
          productos={productos}
          subtotal={calcularSubtotal()}
          metodoPago="Tarjeta de Crédito"
          onConfirm={handleConfirmar}
          onClose={() => setShowPopup(false)}
        />
      )}
    </div>
  );
};

export default ResumenCompra;
