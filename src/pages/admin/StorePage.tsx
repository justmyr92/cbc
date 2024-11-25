import { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import Sidebar from "../../components/Sidebar";
import { createColumnHelper } from "@tanstack/react-table";
import {
    deleteStoreLocation,
    getStoreLocations,
} from "../../services/stores.service";
import { useNavigate } from "react-router-dom";
import AddStoreModal from "../../components/AddStoreLocation";
import UpdateStoreModal from "../../components/UpdateStoreModal";
import Swal from "sweetalert2";

// Define the Store interface
interface Store {
    store_name: string;
    address: string;
    latitude: string;
    longitude: string;
    store_id: string; // Add an id to each store for identification
    actions: string;
}

// Create a column helper for the Store type
const columnHelper = createColumnHelper<Store>();

const StorePage = () => {
    const navigate = useNavigate();
    const [stores, setStores] = useState<Store[]>([]);
    const [reload, setReload] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const [selectedStore, setSelectedStore] = useState<Store | null>(null); // Store the selected store for editing

    const localRole = localStorage.getItem("role");
    const columns = [
        columnHelper.accessor("store_name", {
            cell: (info) => <p>{info.getValue()}</p>,
            header: () => <span>Store Name</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("address", {
            cell: (info) => <p>{info.getValue()}</p>,
            header: () => <span>Address</span>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("latitude", {
            header: () => "Latitude",
            cell: (info) => <p>{info.renderValue()}</p>,
            footer: (info) => info.column.id,
        }),
        columnHelper.accessor("longitude", {
            header: () => "Longitude",
            cell: (info) => <p>{info.renderValue()}</p>,
            footer: (info) => info.column.id,
        }),
        localRole !== "owner" &&
            columnHelper.accessor("actions", {
                cell: (info) => (
                    <div className="flex space-x-2">
                        <button
                            className="bg-blue-500 text-white px-3 py-1 rounded"
                            onClick={() => handleUpdate(info.row.original)}
                        >
                            Update
                        </button>
                        <button
                            className="bg-red-500 text-white px-3 py-1 rounded"
                            onClick={() =>
                                handleDelete(info.row.original.store_id)
                            }
                        >
                            Delete
                        </button>
                    </div>
                ),
                header: () => <span>Actions</span>,
                footer: (info) => info.column.id,
            }),
    ].filter(Boolean);

    const handleUpdate = (store: Store) => {
        // Handle the update logic here
        console.log("Update store:", store);
        setSelectedStore(store);
        setShowUpdateModal(true); // Show the modal to update the store
    };

    const handleDelete = async (storeId: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "Do you want to delete this store location?",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await deleteStoreLocation(storeId); // Call the delete service
                setReload(true); // Reload the list after deletion
                Swal.fire("Deleted!", "The store has been deleted.", "success");
            } catch (error) {
                console.error("Error deleting store:", error);
                Swal.fire(
                    "Error",
                    "Failed to delete the store. Try again later.",
                    "error"
                );
            }
        }
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            // Redirect to login if no token is found
            navigate("/admin/login");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchStores = async () => {
            try {
                const stores = await getStoreLocations(); // Assuming this function fetches store locations
                setStores(stores);
                setReload(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchStores();
    }, [reload]);

    return (
        <section className="store h-screen flex">
            <Sidebar />
            <main className="main__container h-full w-4/5 p-5 overflow-auto">
                <div className="main__header flex justify-between items-center">
                    <h1 className="main__title text-3xl uppercase">Stores</h1>
                    {localRole !== "owner" && (
                        <button
                            className="bg-amber-600 px-2.5 py-3 text-base text-white hover:bg-amber-700 transition"
                            onClick={() => setShowAddModal(true)}
                        >
                            Add Store
                        </button>
                    )}
                    <AddStoreModal
                        showAddModal={showAddModal}
                        setShowAddModal={setShowAddModal}
                        setReload={setReload}
                    />

                    <UpdateStoreModal
                        showUpdateModal={showUpdateModal}
                        setShowUpdateModal={setShowUpdateModal}
                        store={selectedStore} // Pass the selected store for editing
                        setReload={setReload}
                    />
                </div>

                <hr className="border border-amber-600 my-3" />
                <div className="main__table__container">
                    <DataTable data={stores} columns={columns} />
                </div>
            </main>
        </section>
    );
};

export default StorePage;
