"use client";

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import InputWithLabel from "@components/inputWithLabel";
import { Direccion } from 'types/PaqueteEnvio';
import AddressCard from './AddressCard'; // Import the new component
import AddAddressButton from './AddressButton';
import AddressModal from './AddressModal'; // Import the Modal component
import AddressForm from './AddressForm'; // Import the AddressForm component

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

  useEffect(() => {
    async function fetchUserName() {
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
          } else {
            console.error('Failed to fetch user name');
          }

          const addressResponse = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/direccion/usuario/${session.user.id}?guardada=true`);
          setDirecciones(addressResponse.data.direcciones);

        } catch (error) {
          console.error('Error fetching user name:', error);
        }
      } else {
        router.push('/');
      }
    }

    fetchUserName();
  }, [session]);

  if (!session?.user?.id) {
    return null; // Return null while redirecting
  }

  const handleEdit = (direccion: Direccion) => {
    setCurrentDireccion(direccion);
    setModalState('Editar');
    setIsModalOpen(true);
  };

  const handleDelete = (direccion: Direccion) => {
    // Handle delete logic here
    console.log('Delete:', direccion);
  };

  const handleAddAddress = () => {
    setCurrentDireccion(null);
    setModalState('Crear');
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  return (
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
        <AddressForm state={modalState} />
      </AddressModal>
    </div>
  );
};

export default Cuenta;