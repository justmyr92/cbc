import React, { useEffect, useState } from "react";
import * as XLSX from "xlsx";
import { addOrder } from "../services/orders.service";
import { getProductsWithCategories } from "../services/products.service";
import Swal from "sweetalert2";

interface AddOrderModalProps {
    showAddModal: boolean;
    setShowAddModal: (show: boolean) => void;
    setReload: (reload: boolean) => void;
}

const AddOrdersModal = ({
    showAddModal,
    setShowAddModal,
    setReload,
}: AddOrderModalProps) => {
    const [orders, setOrders] = useState<any[]>([]);
    const [products, setProducts] = useState<any[]>([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await getProductsWithCategories();
                setProducts(response);
            } catch (error) {}
        };
        fetchProducts();
    }, []);

    const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        if (!products) return;

        const data = await file.arrayBuffer();
        const workbook = XLSX.read(data, { type: "array" });
        const worksheet = workbook.Sheets[workbook.SheetNames[0]];
        const rawData = XLSX.utils.sheet_to_json(worksheet);

        // Transform data to required JSON format
        const formattedData = transformDataToOrderFormat(rawData);
        setOrders(formattedData); // Set the formatted data to state
        console.log(formattedData); // Display the converted data in console

        // Reset the file input
        e.target.value = "";
    };

    // const transformDataToOrderFormat = (rawData: any[]): any[] => {
    //     const ordersMap: { [key: string]: any } = {};

    //     rawData.forEach((row: any) => {
    //         const transactionNumber = row["Transaction No."]; // Transaction reference
    //         const orderDateExcel = row["Order Date"]; // Date
    //         const orderTimeExcel = row["Order Time"]; // Time

    //         let orderDate: string;
    //         let orderTime: string;

    //         if (typeof orderDateExcel === "number") {
    //             const jsDate = new Date(
    //                 (orderDateExcel - 25569) * 86400 * 1000
    //             ); // Excel to JS date
    //             orderDate = jsDate.toISOString().split("T")[0]; // Convert to YYYY-MM-DD
    //         } else if (typeof orderDateExcel === "string") {
    //             // Convert MM/DD/YYYY to YYYY-MM-DD
    //             const [month, day, year] = orderDateExcel.split("/");
    //             orderDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
    //                 2,
    //                 "0"
    //             )}`;
    //         } else {
    //             throw new Error("Invalid date format");
    //         }

    //         // Handle the time as a string, parse it into the desired format
    //         if (typeof orderTimeExcel === "number") {
    //             // Excel stores time as a fraction of a day, multiply by 24 to get hours
    //             const totalSeconds = Math.round(orderTimeExcel * 86400);
    //             const hours = Math.floor(totalSeconds / 3600);
    //             const minutes = Math.floor((totalSeconds % 3600) / 60);
    //             const seconds = totalSeconds % 60;

    //             // Format time as HH:mm:ss
    //             orderTime = `${hours.toString().padStart(2, "0")}:${minutes
    //                 .toString()
    //                 .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    //         } else {
    //             orderTime = orderTimeExcel; // Use the existing time string if it's not a fraction
    //         }

    //         // Check if the order already exists in the map
    //         if (!ordersMap[transactionNumber]) {
    //             ordersMap[transactionNumber] = {
    //                 transaction_number: transactionNumber,
    //                 order_date: orderDate,
    //                 order_time: orderTime, // Store the formatted time
    //                 order_type: row["Order Type"],
    //                 store_id: row["Store ID"], // Add store_id if present
    //                 orderlist: [],
    //                 total: 0, // Initialize total for each transaction
    //             };
    //         }

    //         // Create order list item and add it to orderlist
    //         const orderItem = {
    //             category: row["Category"],
    //             product_name: row["Product"],
    //             product_id: products.find(
    //                 (product: any) => product.product_name === row["Product"]
    //             )?.product_id,
    //             quantity: row["Quantity"],
    //             price: row["Price"],
    //             sub_total: row["Subtotal"],
    //         };

    //         // Add the item to the orderlist
    //         ordersMap[transactionNumber].orderlist.push(orderItem);

    //         // Update the total for the transaction
    //         ordersMap[transactionNumber].total += Number(orderItem.sub_total);
    //     });

    //     // Return the array of orders
    //     return Object.values(ordersMap);
    // };

    const transformDataToOrderFormat = (rawData: any[]): any[] => {
        const ordersMap: { [key: string]: any } = {};

        rawData.forEach((row: any) => {
            const transactionNumber = row["Transaction No."]; // Transaction reference
            const orderDateTimeExcel = row["Order Date"]; // Combined DateTime column

            let orderDate: string;
            let orderTime: string;

            if (typeof orderDateTimeExcel === "number") {
                // Excel stores DateTime as a serial number
                const jsDate = new Date(
                    (orderDateTimeExcel - 25569) * 86400 * 1000
                ); // Excel to JS date
                orderDate = jsDate.toISOString().split("T")[0]; // Extract YYYY-MM-DD
                orderTime = jsDate.toISOString().split("T")[1].split(".")[0]; // Extract HH:mm:ss
            } else if (typeof orderDateTimeExcel === "string") {
                // Split string DateTime into date and time
                const [datePart, timePart] = orderDateTimeExcel.split(" ");
                // Convert MM/DD/YYYY to YYYY-MM-DD
                const [month, day, year] = datePart.split("/");
                orderDate = `${year}-${month.padStart(2, "0")}-${day.padStart(
                    2,
                    "0"
                )}`;
                orderTime = timePart; // Use provided time part
            } else {
                throw new Error("Invalid DateTime format");
            }

            // Check if the order already exists in the map
            if (!ordersMap[transactionNumber]) {
                ordersMap[transactionNumber] = {
                    transaction_number: transactionNumber,
                    order_date: orderDate,
                    order_time: orderTime, // Store the formatted time
                    order_type: row["Order Type"],
                    store_id: row["Store ID"], // Add store_id if present
                    orderlist: [],
                    total: 0, // Initialize total for each transaction
                };
            }

            // Create order list item and add it to orderlist
            const orderItem = {
                category: row["Category"],
                product_name: row["Product"],
                product_id: products.find(
                    (product: any) => product.product_name === row["Product"]
                )?.product_id,
                quantity: row["Quantity"],
                price: row["Price"],
                sub_total: row["Subtotal"],
            };

            // Add the item to the orderlist
            ordersMap[transactionNumber].orderlist.push(orderItem);

            // Update the total for the transaction
            ordersMap[transactionNumber].total += Number(orderItem.sub_total);
        });

        // Return the array of orders
        return Object.values(ordersMap);
    };

    const handleConfirmUpload = async () => {
        try {
            // Confirmation dialog
            const result = await Swal.fire({
                title: "Are you sure?",
                text: "Do you want to upload these orders?",
                icon: "question",
                showCancelButton: true,
                confirmButtonText: "Yes, upload!",
                cancelButtonText: "Cancel",
            });

            if (result.isConfirmed) {
                console.log(orders, products, "Asda22222sd");

                const responses = await Promise.all(
                    orders.map((order: any) => addOrder(order)) // Call addOrder for each order in parallel
                );

                if (responses.every((response) => response)) {
                    // If all responses are successful
                    Swal.fire({
                        title: "Success!",
                        text: "Orders have been successfully uploaded.",
                        icon: "success",
                    });
                    setReload(true);
                    setShowAddModal(false);
                }
            } else {
                console.log("Upload canceled by user.");
            }
        } catch (error) {
            Swal.fire({
                title: "Error!",
                text: "An error occurred while uploading orders.",
                icon: "error",
            });
            console.error("Error uploading orders:", error);
        }
    };

    return (
        <dialog id="add_order_modal" className="modal" open={showAddModal}>
            <div className="modal-box w-11/12 max-w-5xl">
                <form method="dialog">
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={() => setShowAddModal(false)}
                    >
                        ✕
                    </button>
                </form>
                <h3 className="font-bold text-lg">Upload Order File</h3>
                <div className="py-4">
                    <input
                        type="file"
                        accept=".xlsx, .csv"
                        onChange={handleFileUpload}
                        className="file-input file-input-bordered file-input-primary w-full"
                    />
                </div>

                {/* Preview Table */}
                {orders.length > 0 && (
                    <div>
                        <h4 className="font-bold text-md">Preview Orders</h4>
                        <table className="table w-full mt-2">
                            {/* <thead>
                                <tr>
                                    <th>Transaction No.</th>
                                    <th>Order Date</th>
                                    <th>Order Type</th>
                                    <th>Category</th>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) =>
                                    order.orderlist.map(
                                        (item: any, index: number) => (
                                            <tr
                                                key={`${order.transaction_number}-${index}`}
                                            >
                                                {index === 0 && (
                                                    <>
                                                        <td
                                                            rowSpan={
                                                                order.orderlist
                                                                    .length
                                                            }
                                                            className="align-text-top"
                                                        >
                                                            {
                                                                order.transaction_number
                                                            }
                                                        </td>
                                                        <td
                                                            rowSpan={
                                                                order.orderlist
                                                                    .length
                                                            }
                                                            className="align-text-top"
                                                        >
                                                            {order.order_date}
                                                        </td>
                                                        <td
                                                            rowSpan={
                                                                order.orderlist
                                                                    .length
                                                            }
                                                            className="align-text-top"
                                                        >
                                                            {order.order_type}
                                                        </td>
                                                    </>
                                                )}
                                                <td>{item.category}</td>
                                                <td>{item.product_name}</td>
                                                <td>{item.quantity}</td>
                                                <td>
                                                    Php{" "}
                                                    {Number(item.price).toFixed(
                                                        2
                                                    )}
                                                </td>
                                                <td>
                                                    Php{" "}
                                                    {Number(
                                                        item.sub_total
                                                    ).toFixed(2)}
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody> */}

                            <thead>
                                <tr>
                                    <th>Transaction No.</th>
                                    <th>Order Date</th>
                                    <th>Order Time</th>{" "}
                                    {/* New column for time */}
                                    <th>Order Type</th>
                                    <th>Category</th>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Price</th>
                                    <th>Subtotal</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.map((order) =>
                                    order.orderlist.map(
                                        (item: any, index: number) => (
                                            <tr
                                                key={`${order.transaction_number}-${index}`}
                                            >
                                                {index === 0 && (
                                                    <>
                                                        <td
                                                            rowSpan={
                                                                order.orderlist
                                                                    .length
                                                            }
                                                            className="align-text-top"
                                                        >
                                                            {
                                                                order.transaction_number
                                                            }
                                                        </td>
                                                        <td
                                                            rowSpan={
                                                                order.orderlist
                                                                    .length
                                                            }
                                                            className="align-text-top"
                                                        >
                                                            {order.order_date}
                                                        </td>
                                                        <td
                                                            rowSpan={
                                                                order.orderlist
                                                                    .length
                                                            }
                                                            className="align-text-top"
                                                        >
                                                            {order.order_time}{" "}
                                                            {/* Display the time */}
                                                        </td>
                                                        <td
                                                            rowSpan={
                                                                order.orderlist
                                                                    .length
                                                            }
                                                            className="align-text-top"
                                                        >
                                                            {order.order_type}
                                                        </td>
                                                    </>
                                                )}
                                                <td>{item.category}</td>
                                                <td>{item.product_name}</td>
                                                <td>{item.quantity}</td>
                                                <td>
                                                    Php{" "}
                                                    {Number(item.price).toFixed(
                                                        2
                                                    )}
                                                </td>
                                                <td>
                                                    Php{" "}
                                                    {Number(
                                                        item.sub_total
                                                    ).toFixed(2)}
                                                </td>
                                            </tr>
                                        )
                                    )
                                )}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* Confirm Upload Button */}
                {orders.length > 0 && (
                    <div className="py-4">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={handleConfirmUpload}
                        >
                            Confirm Upload
                        </button>
                    </div>
                )}
            </div>
        </dialog>
    );
};

export default AddOrdersModal;
