import { Carousel } from "flowbite-react";
import { useEffect, useState } from "react";
import { getTopSoldProducts } from "../../services/orders.service";
import Navbar from "../../components/Navbar";

const SamplePage = () => {
    const [topProducts, setTopProducts] = useState([]);

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

        fetchTopSoldProducts(); // Fetch promotions data
    }, []);
    return (
        <>
            <Navbar />
            <section className="section__top_orders h-[80vh] border">
                <div className="container mx-auto flex flex-col justify-center items-center h-full px-1.5">
                    <div className="flex flex-col justify-center items-center">
                        <h2 className="text-2xl font-bold text-amber-900 uppercase title">
                            Our Promos
                        </h2>
                    </div>
                    <Carousel className="h-[50%]">
                        {topProducts.map((product: any) => (
                            <div className="h-full border justify-center items-center flex">
                                <h1 className="title text-5xl">
                                    {" "}
                                    {product.product_name}
                                </h1>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </section>
        </>
    );
};

export default SamplePage;
