interface NavButtonProps {
  icon: string;
  title: string;
  path: string;
  active: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, title, path, active }) => {
  return (
    <div className={`nav-button ${active ? "active" : ""}`}>
      <img src={icon} alt={title} className="h-6 w-6" title={title} />
    </div>
  );
};

export default NavButton;
