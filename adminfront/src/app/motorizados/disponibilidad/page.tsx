"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import axios from "axios";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Ajuste } from "@/types/PaqueteAjustes";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

const HorariosPage: React.FC = () => {
  const parametros = useRef<Ajuste[]>([]);

  const a = useRef(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [horarioLunes, setHorarioLunes] = useState("");
  const [horarioMartes, setHorarioMartes] = useState("");
  const [horarioMiercoles, setHorarioMiercoles] = useState("");
  const [horarioJueves, setHorarioJueves] = useState("");
  const [horarioViernes, setHorarioViernes] = useState("");
  const [horarioSabado, setHorarioSabado] = useState("");
  const [horarioDomingo, setHorarioDomingo] = useState("");

  const { toast } = useToast();

  useEffect(() => {
    const fetchParametros = async () => {
      if (parametros.current.length == 0) {
        try {
          a.current = a.current + 1;

          const response = await axios.get(
            `${process.env.NEXT_PUBLIC_BASE_URL}ajuste`
          );

          const data = response.data;
          console.log("Parameters fetched", data);

          const ajustes = data.ajustes as Ajuste[];

          parametros.current = ajustes;

          const hl = parametros.current.find(
            (a) => a.llave === "horario_lunes"
          );
          const hm = parametros.current.find(
            (a) => a.llave === "horario_martes"
          );
          const hmi = parametros.current.find(
            (a) => a.llave === "horario_miercoles"
          );
          const hj = parametros.current.find(
            (a) => a.llave === "horario_jueves"
          );
          const hv = parametros.current.find(
            (a) => a.llave === "horario_viernes"
          );
          const hs = parametros.current.find(
            (a) => a.llave === "horario_sabado"
          );
          const hdo = parametros.current.find(
            (a) => a.llave === "horario_domingo"
          );

          setHorarioLunes(hl?.valor || "");
          setHorarioMartes(hm?.valor || "");
          setHorarioMiercoles(hmi?.valor || "");
          setHorarioJueves(hj?.valor || "");
          setHorarioViernes(hv?.valor || "");
          setHorarioSabado(hs?.valor || "");
          setHorarioDomingo(hdo?.valor || "");

          console.log("Parameters", parametros.current);

          setIsLoading(false);
        } catch (error) {
          console.error("Error fetching parameters", error);
          toast({
            variant: "destructive",
            title: "Error",
            description:
              "Ocurrió un error al obtener los horarios. Por favor, intente de nuevo.",
          });
        }
      }
    };
    if (a.current === 0) {
      fetchParametros();
    }
  }, []);

  const handleHorarioChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    dia: string
  ) => {
    const { name, value } = e.target;
    const setHorario = {
      lunes: setHorarioLunes,
      martes: setHorarioMartes,
      miercoles: setHorarioMiercoles,
      jueves: setHorarioJueves,
      viernes: setHorarioViernes,
      sabado: setHorarioSabado,
      domingo: setHorarioDomingo,
    }[dia];
    if (setHorario) {
      setHorario((prev) => {
        const [start, end] = prev.split("-");
        const newStart = name === "start" ? value : start;
        const newEnd = name === "end" ? value : end;

        // Validate that start is not after end
        if (newStart > newEnd) {
          toast({
            variant: "destructive",
            title: "Error",
            description:
              "La hora de inicio no puede ser después de la hora de fin.",
          });
          return prev; // Return the previous value without updating
        }

        return `${newStart}-${newEnd}`;
      });
    }
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    setIsLoading(true);
    try {
      const responseLunes = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}ajuste/horario_lunes`,
        { valor: horarioLunes }
      );

      const responseMartes = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}ajuste/horario_martes`,
        { valor: horarioMartes }
      );

      const responseMiercoles = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}ajuste/horario_miercoles`,
        { valor: horarioMiercoles }
      );

      const responseJueves = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}ajuste/horario_jueves`,
        { valor: horarioJueves }
      );

      const responseViernes = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}ajuste/horario_viernes`,
        { valor: horarioViernes }
      );

      const responseSabado = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}ajuste/horario_sabado`,
        { valor: horarioSabado }
      );

      const responseDomingo = await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}ajuste/horario_domingo`,
        { valor: horarioDomingo }
      );
      
      toast({
        description: "Horarios guardados correctamente.",
      });
      setIsEditing(false);
    } catch (error) {
      console.error("Error saving parameters", error);
      toast({
        variant: "destructive",
        title: "Error",
        description:
          "Ocurrió un error al guardar los horarios. Por favor, intente de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    setHorarioLunes(
      parametros.current.find((a) => a.llave === "horario_lunes")?.valor || ""
    );
    setHorarioMartes(
      parametros.current.find((a) => a.llave === "horario_martes")?.valor || ""
    );
    setHorarioMiercoles(
      parametros.current.find((a) => a.llave === "horario_miercoles")?.valor ||
        ""
    );
    setHorarioJueves(
      parametros.current.find((a) => a.llave === "horario_jueves")?.valor || ""
    );
    setHorarioViernes(
      parametros.current.find((a) => a.llave === "horario_viernes")?.valor || ""
    );
    setHorarioSabado(
      parametros.current.find((a) => a.llave === "horario_sabado")?.valor || ""
    );
    setHorarioDomingo(
      parametros.current.find((a) => a.llave === "horario_domingo")?.valor || ""
    );
  };

  const renderHorarioInputs = (
    dia: string,
    horario: any,
    handleChange: any
  ) => {
    const [start, end] = horario.split("-");
    return isLoading ? (
      <div className="flex flex-col space-y-4">
        <div className="space-y-2">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
        </div>
      </div>
    ) : (
      <div className="w-full max-w-sm flex flex-col space-y-2">
        <Label>{dia.charAt(0).toUpperCase() + dia.slice(1)}</Label>
        <div className="flex space-x-2">
          <Input
            name="start"
            value={start}
            onChange={(e) => handleChange(e, dia)}
            type="time"
            disabled={!isEditing}
          />
          <span>-</span>
          <Input
            name="end"
            value={end}
            onChange={(e) => handleChange(e, dia)}
            type="time"
            disabled={!isEditing}
          />
        </div>
      </div>
    );
  };

  return (
    <>
      <div className="content-container">
        <h4>Horarios de disponibilidad</h4>
        <p>Administra los horarios de disponibilidad de los motorizados.</p>
        <div className="information-container">
          <div className="info-side-container">
            {renderHorarioInputs("lunes", horarioLunes, handleHorarioChange)}
            {renderHorarioInputs("martes", horarioMartes, handleHorarioChange)}
            {renderHorarioInputs(
              "miercoles",
              horarioMiercoles,
              handleHorarioChange
            )}
            {renderHorarioInputs("jueves", horarioJueves, handleHorarioChange)}
          </div>
          <div className="info-side-container">
            {renderHorarioInputs(
              "viernes",
              horarioViernes,
              handleHorarioChange
            )}
            {renderHorarioInputs("sabado", horarioSabado, handleHorarioChange)}
            {renderHorarioInputs(
              "domingo",
              horarioDomingo,
              handleHorarioChange
            )}
          </div>
        </div>
        <div className="lower-buttons-container w-full">
          {isEditing ? (
            <>
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="secondary">Cancelar</Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>¿Estás seguro de cancelar?</DialogTitle>
                    <DialogDescription>
                      Se perderán los cambios realizados.
                    </DialogDescription>
                  </DialogHeader>
                  <DialogFooter>
                    <Button onClick={handleCancel}>Confirmar</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>

              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button variant="default">Guardar</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>
                      ¿Estás seguro de guardar?
                    </AlertDialogTitle>
                    <AlertDialogDescription>
                      Se guardarán los cambios realizados para el ecommerce.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                    <AlertDialogAction onClick={handleSave}>
                      Guardar
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </>
          ) : (
            <Button variant="default" onClick={handleEdit}>
              Editar
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

export default HorariosPage;
