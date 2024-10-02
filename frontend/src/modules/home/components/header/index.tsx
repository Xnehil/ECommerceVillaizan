import Link from "next/link"

const Header = () => {
  return (
    <header className="bg-red-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/">
            <img
              src="/images/logo.PNG"
              alt="Helados Villaizan"
              className="h-12 inline-block"
            />
          </Link>
        </div>
        
        {/* Menú de Navegación */}
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/" className="hover:underline">
                Home
              </Link>
            </li>
            <li>
              <Link href="/comprar" className="hover:underline">
                Comprar
              </Link>
            </li>
            <li>
              <Link href="/sobre" className="hover:underline">
                Sobre
              </Link>
            </li>
            <li>
              <Link href="/contacto" className="hover:underline">
                Contacto
              </Link>
            </li>
          </ul>
        </nav>

        {/* Botón de Sesión */}
        <div>
          <Link href="/login" className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold">
            Inicia Sesión y accede a promociones!
          </Link>
        </div>
      </div>
    </header>
  )
}

export default Header
