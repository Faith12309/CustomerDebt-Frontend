import { useState } from "react";
import { X, UserPlus } from "lucide-react";
import { createUser } from "../services/userService";

const AddUserModal = ({ isOpen, onClose, onSaved }) => {
    const [form, setForm] = useState({
        username: "",
        password: "",
        role: "Staff",
    });

    if (!isOpen) return null;

    const handleSave = async () => {
        if (!form.username.trim() || !form.password.trim()) {
            alert("Username and password are required.");
            return;
        }

        try {
            await createUser({
                username: form.username.trim(),
                password: form.password.trim(),
                role: form.role,
            });

            alert("User created successfully!");
            setForm({ username: "", password: "", role: "Staff" });
            onClose();
            if (onSaved) onSaved();
        } catch (error) {
            console.error(error);
            const msg =
                error.response?.data || "Failed to create user.";
            alert(typeof msg === "string" ? msg : "Failed to create user.");
        }
    };

    const inputClass =
        "w-full rounded-lg border border-gray-200 px-4 py-2.5 text-gray-800 placeholder-gray-400 focus:border-blue-500 focus:outline-none focus:ring-4 focus:ring-blue-500/10 transition";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-gray-900/60 backdrop-blur-sm">
            <div className="relative w-full max-w-md overflow-hidden rounded-2xl bg-white shadow-2xl border border-gray-100">
                <div className="flex items-center justify-between border-b border-gray-100 px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-lg bg-blue-50 flex items-center justify-center">
                            <UserPlus size={16} className="text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-gray-900">
                                Add account
                            </h2>
                            <p className="text-sm text-gray-500">
                                Create a new Admin or Staff account.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-full p-2 text-gray-400 hover:bg-gray-100"
                    >
                        <X size={20} />
                    </button>
                </div>

                <div className="px-6 py-6 space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Username <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="text"
                            className={inputClass}
                            placeholder="e.g. juan"
                            value={form.username}
                            onChange={(e) =>
                                setForm({ ...form, username: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            className={inputClass}
                            placeholder="Enter password"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">
                            Role
                        </label>
                        <select
                            className={inputClass}
                            value={form.role}
                            onChange={(e) =>
                                setForm({ ...form, role: e.target.value })
                            }
                        >
                            <option value="Admin">Admin</option>
                            <option value="Staff">Staff</option>
                        </select>
                    </div>
                </div>

                <div className="flex justify-end gap-3 px-6 py-5 border-t border-gray-100 bg-gray-50/50">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-lg border border-gray-200 text-gray-600 hover:bg-gray-100 font-medium text-sm"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm"
                    >
                        Create account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;