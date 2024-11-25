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

const SalesLineChart = (orders: any) => {
    console.log(orders, "asdasd");
    // const orderss = [
    //     {
    //         order_id: 120,
    //         order_date: "2024-12-12T02:44:00.000Z",
    //         total_amount: "556.00",
    //     },
    //     {
    //         order_id: 117,
    //         order_date: "2024-09-15T02:47:00.000Z",
    //         total_amount: "650.00",
    //     },
    //     {
    //         order_id: 118,
    //         order_date: "2024-02-15T02:48:00.000Z",
    //         total_amount: "318.00",
    //     },
    //     {
    //         order_id: 121,
    //         order_date: "2024-02-01T04:27:00.000Z",
    //         total_amount: "2352.00",
    //     },
    //     {
    //         order_id: 119,
    //         order_date: "2024-01-03T03:08:00.000Z",
    //         total_amount: "1691.00",
    //     },
    // ];

    // Group orders by month and calculate the most selling hour per month
    const groupedByMonth: any = {};
    orders.orders.forEach((order: any) => {
        const date = new Date(order.order_date);
        const month = date.getMonth() + 1; // Months are 0-indexed
        const hour = date.getHours();
        const total_amount = parseFloat(order.total_amount);

        if (!groupedByMonth[month]) {
            groupedByMonth[month] = [];
        }
        groupedByMonth[month].push({ hour, total_amount });
    });

    const result: any = {};
    Object.keys(groupedByMonth).forEach((month) => {
        const hourlySales: any = {};
        groupedByMonth[month].forEach(
            ({
                hour,
                total_amount,
            }: {
                hour: string;
                total_amount: string;
            }) => {
                if (!hourlySales[hour]) {
                    hourlySales[hour] = 0;
                }
                hourlySales[hour] += total_amount;
            }
        );

        // Find the hour with the maximum sales
        const maxHour = Object.keys(hourlySales).reduce((a, b) =>
            hourlySales[a] > hourlySales[b] ? a : b
        );
        result[month] = {
            hour: parseInt(maxHour),
            sales: hourlySales[maxHour],
        };
    });

    // Prepare chart data
    const chartData = {
        labels: Object.keys(result).map(
            (month) => `${month}/2024 ${result[month].hour}:00`
        ), // X-axis: months with time
        datasets: [
            {
                label: "Most Selling Hour Sales",
                data: Object.values(result).map((month: any) => month.sales),
                borderColor: "#8884d8",
                backgroundColor: "rgba(136, 132, 216, 0.2)",
                fill: false,
                lineTension: 0,
            },
        ],
    };

    return (
        <div>
            <h3>Sales by Most Selling Hour (Monthly)</h3>
            <Line data={chartData} />
        </div>
    );
};

export default SalesLineChart;
