const SERVER_URI = "https://kape-backend.onrender.com/api";

// Function to retrieve the token from local storage
const getToken = () => localStorage.getItem("token"); // Adjust based on your token storage method

export const getStoreLocations = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${SERVER_URI}/get/store-locations`, {
            method: "GET",
            headers: {
                "Content-Type": "application/json", // Specify the content type
                ...(token ? { jwt_token: token } : {}), // Conditionally add the token if it exists
            },
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Function
export const addStoreLocation = async (storeDetails: any) => {
    try {
        const token = getToken();
        const response = await fetch(`${SERVER_URI}/add/store-location`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { jwt_token: token } : {}),
            },
            body: JSON.stringify(storeDetails),
        });

        if (!response.ok) {
            throw new Error("Network response was not ok");
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

// Function
export const updateStoreLocation = async (storeDetails: any) => {
    console.log("Updating store with details:", storeDetails); // Debugging line
    try {
        const token = getToken();
        const response = await fetch(`${SERVER_URI}/update/store-location`, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                ...(token ? { jwt_token: token } : {}),
            },
            body: JSON.stringify(storeDetails),
        });
        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(
                `Failed to update: ${response.status} - ${errorText}`
            );
        }
        return await response.json();
    } catch (error) {
        console.error("Error updating store location:", error);
        return null;
    }
};

export const deleteStoreLocation = async (storeId: string) => {
    const token = localStorage.getItem("token");
    const response = await fetch(
        `${SERVER_URI}/delete/store-location/${storeId}`,
        {
            method: "DELETE",
            headers: {
                ...(token ? { jwt_token: token } : {}),
            },
        }
    );

    if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Failed to delete: ${response.status} - ${errorText}`);
    }

    return await response.json();
};
