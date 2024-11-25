import { useState, useEffect } from "react";
import { updateCategory } from "../services/products.service";

interface Category {
    category_id: number;
    category_name: string;
}

interface UpdateCategoryModalProps {
    showUpdateModal: boolean;
    setShowUpdateModal: (show: boolean) => void;
    setReload: (reload: boolean) => void;
    category: Category | null; // Handle the case where category might be null
}

const UpdateCategoryModal = ({
    showUpdateModal,
    setShowUpdateModal,
    setReload,
    category,
}: UpdateCategoryModalProps) => {
    const [categoryName, setCategoryName] = useState(
        category?.category_name || ""
    ); // Default to empty string if category is null
    const [error, setError] = useState("");

    // Reset form fields function
    const resetForm = () => {
        if (category) {
            setCategoryName(category.category_name); // Reset to the passed category name
        }
        setError(""); // Reset error state
    };

    // Modal control logic
    useEffect(() => {
        if (category) {
            setCategoryName(category.category_name); // Set the category name when category is selected
        }
    }, [category]);

    useEffect(() => {
        // Control modal visibility based on showUpdateModal state
        const modal = document.getElementById(
            "update_category_modal"
        ) as HTMLDialogElement;

        if (modal) {
            if (showUpdateModal) {
                modal.showModal();
            } else {
                resetForm();
                modal.close();
            }
        }
    }, [showUpdateModal, category]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!categoryName) {
            setError("Category name is required.");
            return;
        }

        try {
            if (category) {
                await updateCategory(category.category_id, categoryName);
                setReload(true);
                setShowUpdateModal(false);
            }
        } catch (error) {
            console.error("Error updating category:", error);
            setError("Failed to update category. Please try again.");
        }
    };

    return (
        <dialog id="update_category_modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={() => setShowUpdateModal(false)}
                    >
                        ✕
                    </button>
                </form>
                <h3 className="font-bold text-lg">Update Category</h3>
                {error && <p className="text-red-500">{error}</p>}
                <form className="py-4 flex flex-col" onSubmit={handleSubmit}>
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Category Name</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Category Name"
                            className="input input-bordered w-full rounded-md"
                            value={categoryName}
                            onChange={(e) => setCategoryName(e.target.value)}
                            required
                        />
                    </label>
                    <button
                        type="submit"
                        className="bg-amber-600 px-4 py-2 text-base text-white hover:bg-amber-700 transition mt-4"
                    >
                        Update Category
                    </button>
                </form>
            </div>
        </dialog>
    );
};

export default UpdateCategoryModal;
