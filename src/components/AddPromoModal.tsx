import { useState, useEffect } from "react";

interface AddPromoModalProps {
    showAddPromoModal: boolean;
    setShowAddPromoModal: (show: boolean) => void;
    setReload: (reload: boolean) => void;
}

const AddPromoModal = ({
    showAddPromoModal,
    setShowAddPromoModal,
    setReload,
}: AddPromoModalProps) => {
    const [promoTitle, setPromoTitle] = useState("");
    const [promoDescription, setPromoDescription] = useState("");
    const [promoImage, setPromoImage] = useState<File | null>(null);
    const [imagePreview, setImagePreview] = useState<string | null>(null);

    // Function to reset form fields
    const resetForm = () => {
        setPromoTitle("");
        setPromoDescription("");
        setPromoImage(null);
        setImagePreview(null);
    };

    useEffect(() => {
        const modal = document.getElementById(
            "add_promo_modal"
        ) as HTMLDialogElement;
        if (modal) {
            if (showAddPromoModal) {
                modal.showModal();
            } else {
                resetForm(); // Reset fields before closing
                modal.close();
            }
        }
    }, [showAddPromoModal]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            setPromoImage(file);
            const previewUrl = URL.createObjectURL(file);
            setImagePreview(previewUrl);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (promoImage) {
            const formData = new FormData();
            formData.append("promoTitle", promoTitle);
            formData.append("promoDescription", promoDescription);
            formData.append("promoImage", promoImage);

            try {
                // Make a POST request to the backend to upload the promo
                const response = await fetch(
                    "https://kape-backend.onrender.com/api/upload-promo",
                    {
                        method: "POST",
                        headers: {
                            jwt_token: localStorage.getItem("token") || "", // Token for authentication
                        },

                        body: formData, // FormData will automatically handle Content-Type
                    }
                );

                if (response.ok) {
                    console.log("Promotion uploaded successfully:", response);
                    setReload(true); // Trigger a reload to refresh the promo list
                    setShowAddPromoModal(false); // Close the modal
                } else {
                    console.error(
                        "Error uploading promotion:",
                        response.statusText
                    );
                }
            } catch (error) {
                console.error("Error uploading promotion:", error);
            }
        } else {
            console.error("No image selected");
        }
    };

    return (
        <dialog id="add_promo_modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={() => setShowAddPromoModal(false)}
                    >
                        ✕
                    </button>
                </form>
                <h3 className="font-bold text-lg">Add New Promotion</h3>
                <form className="py-4 flex flex-col" onSubmit={handleSubmit}>
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Promotion Title</span>
                        </div>
                        <input
                            type="text"
                            placeholder="Promotion Title"
                            className="input input-bordered w-full rounded-md"
                            value={promoTitle}
                            onChange={(e) => setPromoTitle(e.target.value)}
                        />
                    </label>
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">
                                Promotion Description
                            </span>
                        </div>
                        <textarea
                            placeholder="Description"
                            className="input input-bordered w-full rounded-md"
                            value={promoDescription}
                            onChange={(e) =>
                                setPromoDescription(e.target.value)
                            }
                        />
                    </label>
                    <label className="form-control w-full mb-2">
                        <div className="label">
                            <span className="label-text">Upload Image</span>
                        </div>
                        <input
                            type="file"
                            accept="image/*"
                            className="input input-bordered w-full rounded-md"
                            onChange={handleImageChange}
                        />
                    </label>

                    {imagePreview && (
                        <div className="mt-4 flex justify-center">
                            <img
                                src={imagePreview}
                                alt="Image Preview"
                                className="w-48 h-48 object-cover rounded-md border"
                            />
                        </div>
                    )}

                    <button
                        type="submit"
                        className="bg-amber-600 px-4 py-2 text-base text-white hover:bg-amber-700 transition mt-4"
                    >
                        Add Promotion
                    </button>
                </form>
            </div>
        </dialog>
    );
};

export default AddPromoModal;
