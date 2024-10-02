import React from 'react';

interface EntregaPopupProps {
  direccion: string;
  nombre: string;
  productos: { nombre: string; cantidad: number }[];
  subtotal: number;
  metodoPago: string;
  onConfirm: () => void;
  onClose: () => void;
}

const EntregaPopup: React.FC<EntregaPopupProps> = ({ 
  direccion, 
  nombre, 
  productos, 
  subtotal, 
  metodoPago, 
  onConfirm, 
  onClose 
}) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2>Detalles de Entrega</h2>
        <p>Entregar en: {direccion}</p>
        <p>Para: {nombre}</p>
        <p>Pedido:</p>
        {productos.map((producto, index) => (
          <p key={index}>
            {producto.cantidad} {producto.nombre}
          </p>
        ))}
        <p>Subtotal: ${subtotal.toFixed(2)}</p>
        <p>Método de pago: {metodoPago}</p>
        <div style={styles.buttonContainer}>
          <button onClick={onClose} style={styles.button}>Volver</button>
          <button onClick={onConfirm} style={styles.button}>Confirmar</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed' as 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: 'white',
    borderRadius: '15px',
    padding: '20px',
    width: '300px',
    textAlign: 'center' as 'center',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    marginTop: '20px',
  },
  button: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'black',
    color: 'white',
  },
};

export default EntregaPopup;
