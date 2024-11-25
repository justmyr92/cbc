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

    const transformDataToOrderFormat = (rawData: any[]): any[] => {
        const ordersMap: { [key: string]: any } = {};

        rawData.forEach((row: any) => {
            const transactionNumber = row["Transaction No."]; // Ensure the key matches your data

            // Check if the order already exists in the map
            if (!ordersMap[transactionNumber]) {
                ordersMap[transactionNumber] = {
                    transaction_number: transactionNumber,
                    order_date: row["Order Date"], // Ensure the key matches your data
                    order_type: row["Order Type"],
                    orderlist: [],
                    total: 0, // Initialize total for each transaction
                };
            }

            // Create order list item and add it to orderlist
            console.log(row["Product"]);

            const orderItem = {
                category: row["Category"],
                product_name: row["Product"],
                //pget product id if name is match
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
            ordersMap[transactionNumber].total += orderItem.sub_total;
        });

        // Return the array of orders
        return Object.values(ordersMap);
    };

    // const handleConfirmUpload = async () => {
    //     console.log(orders, products);
    //     try {
    //         const responses = await Promise.all(
    //             orders.map((order: any) => addOrder(order)) // Call addOrder for each order in parallel
    //         );

    //         if (responses.every((response) => response)) {
    //             // Check if all responses are successful
    //             setReload(true);
    //             setShowAddModal(false);
    //         }
    //     } catch (error) {
    //         console.error("Error uploading orders:", error);
    //     }
    // };

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
                } else {
                    Swal.fire({
                        title: "Error!",
                        text: "Some orders failed to upload.",
                        icon: "error",
                    });
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
                            <thead>
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
