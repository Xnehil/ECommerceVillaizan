"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import { Producto } from "@/types/PaqueteProducto";
import axios from "axios";
import Loading from "@/components/Loading";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./columns";

const ProductosPage: React.FC = () => {
  const router = useRouter(); // Initialize useRouter

  const products = useRef<Producto[]>([]); // Initialize products

  const a = useRef(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {
      if (products.current.length > 0) return;

      setIsLoading(true);

      try {
        a.current = a.current + 1;
        console.log(a.current);
        console.log("Fetching products");
        // Fetch products
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}producto?enriquecido=true`
        );
        if (!response) {
          throw new Error("Failed to fetch products");
        }
        const data = await response.data;
        console.log("Products fetched:", data);

        const productsData: Producto[] = data.productos;
        products.current = productsData;
        console.log("Products:", products.current);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch products", error);
      }
    };

    if (a.current === 0) {
      fetchProducts();
    }
  }, []);

  const handleAddProductClick = () => {
    router.push("/productos/agregar"); // Navigate to /agregar page
  };

  return (
    <>
      <div className="header">
        <div className="buttons-container">
          <Button variant="default" onClick={handleAddProductClick}>
            <Plus size={20} className="mr-2" />
            Agregar
          </Button>
        </div>
      </div>
      <div className="content-container">
        {isLoading && <Loading />}
        <h4>Productos</h4>
        <p>
          Administra los productos que aparecen en el e-commerce, sus
          descripciones, categorías, etc.
        </p>
        <div className="h-full w-full">
          <DataTable columns={columns} data={products.current} nombre="producto"/>
        </div>
      </div>
    </>
  );
};

export default ProductosPage;
