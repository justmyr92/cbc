import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import logoIMG from "../assets/logo/logo.png";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";

interface NavLinks {
    id: number;
    path: string;
    name: string;
}

const Navbar = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [isScrolled, setIsScrolled] = useState(false);
    const location = useLocation();

    const links: NavLinks[] = [
        { id: 1, path: "/home", name: "Home" },
        { id: 2, path: "/menu", name: "Menu" },
        { id: 3, path: "/promotions", name: "Promos" },
        { id: 4, path: "/store-locations", name: "Store Locations" },
    ];

    // Handle scroll event
    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10);
        };

        window.addEventListener("scroll", handleScroll);

        return () => {
            window.removeEventListener("scroll", handleScroll);
        };
    }, []);

    // Close menu when a link is clicked (for mobile view)
    const handleLinkClick = () => setIsOpen(false);

    return (
        <nav
            className={`fixed top-0 left-0 w-full z-50 transition-all duration-300 ${
                isScrolled || isOpen ? "bg-white shadow-md" : "bg-transparent"
            }`}
        >
            <div className="container flex flex-wrap items-center justify-between mx-auto p-4">
                <Link
                    to="/"
                    className="flex items-center space-x-3 rtl:space-x-reverse"
                >
                    <img src={logoIMG} className="h-8" alt="logo.png" />
                </Link>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    type="button"
                    className={`inline-flex items-center p-2 w-10 h-10 justify-center text-sm 
                ${
                    isOpen
                        ? "bg-amber-950 text-white"
                        : "bg-transparent text-amber-950 hover:bg-amber-950 hover:text-white"
                } 
                rounded-lg md:hidden focus:outline-none focus:ring-2 focus:ring-amber-950`}
                    aria-controls="navbar-dropdown"
                    aria-expanded={isOpen}
                >
                    <FontAwesomeIcon icon={isOpen ? faTimes : faBars} />
                </button>

                <div
                    className={`${
                        isOpen ? "block" : "hidden"
                    } w-full md:block md:w-auto transition-all duration-300 ease-in-out`}
                    id="navbar-dropdown"
                >
                    <ul className="flex flex-col font-medium gap-1 py-4 md:py-0 mt-6 rounded-lg bg-white md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:bg-transparent">
                        {links.map((link) => (
                            <li key={link.id}>
                                <Link
                                    to={link.path}
                                    onClick={handleLinkClick}
                                    className={`block py-2 px-3 rounded transition-colors duration-200 ${
                                        location.pathname === link.path
                                            ? "bg-amber-950 text-white"
                                            : "text-amber-950 hover:bg-amber-900 hover:text-white"
                                    }`}
                                >
                                    {link.name}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
