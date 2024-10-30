"use client";

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useSession } from "next-auth/react";
import { Button } from "@components/Button";
import { signOut } from "next-auth/react";
import { cookies } from "next/headers"
import axios from 'axios';

const baseUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL

export async function handleSignOut() {
  document.cookie = "_medusa_cart_id=; max-age=0; path=/; secure; samesite=strict";
  document.cookie = "_medusa_pedido_id=; max-age=0; path=/; secure; samesite=strict";
  localStorage.removeItem('calle');
  localStorage.removeItem('dni');
  localStorage.removeItem('nombre');
  localStorage.removeItem('nroInterior');
  localStorage.removeItem('referencia');
  localStorage.removeItem('telefono');
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
      if(status !== "loading"){
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
            console.log("compara cartId")

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
            
            // Now we can use this function to get `_medusa_cart_id`
            const cartId = getCookie("_medusa_cart_id");
            
            console.log("cartId:", cartId);  // Check if cartId is being correctly retrieved
            
            if(cartId){
              const response = await axios.get(`${baseUrl}/admin/pedido/${cartId}`);
              const pedido = response.data.pedido;
              if(pedido){
                if(!pedido.usuario || (pedido.usuario.id !== session.user.id)){
                  //if not equal, update pedido.usuario.id to session.user.id
                  console.log("No coincide el usuario del pedido con el de la sesion")
                  await axios.put(`${baseUrl}/admin/pedido/${pedido.id}`, {
                    "usuario": {"id": session.user.id}
                  });
                }
              }
            }
            else{
              //search in bd if there is a pedido with the user id, if there is, put it on the cookie. the axios is axios.get(`${baseUrl}/admin/pedido/usuarioCarrito/${userId}`);
              const response = await axios.get(`${baseUrl}/admin/pedido/usuarioCarrito/${session.user.id}`);
              const pedido = response.data.pedido;
              if(pedido){
                console.log("Pedido encontrado", pedido)
                document.cookie = `_medusa_cart_id=${pedido.id}; max-age=604800; path=/; secure; samesite=strict`;
              }
            }
          } catch (error) {
            console.error('Error fetching user name:', error);
          }
        }
      }
    }


    fetchUserName();
  }, [status,session]);

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
                      <Link 
                        href="/cuenta" 
                        className="block px-4 py-2 text-gray-800 hover:bg-gray-200" 
                        onClick={() => setIsDropdownOpen(false)}
                      >
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
