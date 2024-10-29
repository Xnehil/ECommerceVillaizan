import React from 'react';
import { Motorizado } from 'types/PaqueteEnvio';
import { Pedido } from 'types/PaquetePedido';
import { Usuario } from 'types/PaqueteUsuario';

interface OrderDetailsProps {
    pedido: Pedido | null;
    enRuta: string;
  }

  
  
  const SeguimientoHeader: React.FC<OrderDetailsProps> = ({ pedido, enRuta }) => {
    if (!pedido) {
      return null;
    }

    const getStatusText = () => {
      switch (enRuta) {
          case 'espera':
              return 'En espera';
          case 'ruta':
              return 'En ruta';
          case 'entregado':
              return 'Entregado';
          default:
              return '';
      }
  };

  const getStatusClass = () => {
      switch (enRuta) {
          case 'espera':
              return 'text-yellow-600';
          case 'ruta':
              return 'text-blue-600';
          case 'entregado':
              return 'text-green-600';
          default:
              return 'text-gray-600';
      }
  };

    return (
      <div className="mt-5 flex justify-between bg-gray-100 rounded-lg shadow-md w-full p-6 pl-20 pr-24">
        {/* Driver Image */}
        <div className="flex-1 flex text-left">
          <img
            src={pedido.motorizado?.urlImagen ?? "https://luciatrejo.com/wp-content/uploads/2023/08/IMG-20230819-WA0204.jpg"}
            alt="Driver"
            className="rounded-full w-28 h-28 object-cover mb-2 mr-6"
          />
          <div className='flex flex-col justify-center'>
            <p className="font-bold text-gray-800">Conductor: {pedido.motorizado?.usuario?.nombre ?? "No asignado"}</p>
            <p className="text-gray-600">Placa: {pedido.motorizado?.placa ?? "No asignado"}</p>
          </div>
        </div>
        {/* Cart Products */}
        <div className="flex-1 text-center">
          <p className="font-bold text-gray-800">Pedido:</p>
          <ul className="list-none p-0 m-0">
            {/* <li className="text-gray-600 mb-1">Product 1</li> */}
            {pedido.detalles.map((detalle) => (
              <li key={detalle.id} className="text-gray-600 mb-1">
                {detalle.producto?.nombre} x {detalle.cantidad}
              </li>
            ))}
            
          </ul>
        </div>
        {/* State and State Image */}
        <div className="flex flex-col items-center text-center">
          <p className="font-bold text-gray-800">Estado</p>
          <img
            src="/images/motoHeladera.png" // Sample image URL
            alt="State"
            className="w-12 h-12 mt-2"
          />
          <p className={getStatusClass()}>{getStatusText()}</p>
        </div>
      </div>
    );
  };

export default  SeguimientoHeader;
;
