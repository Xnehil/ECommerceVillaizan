"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import { Pedido } from 'types/PaquetePedido';

interface MapaTrackingProps {
    pedido: Pedido | null;
}

const MapaTracking: React.FC<MapaTrackingProps> = ({ pedido }) => {
    const [driverPosition, setDriverPosition] = useState<[number, number]>([-6.476, -76.361]);
    if (!pedido) {
        return null;
    }
    const posicionDestino = (pedido.direccion?.ubicacion?.latitud && pedido.direccion?.ubicacion?.longitud ? [pedido.direccion?.ubicacion?.latitud, pedido.direccion?.ubicacion?.longitud] : [-6.484, -76.364]) as LatLngExpression;


    return (
        <MapContainer center={driverPosition} zoom={15} style={{ height: '100%', width: '100%' }}>
            <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            <Marker position={driverPosition} icon={L.icon({ iconUrl: '/images/motoHeladera.png', iconSize: [35, 35] })}>
                <Popup>
                    <div>
                        <h3>{pedido.motorizado?.usuario?.nombre}</h3>
                    </div>
                </Popup>
            </Marker>
            <Marker position={posicionDestino} icon={L.icon({ iconUrl: '/images/iconoPin.png', iconSize: [30, 35] })}/>

        </MapContainer>
    );
};

export default MapaTracking;