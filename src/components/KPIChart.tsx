import { useEffect, useRef } from "react";
import Chart from "chart.js/auto"; // Make sure you have chart.js installed
import { Bar } from "react-chartjs-2"; // Using the Bar chart from react-chartjs-2

// Sample raw data provided in the original post
const rawData = [
    {
        order_id: 58,
        order_date: "2022-08-05T16:00:00.000Z",
        order_type: "Take Out",
        total_amount: "3466.00",
    },
    {
        order_id: 59,
        order_date: "2022-08-05T16:00:00.000Z",
        order_type: "Take Out",
        total_amount: "2528.00",
    },
    {
        order_id: 60,
        order_date: "2022-08-05T16:00:00.000Z",
        order_type: "Dine In",
        total_amount: "2027.00",
    },
    {
        order_id: 61,
        order_date: "2022-08-05T16:00:00.000Z",
        order_type: "Dine In",
        total_amount: "1926.00",
    },
    {
        order_id: 62,
        order_date: "2022-08-05T16:00:00.000Z",
        order_type: "Dine In",
        total_amount: "379.00",
    },
    {
        order_id: 63,
        order_date: "2022-08-05T16:00:00.000Z",
        order_type: "Dine In",
        total_amount: "2164.00",
    },
    {
        order_id: 64,
        order_date: "2022-08-05T16:00:00.000Z",
        order_type: "Dine In",
        total_amount: "1455.00",
    },
    {
        order_id: 65,
        order_date: "2022-06-30T16:00:00.000Z",
        order_type: "Take Out",
        total_amount: "51189.00",
    },
    {
        order_id: 66,
        order_date: "2022-06-01T16:00:00.000Z",
        order_type: "Dine In",
        total_amount: "100291.00",
    },
    {
        order_id: 67,
        order_date: "2022-06-01T16:00:00.000Z",
        order_type: "Dine In",
        total_amount: "2643.00",
    },
    {
        order_id: 68,
        order_date: "2022-06-01T16:00:00.000Z",
        order_type: "Dine In",
        total_amount: "8366.00",
    },
    {
        order_id: 69,
        order_date: "2022-06-01T16:00:00.000Z",
        order_type: "Dine In",
        total_amount: "15177.00",
    },
    {
        order_id: 70,
        order_date: "2022-06-01T16:00:00.000Z",
        order_type: "Take Out",
        total_amount: "126579.00",
    },
    {
        order_id: 71,
        order_date: "2022-06-01T16:00:00.000Z",
        order_type: "Dine In",
        total_amount: "63174.00",
    },
];

// Helper function to format date to YYYY-MM-DD (or use a date library for more options)
const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toISOString().split("T")[0]; // "2022-06-01"
};

// Process the data to sum total_amount by order_date and order_type
const processedData: ProcessedData = rawData.reduce(
    (acc: any, { order_date, order_type, total_amount }) => {
        const date = formatDate(order_date);
        const amount = parseFloat(total_amount);

        // Initialize the date in accumulator if not exists
        if (!acc[date]) {
            acc[date] = { "Take Out": 0, "Dine In": 0 }; // Add more order_types if necessary
        }

        // Sum the amounts based on order_type
        acc[date][order_type] += amount;

        return acc;
    },
    {}
);

// Now you can convert the processedData to a format suitable for charting
const labels = Object.keys(processedData); // x-axis labels (order_date)
const takeOutData = labels.map((date) => processedData[date]["Take Out"] || 0); // y-axis data for Take Out
const dineInData = labels.map((date) => processedData[date]["Dine In"] || 0); // y-axis data for Dine In

// Prepare data for the chart
const chartData = {
    labels: labels, // The x-axis labels (dates)
    datasets: [
        {
            label: "Take Out",
            data: takeOutData,
            fill: false,
            borderColor: "rgb(255, 99, 132)", // red color
            backgroundColor: "rgba(255, 99, 132, 0.2)", // light red color
        },
        {
            label: "Dine In",
            data: dineInData,
            fill: false,
            borderColor: "rgb(54, 162, 235)", // blue color
            backgroundColor: "rgba(54, 162, 235, 0.2)", // light blue color
        },
    ],
};

type ProcessedData = {
    [key: string]: {
        [key: string]: number;
    };
};

const KPIChart = () => {
    const chartRef = useRef<HTMLCanvasElement | null>(null); // Type the ref correctly

    useEffect(() => {
        if (chartRef.current) {
            new Chart(chartRef.current, {
                type: "bar", // Use the bar chart type
                data: chartData, // The data prepared earlier
                options: {
                    interaction: {
                        intersect: false,
                        mode: "index",
                    },
                    plugins: {
                        tooltip: {
                            callbacks: {
                                footer: (tooltipItems: any) => {
                                    let sum = 0;
                                    tooltipItems.forEach(function (
                                        tooltipItem: any
                                    ) {
                                        sum += tooltipItem.parsed.y;
                                    });
                                    return "Sum: " + sum;
                                }, // Display the sum in the footer of tooltips
                            },
                        },
                    },
                },
            });
        }
    }, []);

    return (
        <div>
            <Bar data={chartData} /> {/* This will hold the chart */}
        </div>
    );
};

export default KPIChart;
