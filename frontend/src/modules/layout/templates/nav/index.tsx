import { Suspense } from "react"

import { listRegions } from "@lib/data"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import SideMenu from "@modules/layout/components/side-menu"
import Link from "next/link"

export default async function Nav() {
  const regions = await listRegions().then((regions) => regions)

  return (
    <div className="sticky top-0 inset-x-0 z-50 group bg-rojoVillaizan">
      <header className="relative h-16 mx-auto border-b duration-200 border-ui-border-base bg-rojoVillaizan">
        <nav className="content-container txt-xsmall-plus text-ui-fg-subtle flex items-center justify-between w-full h-full text-small-regular bg-rojoVillaizan text-white">
          {/* <div className="flex-1 basis-0 h-full flex items-center">
            <div className="h-full">
              <SideMenu regions={regions} />
            </div>
          </div> */}

          <div className="flex items-center h-full">
            <Link
              href="/"
              className="txt-compact-xlarge-plus hover:text-ui-fg-base uppercase"
              data-testid="nav-store-link"
            >
              Logo Villaizan
            </Link>
          </div>

          <div className="flex items-center gap-x-6 h-full flex-1 basis-0 justify-end">
            <div className="hidden small:flex items-center gap-x-6 h-full">
              { (
                <Link
                  className="hover:text-ui-fg-base"
                  href="/search"
                  scroll={false}
                >
                  Busca tu helado
                </Link>
              )}
              <Link
                className="hover:text-ui-fg-base"
                href="/account"
                data-testid="nav-account-link"
              >
                Inicia sesión y accede a promociones
              </Link>
            </div>
          </div>
        </nav>
      </header>
    </div>
  )
}
