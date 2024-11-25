"use client";

import { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import StoreTemplate from "@modules/store/templates";
import { useSession } from "next-auth/react";
import { useEffect, useRef, useState } from "react";

type Params = {
  searchParams: {
    sortBy?: SortOptions;
    page?: string;
  };
  params: {
    countryCode: string;
  };
};


export default function StorePage({ searchParams, params }: Params) {
  const { sortBy, page } = searchParams;
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const hasRunOnceAuth = useRef(false);

  useEffect(() => {
    if(status !== "loading" && !hasRunOnceAuth.current) {
      hasRunOnceAuth.current = true;
      if (session?.user?.id) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  }, [session, status]);

  return (
    <>
      {/* Banner debajo del header */}
      <img
        src="/images/bannerFlujoCompra.png"
        alt="Promociones en Villaizan"
        style={{
          width: '100%',
          height: 'auto',
        }}
      />
      {/* Contenido de la tienda */}
      <StoreTemplate
        sortBy={sortBy}
        page={page}
        countryCode={params.countryCode}
        isAuthenticated={isAuthenticated}
      />
    </>
  );
}
