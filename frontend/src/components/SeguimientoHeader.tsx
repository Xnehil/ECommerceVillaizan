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
    // console.log("Pedido data:", pedido);
    const getStatusText = () => {
      switch (enRuta) {
        case 'espera':
            return 'En espera';
        case 'ruta':
            return 'En ruta';
        case 'entregado':
            return 'Entregado';
        case 'cancelado':
            return 'Cancelado';
        default:
            return '';
      }
  };

  const getStatusClass = () => {
      switch (enRuta) {
          case 'espera':
              return 'text-yellow-600 font-sans';
          case 'ruta':
              return 'text-blue-600 font-sans';
          case 'entregado':
              return 'text-green-600 font-sans';
            case 'cancelado':
                return 'text-red-600 font-sans';
          default:
              return 'text-gray-600 font-sans';
      }
  };

  return (
    <div className="mt-5 flex flex-col items-center justify-center w-full">
        {/* Conditional Header for CODIGO DE SEGUIMIENTO */}
        {pedido && pedido.codigoSeguimiento && (
            <h2 className="text-2xl font-semibold text-white bg-black py-2 px-4 rounded-lg shadow-md mb-6">
                CÓDIGO DE SEGUIMIENTO: {pedido.codigoSeguimiento}
            </h2>
        )}
        
        {/* Main Content */}
        <div className="flex justify-between bg-gray-100 rounded-lg shadow-md w-full p-6">
            {/* Información del Conductor */}
            <div className="flex-1 flex items-center justify-center text-center">
                <img
                    src={pedido.motorizado?.urlImagen ?? "https://luciatrejo.com/wp-content/uploads/2023/08/IMG-20230819-WA0204.jpg"}
                    alt="Driver"
                    className="rounded-full w-28 h-28 object-cover mb-2 mr-6"
                />
                <div>
                    <p className="font-bold text-gray-800">Conductor: {pedido.motorizado?.usuario?.nombre ?? "No asignado"}</p>
                    <p className="text-gray-600">Placa: {pedido.motorizado?.placa ?? "No asignado"}</p>
                </div>
            </div>
            {/* Información del Pedido */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <p className="font-bold text-gray-800">Detalle de pedido:</p>
                <ul className="list-none p-0 m-0">
                    {pedido.detalles.map((detalle) => (
                        <li key={detalle.id} className="text-gray-600 mb-1">
                            {detalle.producto?.nombre} x {detalle.cantidad}
                        </li>
                    ))}
                </ul>
            </div>
            {/* Método de Pago */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <p className="font-bold text-gray-800">Método de Pago:</p>
                <ul className="list-none p-0 m-0">
                    {pedido.pedidosXMetodoPago?.map((pedidoXmetodo) => (
                        <li key={pedidoXmetodo.id} className="text-gray-600 mb-1">
                            {pedidoXmetodo.metodoPago.nombre} (S/ {pedidoXmetodo.monto}) 
                        </li>
                    ))}
                </ul>
            </div>
            {/* Estado del Pedido */}
            <div className="flex-1 flex flex-col items-center justify-center text-center">
                <p className="font-bold text-gray-800">Estado</p>
                <img
                    src="/images/motoHeladera.png" // Sample image URL
                    alt="State"
                    className="w-12 h-12 mt-2"
                />
                <p className={getStatusClass()}>{getStatusText()}</p>
            </div>
        </div>
    </div>
    );

};

export default  SeguimientoHeader;
;
