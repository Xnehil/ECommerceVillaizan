"use client";

import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import { Skeleton } from "@/components/ui/skeleton";
import { Usuario } from "@/types/PaqueteMotorizado";
import InputWithLabel from "@/components/forms/inputWithLabel";

interface InformacionRepartidorProps {
  usuario: MutableRefObject<Usuario>;
  isEditing: boolean;
}

const InformacionRepartidor: React.FC<InformacionRepartidorProps> = ({
  usuario,
  isEditing,
}) => {
  const [nombre, setNombre] = useState(usuario.current?.nombre || "");
  const [apellido, setApellido] = useState(usuario.current?.apellido || "");
  const [numeroTelefono, setNumeroTelefono] = useState(usuario.current?.numeroTelefono || "");
  const [correo, setCorreo] = useState(usuario.current?.correo || "");

  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setNombre(usuario.current?.nombre || "");
    setApellido(usuario.current?.apellido || "");
    setNumeroTelefono(usuario.current?.numeroTelefono || "");
    setCorreo(usuario.current?.correo || "");
  }, [isEditing]);


  return (
    <div className="info-side-container">
      <h5>Información del usuario</h5>
      <div className="w-full flex flex-wrap gap-4">
        {isLoading ? (
          <div className="grid gap-1">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-8 w-64" />
          </div>
        ) : (
          <div className="w-2/5 flex flex-column">
            <InputWithLabel
              label="Nombre"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              disabled={!isEditing}
            />
          </div>
        )}
        {isLoading ? (
          <div className="grid gap-1">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-8 w-64" />
          </div>
        ) : (
          <div className="w-2/5 flex flex-column">
            <InputWithLabel
              label="Apellido"
              value={apellido}
              onChange={(e) => setApellido(e.target.value)}
              disabled={!isEditing}
            />
          </div>
        )}
      </div>
      <>
        {isLoading ? (
          <div className="grid gap-1">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-8 w-64" />
          </div>
        ) : (
          <div className="w-full flex flex-column">
            <InputWithLabel
              label="Número de Teléfono"
              value={numeroTelefono}
              onChange={(e) => setNumeroTelefono(e.target.value)}
              disabled={!isEditing}
            />
          </div>
        )}
      </>
      <>
        {isLoading ? (
          <div className="grid gap-1">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-8 w-64" />
          </div>
        ) : (
          <div className="w-full flex flex-column">
            <InputWithLabel
              label="Correo"
              value={correo}
              onChange={(e) => setCorreo(e.target.value)}
              disabled={!isEditing}
            />
          </div>
        )}
      </>
    </div>
  );
};

export default InformacionRepartidor;
