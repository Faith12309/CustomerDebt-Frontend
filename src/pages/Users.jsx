import { useEffect, useState } from "react";
import { Pencil, Trash2, Users as UsersIcon } from "lucide-react";
import { getUsers, deleteUser } from "../services/userService";

import EditUserModal from "../components/EditUserModal";
import DeleteUserModal from "../components/DeleteUserModal";

const Users = () => {

    const [users, setUsers] = useState([]);

    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const [selectedUser, setSelectedUser] = useState(null);

    const loadUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error(error);
        }
    };

    useEffect(() => {
        loadUsers();
    }, []);

    const handleDelete = async () => {
        if (!selectedUser) return;

        try {
            await deleteUser(selectedUser.id);
            alert("User deleted successfully!");
            setShowDeleteModal(false);
            loadUsers();
        } catch (error) {
            console.error(error);
            alert("Failed to delete user.");
        }
    };

    return (
        <div>

            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-gray-900">
                    Users
                </h1>
            </div>

            <div className="bg-white rounded-xl shadow-md border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">

                    <table className="w-full border-collapse">

                        <thead>
                            <tr className="bg-gray-50 border-b border-gray-200">
                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Username
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Role
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold uppercase tracking-wide text-gray-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>

                            {users.length > 0 ? (

                                users.map((u, index) => (
                                    <tr
                                        key={u.id}
                                        className={`hover:bg-blue-50/60 transition-colors ${index !== users.length - 1 ? "border-b border-gray-100" : ""}`}
                                    >
                                        <td className="px-6 py-4 font-medium text-gray-900">
                                            {u.username}
                                        </td>

                                        <td className="px-6 py-4">
                                            <span className="inline-block px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                                {u.role}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-2">

                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(u);
                                                        setShowEditModal(true);
                                                    }}
                                                    title="Edit user"
                                                    aria-label={`Edit ${u.username}`}
                                                    className="p-2 rounded-lg text-amber-600 hover:bg-amber-100 hover:text-amber-700 transition-colors"
                                                >
                                                    <Pencil size={16} />
                                                </button>

                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(u);
                                                        setShowDeleteModal(true);
                                                    }}
                                                    title="Delete user"
                                                    aria-label={`Delete ${u.username}`}
                                                    className="p-2 rounded-lg text-red-600 hover:bg-red-100 hover:text-red-700 transition-colors"
                                                >
                                                    <Trash2 size={16} />
                                                </button>

                                            </div>
                                        </td>

                                    </tr>
                                ))

                            ) : (

                                <tr>
                                    <td colSpan="3" className="px-6 py-16">
                                        <div className="flex flex-col items-center justify-center text-center">
                                            <div className="w-12 h-12 rounded-full bg-gray-100 flex items-center justify-center mb-3">
                                                <UsersIcon size={22} className="text-gray-400" />
                                            </div>
                                            <p className="text-gray-700 font-medium">
                                                No users found
                                            </p>
                                        </div>
                                    </td>
                                </tr>

                            )}

                        </tbody>

                    </table>

                </div>
            </div>

            <EditUserModal
                isOpen={showEditModal}
                onClose={() => setShowEditModal(false)}
                user={selectedUser}
                onSaved={loadUsers}
            />

            <DeleteUserModal
                isOpen={showDeleteModal}
                onClose={() => setShowDeleteModal(false)}
                user={selectedUser}
                onDelete={handleDelete}
            />

        </div>
    );
};

export default Users;