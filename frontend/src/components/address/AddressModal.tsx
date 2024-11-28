import React from 'react';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

const AddressModal: React.FC<ModalProps> = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          backgroundColor: 'white',
          padding: '20px',
          borderRadius: '10px',
          width: '500px',
          maxWidth: '100%',
          maxHeight: '80vh', // Limit the modal's height to 80% of the viewport height
          overflowY: 'auto', // Enable vertical scrolling if the content exceeds maxHeight
        }}
      >
        {children}
      </div>
    </div>
  );
};

export default AddressModal;
