// BuscandoPopup.tsx
import React from 'react';
import { LoadingSpinner } from 'components/LoadingSpinner'; // Ajusta la ruta de importación según sea necesario

interface BuscandoPopupProps {
  onClose: () => void;
  customText: string;
  error?: boolean;
}

const BuscandoPopup: React.FC<BuscandoPopupProps> = ({ onClose, customText, error = false }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        {error ? (
             <div style={styles.errorContainer}>
             <img src={"/images/motoHeladera.png"} alt="Error" style={styles.errorImage} />
             <p style={styles.errorMessage}>
              {customText}
            </p>
             <button style={styles.closeButton} onClick={onClose}>Cerrar</button>
           </div>
        ) : (
          <>
            <LoadingSpinner size={140} className="custom-spinner-class" />
            <p style={{ textAlign: 'center' }}><strong>{customText}</strong></p>
          </>
        )}
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
    padding: '40px',
    width: '400px',
    textAlign: 'center' as 'center',
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
  },
  cancelButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: 'red',
  },
  errorContainer: {
    display: 'flex',
    flexDirection: 'column' as 'column',
    alignItems: 'center',
  },
  errorImage: {
    width: '100px',
    height: '100px',
    marginBottom: '10px',
  },
  errorMessage: {
    textAlign: 'center' as 'center',
    color: 'black',
    fontSize: '16px',
    fontWeight: 'bold' as 'bold',
  },
  closeButton: {
    marginTop: '10px',
    padding: '10px 20px',
    backgroundColor: '#BD181E',
    color: 'white',
    border: 'none',
    borderRadius: '5px',
    cursor: 'pointer',
    fontSize: '14px',
  },
};

export default BuscandoPopup;