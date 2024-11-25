import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { Carousel } from "flowbite-react";
import Footer from "../../components/Footer";

const PromotionPage = () => {
    const [promotions, setPromotions] = useState<any[]>([]);

    useEffect(() => {
        const fetchPromotions = async () => {
            try {
                const promoRes = await fetch(
                    "https://kape-backend.onrender.com/api/get-promos"
                );
                const promoData = await promoRes.json();
                setPromotions(promoData);
                console.log(promoData);
            } catch (error) {
                console.error("Error fetching promotions:", error);
            }
        };

        fetchPromotions(); // Fetch promotions data
    }, []);

    return (
        <main>
            <Navbar />

            <section className="section__top_orders h-[140vh]">
                <div className="container mx-auto flex flex-col justify-center items-center h-full px-1.5">
                    <div className="flex flex-col justify-center items-center">
                        <h2 className="text-3xl font-bold text-amber-900 uppercase title">
                            Our Promos
                        </h2>
                    </div>
                    <Carousel className="h-[50%]">
                        {promotions.length === 0 ? (
                            <div className="flex justify-center items-center h-96 w-full bg-amber-50 rounded-lg">
                                <span className="text-2xl text-amber-950">
                                    <h1 className="title">Upcoming Soon</h1>
                                </span>
                            </div>
                        ) : (
                            promotions.map((promo: any, index: number) => (
                                <img
                                    src={promo.promo_image}
                                    key={index}
                                    alt={promo.promo_image}
                                    className="mt-5 w-[90vw] h-96 object-contain rounded-lg"
                                />
                            ))
                        )}
                    </Carousel>
                </div>
            </section>
            <Footer />
        </main>
    );
};

export default PromotionPage;
