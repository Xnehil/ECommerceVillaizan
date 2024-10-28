"use client";

import React, { useState } from 'react';

type PaymentPopupProps = {
  totalPagar: number;
  montoMaximoDeVuelto: number;
  onConfirm: (amount: number) => void;
  onClose: () => void;
};

const PaymentPopup: React.FC<PaymentPopupProps> = ({ totalPagar, montoMaximoDeVuelto, onConfirm, onClose }) => {
  const [paymentAmount, setPaymentAmount] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [amountInput, setAmountInput] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;

    // Allow empty strings, digits, and up to one optional decimal
    if (/^\d*\.?\d{0,1}$/.test(value)) {
      setAmountInput(value); // Maintain value as a string for editing
      // Assign the numeric value to the existing paymentAmount
      setPaymentAmount(value === "" ? 0 : parseFloat(value)); // Set paymentAmount as a number
    }
  };

  const handleConfirm = () => {
    if (paymentAmount >= totalPagar) {
      const change = paymentAmount - totalPagar;
      if (change <= montoMaximoDeVuelto) {
        onConfirm(paymentAmount);
        setErrorMessage(''); // Limpiar el mensaje de error si el pago es correcto
      } else {
        setErrorMessage(`El vuelto tiene que ser menor a ${montoMaximoDeVuelto}.`);
      }
    } else {
      setErrorMessage('El monto debe ser mayor o igual al monto total a pagar.');
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <h2>Ingrese el monto con el que va a pagar</h2>
        <p className='text-xs'>Aceptamos billetes de hasta 100 soles</p>
        
        {errorMessage && <p style={styles.error}>{errorMessage}</p>}
        
        <input
      type="text" // Use "text" to allow flexible input
      value={amountInput}
      onChange={handleChange}
      placeholder="Ingresa el monto"
      style={{ width: "200px", padding: "5px", margin: "10px 0", borderRadius: "5px", border: "1px solid #ccc" }}
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
    width: '340px',
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