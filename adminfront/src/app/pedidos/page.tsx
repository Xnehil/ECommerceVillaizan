"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import Loading from "@/components/Loading";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useToast } from "@/hooks/use-toast";
import { Pedido } from "@/types/PaquetePedido";
import axios from "axios";
import Pendientes from "@/app/pedidos/pendientes/pendientes";
import Activos from "@/app/pedidos/activos/activos";
import Historial from "@/app/pedidos/historial/historial";

const PedidosPage: React.FC = () => {
  const pedPendientes = useRef<Pedido[]>([]);
  const pedActivos = useRef<Pedido[]>([]);
  const pedHistorial = useRef<Pedido[]>([]);

  const [isLoading, setIsLoading] = useState(false);
  const a = useRef(0);

  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    const fetchPedidos = async () => {
      if (
        pedPendientes.current.length > 0 ||
        pedActivos.current.length > 0 ||
        pedHistorial.current.length > 0
      )
        return;

      try {
        a.current = a.current + 1;
        console.log(a.current);
        console.log("Fetching pedidos");
        // Fetch pedidos
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}pedido?enriquecido=true&estado=noCarrito`
        );
        if (!response) {
          throw new Error("Failed to fetch pedidos");
        }
        const data = await response.data;
        console.log("Pedidos fetched:", data);

        const pedidosData: Pedido[] = data.pedidos;

        pedidosData.forEach((pedido) => {
          switch (pedido.estado) {
            case "solicitado":
              pedPendientes.current.push(pedido);
              break;
            case "verificado":
            case "enProgreso":
              pedActivos.current.push(pedido);
              break;
            case "entregado":
            case "cancelado":
              pedHistorial.current.push(pedido);
              break;
            default:
              // Handle any other states if necessary
              break;
          }
        });
      } catch (error) {
        console.error("Failed to fetch pedidos", error);
        toast({
          variant: "destructive",
          title: "Error",
          description:
            "No se pudieron cargar los pedidos. Por favor, intente de nuevo.",
        });
      } finally {
        setIsLoading(false);
      }
    };

    if (a.current === 0) {
      fetchPedidos();
    }
  }, []);

  return (
    <>
      <div className="content-container">
        {isLoading && <Loading />}
        <h4>Pedidos</h4>
        <p>Administra los pedidos realizados en el ecommerce.</p>

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
              {!isLoading && <Pendientes pendientes={pedPendientes} />}
            </div>
          </TabsContent>
          <TabsContent value="activos">
            <div className="information-container">
              {!isLoading && <Activos activos={pedActivos} />}
            </div>
          </TabsContent>
          <TabsContent value="historial">
            <div className="information-container">
              {!isLoading && <Historial historial={pedHistorial} />}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default PedidosPage;