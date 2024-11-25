const SERVER_URI = "https://kape-backend.onrender.com/api";

// Function to retrieve the token from local storage
const getToken = () => localStorage.getItem("token"); // Adjust based on your token storage method

export const getProductsWithCategories = async () => {
    const token = getToken();

    try {
        const response = await fetch(`${SERVER_URI}/get/products`, {
            method: "GET", // Specify the HTTP method
            headers: {
                "Content-Type": "application/json", // Specify the content type
                ...(token ? { jwt_token: token } : {}), // Conditionally add the token if it exists
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const managers = await response.json(); // Parse the JSON response
        return managers; // Return the list of managers
    } catch (error) {
        console.error("Error fetching managers:", error);
        throw error; // Propagate the error for further handling if needed
    }
};

export const getProductsWithCategoriesByType = async (type: string) => {
    try {
        const response = await fetch(
            `${SERVER_URI}/get/products-by-type/${type}`,
            {
                method: "GET", // Specify the HTTP method
                headers: {
                    "Content-Type": "application/json", // Specify the content type
                },
            }
        );

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const products = await response.json(); // Parse the JSON response
        console.log("asdas", products);
        return products; // Return the list of managers
    } catch (error) {
        console.error("Error fetching managers:", error);
        throw error; // Propagate the error for further handling if needed
    }
};

export const getCategories = async () => {
    const token = getToken();
    try {
        const response = await fetch(`${SERVER_URI}/get/categories`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { jwt_token: token } : {}),
            },
        });
        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const categories = await response.json();
        return categories;
    } catch (error) {
        console.error("Error fetching categories:", error);
        throw error;
    }
};
export const addProduct = async (formData: FormData) => {
    const token = getToken();
    try {
        const response = await fetch(`${SERVER_URI}/add/product`, {
            method: "POST",
            headers: {
                ...(token ? { jwt_token: token } : {}),
            },
            body: formData, // Sending form data directly
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const productsAdded = await response.json();
        return productsAdded;
    } catch (error) {
        console.error("Error adding products:", error);
        throw error;
    }
};

export const addCategory = async (
    categoryName: string,
    categoryImage: File
) => {
    const token = getToken();
    try {
        // Create a FormData object to hold the data
        const formData = new FormData();
        formData.append("categoryName", categoryName);
        formData.append("categoryImage", categoryImage); // Attach the image file

        const response = await fetch(`${SERVER_URI}/add/category`, {
            method: "POST",
            headers: {
                ...(token ? { jwt_token: token } : {}), // Include the JWT token if available
            },
            body: formData, // Send the FormData object as the request body
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const categoryAdded = await response.json();
        return categoryAdded.category_id;
    } catch (error) {
        console.error("Error adding category:", error);
        throw error;
    }
};

export const updateProduct = async (product_id: number, product: any) => {
    const token = getToken();

    const formData = new FormData();
    formData.append("product_name", product.product_name);
    formData.append("product_price", product.product_price.toString());
    formData.append("category_id", product.category_id.toString());

    if (product.product_image) {
        formData.append("product_image", product.product_image); // Only append if a new image is selected
    }

    try {
        const response = await fetch(
            `${SERVER_URI}/update/product/${product_id}`,
            {
                method: "PUT",
                headers: {
                    ...(token ? { jwt_token: token } : {}), // Include token if available
                },
                body: formData,
            }
        );

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const updatedProduct = await response.json();
        return updatedProduct;
    } catch (error) {
        console.error("Error updating product:", error);
        throw error;
    }
};

export const updateCategory = async (
    categoryId: number,
    categoryName: string
) => {
    const token = localStorage.getItem("token");

    const response = await fetch(
        `${SERVER_URI}/update/category/${categoryId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { jwt_token: token } : {}),
            },
            body: JSON.stringify({ category_name: categoryName }),
        }
    );

    if (!response.ok) {
        throw new Error("Error updating category");
    }

    const updatedCategory = await response.json();
    return updatedCategory;
};

// products.service.ts

export const updateCategoryStatus = async (
    categoryId: number,
    status: string
) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${SERVER_URI}/update/delete/category/${categoryId}`,
        {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { jwt_token: token } : {}),
            },
            body: JSON.stringify({ status }), // Sending the updated status
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update category status");
    }

    return await response.json();
};
