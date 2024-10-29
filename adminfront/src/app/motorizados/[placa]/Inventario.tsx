"use client";

import React, { MutableRefObject, useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import axios from "axios";
import { useToast } from "@/hooks/use-toast";
import { Motorizado } from "@/types/PaqueteMotorizado";
import { InventarioMotorizado, Producto } from "@/types/PaqueteProducto";
import { DataTable } from "@/components/datatable/data-table";
import { columns, columnsEdit } from "./columns";
import Loading from "@/components/Loading";

interface InformacionAdicionalProps {
  motorizado: MutableRefObject<Motorizado>;
  inventario: MutableRefObject<InventarioMotorizado[]>;
  isEditing: boolean;
}

const Inventario: React.FC<InformacionAdicionalProps> = ({
  motorizado,
  inventario,
  isEditing,
}) => {
  const a = useRef(0);
  const [isLoading, setIsLoading] = useState(true);

  const { toast } = useToast();
  useEffect(() => {
    const fetchInventario = async () => {
      try {
        console.log(a.current);
        console.log("Fetching products");
        // Fetch products
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}producto?ecommerce=true`
        );
        const data = await response.data;
        console.log("Products fetched:", data);

        const productsData: Producto[] = data.productos;
        console.log("Products:", productsData);

        console.log("Fetching inventario");
        console.log("inventario.current", inventario.current);

        // check if any product is not in inventario, add it
        productsData.forEach((product) => {
          const found = inventario.current.find(
            (element) => element.producto.id === product.id
          );
          if (!found) {
            inventario.current.push({
              producto: product,
              stock: 0,
              stockMinimo: 0,
              esMerma: false,
              motorizado: motorizado.current,
            } as InventarioMotorizado);
          }
        });

        setIsLoading(false);

        a.current = a.current + 1;
      } catch (error) {
        console.error("Failed to fetch inventario", error);
        toast({
          title: "Error",
          description:
            "Error al obtener la información de productos. Por favor, intente de nuevo.",
        });
        setIsLoading(false);
      }
    };
    if (a.current === 0) {
      fetchInventario();
      // eslint-disable-next-line react-hooks/exhaustive-deps
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
