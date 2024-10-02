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
}


const ResumenCompra: React.FC<ResumenCompraProps> = ({ productos, descuento, costoEnvio, textoCustomizado, noCostoEnvio }) => {
  const [seleccionado, setSeleccionado] = useState(false); // Estado para manejar si está seleccionado
  const [showPopup, setShowPopup] = useState(false); // Estado para mostrar el popup de entrega

  const calcularSubtotal = () => {
    return productos.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal() - descuento + (noCostoEnvio ? 0 : costoEnvio);
  };
  

  const toggleSeleccion = () => {
    setSeleccionado(!seleccionado); // Cambia el estado entre true y false
  };

  const handleConfirmar = () => {
    // Lógica adicional al confirmar, si es necesario
    setShowPopup(false);
  };

  return (
    <div style={{ padding: '20px', borderRadius: '8px', width: '500px' }}> {/* Se eliminó el borde */}
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
      {/* Mostrar descuento solo si es mayor que 0 */}
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
        <span style={{ color: '#B88E2F' }}>S/. {calcularTotal().toFixed(2)}</span> {/* Monto total con color B88E2F */}
      </div>
      <hr style={{ margin: '10px 0' }} />
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
        <span>Términos y Condiciones</span>
      </div>
      <p>{textoCustomizado}</p>
      <hr style={{ margin: '10px 0' }} />

      {/* Botón Comprar */}
      <button
        style={{
          width: '100%',
          padding: '10px',
          border: '2px solid black',
          borderRadius: '5px',
          backgroundColor: 'transparent',
          color: 'black',
          fontWeight: 'bold',
          cursor: 'pointer',
          transition: 'background-color 0.3s, color 0.3s',
        }}
        onMouseOver={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'black';
          (e.currentTarget as HTMLButtonElement).style.color = 'white';
        }}
        onMouseOut={(e) => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = 'transparent';
          (e.currentTarget as HTMLButtonElement).style.color = 'black';
        }}
        onClick={() => setShowPopup(true)} // Abre el popup al hacer clic
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
