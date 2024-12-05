import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getTopSoldProducts } from "../../services/orders.service";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
    faChevronLeft,
    faChevronRight,
} from "@fortawesome/free-solid-svg-icons";

const MenuPage = () => {
    const [topProducts, setTopProducts] = useState<any[]>([]);
    const [meals, setMeals] = useState<any[]>([]);
    const [drinks, setDrinks] = useState<any[]>([]); // Added drinks state
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        const fetchTopSoldProducts = async () => {
            try {
                const products = await getTopSoldProducts();
                setTopProducts(products);
                console.log(products);
            } catch (error) {
                console.error("Error fetching top sold products:", error);
            }
        };

        const fetchMeals = async () => {
            try {
                const productsRes = await fetch(
                    "http://localhost:5000/api/get/products-by-type/Meal"
                );
                const products = await productsRes.json();
                setMeals(products);
                console.log(products);
            } catch (error) {
                console.error("Error fetching meals:", error);
            }
        };

        const fetchDrinks = async () => {
            try {
                const productsRes = await fetch(
                    "http://localhost:5000/api/get/products-by-type/Drink"
                );
                const products = await productsRes.json();
                setDrinks(products);
                console.log(products);
            } catch (error) {
                console.error("Error fetching drinks:", error);
            }
        };

        fetchTopSoldProducts();
        fetchMeals();
        fetchDrinks(); // Fetch drinks data
    }, []);

    // Automatically advance the carousel every 3 seconds
    useEffect(() => {
        const intervalId = setInterval(handleNext, 3000);

        return () => {
            clearInterval(intervalId); // Cleanup on component unmount
        };
    }, [topProducts]);

    const handleNext = () => {
        setCurrentIndex((prevIndex) => (prevIndex + 1) % topProducts.length);
    };

    const handlePrev = () => {
        setCurrentIndex(
            (prevIndex) =>
                (prevIndex - 1 + topProducts.length) % topProducts.length
        );
    };

    return (
        <main>
            <Navbar />

            {/* Carousel section for top products */}
            <section className="carousel-section h-[80vh]">
                <div className="container mx-auto flex justify-center items-center px-1.5 py-10 h-full">
                    <div className="carousel-container flex flex-col gap-5 items-center h-full w-full py-10">
                        <h1 className="text-4xl font-bold text-center title mb-10">
                            OUR BEST SELLERS
                        </h1>

                        <div className="relative w-full max-w-full">
                            {/* Carousel */}
                            <div className="relative w-full h-64 overflow-hidden rounded-lg">
                                {/* Navigation Arrows */}
                                <button
                                    onClick={handlePrev}
                                    className="absolute top-1/2 left-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-75 z-10"
                                >
                                    <FontAwesomeIcon icon={faChevronLeft} />
                                </button>
                                <button
                                    onClick={handleNext}
                                    className="absolute top-1/2 right-4 transform -translate-y-1/2 text-white bg-black bg-opacity-50 p-3 rounded-full hover:bg-opacity-75 z-10"
                                >
                                    <FontAwesomeIcon icon={faChevronRight} />
                                </button>
                            </div>

                            {/* Product name displayed in the center with 'title' class */}
                            {topProducts.length > 0 && (
                                <div className="absolute inset-0 flex justify-center items-center">
                                    <h1 className="text-7xl text-black font-bold title transition-all duration-1000 ease-in-out">
                                        {topProducts[currentIndex].product_name}
                                    </h1>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </section>

            {/* Meals Section */}
            <section className="menu-section">
                <div className="container mx-auto flex justify-center items-center px-1.5 py-10">
                    <div className="flex flex-col w-full px-24">
                        <div className="flex title-container w-full">
                            <h1 className="title text-3xl">Meals</h1>
                        </div>
                        <div className="rounded-box w-full flex overflow-x-auto justify-start items-center h-[18rem]">
                            {meals.map((meal: any) => (
                                <div
                                    key={meal.product_id}
                                    className="min-w-[15rem] mr-2 shadow-lg rounded-md border-2"
                                >
                                    <div className="img-container p-3 h-full">
                                        <img
                                            src={meal.product_image}
                                            className="h-[10rem] object-cover"
                                            alt={meal.product_name}
                                        />
                                    </div>
                                    <div className="bg-amber-950 p-3 rounded-b-lg">
                                        <h1 className="text-lg text-white title-reg text-center">
                                            {meal.product_name}
                                        </h1>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>

            {/* Drinks Section */}
            <section className="menu-section">
                <div className="container mx-auto flex justify-center items-center px-1.5 h-full">
                    <div className="flex flex-col w-full px-24">
                        <div className="flex title-container w-full">
                            <h1 className="title text-3xl">Drinks</h1>
                        </div>
                        <div className="w-full flex overflow-x-auto justify-start items-center h-[18rem]">
                            {drinks.map((drink: any) => (
                                <div
                                    key={drink.product_id}
                                    className="min-w-[15rem] mr-2 shadow-lg rounded-md border-2"
                                >
                                    <div className="img-container p-5 h-full">
                                        <img
                                            src={drink.product_image}
                                            className="h-[10rem] object-cover"
                                            alt={drink.product_name}
                                        />
                                    </div>
                                    <div className="bg-amber-950 p-3 rounded-b-lg">
                                        <h1 className="text-lg text-white title-reg text-center">
                                            {drink.product_name}
                                        </h1>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

//benjiez_wpstaging
// zdK~w3G3m%ZS
//7QZ6ebQhbRTxZa&%

export default MenuPage;
