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

const Cuenta = () => {
  const { data: session, status } = useSession();
  const [userNombre, setUserNombre] = useState('');
  const [userApellido, setUserApellido] = useState('');
  const [userCorreo, setUserCorreo] = useState('');
  const [userTelefono, setUserTelefono] = useState('');
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

  useEffect(() => {
    async function fetchUserName() {
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
                setUserTelefono(user.numerotelefono);
                setUserId(user.id);
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
                window.location.href = "/";
              }}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      )}
      <div style={{ display: 'flex' }}>
        <div style={{ flex: 1, padding: '20px' }}>
          <h2>Datos generales</h2>
          <InputWithLabel label="Nombre" value={userNombre} disabled={true} />
          <InputWithLabel label="Apellido" value={userApellido} disabled={true} />
          <InputWithLabel label="Correo" value={userCorreo} disabled={true} />
          <InputWithLabel label="Número de Teléfono" value={userTelefono} disabled={true} />
        </div>
        <div style={{ flex: 1, padding: '20px' }}>
          <h2>Direcciones Guardadas</h2>
          {direcciones.length > 0 ? (
            <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
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
            <p>No asociaste ninguna dirección a tu cuenta</p>
          )}
          <div style={{ marginLeft: '350px' }}>
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
  }
};


export default Cuenta;