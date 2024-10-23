"use client";

import React, { useEffect, useRef, useState } from "react";
import "@/styles/general.css";
import { Subcategoria } from "@/types/PaqueteProducto";
import axios from "axios";
import { Skeleton } from "@/components/ui/skeleton";
import { DataTable } from "@/components/datatable/data-table";
import { columns } from "./columns";

interface SubcategoriasProps {
  isEditing: boolean;
}

const Subcategorias: React.FC<SubcategoriasProps> = ({ isEditing = false }) => {
  const subcategories = useRef<Subcategoria[]>([]);
  const a = useRef(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchSubcategories = async () => {
      if (subcategories.current.length > 0) return;

      try {
        // console.log("Fetching categories");
        // console.log(a.current);
        a.current = a.current + 1;
        const responseSubcategories = await axios.get(
          `${process.env.NEXT_PUBLIC_BASE_URL}subcategoria`
        );

        if (!responseSubcategories) {
          throw new Error("Failed to fetch subcategories");
        }
        const data = await responseSubcategories.data;
        console.log("Subcategories fetched:", data);

        const subcategoriesData: Subcategoria[] = data.subcategorias;

        subcategories.current = subcategoriesData;

        console.log("Subategories:", subcategories.current);
      } catch (error) {
        console.error("Failed to fetch subcategories", error);
      } finally {
        setIsLoading(false);
      }
    };

    if (a.current === 0) {
      fetchSubcategories();
    }
  }, []);

  return (
    <div className="flex p-0 flex-col items-start gap-[16px] self-stretch w-full md:w-1/3">
      <h5>Subcategorías</h5>
      <div className="h-full w-4/5">
        {isLoading && (
          <div className="flex flex-col space-y-3">
            <Skeleton className="h-[125px] w-[250px] rounded-xl" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-[250px]" />
              <Skeleton className="h-4 w-[200px]" />
            </div>
          </div>
        )}
        {!isLoading && subcategories.current && (
          <DataTable
            columns={columns}
            data={subcategories.current}
            nombre="subcategoría"
            npagination={5}
          />
        )}
      </div>
    </div>
  );
};

export default Subcategorias;
