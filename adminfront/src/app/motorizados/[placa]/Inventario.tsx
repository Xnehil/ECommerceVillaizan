"use client";

import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Motorizado } from "@/types/PaqueteMotorizado";
import { InventarioMotorizado, Producto } from "@/types/PaqueteProducto";
import { DataTable } from "@/app/productos/data-table";
import { columns, columnsEdit } from "./columns";
import Loading from "@/components/Loading";

interface InformacionAdicionalProps {
  inventario: MutableRefObject<InventarioMotorizado[]>;
  isEditing: boolean;
}

const Inventario: React.FC<InformacionAdicionalProps> = ({
  inventario,
  isEditing,
}) => {
  const a = useRef(0);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const fetchInventario = async () => {
      setIsLoading(true);
      try {
        console.log(a.current);
        console.log("Fetching products");
        // Fetch products
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}producto`
        );
        const data = await response.data;
        console.log("Products fetched:", data);

        const productsData: Producto[] = data.productos;
        console.log("Products:", productsData);

        // check if any product is not in inventario
        if (inventario) {
          inventario.current = productsData.map(
            (producto) =>
              ({
                producto: producto,
                stock: 0,
                stockMinimo: 0,
                esMerma: false,
              } as InventarioMotorizado)
          );
          console.log("Inventario:", inventario.current);
        }

        setIsLoading(false);
        
        a.current = a.current + 1;
      } catch (error) {
        console.error("Failed to fetch inventario", error);
      }
    };
    if (a.current === 0) {
      fetchInventario();
    }
  }, []);

  useEffect(() => {
    if (a.current > 0) {
      const timeout = (ms: number) =>
        new Promise((resolve) => setTimeout(resolve, ms));
      const fetchData = async () => {
        setIsLoading(true);
        await timeout(100);
        setIsLoading(false);
      };
      fetchData();
    }
  }, [isEditing]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="info-side-container">
      <h5>Inventario</h5>
      <div className="h-full w-full">
        {inventario?.current &&
          (isEditing ? (
            <DataTable
              columns={columnsEdit}
              data={inventario.current}
              nombre="productos"
              npagination={5}
            />
          ) : (
            <DataTable
              columns={columns}
              data={inventario.current}
              nombre="productos"
              npagination={8}
            />
          ))}
      </div>
    </div>
  );
};

export default Inventario;
