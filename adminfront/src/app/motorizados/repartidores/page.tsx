"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loading from "@/components/Loading";
import { DataTable } from "@/components/datatable/data-table";
import { Motorizado, Usuario } from "@/types/PaqueteMotorizado";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const RepartidoresPage: React.FC = () => {
  const router = useRouter(); // Initialize useRouter
  const repartidores = useRef<Usuario[]>([]); // Initialize motorizados

  const a = useRef(0);
  const [isLoading, setIsLoading] = useState(false);

  const { toast } = useToast();

  useEffect(() => {
    const fetchRepartidores = async () => {
      if (repartidores.current.length > 0) return;

      setIsLoading(true);

      try {
        a.current = a.current + 1;
        console.log(a.current);
        console.log("Fetching repartidores");
        // Fetch motorizados
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}motorizado?enriquecido=true`
        );
        if (!response) {
          throw new Error("Failed to fetch motorizados");
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

    if (a.current === 0) {
    }
  }, []);

  const handleRepartidoresClick = () => {
    router.push("/motorizados/repartidores/agregar"); // Navigate to /repartidores page
  };

  return (
    <>
      <div className="header">
        <div className="buttons-container">
          <Button variant="default" onClick={handleRepartidoresClick}>
            <Plus size={20} className="mr-2" />
            Agregar
          </Button>
        </div>
      </div>
      <div className="content-container">
        {isLoading && <Loading />}
        <h4>Repartidores</h4>
        <p>Administra los usuarios de los repartidores.</p>
        <div className="h-full w-full">
          
        </div>
      </div>
    </>
  );
};

export default RepartidoresPage;
