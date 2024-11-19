"use client";

import { Text, clx } from "@medusajs/ui";
import Link from "next/link";

export default async function Footer() {
  const enlaces = [
    {
      id: 1,
      title: "Inicio",
      handle: "home",
    },
    {
      id: 2,
      title: "Catálogo",
      handle: "store",
    },
    {
      id: 3,
      title: "Acerca",
      handle: "contact",
    },
    {
      id: 4,
      title: "Contacto",
      handle: "contact",
    },
  ];

  const ayuda = [
    {
      id: 1,
      title: "Opciones de pago",
      handle: "pagos",
    },
    {
      id: 2,
      title: "Devoluciones",
      handle: "devoluciones",
    },
    {
      id: 3,
      title: "Política de privacidad",
      handle: "terms-conditions",
    },
  ];

  return (
    <footer className="border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-20">
          <div>
            <Link
              href="/"
              className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase font-poppins"
              style={{
                fontSize: "24px",
                fontStyle: "normal",
                fontWeight: 700,
                lineHeight: "normal",
              }}
            >
              Helados Villaizan
            </Link>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
            {enlaces && enlaces.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <ul
                  className={clx(
                    "grid grid-cols-1 gap-2 text-ui-fg-subtle txt-small",
                    {
                      "grid-cols-2": (enlaces?.length || 0) > 8,
                    }
                  )}
                >
                  {enlaces?.slice(0, 6).map((c) => (
                    <li key={c.id}>
                      <Link className="hover:text-ui-fg-base" href={`/${c.handle}`}>
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                {ayuda.map((c) => (
                  <li key={c.id}>
                    <Link className="hover:text-ui-fg-base" href={`/${c.handle}`}>
                      {c.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>

            {/* Nueva columna con la imagen enlazada */}
            <div className="flex flex-col gap-y-2 items-center">
              <Link href="/librodereclamaciones">
                <img
                  src="/images/libroReclamaciones.png"
                  alt="Libro de Reclamaciones"
                  className="w-20 h-auto mt-2 cursor-pointer"
                />
              </Link>
            </div>
          </div>
        </div>
        <div className="flex w-full mb-16 justify-between text-ui-fg-muted">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} Helados Villaizan. Todos los derechos reservados.
          </Text>
        </div>
      </div>
    </footer>
  );
}
