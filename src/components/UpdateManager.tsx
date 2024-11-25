import { useEffect, useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import { updateManager } from "../services/users.service";

interface EditManagerModalProps {
    showEditModal: boolean;
    setShowEditModal: (show: boolean) => void;
    managerData: {
        user_id: string;
        firstName: string;
        lastName: string;
        birthDate: string;
        email: string;
        password: string;
    };
}

const UpdateManagerModal = ({
    showEditModal,
    setShowEditModal,
    managerData,
}: EditManagerModalProps) => {
    const [firstName, setFirstName] = useState(managerData.firstName);
    const [lastName, setLastName] = useState(managerData.lastName);
    const [birthDate, setBirthDate] = useState(managerData.birthDate);
    const [email, setEmail] = useState(managerData.email);
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const resetForm = () => {
        setFirstName(managerData.firstName);
        setLastName(managerData.lastName);
        setBirthDate(managerData.birthDate);
        setEmail(managerData.email);
        setPassword("");
    };

    useEffect(() => {
        const modal = document.getElementById(
            "edit_manager_modal"
        ) as HTMLDialogElement;
        if (modal) {
            if (showEditModal) {
                modal.showModal();
            } else {
                resetForm();
                modal.close();
            }
        }
    }, [showEditModal]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const updatedManager = {
            firstName,
            lastName,
            birthDate,
            email,
            ...(password && { password }), // Include password only if modified
        };

        try {
            const result = await updateManager(
                managerData.user_id,
                updatedManager
            );
            console.log("Updated Manager:", result);
            setShowEditModal(false);
        } catch (error) {
            console.error("Failed to update manager:", error);
        }
    };

    const generatePassword = () => {
        const characters =
            "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*";
        let newPassword = "";
        for (let i = 0; i < 12; i++) {
            newPassword += characters.charAt(
                Math.floor(Math.random() * characters.length)
            );
        }
        setPassword(newPassword);
    };

    return (
        <dialog id="edit_manager_modal" className="modal">
            <div className="modal-box">
                <form method="dialog">
                    <button
                        type="button"
                        className="btn btn-sm btn-circle btn-ghost absolute right-2 top-2"
                        onClick={() => setShowEditModal(false)}
                    >
                        ✕
                    </button>
                </form>
                <h3 className="font-bold text-lg">Edit Manager</h3>
                <form className="py-4 flex flex-col" onSubmit={handleSubmit}>
                    {/* First Name Field */}
                    <label className="form-control w-full mb-2">
                        <span className="label-text">First Name</span>
                        <input
                            type="text"
                            placeholder="First Name"
                            className="input input-bordered w-full rounded-md"
                            value={firstName}
                            onChange={(e) => setFirstName(e.target.value)}
                        />
                    </label>

                    {/* Last Name Field */}
                    <label className="form-control w-full mb-2">
                        <span className="label-text">Last Name</span>
                        <input
                            type="text"
                            placeholder="Last Name"
                            className="input input-bordered w-full rounded-md"
                            value={lastName}
                            onChange={(e) => setLastName(e.target.value)}
                        />
                    </label>

                    {/* Birth Date Field */}
                    <label className="form-control w-full mb-2">
                        <span className="label-text">Birth Date</span>
                        <input
                            type="date"
                            className="input input-bordered w-full rounded-md"
                            value={birthDate}
                            onChange={(e) => setBirthDate(e.target.value)}
                        />
                    </label>

                    {/* Email Field */}
                    <label className="form-control w-full mb-2">
                        <span className="label-text">Email</span>
                        <input
                            type="email"
                            placeholder="Email"
                            className="input input-bordered w-full rounded-md"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </label>

                    {/* Password Field */}
                    <label className="form-control w-full mb-2">
                        <span className="label-text">Password</span>
                        <div className="flex gap-2 items-center">
                            <input
                                type={showPassword ? "text" : "password"}
                                placeholder="Password"
                                className="input input-bordered w-full rounded-md"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                            <button
                                type="button"
                                onClick={generatePassword}
                                className="btn btn-secondary"
                            >
                                Generate
                            </button>
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="btn btn-outline"
                            >
                                <FontAwesomeIcon
                                    icon={showPassword ? faEyeSlash : faEye}
                                />
                            </button>
                        </div>
                    </label>

                    <div className="modal-action">
                        <button
                            type="button"
                            onClick={() => setShowEditModal(false)}
                            className="btn"
                        >
                            Close
                        </button>
                        <button type="submit" className="btn btn-primary">
                            Update
                        </button>
                    </div>
                </form>
            </div>
        </dialog>
    );
};

export default UpdateManagerModal;
