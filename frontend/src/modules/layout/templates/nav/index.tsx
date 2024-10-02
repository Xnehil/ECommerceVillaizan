import Link from "next/link"

export default async function Nav() {
  return (
    <div className="sticky top-0 inset-x-0 z-50 bg-rojoVillaizan">
      <header className="relative h-16 mx-auto border-b border-ui-border-base bg-rojoVillaizan">
        <nav className="content-container text-ui-fg-subtle flex items-center justify-between w-full h-full px-6">
          
          {/* Logo */}
          <div className="flex items-center h-full">
            <Link href="/" className="flex items-center">
              <img
                src="/images/logo.png"
                alt="Helados Villaizan"
                className="h-12"
              />
            </Link>
          </div>

          {/* Menú de navegación */}
          <div className="flex items-center gap-x-6">
            <Link href="/" className="hover:text-ui-fg-base text-white">
              Home
            </Link>
            <Link href="/comprar" className="hover:text-ui-fg-base text-white">
              Comprar
            </Link>
            <Link href="/sobre" className="hover:text-ui-fg-base text-white">
              Sobre
            </Link>
            <Link href="/contacto" className="hover:text-ui-fg-base text-white">
              Contacto
            </Link>
          </div>

          {/* Botón de sesión */}
          <div className="flex items-center gap-x-4">
            <Link href="/account" className="hover:text-ui-fg-base text-white flex items-center">
              Inicia sesión y accede a promociones!!
            </Link>
          </div>
        </nav>
      </header>
    </div>
  )
}
