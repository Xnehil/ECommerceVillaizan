"use client";

import React, { useState } from "react";
import "@/styles/general.css";
import Loading from "@/components/Loading";
import { Separator } from "@/components/ui/separator";
import Parametros from "@/app/configuracion/parametros";
import Categorias from "@/app/configuracion/categorias/categorias";
import Subcategorias from "@/app/configuracion/subcategorias/subcategorias";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import PlantillaPg from "@/app/configuracion/plantillas/plantillaPg";

const ConfiguracionPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState(false);
  return (
    <>
      <div className="content-container">
        {isLoading && <Loading />}
        <h4>Configuración</h4>
        <p>Administra los parámetros generales del ecommerce.</p>
        <Separator />

        <Tabs defaultValue="general" defaultChecked={true} className="w-full">
          <TabsList className="grid w-2/5 grid-cols-3">
            <TabsTrigger value="general">General</TabsTrigger>
            <TabsTrigger value="productos">Productos</TabsTrigger>
            <TabsTrigger value="plantilla">Plantilla de stock</TabsTrigger>
          </TabsList>
          <TabsContent className="w-full" value="general">
            <div className="information-container">
              <Parametros />
            </div>
          </TabsContent>
          <TabsContent value="productos">
            <h5>Productos</h5>
            <div className="information-container mt-4">
              <Categorias />
              <Subcategorias />
            </div>
          </TabsContent>
          <TabsContent value="plantilla">
            <div className="information-container">
              <PlantillaPg />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default ConfiguracionPage;
