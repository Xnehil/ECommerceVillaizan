import React from 'react';

interface EliminationPopUpProps {
  isOpen: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

const EliminationPopUp: React.FC<EliminationPopUpProps> = ({ isOpen, onConfirm, onClose }) => {
  if (!isOpen) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    }}>
      <div style={{
        backgroundColor: 'white',
        padding: '20px',
        borderRadius: '10px',
        width: '500px',
        maxWidth: '100%',
        textAlign: 'center',
      }}>
        <p style={{ marginBottom: '20px' }}>¿Estás seguro de eliminar esta dirección?</p>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button type="button" onClick={onClose} style={styles.cancelButton}>
            Cancelar
          </button>
          <button type="button" onClick={onConfirm} style={styles.confirmButton}>
            Confirmar
          </button>
        </div>
      </div>
    </div>
  );
};

const styles = {
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

export default EliminationPopUp;