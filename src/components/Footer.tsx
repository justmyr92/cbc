import { Link } from "react-router-dom";
import logo from "../assets/logo/logo 2.jpg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faFacebook,
    faInstagram,
    faTiktok,
} from "@fortawesome/free-brands-svg-icons";

const Footer = () => {
    return (
        <footer className="bg-amber-800 text-white py-5">
            <div className="container mx-auto flex h-full justify-between px-1.5 sm:flex-row flex-col">
                <div className="logo__container sm:w-[15%] w-full flex justify-center mb-4">
                    <img
                        src={logo}
                        alt={logo}
                        className="rounded-full sm:w-full w-[15%]"
                    />
                </div>
                <div className="footer__main__content flex flex-col items-center sm:w-[85%] w-full px-3.5 justify-center gap-5">
                    <div className="links flex justify-center w-full gap-10 sm:text-base text-sm">
                        <Link to="/home">
                            <h2 className="title">Home</h2>
                        </Link>
                        <Link to="/menu">
                            <h2 className="title">Menu</h2>
                        </Link>
                        <Link to="/promotions">
                            <h2 className="title">Promos</h2>
                        </Link>
                        <Link to="/store-locations">
                            <h2 className="title">Stores</h2>
                        </Link>
                    </div>

                    <div className="links flex justify-center w-full gap-10 sm:text-base text-sm">
                        {/* Facebook Link */}
                        <a
                            href="https://www.facebook.com/coffeebeercafe.batangas"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Facebook"
                        >
                            <FontAwesomeIcon
                                icon={faFacebook}
                                className="text-white sm:w-8 w-4 sm:h-8 h-4"
                            />
                        </a>

                        {/* Instagram Link */}
                        <a
                            href="https://www.instagram.com/coffeebeercafe_batangas_branch"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="Instagram"
                        >
                            <FontAwesomeIcon
                                icon={faInstagram}
                                className="text-white sm:w-8 w-4 sm:h-8 h-4"
                            />
                        </a>

                        {/* TikTok Link */}
                        <a
                            href="https://www.tiktok.com/@cbc.batangas"
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label="TikTok"
                        >
                            <FontAwesomeIcon
                                icon={faTiktok}
                                className="text-white sm:w-8 w-4 sm:h-8 h-4"
                            />
                        </a>
                    </div>

                    <hr className="w-[90%]" />
                    <div className="flex justify-center">
                        <p className="title text-center">
                            Coffee Beer Cafe &copy; 2023 All rights reserved.
                        </p>
                    </div>
                </div>
            </div>
        </footer>
    );
};

export default Footer;
