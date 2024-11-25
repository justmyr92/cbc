import { useState, useEffect } from "react";
import { addProduct } from "../services/products.service";

interface AddProductModalProps {
    showAddModal: boolean;
    setShowAddModal: (show: boolean) => void;
    setReload: (reload: boolean) => void;
    categories: { category_id: number; category_name: string }[];
}

const AddProductModal = ({
    showAddModal,
    setShowAddModal,
    setReload,
    categories,
}: AddProductModalProps) => {
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState("");
    const [productImage, setProductImage] = useState<File | null>(null); // Changed to File type
    const [imagePreview, setImagePreview] = useState<string | null>(null); // For image preview
    const [selectedCategory, setSelectedCategory] = useState<number | "others">(
        1
    ); // Default category ID set to 1
    const [categoryName, setCategoryName] = useState("");
    const [productType, setProductType] = useState("");

    // Reset form fields function
    const resetForm = () => {
        setProductName("");
        setProductPrice("");
        setProductImage(null); // Reset file input
        setImagePreview(null); // Reset image preview
        setSelectedCategory(1); // Reset category to default
        setCategoryName(""); // Reset custom category name
        setProductType("");
    };

    useEffect(() => {
        const modal = document.getElementById(
            "add_product_modal"
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

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        let categoryId = selectedCategory;

        if (!productImage) {
            console.error("Product image is required.");
            return;
        }

        const formData = new FormData();
        formData.append("product_name", productName);
        formData.append("product_price", productPrice);
        formData.append("category_id", String(categoryId));
        formData.append("product_image", productImage);
        formData.append("product_type", productType);

        try {
            const response = await addProduct(formData); // Adjusted for FormData
            if (response) {
                setReload(true);
                setShowAddModal(false);
            }
        } catch (error) {
            console.error("Error adding product:", error);
        }
    };

    // Handle file input change and set image preview
    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setProductImage(file);
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
        }
    };

    return (
        <dialog id="add_product_modal" className="modal">
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
                <h3 className="font-bold text-lg">Add New Product</h3>
                <form className="py-4 flex flex-col" onSubmit={handleSubmit}>
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Product Name</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Product Name"
                            className="input input-bordered w-full rounded-md"
                            value={productName}
                            onChange={(e) => setProductName(e.target.value)}
                        />
                    </label>
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Product Price</span>
                        </div>
                        <input
                            type="number"
                            placeholder="Product Price"
                            className="input input-bordered w-full rounded-md"
                            value={productPrice}
                            onChange={(e) => setProductPrice(e.target.value)}
                        />
                    </label>
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Product Image</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*" // Restrict file types to images
                            className="input input-bordered w-full rounded-md"
                            onChange={handleImageChange}
                        />
                        {imagePreview && (
                            <div className="mt-2">
                                <img
                                    src={imagePreview}
                                    alt="Image preview"
                                    className="w-full h-48 object-cover rounded-md"
                                />
                            </div>
                        )}
                    </label>
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Type</span>
                        </div>
                        <select
                            className="input input-bordered w-full rounded-md"
                            value={productType}
                            onChange={(e) => setProductType(e.target.value)}
                        >
                            <option value="meal" selected>
                                Meal
                            </option>
                            <option value="drinks">Drinks</option>
                        </select>
                    </label>
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Category</span>
                        </div>
                        <select
                            className="input input-bordered w-full rounded-md"
                            value={selectedCategory}
                            onChange={(e) =>
                                setSelectedCategory(
                                    e.target.value === "others"
                                        ? "others"
                                        : parseInt(e.target.value)
                                )
                            }
                        >
                            {categories.map((category) => (
                                <option
                                    key={category.category_id}
                                    value={category.category_id}
                                >
                                    {category.category_name}
                                </option>
                            ))}
                        </select>
                    </label>
                    {selectedCategory === "others" && (
                        <label className="form-control w-full mb-2">
                            <div className="label">
                                <span className="label-text">
                                    Please specify category
                                </span>
                            </div>
                            <input
                                type="text"
                                placeholder="Specify Category"
                                className="input input-bordered w-full rounded-md"
                                value={categoryName}
                                required
                                onChange={(e) =>
                                    setCategoryName(e.target.value)
                                }
                            />
                        </label>
                    )}
                    <button
                        type="submit"
                        className="bg-amber-600 px-4 py-2 text-base text-white hover:bg-amber-700 transition mt-4"
                    >
                        Add Product
                    </button>
                </form>
            </div>
        </dialog>
    );
};

export default AddProductModal;
