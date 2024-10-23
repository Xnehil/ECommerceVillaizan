"use client";

import InputWithLabel from "@/components/forms/inputWithLabel";
import React from "react";
import "@/styles/general.css";

interface CategoriasProps {
  isEditing: boolean;
}

const Categorias: React.FC<CategoriasProps> = ({ isEditing = false }) => {
  return (
    <div className="flex p-0 flex-col items-start gap-[16px] self-stretch w-full md:w-1/3">
      <h5>Categorías</h5>
      
    </div>
  );
};

export default Categorias;
