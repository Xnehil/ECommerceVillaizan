"use client";

import SeguimientoHeader from '@components/SeguimientoHeader';
import React from 'react';
import { Pedido } from 'types/PaquetePedido';

const TrackingPage: React.FC = () => {
    const [pedido, setPedido] = React.useState<Pedido | null>(null);



    return (
        <div>
            <img
            src="/images/bannerFlujoCompra.png"
            alt="Promociones en Villaizan"
            style={{
            width: '100%',
            height: '20vh',
            objectFit: 'cover', // Ensures the image covers the specified dimensions
            objectPosition: 'center', // Centers the image within the specified dimensions
          }}
               />

            <div style={{ padding: '20px' }}>
                <h1>Order Tracking</h1>
                <p>Enter your order number to track your shipment:</p>
                <form>
                    <input type="text" placeholder="Order Number" style={{ marginRight: '10px' }} />
                    <button type="submit">Track</button>
                </form>
                <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }}>
                    <SeguimientoHeader />
                </div>
                <div style={{ marginTop: '40px', height: '500px', border: '1px solid #ccc' }}>
                    {/* Tracking map will be displayed here */}
                    <p>Tracking Map Placeholder</p>
                </div>
            </div>
        </div>
    );
};

export default TrackingPage;