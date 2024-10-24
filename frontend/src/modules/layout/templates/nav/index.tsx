"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';

export default function Nav() {
  const [loginUrl, setLoginUrl] = useState('');

  useEffect(() => {
    const currentUrl = window.location.href;
    setLoginUrl(`http://localhost:3000/login?redirect=${encodeURIComponent(currentUrl)}`);
  }, []);

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
            <a href={loginUrl} className="hover:text-ui-fg-base text-white flex items-center">
              Inicia Sesión y accede a promociones
            </a>
          </div>
        </nav>
      </header>
    </div>
  );
}