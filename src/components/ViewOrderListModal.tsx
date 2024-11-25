import { useEffect, useState } from "react";
import { getOrderList } from "../services/orders.service";

interface ViewProps {
    showViewModal: boolean;
    setShowViewModal: (show: boolean) => void;
    orderID: number;
}

const ViewOrderListModal = ({
    showViewModal,
    setShowViewModal,
    orderID,
}: ViewProps) => {
    const [orderList, setOrderList] = useState([]);
    const [totalPrice, setTotalPrice] = useState(0);

    useEffect(() => {
        const fetchOrderList = async () => {
            const response = await getOrderList(orderID);
            setOrderList(response);

            // Calculate total price from subtotal values
            const total = response.reduce(
                (sum: number, item: { subtotal: string }) =>
                    sum + parseFloat(item.subtotal),
                0
            );
            setTotalPrice(total);
        };

        fetchOrderList();
    }, [orderID]);

    useEffect(() => {
        const modal = document.getElementById(
            "view_modal"
        ) as HTMLDialogElement;
        if (modal) {
            if (showViewModal) {
                modal.showModal();
            } else {
                // Reset fields before closing
                modal.close();
            }
        }
    }, [showViewModal]);

    return (
        <dialog id="view_modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={() => setShowViewModal(false)}
                    >
                        ✕
                    </button>
                </form>
                <h3 className="font-bold text-lg">Order Details</h3>
                <table className="table table-zebra w-full mt-4">
                    <thead>
                        <tr>
                            <th>Order ID</th>
                            <td>{orderID}</td>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <th>Product Name</th>
                            <th>Quantity</th>
                            <th>Subtotal</th>
                        </tr>
                        {orderList.map((item: any) => (
                            <tr key={item.order_list_id}>
                                <td>{item.product_name}</td>
                                <td>{item.quantity}</td>
                                <td>₱{parseFloat(item.subtotal).toFixed(2)}</td>
                            </tr>
                        ))}
                        <tr>
                            <td colSpan={2} className="font-bold text-right">
                                Total Price
                            </td>
                            <td className="font-bold">
                                ₱{totalPrice.toFixed(2)}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </dialog>
    );
};

export default ViewOrderListModal;
