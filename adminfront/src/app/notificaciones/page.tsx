"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import axios from "axios";
import Loading from "@/components/Loading";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./columns";
import { Notificacion } from "@/types/PaqueteAjustes";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useSidebar } from "@/contexts/SidebarContext";

const NotificacionesPage: React.FC = () => {
  const [notificaciones, setNotificaciones] = useState<Notificacion[]>([]); // Initialize notificaciones


  const a = useRef(0);
  const [isLoading, setIsLoading] = useState(false);
  const [filterTipo, setFilterTipo] = useState<string | null>(null);
  const [filterLeido, setFilterLeido] = useState<boolean | null>(null);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");

  const {incrementNotificaciones, decrementNotificaciones} = useSidebar();

  useEffect(() => {
    const fetchNotificaciones = async () => {
      if (notificaciones.length > 0) return;

      setIsLoading(true);

      try {
        a.current = a.current + 1;
        console.log(a.current);
        console.log("Fetching notificaciones");
        // Fetch notificaciones
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}notificacion?rol=Admin`
        );
        if (!response) {
          throw new Error("Failed to fetch notificaciones");
        }
        const data = await response.data;
        console.log("Notificaciones fetched:", data);

        const notificacionesData: Notificacion[] = data.notificaciones
        setNotificaciones(notificacionesData);
        console.log("Notificaciones:", notificaciones);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch notificaciones", error);
      }
    };

    if (a.current === 0) {
      fetchNotificaciones();
    }
  }, []);

  const filteredAndSortedData = notificaciones.filter((notificacion) => {
    if (filterTipo && filterTipo !== "all" && notificacion.tipoNotificacion !== filterTipo) {
      return false;
    }
    if (filterLeido !== null && notificacion.leido !== filterLeido) {
      return false;
    }
    return true;
  })
  .sort((a, b) => {
    if (sortOrder === "asc") {
      return new Date(a.creadoEn).getTime() - new Date(b.creadoEn).getTime();
    } else {
      return new Date(b.creadoEn).getTime() - new Date(a.creadoEn).getTime();
    }
  });

  const handleMarkAsRead = async (id: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}notificacion/${id}`,
        { leido: true }
      );
      console.log(`Marked notification ${id} as read`);
      setNotificaciones((prevNotificaciones) =>
        prevNotificaciones.map((notificacion) =>
          notificacion.id === id ? { ...notificacion, leido: true } : notificacion
        )
      );
      decrementNotificaciones();
    } catch (error) {
      console.error(`Failed to mark notification ${id} as read`, error);
    }
  };

  const handleMarkAsUnread = async (id: string) => {
    try {
      await axios.put(
        `${process.env.NEXT_PUBLIC_BASE_URL}notificacion/${id}`,
        { leido: false }
      );
      console.log(`Marked notification ${id} as unread`);
      setNotificaciones((prevNotificaciones) =>
        prevNotificaciones.map((notificacion) =>
          notificacion.id === id ? { ...notificacion, leido: false } : notificacion
        )
      );
      incrementNotificaciones();
    } catch (error) {
      console.error(`Failed to mark notification ${id} as unread`, error);
    }
  };

  return (
    <>
      <div className="header">

      </div>
      <div className="content-container">
        {isLoading && <Loading />}
        <h4>Notificaciones</h4>
        <div className="buttons-container flex space-x-4">
        <Select onValueChange={(value) => setFilterTipo(value)} value={filterTipo || ""}>
            <SelectTrigger className="w-48">
            <SelectValue placeholder="Tipo de notificación">
                {filterTipo === "all" ? "Cualquiera" : filterTipo === "motorizado" ? "Motorizados" : "Pedidos"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cualquiera</SelectItem>
              <SelectItem value="motorizado">Motorizados</SelectItem>
              <SelectItem value="pedido">Pedidos</SelectItem>
              <SelectItem value="general">General</SelectItem>
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => setFilterLeido(value === "true" ? true : value === "false" ? false : null)} value={filterLeido !== null ? filterLeido.toString() : ""}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Estado de lectura">
                {filterLeido === null ? "Cualquiera" : filterLeido ? "Leído" : "No leído"}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Cualquiera</SelectItem>
              <SelectItem value="false">No leído</SelectItem>
              <SelectItem value="true">Leído</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")} variant="outline" className="flex items-center space-x-2">
            <span>Ordenar por fecha</span>
            {sortOrder === "asc" ? <ArrowUp className="h-4 w-4" /> : <ArrowDown className="h-4 w-4" />}
          </Button>
        </div>
        <div className="h-full w-full">
          <DataTable  columns={columns(handleMarkAsRead, handleMarkAsUnread)} data={filteredAndSortedData} nombre="notificación" checkLeido={true} />
        </div>
      </div>
    </>
  );
};

export default NotificacionesPage;