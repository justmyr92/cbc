import { useEffect, useState } from "react";
import Navbar from "../../components/Navbar";
import { getTopSoldProducts } from "../../services/orders.service";
import { Carousel } from "flowbite-react";
import { getProductsWithCategoriesByType } from "../../services/products.service";
import Footer from "../../components/Footer";
import MealAndDrinkCategories from "../../components/MealAndDrinkCategories";

interface ProductInterface {
    product_id: number;
    product_name: string;
    product_price: string;
    category_id: number;
    product_image: string;
    product_type: string;
    category_name: string;
}

// Update the Category type to align with the existing type definition
type Category = {
    [categoryName: string]: {
        product_id: number;
        product_name: string;
        product_image: string;
    }[];
};

const MenuPage = () => {
    const [topProducts, setTopProducts] = useState<ProductInterface[]>([]);
    const [groupMealCategories, setGroupMealCategories] = useState<Category>(
        {}
    );
    const [groupDrinksCategories, setGroupDrinksCategories] =
        useState<Category>({});

    function groupProductsByCategory(products: ProductInterface[]): Category {
        return products.reduce((grouped: Category, product) => {
            const category = product.category_name;
            if (!grouped[category]) {
                grouped[category] = [];
            }
            grouped[category].push({
                product_id: product.product_id,
                product_name: product.product_name,
                product_image: product.product_image,
            });
            return grouped;
        }, {});
    }

    useEffect(() => {
        const fetchTopSoldProducts = async () => {
            try {
                const products = await getTopSoldProducts();
                setTopProducts(products);
            } catch (error) {
                console.error("Error fetching top sold products:", error);
            }
        };

        fetchTopSoldProducts();
    }, []);

    useEffect(() => {
        const fetchMeals = async () => {
            try {
                const meal_res = await getProductsWithCategoriesByType("meal");
                setGroupMealCategories(groupProductsByCategory(meal_res));
            } catch (error) {
                console.error("Error fetching meals:", error);
            }
        };

        const fetchDrinks = async () => {
            try {
                const drink_res = await getProductsWithCategoriesByType(
                    "drinks"
                );
                setGroupDrinksCategories(groupProductsByCategory(drink_res));
            } catch (error) {
                console.error("Error fetching drinks:", error);
            }
        };

        fetchMeals();
        fetchDrinks();
    }, []);

    return (
        <main>
            <Navbar />
            <section
                className="section__top_orders h-[80vh] bg-fixed bg-center bg-cover mt-[5rem]"
                style={{
                    backgroundImage: `url('https://images.pexels.com/photos/1307698/pexels-photo-1307698.jpeg?auto=compress&cs=tinysrgb&w=600')`,
                }}
            >
                <div className="container mx-auto flex flex-col justify-center items-center h-full px-1.5">
                    <h2 className="text-3xl font-bold text-white uppercase title">
                        Our Best Sellers
                    </h2>
                    <Carousel className="h-[50%]">
                        {topProducts.map((product) => (
                            <div
                                className="h-full justify-center items-center flex"
                                key={product.product_id}
                            >
                                <h1 className="title sm:text-5xl text-2xl text-white">
                                    {product.product_name}
                                </h1>
                            </div>
                        ))}
                    </Carousel>
                </div>
            </section>

            <section className="section__top_orders min-h-[100vh] py-10">
                <div className="container mx-auto h-full px-1.5">
                    <h2 className="text-3xl font-bold text-amber-900 uppercase title mb-10">
                        Menu
                    </h2>
                    <MealAndDrinkCategories
                        groupMealCategories={groupMealCategories}
                        groupDrinksCategories={groupDrinksCategories}
                    />
                </div>
            </section>
            <Footer />
        </main>
    );
};

export default MenuPage;
