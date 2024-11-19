import React from 'react';
import { Direccion } from 'types/PaqueteEnvio';

interface AddressCardProps {
  direccion: Direccion;
  onEdit: () => void;
  onDelete: () => void;
  showBorder: boolean;
  size: 'small' | 'medium' | 'large';
}

const AddressCard: React.FC<AddressCardProps> = ({ direccion, onEdit, onDelete, showBorder, size }) => {
  const getSizeStyles = () => {
    switch (size) {
      case 'small':
        return { padding: '5px', fontSize: '12px' };
      case 'medium':
        return { padding: '10px', fontSize: '14px' };
      case 'large':
        return { padding: '15px', fontSize: '16px', width: '800px' }; // Ajusta el ancho para "large" aquí
      default:
        return {};
    }
  };

  return (
    <div style={{
      border: showBorder ? '1px solid grey' : 'none',
      borderRadius: '10px',
      marginBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      ...getSizeStyles()
    }}>
      {/* First div with 65% width */}
      <div style={{ flexBasis: '70%', paddingRight: '10px' }}>
        <p>
          {`${direccion.nombre ?? ''}${direccion.nombre ? ' | ' : ''}${direccion.calle ?? ''}${direccion.calle ? ' ' : ''}${direccion.numeroExterior ?? ''}${direccion.numeroExterior ? ' ' : ''}${direccion.numeroInterior ? '(' : ''}${direccion.numeroInterior ?? ''}${direccion.numeroInterior ? ') ' : ''}${direccion.ciudad?.nombre ? `, ${direccion.ciudad.nombre}` : ''}`
            .trim()
            .replace(/,\s*$/, '')}
        </p>
        {direccion.referencia && <p style={{ color: 'grey' }}>{direccion.referencia}</p>}
      </div>
  
      {/* Second div with 35% width */}
      <div style={{ flexBasis: '30%', display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
        <button onClick={onEdit} style={{
          color: 'blue',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          marginRight: '10px'
        }}>
          Editar Informacion
        </button>
        <img
          src="/images/ant-design_delete-filled.png"
          alt="Delete"
          onClick={onDelete}
          style={{ cursor: 'pointer' }}
        />
      </div>
    </div>
  );
  
};

export default AddressCard;
