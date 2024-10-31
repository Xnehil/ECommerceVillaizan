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
  onClose: () => void;
  mandatoryCiudad: boolean;
  mandatoryCiudadId: string;
  mandatoryCiudadNombre: string;
}

const AddressForm: React.FC<AddressFormProps> = ({
  state,
  direccion,
  onUpdateDireccion,
  onCreatedDireccion,
  userId,
  onClose,
  mandatoryCiudad,
  mandatoryCiudadId,
  mandatoryCiudadNombre
}) => {
  const [nombre, setNombre] = useState('');
  const [calle, setCalle] = useState('');
  const [numeroExterior, setNumeroExterior] = useState('');
  const [numeroInterior, setNumeroInterior] = useState('');
  const [referencia, setReferencia] = useState('');
  const [ciudadId, setCiudadId] = useState('');
  const [ciudades, setCiudades] = useState<{ id: string; nombre: string }[]>([]);
  const [ciudadNombre, setCiudadNombre] = useState('');
  const [userIdInternal, setUserIdInternal] = useState('');
  const [mandatoryCiudadNombreInternal, setMandatoryCiudadNombreInternal] = useState('');
  const [mandatoryCiudadIdInternal, setMandatoryCiudadIdInternal] = useState('');
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    if (state === 'Editar' && direccion) {
      setNombre(direccion.nombre ?? '');
      setCalle(direccion.calle ?? '');
      setNumeroExterior(direccion.numeroExterior ?? '');
      setNumeroInterior(direccion.numeroInterior ?? '');
      setReferencia(direccion.referencia ?? '');
      setCiudadId(direccion.ciudad?.id ?? '');
      setCiudadNombre(direccion.ciudad?.nombre ?? '');
      setUserIdInternal(userId);
    }
  }, [state, direccion, userId]);

  useEffect(() => {
    if(mandatoryCiudad){
      setMandatoryCiudadNombreInternal(mandatoryCiudadNombre);
      setMandatoryCiudadIdInternal(mandatoryCiudadId);
      setCiudadId(mandatoryCiudadId);
      setCiudadNombre(mandatoryCiudadNombre);
    }    
  }, [mandatoryCiudad, mandatoryCiudadId, mandatoryCiudadNombre]);

  useEffect(() => {
    const fetchCiudades = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/ciudad`);
        setCiudades(response.data.ciudades);
      } catch (error) {
        console.error('Error fetching ciudades:', error);
        setErrorMessage('No se pudieron cargar las ciudades. Intente de nuevo más tarde.');
        setIsErrorPopupVisible(true);
      }
    };
    fetchCiudades();
  }, []);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      if (state === 'Editar' && direccion) {
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
      } else {
        const dataDireccion = {
          nombre,
          calle,
          numeroExterior,
          numeroInterior,
          referencia,
          guardada: true,
          distrito: "",
          ciudad: {
            id: ciudadId,
            nombre: ciudadNombre
          },
          usuario: {
            id: userId
          }
        };
        console.log('Creating new address ',dataDireccion);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/direccion`, dataDireccion);
        const createdDireccion = response.data.direccion;
        onCreatedDireccion(createdDireccion);
      }
    } catch (error) {
      console.error('Error occurred while submitting:', error);
      setErrorMessage('No se pudo guardar la dirección. Intente de nuevo más tarde.');
      setIsErrorPopupVisible(true);
    }
  };
  

  return (
    <>
      {/* Error Popup */}
      {isErrorPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <p className="text-black-600 mb-4">{errorMessage}</p>
            <button
              style={styles.confirmButton}
              onClick={() => {
                setIsErrorPopupVisible(false); // Hide popup
                onClose();
              }}
            >
              Volver
            </button>
          </div>
        </div>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2>
          {state === 'Crear' ? 'Crear Dirección' : 'Editar Dirección'}
          {mandatoryCiudad ? ` en ${mandatoryCiudadNombre}` : ''}
        </h2>
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
          {mandatoryCiudad ? (
            <input
              type="text"
              id="ciudad"
              value={mandatoryCiudadNombre}
              readOnly
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            />
          ) : (
            <select
              id="ciudad"
              value={ciudadId}
              onChange={(e) => {
                const selectedCiudadId = e.target.value;
                const selectedCiudad = ciudades.find(ciudad => ciudad.id === selectedCiudadId);
                setCiudadId(selectedCiudadId);
                setCiudadNombre(selectedCiudad ? selectedCiudad.nombre : '');
              }}
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
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button type="submit" style={styles.confirmButton}>
            {state === 'Crear' ? 'Crear Dirección' : 'Guardar Cambios'}
          </button>
          <button type="button" onClick={onClose} style={styles.cancelButton}>
            Cancelar
          </button>
        </div>
      </form>
    </>
  );
};

const styles = {
  confirmButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'black',
    color: 'white',
  },
  cancelButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    cursor: 'pointer',
    backgroundColor: 'white',
    color: 'red',
  },
};

export default AddressForm;

