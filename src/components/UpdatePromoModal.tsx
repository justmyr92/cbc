import React, { useState, useEffect } from "react";

interface PromoBanner {
    promo_id: number;
    promo_image: string;
    promo_title: string;
    promo_description: string;
    active: boolean;
}

interface UpdatePromoModalProps {
    showUpdatePromoModal: boolean;
    setShowUpdatePromoModal: React.Dispatch<React.SetStateAction<boolean>>;
    selectedPromo: PromoBanner | null;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const UpdatePromoModal: React.FC<UpdatePromoModalProps> = ({
    showUpdatePromoModal,
    setShowUpdatePromoModal,
    selectedPromo,
    setReload,
}) => {
    const [promoDetails, setPromoDetails] = useState<PromoBanner | null>(null);
    const [imageFile, setImageFile] = useState<File | null>(null);

    useEffect(() => {
        if (selectedPromo) {
            setPromoDetails(selectedPromo);
        }
    }, [selectedPromo]);

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
    ) => {
        const { name, value } = e.target;
        if (promoDetails) {
            setPromoDetails({
                ...promoDetails,
                [name]: value,
            });
        }
    };

    useEffect(() => {
        console.log(promoDetails);
        console.log(imageFile);
    }, [promoDetails]);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setImageFile(e.target.files[0]);
        }
    };

    // const handleUpdatePromo = async () => {
    //     if (promoDetails) {
    //         try {
    //             const formData = new FormData();
    //             formData.append("promo_id", String(promoDetails.promo_id));
    //             formData.append("promo_title", promoDetails.promo_title);
    //             formData.append(
    //                 "promo_description",
    //                 promoDetails.promo_description
    //             );
    //             formData.append("active", String(promoDetails.active));

    //             // Only append the image if a new one has been selected
    //             if (imageFile) {
    //                 formData.append("image", imageFile);
    //             }

    //             const response = await fetch(
    //                 `http://localhost:5000/api/update-promo/${promoDetails.promo_id}`,
    //                 {
    //                     method: "PATCH",
    //                     body: formData,
    //                 }
    //             );

    //             if (response.ok) {
    //                 setShowUpdatePromoModal(false);
    //                 setReload((prev) => !prev);
    //             } else {
    //                 alert("Failed to update promo banner.");
    //             }
    //         } catch (error) {
    //             console.error("Error updating promo banner:", error);
    //         }
    //     }
    // };

    const handleUpdatePromo = async () => {
        if (promoDetails) {
            try {
                // Create FormData to append the file and other form data
                const formData = new FormData();
                formData.append("promoTitle", promoDetails.promo_title);
                formData.append(
                    "promoDescription",
                    promoDetails.promo_description
                );
                formData.append("active", String(promoDetails.active));

                // Only append the image if a new one has been selected
                if (imageFile) {
                    formData.append("promoImage", imageFile); // This is where we append the file
                }

                const response = await fetch(
                    `http://localhost:5000/api/update-promo/${promoDetails.promo_id}`,
                    {
                        method: "PATCH",
                        body: formData, // Use FormData instead of JSON
                    }
                );

                if (response.ok) {
                    setShowUpdatePromoModal(false);
                    setReload((prev) => !prev);
                } else {
                    const error = await response.json();
                    alert(`Failed to update promo banner: ${error.message}`);
                }
            } catch (error) {
                console.error("Error updating promo banner:", error);
            }
        }
    };

    const handleClose = () => {
        setShowUpdatePromoModal(false);
    };

    if (!showUpdatePromoModal || !promoDetails) return null;

    return (
        <div className={`modal ${showUpdatePromoModal ? "modal-open" : ""}`}>
            <div className="modal-box">
                <h2 className="font-bold text-lg mb-4">Update Promo Banner</h2>
                <form>
                    <div className="form-control mb-4">
                        <label htmlFor="image" className="label">
                            <span className="label-text">Upload Image</span>
                        </label>
                        <input
                            type="file"
                            id="image"
                            name="image"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="file-input file-input-bordered w-full"
                        />
                    </div>
                    <div className="form-control mb-4">
                        <label htmlFor="title" className="label">
                            <span className="label-text">Title</span>
                        </label>
                        <input
                            type="text"
                            id="title"
                            name="promo_title"
                            value={promoDetails.promo_title}
                            onChange={handleInputChange}
                            className="input input-bordered w-full"
                        />
                    </div>
                    <div className="form-control mb-4">
                        <label htmlFor="description" className="label">
                            <span className="label-text">Description</span>
                        </label>
                        <textarea
                            id="description"
                            name="promo_description"
                            value={promoDetails.promo_description}
                            onChange={handleInputChange}
                            className="textarea textarea-bordered w-full"
                        />
                    </div>
                    <div className="form-control mb-4">
                        <label
                            htmlFor="active"
                            className="label cursor-pointer"
                        >
                            <span className="label-text">Active</span>
                            <input
                                type="checkbox"
                                id="active"
                                name="active"
                                checked={promoDetails.active}
                                onChange={(e) =>
                                    setPromoDetails({
                                        ...promoDetails,
                                        active: e.target.checked,
                                    })
                                }
                                className="checkbox ml-2"
                            />
                        </label>
                    </div>
                    <div className="modal-action">
                        <button
                            type="button"
                            onClick={handleClose}
                            className="btn btn-ghost"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleUpdatePromo}
                            className="btn btn-primary"
                        >
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UpdatePromoModal;
