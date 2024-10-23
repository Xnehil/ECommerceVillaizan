"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import axios from "axios";
import Loading from "@/components/Loading";
import { Separator } from "@/components/ui/separator";
import Parametros from "./parametros";

const ConfiguracionPage: React.FC = () => {
  const router = useRouter(); // Initialize useRouter

  const a = useRef(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchProducts = async () => {};

    if (a.current === 0) {
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
        <h4>Configuración</h4>
        <p>Administra los parámetros generales del ecommerce.</p>
        <Separator />
        <div className="information container">
          <Parametros isEditing={false} />
        </div>
      </div>
    </>
  );
};

export default ConfiguracionPage;
