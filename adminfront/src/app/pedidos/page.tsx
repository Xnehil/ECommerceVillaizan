"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import Loading from "@/components/Loading";
import { Separator } from "@/components/ui/separator";
import Parametros from "@/app/configuracion/parametros";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Pedido } from "@/types/PaquetePedido";

const PedidosPage: React.FC = () => {
  const pedidos = useRef<Pedido[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const a = useRef(0);

  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    setIsLoading(false);
  }, []);

  return (
    <>
      <div className="content-container">
        {isLoading && <Loading />}
        <h4>Pedidos</h4>
        <p>Administra los pedidos realizados en el ecommerce.</p>
        <Separator />

        <Tabs
          defaultValue="pendientes"
          defaultChecked={true}
          className="w-full"
        >
          <TabsList className="grid w-2/5 grid-cols-3">
            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            <TabsTrigger value="activos">Activos</TabsTrigger>
            <TabsTrigger value="historial">Historial</TabsTrigger>
          </TabsList>
          <TabsContent className="w-full" value="pendientes">
            <div className="information-container">
              <Parametros />
            </div>
          </TabsContent>
          <TabsContent value="activos">
            <div className="information-container">
              <Parametros />
            </div>
          </TabsContent>
          <TabsContent value="historial">
            <div className="information-container">
              <Parametros />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default PedidosPage;
