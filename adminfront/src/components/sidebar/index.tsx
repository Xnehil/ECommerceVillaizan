import "@/styles/sidebar.css";
import NavButton from "./navButton";

const Sidebar = () => {
  const logoIcon = "/icons/logo.png";
  const sidebarIcons = [
    { name: "Productos", icon: "/icons/productos.png", href: "/productos" },
    { name: "Motorizados", icon: "/icons/tuk-tuk.png", href: "/motorizados" },
    { name: "Pedidos", icon: "/icons/pedidos.png", href: "/pedidos" },
    { name: "Configuración", icon: "/icons/setting.png", href: "/configuracion" },
    { name: "Notificaciones", icon: "/icons/notificacion.png", href: "/notificaciones" },
    // { name: "Chatbot", icon: "/icons/chatbot.png", href: "/chatbot" },
  ];
  // const pathname

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
              active={true}
              // {pathname.startsWith(`/${icon.name.toLowerCase()}`)}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
