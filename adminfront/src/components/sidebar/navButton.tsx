import Link from "next/link";

interface NavButtonProps {
  icon: string;
  title: string;
  path: string;
  active: boolean;
}

const NavButton: React.FC<NavButtonProps> = ({ icon, title, path, active }) => {
  return (
    <Link href={path} legacyBehavior>
      <a className={`nav-button ${active ? "active" : ""}`}>
        <img src={icon} alt={title} className="h-6 w-6" title={title} />
      </a>
    </Link>
  );
};

export default NavButton;
