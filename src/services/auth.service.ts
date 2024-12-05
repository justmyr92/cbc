const SERVER_URI: string = "http://localhost:5000/api";
const getToken = () => localStorage.getItem("token"); // Adjust based on your token storage method

export const addUser = async (email: string, password: string) => {
    try {
        const response = await fetch(`${SERVER_URI}/add/user`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                Authorization: "Bearer " + localStorage.getItem("token"),
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Failed to add user");
        }

        const users = await response.json();
        return users;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const loginUser = async (email: string, password: string) => {
    try {
        const response = await fetch(`${SERVER_URI}/login`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify({ email, password }),
        });

        if (!response.ok) {
            throw new Error("Failed to login");
        }

        const data = await response.json();
        // Optionally, store the token in localStorage if the login is successful
        if (data.token) {
            localStorage.setItem("token", data.token);
            localStorage.setItem("role", data.user.role);
            localStorage.setItem("store_id", data.user.store_id);
        }
        return data;
    } catch (error) {
        console.error(error);
        return null;
    }
};

export const authUser = async () => {
    try {
        const token = getToken();
        const response = await fetch(`${SERVER_URI}/auth-verify`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
                ...(token ? { jwt_token: token } : {}), // Conditionally add the token if it exists
            },
        });

        if (!response.ok) {
            throw new Error("Failed to authenticate user");
        }

        const user = await response.json();
        return user; // Return user data if token is valid
    } catch (error) {
        console.error("Authentication failed:", error);
        return null;
    }
};
