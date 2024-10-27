"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import axios from "axios";
import Loading from "@/components/Loading";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./columns";
import { Notificacion } from "@/types/PaqueteAjustes";

const NotificacionesPage: React.FC = () => {
  const notificaciones = useRef<Notificacion[]>([]); // Initialize notificaciones

  const a = useRef(0);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const fetchNotificaciones = async () => {
      if (notificaciones.current.length > 0) return;

      setIsLoading(true);

      try {
        a.current = a.current + 1;
        console.log(a.current);
        console.log("Fetching notificaciones");
        // Fetch notificaciones
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}notificaciones`
        );
        if (!response) {
          throw new Error("Failed to fetch notificaciones");
        }
        const data = await response.data;
        console.log("Notificaciones fetched:", data);

        const notificacionesData: Notificacion[] = data.notificaciones;
        notificaciones.current = notificacionesData;
        console.log("Notificaciones:", notificaciones.current);
        setIsLoading(false);
      } catch (error) {
        console.error("Failed to fetch notificaciones", error);
      }
    };

    if (a.current === 0) {
      fetchNotificaciones();
    }
  }, []);

  return (
    <>
      <div className="header">
        <div className="buttons-container">
          {/* No buttons needed here */}
        </div>
      </div>
      <div className="content-container">
        {isLoading && <Loading />}
        <h4>Notificaciones</h4>
        <p>
          Administra las notificaciones del sistema.
        </p>
        <div className="h-full w-full">
          <DataTable columns={columns} data={notificaciones.current} nombre="notificación" />
        </div>
      </div>
    </>
  );
};

export default NotificacionesPage;