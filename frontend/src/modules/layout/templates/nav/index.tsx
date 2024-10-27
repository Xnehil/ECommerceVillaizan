"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { Button } from "@components/Button";
import { signOut } from "next-auth/react";
import axios from 'axios';

export async function handleSignOut() {
  await signOut();
}

export default function Nav() {
  const { data: session, status } = useSession();
  const [userName, setUserName] = useState('');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    async function fetchUserName() {
      if (session?.user?.id) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/usuario/${session.user.id}`);
          console.log("response", response);
          const user = response.data.usuario;
          if (user) {
            setUserName(user.nombre + ' ' + user.apellido);  // Assuming the backend returns { name: "User Name" }
          } else {
            console.error('Failed to fetch user name');
          }
        } catch (error) {
          console.error('Error fetching user name:', error);
        }
      }
    }

    fetchUserName();
  }, [session]);

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
            {/* Inicio Sesion */}
            {status === "loading" ? (
              <Button isLoading loaderClassname="w-6 h-6" variant="ghost"></Button>
            ) : session ? (
              <>
                <span className="text-lg text-white">Hola, {userName}</span>
                <div className="relative">
                  <img
                    src="/images/userIcon.png"
                    alt="Icon"
                    className="h-6 w-6 cursor-pointer"
                    onClick={toggleDropdown}
                  />
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <Link href="/cuenta" className="block px-4 py-2 text-gray-800 hover:bg-gray-200">
                        Ver cuenta
                      </Link>
                      <button
                        className="block w-full text-left px-4 py-2 text-gray-800 hover:bg-gray-200"
                        onClick={() => {
                          handleSignOut();
                          setIsDropdownOpen(false);
                        }}
                      >
                        Cerrar Sesión
                      </button>
                    </div>
                  )}
                </div>
              </>
            ) : (
              <div className="flex items-center">
                <Button className="text-lg text-white">
                  <Link
                    href="/login"
                    className="hover:text-ui-fg-base text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    ¡Inicia sesión y accede a promociones!
                  </Link>
                </Button>
                <img
                  src="/images/userIcon.png"
                  alt="Icon"
                  className="h-6 w-6 ml-2"
                />
              </div>
            )}
            
          </div>
        </nav>
      </header>
    </div>
  );
}
