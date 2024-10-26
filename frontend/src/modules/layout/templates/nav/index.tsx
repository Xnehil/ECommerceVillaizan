"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { Loader2 } from "lucide-react";
import { Button } from "@components/Button";
import { signOut } from "next-auth/react";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

export async function handleSignOut() {
  await signOut();
}

export default function Nav() {
  const [loginUrl, setLoginUrl] = useState('');
  const { data: session, status } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  /*
  useEffect(() => {
    const currentUrl = window.location.href;
    setLoginUrl(`http://localhost:3000/login?redirect=${encodeURIComponent(currentUrl)}`);
  }, []);
  */

  useEffect(() => {
    
    if (session) {
      console.log('Session:', session);
      console.log('id:', session.user?.id); // Log the user name
      console.log('User name:', session.user?.name); // Log the user name
      console.log('email:', session.user?.email); // Log the user name
      console.log('status:', status); // Log the user name
      //console the cookie
      console.log('cookie:', document.cookie);
    }
  }, [session, status]);

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

            {/*Antiguo Iniciar Sesión*/}
            {/*<a href={loginUrl} className="hover:text-ui-fg-base text-white flex items-center">
              Inicia Sesión y accede a promociones
            </a> 

            <div className="z-[51] hidden items-center space-x-2 md:flex">
              {status === "loading" ? (
                <Loader2 className="h-4 w-4 animate-spin mr-3"></Loader2>
              ) : session ? (
                <Button className="text-lg font-bold" onClick={() => handleSignOut()} variant="link">
                  Cerrar sesión
                </Button>
              ) : (
                <a href={loginUrl} className="hover:text-ui-fg-base text-white flex items-center">
                  Inicia Sesión y accede a promociones
                </a>
              )}
            </div> */}
            {status === "loading" ? (
              <Button isLoading loaderClassname="w-6 h-6" variant="ghost"></Button>
            ) : session ? (
              <Button
                className="text-lg text-white"
                onClick={() => {
                  handleSignOut();
                  setIsMobileMenuOpen(false);
                }}
              >
                Cerrar sesión
              </Button>
            ) : (
              <Button className="text-lg text-white">
                <Link
                  href="/login"
                  className="text-lg text-white hover:underline"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  Iniciar sesión
                </Link>
              </Button>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
}