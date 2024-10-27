import React from 'react';

interface AddAddressButtonProps {
  onClick: () => void;
}

const AddAddressButton: React.FC<AddAddressButtonProps> = ({ onClick }) => {
  return (
    <button onClick={onClick} style={{ display: 'flex', alignItems: 'center', background: 'none', border: '1px solid grey', borderRadius: '10px', padding: '10px', cursor: 'pointer' }}>
      <img src="/images/suma.png" alt="Add" style={{ marginRight: '10px', width: '20px', height: '20px' }} />
      <span>Agregar una Dirección</span>
    </button>
  );
};

export default AddAddressButton;