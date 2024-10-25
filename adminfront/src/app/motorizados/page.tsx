"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loading from "@/components/Loading";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./columns";
import { Motorizado } from "@/types/PaqueteMotorizado";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";

const MotorizadosPage: React.FC = () => {
  const router = useRouter(); // Initialize useRouter
  const motorizados = useRef<Motorizado[]>([]); // Initialize motorizados

  const a = useRef(0);
  const [isLoading, setIsLoading] = useState(false);

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
      }
    };

    if (a.current === 0) {
      fetchMotorizados();
    }
  }, []);

  const handleAddMotorizadoClick = () => {
    router.push("/motorizados/agregar"); // Navigate to /agregar page
  };

  return (
    <>
      <div className="header">
        <div className="buttons-container">
            <Button variant="default" onClick={handleAddMotorizadoClick}>
              <Plus size={20} className="mr-2" />
              Agregar
            </Button>
          </div>
      </div>
      <div className="content-container">
        {isLoading && <Loading />}
        <h4>Motorizados</h4>
        <p>
          Administra el inventario de los motorizados.
        </p>
        <div className="h-full w-full">
          <DataTable columns={columns} data={motorizados.current} nombre="motorizado" />
        </div>
      </div>
    </>
  );
};

export default MotorizadosPage;
