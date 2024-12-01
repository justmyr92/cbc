import React, { useEffect, useState } from "react";
import { Line } from "react-chartjs-2";

import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const AnnualSalesChart: React.FC<{ storeId: string }> = ({ storeId }) => {
    const [salesData, setSalesData] = useState<
        { sales_year: number; total_sales: number }[]
    >([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch(
                    `https://kape-backend.onrender.com/api/get/annual-orders/${storeId}`
                );

                const data = await response.json();
                setSalesData(data);
                setLoading(false);
            } catch (error) {
                console.error("Error fetching sales data:", error);
                setLoading(false);
            }
        };

        fetchData();
    }, [storeId]);

    const chartData = {
        labels: salesData.map((data) => data.sales_year),
        datasets: [
            {
                label: "Total Sales",
                data: salesData.map((data) => data.total_sales),
                borderColor: "rgba(61, 42, 33, 1)",
                backgroundColor: "rgba(61, 42, 33, 1)",
                tension: 0.4,
                fill: true,
            },
        ],
    };
    const options = {
        responsive: true,
        plugins: {
            legend: {
                position: "top" as const, // Ensure type compatibility
            },
            title: {
                display: true,
                text: "Annual Sales", // Main chart title
            },
        },
        scales: {
            y: {
                type: "linear" as const, // Specify "linear"
                beginAtZero: true,
                ticks: {
                    callback: (value: number | string) =>
                        `Php ${Number(value).toLocaleString()}`, // Format Y-axis ticks
                },
                title: {
                    display: true,
                    text: "Total Sales (Php)", // Label for Y-axis
                },
            },
            x: {
                type: "category" as const, // Specify "category"
                title: {
                    display: true,
                    text: "Year", // Label for X-axis
                },
            },
        },
    };

    if (loading) return <div>Loading...</div>;

    return <Line data={chartData} options={options} />;
};

export default AnnualSalesChart;
