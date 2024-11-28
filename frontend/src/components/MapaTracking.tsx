"use client";

import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L, { LatLngExpression } from 'leaflet';
import { Pedido } from 'types/PaquetePedido';
import 'leaflet.gridlayer.googlemutant';

interface MapaTrackingProps {
    pedido: Pedido | null;
    driverPosition: LatLngExpression;
}

const MapaTracking: React.FC<MapaTrackingProps> = ({ pedido, driverPosition }) => {
    if (!pedido) {
        return null;
    }
    const posicionDestino = (pedido.direccion?.ubicacion?.latitud && pedido.direccion?.ubicacion?.longitud ? [pedido.direccion?.ubicacion?.latitud, pedido.direccion?.ubicacion?.longitud] : [-6.484, -76.364]) as LatLngExpression;
    let latLngDriver = driverPosition as LatLngExpression;
    const googleApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

    return (
        <MapContainer center={latLngDriver} zoom={15} style={{ height: '100%', width: '100%' }}>
            {/* <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            /> */}
            <TileLayer
                url={`https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}&key=${googleApiKey}`}
                attribution='&copy; <a href="https://maps.google.com">Google Maps</a>'
                subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
            />
            <Marker position={latLngDriver ?? [-6.484, -76.364]} icon={L.icon({ iconUrl: '/images/motoHeladera.png', iconSize: [35, 35] })}>
                <Popup>
                    <div>
                        <h2>Tu pedido está en camino</h2>
                        <h3>{pedido.motorizado?.usuario?.nombre}</h3>
                    </div>
                </Popup>
            </Marker>
            <Marker position={posicionDestino} icon={L.icon({ iconUrl: '/images/iconoPin.png', iconSize: [30, 35] })}>
                <Popup>
                    <div>
                        <h2>Aquí se entregará tu pedido</h2>
                    </div>
                </Popup>
            </Marker>

        </MapContainer>
    );
};

export default MapaTracking;