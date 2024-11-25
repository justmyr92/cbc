import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Sidebar from "../../components/Sidebar";
import { getStoreLocations } from "../../services/stores.service";
import {
    getSpecificOrders,
    getTopSoldProductsNoLimint,
} from "../../services/orders.service";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js"; // Import necessary chart.js components
import { Bar, Pie } from "react-chartjs-2";
import Recommendation from "../../components/Recommendation";
import {
    getCategories,
    getProductsWithCategories,
} from "../../services/products.service";
import { authUser } from "../../services/auth.service";
import SalesLineChart from "../../components/SalesLineChart";

// Register the components to Chart.js
ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement
);

interface Order {
    order_id: number;
    order_date: string; // You can also use Date if you want to parse it directly
    order_type: string;
    store_id: number;
    transaction_number: number;
    total_amount: string; // If you prefer to handle it as a number, you can change this to number
    store_name: string;
}

const DashboardPage = () => {
    const navigate = useNavigate();
    const [stores, setStores] = useState([]); // Stores array
    const [orders, setOrders] = useState<Order[]>([]);
    const [saleType, setSaleType] = useState<any>({}); // Sales data by store
    const [monthlySales, setMonthlySales] = useState<number[]>([]); // Monthly sales is an array of numbers
    const [year, setYear] = useState("2024"); // Default year set to "All"
    const [salesCount, setSalesCount] = useState(0); // Total sales count
    const [productsCount, setProductsCount] = useState(0); // Total products count
    const [totalSales, setTotalSales] = useState(0); // Total sales amount
    const [categoryCount, setCategoryCount] = useState(0); // Total categories count
    const [store, setStore] = useState("All"); // Default store set to "All"
    const [topSold, setTopSold] = useState([]);
    const storeID: string = localStorage.getItem("store_id") || "";
    console.log(storeID);

    const months = [
        "Jan",
        "Feb",
        "Mar",
        "Apr",
        "May",
        "Jun",
        "Jul",
        "Aug",
        "Sep",
        "Oct",
        "Nov",
        "Dec",
    ];

    useEffect(() => {
        const verifyUser = async () => {
            const isVerified = await authUser(); // Await the authUser function
            console.log(isVerified);
            if (!isVerified) {
                navigate("/admin/login"); // Redirect if token is invalid or doesn't exist
            } else {
                const role = localStorage.getItem("role"); // Check the user's role from localStorage
                if (role === "manager") {
                    setStore(storeID); // Set store from localStorage if not a manager
                } else {
                    setStore("All"); // Set store to "All" if not a manager
                }
                // Fetch store locations and orders if the token is verified
                fetchStores();
                fetchOrders();
                fetchSold();
            }
        };

        verifyUser();
    }, [navigate, year, store]);

    // Fetch store locations
    const fetchStores = async () => {
        const data = await getStoreLocations();
        if (data) {
            setStores(data);
        }
    };

    const fetchSold = async () => {
        const data = await getTopSoldProductsNoLimint(year);
        if (data) {
            console.log("haha", data);
            setTopSold(data);
        }
    };

    const fetchOrders = async () => {
        const data = await getSpecificOrders(year, store);
        const categories_count = await getCategories();
        const products_count = await getProductsWithCategories();
        if (data) {
            setOrders(data as Order[]);
            setMonthlySales(getMonthlySales(data)); // Assuming getMonthlySales accepts Order[] as well
            const salesData = setSalesData(data); // Updated sales data
            console.log(getMonthlySales(data), "ASd");
            console.log(data, "asd");
            console.log(
                calculatePercentageChanges(getMonthlySales(data)),
                "ASd"
            );

            setSaleType(salesData); // Store the sales data for further use
            setSalesCount(data.length);
            setCategoryCount(categories_count.length); // Update categories count
            setProductsCount(products_count.length);
            setTotalSales(
                data.reduce(
                    (sum: any, order: any) =>
                        sum + parseFloat(order.total_amount),
                    0
                )
            );
        }
    };

    // Function to calculate the percentage changes for monthly sales data
    const calculatePercentageChanges = (amounts: any) => {
        let percentages = [];
        // Start with "0%" for the first month (no previous month to compare)
        percentages.push("0%");
        // Loop through the sales data and calculate the percentage change for each month
        for (let i = 1; i < amounts.length; i++) {
            const currentValue = amounts[i];
            const previousValue = amounts[i - 1];
            // Handle edge case when previous value is 0
            if (previousValue === 0) {
                if (currentValue === 0) {
                    percentages.push("0%"); // No change if both are 0
                } else {
                    percentages.push("100%"); // First increase from 0 to non-zero is 100%
                }
            } else if (currentValue === 0) {
                // Calculate the percentage decrease if the current value is 0
                const change =
                    ((currentValue - previousValue) / previousValue) * 100;
                percentages.push(`${change.toFixed(2)}%`);
            } else {
                // Normal percentage change calculation
                const change =
                    ((currentValue - previousValue) / previousValue) * 100;
                percentages.push(`${change.toFixed(2)}%`);
            }
        }

        return percentages;
    };

    // Function to update the months array with the calculated percentage changes
    const updateMonthsWithPercentage = () => {
        const updatedMonths = [];

        // Calculate the percentage changes for all months
        const percentageChanges = calculatePercentageChanges(monthlySales);

        // Loop through the months array and append the percentage change to each month
        for (let i = 0; i < months.length; i++) {
            // Add the percentage change next to the month name
            updatedMonths.push(`${months[i]} (${percentageChanges[i]})`);
        }

        return updatedMonths;
    };

    const getMonthlySales = (orders: Order[]) => {
        const monthlySales = Array(12).fill(0); // Create an array to hold sales for each month (0-11)

        orders.forEach((order) => {
            const orderDate = new Date(order.order_date);
            const monthIndex = orderDate.getUTCMonth(); // Get month index (0 for January, 11 for December)
            const amount = parseFloat(order.total_amount); // Convert total_amount to a float

            monthlySales[monthIndex] += amount; // Add the amount to the corresponding month
        });

        return monthlySales;
    };

    const setSalesData = (orders: Order[]) => {
        const salesByStore: {
            [key: string]: { dineIn: number; takeOut: number };
        } = {};

        orders.forEach((order) => {
            const storeId = order.store_id.toString();
            const amount = parseFloat(order.total_amount);

            if (!salesByStore[storeId]) {
                salesByStore[storeId] = { dineIn: 0, takeOut: 0 };
            }

            if (order.order_type === "Dine In") {
                salesByStore[storeId].dineIn += amount;
            } else if (order.order_type === "Take Out") {
                salesByStore[storeId].takeOut += amount;
            }
        });

        return salesByStore;
    };

    const chartData = {
        labels: updateMonthsWithPercentage(), // Labels for months
        datasets: [
            {
                label: "Monthly Sales",
                data: monthlySales, // Monthly sales data
                backgroundColor: "rgba(75, 192, 192, 0.2)", // Bar color
                borderColor: "rgba(75, 192, 192, 1)", // Border color
                borderWidth: 1,
            },
        ],
    };

    const pieChart = {
        labels: ["Dine In", "Take Out"],
        datasets: [
            {
                label: "Sales by Store",
                data: [
                    // Sum of Dine In and Take Out sales for each store
                    Object.values(saleType).reduce(
                        (acc, sales: any) => acc + sales.dineIn,
                        0
                    ),
                    Object.values(saleType).reduce(
                        (acc, sales: any) => acc + sales.takeOut,
                        0
                    ),
                ],
                backgroundColor: [
                    "rgba(75, 192, 192, 0.2)", // Dine In color
                    "rgba(255, 99, 132, 0.2)", // Take Out color (You can customize this color)
                ],
                borderColor: [
                    "rgba(75, 192, 192, 1)", // Dine In border color
                    "rgba(255, 99, 132, 1)", // Take Out border color
                ],
                borderWidth: 1,
            },
        ],
    };

    return (
        <section className="dashboard flex h-screen">
            <Sidebar />
            <main className="main__container h-full w-4/5 p-5 overflow-auto">
                <div className="main__header flex justify-between items-center">
                    <h1 className="main__title text-3xl uppercase">
                        Dashboard
                    </h1>
                </div>

                <hr className="border border-amber-600 my-3" />

                {/* Control Box */}
                <div className="control-box flex items-start space-x-4 mb-4">
                    {/* Year Selector */}
                    <div className="year-selector">
                        <label htmlFor="year" className="mr-2">
                            Year
                        </label>
                        <select
                            id="year"
                            value={year}
                            onChange={(e) => setYear(e.target.value)}
                            className="select select-bordered"
                        >
                            <option value="2024">2024</option>
                            <option value="2023">2023</option>
                            <option value="2022">2022</option>
                            {/* Add more years as needed */}
                        </select>
                    </div>

                    {/* Store Selector */}
                    {!localStorage.getItem("store_id") ? (
                        <div className="store-selector">
                            <label htmlFor="store" className="mr-2">
                                Store
                            </label>
                            <select
                                id="store"
                                value={store}
                                onChange={(e) => setStore(e.target.value)}
                                className="select select-bordered"
                            >
                                <option value="All">All</option>
                                {stores.map((store: any) => (
                                    <option
                                        key={store.store_id}
                                        value={store.store_id}
                                    >
                                        {store.store_name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ) : (
                        ""
                    )}
                </div>
                {/* 3d2a21, 5d422b, 281811,644e43,  442a13 */}
                {/* <div className="stats shadow mb-4 w-full text-white">
                    <div className="stat bg-[#3d2a21]">
                        <div className="stat-figure">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 12l6-6 6 6"
                                ></path>
                            </svg>
                        </div>
                        <div className="stat-title">Total Sales</div>
                        <div className="stat-value">{salesCount}</div>
                        <div className="stat-desc">Items sold</div>
                    </div>

                    <div className="stat bg-[#5d422b]">
                        <div className="stat-figure text-secondary">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 9V3l-7 9h7v7l9-11h-7z"
                                ></path>
                            </svg>
                        </div>
                        <div className="stat-title">Total Products</div>
                        <div className="stat-value text-secondary">
                            {productsCount}
                        </div>
                        <div className="stat-desc">Available products</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-success">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                ></path>
                            </svg>
                        </div>
                        <div className="stat-title">Total Sales Amount</div>
                        <div className="stat-value text-success">
                            Php {totalSales.toLocaleString()}
                        </div>
                        <div className="stat-desc">Total revenue</div>
                    </div>

                    <div className="stat">
                        <div className="stat-figure text-warning">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                ></path>
                            </svg>
                        </div>
                        <div className="stat-title">Total Categories</div>
                        <div className="stat-value text-warning">
                            {categoryCount}
                        </div>
                        <div className="stat-desc">
                            Number of product categories
                        </div>
                    </div>
                </div> */}

                <div className="stats shadow mb-4 w-full text-white">
                    <div className="stat bg-white">
                        <div className="stat-figure text-[#3d2a21]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M6 12l6-6 6 6"
                                ></path>
                            </svg>
                        </div>
                        <div className="stat-title text-[#3d2a21]">
                            Total Sales
                        </div>
                        <div className="stat-value text-[#3d2a21]">
                            {salesCount}
                        </div>
                        <div className="stat-desc text-[#3d2a21]">
                            Items sold
                        </div>
                    </div>

                    <div className="stat bg-white">
                        <div className="stat-figure text-[#5d422b]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 9V3l-7 9h7v7l9-11h-7z"
                                ></path>
                            </svg>
                        </div>
                        <div className="stat-title text-[#5d422b]">
                            Total Products
                        </div>
                        <div className="stat-value text-[#5d422b]">
                            {productsCount}
                        </div>
                        <div className="stat-desc text-[#5d422b]">
                            Available products
                        </div>
                    </div>

                    <div className="stat bg-white">
                        <div className="stat-figure text-[#644e43]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M4 6h16M4 12h16m-7 6h7"
                                ></path>
                            </svg>
                        </div>
                        <div className="stat-title text-[#644e43]">
                            Total Sales Amount
                        </div>
                        <div className="stat-value text-[#644e43]">
                            Php {totalSales.toLocaleString()}
                        </div>
                        <div className="stat-desc text-[#644e43]">
                            Total revenue
                        </div>
                    </div>

                    <div className="stat bg-white">
                        <div className="stat-figure text-[#442a13]">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                className="inline-block h-8 w-8 stroke-current"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M12 4v16m8-8H4"
                                ></path>
                            </svg>
                        </div>
                        <div className="stat-title text-[#442a13]">
                            Total Categories
                        </div>
                        <div className="stat-value text-[#442a13]">
                            {categoryCount}
                        </div>
                        <div className="stat-desc text-[#442a13]">
                            Number of product categories
                        </div>
                    </div>
                </div>

                <div className="flex gap-2 mb-4">
                    <div className="chart-container w-[50%] border border-amber-600 p-3 rounded-md">
                        <h2 className="text-xl mb-4 text-center">
                            Sales by Store (Dine In vs Take Out)
                        </h2>
                        <Pie data={pieChart} />
                    </div>
                    <div className="overflow-x-auto w-1/2 h-max">
                        <table className="min-w-full table-auto">
                            <thead className="bg-amber-600 text-white">
                                <tr>
                                    <th className="px-4 py-2 text-left">
                                        Product ID
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Product Name
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Update
                                    </th>
                                    <th className="px-4 py-2 text-left">
                                        Sales
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                {topSold.map((item: any) => (
                                    <tr
                                        key={item.product_id}
                                        className="border-b"
                                    >
                                        <td className="px-4 py-2">
                                            {item.product_id}
                                        </td>
                                        <td className="px-4 py-2">
                                            {item.product_name}
                                        </td>
                                        <td className="px-4 py-2">
                                            {item.total_quantity}
                                        </td>
                                        <td className="px-4 py-2">
                                            Php{" "}
                                            {Number(item.total_sales).toFixed(
                                                2
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
                <div className="flex mb-4 gap-2">
                    <div className="chart-container w-[100%] border border-amber-600 p-3 rounded-md">
                        <h2 className="text-xl mb-4 text-center">
                            Monthly Sales
                        </h2>
                        <Bar data={chartData} />
                    </div>
                    <div className="chart-container w-[100%] border border-amber-600 p-3 rounded-md">
                        <h2 className="text-xl mb-4 text-center">
                            Monthly Sales
                        </h2>
                        <SalesLineChart orders={orders} />
                    </div>
                </div>
                <div className="flex">
                    <Recommendation
                        sales={orders}
                        total_sales={totalSales}
                        sales_count={salesCount}
                    />
                </div>
            </main>
        </section>
    );
};

export default DashboardPage;
