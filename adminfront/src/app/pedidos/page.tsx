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
import Revision from "@/app/pedidos/revision/revision";
import Manual from "@/app/pedidos/manuales/manuales";
import { RefreshCcw } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

const PedidosPage: React.FC = () => {
  const pedPendientes = useRef<Pedido[]>([]);
  const pedActivos = useRef<Pedido[]>([]);
  const pedHistorial = useRef<Pedido[]>([]);
  const pedRevision = useRef<Pedido[]>([]);
  const pedManuales = useRef<Pedido[]>([]);
  const [refresh, setRefresh] = useState(false);
  const {refreshOrders, setRefreshOrders} = useSidebar();

  const [isLoading, setIsLoading] = useState(false);
  const a = useRef(0);

  const { toast } = useToast();

  useEffect(() => {
    setIsLoading(true);
    // console.log("a refresh", a.current);
    const fetchPedidos = async () => {
      // if (
      //   pedPendientes.current.length > 0 ||
      //   pedActivos.current.length > 0 ||
      //   pedHistorial.current.length > 0
      // )
      //   return;

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
        const data = response.data;
        console.log("Pedidos fetched:", data);

        const pedidosData: Pedido[] = data.pedidos.sort(
          (a: Pedido, b: Pedido) => {
            return (
              new Date(b.solicitadoEn ?? 0).getTime() -
              new Date(a.solicitadoEn ?? 0).getTime()
            );
          }
        );

        pedPendientes.current = [];
        pedActivos.current = [];
        pedHistorial.current = [];
        pedRevision.current = [];
        pedManuales.current = [];
          

        pedidosData.forEach((pedido) => {
          switch (pedido.estado.toLowerCase()) {
            case "solicitado":
              pedPendientes.current.push(pedido);
              break;
            case "verificado":
            case "enProgreso":
              pedActivos.current.push(pedido);
              break;
            case "entregado":
              // console.log(pedido);
              if (
                pedido.pedidosXMetodoPago &&
                pedido.pedidosXMetodoPago.length > 0
              ) {
                //detecta si el pedido fue pagado con yape o plin (total o parcialmente)
                if (!pedido.pagado) {
                  pedRevision.current.push(pedido);
                } else {
                  pedHistorial.current.push(pedido);
                }
              } else {
                if (!pedido.pagado) {
                  pedRevision.current.push(pedido);
                } else {
                  pedHistorial.current.push(pedido);
                }
              }

              break;
            case "cancelado":
              pedHistorial.current.push(pedido);
              break;
            case "fraudulento":
              pedHistorial.current.push(pedido);
              break;
            case "manual":
              pedManuales.current.push(pedido);
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
  }, [refresh]);

  return (
    <>
      <div className="content-container">
        {isLoading && <Loading />}
        <div className="flex items-center justify-between mb-4">
        <h4 className="text-lg font-semibold pr-3">Pedidos</h4>
        <button
          onClick={() => {
            a.current = 0;
            setRefresh(!refresh);
            setRefreshOrders(false);
          }}
          className={`flex items-center justify-center p-2 rounded ${
            refreshOrders
              ? 'bg-blue-500 hover:bg-blue-200 text-white'
              : 'bg-gray-100 hover:bg-gray-200 text-gray-700'
          }`}
          aria-label="Refresh Pedidos"
          title="Actualizar Pedidos"
        >
         <RefreshCcw size={16} />
        </button>
      </div>
        <p>Administra los pedidos realizados en el ecommerce.</p>

        <Tabs
          defaultValue="pendientes"
          defaultChecked={true}
          className="w-full"
        >
          <TabsList className="grid w-4/5 grid-cols-5">
            <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
            <TabsTrigger value="activos">Activos</TabsTrigger>
            <TabsTrigger value="revision">Pago por confirmar</TabsTrigger>
            <TabsTrigger value="manual">Manuales</TabsTrigger>
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
          <TabsContent value="revision">
            <div className="information-container">
              {!isLoading && <Revision revision={pedRevision} />}
            </div>
          </TabsContent>
          <TabsContent value="manual">
            <div className="information-container">
              {!isLoading && <Manual manual={pedManuales} />}
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
