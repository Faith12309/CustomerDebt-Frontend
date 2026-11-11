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

            // Better error extraction
            let msg = "Failed to create user.";

            if (error.response?.data) {
                const data = error.response.data;

                if (typeof data === "string") {
                    msg = data;
                } else if (data.title) {
                    msg = data.title;
                } else if (data.message) {
                    msg = data.message;
                } else if (typeof data === "object") {
                    const values = Object.values(data);
                    if (values.length > 0 && Array.isArray(values[0])) {
                        msg = values[0][0];
                    }
                }
            }

            alert(msg);
        }
    };

    const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";
    const inputClass =
        "w-full h-10 rounded-control border border-surface-line bg-white px-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10";

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink-950/50 backdrop-blur-[2px]">
            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="add-user-title"
                className="relative w-full max-w-md overflow-hidden rounded-card bg-white shadow-pop border border-surface-line"
            >
                <div className="flex items-center justify-between border-b border-surface-line px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-control bg-brand-50 flex items-center justify-center shrink-0">
                            <UserPlus size={18} className="text-brand-600" />
                        </div>
                        <div>
                            <h2
                                id="add-user-title"
                                className="text-lg font-bold tracking-tight text-slate-900"
                            >
                                Add account
                            </h2>
                            <p className="text-sm text-slate-500">
                                Create a new Admin or Staff account.
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={onClose}
                        aria-label="Close modal"
                        className="p-1.5 -mr-1.5 rounded-control text-slate-400 hover:bg-surface-muted hover:text-slate-700 transition-colors"
                    >
                        <X size={18} />
                    </button>
                </div>

                <div className="px-6 py-6 space-y-4">
                    <div>
                        <label className={labelCls}>
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
                        <label className={labelCls}>
                            Password <span className="text-red-500">*</span>
                        </label>
                        <input
                            type="password"
                            className={inputClass}
                            placeholder="Min 8 chars, uppercase, number, special"
                            value={form.password}
                            onChange={(e) =>
                                setForm({ ...form, password: e.target.value })
                            }
                        />
                    </div>

                    <div>
                        <label className={labelCls}>Role</label>
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

                <div className="flex justify-end gap-3 px-6 py-5 border-t border-surface-line bg-surface-muted/50">
                    <button
                        onClick={onClose}
                        className="px-5 py-2.5 rounded-control border border-surface-line bg-white text-slate-700 hover:bg-surface-muted font-medium text-sm transition-colors"
                    >
                        Cancel
                    </button>
                    <button
                        onClick={handleSave}
                        className="px-6 py-2.5 rounded-control bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm transition-colors"
                    >
                        Create account
                    </button>
                </div>
            </div>
        </div>
    );
};

export default AddUserModal;