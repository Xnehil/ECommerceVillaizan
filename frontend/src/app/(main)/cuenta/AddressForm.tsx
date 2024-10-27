import React, { useState } from 'react';
import InputWithLabel from '@components/inputWithLabel';

interface AddressFormProps {
  state: 'Editar' | 'Crear';
}

const AddressForm: React.FC<AddressFormProps> = ({ state }) => {
  const [nombre, setNombre] = useState('');
  const [calle, setCalle] = useState('');
  const [numeroExterior, setNumeroExterior] = useState('');
  const [numeroInterior, setNumeroInterior] = useState('');
  const [referencia, setReferencia] = useState('');
  const [ciudad, setCiudad] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // TODO: Add form submission logic
    console.log({ nombre, calle, numeroExterior, numeroInterior, referencia, ciudad });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2>{state === 'Crear' ? 'Crear Dirección' : 'Editar Dirección'}</h2>
      <InputWithLabel
        label="Nombre"
        value={nombre}
        onChange={(e) => setNombre(e.target.value)}
        required
        placeholder="Ejemplo"
        tooltip="Máximo 250 palabras"
      />
      <InputWithLabel
        label="Calle"
        value={calle}
        onChange={(e) => setCalle(e.target.value)}
        required
        placeholder="Av. La Republica"
      />
      <InputWithLabel
        label="Número Exterior"
        value={numeroExterior}
        onChange={(e) => setNumeroExterior(e.target.value)}
        placeholder="546"
      />
      <InputWithLabel
        label="Número Interior"
        value={numeroInterior}
        onChange={(e) => setNumeroInterior(e.target.value)}
        placeholder="10"
      />
      <InputWithLabel
        label="Referencia"
        value={referencia}
        onChange={(e) => setReferencia(e.target.value)}
        required
        placeholder="Cerca a mi casa"
        tooltip="Máximo 255 palabras"
      />
      <div>
        <label htmlFor="ciudad">Ciudad</label>
        <select
          id="ciudad"
          value={ciudad}
          onChange={(e) => setCiudad(e.target.value)}
          required
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Seleccione una ciudad</option>
          {/* TODO: Populate this dropdown with cities from the database */}
        </select>
      </div>
      <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-md">
        {state === 'Crear' ? 'Crear Dirección' : 'Guardar Cambios'}
      </button>
    </form>
  );
};

export default AddressForm;