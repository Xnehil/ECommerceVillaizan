import { Pedido } from "types/PaquetePedido";
import { enrichLineItems, getOrSetCart } from "@modules/cart/actions";
import React, { useEffect, useState } from 'react';
import Summary2 from "@modules/cart/templates/summary2";
import axios from 'axios';

interface StepDireccionProps {
  setStep: (step: string) => void;
}

const StepDireccion: React.FC<StepDireccionProps> = ({ setStep }) => {
  const [carritoState, setCarritoState] = useState<Pedido | null>(null);
  const [calle, setCalle] = useState("");
  const [numeroExterior, setNumeroExterior] = useState("");
  const [numeroInterior, setNumeroInterior] = useState("");
  const [ciudad, setCiudad] = useState("");
  const [referencia, setReferencia] = useState("");
  const [distrito, setDistrito] = useState("");

  const fetchCart = async () => {
    try {
      const respuesta = await getOrSetCart();
      let cart: Pedido = respuesta?.cart;
  
      if (!cart) {
        console.error('No se obtuvo un carrito válido.');
        return;
      }
  
      const enrichedItems = await enrichLineItems(cart.detalles);
      cart.detalles = enrichedItems;
  
      setCarritoState(cart);
    } catch (error) {
      console.error('Error al obtener el carrito:', error);
    }
  };

  const handleSubmit = async () => {
    const data = {
      calle,
      numeroExterior,
      numeroInterior,
      distrito,
      codigoPostal: null,
      referencia,
      ciudad: {
        value: ciudad,
      },
      ubicacion: {
        latitud: "null",
        longitud: "null",
        direcciones: [
          { value: "null" },
          { value: "null" },
        ],
      },
    };

    try {
      const response = await axios.post('http://localhost:9000/admin/direccion', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      console.log('Respuesta del servidor:', response.data);
      setStep("pago"); // Avanzar al siguiente paso si es exitoso
    } catch (error) {
      console.error('Error al enviar la dirección:', error);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);


  return (
    <div className="content-container mx-auto py-8">
      <button className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800" onClick={() => setStep('previous')}>
        <img src="/images/back.png" alt="Volver" className="h-8" /> Volver
      </button>

      <h1 className="text-3xl font-bold mb-6">Coloca tus Datos</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de datos personales (ocupa 2 columnas) */}
        <form className="grid grid-cols-1 gap-6 lg:col-span-2" onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
          {/* Nombre completo con ícono */}
          <div className="flex items-center gap-3">
            <img src="/images/servicio-al-cliente.png" alt="Nombre completo" className="h-14" />
            <div className="w-full">
              <label htmlFor="nombre" className="block text-lg font-medium text-gray-700">
                Nombre Completo <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="nombre"
                className="mt-1 block w-full p-2 border rounded-md"
                placeholder="Juan Perez"
              />
            </div>
          </div>

          {/* DNI/RUC */}
          <div className="flex items-center gap-3">
            <div className="w-full">
              <label htmlFor="dni" className="block text-lg font-medium text-gray-700">
                DNI/RUC <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="dni"
                className="mt-1 block w-full p-2 border rounded-md"
                placeholder="12345678"
              />
            </div>
          </div>

         {/* Ciudad con ícono */}
          <div className="flex items-center gap-3">
            <img src="/images/casa.png" alt="Ciudad" className="h-14" />
            <div className="w-full">
              <label htmlFor="ciudad" className="block text-lg font-medium text-gray-700">
                Ciudad <span className="text-red-500">*</span>
              </label>
              <div className="flex gap-3">
                <input
                  type="text"
                  id="ciudad"
                  value={ciudad}
                  onChange={(e) => setCiudad(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md"
                  placeholder="Lima"
                />
                <button className="px-4 py-2 bg-yellow-200 border border-gray-300 rounded-md flex items-center gap-2">
                  <img src="/images/mapa.png" alt="Mapa" className="h-8" />
                  Selecciona en el mapa
                </button>
              </div>
            </div>
          </div>
          
          {/* Calle y número */}
          <div className="flex items-center gap-3">
            <div className="w-full grid grid-cols-2 gap-2">
              <div>
                <label htmlFor="direccion" className="block text-lg font-medium text-gray-700">
                  Calle/Dirección <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="direccion"
                  value={calle}
                  onChange={(e) => setCalle(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md"
                  placeholder="Calle Falsa 123"
                />
              </div>
              <div>
                <label htmlFor="numero" className="block text-lg font-medium text-gray-700">
                  Nro interior
                </label>
                <input
                  type="text"
                  id="numero"
                  value={numeroInterior}
                  onChange={(e) => setNumeroInterior(e.target.value)}
                  className="mt-1 block w-full p-2 border rounded-md"
                  placeholder="10"
                />
              </div>
            </div>
          </div>

          {/* Referencia */}
          <div className="flex items-center gap-3">
            <img src="/images/referencia.png" alt="Referencia" className="h-14" />
            <div className="w-full">
              <label htmlFor="referencia" className="block text-lg font-medium text-gray-700">
                Referencia
              </label>
              <input
                type="text"
                id="referencia"
                value={referencia}
                onChange={(e) => setReferencia(e.target.value)}
                className="mt-1 block w-full p-2 border rounded-md"
                placeholder="Cerca del parque"
              />
            </div>
          </div>

          {/* Teléfono */}
          <div className="flex items-center gap-3">
            <img src="/images/telefono.png" alt="Teléfono" className="h-14" />
            <div className="w-full">
              <label htmlFor="telefono" className="block text-lg font-medium text-gray-700">
                Teléfono <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="telefono"
                className="mt-1 block w-full p-2 border rounded-md"
                placeholder="987654321"
              />
            </div>
          </div>
        </form>

        {/* Total Carrito (ocupa 1 columna) */}
        <div className="bg-white py-6">
          {carritoState ? (
            <Summary2 carrito={carritoState} handleSubmit={handleSubmit} />
          ) : (
            <p>Cargando carrito...</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default StepDireccion;
