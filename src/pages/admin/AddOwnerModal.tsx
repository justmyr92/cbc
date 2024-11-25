import { useState } from "react";

import Swal from "sweetalert2";
import { addOwner } from "../../services/users.service";

interface AddOwnerModalProps {
    showAddModal: boolean;
    setShowAddModal: React.Dispatch<React.SetStateAction<boolean>>;
    setReload: React.Dispatch<React.SetStateAction<boolean>>;
}

const AddOwnerModal = ({
    showAddModal,
    setShowAddModal,
    setReload,
}: AddOwnerModalProps) => {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [birthDate, setBirthDate] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await addOwner({ firstName, lastName, birthDate, email, password });
            Swal.fire("Success!", "Owner has been added.", "success");
            setReload(true);
            setShowAddModal(false); // Close modal after submission
        } catch (error) {
            Swal.fire("Error", "Failed to add owner.", "error");
        }
    };

    return (
        <div
            className={`modal ${showAddModal ? "modal-open" : ""}`}
            onClick={() => setShowAddModal(false)}
        >
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>
                <h2 className="text-xl font-bold mb-4">Add Owner</h2>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="First Name"
                        className="input input-bordered w-full mb-4"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        required
                    />
                    <input
                        type="text"
                        placeholder="Last Name"
                        className="input input-bordered w-full mb-4"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        required
                    />
                    <input
                        type="date"
                        placeholder="Birth Date"
                        className="input input-bordered w-full mb-4"
                        value={birthDate}
                        onChange={(e) => setBirthDate(e.target.value)}
                        required
                    />
                    <input
                        type="email"
                        placeholder="Email"
                        className="input input-bordered w-full mb-4"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <input
                        type="password"
                        placeholder="Password"
                        className="input input-bordered w-full mb-4"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <div className="flex justify-between">
                        <button
                            type="button"
                            className="btn btn-ghost"
                            onClick={() => setShowAddModal(false)}
                        >
                            Cancel
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Add Owner
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddOwnerModal;
