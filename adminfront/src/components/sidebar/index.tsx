import "@/styles/sidebar.css";
import NavButton from "./navButton";
import { useEffect, useState } from "react";
import axios from "axios";
import { usePathname  } from "next/navigation";

const Sidebar = () => {
  const currentPath = usePathname();

  const logoIcon = "/icons/logo.png";
  const sidebarIcons = [
    { name: "Productos", icon: "/icons/productos.png", href: "/productos" },
    { name: "Motorizados", icon: "/icons/tuk-tuk.png", href: "/motorizados" },
    { name: "Pedidos", icon: "/icons/pedidos.png", href: "/pedidos" },
    { name: "Configuración", icon: "/icons/setting.png", href: "/configuracion" },
    { name: "Notificaciones", icon: "/icons/notificacion.png", href: "/notificaciones" },
    // { name: "Chatbot", icon: "/icons/chatbot.png", href: "/chatbot" },
  ];
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL;
  
  const [unreadNotifications, setUnreadNotifications] = useState(0);
  const [pendingOrders, setPendingOrders] = useState(0);

  const fetchCounts = async () => {
    try {
      // Fetch unread notifications count
      const notificationsResponse = await axios.get(baseUrl + "notificacion?rol=Admin&cantidad=true");
      setUnreadNotifications(notificationsResponse.data.cantidad);

      // Fetch pending orders count
      const ordersResponse = await axios.get(baseUrl + "pedido?estado=solicitado&cantidad=true");
      setPendingOrders(ordersResponse.data.cantidad);
    } catch (error) {
      console.error("Error fetching counts:", error);
    }
  };

  useEffect(() => {
    fetchCounts();
    const interval = setInterval(fetchCounts, 60000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="sidebar">
      <div className="upper-section">
        <img src={logoIcon} alt="Logo" className="w-10 h-10" />
        <div className="navbar">
          {sidebarIcons.map((icon) => (
            <NavButton
              key={icon.name}
              icon={icon.icon}
              title={icon.name}
              path={icon.href}
              active={currentPath.includes(icon.href)}
              count={
                icon.name === "Notificaciones" ? unreadNotifications :
                icon.name === "Pedidos" ? pendingOrders : undefined
              }
          />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
