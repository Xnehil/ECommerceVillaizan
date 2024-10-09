import React from 'react';

interface PedidoEntregadoProps {
    pedidoId: string;
}

const PedidoEntregado: React.FC<PedidoEntregadoProps> = ({ pedidoId }) => {
    return (
        <div className="flex flex-col items-center justify-center h-full bg-gray-100 text-gray-800 p-6">
            <div className="bg-white rounded-lg shadow-md p-8 max-w-md text-center">
                <h2 className="text-2xl font-semibold mb-4">Pedido Entregado</h2>
                <p className="text-md mb-2">El pedido con ID <span className="font-semibold">{pedidoId}</span> ha sido entregado.</p>
                {/* <div className="flex justify-center">
                    <svg className="w-12 h-12 text-green-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2l4-4m0 0a9 9 0 11-6 6a9 9 0 016-6z"></path>
                    </svg>
                </div> */}
            </div>
        </div>
    );
};

export default PedidoEntregado;