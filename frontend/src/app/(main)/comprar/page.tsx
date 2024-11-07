"use client";

import { SortOptions } from "@modules/store/components/refinement-list/sort-products";
import StoreTemplate from "@modules/store/templates";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

type Params = {
  searchParams: {
    sortBy?: SortOptions;
    page?: string;
  };
  params: {
    countryCode: string;
  };
};

function checkIfAuthenticated(session: any, status: string) {
  if (status !== "loading") {
    return session?.user?.id ? true : false;
  }
  return false;
}

export default function StorePage({ searchParams, params }: Params) {
  const { sortBy, page } = searchParams;
  const { data: session, status } = useSession();
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    if (checkIfAuthenticated(session, status)) {
      setIsAuthenticated(true);
      console.log("User is authenticated");
    } else {
      setIsAuthenticated(false);
      console.log("User is not authenticated");
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
