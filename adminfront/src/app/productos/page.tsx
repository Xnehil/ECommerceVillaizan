"use client";

import React from "react";
import "@/styles/general.css";
import Table from "@/components/table";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";

const ProductosPage: React.FC = () => {
  const router = useRouter(); // Initialize useRouter

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
        <h4>Productos</h4>
        <p>
          Administra los productos que aparecen en el e-commerce , sus
          descripciones, categorías, etc.
        </p>
        <Table />
      </div>
    </>
  );
};

export default ProductosPage;
