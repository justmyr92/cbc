import { Link } from "react-router-dom";
import Navbar from "../../components/Navbar";
import coffeeBeerCup from "../../assets/customer/coffee-beer-cup.png";
import cofferBeerCupPreview from "../../assets/customer/coffee_beer_cafe_preview.mp4";
import frappe from "../../assets/customer/frappe_img.png";
import pizza from "../../assets/customer/pizza_img.png";
import chicken from "../../assets/customer/chicken_img.png";
import Footer from "../../components/Footer";

const HomePage = () => {
    return (
        <main>
            <Navbar />
            <section className="hero__section sm:h-screen h-[50vh]">
                <div className="container flex flex-wrap items-center justify-between mx-auto p-4 h-full">
                    <div className="hero__main__content h-full sm:w-[55%] w-[full] flex flex-col gap-8 justify-center">
                        <div className="subtitle__container">
                            <h1 className="sm:text-5xl text-3xl text-amber-950">
                                Start your day with coffee.
                                <br />
                                End your day with bear.
                            </h1>
                        </div>
                        <div className="button__container">
                            <Link
                                to={"/menu"}
                                className="cta__btn rounded-lg border border-amber-950 bg-amber-950 text-white text-lg px-3 py-2.5 uppercase"
                            >
                                Discover Menu
                            </Link>
                        </div>
                    </div>
                    <div className="hero__image__contents s h-full w-[45%] items-center justify-center hidden sm:flex">
                        <img
                            src={coffeeBeerCup}
                            alt="coffee-beer-cup.png"
                            className="h-full"
                        />
                    </div>
                </div>
            </section>
            <section className="video__section sm:h-[80vh] h-[50vh] bg-gray-950 ">
                <div className="container mx-auto flex h-full justify-between px-1.5">
                    <div className="video__main__content flex w-full h-full gap-8 justify-center">
                        <video
                            className="w-full object-cover"
                            src={cofferBeerCupPreview}
                            autoPlay
                            loop
                            muted
                            playsInline
                        />
                    </div>
                </div>
            </section>
            <section className="drinks__demo__section sm:h-[80vh] h-fit">
                <div className="container items-center p-4 mx-auto flex sm:flex-row flex-col h-full justify-between sm:px-1.5 sm:py-8 sm:gap-10 gap-5">
                    <div className="drinks__image__content h-full sm:w-1/2 w-full">
                        <img
                            src={frappe}
                            alt="frappe.png"
                            className="h-full w-full object-cover"
                        />
                    </div>
                    <div className="drinks__main__content h-full sm:w-1/2 w-full flex flex-col gap-8 justify-center">
                        <div className="subtitle__container">
                            <h1 className="sm:text-4xl text-3xl text-amber-950">
                                Take a sip and let the frappe do the talking.
                            </h1>
                        </div>
                        <div className="button__container">
                            <Link
                                to={"/menu"}
                                className="cta__btn rounded-lg duration-500 transition border border-amber-950 bg-text text-amber-950 text-lg px-3 py-2.5 uppercase hover:text-white hover:bg-amber-950"
                            >
                                Sip and Go
                            </Link>
                        </div>
                    </div>
                </div>
            </section>{" "}
            <section className="explore__demo__section">
                <div className="container items-center p-4 mx-auto flex sm:flex-row flex-col h-full justify-between sm:px-1.5 sm:py-8 sm:gap-10 gap-5">
                    <div className="flex flex-col justify-start sm:w-1/2 w-full gap-5">
                        <div className="explore__image__content">
                            <img
                                src={pizza}
                                alt="pizza.png"
                                className="sm:w-[90%] w-full"
                            />
                        </div>

                        <div className="subtitle__container">
                            <h1 className="sm:text-4xl text-3xl text-amber-950">
                                Savoring every moment and every bite.
                            </h1>
                        </div>
                        <div className="button__container">
                            <Link
                                to={"/menu"}
                                className="cta__btn rounded-lg duration-500 transition border border-amber-950 bg-text text-amber-950 text-lg px-3 py-2.5 uppercase hover:text-white hover:bg-amber-950"
                            >
                                Explore
                            </Link>
                        </div>
                    </div>
                    <div className="flex flex-col justify-start sm:w-1/2 w-full gap-5">
                        <div className="explore__image__content">
                            <img
                                src={chicken}
                                alt="chicken.png"
                                className="sm:w-[90%] w-full"
                            />
                        </div>

                        <div className="subtitle__container">
                            <h1 className="sm:text-4xl text-3xl text-amber-950">
                                Winging my way to happiness, one bite at a time
                            </h1>
                        </div>
                        <div className="button__container">
                            <Link
                                to={"/menu"}
                                className="cta__btn rounded-lg duration-500 transition border border-amber-950 bg-text text-amber-950 text-lg px-3 py-2.5 uppercase hover:text-white hover:bg-amber-950"
                            >
                                Explore
                            </Link>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />
        </main>
    );
};

export default HomePage;
