import React from 'react';
import { DetallePedido } from 'types/PaquetePedido';

interface EntregaPopupProps {
  direccion: string;
  nombre: string;
  detalles: DetallePedido[];
  subtotal: number;
  metodoPago: string;
  onConfirm: () => void;
  onClose: () => void;
  selectedImageId: string | null;
  paymentAmount: number | null;
}

const EntregaPopup: React.FC<EntregaPopupProps> = ({
  direccion,
  nombre,
  detalles,
  subtotal,
  metodoPago,
  onConfirm,
  onClose,
  selectedImageId,
  paymentAmount,
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
        {detalles.map((detalle, index) => {
          let nombreProducto = detalle.producto.nombre;
          if (detalle.cantidad > 1 && nombreProducto.includes("Paleta")) {
            nombreProducto = nombreProducto.replace("Paleta", "Paletas");
          }
          return (
            <p style={{ textAlign: 'left' }} key={index}>
              <strong>
                {detalle.cantidad} {nombreProducto}
              </strong>
            </p>
          );
        })}
        <p style={{ textAlign: 'left' }}>Subtotal:</p>
        <p style={{ textAlign: 'left' }}>
          <strong>S/. {subtotal.toFixed(2)}</strong>
        </p>
        <p style={{ textAlign: 'left' }}>Método de pago:</p>
        <div style={{ textAlign: 'left', display: 'flex', alignItems: 'center' }}>
        <strong>{metodoPago}</strong>
          {selectedImageId === 'pagoEfec' && (
            <img src="/images/efectivo.png" alt="Efectivo" style={{ marginLeft: '10px', height: '30px' }} />
          )}
        </div>
        {selectedImageId === 'pagoEfec' && paymentAmount !== null && (
        <>
          <p style={{ textAlign: 'left' }}>Monto a Pagar</p>
          <p style={{ textAlign: 'left' }}>
            <strong>S/. {paymentAmount.toFixed(2)}</strong>
          </p>
          <p style={{ textAlign: 'left' }}>Vuelto</p>
          <p style={{ textAlign: 'left' }}>
            <strong>S/. {(paymentAmount - subtotal).toFixed(2)}</strong>
          </p>
        </>
      )}
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
    width: '350px', // Definimos la anchura aquí
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
    cursor: 'pointer',
    backgroundColor: 'white',
    color: 'red',
  },
};

export default EntregaPopup;