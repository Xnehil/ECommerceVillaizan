"use client";

import React, {  useState } from "react";
import "@/styles/general.css";
import Loading from "@/components/Loading";
import { Separator } from "@/components/ui/separator";
import Parametros from "@/app/configuracion/parametros";
import Categorias from "@/app/configuracion/categorias/categorias";
import Subcategorias from "@/app/configuracion/subcategorias/subcategorias";

const ConfiguracionPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <div className="content-container">
        {isLoading && <Loading />}
        <h4>Configuración</h4>
        <p>Administra los parámetros generales del ecommerce.</p>
        <Separator />
        <div className="information-container">
          <Parametros />
          <Categorias />
          <Subcategorias />
        </div>
      </div>
    </>
  );
};

export default ConfiguracionPage;
