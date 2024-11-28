"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Direccion } from "types/PaqueteEnvio";
import AddressCard from '../../../components/address/AddressCard';
import AddAddressButton from '../../../components/address/AddressButton';
import AddressModal from '../../../components/address/AddressModal';
import EliminationPopUp from '@components/address/EliminationPopUp';
import AddressForm from '@components/address/AddressForm';
import { Button } from "@components/Button";

interface LoggedInAddressesProps {
  userId: string;
  ciudadId: string;
  ciudadNombre: string;
  toggleAllowed: boolean;
  onToggleAddress: (addressId: string | null) => void;
  selectedAddressIdPassed: string | null;
}

const encryptionKey = process.env.NEXT_PUBLIC_ENCRYPTION_KEY || "default_key";
// Function to decrypt data
const decryptData = (data: string | null): string | null => {
  if (data) {
      try {
          return CryptoJS.AES.decrypt(data, encryptionKey).toString(CryptoJS.enc.Utf8);
      } catch (error) {
          console.error("Decryption failed:", error);
          return null;
      }
  }
  return null;
};

const LoggedInAddresses: React.FC<LoggedInAddressesProps> = ({ userId, ciudadId, ciudadNombre, toggleAllowed, onToggleAddress,selectedAddressIdPassed }) => {

  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'Crear' | 'Editar'>('Crear');
  const [currentAddress, setCurrentAddress] = useState<Direccion | null>(null);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Direccion | null>(null);
  const [direcciones, setDirecciones] = useState<Direccion[]>([]);
  const [userIdInternal, setUserIdInternal] = useState('');
  const [ciudadNombreInternal, setCiudadNombreInternal] = useState('');
  const [ciudadIdInternal, setCiudadIdInternal] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [loading, setLoading] = useState(true);



  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        setUserIdInternal(userId);
        setLoading(true);
        const response = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/direccion/usuario/${userId}?guardada=true`);
        if (ciudadNombre) {
          const filteredAddresses = response.data.direcciones.filter((address: Direccion) => address.ciudad && address.ciudad.nombre === ciudadNombre);
          setDirecciones(filteredAddresses);
          setCiudadNombreInternal(ciudadNombre);
          setCiudadIdInternal(ciudadId);
          if(selectedAddressIdPassed){
            setSelectedAddressId(selectedAddressIdPassed);
          }
          // Validate savedAddressId
          /*
          console.log("Validating savedAddressId");
          const savedAddressId = decryptData(localStorage.getItem("selectedAddressId"));
          console.log("Saved address ID:", savedAddressId);
          if (savedAddressId && filteredAddresses.some((address : Direccion) => address.id === savedAddressId)) {
            console.log("Setting selected address ID:", savedAddressId);
            setSelectedAddressId(savedAddressId);
          } else {
            console.log("Removing saved address ID");
            localStorage.removeItem("selectedAddressId");
          }
            */
        }
      } catch (error) {
        setErrorMessage('Error al cargar las direcciones. Intente de nuevo más tarde.');
        setIsErrorPopupVisible(true);
        console.error("Error fetching addresses:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchAddresses();
  }, [userId, ciudadNombre, ciudadId]);

  /*
  useEffect(() => {
    if (selectedAddressIdPassed) {
      setSelectedAddressId(selectedAddressIdPassed)
    }
  }, [selectedAddressIdPassed])*/

  const handleEdit = (address: Direccion) => {
    setCurrentAddress(address);
    setModalState('Editar');
    setIsModalOpen(true);
  };

  const handleDelete = (address: Direccion) => {
    setAddressToDelete(address);
    setIsPopUpOpen(true);
  };

  const confirmDelete = async () => {
    if (addressToDelete) {
      try {
        const response = await axios.delete(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/direccion/${addressToDelete.id}`);
        if (response.status === 200) {
          setDirecciones(direcciones.filter((dir) => dir.id !== addressToDelete.id));
        } else {
          console.error('Failed to delete:', response.statusText);
          setErrorMessage('Error al eliminar la dirección. Intente de nuevo más tarde.');
          setIsErrorPopupVisible(true);
        }
      } catch (error) {
        setErrorMessage('Error al eliminar la dirección. Intente de nuevo más tarde.');
        setIsErrorPopupVisible(true);
        console.error('An error occurred during deletion:', error);
      } finally {
        setIsPopUpOpen(false);
        setAddressToDelete(null);
      }
    }
  };

  const handleAddAddress = () => {
    setCurrentAddress(null);
    setModalState('Crear');
    setIsModalOpen(true);
  };

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

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleToggleAddress = (addressId: string) => {
    const newSelectedAddressId = selectedAddressId === addressId ? null : addressId;
    setSelectedAddressId(newSelectedAddressId);
    onToggleAddress(newSelectedAddressId);
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
                window.location.reload();
              }}
            >
              Volver
            </button>
          </div>
        </div>
      )}
      <div>
      <h2 className="block text-lg font-medium text-gray-700">
          Direcciones Guardadas en {ciudadNombre} <span className="text-red-500">*</span>
      </h2>
        {loading ? (
        <Button isLoading loaderClassname="w-6 h-6" variant="ghost"></Button> // Show loading button
        ) :
        (direcciones.length > 0 ? (
          <div style={{ maxHeight: '180px', overflowY: 'auto' }}>
            {direcciones.map((direccion, index) => (
              <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
                {toggleAllowed && (
                  <div
                    onClick={() => handleToggleAddress(direccion.id)}
                    style={{
                      width: '20px',
                      height: '20px',
                      borderRadius: '50%',
                      border: '1px solid black',
                      backgroundColor: selectedAddressId === direccion.id ? 'black' : 'white',
                      cursor: 'pointer',
                      marginRight: '10px',
                    }}
                  />
                )}
                <AddressCard
                  direccion={direccion}
                  onEdit={() => handleEdit(direccion)}
                  onDelete={() => handleDelete(direccion)}
                  showBorder={false}
                  size="large"
                />
              </div>
            ))}
          </div>
        ) : (
          <p style={{ margin: '20px 0' }}>No asociaste ninguna dirección a tu cuenta</p>
        ))}
        <AddAddressButton onClick={handleAddAddress} />
        <AddressModal isOpen={isModalOpen} onClose={handleCloseModal}>
          <AddressForm
            state={modalState}
            direccion={currentAddress}
            onUpdateDireccion={handleUpdateDireccion}
            onCreatedDireccion={handleCreateDireccion}
            userId={userIdInternal}
            onClose={handleCloseModal}
            mandatoryCiudad={true}
            mandatoryCiudadId = {ciudadIdInternal}
            mandatoryCiudadNombre={ciudadNombreInternal}
          />
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

export default LoggedInAddresses;