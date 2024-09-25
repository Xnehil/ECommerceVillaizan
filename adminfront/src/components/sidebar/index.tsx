import "@/styles/sidebar.css";
import NavButton from "./navButton";

const Sidebar = () => {
  const logoIcon = "/icons/logo.png";
  const sidebarIcons = [{ name: "Productos", icon: "/icons/productos.png" }];
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
              path={`/${icon.name.toLowerCase()}`}
              active={true}
            />  
          ))}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
