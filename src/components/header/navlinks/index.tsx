import { Link, useLocation } from 'react-router-dom'

interface NavLinksProps {
    onLinkClick?: () => void;
}

const NavLinks = ({ onLinkClick }: NavLinksProps) => {
    const location = useLocation();

    const links = [
        { name: "Home", url: "" },
        { name: "Questions", url: "questions" },
        { name: "Bookmarks", url: "questions/bookmarks" },
        { name: "Quiz", url: "quiz" },
    ];

    const isActive = (url: string) => {
        const fullPath = "/" + url;
        // Home is exact match
        if (url === "") return location.pathname === "/";
        return location.pathname.startsWith(fullPath);
    };

    return (
        <div className="flex gap-3 justify-center items-center flex-wrap">
            {links.map((navLink, idx) => (
                <Link
                    key={idx}
                    to={"/" + navLink.url}
                    onClick={onLinkClick}
                    className={`${
                        isActive(navLink.url)
                            ? "text-bright-sun-400 border-t-2 border-bright-sun-400"
                            : "text-mine-shaft-400"
                    } px-1 hover:text-bright-sun-400 transition-colors`}
                >
                    {navLink.name}
                </Link>
            ))}
        </div>
    );
};

export default NavLinks;
