import React from 'react';
import { Direccion } from 'types/PaqueteEnvio';

interface AddressCardProps {
  direccion: Direccion;
  onEdit: () => void;
  onDelete: () => void;
}

const AddressCard: React.FC<AddressCardProps> = ({ direccion, onEdit, onDelete }) => {
  return (
    <div style={{ border: '1px solid grey', borderRadius: '10px', padding: '10px', marginBottom: '10px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
      <div>
        <p>{`${direccion.nombre ?? ''}${direccion.nombre ? ' | ' : ''}${direccion.calle ?? ''}${direccion.calle ? ' ' : ''}${direccion.numeroExterior ?? ''}${direccion.numeroExterior ? ' ' : ''}${direccion.numeroInterior ? '(' : ''}${direccion.numeroInterior ?? ''}${direccion.numeroInterior ? ') ' : ''}${direccion.ciudad?.nombre ? `, ${direccion.ciudad.nombre}` : ''}`.trim().replace(/,\s*$/, '')}</p>
        {direccion.referencia && <p style={{ color: 'grey' }}>{direccion.referencia}</p>}
      </div>
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <button onClick={onEdit} style={{ color: 'blue', background: 'none', border: 'none', cursor: 'pointer', marginRight: '10px' }}>Editar Informacion</button>
        <img src="/images/ant-design_delete-filled.png" alt="Delete" onClick={onDelete} style={{ cursor: 'pointer' }} />
      </div>
    </div>
  );
};

export default AddressCard;