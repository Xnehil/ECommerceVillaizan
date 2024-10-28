import React, { useState, useEffect } from 'react';
import InputWithLabel from '@components/inputWithLabel';
import { Direccion } from 'types/PaqueteEnvio';
import axios from 'axios';

interface AddressFormProps {
  state: 'Editar' | 'Crear';
  direccion: Direccion | null;
  onUpdateDireccion: (updatedDireccion: Direccion) => void;
  onCreatedDireccion: (createdDireccion: Direccion) => void;
  userId: string;
}

const AddressForm: React.FC<AddressFormProps> = ({ state, direccion, onUpdateDireccion, onCreatedDireccion, userId}) => {
  const [nombre, setNombre] = useState('');
  const [calle, setCalle] = useState('');
  const [numeroExterior, setNumeroExterior] = useState('');
  const [numeroInterior, setNumeroInterior] = useState('');
  const [referencia, setReferencia] = useState('');
  const [ciudadId, setCiudadId] = useState('');
  const [ciudades, setCiudades] = useState<{ id: string; nombre: string }[]>([]);

  useEffect(() => {
    if (state === 'Editar' && direccion) {
      setNombre(direccion.nombre ?? '');
      setCalle(direccion.calle ?? '');
      setNumeroExterior(direccion.numeroExterior ?? '');
      setNumeroInterior(direccion.numeroInterior ?? '');
      setReferencia(direccion.referencia ?? '');
      setCiudadId(direccion.ciudad?.id ?? '');
    }
  }, [state, direccion]);

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/ciudad`);
        setCiudades(response.data.ciudades);
      } catch (error) {
        console.error('Error fetching ciudades:', error);
      }
    };

    fetchCiudades();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    console.log({ nombre, calle, numeroExterior, numeroInterior, referencia, ciudadId });

    if (state === 'Editar' && direccion) {
      try {
        const responseCiudad = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/ciudad/${ciudadId}`);
        const ciudad = responseCiudad.data.ciudad;

        const direccionSubmit: Direccion = {
          ...direccion,
          nombre,
          calle,
          numeroExterior,
          numeroInterior,
          referencia,
          ciudad
        };

        const response = await axios.put(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/direccion/${direccion.id}`, direccionSubmit);
        const updatedDireccion = response.data.direccion;
        onUpdateDireccion(updatedDireccion);
      } catch (error) {
        console.error('Error updating direccion:', error);
      }
    }
    else{
        try {
            const response = await axios.post(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/direccion`, {
                nombre: nombre,
                calle: calle,
                numeroExterior: numeroExterior,
                numeroInterior: numeroInterior,
                referencia: referencia,
                guardada: true,
                distrito: "",
                ciudad:{
                    id: ciudadId
                },
                usuario:{
                    id: userId
                }                
              });
            const createdDireccion = response.data.direccion;
            onCreatedDireccion(createdDireccion);
         }
        catch (error) {
            console.error('Error creating direccion:', error);
        }
    }
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
          value={ciudadId}
          onChange={(e) => setCiudadId(e.target.value)}
          required
          className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
        >
          <option value="">Seleccione una ciudad</option>
          {ciudades.map((ciudad) => (
            <option key={ciudad.id} value={ciudad.id}>
              {ciudad.nombre}
            </option>
          ))}
        </select>
      </div>
      <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded-md">
        {state === 'Crear' ? 'Crear Dirección' : 'Guardar Cambios'}
      </button>
    </form>
  );
};

export default AddressForm;