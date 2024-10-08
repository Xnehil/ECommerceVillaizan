import React from 'react';
import { Pedido } from 'types/PaquetePedido';

interface OrderDetailsProps {
    pedido: Pedido;
  }

  
  const SeguimientoHeader: React.FC = () => {
    return (
      <div className="mt-5 flex justify-between p-5 bg-gray-100 rounded-lg shadow-md w-full">
        {/* Driver Image */}
        <div className="flex-1 text-center">
          <img
            src="https://via.placeholder.com/100" // Sample image URL
            alt="Driver"
            className="rounded-full w-48 h-48 object-cover mb-2"
          />
          <p className="font-bold text-gray-800">Driver Name</p>
          <p className="text-gray-600">Vehicle Number</p>
        </div>
        {/* Cart Products */}
        <div className="flex-1 text-center">
          <p className="font-bold text-gray-800">Cart Products:</p>
          <ul className="list-none p-0 m-0">
            <li className="text-gray-600 mb-1">Product 1</li>
            <li className="text-gray-600 mb-1">Product 2</li>
            <li className="text-gray-600 mb-1">Product 3</li>
            {/* Add more products as needed */}
          </ul>
        </div>
        {/* State and State Image */}
        <div className="flex-1 text-center">
          <p className="font-bold text-gray-800">Order State</p>
          <img
            src="https://via.placeholder.com/50" // Sample image URL
            alt="State"
            className="w-12 h-12 mt-2"
          />
        </div>
      </div>
    );
  };

export default  SeguimientoHeader;
;