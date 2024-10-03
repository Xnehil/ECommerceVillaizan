"use client";

import React, { useState } from 'react';

type PaymentPopupProps = {
  totalPagar: number;
  onConfirm: (amount: number) => void;
  onClose: () => void;
};

const PaymentPopup: React.FC<PaymentPopupProps> = ({ totalPagar, onConfirm, onClose }) => {
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');

  const handleConfirm = () => {
    if (paymentAmount >= totalPagar) {
      onConfirm(paymentAmount);
      setErrorMessage(''); // Limpiar el mensaje de error si el pago es correcto
    } else {
      setErrorMessage('El monto debe ser mayor o igual al monto total a pagar.');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2>Ingrese el monto con el que va a pagar</h2>
        
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        
        <input 
          type="number" 
          value={paymentAmount} 
          onChange={(e) => setPaymentAmount(Number(e.target.value))} 
          style={styles.input}
        />
        <div style={{ ...styles.buttonContainer, flexDirection: 'column', gap: '10px' }}>
          <button onClick={handleConfirm} style={styles.confirmButton}>Confirmar</button>
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
  input: {
    width: '100%',
    padding: '10px',
    margin: '10px 0',
    borderRadius: '5px',
    border: '1px solid #ccc',
  },
  error: {
    color: 'red',
    marginBottom: '10px',
  },
  buttonContainer: {
    display: 'flex',
    justifyContent: 'space-between',
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

export default PaymentPopup;
