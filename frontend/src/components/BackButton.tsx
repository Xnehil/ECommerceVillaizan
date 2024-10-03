import React from 'react';

interface BackButtonProps {
  onClick: () => void;
}

const BackButton: React.FC<BackButtonProps> = ({ onClick }) => {
  return (
    <div
      onClick={onClick}
      style={{
        display: 'flex',
        alignItems: 'center',
        backgroundColor: '#F9F1E7',
        borderRadius: '50px',
        padding: '10px 15px', // Reduced padding
        cursor: 'pointer'
      }}
    >
      <img src="/images/back.png" alt="Back" style={{ marginRight: '5px', width: '16px', height: '16px' }} /> {/* Reduced image size */}
      <span style={{ fontSize: '14px' }}><strong>Volver</strong></span> {/* Reduced font size */}
    </div>
  );
};

export default BackButton;