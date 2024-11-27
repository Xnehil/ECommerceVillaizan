import React, { useState, useEffect } from 'react';
import InputWithLabel from '@components/inputWithLabel';
import { Direccion } from 'types/PaqueteEnvio';
import axios from 'axios';
import GoogleMapModal from '@components/GoogleMapsModal';
import { Input } from '@components/input';

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
  const [localError, setLocalError] = useState('');
  const [showMapModal, setShowMapModal] = useState(false)
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)
  const [locationError, setLocationError] = useState("")

  const [errorValidationNombre, setErrorValidationNombre] = useState<  string | null>(null)
  const [errorValidationCalle, setErrorValidationCalle] = useState<  string | null>(null)
  const [errorValidationReferencia, setErrorValidationReferencia] = useState<  string | null>(null)
  const [errorValidationNumeroExterior, setErrorValidationNumeroExterior] = useState<  string | null>(null)
  const [errorValidationNumeroInterior, setErrorValidationNumeroInterior] = useState<  string | null>(null)

  const handleMapSelect = (lat: number, lng: number) => {
    setSelectedLocation({ lat, lng });
    setLocationError("");
    //ACAA PRUEBA SIN googleMapsLoaded
    try{
    //if (googleMapsLoaded) {
      const geocoder = new google.maps.Geocoder();
      const latlng = new google.maps.LatLng(lat, lng);
      geocoder.geocode({ location: latlng }, (results, status) => {
        if (status === "OK" && results) {
          if (results[0]) {
            const address = results[0].formatted_address;
            setCalle(address);
          } else {
            console.error("No se encontraron resultados.");
          }
        } else {
          console.error("Geocoder falló debido a:", status);
        }
      });
    //}
    }
    catch(e){
      console.error("Error en geocoder",e);
    }
  };


  useEffect(() => {
    const fetchUbicacion = async () => {
      try {
        if (state === 'Editar' && direccion) {
          setNombre(direccion.nombre ?? '');
          setCalle(direccion.calle ?? '');
          setNumeroExterior(direccion.numeroExterior ?? '');
          setNumeroInterior(direccion.numeroInterior ?? '');
          setReferencia(direccion.referencia ?? '');
          setCiudadId(direccion.ciudad?.id ?? '');
          setCiudadNombre(direccion.ciudad?.nombre ?? '');
          setUserIdInternal(userId);
          
          // If ubicacion exists, set selectedLocation based on its latitud and longitud
          console.log('Direccion:', direccion);
          console.log('Ubicacion:', direccion.ubicacion);
          if (direccion.ubicacion) {
            const responseUbicacion = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/ubicacion/${direccion.ubicacion.id}`);
            const ubicacion = responseUbicacion.data.ubicacion;
            
            if (ubicacion) {
              console.log("Asignando ubicacion", ubicacion);
              setSelectedLocation({
                lat: parseFloat(ubicacion.latitud?.toString() || '0'),
                lng: parseFloat(ubicacion.longitud?.toString() || '0'),
              });
            }
          }
        }
      } catch (e) {
        console.error("Error en fetchUbicacion", e);
        setErrorMessage('No se pudo cargar la ubicación. Intente de nuevo más tarde.');
        setIsErrorPopupVisible(true);
      }
    };
  
    fetchUbicacion();
  }, [state, direccion, userId]);
  
  // Add a new useEffect to log the selectedLocation after it updates
  useEffect(() => {
    if (selectedLocation) {
      console.log('Selected location updated:', selectedLocation);
    }
  }, [selectedLocation]); // This effect will run whenever selectedLocation changes

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

  const countWords = (text: string) => text.trim().split(/\s+/).length;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    // Validation
    if (nombre.trim() === '' || calle.trim() === '' || referencia.trim() === '') {
      let errorMessage = 'Todos los campos obligatorios deben estar completos.';
      if (nombre.trim() === '' && calle.trim() === '' && referencia.trim() === '') {
        errorMessage = 'Nombre, Calle y Referencia deben estar completos.';
      } else if (nombre.trim() === '' && calle.trim() === '') {
        errorMessage = 'Nombre y Calle deben estar completos.';
      } else if (nombre.trim() === '' && referencia.trim() === '') {
        errorMessage = 'Nombre y Referencia deben estar completos.';
      } else if (calle.trim() === '' && referencia.trim() === '') {
        errorMessage = 'Calle y Referencia deben estar completos.';
      } else if (nombre.trim() === '') {
        errorMessage = 'Nombre debe estar completo.';
      } else if (calle.trim() === '') {
        errorMessage = 'Calle debe estar completa.';
      } else if (referencia.trim() === '') {
        errorMessage = 'Referencia debe estar completa.';
      }
      setLocalError(errorMessage);
      return;
    }

    if (countWords(nombre) > 250) {
      setLocalError('El nombre no puede superar los 250 palabras.');
      return;
    }

    if (countWords(calle) > 255) {
      setLocalError('La calle no puede superar las 255 palabras.');
      return;
    }

    if (countWords(referencia) > 255) {
      setLocalError('La referencia no puede superar las 255 palabras.');
      return;
    }

    if(numeroExterior.trim() !== '' && countWords(numeroExterior) > 20){
      setLocalError('El número exterior no puede superar las 20 palabras.');
      return;
    }
    if(numeroInterior.trim() !== '' && countWords(numeroInterior) > 20){
      setLocalError('El número interior no puede superar las 20 palabras.');
      return;
    }

    setLocalError(''); // Clear error if validation passes

    if(selectedLocation === null){
      setLocationError("Por favor selecciona una ubicación en el mapa")
      setLocalError("Por favor selecciona una ubicación en el mapa")
      return;
    }

    try {
      if (state === 'Editar' && direccion) {
        const responseCiudad = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/ciudad/${ciudadId}`);
        const ciudad = responseCiudad.data.ciudad;
  
        let direccionSubmit : any = {
          ...direccion,
          nombre,
          calle,
          numeroExterior,
          numeroInterior,
          referencia,
          ciudad,
        };

        if(direccion.ubicacion){
          //delete ciudad.ubicacion;
          const responseDelete = await axios.delete(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/ubicacion/${direccion.ubicacion.id}`);
        }
        if(selectedLocation){
          const responseUbicacion = await axios.post(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/ubicacion`,{
            latitud: selectedLocation.lat.toString(),
            longitud: selectedLocation.lng.toString()
          });
          if(responseUbicacion.data.ubicacion){
            direccionSubmit = {
              ...direccionSubmit,
              ubicacion: {
                id: responseUbicacion.data.ubicacion.id
              }
            }
          }
        }
  
        console.log('Updating address ',direccionSubmit); 
        const response = await axios.put(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/direccion/${direccion.id}`, direccionSubmit);
        const responseGet = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/direccion/${direccion.id}`);
        const updatedDireccion = responseGet.data.direccion;
        onUpdateDireccion(updatedDireccion);
      } else {
        
        let dataDireccion : any = {
          nombre,
          calle,
          numeroExterior,
          numeroInterior,
          referencia,
          guardada: true,
          distrito: "",
          ciudad: {
            id: ciudadId
          },
          usuario: {
            id: userId
          }
        };
        if(selectedLocation){
          const responseUbicacion = await axios.post(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/ubicacion`,{
            latitud: selectedLocation.lat.toString(),
            longitud: selectedLocation.lng.toString()
          });
          if(responseUbicacion.data.ubicacion){
            dataDireccion = {
              ...dataDireccion,
              ubicacion: {
                id: responseUbicacion.data.ubicacion.id
              }
            }
          }
        }
        console.log('Creating new address ',dataDireccion);
        const response = await axios.post(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/direccion`, dataDireccion);
        const createdDireccion = response.data.direccion;
        console.log('Created address:', createdDireccion);
        onCreatedDireccion(createdDireccion);
      }
    } catch (error) {
      console.error('Error occurred while submitting:', error);
      setErrorMessage('No se pudo guardar la dirección. Intente de nuevo más tarde.');
      setIsErrorPopupVisible(true);
    }
  };
  
  const handleNombreBlur = () => {
    if (nombre.trim() === '') {
      setErrorValidationNombre('El nombre no puede estar vacío');
    } else {
      if(countWords(nombre) > 250){
        setErrorValidationNombre('El nombre no puede superar los 250 palabras');
      }else{
        setErrorValidationNombre(null);
      }
    }
  }

  const handleCalleBlur = () => {
    if (calle.trim() === '') {
      setErrorValidationCalle('La calle no puede estar vacía');
    } else {
      if(countWords(calle) > 255){
        setErrorValidationCalle('La calle no puede superar las 255 palabras');
      }else{
        setErrorValidationCalle(null);
      }
    }
  }

  const numeroExteriorBlur = () => {
    if (numeroExterior.trim() === '') {
      setErrorValidationNumeroExterior('El número exterior no puede estar vacío');
    } else {
      if(countWords(numeroExterior) > 20){
        setErrorValidationNumeroExterior('El número exterior no puede superar las 20 palabras');
      }
      else {
        setErrorValidationNumeroExterior(null);
      }
    }
  }

  const numeroInteriorBlur = () => {
    if (numeroInterior.trim() === '') {
      setErrorValidationNumeroInterior('El número interior no puede estar vacío');
    } else {
      if(countWords(numeroInterior) > 20){
        setErrorValidationNumeroInterior('El número interior no puede superar las 20 palabras');
      }
      else {
        setErrorValidationNumeroInterior(null);
      }
    }
  }

  const handleReferenciaBlur = () => {
    if (referencia.trim() === '') {
      setErrorValidationReferencia('La referencia no puede estar vacía');
    } else {
      if(countWords(referencia) > 255){
        setErrorValidationReferencia('La referencia no puede superar las 255 palabras');
      }else{
        setErrorValidationReferencia(null);
      }
    }
  }

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
          label="Nombre de Dirección"
          value={nombre}
          onChange={(e) => setNombre(e.target.value)}
          required
          placeholder="Por ejemplo, Oficina"
          tooltip="Máximo 250 palabras"
          onBlur={handleNombreBlur}
        />
        {
          errorValidationNombre && <p className="text-red-500 mt-2">{errorValidationNombre}</p>
        }
        <InputWithLabel
          label="Calle"
          value={calle}
          onChange={(e) => setCalle(e.target.value)}
          required
          placeholder="Por ejemplo, Av. La Republica"
          tooltip="Máximo 255 palabras"
          onBlur={handleCalleBlur}
        />
        {
          errorValidationCalle && <p className="text-red-500 mt-2">{errorValidationCalle}</p>
        }
        <InputWithLabel
          label="Número Exterior"
          value={numeroExterior}
          onChange={(e) => setNumeroExterior(e.target.value)}
          tooltip="Máximo 20 palabras"
          onBlur={numeroExteriorBlur}
          maxLength={20}
          
        />
        {
          errorValidationNumeroExterior && <p className="text-red-500 mt-2">{errorValidationNumeroExterior}</p>
        }
        <InputWithLabel
          label="Número Interior"
          value={numeroInterior}
          onChange={(e) => setNumeroInterior(e.target.value)}
          tooltip="Máximo 20 palabras"
          onBlur={numeroInteriorBlur}
          maxLength={20}

        />
        {
          errorValidationNumeroInterior && <p className="text-red-500 mt-2">{errorValidationNumeroInterior}</p>
        }
        <InputWithLabel
          label="Referencia"
          value={referencia}
          onChange={(e) => setReferencia(e.target.value)}
          required
          placeholder="Cerca de la Av. Angamos con Av. Arequipa"
          tooltip="Máximo 255 palabras"
          onBlur={handleReferenciaBlur}
        />
        {
          errorValidationReferencia && <p className="text-red-500 mt-2">{errorValidationReferencia}</p>
        }
        <div>
          <label htmlFor="ciudad">Ciudad</label>
          {mandatoryCiudad ? (
            <div className="flex space-x-2">
                <Input
                  disabled={true}
                  value={mandatoryCiudadNombre}
                />
              </div>
          ) : (
            <><select
                id="ciudad"
                value={ciudadId}
                onChange={(e) => {
                  const selectedCiudadId = e.target.value;
                  const selectedCiudad = ciudades.find(ciudad => ciudad.id === selectedCiudadId);
                  setCiudadId(selectedCiudadId);
                  setCiudadNombre(selectedCiudad ? selectedCiudad.nombre : '');
                } }
                required
                className="block w-full mt-1 mb-4 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
                onInvalid={(e) => (e.target as HTMLSelectElement).setCustomValidity("Por favor, selecciona una ciudad")}
                onInput={(e) => (e.target as HTMLSelectElement).setCustomValidity("")}
              >
                <option value="">Seleccione una ciudad</option>
                {ciudades.map((ciudad) => (
                  <option key={ciudad.id} value={ciudad.id}>
                    {ciudad.nombre}
                  </option>
                ))}
              </select>
              
                </>
          )}
          <button
            type="button"
            className={`mt-4 px-4 py-2 border border-gray-300 rounded-md flex items-center gap-2 ${
              ciudadId !== '' ? 'bg-yellow-200' : 'bg-gray-200 cursor-not-allowed'
            }`}
            onClick={() => {
              setShowMapModal(true);
              setLocalError('');
            }}
            disabled={ciudadId === ''}
          >
            <img src="/images/mapa.png" alt="Mapa" className="h-8" />
            Selecciona en el mapa
          </button>
        </div>
        {/* Error Message Display */}
        {localError && (
          <p style={{ color: 'red', textAlign: 'center', marginBottom: '10px' }}>
            {localError}
          </p>
        )}
        <div style={{ display: 'flex', justifyContent: 'center', gap: '10px' }}>
          <button type="button" onClick={onClose} style={styles.cancelButton}>
            Cancelar
          </button>
          <button type="submit" style={styles.confirmButton}>
            {state === 'Crear' ? 'Crear Dirección' : 'Guardar Cambios'}
          </button>
          
        </div>
      </form>
      {/* Map modal */}
      {showMapModal && (
          <GoogleMapModal
            onSelectLocation={handleMapSelect}
            city={ciudadNombre}
            closeModal={() => setShowMapModal(false)}
            {...(selectedLocation && { location: selectedLocation })}
          />
        )}
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

