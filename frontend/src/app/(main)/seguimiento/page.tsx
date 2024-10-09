"use client";

import { LoadingSpinner } from '@components/LoadingSpinner';
// import MapaTracking from '@components/MapaTracking';
import SeguimientoHeader from '@components/SeguimientoHeader';
import { connectWebSocket } from '@lib/util/websocketUtils';
import { enrichLineItems,  retrieveCart, retrievePedido } from '@modules/cart/actions';
import dynamic from 'next/dynamic';
import { useSearchParams } from 'next/navigation';
import React, { useEffect, useRef } from 'react';
import { Pedido } from 'types/PaquetePedido';

const MapaTracking = dynamic(() => import('@components/MapaTracking'), { ssr: false });

const fetchCart = async ( setDriverPosition: (position: [number, number]) => void) => {
    const respuesta = await retrievePedido(true);
    let cart:Pedido= respuesta;
    let aux = cart.detalles;
    const enrichedItems = await enrichLineItems(cart.detalles);
    // console.log("Detalles enriquecidos:", enrichedItems);
    cart.detalles = enrichedItems;

    if (cart.motorizado === null){
        // buscar motorizado con el codigo de seguimiento
        // cart.motorizado = motorizado
    }
    //Conectar a websocket para recibir actualizaciones en tiempo real
    if (cart.motorizado) {
        // Conectar a websocket para recibir actualizaciones en tiempo real
        const ws = connectWebSocket(
            cart.motorizado.id, // idRepartidor
            cart.id, // idPedido
            (data) => {
                if (data.type === 'locationResponse') {
                    // Actualizar la posición del motorizado
                    setDriverPosition([data.data.location.lat, data.data.location.lng]);
                } else if (data.type === 'notYetResponse') {
                    // Actualizar el estado del pedido
                    console.log(data.data);
                }
            },
            () => {
                // Handle WebSocket connection close
            }
        );
    } else {
        console.error("Motorizado is undefined");
    }
    

    return cart
  }


const TrackingPage: React.FC = () => {
    const [pedido, setPedido] = React.useState<Pedido | null>(null);
    //Extract ?codigo= from URL
    const search = useSearchParams();
    const [codigo, setCodigo] = React.useState<string | null>(search.get('codigo'));
    const [loading, setLoading] = React.useState<boolean>(true);
    const [driverPosition, setDriverPosition] = React.useState<[number, number]>([-6.476, -76.361]);
    const mapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchCart(setDriverPosition).then((cart) => {
            // console.log(cart);
            setPedido(cart);
            setLoading(false);
        });
    }, []);

    useEffect(() => {
        if (pedido) {
            setLoading(false);
            mapRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            window.scrollBy(0, -30); // Adjust the value (-50) to scroll a bit higher
        }
    }, [pedido]);

    const handleSubmit = (event: React.FormEvent) => {
        event.preventDefault();
        const inputCodigo = (event.target as HTMLFormElement).elements.namedItem('codigo') as HTMLInputElement;
        const codigoValue = inputCodigo.value;
        if (codigoValue) {
            window.location.href = `?codigo=${codigoValue}`;
        }
    };

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
                {!codigo ? (
                    <>
                    <div className="flex flex-col items-center mt-8">
                        <h1 className="text-2xl font-semibold text-gray-800 mb-4">
                            Ingresa el código de seguimiento de tu pedido
                        </h1>
                        <form className="w-full max-w-sm" onSubmit={handleSubmit}>
                            <div className="flex items-center border-b border-b-2 border-rojoVillaizan py-2">
                                <input
                                    type="text"
                                    name='codigo'
                                    placeholder="Código de seguimiento"
                                    className="appearance-none bg-transparent border-none w-full text-gray-700 mr-3 py-1 px-2 leading-tight focus:outline-none"
                                />
                                <button
                                    type="submit"
                                    className="flex-shrink-0 bg-rojoVillaizan hover:bg-rojoVillaizan-700 border-gray-200 hover:border-gray-400 text-sm border-4 text-white py-1 px-2 rounded"
                                >
                                    Rastrear
                                </button>
                            </div>
                        </form>
                    </div>
                </>
                ) : (
                    <>
                    {loading ? (
                        <div className='flex justify-center items-center' style={{ height: '500px' }}>
                            <LoadingSpinner />
                        </div>
                    ) : (
                        <>
                            <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'space-between' }} ref={mapRef}>
                                <SeguimientoHeader pedido={pedido} />
                            </div>

                            <div style={{ marginTop: '40px', height: '64vh', border: '1px solid #ccc' }} >
                                <MapaTracking pedido={pedido} driverPosition={driverPosition} />
                            </div>
                        </>
                    )}
                </>
                )}
                
            </div>
        </div>
    );
};

export default TrackingPage;