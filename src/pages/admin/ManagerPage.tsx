import { useEffect, useState } from "react";
import DataTable from "../../components/DataTable";
import Sidebar from "../../components/Sidebar";
import { createColumnHelper } from "@tanstack/react-table";
import { deleteManager, getManagers } from "../../services/users.service";
import { useNavigate } from "react-router-dom";
import { formatDate } from "../../utils/date.formatter";
import AddManagerModal from "../../components/AddManagerModal";
import UpdateManagerModal from "../../components/UpdateManager";
import Swal from "sweetalert2";

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

const ManagerPage = () => {
    const navigate = useNavigate();

    const [users, setUsers] = useState<User[]>([]);
    const [showAddModal, setShowAddModal] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState<User | null>(null);
    const [reload, setReload] = useState(false);
    const [searchQuery, setSearchQuery] = useState(""); // Search query state

    const handleDelete = async (userId: string) => {
        console.log("Deleting user:", userId); // Add this line
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
                await deleteManager(userId);
                Swal.fire(
                    "Deleted!",
                    "The manager has been deleted.",
                    "success"
                );
                setReload(true);
            } catch (error) {
                Swal.fire(
                    "Error",
                    "There was an error deleting the manager.",
                    "error"
                );
            }
        }
    };

    const localRole = localStorage.getItem("role");

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
            cell: (info) => <p>{info.renderValue()}</p>,
        }),
        columnHelper.accessor("created_at", {
            cell: (info) => <p>{info.renderValue()}</p>,
            header: () => <span>Created At</span>,
        }),
        columnHelper.accessor("email", {
            header: "Email",
            cell: (info) => <p>{info.renderValue()}</p>,
        }),
        localRole !== "manager" &&
            localRole !== "owner" &&
            columnHelper.display({
                id: "actions",
                cell: ({ row }) => (
                    <div className="flex space-x-2">
                        <button
                            onClick={() => handleEdit(row.original)} // Pass selected user to edit modal
                            className="btn btn-sm btn-primary"
                        >
                            Edit
                        </button>
                        <button
                            onClick={() => handleDelete(row.original.user_id)} // Call handleDelete with the user's ID
                            className="btn btn-sm btn-danger"
                        >
                            Delete
                        </button>
                    </div>
                ),
                header: "Actions",
            }),
    ].filter(Boolean); // Filter out any `false` values to avoid extra columns

    const handleEdit = (user: User) => {
        setSelectedUser(user); // Set the selected user
        setShowEditModal(true); // Show the edit modal
    };

    useEffect(() => {
        const token = localStorage.getItem("token");
        if (!token) {
            navigate("/admin/login");
        }
    }, [navigate]);

    useEffect(() => {
        const fetchManagers = async () => {
            try {
                const managers = await getManagers();
                console.log(managers);
                const transformedManagers = managers.map((manager: any) => ({
                    user_id: manager.user_id,
                    first_name: manager.first_name,
                    last_name: manager.last_name,
                    birth_date: formatDate(manager.birth_date),
                    created_at: formatDate(manager.created_at),
                    email: manager.email,
                }));

                setUsers(transformedManagers);
                setReload(false);
            } catch (error) {
                console.error(error);
            }
        };

        fetchManagers();
    }, [reload]);

    // Filter users based on search query
    const filteredUsers = users.filter(
        (user) =>
            user.first_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.last_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <section className="manager h-screen flex">
            <Sidebar />
            <main className="main__container h-full w-4/5 p-5 overflow-auto">
                <div className="main__header flex justify-between items-center">
                    <h1 className="main__title text-3xl uppercase">Managers</h1>
                    {localRole !== "manager" && localRole !== "owner" ? (
                        <button
                            className="bg-amber-600 px-2.5 py-3 text-base text-white hover:bg-amber-700 transition"
                            onClick={() => setShowAddModal(true)}
                        >
                            Add Manager
                        </button>
                    ) : (
                        ""
                    )}
                    <AddManagerModal
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
                {/* Pass selectedUser to the edit modal */}
                {selectedUser && (
                    <UpdateManagerModal
                        showEditModal={showEditModal}
                        setShowEditModal={setShowEditModal}
                        managerData={{
                            user_id: selectedUser.user_id,
                            firstName: selectedUser.first_name,
                            lastName: selectedUser.last_name,
                            birthDate: selectedUser.birth_date,
                            email: selectedUser.email,
                            password: "", // You can set an empty string or handle password if required
                        }}
                    />
                )}
            </main>
        </section>
    );
};

export default ManagerPage;
