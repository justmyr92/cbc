import { useEffect, useState } from "react";
import { updateOwner } from "../../services/users.service";

interface UpdateOwnerModalProps {
    showUpdateModal: boolean;
    setShowUpdateModal: (show: boolean) => void;
    setReload: (reload: boolean) => void;
    selectedOwner: {
        owner_id: string;
        firstName: string;
        lastName: string;
        birthDate: string;
        email: string;
        store_id: string;
    } | null;
}
const UpdateOwnerModal = ({
    showUpdateModal, // Ensure prop name is showUpdateModal
    setShowUpdateModal, // Ensure prop name is setShowUpdateModal
    setReload,
    selectedOwner,
}: UpdateOwnerModalProps) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [email, setEmail] = useState("");
    const [storeId, setStoreId] = useState("");

    useEffect(() => {
        if (selectedOwner) {
            setFirstName(selectedOwner.firstName);
            setLastName(selectedOwner.lastName);
            setBirthDate(selectedOwner.birthDate);
            setEmail(selectedOwner.email);
            setStoreId(selectedOwner.store_id);
        }
    }, [selectedOwner]);

    const resetForm = () => {
        setFirstName("");
        setLastName("");
        setBirthDate("");
        setEmail("");
        setStoreId("");
    };

    useEffect(() => {
        const modal = document.getElementById(
            "update_owner_modal"
        ) as HTMLDialogElement;
        if (modal) {
            if (showUpdateModal) {
                modal.showModal();
            } else {
                resetForm();
                modal.close();
            }
        }
    }, [showUpdateModal]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!selectedOwner) return;

        const updatedData = {
            firstName,
            lastName,
            birthDate,
            email,
            store_id: storeId,
        };

        try {
            await updateOwner(selectedOwner.owner_id, updatedData);
            setReload(true);
            setShowUpdateModal(false);
        } catch (error) {
            console.error("Error updating owner:", error);
        }
    };

    return (
        <dialog id="update_owner_modal" className="modal">
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
                <h3 className="font-bold text-lg">Update Owner</h3>
                <form className="py-4 flex flex-col" onSubmit={handleSubmit}>
                    <label className="label">First Name</label>
                    <input
                        type="text"
                        className="input input-bordered"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <label className="label">Last Name</label>
                    <input
                        type="text"
                        className="input input-bordered"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <label className="label">Birth Date</label>
                    <input
                        type="date"
                        className="input input-bordered"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                    />
                    <label className="label">Email</label>
                    <input
                        type="email"
                        className="input input-bordered"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />

                    <button
                        type="submit"
                        className="bg-blue-600 px-4 py-2 text-base text-white hover:bg-blue-700 transition mt-4"
                    >
                        Update Owner
                    </button>
                </form>
            </div>
        </dialog>
    );
};

export default UpdateOwnerModal;
