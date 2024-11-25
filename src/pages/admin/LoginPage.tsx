import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import bg from "../../assets/admin/admin_login_page_bg.png";
import logo2 from "../../assets/logo/logo 2.jpg";
import logo from "../../assets/logo/logo.png";
import { authUser, loginUser } from "../../services/auth.service";

const LoginPage = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();

    // Check for token in local storage on component mount

    useEffect(() => {
        const verifyUser = async () => {
            const isVerified = await authUser();
            console.log("isVerified", isVerified);
            if (isVerified) {
                navigate("/dashboard"); // Redirect if token is invalid
            }
        };

        verifyUser();
    }, [navigate]);

    const handleLogin = async (event: React.FormEvent) => {
        event.preventDefault();
        setError(null);

        const response = await loginUser(email, password);
        if (response && response.token) {
            localStorage.setItem("token", response.token); // Store the token
            navigate("/dashboard"); // Redirect to the dashboard
        } else {
            setError("Login failed. Please check your credentials.");
        }
    };

    return (
        <section
            className="login__section h-screen"
            style={{
                backgroundImage: `url(${bg})`,
                backgroundRepeat: "no-repeat",
                backgroundSize: "cover",
                backgroundPosition: "bottom",
            }}
        >
            <div className="container flex justify-center h-full mx-auto p-[5rem]">
                <div className="login__container w-full h-full flex">
                    <div className="logo__container w-1/2 bg-gray-300 h-full flex justify-center items-center gap-4 flex-col bg-opacity-90">
                        <img
                            src={logo2}
                            alt="Logo"
                            className="rounded-full w-80 h-80 object-cover"
                        />
                        <h1 className="text-6xl">COFFEE BEER CAFE</h1>
                    </div>
                    <div className="login__form__container w-1/2 bg-white h-full flex justify-center items-center gap-4 p-10 flex-col">
                        <img
                            src={logo}
                            alt="logo.png"
                            className="h-28 object-cover"
                        />
                        <form
                            onSubmit={handleLogin}
                            className="login__form w-full h-full flex flex-col gap-4 p-3"
                        >
                            <h3 className="text-3xl text-center uppercase">
                                Login
                            </h3>
                            <div className="login__form__input flex flex-col gap-2">
                                <label
                                    htmlFor="email"
                                    className="text-sm font-medium"
                                >
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    className="border border-gray-300 rounded-lg p-5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    required
                                />
                            </div>

                            <div className="login__form__input flex flex-col gap-2">
                                <label
                                    htmlFor="password"
                                    className="text-sm font-medium"
                                >
                                    Password
                                </label>
                                <input
                                    type="password"
                                    id="password"
                                    value={password}
                                    onChange={(e) =>
                                        setPassword(e.target.value)
                                    }
                                    placeholder="Enter your password"
                                    className="border border-gray-300 rounded-lg p-5 focus:outline-none focus:ring-2 focus:ring-amber-500"
                                    required
                                />
                            </div>

                            {error && (
                                <div className="text-red-500 text-sm">
                                    {error}
                                </div>
                            )}

                            <button
                                type="submit"
                                className="bg-amber-500 text-white rounded-lg text-lg p-5 hover:bg-amber-600 transition duration-200"
                            >
                                Login
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default LoginPage;
