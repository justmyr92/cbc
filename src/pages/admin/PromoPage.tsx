import { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import { createColumnHelper } from "@tanstack/react-table";
import DataTable from "../../components/DataTable";
import AddPromoModal from "../../components/AddPromoModal";
import UpdatePromoModal from "../../components/UpdatePromoModal";
import Swal from "sweetalert2";

interface PromoBanner {
    promo_id: number;
    promo_image: string;
    active: boolean;
    promo_title: string;
    promo_description: string;
}

const columnHelper = createColumnHelper<PromoBanner>();

const PromoPage = () => {
    const [promoBanners, setPromoBanners] = useState<PromoBanner[]>([]);
    const [showAddPromoModal, setShowAddPromoModal] = useState(false);
    const [showUpdatePromoModal, setShowUpdatePromoModal] = useState(false);
    const [selectedPromo, setSelectedPromo] = useState<PromoBanner | null>(
        null
    );
    const [reload, setReload] = useState(false);

    useEffect(() => {
        const fetchPromoBanners = async () => {
            try {
                const response = await fetch(
                    "http://localhost:5000/api/get-promos"
                );
                if (!response.ok)
                    throw new Error("Failed to fetch promo banners");
                const data: PromoBanner[] = await response.json();
                setPromoBanners(data);
                console.log(data);
            } catch (error) {
                console.error("Error fetching promo banners:", error);
            }
        };
        fetchPromoBanners();
    }, [reload]);

    const localRole = localStorage.getItem("role");

    const columns = [
        columnHelper.accessor("promo_id", {
            header: "ID",
            cell: (info) => <p>{info.getValue()}</p>,
        }),
        columnHelper.accessor("promo_image", {
            header: "Image",
            cell: (info) => {
                console.log(info.getValue(), "sa");
                const imageUrl = info.getValue();
                // Only perform the replacement if imageUrl is defined
                if (imageUrl) {
                    return (
                        <img
                            src={imageUrl}
                            alt="Promo Banner"
                            className="w-[20rem] object-cover"
                        />
                    );
                }
                // If imageUrl is not defined, return a placeholder or fallback image
                return (
                    <img
                        src="/path/to/placeholder/image.png"
                        alt="No image"
                        className="w-[20rem] object-cover"
                    />
                );
            },
        }),

        columnHelper.accessor("promo_title", {
            header: "Title",
            cell: (info) => <p>{info.getValue()}</p>,
        }),
        columnHelper.accessor("promo_description", {
            header: "Description",
            cell: (info) => <p>{info.getValue()}</p>,
        }),
        columnHelper.accessor("active", {
            header: "Active",
            cell: (info) => (
                <div
                    className={`p-2 text-white rounded text-center text-sm ${
                        info.getValue() ? "bg-green-500" : "bg-red-500"
                    }`}
                >
                    {info.getValue() ? "active" : "no"}
                </div>
            ),
        }),
        localRole !== "owner" &&
            columnHelper.display({
                id: "actions",
                header: "Actions",
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleUpdatePromo(row.original)}
                            className="btn btn-sm btn-primary"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() =>
                                handleDeletePromo(row.original.promo_id)
                            }
                            className="btn btn-sm btn-danger"
                        >
                            Delete
                        </button>
                    </div>
                ),
            }),
    ].filter(Boolean);

    const handleAddPromo = () => setShowAddPromoModal(true);

    const handleUpdatePromo = (promo: PromoBanner) => {
        setSelectedPromo(promo);
        setShowUpdatePromoModal(true);
    };

    const handleDeletePromo = (id: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Send DELETE request to the API to delete the promo
                    const response = await fetch(
                        `http://localhost:5000/api/delete-promo/${id}`,
                        {
                            method: "DELETE",
                            headers: {
                                "Content-Type": "application/json",
                            },
                        }
                    );

                    if (!response.ok) {
                        throw new Error("Failed to delete promo");
                    }

                    // Update the promo list after successful deletion
                    setPromoBanners(
                        promoBanners.filter((promo) => promo.promo_id !== id)
                    );
                    setReload(!reload); // Trigger a reload of the promo banners list

                    Swal.fire(
                        "Deleted!",
                        "Your promo has been deleted.",
                        "success"
                    );
                } catch (error) {
                    console.error("Error deleting promo:", error);
                    Swal.fire(
                        "Error!",
                        "There was a problem deleting the promo.",
                        "error"
                    );
                }
            }
        });
    };

    return (
        <section className="manager h-screen flex">
            <Sidebar />
            <main className="main__container h-full w-4/5 p-5 overflow-auto">
                <div className="main__header flex justify-between items-center">
                    <h1 className="main__title text-3xl uppercase">
                        Promo Banners
                    </h1>
                    {localRole !== "owner" && (
                        <button
                            className="bg-amber-600 px-2.5 py-3 text-base text-white hover:bg-amber-700 transition"
                            onClick={handleAddPromo}
                        >
                            Add Promotion
                        </button>
                    )}
                </div>

                <hr className="border border-amber-600 my-3" />

                <div className="main__table__container">
                    <DataTable data={promoBanners} columns={columns} />
                </div>
            </main>

            {/* AddPromoModal */}
            <AddPromoModal
                showAddPromoModal={showAddPromoModal}
                setShowAddPromoModal={setShowAddPromoModal}
                setReload={setReload}
            />

            {/* UpdatePromoModal */}
            {selectedPromo && (
                <UpdatePromoModal
                    showUpdatePromoModal={showUpdatePromoModal}
                    setShowUpdatePromoModal={setShowUpdatePromoModal}
                    selectedPromo={selectedPromo} // Pass selectedPromo to modal
                    setReload={setReload}
                />
            )}
        </section>
    );
};

export default PromoPage;
