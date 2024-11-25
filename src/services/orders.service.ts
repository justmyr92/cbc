const SERVER_URI = "https://kape-backend.onrender.com/api";

// Function to retrieve the token from local storage
const getToken = () => localStorage.getItem("token"); // Adjust based on your token storage method

export const addOrder = async (orders: any) => {
    const token = getToken();

    console.log(orders, "asdasdasdas");
    try {
        const response = await fetch(`${SERVER_URI}/add/order`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json", // Specify the content type
                ...(token ? { jwt_token: token } : {}), // Conditionally add the token if it exists
            },
            body: JSON.stringify(orders), // Convert orders object to JSON string
        });

        if (!response.ok) {
            throw new Error(
                `Error: ${response.status} - ${response.statusText}`
            );
        }

        const data = await response.json();

        await addOrderList(data.order_id, orders.orderlist);
    } catch (error) {
        console.error("Error adding order:", error);
        throw error;
    }
};

const addOrderList = async (order_id: any, order_list: any) => {
    const token = getToken();

    try {
        // Combine order_id with each item in the order_list
        const formattedOrderList = order_list.map((item: any) => ({
            ...item, // Spread the existing properties of the item
            order_id, // Add the order_id to each item
        }));

        console.log(order_list, "Asdasd");

        // Use Promise.all to send all fetch requests
        const responses = await Promise.all(
            formattedOrderList.map(async (orderItem: any) => {
                const response = await fetch(`${SERVER_URI}/add/order-list`, {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        ...(token ? { jwt_token: token } : {}),
                    },
                    body: JSON.stringify(orderItem), // Send each item individually
                });

                // Check if the response is ok
                if (!response.ok) {
                    throw new Error(
                        `Error: ${response.status} - ${response.statusText}`
                    );
                }

                return await response.json(); // Return the parsed response data
            })
        );

        // Here you can return all the responses or process them further
        return responses; // Return all response data from the requests
    } catch (error) {
        console.error("Error adding order:", error);
        throw error;
    }
};

export const getOrders = async () => {
    const token = getToken();

    try {
        const response = await fetch(`${SERVER_URI}/get/orders`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { jwt_token: token } : {}),
            },
        });

        // Check if the response is ok
        if (!response.ok) {
            throw new Error(
                `Error: ${response.status} - ${response.statusText}`
            );
        }

        // Parse and return the JSON response
        return await response.json();
    } catch (error) {
        console.error("Error fetching orders list:", error);
        throw error;
    }
};

export const getSpecificOrders = async (year: string, storeId: string) => {
    const token = getToken();

    try {
        // Construct query parameters based on year and storeId
        const queryParams = new URLSearchParams({
            year,
            store_id: storeId,
        }).toString();

        const response = await fetch(
            `${SERVER_URI}/get/specific-orders?${queryParams}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { jwt_token: token } : {}),
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                `Error: ${response.status} - ${response.statusText}`
            );
        }

        // Parse and return the JSON response
        return await response.json();
    } catch (error) {
        console.error("Error fetching orders list:", error);
        throw error;
    }
};

export const getTopSoldProducts = async () => {
    try {
        // Make the GET request to the server
        const response = await fetch(`${SERVER_URI}/get/top-sold-products`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
            },
        });

        // Check if the response is ok
        if (!response.ok) {
            throw new Error(
                `Error: ${response.status} - ${response.statusText}`
            );
        }

        // Parse and return the JSON response
        return await response.json();
    } catch (error) {
        console.error("Error fetching top sold products:", error);
        throw error;
    }
};

export const getTopSoldProductsNoLimint = async (year: string) => {
    try {
        const token = getToken();

        // Make the GET request to the server
        const response = await fetch(
            `${SERVER_URI}/get/top-sold-products-no-limit/${year}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { jwt_token: token } : {}),
                },
            }
        );

        // Check if the response is ok
        if (!response.ok) {
            throw new Error(
                `Error: ${response.status} - ${response.statusText}`
            );
        }

        // Parse and return the JSON response
        return await response.json();
    } catch (error) {
        console.error("Error fetching top sold products:", error);
        throw error;
    }
};

export const getOrderList = async (order_id: number) => {
    const token = getToken();
    console.log(order_id);
    try {
        const response = await fetch(
            `${SERVER_URI}/get/order-list/${order_id}`,
            {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    ...(token ? { jwt_token: token } : {}),
                },
            }
        );

        // Check if the response is ok
        if (!response.ok) {
            throw new Error(
                `Error: ${response.status} - ${response.statusText}`
            );
        }

        // Parse and return the JSON response
        return await response.json();
    } catch (error) {
        console.error("Error fetching orders list:", error);
        throw error;
    }
};
