"use client";

import React from "react";
import { useRouter } from "next/navigation";
import "@/styles/general.css";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";
import InformacionGeneral from "./informacionGeneral";
import InformacionAdicional from "./informacionAdicional";

const AgregarPage: React.FC = () => {
  const router = useRouter();

  const handleCancel = () => {
    router.back();
  };

  return (
    <div className="content-container">
      <h4>Agregar producto</h4>
      <Separator />
      <div className="information-container">
        <InformacionGeneral />
        <InformacionAdicional />
        <div className="buttons-side-container">
          <div className="lower-buttons-container">
            <Button variant="secondary" onClick={handleCancel}>
              Cancelar
            </Button>
            <Button variant="default">Guardar</Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AgregarPage;
