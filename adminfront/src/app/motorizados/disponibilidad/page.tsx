"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loading from "@/components/Loading";
import { Motorizado } from "@/types/PaqueteMotorizado";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const HorariosPage: React.FC = () => {
  const router = useRouter(); // Initialize useRouter
  const motorizados = useRef<Motorizado[]>([]); // Initialize motorizados

  const a = useRef(0);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchMotorizados = async () => {
      if (motorizados.current.length > 0) return;

      setIsLoading(true);

      try {
        a.current = a.current + 1;
        console.log(a.current);
        console.log("Fetching motorizados");
        // Fetch motorizados
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}motorizado?enriquecido=true`
        );
        if (!response) {
          throw new Error("Failed to fetch motorizados");
        }
        const data = await response.data;
        console.log("Motorizados fetched:", data);

        const motorizadosData: Motorizado[] = data.motorizados;
        motorizados.current = motorizadosData;
        console.log("Motorizados:", motorizados.current);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch motorizados", error);
        setIsLoading(false);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "No se pudieron cargar los motorizados. Por favor, intente de nuevo.",
        });
      }
    };

    if (a.current === 0) {
      fetchMotorizados();
    }
  }, []);

  const handleAddMotorizadoClick = () => {
    router.push("/motorizados/agregar"); // Navigate to /agregar page
  };

  const handleRepartidoresClick = () => {
    router.push("/motorizados/repartidores"); // Navigate to /repartidores page
  };

  return (
    <>
      <div className="content-container">
        {isLoading && <Loading />}
        <h4>Horarios de disponibilidad</h4>
        <p>Administra los horarios de disponibilidad de los motorizados.</p>
        <div className="h-full w-full">

        </div>
      </div>
    </>
  );
};

export default HorariosPage;
