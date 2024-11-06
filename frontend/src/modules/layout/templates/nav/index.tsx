"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { Button } from "@components/Button";
import { signOut } from "next-auth/react";
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL;

export async function handleSignOut() {
  document.cookie = "_medusa_cart_id=; max-age=0; path=/; secure; samesite=strict";
  document.cookie = "_medusa_pedido_id=; max-age=0; path=/; secure; samesite=strict";
  //if localStorage is not empty, remove all the data
  if (localStorage.length > 0) {
    localStorage.removeItem('calle');
    localStorage.removeItem('dni');
    localStorage.removeItem('nombre');
    localStorage.removeItem('nroInterior');
    localStorage.removeItem('referencia');
    localStorage.removeItem('telefono');
  }
  await signOut();
}

export default function Nav() {
  const { data: session, status } = useSession();
  const [userName, setUserName] = useState('');
  const [isErrorPopupVisible, setIsErrorPopupVisible] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const toggleDropdown = () => {
    setIsDropdownOpen(!isDropdownOpen);
  };

  useEffect(() => {
    async function fetchUserName() {
      if (status !== "loading") {
        if (session?.user?.id) {
          try {
            const response = await axios.get(`${baseUrl}/admin/usuario/${session.user.id}`);
            const user = response.data.usuario;
            if (user) {
              setUserName(user.nombre + ' ' + user.apellido);
            } else {
              console.error('Failed to fetch user name');
              setIsErrorPopupVisible(true);
            }

            const getCookie = (name: string) => {
              const value = `; ${document.cookie}`;
              const parts = value.split(`; ${name}=`);
              if (parts.length === 2) {
                const part = parts.pop();
                if (part) {
                  return part.split(';').shift();
                }
              }
              return null;
            };

            const cartId = getCookie("_medusa_cart_id");

            if (cartId) {
              const response = await axios.get(`${baseUrl}/admin/pedido/${cartId}`);
              const pedido = response.data.pedido;
              if (pedido) {
                if (!pedido.usuario || (pedido.usuario.id !== session.user.id)) {
                  await axios.put(`${baseUrl}/admin/pedido/${pedido.id}`, {
                    "usuario": { "id": session.user.id }
                  });
                }
              }
            } else {
              const response = await axios.get(`${baseUrl}/admin/pedido/usuarioCarrito/${session.user.id}`);
              const pedido = response.data.pedido;
              if (pedido) {
                document.cookie = `_medusa_cart_id=${pedido.id}; max-age=604800; path=/; secure; samesite=strict`;
              }
            }
          } catch (error) {
            console.error('Error fetching user name:', error);
            setIsErrorPopupVisible(true);
            if (axios.isAxiosError(error)) {
              if (error.response) {
                console.error(`Server error: ${error.response.status}`);
              } else if (error.request) {
                console.error('Network error: Please check your internet connection.');
              } else {
                console.error('An unexpected error occurred.');
              }
            } else {
              console.error('An unexpected error occurred.');
            }
          }
        }
      }
    }

    fetchUserName();
  }, [status, session]);

  return (
    <div className="sticky top-0 inset-x-0 z-50 bg-rojoVillaizan">
      <header className="relative h-16 mx-auto border-b border-ui-border-base bg-rojoVillaizan">
        <nav className="content-container text-ui-fg-subtle flex items-center justify-between w-full h-full px-6">
          {/* Logo */}
          <div className="flex items-center h-full">
            <Link href="/" className="flex items-center">
              <img src="/images/logo.png" alt="Helados Villaizan" className="h-12" />
            </Link>
          </div>

          {/* Main Navigation */}
          <div className="flex items-center gap-x-6">
            <Link href="/" className="hover:text-ui-fg-base text-white">Home</Link>
            <Link href="/comprar" className="hover:text-ui-fg-base text-white">Comprar</Link>
            
            {status === "loading" ? (
              <Button isLoading loaderClassname="w-6 h-6" variant="ghost"></Button>
            ) : session ? (
              <>
                <span className="text-lg text-white">Hola, {userName}</span>
                <div className="relative">
                  <img src="/images/userIcon.png" alt="Icon" className="h-6 w-6 cursor-pointer" onClick={toggleDropdown} />
                  {isDropdownOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10">
                      <Link href="/cuenta" className="block px-4 py-2 text-gray-800 hover:bg-gray-200" onClick={() => setIsDropdownOpen(false)}>
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
                  <Link href="/login" className="hover:text-ui-fg-base text-white" onClick={() => setIsMobileMenuOpen(false)}>
                    ¡Inicia sesión y accede a promociones!
                  </Link>
                </Button>
                <img src="/images/userIcon.png" alt="Icon" className="h-6 w-6 ml-2" />
              </div>
            )}
          </div>
        </nav>
      </header>

      {/* Error Popup */}
      {isErrorPopupVisible && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-md shadow-md text-center">
            <p className="text-black-600 mb-4">No se pudo cargar los datos de la cuenta. Por favor, intenta nuevamente</p>
            <button
              style={styles.confirmButton}
              onClick={() => {
                setIsErrorPopupVisible(false); // Hide popup
                handleSignOut(); // Sign out
                window.location.href = "/"; // Redirect to home
              }}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const styles = {
  confirmButton: {
    padding: '10px 20px',
    borderRadius: '5px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'black',
    color: 'white',
  },
}
