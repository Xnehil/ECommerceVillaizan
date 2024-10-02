import { Text, clx } from "@medusajs/ui"

import { getCategoriesList, getCollectionsList } from "@lib/data"

import LocalizedClientLink from "@modules/common/components/localized-client-link"
import MedusaCTA from "@modules/layout/components/medusa-cta"
import Link from "next/link"

export default async function Footer() {
  // const { collections } = await getCollectionsList(0, 6)
  // const { product_categories } = await getCategoriesList(0, 6)
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
  ]

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
    {
      id: 4,
      title: "Libro de reclamaciones",
      handle: "reclamaciones",
    },
  ]

  return (
    <footer className="border-t border-ui-border-base w-full">
      <div className="content-container flex flex-col w-full">
        <div className="flex flex-col gap-y-6 xsmall:flex-row items-start justify-between py-20">
          <div>
            <Link
              href="/"
              className="txt-compact-xlarge-plus text-ui-fg-subtle hover:text-ui-fg-base uppercase font-poppins"
              style={{fontSize: "24px", fontStyle: "normal", fontWeight: 700, lineHeight: "normal" }}
            >
              Helados Villaizan
            </Link>
          </div>
          <div className="text-small-regular gap-10 md:gap-x-16 grid grid-cols-2 sm:grid-cols-3">
            {/* {product_categories && product_categories?.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  Links
                </span>
                <ul className="grid grid-cols-1 gap-2" data-testid="footer-categories">
                  {product_categories?.slice(0, 6).map((c) => {
                    if (c.parent_category) {
                      return
                    }

                    const children =
                      c.category_children?.map((child) => ({
                        name: child.name,
                        handle: child.handle,
                        id: child.id,
                      })) || null

                    return (
                      <li
                        className="flex flex-col gap-2 text-ui-fg-subtle txt-small"
                        key={c.id}
                      >
                        <LocalizedClientLink
                          className={clx(
                            "hover:text-ui-fg-base",
                            children && "txt-small-plus"
                          )}
                          href={`/categories/${c.handle}`}
                          data-testid="category-link"
                        >
                          {c.name}
                        </LocalizedClientLink>
                        {children && (
                          <ul className="grid grid-cols-1 ml-3 gap-2">
                            {children &&
                              children.map((child) => (
                                <li key={child.id}>
                                  <LocalizedClientLink
                                    className="hover:text-ui-fg-base"
                                    href={`/categories/${child.handle}`}
                                    data-testid="category-link"
                                  >
                                    {child.name}
                                  </LocalizedClientLink>
                                </li>
                              ))}
                          </ul>
                        )}
                      </li>
                    )
                  })}
                </ul>
              </div>
            )} */}
            {enlaces && enlaces.length > 0 && (
              <div className="flex flex-col gap-y-2">
                <span className="txt-small-plus txt-ui-fg-base">
                  Links
                </span>
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
                      <Link
                        className="hover:text-ui-fg-base"
                        href={`/${c.handle}`}
                      >
                        {c.title}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <div className="flex flex-col gap-y-2">
              <span className="txt-small-plus txt-ui-fg-base">Medusa</span>
              <ul className="grid grid-cols-1 gap-y-2 text-ui-fg-subtle txt-small">
                {
                  ayuda.map((c) => (
                    <li key={c.id}>
                      <Link
                        className="hover:text-ui-fg-base"
                        href={`/${c.handle}`}
                      >
                        {c.title}
                      </Link>
                    </li>
                  ))
                }
              </ul>
            </div>
          </div>
        </div>
        <div className="flex w-full mb-16 justify-between text-ui-fg-muted">
          <Text className="txt-compact-small">
            © {new Date().getFullYear()} Helados Villaizan. Todos los derechos reservados.
          </Text>
          {/* <MedusaCTA /> */}
        </div>
      </div>
    </footer>
  )
}
