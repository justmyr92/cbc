import { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import Sidebar from "../../components/Sidebar";
import { createColumnHelper } from "@tanstack/react-table";
import { deleteOwner, getOwners } from "../../services/users.service"; // Update service functions
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date.formatter";
import AddOwnerModal from "./AddOwnerModal";
import Swal from "sweetalert2";
import UpdateOwnerModal from "./UpdateOwnerModal";

// Define the User interface
interface User {
    user_id: string;
    first_name: string;
    last_name: string;
    birth_date: string;
    created_at: string;
    email: string;
}

const columnHelper = createColumnHelper<User>();

const OwnerPage = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [reload, setReload] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // Search query state

    const handleDelete = async (userId: string) => {
        const result = await Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this!",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#d33",
            cancelButtonColor: "#3085d6",
            confirmButtonText: "Yes, delete it!",
        });

        if (result.isConfirmed) {
            try {
                await deleteOwner(userId); // Use deleteOwner API
                Swal.fire("Deleted!", "The owner has been deleted.", "success");
                setReload(true);
            } catch (error) {
                Swal.fire(
                    "Error",
                    "There was an error deleting the owner.",
                    "error"
                );
            }
        }
    };

    const columns = [
        columnHelper.accessor("first_name", {
            cell: (info) => <p>{info.getValue()}</p>,
            header: () => <span>First Name</span>,
        }),
        columnHelper.accessor("last_name", {
            cell: (info) => <p>{info.getValue()}</p>,
            header: () => <span>Last Name</span>,
        }),
        columnHelper.accessor("birth_date", {
            header: () => "Birth Date",
            cell: (info) => <p>{formatDate(info.getValue())}</p>,
        }),
        columnHelper.accessor("created_at", {
            cell: (info) => <p>{formatDate(info.getValue())}</p>,
            header: () => <span>Created At</span>,
        }),
        columnHelper.accessor("email", {
            header: "Email",
            cell: (info) => <p>{info.getValue()}</p>,
        }),
        columnHelper.display({
            id: "actions",
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <button
                        onClick={() => handleEdit(row.original)}
                        className="btn btn-sm btn-primary"
                    >
                        Edit
                    </button>
                    <button
                        onClick={() => handleDelete(row.original.user_id)}
                        className="btn btn-sm btn-danger"
                    >
                        Delete
                    </button>
                </div>
            ),
            header: "Actions",
        }),
    ];

    const handleEdit = (user: User) => {
        setSelectedUser(user);
        setShowEditModal(true);
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/admin/login");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchOwners = async () => {
            try {
                const owners = await getOwners(); // Use getOwners API
                const transformedOwners = owners.map((owner: any) => ({
                    user_id: owner.user_id,
                    first_name: owner.first_name,
                    last_name: owner.last_name,
                    birth_date: formatDate(owner.birth_date),
                    created_at: formatDate(owner.created_at),
                    email: owner.email,
                }));

                setUsers(transformedOwners);
                setReload(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchOwners();
    }, [reload]);

    // Filter users based on search query
    const filteredUsers = users.filter(
        (user) =>
            user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="owner h-screen flex">
            <Sidebar />
            <main className="main__container h-full w-4/5 p-5 overflow-auto">
                <div className="main__header flex justify-between items-center">
                    <h1 className="main__title text-3xl uppercase">Owners</h1>
                    <button
                        className="bg-amber-600 px-2.5 py-3 text-base text-white hover:bg-amber-700 transition"
                        onClick={() => setShowAddModal(true)}
                    >
                        Add Owner
                    </button>
                    <AddOwnerModal
                        showAddModal={showAddModal}
                        setShowAddModal={setShowAddModal}
                        setReload={setReload}
                    />
                </div>
                <div className="my-3">
                    <input
                        type="text"
                        placeholder="Search by name or email"
                        className="input input-bordered w-full max-w-xs"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>
                <hr className="border border-amber-600 my-3" />
                <div className="main__table__container">
                    <DataTable data={filteredUsers} columns={columns} />
                </div>
                {selectedUser ? (
                    <UpdateOwnerModal
                        showUpdateModal={showEditModal} // Change prop name to showUpdateModal
                        setShowUpdateModal={setShowEditModal} // Change prop name to setShowUpdateModal
                        selectedOwner={{
                            owner_id: selectedUser.user_id,
                            firstName: selectedUser.first_name,
                            lastName: selectedUser.last_name,
                            birthDate: selectedUser.birth_date,
                            email: selectedUser.email,
                            store_id: "", // Assuming store_id is optional or handled differently
                        }}
                        setReload={setReload} // Pass the setReload function as well
                    />
                ) : (
                    ""
                )}
            </main>
        </section>
    );
};

export default OwnerPage;
