import { useEffect, useState } from "react";
import { Pencil, Trash2, Users as UsersIcon, Plus } from "lucide-react";
import { getUsers, deleteUser } from "../services/userService";
import EditUserModal from "../components/EditUserModal";
import DeleteUserModal from "../components/DeleteUserModal";
import AddUserModal from "../components/AddUserModal";

const Users = () => {
    const [users, setUsers] = useState([]);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [showAddModal, setShowAddModal] = useState(false);
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
            <div className="flex flex-wrap justify-between items-center gap-4 mb-6">
                <div>
                    <h1 className="text-[28px] leading-9 font-bold tracking-tight text-slate-900">
                        User accounts
                    </h1>
                    <p className="text-sm text-slate-500 mt-1">
                        {users.length} {users.length === 1 ? "account" : "accounts"}
                    </p>
                </div>

                <button
                    onClick={() => setShowAddModal(true)}
                    className="flex items-center gap-1.5 bg-brand-600 hover:bg-brand-700 text-white px-4 py-2.5 rounded-control text-sm font-semibold transition-colors"
                >
                    <Plus size={16} />
                    Add account
                </button>
            </div>

            <div className="bg-white rounded-card shadow-card border border-surface-line overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                        <thead>
                            <tr className="bg-surface-muted/60 border-b border-surface-line">
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                                    Username
                                </th>
                                <th className="text-left px-6 py-3 text-xs font-semibold text-slate-500">
                                    Role
                                </th>
                                <th className="text-center px-6 py-3 text-xs font-semibold text-slate-500">
                                    Actions
                                </th>
                            </tr>
                        </thead>

                        <tbody>
                            {users.length > 0 ? (
                                users.map((u, index) => (
                                    <tr
                                        key={u.id}
                                        className={`hover:bg-surface-muted/70 transition-colors ${index !== users.length - 1
                                            ? "border-b border-surface-line"
                                            : ""
                                            }`}
                                    >
                                        <td className="px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-brand-100 text-brand-700 flex items-center justify-center text-xs font-bold shrink-0">
                                                    {u.username
                                                        ? u.username.slice(0, 2).toUpperCase()
                                                        : "?"}
                                                </div>
                                                <span className="font-semibold text-slate-900">
                                                    {u.username}
                                                </span>
                                            </div>
                                        </td>

                                        <td className="px-6 py-4">
                                            <span
                                                className={`inline-block px-2.5 py-1 rounded-full text-xs font-semibold ${u.role === "Admin"
                                                    ? "bg-brand-50 text-brand-700"
                                                    : "bg-slate-100 text-slate-600"
                                                    }`}
                                            >
                                                {u.role}
                                            </span>
                                        </td>

                                        <td className="px-6 py-4">
                                            <div className="flex justify-center gap-1">
                                                <button
                                                    onClick={() => {
                                                        setSelectedUser(u);
                                                        setShowEditModal(true);
                                                    }}
                                                    title="Edit user"
                                                    aria-label={`Edit ${u.username}`}
                                                    className="p-2 rounded-control text-slate-400 hover:bg-brand-50 hover:text-brand-600 transition-colors"
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
                                                    className="p-2 rounded-control text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
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
                                            <div className="w-12 h-12 rounded-full bg-brand-50 flex items-center justify-center mb-3">
                                                <UsersIcon
                                                    size={22}
                                                    className="text-brand-600"
                                                />
                                            </div>
                                            <p className="text-slate-800 font-semibold">
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

            <AddUserModal
                isOpen={showAddModal}
                onClose={() => setShowAddModal(false)}
                onSaved={loadUsers}
            />

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