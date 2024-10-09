import React from 'react';
import { Motorizado } from 'types/PaqueteEnvio';
import { Pedido } from 'types/PaquetePedido';
import { Usuario } from 'types/PaqueteUsuario';

interface OrderDetailsProps {
    pedido: Pedido | null;
  }

  
  const SeguimientoHeader: React.FC<OrderDetailsProps> = ({ pedido }) => {
    if (!pedido) {
      return null;
    }
    console.log(pedido);
    pedido.motorizado = {} as Motorizado;
    pedido.motorizado.placa = "AT1-ASD";
    pedido.motorizado.urlImagen = "https://via.placeholder.com/100";
    pedido.motorizado.usuario = {} as Usuario;
    pedido.motorizado.usuario.nombre = "No asignado";

    return (
      <div className="mt-5 flex justify-between bg-gray-100 rounded-lg shadow-md w-full p-6 pl-24 pr-24">
        {/* Driver Image */}
        <div className="flex-1 flex text-left">
          <img
            src="https://via.placeholder.com/100" // Sample image URL
            alt="Driver"
            className="rounded-full w-42 h-42 object-cover mb-2 mr-6"
          />
          <div>
            <p className="font-bold text-gray-800">Conductor: {pedido.motorizado?.usuario?.nombre ?? "Masha"}</p>
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
          <p className="text-gray-600">{pedido.estado}</p>
        </div>
      </div>
    );
  };

export default  SeguimientoHeader;
;