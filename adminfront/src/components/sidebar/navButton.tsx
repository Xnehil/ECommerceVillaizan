import Link from "next/link";

interface NavButtonProps {
    icon: string;
    title: string;
    path: string;
    active: boolean;
    count?: number;
}

const NavButton: React.FC<NavButtonProps> = ({
    icon,
    title,
    path,
    active,
    count,
}) => {
    return (
        <Link href={path} legacyBehavior>
            <a className={`nav-button ${active ? "active" : ""}`}>
                <div className="relative">
                    <img
                        src={icon}
                        alt={title}
                        className="h-6 w-6"
                        title={title}
                    />
                    {count && count > 0 ? (
                        <span className="count-badge">{count}</span>
                    ) : null}
                </div>
            </a>
        </Link>
    );
};

export default NavButton;
