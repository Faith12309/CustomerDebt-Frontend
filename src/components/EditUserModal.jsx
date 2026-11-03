import { useState, useEffect } from "react";
import { X, UserCog } from "lucide-react";
import { updateUser } from "../services/userService";

const labelCls = "block text-sm font-medium text-slate-700 mb-1.5";
const fieldCls =
    "w-full h-10 rounded-control border border-surface-line bg-white px-3 text-sm text-slate-800 placeholder-slate-400 outline-none transition focus:border-brand-600 focus:ring-4 focus:ring-brand-600/10";

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
        <div className="fixed inset-0 bg-ink-950/50 backdrop-blur-[2px] flex items-center justify-center p-4 z-50">

            <div
                role="dialog"
                aria-modal="true"
                aria-labelledby="edit-user-title"
                className="bg-white w-full max-w-md rounded-card shadow-pop border border-surface-line overflow-hidden"
            >

                <div className="flex items-center justify-between border-b border-surface-line px-6 py-5">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-control bg-brand-50 flex items-center justify-center shrink-0">
                            <UserCog size={18} className="text-brand-600" />
                        </div>
                        <div>
                            <h2
                                id="edit-user-title"
                                className="text-lg font-bold tracking-tight text-slate-900"
                            >
                                Edit user
                            </h2>
                            <p className="text-sm text-slate-500">
                                Update this account's details.
                            </p>
                        </div>
                    </div>
                    <button
                        type="button"
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
                            className={fieldCls}
                        />
                    </div>

                    <div>
                        <label className={labelCls}>
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
                            className={fieldCls}
                        >
                            <option value="Admin">Admin</option>
                            <option value="Staff">Staff</option>
                        </select>
                    </div>

                    <div>
                        <label className={labelCls}>
                            New password <span className="text-slate-400 text-xs font-normal">(leave blank to keep current)</span>
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
                            className={fieldCls}
                        />
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
                        Save changes
                    </button>

                </div>

            </div>

        </div>
    );
};

export default EditUserModal;