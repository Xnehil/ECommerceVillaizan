"use client";

import "./globals.css";
import Sidebar from "@/components/sidebar";
import Breadcrumbs from "@/components/breadcrumbs";
import { Toaster } from "@/components/ui/toaster";
import { useEffect, useState, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";
import { SessionProvider, useSession } from "next-auth/react";
import axios from "axios";
import { toast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { SidebarProvider } from "../contexts/SidebarContext";

// Component to wrap the authentication and authorization logic
function AuthWrapper({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  // Check if we are on the login page (we should not apply authentication checks for login)
  const isLoginPage = pathname === "/login";

  useEffect(() => {
    const checkUser = async () => {
      // If the user is on the login page, skip authentication check
      if (isLoginPage) {
        return;
      }

      // Proceed with checks only if session is loaded and user exists
      if (status !== "loading" && session?.user?.id) {
        try {
          const userId = session.user.id;

          // Fetch user data from the backend
          const response: any = await axios.get(
            `${process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL}/admin/usuario/${userId}`
          );

          const usuario = response.data.usuario;

          // Check if the user has the "Administrador" role
          if (
            usuario &&
            usuario.rol &&
            usuario.rol.nombre === "Administrador"
          ) {
            setIsAuthenticated(true);
            setIsAdmin(true);
            // console.log("User is authenticated and has admin role");
          } else {
            // If not an admin, redirect to login
            console.log("User is not an admin");
            router.push("/login");
          }
        } catch (error) {
          console.error("Failed to fetch user data from database:", error);
          router.push("/login");
        }
      } else if (status !== "loading" && !session?.user?.id) {
        // If user is not authenticated, redirect to login
        console.log("User is not authenticated");
        router.push("/login");
      }
    };

    checkUser();
  }, [session, status, router, isLoginPage]);

  // Prevent rendering until authentication and role are confirmed
  if ((!isAuthenticated || !isAdmin) && !isLoginPage) return null;

  return (
    <>
      {!isLoginPage && (
        <div className="flex min-h-screen max-h-screen w-full">
          <Sidebar />
          <main className="flex-1 flex flex-col p-8 overflow-hidden">
            <Breadcrumbs />
            {children}
          </main>
        </div>
      )}
      {isLoginPage && <main className="w-full h-full">{children}</main>}
    </>
  );
}

// WebSocket Message Handling Logic
const mapearMensaje = (tipo: string, router: any, data: any) => {
  let dataBonita;
  switch (tipo) {
    case "nuevoPedido":
      dataBonita = {
        type: "Nuevo pedido",
        data: "Ha llegado un nuevo pedido, ve a la página de Pedidos para confirmarlo",
        action: "/pedidos",
        button: "Ver pedidos",
      };
      break;
    case "stockBajo":
      dataBonita = {
        type: "Stock bajo",
        data: data,
        action: "/motorizados",
        button: "Ver motorizados",
      };
      break;
    case "libroReclamaciones":
      dataBonita = {
        type: "Nuevo reclamo",
        data: data,
      };
      break;
    case "motorizadoOffline":
      dataBonita = {
        type: "Motorizado desconectado",
        data: JSON.parse(data).descripcion,
        action: "/pedidos",
        button: "Ver pedidos",
      };
      break;
    default:
      dataBonita = {
        type: "Mensaje de tipo: " + tipo,
        data: "Se ha recibido un mensaje: " + data,
        action: "/notificaciones",
        button: "Ver notificaciones",
      };
  }

  const buttonClassName =
    "text-black-600 mt-2 ml-6 p-2 rounded-md h-10" +
    (tipo === "nuevoPedido" ? "bg-white" : "");

  toast({
    title: dataBonita.type,
    variant: tipo === "nuevoPedido" ? "center" : "default",
    description: (
      <div className="flex justify-between items-center">
        <p>{dataBonita.data}</p>
        {dataBonita.action && dataBonita.button && (
          <ToastAction
            onClick={() => {
              router.push(dataBonita.action);
            }}
            altText="Ir a la página de notificaciones"
            className={buttonClassName}
          >
            {dataBonita.button}
          </ToastAction>
        )}
      </div>
    ),
  });
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const ws = useRef<WebSocket | null>(null);
  const url = process.env.NEXT_PUBLIC_WS_URL as string;
  const router = useRouter();

  useEffect(() => {
    // Initialize WebSocket connection
    ws.current = new WebSocket(
      url +
        "?rol=admin&id=" +
        Math.floor(Math.random() * 10000 + new Date().getTime() / 1000)
    );

    // Handle WebSocket open event
    ws.current.onopen = () => {
      console.log("WebSocket connection opened");
    };

    // Handle WebSocket message event
    ws.current.onmessage = (event) => {
      console.log("WebSocket message received:", event.data);

      try {
        // Parse the JSON string
        const data = JSON.parse(event.data);

        if (data.message) {
          toast({
            title: data.title ?? "",
            description: (
              <div>
                <p>{data.message}</p>
              </div>
            ),
          });
        } else if (data.type && data.data) {
          mapearMensaje(data.type, router, data.data);
        } else {
          console.error("Message property not found in WebSocket data:", data);
        }
      } catch (error) {
        console.error("Failed to parse WebSocket message:", error);
      }
    };

    // Handle WebSocket error event
    ws.current.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    // Handle WebSocket close event
    ws.current.onclose = () => {
      console.log("WebSocket connection closed");
    };

    // Cleanup on unmount
    return () => {
      if (ws.current) {
        ws.current.close();
      }
    };
  }, []);

  return (
    <SessionProvider>
        <SidebarProvider>
          <html lang="es">
            <body className="min-h-screen max-h-screen flex overflow-hidden">
              <AuthWrapper>{children}</AuthWrapper>
              <Toaster />
            </body>
          </html>
       </SidebarProvider>
    </SessionProvider>
  );
}
