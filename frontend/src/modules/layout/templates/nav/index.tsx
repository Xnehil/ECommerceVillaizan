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

  useEffect(() => {
    async function fetchUserName() {
      if (session?.user?.id) {
        try {
          const response = await axios.get(`${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/usuario/${session.user.id}`);
          console.log("response", response);
          const user = response.data.usuario;
          if (user) {
            setUserName(user.nombre);  // Assuming the backend returns { name: "User Name" }
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
            {status === "loading" ? (
              <Button isLoading loaderClassname="w-6 h-6" variant="ghost"></Button>
            ) : session ? (
              <>
                <span className="text-lg text-white">Bienvenido, {userName}</span>
                <Button
                  className="text-lg text-white"
                  onClick={() => {
                    handleSignOut();
                    setIsMobileMenuOpen(false);
                  }}
                >
                  Cerrar sesión
                </Button>
              </>
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
