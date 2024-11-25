import { useState, useEffect } from "react";
import Swal from "sweetalert2";
import { addCategory } from "../services/products.service";

interface AddCategoryModalProps {
    showAddModal: boolean;
    setShowAddModal: (show: boolean) => void;
    setReload: (reload: boolean) => void;
}

const AddCategoryModal = ({
    showAddModal,
    setShowAddModal,
    setReload,
}: AddCategoryModalProps) => {
    const [categoryName, setCategoryName] = useState("");
    const [categoryImage, setCategoryImage] = useState<File | null>(null);
    const [error, setError] = useState("");

    // Reset form fields function
    const resetForm = () => {
        setCategoryName("");
        setCategoryImage(null);
        setError("");
    };

    // Modal control logic
    useEffect(() => {
        const modal = document.getElementById(
            "add_category_modal"
        ) as HTMLDialogElement;
        if (modal) {
            if (showAddModal) {
                modal.showModal();
            } else {
                resetForm();
                modal.close();
            }
        }
    }, [showAddModal]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) setCategoryImage(file);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!categoryName) {
            setError("Category name is required.");
            return;
        }

        if (!categoryImage) {
            setError("Category image is required.");
            return;
        }

        try {
            await addCategory(categoryName, categoryImage);
            setReload(true);
            setShowAddModal(false);

            // SweetAlert success notification
            Swal.fire({
                title: "Success!",
                text: "Category has been successfully added.",
                icon: "success",
            });
        } catch (error) {
            console.error("Error adding category:", error);

            // SweetAlert error notification
            Swal.fire({
                title: "Error!",
                text: "Failed to add category. Please try again.",
                icon: "error",
            });
        }
    };

    return (
        <dialog id="add_category_modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={() => setShowAddModal(false)}
                    >
                        ✕
                    </button>
                </form>
                <h3 className="font-bold text-lg">Add New Category</h3>
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
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Category Image</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="input input-bordered w-full rounded-md"
                            onChange={handleImageChange}
                            required
                        />
                    </label>
                    <button
                        type="submit"
                        className="bg-amber-600 px-4 py-2 text-base text-white hover:bg-amber-700 transition mt-4"
                    >
                        Add Category
                    </button>
                </form>
            </div>
        </dialog>
    );
};

export default AddCategoryModal;
