"use client";

import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import { Skeleton } from "@/components/ui/skeleton";
import { Usuario } from "@/types/PaqueteMotorizado";
import InputWithLabel from "@/components/forms/inputWithLabel";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";

interface InformacionRepartidorProps {
  usuario: MutableRefObject<Usuario>;
  isEditing: boolean;
  nuevo?: boolean;
  mostrar?: boolean;
  motorizado?: boolean;
}

const InformacionRepartidor: React.FC<InformacionRepartidorProps> = ({
  usuario,
  isEditing,
  nuevo = false,
  mostrar = false,
  motorizado = false,
}) => {
  const [openSelect, setOpenSelect] = useState(false);
  const [newUsuario, setNewUsuario] = useState(motorizado ? false : isEditing);

  const [nombre, setNombre] = useState(usuario.current?.nombre || "");
  const [apellido, setApellido] = useState(usuario.current?.apellido || "");
  const [numeroTelefono, setNumeroTelefono] = useState(
    usuario.current?.numeroTelefono || ""
  );
  const [correo, setCorreo] = useState(usuario.current?.correo || "");
  const [password, setPassword] = useState("");
  const repartidores = useRef<Usuario[]>([]);

  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    if (!motorizado) {
      setNewUsuario(isEditing);
    }
  }, [isEditing]);

  const fetchRepartidores = async () => {
    if (repartidores.current?.length > 0) return;

    setIsLoading(true);

    try {
      console.log("Fetching Repartidores");
      // Fetch Repartidores
      const reqBody = { nombreRol: "Repartidor" };
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}usuario/rol`,
        reqBody
      );
      if (!response) {
        throw new Error("Failed to fetch Repartidores");
      }
      const data = await response.data;
      console.log("Repartidores fetched:", data);

      const repartidoresData: Usuario[] = data.usuarios;
      repartidores.current = repartidoresData;
      console.log("Repartidores:", repartidores.current);
      setIsLoading(false);
    } catch (error) {
      console.error("Failed to fetch motorizados", error);
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "No se pudieron cargar los repartidores. Por favor, intente de nuevo.",
      });
    }
  };

  const handleNewUsuario = () => {
    setNewUsuario(!newUsuario);
    setNombre("");
    setApellido("");
    setNumeroTelefono("");
    setCorreo("");
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length > 9) return;
    setNumeroTelefono(value);
    usuario.current.numeroTelefono = value;
  };

  const handleNumberOnBlur = () => {
    if (numeroTelefono.length < 9) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El número de teléfono debe tener 9 dígitos.",
      });
    }
  };

  const handleCorreoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setCorreo(value);
    usuario.current.correo = value;
  };

  const handleCorreoOnBlur = () => {
    if (!correo.includes("@") || !correo.includes(".")) {
      toast({
        variant: "destructive",
        title: "Error",
        description: "El correo ingresado no es válido.",
      });
    }
  };

  const handleSave = async () => {
    setIsLoading(true);
    console.log("Saving user");
    // create a codigo for the product
    usuario.current.conCuenta = true;
    //rol de repartidor

    if (usuario.current.nombre === "") {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "El nombre del usuario es requerido.",
      });
      return;
    }

    if (usuario.current.apellido === "") {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "El apellido del usuario es requerido.",
      });
      return;
    }

    if (usuario.current.numeroTelefono === "") {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "El número de teléfono del usuario es requerido.",
      });
      return;
    }

    if (usuario.current.numeroTelefono?.length !== 9) {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "El número de teléfono del usuario debe tener 9 dígitos.",
      });
      return;
    }

    if (usuario.current.correo === "") {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "El correo del usuario es requerido.",
      });
      return;
    }

    if (usuario.current.contrasena === "") {
      setIsLoading(false);
      toast({
        variant: "destructive",
        title: "Error",
        description: "La contraseña del usuario es requerida.",
      });
      return;
    }

    console.log(usuario.current);
    try {
      const response = await axios.post(
        `${process.env.NEXT_PUBLIC_BASE_URL}usuario`,
        usuario.current
      );
      if (response.status !== 201) {
        throw new Error("Error al guardar usuario.");
      }
      console.log("Usuario saved", response.data);
      setNewUsuario(false);

      setIsLoading(false);

      toast({
        description: "El usuario se guardó correctamente.",
      });
    } catch (error: any) {
      console.error("Error saving usuario", error);
      setIsLoading(false);

      let description =
        "Ocurrió un error al guardar el usuario. Por favor, intente de nuevo.";
      if (
        error?.response?.data?.error &&
        error.response.data.error.includes("ya existe")
      ) {
        description = error.response.data.error;
      }

      toast({
        variant: "destructive",
        title: "Error",
        description,
      });
    }
  };

  return (
    <div className="info-side-container">
      {!mostrar && <h5>Repartidor</h5>}
      <div className="w-full max-w-sm flex space-x-2 flex-wrap gap-4">
        {isLoading ? (
          <div className="grid gap-1">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-8 w-64" />
          </div>
        ) : (
          <div className="flex-1">
            <InputWithLabel
              label="Nombre"
              value={nombre}
              onChange={(e) => {
                setNombre(e.target.value);
                usuario.current.nombre = e.target.value;
              }}
              disabled={!newUsuario}
              required={newUsuario}
            />
          </div>
        )}
        {isLoading ? (
          <div className="grid gap-1">
            <Skeleton className="h-6 w-64" />
            <Skeleton className="h-8 w-64" />
          </div>
        ) : (
          <div className="flex-1">
            <InputWithLabel
              label="Apellido"
              value={apellido}
              onChange={(e) => {
                setApellido(e.target.value);
                usuario.current.apellido = e.target.value;
              }}
              disabled={!newUsuario}
              required={newUsuario}
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
              onChange={handleNumberChange}
              onBlur={handleNumberOnBlur}
              disabled={!newUsuario}
              required={newUsuario}
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
              onChange={handleCorreoChange}
              onBlur={handleCorreoOnBlur}
              disabled={!newUsuario}
              required={newUsuario}
            />
          </div>
        )}
      </>
      <>
        {(nuevo || motorizado) && newUsuario && (
          <InputWithLabel
            label="Contraseña"
            type="password"
            onChange={(e) => {
              setPassword(e.target.value);
              usuario.current.contrasena = e.target.value;
            }}
            onBlur={() => {
              if (password.length < 8) {
                toast({
                  variant: "destructive",
                  title: "Error",
                  description:
                    "La contraseña debe tener al menos 8 caracteres.",
                });
              }
            }}
            required
          />
        )}
      </>
      {!nuevo && !mostrar && isEditing && (
        <div className="lower-buttons-container">
          {!newUsuario ? (
            <>
              <Sheet open={openSelect} onOpenChange={setOpenSelect}>
                <SheetTrigger asChild>
                  <Button onClick={fetchRepartidores}>
                    Seleccionar usuario
                  </Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Repartidores</SheetTitle>
                    <SheetDescription>
                      Selecciona un repartidor
                    </SheetDescription>
                  </SheetHeader>
                  {openSelect && (
                    <div className="space-y-2 mt-2">
                      {repartidores.current?.map((repartidor) => (
                        <div key={repartidor.id} className="w-3/4">
                          <Button
                            onClick={() => {
                              usuario.current = repartidor;
                              setNombre(repartidor.nombre);
                              setApellido(repartidor.apellido);
                              setNumeroTelefono(repartidor.numeroTelefono || "");
                              setCorreo(repartidor.correo);
                              setOpenSelect(false);
                            }}
                            variant="outline"
                            className="w-full"
                          >
                            {repartidor.nombre} {repartidor.apellido}
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}
                </SheetContent>
              </Sheet>
              <Button variant="outline" onClick={handleNewUsuario}>
                Crear usuario
              </Button>
            </>
          ) : (
            <>
              <Button variant="secondary" onClick={handleNewUsuario}>
                Cancelar
              </Button>
              <Button variant="default">Guardar</Button>
            </>
          )}
        </div>
      )}
    </div>
  );
};

export default InformacionRepartidor;
