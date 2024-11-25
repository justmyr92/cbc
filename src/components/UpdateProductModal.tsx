import { useState, useEffect } from "react";
import { updateProduct } from "../services/products.service";

interface UpdateProductModalProps {
    showUpdateModal: boolean;
    setShowUpdateModal: React.Dispatch<React.SetStateAction<boolean>>;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
    categories: any[];
    selectedProduct: any;
}

const UpdateProductModal = ({
    showUpdateModal,
    setShowUpdateModal,
    setReload,
    categories,
    selectedProduct,
}: UpdateProductModalProps) => {
    const [productName, setProductName] = useState("");
    const [productPrice, setProductPrice] = useState(0);
    const [categoryId, setCategoryId] = useState<number | string>("");
    const [productImage, setProductImage] = useState<File | null>(null); // File for the new image
    const [imagePreview, setImagePreview] = useState<string | null>(null); // For displaying the preview

    useEffect(() => {
        if (selectedProduct) {
            setProductName(selectedProduct.product_name);
            setProductPrice(selectedProduct.product_price);
            setCategoryId(selectedProduct.category_id);
            setImagePreview(selectedProduct.product_image); // Set the current image as the initial preview
        }
    }, [selectedProduct]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] || null;
        setProductImage(file);

        // Generate a preview of the new image
        if (file) {
            const objectUrl = URL.createObjectURL(file);
            setImagePreview(objectUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedProduct?.product_id) {
            console.error("Product ID is missing");
            return;
        }

        const updatedProduct = {
            product_name: productName,
            product_price: productPrice,
            category_id: categoryId,
            product_image: productImage, // Ensure this is handled correctly
        };

        try {
            const result = await updateProduct(
                selectedProduct.product_id,
                updatedProduct
            );
            console.log("Product updated successfully:", result);
            setReload(true);
            setShowUpdateModal(false);
        } catch (error) {
            console.error("Error updating product:", error);
        }
    };

    return (
        showUpdateModal && (
            <div className="modal modal-open">
                <div className="modal-box p-6">
                    <h2 className="text-xl mb-4">Update Product</h2>
                    <form onSubmit={handleSubmit}>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">
                                Product Name
                            </label>
                            <input
                                type="text"
                                value={productName}
                                onChange={(e) => setProductName(e.target.value)}
                                required
                                className="input input-bordered w-full mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">
                                Product Price
                            </label>
                            <input
                                type="number"
                                value={productPrice}
                                onChange={(e) =>
                                    setProductPrice(+e.target.value)
                                }
                                required
                                className="input input-bordered w-full mt-1"
                            />
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">
                                Category
                            </label>
                            <select
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                                className="select select-bordered w-full mt-1"
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
                        </div>
                        <div className="mb-4">
                            <label className="block text-sm font-medium">
                                Product Image
                            </label>
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                className="input input-bordered w-full mt-1"
                            />
                            {imagePreview && (
                                <div className="mt-2">
                                    <img
                                        src={imagePreview}
                                        alt="Product Preview"
                                        className="w-full h-48 object-cover rounded-md"
                                    />
                                </div>
                            )}
                        </div>
                        <div className="modal-action flex justify-end gap-3">
                            <button
                                type="submit"
                                className="btn bg-amber-600 text-white px-6 py-2 rounded-md hover:bg-amber-700 transition-colors duration-200"
                            >
                                Update Product
                            </button>
                            <button
                                type="button"
                                className="btn bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors duration-200"
                                onClick={() => setShowUpdateModal(false)}
                            >
                                Cancel
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        )
    );
};

export default UpdateProductModal;
