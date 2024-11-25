import { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import Sidebar from "../../components/Sidebar";
import { createColumnHelper } from "@tanstack/react-table";
import {
    getCategories,
    updateCategoryStatus,
} from "../../services/products.service"; // Ensure deleteCategory is imported
import { useNavigate } from "react-router-dom";
import AddCategoryModal from "../../components/AddCategoryModal";
import UpdateCategoryModal from "../../components/UpdateCategoryModal";
import Swal from "sweetalert2"; // Import SweetAlert2

const columnHelper = createColumnHelper();

const CategoriesPage = () => {
    const navigate = useNavigate();
    const [categories, setCategories] = useState([]);
    const [reload, setReload] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
    const [selectedCategory, setSelectedCategory] = useState<any>(null);
    const [showUpdateModal, setShowUpdateModal] = useState(false);
    const localRole = localStorage.getItem("role");

    const columns = [
        columnHelper.accessor("category_id", {
            cell: (info) => <p>{info.getValue()}</p>,
            header: () => <span>Category ID</span>,
        }),
        columnHelper.accessor("category_image", {
            cell: (info) => <img className="w-[18rem]" src={info.getValue()} />,
            header: () => <span>Image</span>,
        }),
        columnHelper.accessor("category_name", {
            cell: (info) => <p>{info.getValue()}</p>,
            header: () => <span>Category Name</span>,
        }),
        localRole !== "owner" &&
            columnHelper.accessor("actions", {
                cell: (info: any) => (
                    <div>
                        <button
                            className="bg-blue-500 text-white mr-2 px-4 py-2 rounded hover:bg-blue-600"
                            onClick={() => {
                                setSelectedCategory(info.row.original);
                                setShowUpdateModal(true);
                            }}
                        >
                            Update
                        </button>
                        {/* Add Delete Button */}
                        <button
                            className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                            onClick={() =>
                                handleDelete(info.row.original.category_id)
                            }
                        >
                            Delete
                        </button>
                    </div>
                ),
                header: () => <span>Actions</span>,
            }),
    ].filter(Boolean);

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) navigate("/admin/login");
    }, [navigate]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const categoriesData = await getCategories();
                const activeCategories = categoriesData.filter(
                    (category: any) => category.status === "active"
                );
                setCategories(activeCategories);
                setReload(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchCategories();
    }, [reload]);

    // Function to handle category deletion
    const handleDelete = (categoryId: number) => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonText: "Yes, delete it!",
            cancelButtonText: "Cancel",
        }).then(async (result) => {
            if (result.isConfirmed) {
                try {
                    // Make the PATCH request to update category status to inactive
                    await updateCategoryStatus(categoryId, "inactive"); // This function should send the PATCH request to the backend
                    setReload(true); // Reload categories after deletion
                    Swal.fire(
                        "Deleted!",
                        "The category has been deleted.",
                        "success"
                    );
                } catch (error) {
                    console.error("Error deleting category:", error);
                    Swal.fire(
                        "Error!",
                        "There was an issue deleting the category.",
                        "error"
                    );
                }
            }
        });
    };

    return (
        <section className="categories h-screen flex">
            <Sidebar />
            <main className="main__container h-full w-4/5 p-5 overflow-auto">
                <div className="main__header flex justify-between items-center">
                    <h1 className="main__title text-3xl uppercase">
                        Categories
                    </h1>
                    {localRole !== "owner" && (
                        <button
                            className="bg-amber-600 px-2.5 py-3 text-base text-white hover:bg-amber-700 transition"
                            onClick={() => setShowAddModal(true)}
                        >
                            Add Category
                        </button>
                    )}
                </div>
                <AddCategoryModal
                    showAddModal={showAddModal}
                    setShowAddModal={setShowAddModal}
                    setReload={setReload}
                />
                <hr className="border border-amber-600 my-3" />
                <div className="main__table__container">
                    <DataTable data={categories} columns={columns} />
                    <UpdateCategoryModal
                        showUpdateModal={showUpdateModal}
                        setShowUpdateModal={setShowUpdateModal}
                        setReload={setReload}
                        category={selectedCategory}
                    />
                </div>
            </main>
        </section>
    );
};

export default CategoriesPage;
