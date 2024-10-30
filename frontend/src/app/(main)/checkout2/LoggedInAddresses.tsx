"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Direccion } from "types/PaqueteEnvio";
import AddressCard from '../../../components/address/AddressCard';
import AddAddressButton from '../../../components/address/AddressButton';
import AddressModal from '../../../components/address/AddressModal';
import EliminationPopUp from '@components/address/EliminationPopUp';
import AddressForm from '@components/address/AddressForm';

interface LoggedInAddressesProps {
  userId: string;
  ciudad: string;
  toggleAllowed: boolean;
  onToggleAddress: (addressId: string | null) => void;
}

const LoggedInAddresses: React.FC<LoggedInAddressesProps> = ({ userId, ciudad, toggleAllowed, onToggleAddress }) => {
  const [addresses, setAddresses] = useState<Direccion[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalState, setModalState] = useState<'Crear' | 'Editar'>('Crear');
  const [currentAddress, setCurrentAddress] = useState<Direccion | null>(null);
  const [isPopUpOpen, setIsPopUpOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<Direccion | null>(null);

  useEffect(() => {
    const fetchAddresses = async () => {
      try {
        const response = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/direccion/usuario/${userId}?guardada=true`);
        if (ciudad) {
          const filteredAddresses = response.data.direcciones.filter((address: Direccion) => address.ciudad && address.ciudad.nombre === ciudad);
          setAddresses(filteredAddresses);
        } else {
          setAddresses(response.data.direcciones);
        }
      } catch (error) {
        console.error("Error fetching addresses:", error);
      }
    };

    fetchAddresses();
  }, [userId, ciudad]);

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
          setAddresses(addresses.filter((addr) => addr.id !== addressToDelete.id));
        } else {
          console.error('Failed to delete:', response.statusText);
        }
      } catch (error) {
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

  const handleUpdateAddress = (updatedAddress: Direccion) => {
    setAddresses((prevAddresses) =>
      prevAddresses.map((addr) => (addr.id === updatedAddress.id ? updatedAddress : addr))
    );
    setIsModalOpen(false);
  };

  const handleCreateAddress = (newAddress: Direccion) => {
    setAddresses((prevAddresses) => [...prevAddresses, newAddress]);
    setIsModalOpen(false);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleToggleAddress = (addressId: string) => {
    const newSelectedAddressId = selectedAddressId === addressId ? null : addressId;
    setSelectedAddressId(newSelectedAddressId);
    onToggleAddress(newSelectedAddressId);
  };

  return (
    <div>
      <h2>Direcciones Guardadas</h2>
      {addresses.length > 0 ? (
        <div style={{ maxHeight: '200px', overflowY: 'auto' }}>
          {addresses.map((address, index) => (
            <div key={index} style={{ display: 'flex', alignItems: 'center' }}>
              {toggleAllowed && (
                <div
                  onClick={() => handleToggleAddress(address.id)}
                  style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '50%',
                    border: '1px solid black',
                    backgroundColor: selectedAddressId === address.id ? 'black' : 'white',
                    cursor: 'pointer',
                    marginRight: '10px',
                  }}
                />
              )}
              <AddressCard
                direccion={address}
                onEdit={() => handleEdit(address)}
                onDelete={() => handleDelete(address)}
                showBorder={false}
                size="large"
              />
            </div>
          ))}
        </div>
      ) : (
        <p>No asociaste ninguna dirección a tu cuenta</p>
      )}
      <AddAddressButton onClick={handleAddAddress} />
      <AddressModal isOpen={isModalOpen} onClose={handleCloseModal}>
        <AddressForm
          state={modalState}
          direccion={currentAddress}
          onUpdateDireccion={handleUpdateAddress}
          onCreatedDireccion={handleCreateAddress}
          userId={userId}
          onClose={handleCloseModal}
          mandatoryCiudad={true}
          mandatoryCiudadNombre={ciudad}
        />
      </AddressModal>
      <EliminationPopUp
        isOpen={isPopUpOpen}
        onConfirm={confirmDelete}
        onClose={() => setIsPopUpOpen(false)}
      />
    </div>
  );
};

export default LoggedInAddresses;