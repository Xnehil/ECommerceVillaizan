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
        <p style={{ textAlign: 'left' }}>Entregar en:</p>
        <p style={{ textAlign: 'left' }}>
          <strong>{direccion}</strong>
        </p>
        <p style={{ textAlign: 'left' }}>Para:</p>
        <p style={{ textAlign: 'left' }}>
          <strong>{nombre}</strong>
        </p>
        <p style={{ textAlign: 'left' }}>Pedido:</p>
        {productos.map((producto, index) => (
          <p style={{ textAlign: 'left' }} key={index}>
            <strong>
              {producto.cantidad} {producto.nombre}
            </strong>
          </p>
        ))}
        <p style={{ textAlign: 'left' }}>Subtotal:</p>
        <p style={{ textAlign: 'left' }}>
          <strong>S/. {subtotal.toFixed(2)}</strong>
        </p>
        <p style={{ textAlign: 'left' }}>Método de pago:</p>
        <p style={{ textAlign: 'left' }}>
          <strong>{metodoPago}</strong>
        </p>
        <div style={{ ...styles.buttonContainer, flexDirection: 'column', gap: '10px' }}>
          <button onClick={onConfirm} style={styles.confirmButton}>Confirmar</button>
          <button onClick={onClose} style={styles.cancelButton}>Volver</button>
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
    border: '1px solid black',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: 'red',
  },
};

export default EntregaPopup;
