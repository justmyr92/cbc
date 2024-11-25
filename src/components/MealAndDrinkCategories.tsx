import React from "react";

// Each product in a category
interface Product {
    product_id: number;
    product_name: string;
    product_image: string;
}

// A category is an object where the keys are category names and the values are arrays of products
type Category = {
    [categoryName: string]: Product[];
};
interface MealAndDrinkCategoriesProps {
    groupMealCategories: Category;
    groupDrinksCategories: Category;
}

const MealAndDrinkCategories: React.FC<MealAndDrinkCategoriesProps> = ({
    groupMealCategories,
    groupDrinksCategories,
}) => {
    const [selectedCategory, setSelectedCategory] = React.useState<
        string | null
    >(null);

    return (
        <div>
            {!selectedCategory ? (
                <>
                    <h2 className="text-2xl font-bold text-amber-900 uppercase title">
                        Meals
                    </h2>
                    <div className="meals flex gap-10 py-4 w-full mb-5 overflow-auto">
                        {Object.keys(groupMealCategories).map(
                            (categoryName) => (
                                <div
                                    key={categoryName}
                                    className="card bg-base-100 border shadow-3xl flex flex-col items-center cursor-pointer"
                                    onClick={() =>
                                        setSelectedCategory(categoryName)
                                    }
                                >
                                    <figure className="rounded-t-md px-3 py-2 h-60 w-60 flex justify-center items-center">
                                        <img
                                            src={
                                                groupMealCategories[
                                                    categoryName
                                                ][0]?.product_image
                                            }
                                            alt={categoryName}
                                            className="h-[90%] w-[90%] object-center object-contain rounded-full border-2 border-amber-950"
                                        />
                                    </figure>
                                    <div className="card-body w-full text-white bg-amber-900 px-3 py-3 rounded-b-md flex flex-col justify-center items-center">
                                        <h2 className="card-title title text-xl text-center">
                                            {categoryName}
                                        </h2>
                                    </div>
                                </div>
                            )
                        )}
                    </div>

                    <h2 className="text-2xl font-bold text-amber-900 uppercase title">
                        Drinks
                    </h2>
                    <div className="meals flex gap-10 py-4 w-full mb-5 overflow-auto">
                        {Object.keys(groupDrinksCategories).map(
                            (categoryName) => (
                                <div
                                    key={categoryName}
                                    className="card bg-base-100 border shadow-3xl flex flex-col items-center cursor-pointer"
                                    onClick={() =>
                                        setSelectedCategory(categoryName)
                                    }
                                >
                                    <figure className="rounded-t-md px-3 py-2 h-60 w-60 flex justify-center items-center">
                                        <img
                                            src={
                                                groupDrinksCategories[
                                                    categoryName
                                                ][0]?.product_image
                                            }
                                            alt={categoryName}
                                            className="h-[90%] w-[90%] object-center object-contain rounded-full border-2 border-amber-950"
                                        />
                                    </figure>
                                    <div className="card-body w-full text-white bg-amber-900 px-3 py-3 rounded-b-md flex flex-col justify-center items-center">
                                        <h2 className="card-title title text-xl text-center">
                                            {categoryName}
                                        </h2>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </>
            ) : (
                <div>
                    <button
                        className="btn bg-amber-900 text-white hover:bg-amber-900 mb-5"
                        onClick={() => setSelectedCategory(null)}
                    >
                        Back to Categories
                    </button>
                    <div className="meals flex gap-10 py-4 w-full mb-5 overflow-auto">
                        {(
                            groupMealCategories[selectedCategory] ||
                            groupDrinksCategories[selectedCategory]
                        ).map((product) => (
                            <div
                                key={product.product_id}
                                className="card bg-base-100 border shadow-3xl flex flex-col items-center"
                            >
                                <figure className="rounded-t-md px-3 py-2 h-60 w-60 flex justify-center items-center">
                                    <img
                                        src={product.product_image}
                                        alt={product.product_name}
                                        className="h-[90%] w-[90%] object-center object-contain rounded-full border-2 border-amber-950"
                                    />
                                </figure>
                                <div className="card-body w-full text-white bg-amber-900 px-3 py-3 rounded-b-md flex flex-col justify-center items-center">
                                    <h2 className="card-title title text-xl text-center">
                                        {product.product_name}
                                    </h2>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default MealAndDrinkCategories;
