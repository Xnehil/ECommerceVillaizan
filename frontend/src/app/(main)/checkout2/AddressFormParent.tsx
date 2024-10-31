import { useSession } from 'next-auth/react';
import React, { useRef, useState } from 'react';
import { Button } from '@components/Button';

interface AddressFormParentProps {
    nombre: string;
    numeroDni: string;
    ciudad: string;
    telefono: string;
    calle: string; // Added prop
    numeroInterior: string; // Added prop
    referencia: string; // Added prop
    handleNombreChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleDniChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleTelefonoChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCiudadChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleCalleChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Added prop
    handleNroInteriorChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Added prop
    handleReferenciaChange: (e: React.ChangeEvent<HTMLInputElement>) => void; // Added prop
    handleClickMapa: () => void; // Added prop
    status: string;
    handleSubmitPadre: () => void;
    dniError?: string | null;
    locationError?: string | null;
    telefonoError?: string | null;
}

const AddressFormParent: React.FC<AddressFormParentProps> = ({
    nombre,
    numeroDni,
    ciudad,
    telefono,
    calle,
    numeroInterior,
    referencia,
    handleNombreChange,
    handleDniChange,
    handleTelefonoChange,
    handleCiudadChange,
    handleCalleChange,
    handleNroInteriorChange,
    handleReferenciaChange,
    handleClickMapa,
    status,
    handleSubmitPadre,
    dniError,
    locationError,
    telefonoError,
}) => {
    const { data: session } = useSession(); // Get session data
    const inputRef = useRef<HTMLInputElement>(null); // If you need this reference for some input
    const [dniValidationError, setDniValidationError] = useState<string | null>(null);
    const [telefonoValidationError, setTelefonoValidationError] = useState<string | null>(null);
    const [nombreValidationError, setNombreValidationError] = useState<string | null>(null);
    const [direccionValidationError, setDireccionValidationError] = useState<string | null>(null);
    const [referenciaValidationError, setReferenciaValidationError] = useState<string | null>(null);

    const handleDniBlur = () => {
        if (!numeroDni.trim()) {
            setDniValidationError("Por favor, complete el campo.");
        } else {
            setDniValidationError(null);
        }
    };

    const handleTelefonoBlur = () => {
        if (!telefono.trim()) {
            setTelefonoValidationError("Por favor, complete el campo.");
        } else {
            setTelefonoValidationError(null);
        }
    }

    const handleNombreBlur = () => {
        if (!nombre.trim()) {
            setNombreValidationError("Por favor, complete el campo.");
        } else {
            setNombreValidationError(null);
        }
    }

    const handleDireccionBlur = () => {
        if (!calle.trim()) {
            setDireccionValidationError("Por favor, complete el campo.");
        } else {
            setDireccionValidationError(null);
        }
    }

    const handleReferenciaBlur = () => {
        if (!referencia.trim()) {
            setReferenciaValidationError("Por favor, complete el campo.");
        } else {
            setReferenciaValidationError(null);
        }
    }

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
                        onBlur={handleNombreBlur}
                    />
                    {(nombreValidationError) && (
                        <p className="text-red-500 mt-2">{nombreValidationError}</p>
                    )}
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
                        onBlur={handleDniBlur}
                        className="mt-1 block w-full p-2 border rounded-md"
                        placeholder="12345678"
                    />
                    {(dniError || dniValidationError) && (
                        <p className="text-red-500 mt-2">{dniError || dniValidationError}</p>
                    )}
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
                        onBlur={handleTelefonoBlur}
                    />
                    {(telefonoError || telefonoValidationError) && (
                        <p className="text-red-500 mt-2">{telefonoError || telefonoValidationError}</p>
                    )}
                </div>
            </div>

            <div className="flex items-center gap-3">
                <img src="/images/casa.png" alt="Ciudad" className="h-14" />
                <div className="w-full">
                    <label
                        htmlFor="ciudad"
                        className="block text-lg font-medium text-gray-700"
                    >
                        Ciudad <span className="text-red-500">*</span>
                    </label>
                    {locationError && <p className="text-red-500">{locationError}</p>}
                    <div className="flex gap-3">
                        <input
                            type="text"
                            id="ciudad"
                            value={ciudad}
                            onChange={handleCiudadChange}
                            className="mt-1 block w-full p-2 border rounded-md"
                            placeholder="Lima"
                            disabled={true}
                        />
                        {!session?.user?.id && (
                            <button
                                type="button"
                                className="px-4 py-2 bg-yellow-200 border border-gray-300 rounded-md flex items-center gap-2"
                                onClick={handleClickMapa}
                            >
                                <img src="/images/mapa.png" alt="Mapa" className="h-8" />
                                Selecciona en el mapa
                            </button>
                        )}
                    </div>
                </div>
            </div>

            {/* Conditional button to select location on map */}
            {!session?.user?.id && (
                <>
                    <div className="flex items-center gap-3">
                        <div className="w-full grid grid-cols-2 gap-2">
                            <div>
                                <label htmlFor="direccion" className="block text-lg font-medium text-gray-700">
                                    Dirección <span className="text-red-500">*</span>
                                </label>
                                <input
                                    type="text"
                                    id="direccion"
                                    value={calle}
                                    onChange={handleCalleChange}
                                    className="mt-1 block w-full p-2 border rounded-md"
                                    placeholder="Calle Malvinas 123"
                                    ref={inputRef}
                                    onBlur={handleDireccionBlur}
                                    />
                                  {(locationError || direccionValidationError) && (
                                      <p className="text-red-500 mt-2">{locationError || direccionValidationError}</p>
                                  )}
                            </div>
                            <div>
                                <label htmlFor="numero" className="block text-lg font-medium text-gray-700">
                                    Número interior
                                </label>
                                <input
                                    type="text"
                                    id="numero"
                                    value={numeroInterior}
                                    onChange={handleNroInteriorChange}
                                    className="mt-1 block w-full p-2 border rounded-md"
                                    placeholder="No rellenar si no aplica" />
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <img src="/images/referencia.png" alt="Referencia" className="h-14" />
                        <div className="w-full">
                            <label htmlFor="referencia" className="block text-lg font-medium text-gray-700">
                                Referencia <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                id="referencia"
                                value={referencia}
                                onChange={handleReferenciaChange}
                                className="mt-1 block w-full p-2 border rounded-md"
                                placeholder="Esquina del parque Tres Marías"
                                onBlur={handleReferenciaBlur}
                                />
                              {(referenciaValidationError) && (
                                  <p className="text-red-500 mt-2">{referenciaValidationError}</p>)}
                        </div>
                    </div>
                </>
            )}

            {status === "loading" ? (
                <Button isLoading loaderClassname="w-6 h-6" variant="ghost"></Button>
            ) : null}
        </form>
    );
};

export default AddressFormParent;
