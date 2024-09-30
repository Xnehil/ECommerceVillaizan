import React from 'react';

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
}

const ResumenCompra: React.FC<ResumenCompraProps> = ({ productos, descuento, costoEnvio, textoCustomizado }) => {
  const calcularSubtotal = () => {
    return productos.reduce((acc, producto) => acc + producto.precio * producto.cantidad, 0);
  };

  const calcularTotal = () => {
    return calcularSubtotal() - descuento + costoEnvio;
  };

  return (
    <div style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '8px', width: '300px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', marginBottom: '10px' }}>
        <span>Producto</span>
        <span>Subtotal</span>
      </div>
      {productos.map((producto, index) => (
        <div key={index} style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
          <span>{producto.nombre} x {producto.cantidad}</span>
          <span>${(producto.precio * producto.cantidad).toFixed(2)}</span>
        </div>
      ))}
      <hr style={{ margin: '10px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 'bold', color: 'yellow' }}>
        <span>Total:</span>
        <span>${calcularTotal().toFixed(2)}</span>
      </div>
      <hr style={{ margin: '10px 0' }} />
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <div
          style={{
            width: '20px',
            height: '20px',
            border: '2px solid black',
            borderRadius: '50%',
            marginRight: '10px',
          }}
        />
        <span>Términos y Condiciones</span>
      </div>
      <p>{textoCustomizado}</p>
    </div>
  );
};

export default ResumenCompra;
