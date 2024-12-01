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

// Register Chart.js components
ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const PercentagePerMonth = ({ data }: { data: any }) => {
    // Prepare the labels and datasets for the chart
    const labels = data.map((item: any) => item.month);
    const percentages = data.map((item: any) => item.percentage);
    console.log(data, "hahahahaha");
    const chartData = {
        labels: labels,
        datasets: [
            {
                label: "Percentage per Month",
                data: percentages,
                fill: false,
                borderColor: "rgba(61, 42, 33, 1)",
                tension: 0.1,
                borderWidth: 2,
                pointRadius: 5,
                pointBackgroundColor: "rgba(61, 42, 33, 1)",
                pointHoverRadius: 7,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: "Percentage per Month",
            },
            tooltip: {
                callbacks: {
                    label: (tooltipItem: any) => `${tooltipItem.raw}%`,
                },
            },
        },
        scales: {
            x: {
                title: {
                    display: true,
                    text: "Month",
                },
            },
            y: {
                title: {
                    display: true,
                    text: "Percentage",
                },
                ticks: {
                    beginAtZero: true,
                    callback: (value: string | number) => `${value}%`, // Adjusted callback to handle both string and number
                },
            },
        },
    };

    return <Line data={chartData} options={options} />;
};

export default PercentagePerMonth;
