import React from 'react';

interface StepDireccionProps {
  setStep: (step: string) => void;
}

const StepDireccion: React.FC<StepDireccionProps> = ({ setStep }) => {
  return (
    <div className="content-container mx-auto py-8">
      <button className="mb-4 flex items-center gap-2 text-gray-600 hover:text-gray-800">
        <img src="/images/back.png" alt="Volver" className="h-8" /> Volver
      </button>

      <h1 className="text-3xl font-bold mb-6">Coloca tus Datos</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Formulario de datos personales (ocupa 2 columnas) */}
        <form className="grid grid-cols-1 gap-6 lg:col-span-2">
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
                  className="mt-1 block w-full p-2 border rounded-md"
                  placeholder="Lima"
                />
                {/* Botón seleccionar mapa fuera del campo */}
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
        <div className="mt-8 p-4 border rounded-lg bg-[#FAF3E0] max-w-xs self-start">
          <h2 className="text-xl font-bold mb-2">Total Carrito</h2>
          <div className="flex justify-between text-lg">
            <span className="text-gray-700">Subtotal <i className="fas fa-info-circle text-sm text-gray-400"></i></span> 
            <span className="text-gray-700">S/. 56.00</span>
          </div>
          <div className="flex justify-between text-lg">
            <span className="text-gray-700">Envío</span> 
            <span className="text-gray-700">S/. 0.00</span>
          </div>
          <div className="flex justify-between text-lg font-bold mt-2">
            <span className="text-gray-900">Total</span> 
            <span className="text-gray-900">S/. 56.00</span>
          </div>
          <button className="w-full mt-4 px-4 py-2 bg-white border border-black rounded-md text-lg font-bold text-black hover:bg-gray-100">
            Proceeder a Pagar
          </button>
        </div>
      </div>
    </div>
  );
};

export default StepDireccion;
