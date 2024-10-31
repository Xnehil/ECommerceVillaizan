import { Pedido } from "types/PaquetePedido"
import { enrichLineItems, getOrSetCart } from "@modules/cart/actions"
import React, { useEffect, useRef, useState } from "react"
import Summary2 from "@modules/cart/templates/summary2"
import axios from "axios"
import { getCityCookie } from "@modules/store/actions"
import GoogleMapModal from "@components/GoogleMapsModal"
import { set } from "lodash"
import { useRouter } from 'next/navigation';

import { useSession } from 'next-auth/react';

import LoggedInAddresses from "./LoggedInAddresses";
import { Button } from "@components/Button"

interface AddressFormParentProps {
  nombre: string;
  numeroDni: string;
  ciudad: string;
  telefono: string;
  handleNombreChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleDniChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleTelefonoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  status: string;
  handleSubmitPadre: () => void;
  dniError?: string | null;
  locationError?: string | null;
  telefonoError?: string | null;
}

const AddressFormParent: React.FC<AddressFormParentProps> = ({ nombre, numeroDni, ciudad, telefono, handleNombreChange, handleDniChange, handleTelefonoChange, status, handleSubmitPadre, dniError, locationError, telefonoError }) => {
    return (
      <form
        className="grid grid-cols-1 gap-6 lg:col-span-2"
        onSubmit={(e) => {
          e.preventDefault();
          handleSubmitPadre();
        }}
      >
        {/* Form fields */}
        <div className="flex items-center gap-3">
          <img src="/images/servicio-al-cliente.png" alt="Nombre completo" className="h-14" />
          <div className="w-full">
            <label htmlFor="nombre" className="block text-lg font-medium text-gray-700">
              Nombre <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="nombre"
              value={nombre}
              onChange={handleNombreChange}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="Juan Perez"
            />
          </div>
        </div>
  
        <div className="flex items-center gap-3">
          <div className="w-full">
            <label htmlFor="dni" className="block text-lg font-medium text-gray-700">
              DNI <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="dni"
              value={numeroDni}
              onChange={handleDniChange}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="12345678"
            />
            {dniError && <p className="text-red-500 mt-2">{dniError}</p>}
          </div>
        </div>
  
        <div className="flex items-center gap-3">
          <img src="/images/casa.png" alt="Ciudad" className="h-14" />
          <div className="w-full">
            <label htmlFor="ciudad" className="block text-lg font-medium text-gray-700">
              Ciudad <span className="text-red-500">*</span>
            </label>
            {locationError && <p className="text-red-500">{locationError}</p>}
            <input
              type="text"
              id="ciudad"
              value={ciudad}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="Lima"
              disabled={true}
            />
          </div>
        </div>
  
        <div className="flex items-center gap-3">
          <img src="/images/telefono.png" alt="Teléfono" className="h-14" />
          <div className="w-full">
            <label htmlFor="telefono" className="block text-lg font-medium text-gray-700">
              Teléfono <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="telefono"
              value={telefono}
              className="mt-1 block w-full p-2 border rounded-md"
              placeholder="987654321"
              onChange={handleTelefonoChange}
            />
            {telefonoError && <p className="text-red-500 mt-2">{telefonoError}</p>}
          </div>
        </div>
  
        {status === "loading" ? (
          <Button isLoading loaderClassname="w-6 h-6" variant="ghost"></Button>
        ) : (
          <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Submit
          </button>
        )}
      </form>
    );
  };

  export default AddressFormParent;