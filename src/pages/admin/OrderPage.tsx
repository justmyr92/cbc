import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import AddOrdersModal from "../../components/AddOrdersModal";

import { useNavigate } from "react-router-dom";
import { createColumnHelper } from "@tanstack/react-table";
import { getOrders } from "../../services/orders.service";
import DataTable from "../../components/DataTable";
import ViewOrderListModal from "../../components/ViewOrderListModal";

interface Orders {
    order_id: number;
    order_date: Date;
    order_type: string;
    store_id: number;
    store_name: string;
    transaction_number: number;
    total_amount: number;
    action: unknown;
}

const columnHelper = createColumnHelper<Orders>();

const OrderPage = () => {
    const navigate = useNavigate();
    const [showAddModal, setShowAddModal] = useState(false);
    const [reload, setReload] = useState(false);
    const [orders, setOrders] = useState<Orders[]>([]);
    const [filteredOrders, setFilteredOrders] = useState<Orders[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [showViewOrderListModal, setShowViewOrderListModal] = useState(false);
    const [selectedOrderID, setSelectedOrderID] = useState<number>(0);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/admin/login");
        }
    }, [navigate]);
    const localRole = localStorage.getItem("role");

    const columns = [
        columnHelper.accessor("order_date", {
            header: () => <span>Order Date</span>,
            cell: (info) => {
                const date = new Date(info.getValue() as Date);
                return <p>{date.toLocaleDateString()}</p>;
            },
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("order_type", {
            header: () => <span>Order Type</span>,
            cell: (info) => <p>{info.getValue()}</p>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("store_name", {
            header: () => <span>Store Name</span>,
            cell: (info) => <p>{info.getValue()}</p>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("transaction_number", {
            header: () => <span>Transaction Number</span>,
            cell: (info) => <p>{info.getValue()}</p>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("total_amount", {
            header: () => <span>Total Amount</span>,
            cell: (info) => {
                const total = Number(info.getValue());
                return <p>Php {total.toFixed(2)}</p>;
            },
            footer: (info) => info.column.id,
        }),

        columnHelper.accessor("order_id", {
            header: () => <span>Action</span>,
            cell: (info: any) => {
                return (
                    <div>
                        <button
                            className="btn btn-primary"
                            onClick={() => {
                                setShowViewOrderListModal(
                                    !showViewOrderListModal
                                );
                                setSelectedOrderID(info.getValue());
                                console.log(info.getValue());
                            }}
                        >
                            View
                        </button>
                    </div>
                );
            },
            footer: (info) => info.column.id,
        }),
    ];

    useEffect(() => {
        const fetchOrders = async () => {
            const response = await getOrders();
            setOrders(response);

            console.log(response);
            setFilteredOrders(response);
        };

        fetchOrders();
    }, [reload]);

    const handleFilter = () => {
        const filtered = orders.filter((order) => {
            const orderDate = new Date(order.order_date);
            const matchesDateRange =
                (!startDate || orderDate >= new Date(startDate)) &&
                (!endDate || orderDate <= new Date(endDate));
            const matchesSearch =
                order.order_type
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                order.store_name
                    .toLowerCase()
                    .includes(searchTerm.toLowerCase()) ||
                order.transaction_number.toString().includes(searchTerm);

            return matchesDateRange && matchesSearch;
        });
        setFilteredOrders(filtered);
    };

    useEffect(() => {
        handleFilter();
    }, [startDate, endDate, searchTerm, orders]);

    return (
        <section className="manager h-screen flex">
            <Sidebar />
            <main className="main__container h-full w-4/5 p-5 overflow-auto">
                <div className="main__header flex justify-between items-center">
                    <h1 className="main__title text-3xl uppercase">Orders</h1>
                    {localRole !== "owner" && (
                        <button
                            className="bg-amber-600 px-2.5 py-3 text-base text-white hover:bg-amber-700 transition"
                            onClick={() => setShowAddModal(true)}
                        >
                            Add Orders
                        </button>
                    )}
                    <AddOrdersModal
                        showAddModal={showAddModal}
                        setShowAddModal={setShowAddModal}
                        setReload={setReload}
                    />
                </div>

                <hr className="border border-amber-600 my-3" />

                {/* Filter Section */}
                <div className="filter-container my-4 flex gap-4">
                    <input
                        type="text"
                        placeholder="Search by type, store, or transaction number"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                    />
                    <input
                        type="date"
                        placeholder="Start Date"
                        value={startDate}
                        onChange={(e) => setStartDate(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                    />
                    <input
                        type="date"
                        placeholder="End Date"
                        value={endDate}
                        onChange={(e) => setEndDate(e.target.value)}
                        className="input input-bordered w-full max-w-xs"
                    />
                </div>

                <div className="main__table__container">
                    <DataTable data={filteredOrders} columns={columns} />
                    <ViewOrderListModal
                        showViewModal={showViewOrderListModal}
                        setShowViewModal={setShowViewOrderListModal}
                        orderID={selectedOrderID}
                    />
                </div>
            </main>
        </section>
    );
};

export default OrderPage;
