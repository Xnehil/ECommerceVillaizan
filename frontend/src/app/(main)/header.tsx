import Link from "next/link"

const Header = () => {
  const currentUrl = window.location.href;
  const loginUrl = `http://localhost:3000/login?redirect=${encodeURIComponent(currentUrl)}`;

  return (
    <header className="bg-red-600 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link href="/">
            <a>
              <img
                src="/logo.png"
                alt="Helados Villaizan"
                className="h-12 inline-block"
              />
            </a>
          </Link>
        </div>
        
        {/* Menú de Navegación */}
        <nav>
          <ul className="flex space-x-6">
            <li>
              <Link href="/">
                <a className="hover:underline">Home</a>
              </Link>
            </li>
            <li>
              <Link href="/comprar">
                <a className="hover:underline">Comprar</a>
              </Link>
            </li>
            <li>
              <Link href="/sobre">
                <a className="hover:underline">Sobre</a>
              </Link>
            </li>
            <li>
              <Link href="/contacto">
                <a className="hover:underline">Contacto</a>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Botón de Sesión */}
        <div>
          {/*<Link href="/login"> <a className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold">
              Inicia Sesión y accede a promociones!
            </a>
          </Link>*/}
          <Link href="/login"> <a className="bg-white text-red-600 px-4 py-2 rounded-lg font-bold">
              ¡Inicia Sesión y accede a promociones!
            </a>
          </Link>*
        </div>
      </div>
    </header>
  )
}

export default Header
