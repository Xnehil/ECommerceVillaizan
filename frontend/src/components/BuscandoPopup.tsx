// BuscandoPopup.tsx
import React from 'react';
import { LoadingSpinner } from 'components/LoadingSpinner'; // Ajusta la ruta de importación según sea necesario

interface BuscandoPopupProps {
  onClose: () => void;
  customText: string;
}

const BuscandoPopup: React.FC<BuscandoPopupProps> = ({ onClose, customText }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <LoadingSpinner size={140} className="custom-spinner-class" />
        <p style={{ textAlign: 'center' }}><strong>{customText}</strong></p>
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
};

export default BuscandoPopup;