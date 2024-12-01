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
import { useEffect, useState } from "react";
import { getPeakHours } from "../services/orders.service";

// Registering Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const SalesLineChart = ({
    year,
    store_id,
}: {
    year: string;
    store_id: string;
}) => {
    console.log(year, store_id, "hahaha");
    const [orderss, setOrderss] = useState<any[]>([]); // Store the fetched order data

    useEffect(() => {
        console.log(
            "Fetching peak hours for year:",
            year,
            "store_id:",
            store_id
        );
        const fetchPeakHours = async () => {
            try {
                const data = await getPeakHours(year, store_id); // Adjust the params as needed
                setOrderss(data); // Assuming data is an array of objects with { order_month, order_hour, total_sales }

                console.log(data, year, store_id, "hahahas");
            } catch (error) {
                console.error("Error fetching peak hours:", error);
            }
        };

        fetchPeakHours();
    }, [year, store_id]); // Dependencies that should trigger the effect

    // Initialize a 2D array for storing sales data for each month and hour (12 months, 13 hours from 8 AM to 8 PM)
    const monthlyHourlySales = new Array(12)
        .fill(0)
        .map(() => new Array(13).fill(0));

    // Assuming 'orderss' is an array of objects with { order_month, order_hour, total_sales }
    orderss.forEach((order: any) => {
        const monthIndex = parseInt(order.order_month, 10) - 1; // Convert month to index (0-based)
        const orderHour = parseInt(order.order_hour);
        console.log(orderHour, "aas");
        const totalSales = parseFloat(order.total_sales); // Convert total_sales to a number

        if (
            monthIndex >= 0 &&
            monthIndex < 12 &&
            orderHour >= 0 &&
            orderHour < 24
        ) {
            console.log(orderHour, "aass");
            monthlyHourlySales[monthIndex][orderHour] = totalSales; // Set total_sales for the corresponding month and hour
        }
    });

    console.log(monthlyHourlySales, "aasss");

    // Create X-axis labels by combining month and hour, only if there are sales
    const xLabels: string[] = [];
    const salesData: number[] = [];

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

    // Loop through all the months
    for (let month = 0; month < 12; month++) {
        // Check if this month has sales
        for (let hour = 0; hour < 24; hour++) {
            // Only add to the chart if the hour has sales data
            if (monthlyHourlySales[month][hour] > 0) {
                xLabels.push(`${months[month]} ${hour}:00`); // Add the formatted label (month and hour)
                salesData.push(monthlyHourlySales[month][hour]); // Push the sales data for that hour
            }
        }
    }

    console.log(salesData, "aassss");

    // Chart.js data configuration
    const chartData = {
        labels: xLabels, // Use filtered X-axis labels
        datasets: [
            {
                label: "Peak Season",
                data: salesData, // Use the corresponding sales data
                borderColor: "rgba(75, 192, 192, 1)",
                backgroundColor: "rgba(75, 192, 192, 0.2)",
                fill: true,
                tension: 0.1,
            },
        ],
    };

    // Chart.js options to customize axis and appearance
    const options = {
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Month and Hour",
                },
                ticks: {
                    maxRotation: 45, // Rotate X-axis labels to avoid overlapping
                    minRotation: 45,
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Total Sales",
                },
            },
        },
    };

    return (
        <div>
            <h3>Sales by Hour and Month</h3>
            <Line data={chartData} options={options} />
        </div>
    );
};

export default SalesLineChart;
