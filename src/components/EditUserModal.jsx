import { useState, useEffect } from "react";
import { updateUser } from "../services/userService";

const EditUserModal = ({ isOpen, onClose, user, onSaved }) => {

    const [form, setForm] = useState({
        username: "",
        role: "",
        password: ""
    });

    useEffect(() => {
        if (user) {
            setForm({
                username: user.username,
                role: user.role,
                password: ""
            });
        }
    }, [user]);

    const handleSave = async () => {
        try {

            await updateUser(user.id, {
                username: form.username,
                role: form.role,
                password: form.password
            });

            alert("User updated successfully!");

            onClose();

            if (onSaved) onSaved();

        } catch (error) {

            console.error(error);

            alert("Failed to update user.");

        }
    };

    if (!isOpen || !user) return null;

    return (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white w-[500px] rounded-xl p-6 shadow-lg">

                <h2 className="text-2xl font-bold mb-5">
                    Edit User
                </h2>

                <div className="space-y-4">

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Username
                        </label>
                        <input
                            type="text"
                            value={form.username}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    username: e.target.value
                                })
                            }
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Role
                        </label>
                        <select
                            value={form.role}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    role: e.target.value
                                })
                            }
                            className="w-full border rounded-lg p-2"
                        >
                            <option value="Admin">Admin</option>
                            <option value="Staff">Staff</option>
                        </select>
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            New Password <span className="text-gray-400 text-xs">(leave blank to keep current)</span>
                        </label>
                        <input
                            type="password"
                            value={form.password}
                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    password: e.target.value
                                })
                            }
                            className="w-full border rounded-lg p-2"
                        />
                    </div>

                </div>

                <div className="flex justify-end gap-3 mt-6">

                    <button
                        onClick={onClose}
                        className="border px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </button>

                    <button
                        onClick={handleSave}
                        className="bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg"
                    >
                        Save Changes
                    </button>

                </div>

            </div>

        </div>
    );
};

export default EditUserModal;