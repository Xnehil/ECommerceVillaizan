"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import InputWithLabel from "@components/inputWithLabel";
import { Direccion } from 'types/PaqueteEnvio';
import AddressCard from '../../../components/address/AddressCard'; // Import the new component
import AddAddressButton from '../../../components/address/AddressButton';
import AddressModal from '../../../components/address/AddressModal'; // Import the Modal component
import AddressForm from '../../../components/address/AddressForm'; // Import the AddressForm component
import EliminationPopUp from '../../../components/address/EliminationPopUp'; // Import the EliminationPopUp component
import { Button } from '@components/Button';
import { Skeleton } from '@components/ui/skeleton';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@components/ui/alert-dialog';

const Cuenta = () => {
  const { data: session, status } = useSession();
  const [userNombre, setUserNombre] = useState('');
  const [userApellido, setUserApellido] = useState('');
  const [userCorreo, setUserCorreo] = useState('');
  const [userTelefono, setUserTelefono] = useState('');
  const [userPuntosAcumulados, setUserPuntosAcumulados] = useState('');
  const router = useRouter();
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'Crear' | 'Editar'>('Crear');
  const [currentDireccion, setCurrentDireccion] = useState<Direccion | null>(null);
  const [userId, setUserId] = useState('');
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [direccionToDelete, setDireccionToDelete] = useState<Direccion | null>(null);
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [loadingInternal, setLoadingInternal] = useState(true);
  const headerStyle: React.CSSProperties = {
    fontSize: '1.2rem',
    fontWeight: 'bold',
    color: '#333',
    textAlign: 'left',
    margin: '20px 0',
    borderBottom: '2px solid #ccc',
    paddingBottom: '10px'
  };

  const [isLoading, setIsLoading] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [isPopupDataVisible, setIsPopupDataVisible] = useState(false);
  const [originalNombre, setOriginalNombre] = useState('');
  const [originalApellido, setOriginalApellido] = useState('');
  const [originalNumeroTelefono, setOriginalNumeroTelefono] = useState('');
  const [validationErrorNombre, setValidationErrorNombre] = useState<  string | null>(null)
  const [validationErrorApellido, setValidationErrorApellido] = useState<  string | null>(null)
  const [validationErrorNumeroTelefono, setValidationErrorNumeroTelefono] = useState<  string | null>(null)

  useEffect(() => {
    async function fetchUserName() {
      setLoadingInternal(true);
      if(status !== "loading"){
        if (session?.user?.id) {
            try {
              const response = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/usuario/${session.user.id}`);
              console.log("response", response);
              const user = response.data.usuario;
              if (user) {
                setUserNombre(user.nombre);
                setUserApellido(user.apellido);
                setUserCorreo(user.correo);
                setUserTelefono(user.numeroTelefono);
                setUserId(user.id);
                setUserPuntosAcumulados(user.puntosAcumulados ? user.puntosAcumulados.toString() : '');
                console.log("puntos", user.puntosAcumulados);
              } else {
                console.error('Failed to fetch user name');
                setErrorMessage('Error al cargar los datos de usuario. Intente de nuevo más tarde.');
                setIsErrorPopupVisible(true);
              }
    
              const addressResponse = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/direccion/usuario/${session.user.id}?guardada=true`);
              setDirecciones(addressResponse.data.direcciones);
    
            } catch (error) {
              console.error('Error fetching user name:', error);
              setErrorMessage('Error al cargar los datos de usuario. Intente de nuevo más tarde.');
              setIsErrorPopupVisible(true);
            }
            finally {
              setLoadingInternal(false);
            }
        } else {
          router.push('/');
        }
      }
      
    }

    fetchUserName();
  }, [status,session]);

  const handleUpdateDireccion = (updatedDireccion: Direccion) => {
    setDirecciones((prevDirecciones) =>
      prevDirecciones.map((dir) => (dir.id === updatedDireccion.id ? updatedDireccion : dir))
    );
    setIsModalOpen(false);
  };

  const handleCreateDireccion = (newDireccion: Direccion) => {
    setDirecciones((prevDirecciones) => [...prevDirecciones, newDireccion]);
    setIsModalOpen(false);
  }

  const handleEdit = (direccion: Direccion) => {
    setCurrentDireccion(direccion);
    setModalState('Editar');
    setIsModalOpen(true);
  };

  const handleDelete = (direccion: Direccion) => {
    setDireccionToDelete(direccion);
    setIsPopUpOpen(true);
  };

  const confirmDelete = async () => {
    if (direccionToDelete) {
      try {
        const response = await axios.delete(
          `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/direccion/${direccionToDelete.id}`
        );
    
        if (response.status === 200) {
          setDirecciones(direcciones.filter((dir) => dir.id !== direccionToDelete.id));
        } else {
          console.error('Failed to delete:', response.statusText);
          setErrorMessage('Error al eliminar la dirección. Intente de nuevo más tarde.');
          setIsErrorPopupVisible(true);
        }
      } catch (error) {
        console.error('An error occurred during deletion:', error);
        setErrorMessage('Error al eliminar la dirección. Intente de nuevo más tarde.');
        setIsErrorPopupVisible(true);
      } finally {
        setIsPopUpOpen(false);
        setDireccionToDelete(null);
      }
    }
  };

  const onClose = () => {
    setIsModalOpen(false);
  }
  

  const handleAddAddress = () => {
    setCurrentDireccion(null);
    setModalState('Crear');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };


  //const handleEditData = () => setIsEditing(true);

  const handleEditData = () => {
    setOriginalNombre(userNombre);
    setOriginalApellido(userApellido);
    setOriginalNumeroTelefono(userTelefono);

    setIsEditing(true);
  };

  const handleCancelData = () => {
    setIsEditing(false);
    setIsDialogOpen(false);
  };

  
  interface HandleInputChangeData {
    (setter: React.Dispatch<React.SetStateAction<string>>): (e: React.ChangeEvent<HTMLInputElement>) => void;
  }

  const handleInputChangeData: HandleInputChangeData = (setter) => (e) => setter(e.target.value);

  const handleNombreBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.length > 100) {
      setValidationErrorNombre('El nombre no puede exceder los 100 caracteres.');
    }
    else{
      setValidationErrorNombre(null);
    }
  }

  const handleApellidoBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.length > 100) {
      setValidationErrorApellido('El apellido no puede exceder los 100 caracteres.');
    }
    else{
      setValidationErrorApellido(null);
    }
  }

  const handleTelefonoBlur = (e: React.FocusEvent<HTMLInputElement>) => {
    if (e.target.value.length !== 9) {
      setValidationErrorNumeroTelefono('El número de teléfono tiene que tener 9 dígitos.');
    }
    else{
      setValidationErrorNumeroTelefono(null);
    }
  }

  const handleSaveData = async () => {
    if (validationErrorNombre || validationErrorApellido || validationErrorNumeroTelefono) {
      return;
    }
    try {
      const response = await axios.put(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/usuario/${userId}`, {
        nombre: userNombre,
        apellido: userApellido,
        numeroTelefono: userTelefono
      });
      if (response.status === 200) {
        setIsPopupDataVisible(false);
        setIsEditing(false);
        //refresh the page
        window.location.reload();
      } else {
        console.error('Failed to save user data:', response.statusText);
        setErrorMessage('Error al guardar los datos de usuario. Intente de nuevo más tarde.');
        setIsErrorPopupVisible(true);
      }
    } catch (error) {
      console.error('An error occurred during saving:', error);
      setErrorMessage('Error al guardar los datos de usuario. Intente de nuevo más tarde.');
      setIsErrorPopupVisible(true);
    } finally {
      setIsPopupDataVisible(false);
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
                window.location.href = "/";
              }}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      )}
      <div style={{ display: 'flex' }}>
        {/* User data */}
        <div style={{ flex: 1, padding: '20px', marginBottom: '200px', marginLeft: '320px' }}>
          <h2 style={headerStyle}>Datos generales</h2>
          {isLoading ? (
            <div className="flex flex-col space-y-4">
              {/* Add Skeleton components here as placeholders */}
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ) : (
            <div className="w-4/5 space-y-4">
              <div className="flex space-x-2">
                <InputWithLabel
                  label="Nombre"
                  value={userNombre}
                  disabled={!isEditing}
                  onChange={handleInputChangeData(setUserNombre)}
                  tooltip = "Máximo 100 caracteres"
                  onBlur = {handleNombreBlur}
                />
              </div>
              {validationErrorNombre && (
                  <p className="text-red-500 mt-2">{validationErrorNombre}</p>
                )}
              <div className="flex space-x-2">
                <InputWithLabel
                  label="Apellido"
                  value={userApellido}
                  disabled={!isEditing}
                  onChange={handleInputChangeData(setUserApellido)}
                  tooltip = "Máximo 100 caracteres"
                  onBlur = {handleApellidoBlur}
                />
              </div>
              {validationErrorApellido && (
                  <p className="text-red-500 mt-2">{validationErrorApellido}</p>)
              }
              <div className="flex space-x-2">
                <InputWithLabel
                  label="Correo"
                  value={userCorreo}
                  disabled={true}
                  onChange={handleInputChangeData(setUserCorreo)}
                />
              </div>
              <div className="flex space-x-2">
                <InputWithLabel
                  label="Número de Teléfono"
                  value={userTelefono}
                  disabled={!isEditing}
                  onChange={handleInputChangeData(setUserTelefono)}
                  tooltip = "Máximo 9 dígitos"
                  onBlur = {handleTelefonoBlur}
                  type = "number"
                />
              </div>
              {
                validationErrorNumeroTelefono && (
                  <p className="text-red-500 mt-2">{validationErrorNumeroTelefono}</p>
                )
              }
              <div className="flex space-x-2">
                <InputWithLabel
                  label="Puntos Canjeables Acumulados"
                  value={userPuntosAcumulados}
                  disabled={true}
                  onChange={handleInputChangeData(setUserPuntosAcumulados)}
                />
              </div>

              <div className="lower-buttons-container mt-8">
                {isEditing ? (
                  <>
                    {/* Cancel Button */}
                    <Button
                      variant="secondary"
                      onClick={() => {
                        handleCancelData();
                        setUserNombre(originalNombre);
                        setUserApellido(originalApellido);
                        setUserTelefono(originalNumeroTelefono);
                        setValidationErrorNombre(null);
                        setValidationErrorApellido(null);
                        setValidationErrorNumeroTelefono(null);
                      }}
                    >
                      Cancelar
                    </Button>

                    {/* Save Button */}
                    <Button
                      variant="default"
                      onClick={() => {
                        setIsPopupDataVisible(true); // Show popup
                      }}
                      style={{ marginLeft: '10px' }}
                    >
                      Guardar
                    </Button>
                  </>
                ) : (
                  <Button variant="default" onClick={handleEditData}>
                    Editar
                  </Button>
                )}
              </div>
            </div>
          )}

          {/* Popup */}
          {isPopupDataVisible && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
              <div className="bg-white p-6 rounded-md shadow-md text-center">
                <p className="text-black-600 mb-4">
                  ¿Estás seguro de guardar los cambios?
                </p>
                <div className="flex space-x-2 justify-center">
                  <button
                    style={styles.cancelButton}
                    onClick={() => {
                      setIsPopupDataVisible(false); // Close the popup
                    }}
                  >
                    Cancelar
                  </button>
                  <button
                    style={styles.confirmButton}
                    onClick={handleSaveData} // Trigger your cancel action
                  >
                    Confirmar
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        {/* Addresses */}
        <div style={{ flex: 1, padding: '20px', marginRight: '320px' }}>
          <h2 style={headerStyle}>Direcciones Guardadas</h2>
          {loadingInternal ? (
          <Button isLoading loaderClassname="w-6 h-6" variant="ghost"></Button> // Show loading button
          ) :
          (direcciones.length > 0 ? (
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {direcciones.map((direccion, index) => (
                <AddressCard
                  key={index}
                  direccion={direccion}
                  onEdit={() => handleEdit(direccion)}
                  onDelete={() => handleDelete(direccion)}
                  showBorder={true}
                  size="medium"
                />
              ))}
            </div>
          ) : (
            <p style={{ margin: '20px 0' }}>No asociaste ninguna dirección a tu cuenta</p>
          ))}
          <div style={{ marginLeft: '180px' }}>
            <AddAddressButton onClick={handleAddAddress} />
          </div>
        </div>
        <AddressModal isOpen={isModalOpen} onClose={handleCloseModal}>
          <AddressForm state={modalState} direccion={currentDireccion}  onUpdateDireccion={handleUpdateDireccion} onCreatedDireccion={handleCreateDireccion} userId={userId} onClose={onClose} mandatoryCiudad={false} mandatoryCiudadId='' mandatoryCiudadNombre=''/>
        </AddressModal>
        <EliminationPopUp
          isOpen={isPopUpOpen}
          onConfirm={confirmDelete}
          onClose={() => setIsPopUpOpen(false)}
        />
      </div>
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


export default Cuenta;