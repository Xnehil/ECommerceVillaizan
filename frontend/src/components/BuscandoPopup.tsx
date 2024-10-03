// BuscandoPopup.tsx
import React from 'react';

interface BuscandoPopupProps {
  onClose: () => void;
  customText: string;
}

const BuscandoPopup: React.FC<BuscandoPopupProps> = ({ onClose, customText }) => {
  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <div style={styles.loader}></div>
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
    padding: '20px',
    width: '300px',
    textAlign: 'center' as 'center',
  },
  loader: {
    border: '16px solid #f3f3f3',
    borderRadius: '50%',
    borderTop: '16px solid black',
    width: '60px',
    height: '60px',
    animation: 'spin 2s linear infinite',
    margin: '0 auto 20px',
  },
  cancelButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: 'red',
  },
  '@keyframes spin': {
    '0%': { transform: 'rotate(0deg)' },
    '100%': { transform: 'rotate(360deg)' },
  },
};

export default BuscandoPopup;